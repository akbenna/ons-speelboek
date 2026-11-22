-- =====================================================================
-- Ons Speelboek — databaseschema (fase 1 t/m 3)
-- Plakken in Supabase: SQL Editor → New query → plakken → Run.
--
-- Uitgangspunten:
--  * Alleen trainers en assistenten loggen in (e-maillink).
--  * Team en spelers kijken mee via links; zij hebben GEEN directe
--    toegang tot de tabellen, alleen via de functies onderaan.
--  * Spelerslinks worden alleen als hash opgeslagen.
--  * Minimale gegevens: bijnaam, rugnummer, positie. Geen achternaam,
--    geboortedatum of foto.
-- =====================================================================

create extension if not exists pgcrypto with schema extensions;

-- ---------- Tabellen ----------

create table public.teams (
  id          uuid primary key default gen_random_uuid(),
  name        text not null check (char_length(name) between 1 and 60),
  club        text check (char_length(club) <= 60),
  season      text check (char_length(season) <= 20),
  colors      jsonb not null default '{"primary":"#db1e3b","secondary":"#181519"}',
  share_token text not null unique default encode(extensions.gen_random_bytes(12), 'hex'),
  created_at  timestamptz not null default now()
);

create table public.team_members (
  team_id uuid not null references public.teams(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role    text not null default 'trainer' check (role in ('trainer', 'assistent')),
  primary key (team_id, user_id)
);

create table public.players (
  id            uuid primary key default gen_random_uuid(),
  team_id       uuid not null references public.teams(id) on delete cascade,
  nickname      text not null check (char_length(nickname) between 1 and 30),
  shirt         smallint check (shirt between 0 and 99),
  position      text check (char_length(position) <= 30),
  alt_positions text[] not null default '{}',
  token_hash    text unique,
  consent_at    timestamptz,
  active        boolean not null default true,
  created_at    timestamptz not null default now()
);

-- Flexibele inhoud: opstellingen, patronen, oefenvormen, trainingen,
-- weekplan, taakkaarten, wedstrijdproblemen en thuisoefeningen.
create table public.content (
  id         uuid primary key default gen_random_uuid(),
  team_id    uuid not null references public.teams(id) on delete cascade,
  kind       text not null check (kind in
               ('lineup','pattern','drill','session','plan','taskcard','problem','homedrill')),
  title      text not null check (char_length(title) between 1 and 120),
  data       jsonb not null default '{}',
  sort       integer not null default 0,
  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users(id) on delete set null
);
create index content_team_kind on public.content(team_id, kind, sort);

-- Huiswerk: player_id leeg = voor het hele team.
create table public.assignments (
  id         uuid primary key default gen_random_uuid(),
  team_id    uuid not null references public.teams(id) on delete cascade,
  drill_id   uuid not null references public.content(id) on delete cascade,
  player_id  uuid references public.players(id) on delete cascade,
  week_start date not null,
  note       text check (char_length(note) <= 280),
  created_at timestamptz not null default now()
);
create index assignments_team_week on public.assignments(team_id, week_start);

create table public.completions (
  id            uuid primary key default gen_random_uuid(),
  assignment_id uuid not null references public.assignments(id) on delete cascade,
  player_id     uuid not null references public.players(id) on delete cascade,
  mood          smallint check (mood between 1 and 3),
  reaction      text check (reaction in ('top','goed_bezig','knap','volhouden')),
  done_at       timestamptz not null default now(),
  unique (assignment_id, player_id)
);

-- ---------- Hulpfuncties ----------

create or replace function public.is_staff(p_team uuid)
returns boolean language sql stable security definer set search_path = '' as $$
  select exists (
    select 1 from public.team_members m
    where m.team_id = p_team and m.user_id = auth.uid()
  );
$$;

create or replace function public.is_trainer(p_team uuid)
returns boolean language sql stable security definer set search_path = '' as $$
  select exists (
    select 1 from public.team_members m
    where m.team_id = p_team and m.user_id = auth.uid() and m.role = 'trainer'
  );
$$;

create or replace function public._hash(p_token text)
returns text language sql immutable set search_path = '' as $$
  select encode(extensions.digest(p_token, 'sha256'), 'hex');
$$;

-- ---------- Rijbeveiliging (RLS) ----------

alter table public.teams        enable row level security;
alter table public.team_members enable row level security;
alter table public.players      enable row level security;
alter table public.content      enable row level security;
alter table public.assignments  enable row level security;
alter table public.completions  enable row level security;

create policy teams_select on public.teams for select to authenticated using (public.is_staff(id));
create policy teams_update on public.teams for update to authenticated using (public.is_staff(id)) with check (public.is_staff(id));
create policy teams_delete on public.teams for delete to authenticated using (public.is_trainer(id));

create policy members_select on public.team_members for select to authenticated using (public.is_staff(team_id));
create policy members_delete on public.team_members for delete to authenticated using (public.is_trainer(team_id));

create policy players_all on public.players for all to authenticated
  using (public.is_staff(team_id)) with check (public.is_staff(team_id));
create policy content_all on public.content for all to authenticated
  using (public.is_staff(team_id)) with check (public.is_staff(team_id));
create policy assignments_all on public.assignments for all to authenticated
  using (public.is_staff(team_id)) with check (public.is_staff(team_id));
create policy completions_all on public.completions for all to authenticated
  using (exists (select 1 from public.assignments a
                 where a.id = assignment_id and public.is_staff(a.team_id)))
  with check (exists (select 1 from public.assignments a
                 where a.id = assignment_id and public.is_staff(a.team_id)));

-- ---------- Functies voor trainers ----------

create or replace function public.create_team(p_name text, p_club text default null, p_season text default null)
returns uuid language plpgsql security definer set search_path = '' as $$
declare v_id uuid;
begin
  if auth.uid() is null then raise exception 'niet ingelogd'; end if;
  insert into public.teams(name, club, season) values (p_name, p_club, p_season) returning id into v_id;
  insert into public.team_members(team_id, user_id, role) values (v_id, auth.uid(), 'trainer');
  return v_id;
end $$;

-- Assistent of tweede trainer toevoegen; diegene moet één keer zelf ingelogd zijn.
create or replace function public.add_staff(p_team uuid, p_email text, p_role text default 'assistent')
returns void language plpgsql security definer set search_path = '' as $$
declare v_user uuid;
begin
  if not public.is_trainer(p_team) then raise exception 'geen rechten'; end if;
  select id into v_user from auth.users where lower(email) = lower(p_email);
  if v_user is null then raise exception 'onbekend: laat deze persoon eerst één keer inloggen'; end if;
  insert into public.team_members(team_id, user_id, role) values (p_team, v_user, p_role)
  on conflict (team_id, user_id) do update set role = excluded.role;
end $$;

-- Speler toevoegen; geeft de spelerscode één keer terug (alleen de hash wordt bewaard).
create or replace function public.add_player(p_team uuid, p_nickname text, p_shirt integer default null,
                                             p_position text default null, p_alt text[] default '{}')
returns table(player_id uuid, token text) language plpgsql security definer set search_path = '' as $$
declare v_token text := encode(extensions.gen_random_bytes(18), 'hex');
begin
  if not public.is_staff(p_team) then raise exception 'geen rechten'; end if;
  insert into public.players(team_id, nickname, shirt, position, alt_positions, token_hash)
  values (p_team, p_nickname, p_shirt, p_position, coalesce(p_alt, '{}'), public._hash(v_token))
  returning id into player_id;
  token := v_token;
  return next;
end $$;

-- Nieuwe spelerscode (de oude link werkt daarna niet meer).
create or replace function public.new_player_token(p_player uuid)
returns text language plpgsql security definer set search_path = '' as $$
declare v_team uuid; v_token text := encode(extensions.gen_random_bytes(18), 'hex');
begin
  select team_id into v_team from public.players where id = p_player;
  if v_team is null or not public.is_staff(v_team) then raise exception 'geen rechten'; end if;
  update public.players set token_hash = public._hash(v_token), consent_at = null where id = p_player;
  return v_token;
end $$;

-- Nieuwe teamlink (de oude werkt daarna niet meer).
create or replace function public.new_share_token(p_team uuid)
returns text language plpgsql security definer set search_path = '' as $$
declare v_token text := encode(extensions.gen_random_bytes(12), 'hex');
begin
  if not public.is_trainer(p_team) then raise exception 'geen rechten'; end if;
  update public.teams set share_token = v_token where id = p_team;
  return v_token;
end $$;

-- Einde seizoen: spelers, huiswerk en afvinkingen weg; de inhoud blijft.
create or replace function public.wipe_season(p_team uuid)
returns void language plpgsql security definer set search_path = '' as $$
begin
  if not public.is_trainer(p_team) then raise exception 'geen rechten'; end if;
  delete from public.assignments where team_id = p_team;
  delete from public.players where team_id = p_team;
  delete from public.content where team_id = p_team and kind = 'taskcard';
end $$;

-- Overzicht huiswerk van een week voor de trainer.
create or replace function public.week_overview(p_team uuid, p_week date)
returns jsonb language plpgsql stable security definer set search_path = '' as $$
begin
  if not public.is_staff(p_team) then raise exception 'geen rechten'; end if;
  return coalesce((
    select jsonb_agg(jsonb_build_object(
      'assignment_id', a.id, 'drill', d.title, 'player_id', a.player_id, 'note', a.note,
      'done', (select coalesce(jsonb_agg(jsonb_build_object(
                 'player_id', c.player_id, 'mood', c.mood, 'reaction', c.reaction, 'done_at', c.done_at)), '[]'::jsonb)
               from public.completions c where c.assignment_id = a.id)
    ) order by a.created_at)
    from public.assignments a join public.content d on d.id = a.drill_id
    where a.team_id = p_team and a.week_start = p_week), '[]'::jsonb);
end $$;

-- ---------- Functies voor team- en spelerslinks ----------

create or replace function public._team_public(p_team uuid)
returns jsonb language sql stable security definer set search_path = '' as $$
  select jsonb_build_object(
    'team', (select jsonb_build_object('name', t.name, 'club', t.club, 'season', t.season, 'colors', t.colors)
             from public.teams t where t.id = p_team),
    'players', coalesce((select jsonb_agg(jsonb_build_object(
                  'id', p.id, 'nickname', p.nickname, 'shirt', p.shirt,
                  'position', p.position, 'alt_positions', p.alt_positions) order by p.shirt nulls last, p.nickname)
                from public.players p where p.team_id = p_team and p.active), '[]'::jsonb),
    'content', coalesce((select jsonb_agg(jsonb_build_object(
                  'id', c.id, 'kind', c.kind, 'title', c.title, 'data', c.data, 'sort', c.sort) order by c.kind, c.sort)
                from public.content c where c.team_id = p_team), '[]'::jsonb)
  );
$$;

create or replace function public.get_team_view(p_share text)
returns jsonb language plpgsql stable security definer set search_path = '' as $$
declare v_team uuid;
begin
  select id into v_team from public.teams where share_token = p_share;
  if v_team is null then return null; end if;
  return public._team_public(v_team);
end $$;

create or replace function public.get_player_view(p_token text)
returns jsonb language plpgsql stable security definer set search_path = '' as $$
declare p public.players%rowtype; v_week date := date_trunc('week', now() at time zone 'Europe/Amsterdam')::date;
begin
  select * into p from public.players where token_hash = public._hash(p_token) and active;
  if not found then return null; end if;
  return public._team_public(p.team_id) || jsonb_build_object(
    'me', jsonb_build_object('id', p.id, 'nickname', p.nickname, 'shirt', p.shirt,
                             'position', p.position, 'consent', p.consent_at is not null),
    'week', v_week,
    'assignments', case when p.consent_at is null then '[]'::jsonb else coalesce((
        select jsonb_agg(jsonb_build_object(
          'id', a.id, 'note', a.note, 'for_team', a.player_id is null,
          'drill', jsonb_build_object('id', d.id, 'title', d.title, 'data', d.data),
          'done', c.id is not null, 'mood', c.mood, 'reaction', c.reaction) order by a.created_at)
        from public.assignments a
        join public.content d on d.id = a.drill_id
        left join public.completions c on c.assignment_id = a.id and c.player_id = p.id
        where a.team_id = p.team_id and a.week_start = v_week
          and (a.player_id is null or a.player_id = p.id)), '[]'::jsonb) end,
    'team_total', (select count(*) from public.completions c
                   join public.assignments a on a.id = c.assignment_id
                   where a.team_id = p.team_id and a.week_start = v_week)
  );
end $$;

create or replace function public.give_consent(p_token text)
returns boolean language plpgsql security definer set search_path = '' as $$
begin
  update public.players set consent_at = now()
  where token_hash = public._hash(p_token) and active and consent_at is null;
  return found;
end $$;

-- Toestemming intrekken: spelersgegevens en afvinkingen worden verwijderd.
create or replace function public.withdraw_consent(p_token text)
returns boolean language plpgsql security definer set search_path = '' as $$
begin
  delete from public.players where token_hash = public._hash(p_token);
  return found;
end $$;

create or replace function public.complete_assignment(p_token text, p_assignment uuid, p_mood integer default null)
returns boolean language plpgsql security definer set search_path = '' as $$
declare p public.players%rowtype;
begin
  select * into p from public.players where token_hash = public._hash(p_token) and active and consent_at is not null;
  if not found then return false; end if;
  if not exists (select 1 from public.assignments a where a.id = p_assignment and a.team_id = p.team_id
                 and (a.player_id is null or a.player_id = p.id)) then return false; end if;
  insert into public.completions(assignment_id, player_id, mood) values (p_assignment, p.id, p_mood)
  on conflict (assignment_id, player_id) do update set mood = excluded.mood, done_at = now();
  return true;
end $$;

create or replace function public.undo_completion(p_token text, p_assignment uuid)
returns boolean language plpgsql security definer set search_path = '' as $$
begin
  delete from public.completions c using public.players p
  where c.assignment_id = p_assignment and c.player_id = p.id
    and p.token_hash = public._hash(p_token);
  return found;
end $$;

-- ---------- Rechten op functies ----------

revoke execute on all functions in schema public from public, anon;

grant execute on function public.is_staff(uuid), public.is_trainer(uuid) to authenticated;
grant execute on function public.create_team(text, text, text), public.add_staff(uuid, text, text),
  public.add_player(uuid, text, integer, text, text[]), public.new_player_token(uuid),
  public.new_share_token(uuid), public.wipe_season(uuid), public.week_overview(uuid, date)
  to authenticated;
grant execute on function public.get_team_view(text), public.get_player_view(text),
  public.give_consent(text), public.withdraw_consent(text),
  public.complete_assignment(text, uuid, integer), public.undo_completion(text, uuid)
  to anon, authenticated;

alter default privileges in schema public revoke execute on functions from public, anon;
