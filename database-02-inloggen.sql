-- Trainers worden bij aanmelden direct bevestigd (inloggen met wachtwoord, geen inlogmail).
-- Positiekaarten worden opgeslagen als content met kind = 'session'; daarvoor is geen schemawijziging nodig.
create or replace function public._autoconfirm_user()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  new.email_confirmed_at := coalesce(new.email_confirmed_at, now());
  return new;
end $$;
revoke execute on function public._autoconfirm_user() from public, anon, authenticated;
drop trigger if exists autoconfirm_user on auth.users;
create trigger autoconfirm_user before insert on auth.users for each row execute function public._autoconfirm_user();
