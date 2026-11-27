import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.45.4/+esm';
const SEED = await fetch(new URL('./seed.json', import.meta.url)).then(r => r.json());
const SEED11 = await fetch(new URL('./seed11.json', import.meta.url)).then(r => r.json());
/* De kennisbank: posities, systemen, patronen en tegenstandertypes. Los van een team; namen worden pas bij het tonen ingevuld. */
const K8 = await fetch(new URL('./kennis8.json', import.meta.url)).then(r => r.json());
const K11 = await fetch(new URL('./kennis11.json', import.meta.url)).then(r => r.json());

const SUPABASE_URL = 'https://ygxvhlmutsdmaqishzla.supabase.co';
const SUPABASE_KEY = 'sb_publishable_ql89Fvs9DRbCG_MRvkctrA_cQoTDuD0';
const sb = createClient(SUPABASE_URL, SUPABASE_KEY, { auth: { persistSession: true, detectSessionInUrl: true } });

/* ---------------- hulpfuncties ---------------- */
const $ = s => document.querySelector(s);
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const SVGNS = 'http://www.w3.org/2000/svg';
function el(tag, attrs, parent) { const e = document.createElementNS(SVGNS, tag); for (const k in attrs) e.setAttribute(k, attrs[k]); if (parent) parent.appendChild(e); return e; }
function toast(m) { const t = $('#toast'); t.textContent = m; t.classList.add('show'); clearTimeout(toast.t); toast.t = setTimeout(() => t.classList.remove('show'), 2600); }
const store = { get(k) { try { return JSON.parse(localStorage.getItem(k)); } catch { return null; } }, set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch { } } };
const X = x => 2 + x * 0.56, Y = y => 2 + y * 0.86;
const SHIRT = 'M-3.3,-2.9 L-1.3,-3.8 Q0,-2.7 1.3,-3.8 L3.3,-2.9 L4.6,-0.7 L2.8,0.2 L2.8,3.6 L-2.8,3.6 L-2.8,0.2 L-4.6,-0.7 Z';
async function copy(text, msg) {
  try { await navigator.clipboard.writeText(text); toast(msg || 'Gekopieerd'); }
  catch { prompt('Kopieer de tekst:', text); }
}

/* ---------------- thuisoefeningen (startinhoud) ---------------- */
const HOME = [
 { slug: 'h-muurpass', title: 'Muurpass en open aannemen', min: 10, waar: 'Terras of muur', wie: 'Alleen', rol: 'Middenveld',
   stappen: ['Speel de bal tegen de muur.', 'Neem de terugkomende bal aan met de voet die het verst van de muur is.', 'Draai in één beweging weg naar een poortje van twee pionnen of flessen, links of rechts.', 'Wissel steeds van voet.'],
   tip: 'Kijk voordat de bal terugkomt al naar het poortje waar je heen gaat.' },
 { slug: 'h-omkijken', title: 'Omkijken voor de aanname', min: 10, waar: 'Terras', wie: 'Met ouder of vriend', rol: 'Iedereen',
   stappen: ['Je ouder of vriend staat achter je en steekt vingers op of houdt iets met een kleur omhoog.', 'Speel de bal tegen de muur of laat hem aangeven.', 'Roep het getal of de kleur voordat je de bal aanneemt.', 'Draai daarna naar de kant die wordt aangewezen.'],
   tip: 'Kijk over je ene schouder én over je andere.' },
 { slug: 'h-draaien', title: 'Draaien onder lichte druk', min: 10, waar: 'Terras', wie: 'Met ouder of vriend', rol: 'Middenveld',
   stappen: ['Je ouder of vriend staat in je rug, met een hand op je rug.', 'Hij of zij speelt de bal in.', 'Voel waar de ander staat en draai de andere kant op weg.', 'Begin rustig; laat de druk pas later wat groter worden.'],
   tip: 'Neem de bal aan met de voet die het verst van de tegenstander is.' },
 { slug: 'h-kaatsen', title: 'Kaatsen op tempo', min: 10, waar: 'Terras of pad', wie: 'Met ouder of vriend', rol: 'Iedereen',
   stappen: ['Ga op vier tot vijf meter van elkaar staan.', 'Pass in één of twee keer raken naar elkaar.', 'Gebruik links en rechts om de beurt.', 'Tel hoeveel passes jullie halen zonder fout.'],
   tip: 'Pass met de binnenkant van je voet, je standbeen naast de bal.' },
 { slug: 'h-steekpass', title: 'Steekpass door een poortje', min: 10, waar: 'Pad', wie: 'Alleen of met ouder', rol: 'Middenveld',
   stappen: ['Zet een poortje van één meter breed op tien tot twaalf meter.', 'Speel een strakke bal met de binnenkant door het poortje.', 'Doe het met allebei je voeten.', 'Lukt het goed: laat iemand schuin naar het poortje lopen en pass in zijn loop.'],
   tip: 'Kijk naar het poortje, dan naar de bal, en houd je bovenlichaam boven de bal.' },
 { slug: 'h-aanname', title: 'Aannemen in beweging', min: 10, waar: 'Pad', wie: 'Met ouder of vriend', rol: 'Iedereen',
   stappen: ['De ander speelt de bal naar je toe.', 'Neem hem met je eerste aanraking naar voren mee.', 'Versnel daarna vijf meter.', 'Wissel af tussen links en rechts.'],
   tip: 'Je eerste aanraking gaat de kant op waar ruimte is.' },
 { slug: 'h-afronden', title: 'Afronden met plaatsing', min: 10, waar: 'Pad', wie: 'Alleen', rol: 'Aanval',
   stappen: ['Maak een doeltje van twee pionnen of gebruik een klein doel.', 'Ga op acht tot tien meter staan.', 'Plaats de bal met de binnenkant van je voet in de hoeken.', 'Tel hoeveel van de tien er goed gaan.'],
   tip: 'Rustig plaatsen werkt beter dan hard schieten.' },
 { slug: 'h-dribbel', title: 'Dribbelen met je hoofd omhoog', min: 10, waar: 'Pad', wie: 'Met ouder', rol: 'Iedereen',
   stappen: ['Dribbel het pad op en neer.', 'Je ouder steekt steeds een aantal vingers op.', 'Roep het getal hardop zonder te stoppen.', 'Maak het moeilijker met kleine, snelle aanrakingen.'],
   tip: 'Voel de bal met je voet, kijk met je ogen naar het veld.' },
 { slug: 'h-1tegen1', title: '1 tegen 1 verdedigen', min: 10, waar: 'Pad', wie: 'Met ouder of vriend', rol: 'Verdediging',
   stappen: ['De ander dribbelt rustig op je af over het pad.', 'Zak door je knieën en blijf op een armlengte afstand.', 'Dwing hem naar één kant, niet inlopen.', 'Wissel daarna van rol.'],
   tip: 'Kijk naar de bal, niet naar de schijnbewegingen.' },
 { slug: 'h-keeper', title: 'Keeper: vangen tegen de muur', min: 10, waar: 'Terras of muur', wie: 'Alleen', rol: 'Keeper',
   stappen: ['Gooi de bal tegen de muur.', 'Vang hem met je lichaam achter de bal en je handen in een W.', 'Laat de bal ook eens stuiteren en ga hem tegemoet.', 'Rol hem daarna meteen naar een doeltje opzij.'],
   tip: 'Na het vangen: meteen kort uitspelen, niet lang trappen.' }
];
const PERSONAL = {
  Amine: ['De eerste weken begin je linksachter en schuif je bij balbezit naar binnen.'],
  Maddox: ['Als het tegenzit: bij het afgesproken signaal adem je even uit en speel je door.', 'Als Mees er niet is, keep jij.'],
  Joas: ['Als Mees er niet is, speel je links en loop je mee terug om Nassim te helpen.'],
  Mees: ['Na een fout: handschoenen goed, “volgende bal”.']
};
/* Oude opstellingen uit de eerste versie: drie horen bij een systeem, vier waren situaties van ons team en worden niet meer getoond. */
const SLUG_SYS = { basis: '1331', achterstand: '1232', tweespitsen: '1322' };
const HIDDEN = new Set(['fase1', 'druk', 'voorsprong', 'zondermees']);
/* Speelvorm per team: 8 tegen 8 (standaard) of 11 tegen 11. Elk team heeft zijn eigen posities, systemen en patronen. */
const fmt = () => (S.team?.colors?.format === 11 ? 11 : 8);
function FMf(f) {
  return f === 11
    ? { f: 11, label: '11 tegen 11', ...K11, SLUG: {}, ALT: SEED11.ALT, PERSONAL: SEED11.PERSONAL, def: '1433' }
    : { f: 8, label: '8 tegen 8', ...K8, SLUG: SLUG_SYS, ALT: SEED.ALT, PERSONAL, def: '1331' };
}
const FM = () => FMf(fmt());
const sysOf = L => L?.data?.sys || FM().SLUG[L?.data?.slug] || null;
const lineups = () => kind('lineup').filter(l => !HIDDEN.has(l.data.slug) && !l.data.hidden);
const lineupTitle = L => (FM().SLUG[L?.data?.slug] && FM().SYSTEMS[FM().SLUG[L.data.slug]]?.titel) || L?.title || '';
const tegenLabel = t => FM().TEGEN.find(x => x[0] === t)?.[1] || t;
/* Een plek in de tekst ({CM}, {SP2}) wordt de naam van de speler op die plek, of anders de naam van de plek. */
function slotLabel(sys, id) {
  const T = FM().SYSTEMS[sys], t = T?.slots.find(x => x.id === id), role = t?.role || id.replace(/\d+$/, '');
  return 'de ' + (t?.naam || FM().ROLES[role]?.naam || role).replace(/\s*\(.*?\)/, '').toLowerCase();
}
function lineupFor(sys) { const ls = lineups().filter(l => sysOf(l) === sys); return ls.find(l => l.data.match) || ls[0]; }
function fillT(text, sys, L) {
  if (!text || !String(text).includes('{')) return text || '';
  L = L || lineupFor(sys);
  return String(text).replace(/\{([A-Z]+)(\d?)\}/g, (m, role, n) => {
    const sl = L?.data.slots.filter(x => x.role === role)[n ? +n - 1 : 0], p = sl && playerById(sl.player_id);
    return p ? p.nickname : slotLabel(sys, role + n);
  }).replace(/(^|[.!?]\s+)de /g, (m, a) => a + 'De ');
}
/* De plek in het systeemsjabloon die bij dit slot hoort: zelfde positie, zelfde volgnummer. */
function tplSlot(L, slot, orig = slot) {
  const T = FM().SYSTEMS[sysOf(L)]; if (!T) return null;
  const at = L.data.slots.indexOf(orig);
  const nr = L.data.slots.slice(0, at < 0 ? 0 : at).filter(s => s.role === slot.role).length;
  return T.slots.filter(s => s.role === slot.role)[nr] || null;
}
/* Taken voor deze plek: eigen aanpassing in deze opstelling, anders het systeem, anders de positiekaart. */
function slotTasks(L, slot, orig = slot) {
  const base = FM().ROLES[slot.role] || {};
  const rc = { ...base, ...(roleCard(slot.role)?.data || {}) };
  const t = tplSlot(L, slot, orig) || {};
  const sys = sysOf(L), pick = k => fillT(slot[k] || t[k] || rc[k] || base[k] || '', sys, L);
  const list = k => (slot[k]?.length ? slot[k] : t[k]?.length ? t[k] : rc[k]?.length ? rc[k] : base[k] || []);
  return {
    naam: slot.naam || t.naam || rc.naam || slot.role,
    bal: pick('bal'), geen: pick('geen'), verlies: pick('verlies'), winst: pick('winst'), herv: pick('herv'),
    extra: (Array.isArray(slot.extra) ? slot.extra : Array.isArray(t.extra) ? t.extra : rc.extra || []).map(x => fillT(x, sys, L)),
    drills: list('drills'), home: list('home'), eigen: !!(slot.bal || slot.geen), rc
  };
}
/* De opstelling voor de komende wedstrijd: daar volgen de spelerspagina en het huiswerk standaard op. */
function matchLineup() { const ls = lineups(); return ls.find(l => l.data.match) || ls[0]; }

const REACT = { top: 'Top!', goed_bezig: 'Goed bezig', knap: 'Knap gedaan', volhouden: 'Volhouden' };
const MOOD = { 1: '😕', 2: '🙂', 3: '😄' };
function weekStart(d = new Date()) { const x = new Date(d.getFullYear(), d.getMonth(), d.getDate()); x.setDate(x.getDate() - ((x.getDay() + 6) % 7)); return `${x.getFullYear()}-${String(x.getMonth() + 1).padStart(2, '0')}-${String(x.getDate()).padStart(2, '0')}`; }
function shiftWeek(ws, n) { const [y, m, d] = ws.split('-').map(Number); return weekStart(new Date(y, m - 1, d + 7 * n)); }
function weekLabel(ws) { const [y, m, d] = ws.split('-').map(Number); const a = new Date(y, m - 1, d), b = new Date(y, m - 1, d + 6); const f = x => x.toLocaleDateString('nl-NL', { day: 'numeric', month: 'short' }); return `${f(a)} – ${f(b)}`; }

/* ---------------- toestand ---------------- */
const S = { mode: 'loading', user: null, teams: [], team: null, players: [], content: [], staff: false, view: 'opstelling', scen: null, pat: null, step: 0, tf: 'Alle' };
const kind = k => S.content.filter(c => c.kind === k).sort((a, b) => a.sort - b.sort);
S.opp = store.get('sb:opp') || null;
function oppPicker() { return `<label class="pick"><span>Tegenstander</span><select class="i" id="oppSel"><option value="">Elke tegenstander</option>${FM().TEGEN.map(([k, l]) => `<option value="${k}" ${S.opp === k ? 'selected' : ''}>${esc(l)}</option>`).join('')}</select></label>`; }
function wireOpp(redraw) { $('#oppSel').onchange = () => { S.opp = $('#oppSel').value || null; store.set('sb:opp', S.opp); redraw(); }; }
const fits = (sys, t) => !!FM().SYSTEMS[sys]?.goed?.some(g => g[0] === t);
const playerById = id => S.players.find(p => p.id === id);
const nick = id => playerById(id)?.nickname || '?';
function applyColors() {
  const c = S.team?.colors || {};
  document.documentElement.style.setProperty('--club', c.primary || '#db1e3b');
  document.documentElement.style.setProperty('--club2', c.secondary || '#181519');
}

/* ---------------- routing ---------------- */
function parseHash() {
  const h = location.hash.slice(1);
  if (h.startsWith('access_token') || h.startsWith('error')) return {};
  const p = new URLSearchParams(h);
  return { t: p.get('t'), s: p.get('s'), v: p.get('v') };
}
async function boot() {
  const r = parseHash();
  if (r.s) { S.token = r.s; return loadPlayer(); }
  if (r.t) {
    const { data, error } = await sb.rpc('get_team_view', { p_share: r.t });
    if (error || !data) return renderMessage('Deze teamlink werkt niet (meer).', 'Vraag de trainer om de nieuwe link.');
    loadPublic(data); S.mode = 'team'; S.staff = false; S.view = r.v || 'opstelling';
    return render();
  }
  const { data: { session } } = await sb.auth.getSession();
  S.user = session?.user || null;
  if (!S.user) { S.mode = 'login'; return renderLogin(); }
  await loadStaff();
}
function loadPublic(d) {
  S.team = d.team; S.players = d.players || []; S.content = d.content || []; applyColors();
}
async function loadStaff(preferId) {
  S.mode = 'staff'; S.staff = true;
  const { data: mem, error } = await sb.from('team_members').select('role, teams(*)').eq('user_id', S.user.id);
  if (error) return renderMessage('Er ging iets mis bij het laden.', error.message);
  S.teams = (mem || []).map(m => ({ ...m.teams, role: m.role }));
  if (!S.teams.length) return renderCreateTeam();
  const want = preferId || store.get('sb:team');
  S.team = S.teams.find(t => t.id === want) || S.teams[0];
  store.set('sb:team', S.team.id);
  await reloadTeamData();
  if (!kind('session').length) {
    const { error } = await sb.from('content').insert(Object.entries(FM().ROLES).map(([code, r], i) => ({ team_id: S.team.id, kind: 'session', title: r.naam, sort: i, data: { role: code, ...r }, updated_by: S.user.id })));
    if (!error) await reloadTeamData();
  }
  await ensureSystems();
  render();
}
/* Elk systeem uit de kennisbank staat één keer klaar als opstelling; spelers worden ingedeeld op hun voorkeurspositie. */
function lineupFromSystem(code) {
  const T = FM().SYSTEMS[code], byName = n => S.players.find(p => p.nickname.toLowerCase() === String(n || '').toLowerCase())?.id || null;
  const used = new Set();
  const slots = T.slots.map(t => { let id = byName(t.demo); if (id && used.has(id)) id = null; if (id) used.add(id); return { role: t.role, x: t.x, y: t.y, player_id: id }; });
  slots.forEach(sl => {
    if (sl.player_id) return;
    const naam = (FM().ROLES[sl.role]?.naam || '').toLowerCase();
    const p = S.players.find(x => !used.has(x.id) && x.active !== false && (x.position || '').toLowerCase() === naam);
    if (p) { sl.player_id = p.id; used.add(p.id); }
  });
  slots.forEach(sl => { sl.alt = (FM().ALT[sl.role] || []).map(byName).filter(id => id && id !== sl.player_id); });
  return { sys: code, slug: 'sys-' + code, slots };
}
async function ensureSystems() {
  if (!S.staff) return;
  const have = new Set(lineups().map(sysOf).filter(Boolean));
  const missing = FM().ORDER.filter(c => !have.has(c));
  if (!missing.length) return;
  const base = Math.max(-1, ...kind('lineup').map(c => c.sort)) + 1;
  const { error } = await sb.from('content').insert(missing.map((c, i) => ({ team_id: S.team.id, kind: 'lineup', title: FM().SYSTEMS[c].titel, sort: base + i, data: lineupFromSystem(c), updated_by: S.user.id })));
  if (!error) await reloadTeamData();
}
async function reloadTeamData() {
  const [p, c] = await Promise.all([
    sb.from('players').select('*').eq('team_id', S.team.id).order('shirt', { nullsFirst: false }).order('nickname'),
    sb.from('content').select('*').eq('team_id', S.team.id).order('sort')
  ]);
  S.players = p.data || []; S.content = c.data || []; applyColors();
}

/* ---------------- schermen buiten de app ---------------- */
function shell(inner) {
  $('#app').innerHTML = `<header class="top"><div><div class="club">${esc(S.team?.club || 'FC Geleen Zuid')}</div><h1 class="title">Ons <span>Speelboek</span></h1></div></header>${inner}`;
}
function renderMessage(title, sub) { shell(`<div class="panel"><h2>${esc(title)}</h2><p class="muted">${esc(sub || '')}</p></div>`); }
function renderPlayerPlaceholder() {
  shell(`<div class="panel"><div class="kicker">Spelerspagina</div><h2>Jouw huiswerk komt hier</h2><p class="muted">De spelerspagina met thuisoefeningen wordt binnenkort geopend. Bewaar deze link.</p></div>`);
}
function renderLogin() {
  shell(`<div class="hero">
    <div><p class="lead">Het speelboek van ons team: opstellingen, spelpatronen, trainingen en taken, op één plek.</p>
      <p class="muted">Ben je speler of ouder? Open dan de link die je van de trainer hebt gekregen.</p></div>
    <form class="panel" id="loginForm"><div class="kicker">Voor trainers</div><h2 id="lh">Inloggen</h2>
      <label class="f" for="em">E-mailadres</label><input class="i" id="em" type="email" required autocomplete="email" placeholder="naam@voorbeeld.nl">
      <label class="f" for="pw">Wachtwoord</label><input class="i" id="pw" type="password" required minlength="8" autocomplete="current-password" placeholder="Minstens 8 tekens">
      <div class="row mt"><button class="btn primary" type="submit" id="lb">Inloggen</button><button class="btn ghost" type="button" id="lt">Nog geen account? Maak er een aan</button></div>
      <p class="small muted" id="loginMsg"></p></form></div>`);
  let signup = false;
  $('#lt').onclick = () => { signup = !signup; $('#lh').textContent = signup ? 'Account aanmaken' : 'Inloggen'; $('#lb').textContent = signup ? 'Account aanmaken' : 'Inloggen'; $('#lt').textContent = signup ? 'Ik heb al een account' : 'Nog geen account? Maak er een aan'; $('#pw').autocomplete = signup ? 'new-password' : 'current-password'; };
  $('#loginForm').onsubmit = async e => {
    e.preventDefault();
    const email = $('#em').value.trim(), password = $('#pw').value;
    $('#lb').disabled = true; $('#loginMsg').textContent = signup ? 'Account aanmaken…' : 'Inloggen…';
    let res = signup ? await sb.auth.signUp({ email, password }) : await sb.auth.signInWithPassword({ email, password });
    if (!res.error && signup && !res.data.session) res = await sb.auth.signInWithPassword({ email, password });
    $('#lb').disabled = false;
    if (res.error) {
      const m = res.error.message || '';
      $('#loginMsg').textContent = /Invalid login/i.test(m) ? 'E-mailadres of wachtwoord klopt niet.' : /already registered/i.test(m) ? 'Dit e-mailadres heeft al een account. Log in.' : /Password/i.test(m) ? 'Kies een wachtwoord van minstens 8 tekens.' : 'Dat lukte niet: ' + m;
      return;
    }
    S.user = res.data.user; await loadStaff();
  };
}
function renderCreateTeam() {
  shell(`<form class="panel" id="ctForm" style="max-width:560px"><div class="kicker">Welkom</div><h2>Maak je team aan</h2>
    <p class="muted small">Het team start met beproefde systemen, spelpatronen, taken per positie, oefenvormen en trainingsplannen. Spelers voeg je daarna zelf toe; alles is aan te passen.</p>
    <label class="f" for="tfm">Speelvorm</label><select class="i" id="tfm"><option value="8">8 tegen 8 (onder 13)</option><option value="11">11 tegen 11 (vanaf onder 13)</option></select>
    <p class="small muted" style="margin:4px 0 0">Elke speelvorm heeft eigen posities, systemen, patronen en trainingen. Wil je beide, maak dan twee teams aan.</p>
    <label class="f" for="tn">Teamnaam</label><input class="i" id="tn" required value="JO12">
    <label class="f" for="tc">Club</label><input class="i" id="tc" value="FC Geleen Zuid">
    <label class="f" for="ts">Seizoen</label><input class="i" id="ts" value="2026-2027">
    <label class="row small mt"><input type="checkbox" id="tseed" checked> Kennisbank en startinhoud laden</label>
    <label class="row small"><input type="checkbox" id="troster"> Voorbeeldspelers toevoegen (12 voornamen om mee te oefenen)</label>
    <div class="row mt"><button class="btn primary" type="submit" id="ctBtn">Team aanmaken</button></div><p class="small muted" id="ctMsg"></p></form>`);
  $('#tfm').onchange = () => { const n = $('#tn'); if (n.value === 'JO12' || n.value === 'JO13') n.value = $('#tfm').value === '11' ? 'JO13' : 'JO12'; };
  $('#ctForm').onsubmit = async e => {
    e.preventDefault(); $('#ctBtn').disabled = true; $('#ctMsg').textContent = 'Team aanmaken…';
    const { data: id, error } = await sb.rpc('create_team', { p_name: $('#tn').value.trim(), p_club: $('#tc').value.trim() || null, p_season: $('#ts').value.trim() || null });
    if (error) { $('#ctMsg').textContent = error.message; $('#ctBtn').disabled = false; return; }
    const f = +$('#tfm').value === 11 ? 11 : 8;
    if (f === 11) { const { error: e2 } = await sb.from('teams').update({ colors: { format: 11 } }).eq('id', id); if (e2) { $('#ctMsg').textContent = e2.message; $('#ctBtn').disabled = false; return; } }
    if ($('#tseed').checked) { $('#ctMsg').textContent = 'Startinhoud laden…'; await seedTeam(id, f, $('#troster').checked); }
    S.view = 'opstelling'; S.scen = null; selSlot = null;
    await loadStaff(id);
  };
}

/* ---------------- startinhoud ---------------- */
async function seedTeam(teamId, f = 8, roster = false) {
  const C = FMf(f), ids = {};
  if (roster) {
    const pos11 = Object.fromEntries(K11.SYSTEMS['1433'].slots.map(t => [t.demo, K11.ROLES[t.role].naam]));
    for (const name of SEED.ROSTER) {
      const position = f === 11 ? (pos11[name] || 'Wissel') : SEED.TASK[name]?.pos || null;
      const { data } = await sb.rpc('add_player', { p_team: teamId, p_nickname: name, p_position: position });
      if (data?.[0]) ids[name] = data[0].player_id;
    }
  }
  const rows = [];
  const drills = f === 11 ? [...SEED11.DRILLS, ...SEED.DRILLS.filter(d => d.id !== 'wedstrijd8')] : SEED.DRILLS;
  drills.forEach((d, i) => { const { name, ...rest } = d; rows.push({ team_id: teamId, kind: 'drill', title: name, sort: i, data: { ...rest, slug: d.id } }); });
  (f === 11 ? SEED11.TRAIN : SEED.TRAIN).forEach((t, i) => rows.push({ team_id: teamId, kind: 'plan', title: t.name, sort: i, data: { weken: t.weken, prob: t.prob, drills: t.drills } }));
  HOME.forEach((h, i) => { const { title, ...rest } = h; rows.push({ team_id: teamId, kind: 'homedrill', title, sort: i, data: rest }); });
  SEED.ROSTER.forEach((n, i) => { if (ids[n]) rows.push({ team_id: teamId, kind: 'taskcard', title: n, sort: i, data: { player_id: ids[n], extra: C.PERSONAL[n] || [] } }); });
  const { error } = await sb.from('content').insert(rows);
  if (error) toast('Startinhoud deels geladen: ' + error.message);
  await sb.from('content').insert(Object.entries(C.ROLES).map(([code, r], i) => ({ team_id: teamId, kind: 'session', title: r.naam, sort: i, data: { role: code, ...r } })));
}

/* ---------------- opslaan ---------------- */
async function saveContent(item, patch) {
  Object.assign(item, patch);
  if (!S.staff) return;
  const { error } = await sb.from('content').update({ title: item.title, data: item.data, updated_at: new Date().toISOString(), updated_by: S.user.id }).eq('id', item.id);
  if (error) toast('Opslaan mislukt: ' + error.message);
}
async function insertContent(kindName, title, data) {
  const sort = Math.max(-1, ...kind(kindName).map(c => c.sort)) + 1;
  const { data: row, error } = await sb.from('content').insert({ team_id: S.team.id, kind: kindName, title, data, sort, updated_by: S.user.id }).select().single();
  if (error) { toast('Toevoegen mislukt: ' + error.message); return null; }
  S.content.push(row); return row;
}
async function deleteContent(item) {
  const { error } = await sb.from('content').delete().eq('id', item.id);
  if (error) return toast('Verwijderen mislukt: ' + error.message);
  S.content = S.content.filter(c => c.id !== item.id);
}

/* ---------------- hoofdscherm ---------------- */
const VIEWS = [['opstelling', 'Opstelling'], ['patronen', 'Patronen'], ['trainingen', 'Trainingen'], ['spelers', 'Spelers']];
function render() {
  const views = [...(S.staff ? [VIEWS[0], ['huiswerk', 'Huiswerk'], ...VIEWS.slice(1), ['beheer', 'Beheer']] : S.mode === 'player' ? [['week', 'Mijn week'], ...VIEWS] : VIEWS), ['uitleg', 'Uitleg']];
  if (!views.some(v => v[0] === S.view)) S.view = views[0][0];
  const teamSel = S.staff && S.teams.length > 1 ? `<select class="i" id="teamSel" style="width:auto;padding:6px 10px">${S.teams.map(t => `<option value="${t.id}" ${t.id === S.team.id ? 'selected' : ''}>${esc(t.name)}</option>`).join('')}</select>` : '';
  $('#app').innerHTML = `<header class="top"><div><div class="club">${esc(S.team.club || '')} · ${esc(S.team.name)} · ${FM().label}</div><h1 class="title">Ons <span>Speelboek</span></h1></div>
    <div class="who">${S.staff ? `${teamSel}<div class="mt small">Trainer · <a href="#" id="logout" style="color:inherit">uitloggen</a></div>` : S.mode === 'player' ? `<span class="badge">${esc(S.me.nickname)}</span>` : '<span class="badge">Meekijken</span>'}</div></header>
    <nav class="tabs" aria-label="Onderdelen">${views.map(([k, l]) => `<button data-v="${k}" ${k === S.view ? 'aria-current="page"' : ''}>${l}</button>`).join('')}</nav>
    <section id="view"></section>`;
  document.querySelectorAll('nav.tabs button').forEach(b => b.onclick = () => { S.view = b.dataset.v; stopPlay(); render(); });
  if ($('#logout')) $('#logout').onclick = async e => { e.preventDefault(); await sb.auth.signOut(); location.hash = ''; location.reload(); };
  if ($('#teamSel')) $('#teamSel').onchange = e => loadStaff(e.target.value);
  ({ week: viewWeek, huiswerk: viewHomework, opstelling: viewLineup, patronen: viewPatterns, trainingen: viewTrainings, spelers: viewPlayers, beheer: viewAdmin, uitleg: viewHelp })[S.view]();
}

/* ---------------- veld ---------------- */
/* Het veld schuin van achter het eigen doel gezien, zoals een tv-beeld. Veldcoördinaten 0–100 (x van links naar rechts, y van hun doel naar het onze). */
const F0 = 240, D0 = 150, HC = 143.3, HZ = -135.3;
function proj(x, y) { const u = (x - 50) * 0.6, d = D0 + (100 - y) * 0.9; return [50 + u * F0 / d, HZ + HC * F0 / d, F0 / d]; }
function unproj(sx, sy) { const d = HC * F0 / Math.max(1, sy - HZ), u = (sx - 50) * d / F0; return [Math.max(0, Math.min(100, 50 + u / 0.6)), Math.max(0, Math.min(100, 100 - (d - D0) / 0.9))]; }
const P2 = (x, y) => proj(x, y).slice(0, 2).map(v => v.toFixed(2)).join(',');
function drawPitch3D(svg) {
  svg.setAttribute('viewBox', '0 0 100 106'); svg.innerHTML = '';
  const poly = (pts, attrs, parent = svg) => el('polygon', { points: pts.map(([x, y]) => P2(x, y)).join(' '), ...attrs }, parent);
  const line = (pts, parent) => el('polyline', { points: pts.map(([x, y]) => P2(x, y)).join(' '), fill: 'none' }, parent);
  el('rect', { x: -5, y: -5, width: 110, height: 116, fill: '#1c4f2d' }, svg);
  poly([[-5, -4], [105, -4], [105, 104], [-5, 104]], { fill: '#2b6f3f' });
  for (let i = 0; i < 10; i++) poly([[0, i * 10], [100, i * 10], [100, i * 10 + 10], [0, i * 10 + 10]], { fill: i % 2 ? '#2f7a46' : '#2a6d3e' });
  const Lg = el('g', { stroke: 'rgba(255,255,255,.85)', 'stroke-width': '.35', 'stroke-linejoin': 'round' }, svg);
  line([[0, 0], [100, 0], [100, 100], [0, 100], [0, 0]], Lg); line([[0, 50], [100, 50]], Lg);
  line(Array.from({ length: 41 }, (_, i) => [50 + 10.7 * Math.cos(i / 40 * 2 * Math.PI), 50 + 7 * Math.sin(i / 40 * 2 * Math.PI)]), Lg);
  [[0, 15.1, 5.8, 10.5, -1.7], [100, 84.9, 94.2, 89.5, 101.7]].forEach(([y0, yp, yg, ys, yn]) => {
    line([[23.2, y0], [23.2, yp], [76.8, yp], [76.8, y0]], Lg); line([[37.5, y0], [37.5, yg], [62.5, yg], [62.5, y0]], Lg);
    poly([[42.9, y0], [57.1, y0], [57.1, yn], [42.9, yn]], { fill: 'rgba(255,255,255,.25)', stroke: '#fff', 'stroke-width': '.3' });
    const [sx, sy, sc] = proj(50, ys); el('circle', { cx: sx, cy: sy, r: .35 * sc, fill: '#fff' }, svg);
  });
  const [cx0, cy0, cs] = proj(50, 50); el('circle', { cx: cx0, cy: cy0, r: .35 * cs, fill: '#fff' }, svg);
}
function makeToken(parent, own, club) {
  const g = el('g', { class: 'tok' }, parent);
  el('rect', { class: 'hit', x: -3.4, y: -2.8, width: 6.8, height: own ? 7.4 : 5, rx: 2, fill: 'transparent' }, g);
  if (own) {
    el('ellipse', { cx: 0, cy: 1.6, rx: 1.8, ry: .5, fill: 'rgba(0,0,0,.35)' }, g);
    const ring = el('circle', { class: 'ring', r: 2.7, fill: 'none', stroke: '#ffd84d', 'stroke-width': '.45' }, g); ring.style.display = 'none';
    el('circle', { class: 'body', r: 1.85, fill: club, stroke: '#fff', 'stroke-width': '.3' }, g);
    const lab = el('text', { y: '.72', 'text-anchor': 'middle', 'font-size': '1.95', 'font-weight': '800', 'font-family': 'Barlow Condensed, Arial Narrow, sans-serif', fill: '#fff' }, g);
    const nm = el('text', { y: '3.9', 'text-anchor': 'middle', 'font-size': '1.55', 'font-weight': '700', 'font-family': 'Barlow, sans-serif', fill: '#fff', stroke: 'rgba(0,0,0,.75)', 'stroke-width': '.45', 'paint-order': 'stroke' }, g);
    return { g, ring, lab, nm };
  }
  el('ellipse', { cx: 0, cy: 1.2, rx: 1.1, ry: .35, fill: 'rgba(0,0,0,.3)' }, g);
  el('path', { d: 'M-.75,1.2 L-.45,-1.4 Q0,-2 .45,-1.4 L.75,1.2 Z', fill: '#f0d64a', stroke: '#8a7414', 'stroke-width': '.15' }, g);
  return { g };
}
/* Board: statisch veld met verplaatsbare spelers (opstelling, stap voor stap, animatiebord). */
function Board(svg, prefix) {
  drawPitch3D(svg);
  const defs = el('defs', {}, svg);
  [['W', '#ffffff'], ['Y', '#ffd84d']].forEach(([n, c]) => { const m = el('marker', { id: prefix + n, viewBox: '0 0 6 6', refX: '5', refY: '3', markerWidth: '3.2', markerHeight: '3.2', orient: 'auto' }, defs); el('path', { d: 'M0,0 L6,3 L0,6 z', fill: c }, m); });
  const club = getComputedStyle(document.documentElement).getPropertyValue('--club').trim() || '#db1e3b';
  const gA = el('g', {}, svg), gT = el('g', {}, svg);
  const ball = el('g', { class: 'ballg' }, svg);
  el('ellipse', { cx: .3, cy: .7, rx: .8, ry: .25, fill: 'rgba(0,0,0,.35)' }, ball); el('circle', { r: .75, fill: '#fff', stroke: '#111', 'stroke-width': '.18' }, ball); ball.style.display = 'none';
  const toks = {};
  const put = (g, x, y, k = 1) => { const [sx, sy, sc] = proj(x, y); g.style.transform = `translate(${sx.toFixed(2)}px,${sy.toFixed(2)}px) scale(${(sc * k).toFixed(3)})`; };
  const order = () => Object.values(toks).sort((a, b) => (a.y + (a.lab ? .6 : 0)) - (b.y + (b.lab ? .6 : 0))).forEach(t => gT.appendChild(t.g));
  const place = (k, x, y) => { const t = toks[k]; if (!t) return; t.x = x; t.y = y; put(t.g, x, y); };
  return {
    svg, place,
    toField(e) { const pt = svg.createSVGPoint(); pt.x = e.clientX; pt.y = e.clientY; const p = pt.matrixTransform(svg.getScreenCTM().inverse()); const [x, y] = unproj(p.x, p.y); return [Math.min(99, Math.max(1, x)), Math.min(99, Math.max(1, y))]; },
    render(list, instant) {
      if (instant) svg.classList.add('noanim');
      const keys = new Set(list.map(o => o.key));
      Object.keys(toks).forEach(k => { if (!keys.has(k)) { toks[k].g.remove(); delete toks[k]; } });
      list.forEach(o => {
        const t = toks[o.key] || (toks[o.key] = makeToken(gT, o.team !== 'opp', club));
        t.g.dataset.key = o.key;
        if (t.lab) {
          const lab = String(o.label ?? ''); t.lab.textContent = lab; t.lab.setAttribute('font-size', lab.length > 2 ? '1.3' : '1.95');
          t.nm.textContent = '';
          (o.names || [o.name || '']).forEach((n, i) => { const ts = el('tspan', { x: '0', dy: i ? '1.6' : '0', 'font-size': i ? '1.25' : '1.55', 'fill-opacity': i ? '.85' : '1' }, t.nm); ts.textContent = n; });
          t.g.style.opacity = o.dim ? '.55' : '';
        }
        t.g.setAttribute('aria-label', o.name ? `${o.name}${o.label ? ', ' + o.label : ''}` : 'Tegenstander');
        place(o.key, o.x, o.y);
      });
      order();
      if (instant) { svg.getBoundingClientRect(); requestAnimationFrame(() => svg.classList.remove('noanim')); }
    },
    ball(b) { if (!b) { ball.style.display = 'none'; return; } ball.style.display = ''; put(ball, b[0] + 2.4, Math.min(101, b[1] - .6)); },
    arrows(arr) {
      gA.innerHTML = '';
      (arr || []).forEach(a => {
        const at = a[4] === 'run' ? { stroke: '#ffd84d', 'stroke-width': '.55', 'stroke-dasharray': '1.4 1', 'marker-end': `url(#${prefix}Y)` }
          : a[4] === 'drib' ? { stroke: '#fff', 'stroke-width': '.55', 'stroke-dasharray': '.3 .9', 'stroke-linecap': 'round', 'marker-end': `url(#${prefix}W)` }
            : { stroke: '#fff', 'stroke-width': '.5', 'marker-end': `url(#${prefix}W)` };
        const [x1, y1] = proj(a[0], a[1]), [x2, y2] = proj(a[2], a[3]);
        el('line', Object.assign({ x1, y1, x2, y2, fill: 'none' }, at), gA);
      });
    }
  };
}

/* ---------------- opstelling ---------------- */
let lineupBoard = null, showOpp = false, benchSel = null;
let selSlot = null;
function viewLineup() {
  const lineups_ = lineups();
  if (!lineups_.length) { $('#view').innerHTML = `<div class="panel empty">Nog geen opstellingen.</div>`; return; }
  if (!S.scen || !lineups_.find(l => l.id === S.scen)) S.scen = matchLineup().id;
  const L = lineups_.find(l => l.id === S.scen);
  const sys = sysOf(L), T = FM().SYSTEMS[sys];
  const good = S.opp ? FM().ORDER.filter(c => fits(c, S.opp)) : [];
  $('#view').innerHTML = `<div class="pickers"><label class="pick"><span>Systeem</span><select class="i" id="lsel">${lineups_.map(l => `<option value="${l.id}" ${l.id === S.scen ? 'selected' : ''}>${l.data.match ? '★ ' : ''}${esc(lineupTitle(l))}${S.opp && fits(sysOf(l), S.opp) ? ' ✓' : ''}</option>`).join('')}</select></label>${oppPicker()}</div>
    <div class="layout patlayout"><div><div class="filmwrap"><svg class="pitch film ${S.staff ? 'edit' : ''}" id="pitch" aria-label="Veld met opstelling"></svg></div>
      <div class="row mt"><button class="btn" id="oppT">${showOpp ? 'Tegenstander verbergen' : 'Tegenstander tonen'}</button>${S.staff ? '<button class="btn ghost" id="addSys">Systeem toevoegen</button><button class="btn ghost" id="addL">Variant maken</button>' : ''}</div></div>
      <div><div class="panel"><div class="kicker">${T ? 'Systeem ' + esc(T.naam) : 'Eigen variant'}</div><h2>${esc(lineupTitle(L))}</h2><p style="margin:0">${esc(T && (L.data.slug in FM().SLUG || /^sys-/.test(L.data.slug || '')) ? fillT(T.idee, sys, L) : fillT(L.data.note || T?.idee || '', sys, L))}</p>
        ${S.opp && T ? (fits(sys, S.opp) ? `<p class="small fitline good">✓ Past goed tegen een tegenstander die “${esc(tegenLabel(S.opp).toLowerCase())}”.</p>` : `<p class="small fitline">Tegen een tegenstander die “${esc(tegenLabel(S.opp).toLowerCase())}” passen beter: ${good.map(c => esc(FM().SYSTEMS[c].naam)).join(', ') || 'geen vaste keuze'}.</p>`) : ''}
        ${L.data.match ? '<p class="small mt" style="margin-bottom:0"><span class="badge" style="background:var(--club);color:#fff">★ Wedstrijdopstelling</span> De spelerspagina\'s volgen deze opstelling.</p>' : ''}
        ${T ? `<dl class="task sysinfo"><dt>Sterk</dt><dd>${esc(fillT(T.sterk, sys, L))}</dd><dt>Risico</dt><dd>${esc(fillT(T.risico, sys, L))}</dd>${(T.goed || []).length ? `<dt>Goed tegen</dt>${T.goed.map(([k, w]) => `<dd><b>${esc(tegenLabel(k))}</b>: ${esc(fillT(w, sys, L))}</dd>`).join('')}` : ''}${T.wanneer ? `<dt>Wanneer</dt><dd>${esc(T.wanneer)}</dd>` : ''}</dl>
        ${T.fases ? `<details class="speelwijze"><summary>Speelwijze per fase</summary><dl class="task"><dt>Opbouwen</dt><dd>${esc(fillT(T.fases.opbouw, sys, L))}</dd><dt>Aanvallen</dt><dd>${esc(fillT(T.fases.aanval, sys, L))}</dd><dt>Verdedigen</dt><dd>${esc(fillT(T.fases.verdedigen, sys, L))}</dd><dt>Omschakelen</dt><dd>${esc(fillT(T.fases.omschakelen, sys, L))}</dd>${(T.coach || []).length ? `<dt>Waar let de trainer op</dt>${T.coach.map(c => `<dd>${esc(fillT(c, sys, L))}</dd>`).join('')}` : ''}</dl></details>` : ''}` : ''}
        <div class="row mt">${T?.train ? '<button class="btn" id="trainSys">Training voor dit systeem</button>' : ''}${S.staff ? `<button class="btn" id="hwSys">Huiswerk voor deze opstelling</button><button class="btn ${L.data.match ? '' : 'ghost'}" id="matchL">${L.data.match ? '★ Wedstrijdopstelling' : '☆ Maak wedstrijdopstelling'}</button>` : ''}</div>
        ${S.staff ? `<p class="small muted mt">Tik op een shirt voor de taken van die speler in dit systeem. Sleep een shirt om het te verplaatsen.</p><div class="row"><button class="btn ghost" id="editL">Naam en uitleg aanpassen</button></div>
        <h3 class="mt">Niet opgesteld</h3><div class="bench" id="bench"></div><p class="small muted" style="margin:6px 0 0">Tik op een naam en daarna op een shirt om te wisselen. De taken passen zich meteen aan.</p>` : '<p class="small muted mt">Tik op een speler voor zijn taken in dit systeem.</p>'}</div>
        <div class="panel mt" id="card" aria-live="polite"></div></div></div>`;
  $('#lsel').onchange = () => { S.scen = $('#lsel').value; benchSel = null; selSlot = null; viewLineup(); };
  wireOpp(viewLineup);
  $('#oppT').onclick = () => { showOpp = !showOpp; viewLineup(); };
  if ($('#trainSys')) $('#trainSys').onclick = () => {
    const have = new Set(kind('drill').map(d => d.data.slug || d.id));
    session = T.train.filter(sl => have.has(sl)); store.set('sb:sessie', session);
    S.view = 'trainingen'; render(); toast(`Training voor ${T.naam} staat klaar`);
  };
  if ($('#hwSys')) $('#hwSys').onclick = () => { S.week ||= weekStart(); assignByRole(L.id); };
  if ($('#matchL')) $('#matchL').onclick = async () => {
    const was = !!L.data.match;
    for (const o of lineups()) if (o.data.match && o.id !== L.id) { delete o.data.match; await saveContent(o, { data: o.data }); }
    if (was) delete L.data.match; else L.data.match = true;
    await saveContent(L, { data: L.data }); viewLineup(); toast(was ? 'Geen wedstrijdopstelling meer gekozen' : `${lineupTitle(L)} is de wedstrijdopstelling`);
  };
  lineupBoard = Board($('#pitch'), 'b');
  if (selSlot == null || !L.data.slots[selSlot]) selSlot = Math.max(0, L.data.slots.findIndex(s => s.role === 'CM'));
  drawLineup(L, true);
  if (S.staff) {
    $('#editL').onclick = () => editLineupMeta(L);
    $('#addL').onclick = async () => { const base = L; const row = await insertContent('lineup', `${lineupTitle(base)} (variant)`, JSON.parse(JSON.stringify({ ...base.data, sys: sysOf(base), slug: null, match: undefined, note: '' }))); if (row) { S.scen = row.id; viewLineup(); } };
    $('#addSys').onclick = () => addSystemDialog();
    wireDrag(L);
  } else {
    $('#pitch').onclick = e => { const g = e.target.closest('.tok'); if (g && g.dataset.key[0] === 's') pickSlot(L, +g.dataset.key.slice(1)); };
  }
  wireHover(L);
  showSlot(L, selSlot, false);
}
function addSystemDialog() {
  openDialog(`<div class="kicker">Systemen</div><h2>Systeem toevoegen</h2><p class="small muted">De spelers worden op hun kwaliteit ingevuld. Daarna kun je alles nog wisselen en aanpassen.</p>
    ${FM().ORDER.map(c => [c, FM().SYSTEMS[c]]).map(([c, T]) => `<label class="sysopt"><input type="radio" name="sysc" value="${c}" ${c === FM().def ? 'checked' : ''}><span><b>${esc(T.titel)}</b><br><span class="small muted">${esc(T.idee)}</span></span></label>`).join('')}`,
    [['Annuleren'], ['Toevoegen', 'primary', async () => {
      const c = document.querySelector('input[name=sysc]:checked')?.value; if (!c) return;
      const T = FM().SYSTEMS[c], row = await insertContent('lineup', T.titel, lineupFromSystem(c));
      if (row) { S.scen = row.id; selSlot = null; viewLineup(); toast(`${T.titel} staat klaar`); }
    }]]);
}
function pickSlot(L, i) {
  selSlot = i; drawLineup(L); showSlot(L, i, true);
}
/* Taken van één plek tonen: naast het veld, en op een smal scherm als blad dat van onder opschuift. */
function showSlot(L, i, open) {
  const slot = L.data.slots[i]; if (!slot) return;
  const p = playerById(slot.player_id);
  const html = (p ? cardHTML(p, { lineup: L }) : emptySlotHTML(L, slot)) + (S.staff ? `<div class="row mt"><button class="btn" data-es="${i}">Speler, positie of taken wijzigen</button></div>` : '');
  const box = $('#card'); if (box) box.innerHTML = html;
  if (open && !matchMedia('(min-width: 900px)').matches) openSheet(html);
  document.querySelectorAll('[data-es]').forEach(b => b.onclick = () => { closeSheet(); editSlot(L, L.data.slots[+b.dataset.es]); });
}
function emptySlotHTML(L, slot) {
  const st = slotTasks(L, slot);
  return `<div class="pcard">${shirtSVG(slot.role)}<div><h2 style="margin:0">Nog leeg</h2><div class="muted">${esc(st.naam)} · ${esc(lineupTitle(L))}</div></div></div>
    <dl class="task"><dt>Wij hebben de bal</dt><dd>${esc(st.bal)}</dd><dt>Zij hebben de bal</dt><dd>${esc(st.geen)}</dd></dl>`;
}
function openSheet(html) {
  let sh = $('#sheet');
  if (!sh) { sh = document.createElement('div'); sh.id = 'sheet'; sh.className = 'sheet'; sh.setAttribute('role', 'dialog'); sh.setAttribute('aria-label', 'Taken van de speler'); document.body.appendChild(sh); }
  sh.innerHTML = `<button class="sheet-x" aria-label="Sluiten">×</button><div class="sheet-grip"></div><div class="sheet-body">${html}</div>`;
  sh.querySelector('.sheet-x').onclick = closeSheet;
  sh.querySelectorAll('[data-es]').forEach(b => { const L = curLineup(); b.onclick = () => { closeSheet(); editSlot(L, L.data.slots[+b.dataset.es]); }; });
  requestAnimationFrame(() => sh.classList.add('open'));
}
function closeSheet() { const sh = $('#sheet'); if (sh) sh.classList.remove('open'); }
/* Met de muis boven een shirt: korte samenvatting van de taken. */
function wireHover(L) {
  if (!matchMedia('(hover: hover) and (pointer: fine)').matches) return;
  const svg = $('#pitch'); let tip = $('#tip');
  if (!tip) { tip = document.createElement('div'); tip.id = 'tip'; tip.className = 'tip'; tip.setAttribute('role', 'tooltip'); document.body.appendChild(tip); }
  tip.classList.remove('show');
  svg.onpointerover = e => {
    const g = e.target.closest('.tok'); if (!g || g.dataset.key[0] !== 's') return;
    const slot = L.data.slots[+g.dataset.key.slice(1)]; if (!slot) return;
    const st = slotTasks(L, slot), p = playerById(slot.player_id);
    tip.innerHTML = `<b>${esc(p ? p.nickname : 'Nog leeg')}</b> · ${esc(st.naam)}<div><span>Met bal</span> ${esc(st.bal)}</div><div><span>Zonder bal</span> ${esc(st.geen)}</div>`;
    const r = g.getBoundingClientRect(); tip.classList.add('show');
    const w = tip.offsetWidth, h = tip.offsetHeight;
    let x = r.right + 10, y = r.top + r.height / 2 - h / 2;
    if (x + w > innerWidth - 8) x = r.left - w - 10;
    tip.style.left = Math.max(8, x) + 'px'; tip.style.top = Math.min(innerHeight - h - 8, Math.max(8, y)) + 'px';
  };
  svg.onpointerout = e => { if (!e.relatedTarget || !e.relatedTarget.closest?.('.tok')) tip.classList.remove('show'); };
}
function drawLineup(L, instant) {
  const onField = new Set(L.data.slots.map(s => s.player_id));
  const list = L.data.slots.map((s, i) => {
    const alts = (s.alt || []).filter(a => !onField.has(a) && playerById(a)).slice(0, 2).map(nick);
    const p = playerById(s.player_id);
    return { key: 's' + i, name: p ? p.nickname : '—', names: alts.length ? [p ? p.nickname : '—', alts.join(' / ')] : [p ? p.nickname : '—'], label: p?.shirt ?? ROLENUM[s.role] ?? s.role, x: s.x, y: s.y, dim: !p };
  });
  if (showOpp) FM().OPP.forEach((o, i) => list.push({ key: 'o' + i, team: 'opp', x: o[0], y: o[1] }));
  lineupBoard.render(list, instant);
  lineupBoard.svg.querySelectorAll('.tok').forEach(g => g.classList.toggle('sel', g.dataset.key === 's' + selSlot));
  if (S.staff && $('#bench')) {
    const b = $('#bench'); b.innerHTML = '';
    S.players.filter(p => p.active && !onField.has(p.id)).forEach(p => {
      const btn = document.createElement('button'); btn.textContent = p.nickname; btn.className = benchSel === p.id ? 'sel' : '';
      btn.onclick = () => { benchSel = benchSel === p.id ? null : p.id; drawLineup(L); showCard(p.id); };
      b.appendChild(btn);
    });
  }
}
function wireDrag(L) {
  const svg = lineupBoard.svg; let drag = null, saveT = null;
  const toU = e => lineupBoard.toField(e);
  svg.onpointerdown = e => { const g = e.target.closest('.tok'); if (!g) return; drag = { key: g.dataset.key, sx: e.clientX, sy: e.clientY, moved: false }; svg.setPointerCapture(e.pointerId); };
  svg.onpointermove = e => {
    if (!drag) return;
    if (!drag.moved && Math.hypot(e.clientX - drag.sx, e.clientY - drag.sy) < 6) return;
    if (!drag.moved) { drag.moved = true; svg.classList.add('noanim'); }
    const [x, y] = toU(e);
    if (drag.key[0] === 's') { const s = L.data.slots[+drag.key.slice(1)]; s.x = Math.round(x * 10) / 10; s.y = Math.round(y * 10) / 10; }
    lineupBoard.place(drag.key, x, y);
  };
  const end = () => {
    if (!drag) return; svg.classList.remove('noanim');
    const d = drag; drag = null;
    if (d.key[0] !== 's') return;
    const slot = L.data.slots[+d.key.slice(1)];
    if (d.moved) { clearTimeout(saveT); saveT = setTimeout(() => saveContent(L, { data: L.data }), 500); return; }
    if (benchSel) {
      slot.player_id = benchSel; benchSel = null; saveContent(L, { data: L.data }); pickSlot(L, +d.key.slice(1)); toast(`${nick(slot.player_id)} staat nu op ${slotTasks(L, slot).naam}`);
    } else pickSlot(L, +d.key.slice(1));
  };
  svg.onpointerup = end; svg.onpointercancel = end;
}
function showCard(pid) {
  const box = $('#card'); if (!box) return;
  const p = playerById(pid); if (!p) { box.innerHTML = '<p class="muted">Kies een speler.</p>'; return; }
  box.innerHTML = cardHTML(p);
}
function curLineup() { const ls = lineups(); return ls.find(l => l.id === S.scen) || matchLineup(); }
function roleCards() { const db = kind('session'); return db.length ? db : Object.entries(FM().ROLES).map(([code, r], i) => ({ id: 'std-' + code, kind: 'session', title: r.naam, sort: i, std: true, data: { role: code, ...r } })); }
function roleCard(code) { return roleCards().find(r => r.data.role === code); }
function roleName(code) { return roleCard(code)?.data.naam || FM().ROLES[code]?.naam || code; }
function tasksFor(p, L = curLineup()) {
  const slot = L?.data.slots.find(s => s.player_id === p.id);
  const rc = slot ? roleCard(slot.role) : null;
  const tc = kind('taskcard').find(c => c.data.player_id === p.id);
  const alsoRoles = L ? [...new Set(L.data.slots.filter(s => (s.alt || []).includes(p.id)).map(s => s.role))] : [];
  return { slot, rc, tc, L, alsoRoles };
}
function cardHTML(p, opts = {}) {
  const { slot, rc, tc, L, alsoRoles } = tasksFor(p, opts.lineup);
  const r = rc?.data;
  const bySlug = (k, sl) => kind(k).find(d => d.data.slug === sl);
  const st0 = slot ? slotTasks(L, slot) : null;
  const drills = (st0 ? st0.drills : r?.drills || []).map(sl => bySlug('drill', sl)).filter(Boolean);
  const homes = (st0 ? st0.home : r?.home || []).map(sl => bySlug('homedrill', sl)).filter(Boolean);
  const roleExtra = [...(rc?.data.extra || []), ...(slot ? slotTasks(L, slot).extra : [])].map(x => x.split(' ').slice(0, 3).join(' ').toLowerCase());
  const personal = (tc?.data.extra || []).filter(x => !roleExtra.includes(x.split(' ').slice(0, 3).join(' ').toLowerCase()));
  const st = slot ? slotTasks(L, slot) : null;
  const head = `<div class="pcard">${shirtSVG(p.shirt ?? (slot?.role || ''))}<div><h2 style="margin:0">${esc(p.nickname)}</h2><div class="muted">${slot ? `${esc(st.naam)} · ${esc(lineupTitle(L))}` : `Niet opgesteld in ${esc(lineupTitle(L) || 'dit systeem')}`}</div></div></div>`;
  if (!r && !st) {
    const legacy = tc?.data;
    return head + (alsoRoles.length ? `<p class="small muted mt">Kan in deze situatie ook spelen als ${alsoRoles.map(x => esc(roleName(x))).join(' of ')}.</p>` : '') +
      (legacy?.bal ? `<dl class="task"><dt>Wij hebben de bal</dt><dd>${esc(legacy.bal)}</dd><dt>Zij hebben de bal</dt><dd>${esc(legacy.geen || '')}</dd></dl>` : '') +
      (personal.length ? `<dl class="task"><dt>Persoonlijk</dt>${personal.map(x => `<dd>${esc(x)}</dd>`).join('')}</dl>` : '');
  }
  const extra = [...(st ? st.extra : r?.extra || []), ...(slot?.note ? [slot.note] : [])];
  return head + `<dl class="task"><dt>Wij hebben de bal</dt><dd>${esc(st.bal)}</dd><dt>Zij hebben de bal</dt><dd>${esc(st.geen)}</dd>
    ${st.verlies ? `<dt>Na balverlies</dt><dd>${esc(st.verlies)}</dd>` : ''}${st.winst ? `<dt>Na balwinst</dt><dd>${esc(st.winst)}</dd>` : ''}
    ${st.herv && !opts.compact ? `<dt>Spelhervattingen</dt><dd>${esc(st.herv)}</dd>` : ''}
    ${extra.length ? `<dt>Let op</dt>${extra.map(x => `<dd>${esc(x)}</dd>`).join('')}` : ''}
    ${personal.length ? `<dt>Persoonlijk</dt>${personal.map(x => `<dd>${esc(x)}</dd>`).join('')}` : ''}
    ${opts.compact ? '' : `${drills.length ? `<dt>Oefenvormen op de training</dt><dd>${drills.map(d => esc(d.title)).join(', ')}</dd>` : ''}${homes.length ? `<dt>Thuis oefenen</dt><dd>${homes.map(h => esc(h.title)).join(', ')}</dd>` : ''}`}</dl>`;
}
function shirtSVG(n) {
  return `<svg class="shirt" viewBox="-6 -6 12 12" aria-hidden="true"><path d="${SHIRT}" fill="var(--club)" stroke="rgba(0,0,0,.5)" stroke-width=".3"/><text y="1.5" text-anchor="middle" font-size="3" font-weight="800" font-family="Barlow Condensed" fill="#fff">${esc(n)}</text></svg>`;
}
function editSlot(L, slot) {
  const opts = S.players.filter(p => p.active);
  openDialog(`<div class="kicker">Positie ${esc(slot.role)}</div><h2>Wie speelt hier?</h2>
    <label class="f" for="sp">Speler</label><select class="i" id="sp"><option value="">— leeg —</option>${opts.map(p => `<option value="${p.id}" ${p.id === slot.player_id ? 'selected' : ''}>${esc(p.nickname)}</option>`).join('')}</select>
    <label class="f" for="sr">Positie</label><select class="i" id="sr">${roleCards().map(r => `<option value="${esc(r.data.role)}" ${r.data.role === slot.role ? 'selected' : ''}>${esc(r.data.role)} · ${esc(r.title)}</option>`).join('')}${roleCard(slot.role) ? '' : `<option selected value="${esc(slot.role)}">${esc(slot.role)}</option>`}</select>
    <label class="f" for="snm">Naam van deze plek in dit systeem</label><input class="i" id="snm" maxlength="40" value="${esc(slotTasks(L, slot).naam)}">
    <label class="f" for="sbal">Wij hebben de bal (in dit systeem)</label><textarea class="i" id="sbal" maxlength="400">${esc(slotTasks(L, slot).bal)}</textarea>
    <label class="f" for="sgeen">Zij hebben de bal (in dit systeem)</label><textarea class="i" id="sgeen" maxlength="400">${esc(slotTasks(L, slot).geen)}</textarea>
    <label class="f" for="sverl">Na balverlies (in dit systeem)</label><textarea class="i" id="sverl" maxlength="300">${esc(slotTasks(L, slot).verlies)}</textarea>
    <label class="f" for="swin">Na balwinst (in dit systeem)</label><textarea class="i" id="swin" maxlength="300">${esc(slotTasks(L, slot).winst)}</textarea>
    <p class="small muted" style="margin:4px 0 0">Kies je een andere positie, dan vullen deze velden zich met de taken van die positie in dit systeem.</p>
    <label class="f" for="sno">Extra taak in deze situatie (optioneel)</label><input class="i" id="sno" maxlength="200" value="${esc(slot.note || '')}">
    <label class="f">Kan hier ook spelen</label><div class="grid two">${opts.map(p => `<label class="small"><input type="checkbox" value="${p.id}" class="altc" ${(slot.alt || []).includes(p.id) ? 'checked' : ''}> ${esc(p.nickname)}</label>`).join('')}</div>`,
    [['Annuleren'], ['Opslaan', 'primary', () => {
      slot.player_id = $('#sp').value || null; slot.note = $('#sno').value.trim() || undefined;
      slot.role = $('#sr').value || slot.role;
      const auto = slotTasks(L, { ...slot, bal: undefined, geen: undefined, naam: undefined, verlies: undefined, winst: undefined }, slot);
      const v = { bal: $('#sbal').value.trim(), geen: $('#sgeen').value.trim(), naam: $('#snm').value.trim(), verlies: $('#sverl').value.trim(), winst: $('#swin').value.trim() };
      for (const k of ['bal', 'geen', 'naam', 'verlies', 'winst']) { if (v[k] && v[k] !== auto[k]) slot[k] = v[k]; else delete slot[k]; }
      slot.alt = [...document.querySelectorAll('.altc:checked')].map(c => c.value);
      saveContent(L, { data: L.data }); const i = L.data.slots.indexOf(slot); if ($('#pitch')) pickSlot(L, i); else showCard(slot.player_id);
    }]]);
  $('#sr').onchange = () => { const t = slotTasks(L, { ...slot, role: $('#sr').value, bal: undefined, geen: undefined, naam: undefined, verlies: undefined, winst: undefined }, slot); $('#sbal').value = t.bal; $('#sgeen').value = t.geen; $('#snm').value = t.naam; $('#sverl').value = t.verlies; $('#swin').value = t.winst; };
}
function editLineupMeta(L) {
  openDialog(`<h2>Situatie aanpassen</h2><label class="f" for="lt">Naam</label><input class="i" id="lt" value="${esc(L.title)}" maxlength="60">
    <label class="f" for="ln">Uitleg</label><textarea class="i" id="ln">${esc(L.data.note || '')}</textarea>`,
    [['Verwijderen', 'danger', async () => { if (confirm('Deze situatie verwijderen?')) { await deleteContent(L); S.scen = null; viewLineup(); } }],
    ['Annuleren'], ['Opslaan', 'primary', async () => { await saveContent(L, { title: $('#lt').value.trim() || L.title, data: { ...L.data, note: $('#ln').value } }); viewLineup(); }]]);
}

/* ---------------- patronen ---------------- */
let patBoard = null, timer = null, film = null;
const ROLENUM = { K: 1, RA: 2, CV: 3, RCV: 3, LCV: 4, LA: 5, VM: 6, RB: 7, RM: 7, RW: 7, CM: 8, SP: 9, AM: 10, SS: 10, LB: 11, LM: 11, LW: 11 };
const FASE = { opbouw: 'Opbouw', aanval: 'Aanval', omschakelen: 'Omschakelen', verdedigen: 'Verdedigen' };
/* Oude startpatronen in de database (uit de eerste versies, met namen van ons team): niet meer tonen, de kennisbank vervangt ze. */
const OLD_PAT = new Set(['nulang', 'nulinks', 'beterlinks', 'numidden', 'betergroot', 'indribbel', 'viaspits', 'opbouw', 'driehoek', 'lang', 'balverlies', 'opbouw4', 'derdeman6', 'overlaplinks', 'druk11']);
/* Alle patronen: de kennisbank, een eigen aanpassing daarvan, en eigen patronen van het team. */
function allPatterns() {
  const lib = FM().PATTERNS.map((p, i) => ({ id: 'lib-' + p.id, kind: 'pattern', title: p.name, sort: i, lib: true, data: { slug: p.id, sys: p.sys, fase: p.fase, tegen: p.tegen, frames: p.frames } }));
  const libSlugs = new Set(lib.map(p => p.data.slug));
  const db = kind('pattern').filter(p => p.data.edited || !(libSlugs.has(p.data.slug) || OLD_PAT.has(p.data.slug) || /^s1/.test(p.data.slug || '')));
  const over = new Map(db.filter(p => libSlugs.has(p.data.slug)).map(p => [p.data.slug, p]));
  return [...lib.map(p => over.get(p.data.slug) || p), ...db.filter(p => !libSlugs.has(p.data.slug)).map(p => Object.assign(p, { own: true }))];
}
const patSys = P => (P.data.sys && FM().SYSTEMS[P.data.sys]) ? P.data.sys : FM().ORDER[0];
/* Wie staat waar: het systeemsjabloon, met de spelers uit de opstelling van dat systeem. */
function patCast(P) {
  const sys = patSys(P), T = FM().SYSTEMS[sys], L = lineupFor(sys);
  const used = new Set();
  const out = T.slots.map((t, i) => {
    const nr = T.slots.slice(0, i).filter(x => x.role === t.role).length;
    const sl = L?.data.slots.filter(x => x.role === t.role)[nr];
    const p = sl?.player_id ? playerById(sl.player_id) : null;
    if (p?.shirt != null) used.add(p.shirt);
    const lab = slotLabel(sys, t.id);
    return { n: t.id, demo: t.demo, x: t.x, y: t.y, role: t.role, pid: p?.id || null, name: p ? p.nickname : lab.charAt(0).toUpperCase() + lab.slice(1), show: p ? p.nickname : '', num: p?.shirt ?? null };
  });
  out.forEach(c => { if (c.num != null) return; let n = ROLENUM[c.role]; if (n == null || used.has(n)) n = [6, 10, 11, 7, 4, 9, 2, 3, 5, 8, 12, 13, 14].find(x => !used.has(x)); c.num = n; used.add(n); });
  return out;
}
function patStates(P) {
  const cast = patCast(P), pos = Object.fromEntries(cast.map(c => [c.n, [c.x, c.y]])), alias = Object.fromEntries(cast.map(c => [c.demo, c.n]));
  return P.data.frames.map(f => {
    if (f.set) Object.entries(f.set).forEach(([k, v]) => { const id = pos[k] ? k : alias[k]; if (id) pos[id] = [v[0], v[1]]; });
    return { pos: JSON.parse(JSON.stringify(pos)), opp: f.opp || [], ball: f.ball, cap: f.cap, ar: f.ar };
  });
}
function patCap(P, cap) {
  const sys = patSys(P); let c = fillT(cap || '', sys);
  patCast(P).forEach(x => { if (x.demo && x.show && x.demo !== x.show) c = c.replace(new RegExp('\\b' + x.demo + '\\b', 'g'), x.show); });
  return c;
}
const dist = (a, b) => Math.hypot((a[0] - b[0]) * 0.6, (a[1] - b[1]) * 0.9);
/* Eén zin voor één speler: wat doe jij in deze stap? */
function youLine(P, states, k, n) {
  const cast = patCast(P), nm = x => { const c = cast.find(c => c.n === x); return c ? (c.show || c.name.toLowerCase()) : x; };
  const cur = states[k], prev = states[k - 1];
  const at = (st, who) => { const p = st.pos[who]; return p && st.ball && Math.hypot(st.ball[0] - p[0], st.ball[1] - 3 - p[1]) < 5; };
  const holder = st => Object.keys(st.pos).find(w => at(st, w));
  if (!prev) return at(cur, n) ? 'Jij hebt de bal. Kijk eerst om je heen: wie staat er vrij?' : 'Hier sta jij. Kijk waar de bal is en wie hem heeft.';
  const a = prev.pos[n], b = cur.pos[n], moved = dist(a, b) > 3, had = at(prev, n), gets = at(cur, n);
  const dx = b[0] - a[0], dy = b[1] - a[1], dir = [];
  if (dy < -4) dir.push('naar voren'); else if (dy > 4) dir.push('terug');
  if (Math.abs(dx) > 4) dir.push(Math.abs(b[0] - 50) < Math.abs(a[0] - 50) ? 'naar binnen' : 'naar buiten');
  const waar = dir.join(' en ') || 'een paar meter op';
  if (had && !gets) {
    if (cur.ball && cur.ball[1] <= 3) return 'Jij schiet op doel!';
    const to = holder(cur); return to ? `Jij speelt de bal naar ${nm(to)}.` : 'Jij speelt de bal.';
  }
  if (had && gets) return moved ? `Jij dribbelt met de bal ${waar}.` : 'Jij houdt de bal en kijkt om je heen.';
  if (gets) return moved ? `Jij loopt ${waar} en krijgt de bal.` : 'Jij krijgt de bal. Neem hem goed aan en kijk vooruit.';
  if (moved) return `Jij loopt ${waar}. Zo maak je ruimte of word je aanspeelbaar.`;
  return 'Jij blijft op je plek, houdt je positie en kijkt mee waar de bal gaat.';
}
const ease = p => p < .5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2;
const easeOut = p => 1 - Math.pow(1 - p, 2.2);
/* Film: vloeiend afspelen op het schuine veld.
   Realisme: de pass vertrekt pas als de loopactie op gang is en is sneller dan de lopers; een lange bal gaat door de lucht
   (bal omhoog, schaduw blijft op het gras); tegenstanders schuiven licht mee met de bal; lopende spelers trekken een vaag spoor. */
function Film(svg, P) {
  drawPitch3D(svg);
  const club = getComputedStyle(document.documentElement).getPropertyValue('--club').trim() || '#db1e3b';
  const ghost = el('g', { class: 'ghost' }, svg); ghost.style.display = 'none';
  el('circle', { r: 2.4, fill: 'none', stroke: '#ffd84d', 'stroke-width': '.5', 'stroke-dasharray': '1 .7' }, ghost);
  const gTrail = el('g', { fill: 'none', 'stroke-linecap': 'round' }, svg);
  const gT = el('g', {}, svg);
  const cast = patCast(P), states = patStates(P);
  const toks = {};
  cast.forEach(c => {
    const t = makeToken(gT, true, club); t.g.classList.add('ftok'); t.g.dataset.n = c.n;
    t.lab.textContent = c.num; t.nm.textContent = c.show;
    t.g.setAttribute('aria-label', `${c.name}, nummer ${c.num}`);
    toks[c.n] = { ...t, y: c.y };
  });
  const opp = (states[0].opp || []).map(() => { const t = makeToken(gT, false); t.g.classList.add('fopp'); return { g: t.g, y: 0 }; });
  const shadow = el('ellipse', { rx: .8, ry: .25, fill: 'rgba(0,0,0,.4)' }, svg);
  const ballG = el('g', {}, svg); el('circle', { r: .75, fill: '#fff', stroke: '#111', 'stroke-width': '.18' }, ballG);
  const me = { states, cast, k: 0, playing: false, speed: 1, follow: null, names: true, onFrame: () => {}, raf: 0, t0: 0 };
  const put = (g, x, y, big) => { const [sx, sy, s] = proj(x, y); g.setAttribute('transform', `translate(${sx.toFixed(2)},${sy.toFixed(2)}) scale(${(s * (big ? 1.25 : 1)).toFixed(3)})`); return [sx, sy, s]; };
  const holderAt = (st, b) => b && Object.keys(st.pos).find(w => Math.hypot(b[0] - st.pos[w][0], b[1] - 3 - st.pos[w][1]) < 5);
  /* Per overgang: is het een pass (andere ontvanger) of een dribbel? */
  const kindOf = states.map((s, k) => {
    if (!k) return null; const a = states[k - 1];
    if (!a.ball || !s.ball || dist(a.ball, s.ball) < 3) return 'stil';
    const ha = holderAt(a, a.ball), hb = holderAt(s, s.ball);
    if (ha && ha === hb) return 'drib';
    return dist(a.ball, s.ball) > 30 ? 'lang' : 'pass';
  });
  function draw(a, b, p, kk) {
    const e = ease(Math.min(1, Math.max(0, p))), lerp = (u, v, f = e) => [u[0] + (v[0] - u[0]) * f, u[1] + (v[1] - u[1]) * f];
    const order = [];
    gTrail.innerHTML = '';
    cast.forEach(c => {
      const pa = a.pos[c.n], pb = b.pos[c.n], pos = lerp(pa, pb); toks[c.n].y = pos[1]; put(toks[c.n].g, pos[0], pos[1], me.follow === c.n); order.push(toks[c.n]);
      if (p > 0 && p < 1 && dist(pa, pb) > 4) {
        const back = lerp(pa, pb, Math.max(0, e - .35));
        el('polyline', { points: `${P2(back[0], back[1])} ${P2(pos[0], pos[1])}`, stroke: me.follow === c.n ? 'rgba(255,216,77,.55)' : 'rgba(255,255,255,.28)', 'stroke-width': '1.1' }, gTrail);
      }
    });
    /* bal */
    let bp = null, lift = 0;
    if (a.ball && b.ball) {
      const kind_ = kindOf[kk] || 'stil';
      if (kind_ === 'pass' || kind_ === 'lang') {
        const q = Math.min(1, Math.max(0, (p - .3) / (kind_ === 'lang' ? .62 : .5))), f = kind_ === 'lang' ? q : easeOut(q);
        bp = lerp(a.ball, b.ball, f);
        if (kind_ === 'lang') lift = Math.sin(Math.PI * q) * Math.min(7, dist(a.ball, b.ball) / 7);
      } else bp = lerp(a.ball, b.ball);
    }
    if (bp) {
      /* tegenstanders schuiven een beetje mee met de bal */
      opp.forEach((o, i) => { const pa = a.opp[i] || b.opp[i], pb = b.opp[i] || pa; if (!pa) return; const q = lerp(pa, pb); const pos = [q[0] + (bp[0] - q[0]) * .08, q[1] + (bp[1] - 3 - q[1]) * .05]; o.y = pos[1]; put(o.g, pos[0], pos[1]); order.push(o); });
      const gx = bp[0] + 2.4, gy = Math.min(101, bp[1] - .6), [sx, sy, sc] = proj(gx, gy);
      shadow.setAttribute('transform', `translate(${(sx + .3 * sc).toFixed(2)},${(sy + .7 * sc).toFixed(2)}) scale(${sc.toFixed(3)})`);
      ballG.setAttribute('transform', `translate(${sx.toFixed(2)},${(sy - lift * sc).toFixed(2)}) scale(${(sc * (1 + lift / 25)).toFixed(3)})`);
      shadow.style.display = ballG.style.display = '';
    } else {
      opp.forEach((o, i) => { const pa = a.opp[i] || b.opp[i], pb = b.opp[i] || pa; if (!pa) return; const pos = lerp(pa, pb); o.y = pos[1]; put(o.g, pos[0], pos[1]); order.push(o); });
      shadow.style.display = ballG.style.display = 'none';
    }
    order.sort((u, v) => (u.y + (u.lab ? .6 : 0)) - (v.y + (v.lab ? .6 : 0))).forEach(o => gT.appendChild(o.g));
    svg.appendChild(shadow); svg.appendChild(ballG);
  }
  function decorate() {
    cast.forEach(c => { const t = toks[c.n]; const on = me.follow === c.n; t.ring.style.display = on ? '' : 'none'; t.g.style.opacity = me.follow && !on ? '.42' : '1'; t.nm.style.display = me.names || on ? '' : 'none'; });
    opp.forEach(o => o.g.style.opacity = me.follow ? '.6' : '1');
  }
  const MOVE = 1700, HOLD = 800, END = 1800;
  function loop(ts) {
    if (!svg.isConnected) return stop();
    if (!me.t0) me.t0 = ts;
    const el_ = (ts - me.t0) * me.speed, n = states.length;
    if (me.k >= n - 1) { draw(states[n - 1], states[n - 1], 1, n - 1); if (el_ > END) { me.k = 0; me.t0 = ts; me.onFrame(0); } }
    else {
      draw(states[me.k], states[me.k + 1], el_ / MOVE, me.k + 1);
      if (el_ >= MOVE && !me.entered) { me.entered = true; me.onFrame(me.k + 1); }
      if (el_ > MOVE + HOLD) { me.k++; me.t0 = ts; me.entered = false; }
    }
    me.raf = requestAnimationFrame(loop);
  }
  function stop() { cancelAnimationFrame(me.raf); me.raf = 0; me.playing = false; }
  const total = () => (states.length - 1) * (MOVE + HOLD) + END;
  Object.assign(me, {
    svg, toks, duration: total,
    renderAt(t) { const seg = MOVE + HOLD, k = Math.floor(t / seg); if (k >= states.length - 1) { draw(states[states.length - 1], states[states.length - 1], 1, states.length - 1); return states.length - 1; } const r = t - k * seg; draw(states[k], states[k + 1], r / MOVE, k + 1); return r >= MOVE ? k + 1 : k; },
    show(k) { stop(); me.k = k; draw(states[k], states[k], 1, k); },
    play() { if (me.playing) return; me.playing = true; me.t0 = 0; me.entered = false; if (me.k >= states.length - 1) { me.k = 0; me.onFrame(0); } me.raf = requestAnimationFrame(loop); },
    pause() { const k = me.entered ? me.k + 1 : me.k; stop(); me.show(Math.min(k, states.length - 1)); },
    stop, decorate,
    segment(k, done) { stop(); const t0 = performance.now(); const step = ts => { if (!svg.isConnected) return; const p = (ts - t0) / MOVE; draw(states[k - 1], states[k], p, k); if (p < 1) me.raf = requestAnimationFrame(step); else { me.k = k; done && done(); } }; me.raf = requestAnimationFrame(step); },
    ghost(at) { if (!at) { ghost.style.display = 'none'; return; } ghost.style.display = ''; put(ghost, at[0], at[1]); }
  });
  draw(states[0], states[0], 1, 0); decorate();
  return me;
}
function viewPatterns() {
  const all = allPatterns();
  if (!all.length) { $('#view').innerHTML = `<div class="panel empty">Nog geen patronen.</div>`; return; }
  if (film) film.stop(); stopPlay();
  const mSys = sysOf(matchLineup());
  const fitsP = p => !S.opp || (p.data.tegen || []).includes(S.opp);
  let systems = FM().ORDER.filter(c => all.some(p => patSys(p) === c && fitsP(p)));
  const noFit = S.opp && !systems.length; if (noFit) systems = FM().ORDER.filter(c => all.some(p => patSys(p) === c));
  if (S.pmatch !== mSys) { S.pmatch = mSys; S.psys = null; }
  if (!S.psys || !systems.includes(S.psys)) S.psys = systems.includes(mSys) ? mSys : systems[0];
  const pats = all.filter(p => patSys(p) === S.psys && (noFit || fitsP(p)));
  if (!S.pat || !pats.find(p => p.id === S.pat)) { S.pat = pats[0].id; S.step = 0; }
  S.pmode ||= 'film';
  const P = curPat(), cast = patCast(P);
  if (S.follow && !cast.find(c => c.n === S.follow)) S.follow = null;
  if (!S.follow && S.mode === 'player' && S.me) S.follow = cast.find(c => c.pid === S.me.id)?.n || null;
  $('#view').innerHTML = `<div class="pickers">
      <label class="pick"><span>Systeem</span><select class="i" id="psysSel">${systems.map(c => `<option value="${c}" ${c === S.psys ? 'selected' : ''}>${c === mSys ? '★ ' : ''}${esc(FM().SYSTEMS[c].titel)}</option>`).join('')}</select></label>
      <label class="pick"><span>Patroon</span><select class="i" id="patSel">${pats.map(p => `<option value="${p.id}" ${p.id === S.pat ? 'selected' : ''}>${p.data.fase ? FASE[p.data.fase] + ' · ' : ''}${esc(p.title)}${p.own ? ' (eigen)' : p.data.edited ? ' (aangepast)' : ''}</option>`).join('')}</select></label>
      ${oppPicker()}</div>
    ${noFit ? `<p class="small fitline">Voor een tegenstander die “${esc(tegenLabel(S.opp).toLowerCase())}” is nog geen patroon gekoppeld; je ziet alle patronen.</p>` : ''}
    <div class="layout patlayout"><div>${S.pmode === 'film' ? '<div class="filmwrap"><svg class="pitch film" id="fpitch" aria-label="Geanimeerd spelpatroon"></svg></div>' : '<div class="filmwrap"><svg class="pitch film" id="ppitch" aria-label="Veld met spelpatroon"></svg></div>'}</div>
    <div class="panel"><div class="kicker" id="pstep"></div><h2 id="ptitle">${esc(P.title)}</h2>
      ${(P.data.tegen || []).length ? `<p class="small muted" style="margin:0 0 4px">Goed tegen: ${P.data.tegen.map(t => esc(tegenLabel(t).toLowerCase())).join(' · ')}</p>` : ''}
      <p class="caption" id="pcap" aria-live="polite"></p><p class="you" id="pyou" aria-live="polite"></p>
      ${S.pmode === 'film' ? `<div class="row mt"><button class="btn primary" id="fplay">▶ Afspelen</button><button class="btn" id="fslow" aria-pressed="${S.slow ? 'true' : 'false'}">${S.slow ? 'Normaal tempo' : 'Langzaam'}</button><button class="btn ghost" id="toStep">Stap voor stap</button></div>`
        : `<div class="row mt"><button class="btn" id="pprev">Vorige</button><button class="btn primary" id="pplay">Afspelen</button><button class="btn" id="pnext">Volgende</button><button class="btn ghost" id="toFilm">Film</button></div><p class="small muted mt">Witte lijn: pass. Gele stippellijn: loopactie. Witte stippen: dribbel.</p>`}
      <label class="f" for="pfol">Volg een speler</label><select class="i" id="pfol"><option value="">Niemand, het hele team</option>${cast.map(c => `<option value="${esc(c.n)}" ${c.n === S.follow ? 'selected' : ''}>${esc(c.name)} (${c.num})</option>`).join('')}</select>
      <div class="row mt"><button class="btn" id="quizB" ${S.follow ? '' : 'disabled'}>Waar loop jij naartoe?</button></div>
      <div id="quiz" class="quiz" hidden></div>
      <div class="row mt"><button class="btn" id="vidB">Deel als video</button>${S.staff ? `<button class="btn ghost" id="editP">Patroon aanpassen</button><button class="btn ghost" id="newP">Nieuw patroon</button>` : ''}</div></div></div>`;
  $('#vidB').onclick = () => { if (S.pmode !== 'film') { S.pmode = 'film'; viewPatterns(); } shareVideo(); };
  if (S.staff) { $('#editP').onclick = () => editPattern(curPat()); $('#newP').onclick = () => editPattern(null, S.psys); }
  $('#psysSel').onchange = () => { S.psys = $('#psysSel').value; S.pat = null; viewPatterns(); };
  $('#patSel').onchange = () => { S.pat = $('#patSel').value; S.step = 0; viewPatterns(); };
  wireOpp(() => { S.pat = null; viewPatterns(); });
  $('#pfol').onchange = () => { S.follow = $('#pfol').value || null; if (film) { film.follow = S.follow; film.decorate(); film.show(film.k); } $('#quizB').disabled = !S.follow; showCap(S.pmode === 'film' ? film.k : S.step); if (S.pmode !== 'film') drawPat(); };
  $('#quizB').onclick = () => startQuiz();
  if (S.pmode === 'film') {
    film = Film($('#fpitch'), P); film.follow = S.follow; film.speed = S.slow ? .5 : 1; film.decorate();
    film.onFrame = k => showCap(k);
    showCap(0);
    $('#fplay').onclick = () => { if (film.playing) { film.pause(); $('#fplay').textContent = '▶ Afspelen'; } else { closeQuiz(); film.play(); $('#fplay').textContent = '⏸ Pauze'; } };
    $('#fslow').onclick = () => { S.slow = !S.slow; film.speed = S.slow ? .5 : 1; $('#fslow').textContent = S.slow ? 'Normaal tempo' : 'Langzaam'; $('#fslow').setAttribute('aria-pressed', S.slow ? 'true' : 'false'); };
    $('#toStep').onclick = () => { S.pmode = 'stap'; S.step = film.k; viewPatterns(); };
  } else {
    film = null;
    patBoard = Board($('#ppitch'), 'p');
    $('#pprev').onclick = () => { stopPlay(); if (S.step > 0) { S.step--; drawPat(); } };
    $('#pnext').onclick = () => { stopPlay(); if (S.step < curPat().data.frames.length - 1) { S.step++; drawPat(); } };
    $('#pplay').onclick = () => { if (timer) return stopPlay(); S.step = 0; drawPat(true); $('#pplay').textContent = 'Pauze'; timer = setInterval(() => { if (S.step < curPat().data.frames.length - 1) { S.step++; drawPat(); } else stopPlay(); }, 2300); };
    $('#toFilm').onclick = () => { stopPlay(); S.pmode = 'film'; viewPatterns(); };
    drawPat(true);
  }
}
function showCap(k) {
  const P = curPat(), st = patStates(P), n = st.length;
  if (!$('#pcap')) return;
  $('#pstep').textContent = `${P.data.fase ? FASE[P.data.fase] + ' · ' : ''}Stap ${k + 1} van ${n}`;
  $('#pcap').textContent = patCap(P, st[k].cap);
  $('#pyou').textContent = S.follow ? youLine(P, st, k, S.follow) : '';
}
const curPat = () => allPatterns().find(p => p.id === S.pat);
function stopPlay() { if (timer) { clearInterval(timer); timer = null; } const b = $('#pplay'); if (b) b.textContent = 'Afspelen'; }
function drawPat(instant) {
  const P = curPat(), cast = patCast(P), st = patStates(P), f = st[S.step], fr = P.data.frames[S.step];
  const list = cast.map(c => ({ key: 's' + c.n, name: c.show, label: c.num, x: f.pos[c.n][0], y: f.pos[c.n][1] }));
  (f.opp || []).forEach((o, i) => list.push({ key: 'o' + i, team: 'opp', x: o[0], y: o[1] }));
  patBoard.render(list, instant); patBoard.ball(fr.ball); patBoard.arrows(fr.ar);
  patBoard.svg.querySelectorAll('.tok').forEach(g => { g.style.opacity = S.follow && g.dataset.key !== 's' + S.follow && g.dataset.key[0] === 's' ? '.45' : '1'; const r = g.querySelector('.ring'); if (r) r.style.display = g.dataset.key === 's' + S.follow ? '' : 'none'; });
  showCap(S.step);
  $('#pprev').disabled = S.step === 0; $('#pnext').disabled = S.step === st.length - 1;
}
/* ---- quiz: waar loop jij naartoe? ---- */
let quiz = null;
function closeQuiz() { quiz = null; const q = $('#quiz'); if (q) { q.hidden = true; q.innerHTML = ''; } if (film) film.ghost(null); }
function startQuiz() {
  const P = curPat(), st = patStates(P), n = S.follow;
  if (!n) return;
  if (S.pmode !== 'film') { S.pmode = 'film'; viewPatterns(); }
  const qs = st.map((s, k) => k).filter(k => k > 0 && dist(st[k - 1].pos[n], st[k].pos[n]) > 5);
  const box = $('#quiz'); box.hidden = false;
  if (!qs.length) { box.innerHTML = `<p><strong>In dit patroon blijf jij op je plek.</strong> Kies een ander patroon, of volg een andere speler.</p>`; return; }
  quiz = { qs, i: 0, good: 0, n };
  film.stop(); $('#fplay').textContent = '▶ Afspelen';
  askQuiz();
}
function askQuiz() {
  const P = curPat(), st = patStates(P), q = quiz, k = q.qs[q.i], name = patCast(P).find(c => c.n === q.n).name;
  film.show(k - 1); film.ghost(null); showCap(k - 1);
  $('#pyou').textContent = '';
  $('#quiz').innerHTML = `<div class="kicker">Vraag ${q.i + 1} van ${q.qs.length}</div><p><strong>${esc(name)}, waar loop jij nu naartoe?</strong> Sleep je gele rondje naar de plek waar je heen gaat.</p>`;
  const tok = film.toks[q.n].g, svg = film.svg; let drag = false, pos = st[k - 1].pos[q.n].slice();
  const toSvg = e => { const pt = svg.createSVGPoint(); pt.x = e.clientX; pt.y = e.clientY; return pt.matrixTransform(svg.getScreenCTM().inverse()); };
  const move = e => { if (!drag) return; e.preventDefault(); const p = toSvg(e); pos = unproj(p.x, p.y); const [sx, sy, s] = proj(pos[0], pos[1]); tok.setAttribute('transform', `translate(${sx},${sy}) scale(${s * 1.25})`); };
  const up = () => {
    if (!drag) return; drag = false; svg.removeEventListener('pointermove', move); svg.removeEventListener('pointerup', up); svg.removeEventListener('pointercancel', up);
    const target = st[k].pos[q.n], d = dist(pos, target);
    const verdict = d < 7 ? ['Goed!', 'good'] : d < 13 ? ['Bijna!', 'close'] : ['Kijk goed waar je heen gaat.', 'miss'];
    if (d < 7) q.good++;
    film.ghost(target);
    film.segment(k, () => {
      $('#pyou').textContent = youLine(P, st, k, q.n); showCap(k); $('#pyou').textContent = youLine(P, st, k, q.n);
      const last = q.i === q.qs.length - 1;
      $('#quiz').innerHTML = `<p class="verdict ${verdict[1]}"><strong>${verdict[0]}</strong> ${d < 7 ? '' : 'Het gele rondje is de goede plek.'}</p>${last ? `<p><strong>Klaar: je had er ${q.good} van de ${q.qs.length} goed.</strong></p><div class="row"><button class="btn" id="qAgain">Nog een keer</button></div>` : '<div class="row"><button class="btn primary" id="qNext">Volgende vraag</button></div>'}`;
      if ($('#qNext')) $('#qNext').onclick = () => { q.i++; askQuiz(); };
      if ($('#qAgain')) $('#qAgain').onclick = () => startQuiz();
    });
  };
  tok.style.cursor = 'grab'; tok.style.touchAction = 'none';
  tok.onpointerdown = e => { if (!quiz || quiz.qs[quiz.i] !== k) return; e.preventDefault(); drag = true; svg.addEventListener('pointermove', move); svg.addEventListener('pointerup', up); svg.addEventListener('pointercancel', up); };
}

/* ---- delen als video ---- */
async function shareVideo() {
  const P = curPat(), btn = $('#vidB'); if (!P || !film) return;
  if (!('VideoEncoder' in window)) return toast('Deze browser kan geen video maken. Probeer Chrome of Safari.');
  btn.disabled = true; const label = btn.textContent;
  try {
    const { Muxer, ArrayBufferTarget } = await import('https://cdn.jsdelivr.net/npm/mp4-muxer@5.1.3/+esm');
    const W = 720, H = 1080, FPS = 25, FH = Math.round(W * 106 / 100), TOP = 70;
    let cfg = null;
    for (const c of [{ codec: 'avc1.42001f', m: 'avc' }, { codec: 'avc1.4d0028', m: 'avc' }, { codec: 'vp09.00.10.08', m: 'vp9' }]) {
      const conf = { codec: c.codec, width: W, height: H, bitrate: 2_500_000, framerate: FPS };
      if ((await VideoEncoder.isConfigSupported(conf).catch(() => ({}))).supported) { cfg = { conf, m: c.m }; break; }
    }
    if (!cfg) throw new Error('geen videocodec');
    const muxer = new Muxer({ target: new ArrayBufferTarget(), video: { codec: cfg.m, width: W, height: H }, fastStart: 'in-memory' });
    let fail = null;
    const enc = new VideoEncoder({ output: (ch, meta) => muxer.addVideoChunk(ch, meta), error: e => { fail = e; } });
    enc.configure(cfg.conf);
    const cv = document.createElement('canvas'); cv.width = W; cv.height = H; const ctx = cv.getContext('2d');
    const club = getComputedStyle(document.documentElement).getPropertyValue('--club').trim() || '#db1e3b';
    const st = patStates(P), total = film.duration(), n = Math.ceil(total / 1000 * FPS);
    const wasPlaying = film.playing; film.stop();
    const wrap = (text, max) => { const words = String(text).split(' '), lines = []; let l = ''; words.forEach(w => { const t = l ? l + ' ' + w : w; if (ctx.measureText(t).width > max && l) { lines.push(l); l = w; } else l = t; }); if (l) lines.push(l); return lines; };
    for (let i = 0; i <= n; i++) {
      if (fail) throw fail;
      const k = film.renderAt(i * 1000 / FPS);
      const svgTxt = new XMLSerializer().serializeToString(film.svg).replace('<svg', `<svg width="${W}" height="${FH}"`);
      const img = new Image(); img.src = URL.createObjectURL(new Blob([svgTxt], { type: 'image/svg+xml' }));
      await img.decode(); URL.revokeObjectURL(img.src);
      ctx.fillStyle = '#0d1014'; ctx.fillRect(0, 0, W, H);
      ctx.drawImage(img, 0, TOP, W, FH);
      ctx.fillStyle = club; ctx.fillRect(0, 0, W, TOP);
      ctx.fillStyle = '#fff'; ctx.font = '800 30px Barlow Condensed, Arial Narrow, sans-serif'; ctx.textBaseline = 'middle';
      ctx.fillText(`${FM().SYSTEMS[patSys(P)].naam} · ${P.title}`.toUpperCase().slice(0, 52), 22, TOP / 2);
      const capY = TOP + FH + 46;
      ctx.font = '600 28px Barlow, Arial, sans-serif'; ctx.fillStyle = '#fff'; ctx.textBaseline = 'alphabetic';
      let y = capY + 10; wrap(patCap(P, st[k].cap), W - 44).slice(0, 3).forEach(line => { ctx.fillText(line, 22, y); y += 36; });
      if (S.follow) { ctx.font = '700 27px Barlow, Arial, sans-serif'; ctx.fillStyle = '#ffd84d'; wrap(youLine(P, st, k, S.follow), W - 44).slice(0, 2).forEach(line => { ctx.fillText(line, 22, y + 4); y += 34; }); }
      ctx.font = '700 22px Barlow, Arial, sans-serif'; ctx.fillStyle = 'rgba(255,255,255,.55)'; ctx.fillText(`Stap ${k + 1} van ${st.length} · ${S.team.name}`, 22, H - 18);
      const vf = new VideoFrame(cv, { timestamp: Math.round(i * 1e6 / FPS), duration: Math.round(1e6 / FPS) });
      enc.encode(vf, { keyFrame: i % (FPS * 2) === 0 }); vf.close();
      if (i % 10 === 0) { btn.textContent = `Video maken… ${Math.round(i / n * 100)}%`; await new Promise(r => setTimeout(r)); }
    }
    await enc.flush(); muxer.finalize();
    film.show(0); if (wasPlaying) film.play();
    const name = `${P.title.replace(/[^\w\- ]+/g, '').trim().replace(/\s+/g, '-').toLowerCase() || 'patroon'}.mp4`;
    const file = new File([muxer.target.buffer], name, { type: 'video/mp4' });
    S.lastVideo = file;
    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      try { await navigator.share({ files: [file], title: P.title, text: `${P.title} (${FM().SYSTEMS[patSys(P)].naam})` }); }
      catch (e) { if (e.name !== 'AbortError') downloadFile(file); }
    } else downloadFile(file);
    toast('Video klaar');
  } catch (e) { toast('Video maken lukte niet: ' + (e.message || e)); }
  finally { btn.disabled = false; btn.textContent = label; }
}
function downloadFile(file) { const a = document.createElement('a'); a.href = URL.createObjectURL(file); a.download = file.name; document.body.appendChild(a); a.click(); setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 2000); }

/* ---- animatiebord: zelf een patroon maken of aanpassen ---- */
function editPattern(P0, sys0) {
  stopPlay(); if (film) film.stop(); closeQuiz();
  const sys = P0 ? patSys(P0) : sys0;
  const tmp = P0 || { title: 'Nieuw patroon', data: { sys, frames: [{ ball: null, opp: FM().OPP, cap: '' }] } };
  const restore = P0 && !P0.lib && P0.data.edited && FM().PATTERNS.some(x => x.id === P0.data.slug);
  const cast = patCast(tmp), first = patStates(tmp);
  const holderOf = s => { if (!s.ball) return ''; if (s.ball[1] <= 3) return '__goal'; const own = Object.entries(s.pos).find(([, p]) => Math.hypot(s.ball[0] - p[0], s.ball[1] - 3 - p[1]) < 5); if (own) return own[0]; const oi = s.opp.findIndex(o => Math.hypot(s.ball[0] - o[0], s.ball[1] - o[1]) < 6); return oi >= 0 ? 'o' + oi : ''; };
  const E = { title: tmp.title, sys, k: 0, steps: first.map(s => ({ pos: JSON.parse(JSON.stringify(s.pos)), opp: JSON.parse(JSON.stringify(s.opp)), hold: holderOf(s), cap: s.cap || '' })) };
  if (!E.steps[0].hold) E.steps[0].hold = cast[0].n;
  const ballOf = s => s.hold === '__goal' ? [50, 2] : s.hold?.[0] === 'o' && /^o\d+$/.test(s.hold) ? [s.opp[+s.hold.slice(1)][0], s.opp[+s.hold.slice(1)][1] + 2] : s.pos[s.hold] ? [s.pos[s.hold][0], s.pos[s.hold][1] + 3] : null;
  $('#view').innerHTML = `<div class="kicker">Animatiebord · ${esc(FM().SYSTEMS[sys].naam)}</div>
    <div class="layout patlayout"><div><div class="filmwrap"><svg class="pitch film edit" id="epitch" aria-label="Animatiebord"></svg></div><p class="small muted">Sleep spelers en pionnen naar waar ze in deze stap staan. Geef de bal aan een speler hieronder.</p></div>
    <div class="panel"><label class="f" for="etitle">Naam van het patroon</label><input class="i" id="etitle" maxlength="60" value="${esc(E.title)}">
      <div class="row mt" style="justify-content:space-between"><strong id="estep"></strong><div class="row"><button class="btn" id="eprev" aria-label="Vorige stap">‹</button><button class="btn" id="enext" aria-label="Volgende stap">›</button></div></div>
      <label class="f" for="ehold">Bal bij</label><select class="i" id="ehold"></select>
      <label class="f" for="ecap">Uitleg bij deze stap</label><textarea class="i" id="ecap" maxlength="240" placeholder="Bijvoorbeeld: Sasha speelt in op Amine, die tussen de linies vrij staat."></textarea>
      <div class="row mt"><button class="btn" id="eadd">+ Stap erbij</button><button class="btn ghost" id="edel">Stap weg</button></div>
      <div class="row mt"><button class="btn primary" id="esave">Opslaan</button><button class="btn ghost" id="ecancel">Annuleren</button>${P0 && !P0.lib ? `<button class="btn danger" id="eremove">${restore ? 'Terug naar origineel' : 'Patroon verwijderen'}</button>` : ''}</div>${P0?.lib ? '<p class="small muted mt">Dit patroon komt uit de kennisbank. Opslaan bewaart jouw aangepaste versie; het origineel blijft bewaard.</p>' : ''}</div></div>`;
  const board = Board($('#epitch'), 'e');
  const svg = $('#epitch');
  function paint(instant) {
    const s = E.steps[E.k];
    const list = cast.map(c => ({ key: 's' + c.n, name: c.show || c.name, label: c.num, x: s.pos[c.n][0], y: s.pos[c.n][1] }));
    s.opp.forEach((o, i) => list.push({ key: 'o' + i, team: 'opp', x: o[0], y: o[1] }));
    board.render(list, instant); board.ball(ballOf(s));
    if (E.k > 0) { const p = E.steps[E.k - 1], ar = []; cast.forEach(c => { const a = p.pos[c.n], b = s.pos[c.n]; if (dist(a, b) > 2) ar.push([a[0], a[1], b[0], b[1], s.hold === c.n && p.hold === c.n ? 'drib' : 'run']); }); const pb = ballOf(p), nb = ballOf(s); if (pb && nb && p.hold !== s.hold) ar.push([pb[0], pb[1] - 3, nb[0], nb[1] - 3, 'pass']); board.arrows(ar); } else board.arrows([]);
    $('#estep').textContent = `Stap ${E.k + 1} van ${E.steps.length}`;
    $('#ehold').innerHTML = cast.map(c => `<option value="${esc(c.n)}">${esc(c.name)}</option>`).join('') + '<option value="__opp">Een tegenstander (dichtstbij)</option><option value="__goal">Schot op doel</option>';
    $('#ehold').value = s.hold?.[0] === 'o' && /^o\d+$/.test(s.hold) ? '__opp' : s.hold || '';
    $('#ecap').value = s.cap; $('#eprev').disabled = E.k === 0; $('#enext').disabled = E.k === E.steps.length - 1; $('#edel').disabled = E.steps.length < 2;
  }
  $('#ehold').onchange = () => {
    const s = E.steps[E.k], v = $('#ehold').value;
    if (v === '__opp') { const b = ballOf(s) || [50, 50]; let bi = 0, bd = 1e9; s.opp.forEach((o, i) => { const d = dist(o, b); if (d < bd) { bd = d; bi = i; } }); s.hold = 'o' + bi; } else s.hold = v;
    paint();
  };
  $('#ecap').oninput = () => { E.steps[E.k].cap = $('#ecap').value; };
  $('#eprev').onclick = () => { E.k--; paint(true); };
  $('#enext').onclick = () => { E.k++; paint(true); };
  $('#eadd').onclick = () => { const s = E.steps[E.k]; E.steps.splice(E.k + 1, 0, { pos: JSON.parse(JSON.stringify(s.pos)), opp: JSON.parse(JSON.stringify(s.opp)), hold: s.hold, cap: '' }); E.k++; paint(true); $('#ecap').focus(); };
  $('#edel').onclick = () => { if (E.steps.length < 2) return; E.steps.splice(E.k, 1); E.k = Math.max(0, E.k - 1); paint(true); };
  $('#ecancel').onclick = () => viewPatterns();
  if ($('#eremove')) $('#eremove').onclick = async () => { if (!confirm(restore ? 'Jouw aanpassing weggooien en het origineel terugzetten?' : 'Dit patroon verwijderen?')) return; await deleteContent(P0); S.pat = restore ? 'lib-' + P0.data.slug : null; viewPatterns(); };
  $('#esave').onclick = async () => {
    const title = $('#etitle').value.trim(); if (!title) return toast('Geef het patroon een naam');
    if (E.steps.some(s => !s.cap.trim())) return toast('Schrijf bij elke stap een korte uitleg');
    const base = Object.fromEntries(FM().SYSTEMS[sys].slots.map(t => [t.id, [t.x, t.y]]));
    const frames = E.steps.map((s, k) => {
      const prev = k ? E.steps[k - 1] : { pos: base, hold: null }, f = { ball: ballOf(s), opp: s.opp.map(o => [Math.round(o[0]), Math.round(o[1])]), cap: s.cap.trim() };
      const set = {}; cast.forEach(c => { if (dist(prev.pos[c.n], s.pos[c.n]) > 1) set[c.n] = s.pos[c.n].map(Math.round); }); if (Object.keys(set).length) f.set = set;
      if (k) { const ar = []; cast.forEach(c => { const a = prev.pos[c.n], b = s.pos[c.n]; if (dist(a, b) > 2) ar.push([a, b, s.hold === c.n && prev.hold === c.n ? 'drib' : 'run']); }); const pb = ballOf(prev), nb = ballOf(s); if (pb && nb && prev.hold !== s.hold) ar.push([[pb[0], pb[1] - 3], [nb[0], nb[1] - 3], 'pass']); if (ar.length) f.ar = ar.map(([a, b, t]) => [Math.round(a[0]), Math.round(a[1]), Math.round(b[0]), Math.round(b[1]), t]); }
      if (f.ball) f.ball = f.ball.map(Math.round);
      return f;
    });
    const data = { ...(P0?.data || {}), sys, frames, slug: P0?.data.slug || 'eigen-' + Date.now(), edited: true };
    if (P0 && !P0.lib) await saveContent(P0, { title, data }); else { const row = await insertContent('pattern', title, data); if (!row) return; S.pat = row.id; }
    S.psys = sys; toast('Patroon opgeslagen'); viewPatterns();
  };
  let drag = null;
  const toField = e => board.toField(e);
  svg.addEventListener('pointerdown', e => { const g = e.target.closest('.tok'); if (!g) return; e.preventDefault(); drag = g.dataset.key; svg.setPointerCapture?.(e.pointerId); svg.classList.add('noanim'); });
  svg.addEventListener('pointermove', e => {
    if (!drag) return; e.preventDefault(); const [x, y] = toField(e), s = E.steps[E.k];
    if (drag[0] === 's') s.pos[drag.slice(1)] = [x, y]; else s.opp[+drag.slice(1)] = [x, y];
    board.place(drag, x, y); board.ball(ballOf(s));
  });
  const end = () => { if (!drag) return; drag = null; svg.classList.remove('noanim'); paint(); };
  svg.addEventListener('pointerup', end); svg.addEventListener('pointercancel', end);
  paint(true);
}

/* ---------------- trainingen ---------------- */
function drillSVG(d, key) {
  const p = 'd' + key;
  let s = `<svg viewBox="0 0 100 70" role="img" aria-label="Schets"><defs>`;
  [['W', '#ffffff'], ['Y', '#ffd84d']].forEach(([n, c]) => { s += `<marker id="${p}${n}" viewBox="0 0 6 6" refX="5" refY="3" markerWidth="4" markerHeight="4" orient="auto"><path d="M0,0 L6,3 L0,6 z" fill="${c}"/></marker>`; });
  s += `<linearGradient id="${p}g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#2f7a46"/><stop offset="1" stop-color="#1d5631"/></linearGradient></defs><rect width="100" height="70" fill="url(#${p}g)"/>`;
  for (let i = 0; i < 10; i += 2) s += `<rect x="${i * 10}" width="10" height="70" fill="#fff" opacity=".035"/>`;
  (d.el || []).forEach(([t, a, b, c, dd]) => {
    if (t === 'z') s += `<rect x="${a}" y="${b}" width="${c}" height="${dd}" fill="rgba(255,255,255,.06)" stroke="rgba(255,255,255,.75)" stroke-width=".4" stroke-dasharray="1.5 1" rx="1"/>`;
    if (t === 'l') s += `<line x1="${a}" y1="${b}" x2="${c}" y2="${dd}" stroke="rgba(255,255,255,.8)" stroke-width=".4" stroke-dasharray="1.5 1"/>`;
  });
  (d.ar || []).forEach(a => {
    const at = a[4] === 'run' ? `stroke="#ffd84d" stroke-width=".55" stroke-dasharray="1.3 .9" marker-end="url(#${p}Y)"` : a[4] === 'drib' ? `stroke="#fff" stroke-width=".55" stroke-dasharray=".3 .8" stroke-linecap="round" marker-end="url(#${p}W)"` : `stroke="#fff" stroke-width=".5" marker-end="url(#${p}W)"`;
    s += `<line x1="${a[0]}" y1="${a[1]}" x2="${a[2]}" y2="${a[3]}" fill="none" ${at}/>`;
  });
  (d.el || []).forEach(([t, a, b, c]) => {
    if (t === 'g') s += `<rect x="${a - 1.5}" y="${b - c / 2}" width="3" height="${c}" fill="#fff" stroke="#111" stroke-width=".3"/>`;
    if (t === 'c') s += `<path d="M${a},${b - 2} L${a + 1.8},${b + 1.4} L${a - 1.8},${b + 1.4} z" fill="#ff8a1f"/>`;
    if (t === 'p' || t === 'o' || t === 'n') {
      const fill = t === 'p' ? 'var(--club)' : t === 'o' ? '#e9edf2' : '#ffd84d';
      s += `<path transform="translate(${a} ${b}) scale(.8)" d="${SHIRT}" fill="${fill}" stroke="rgba(0,0,0,.55)" stroke-width=".4"/>`;
    }
  });
  (d.el || []).forEach(e => { if (e[0] === 'b') s += `<circle cx="${e[1]}" cy="${e[2]}" r="1.4" fill="#fff" stroke="#111" stroke-width=".3"/>`; });
  return s + '</svg>';
}
let session = store.get('sb:sessie') || [];
function viewTrainings() {
  const drills = kind('drill'), plans = kind('plan');
  const bySlug = sl => drills.find(d => d.data.slug === sl || d.id === sl);
  const TF = ['Alle', ...new Set(drills.map(d => d.data.tf).filter(Boolean))];
  const list = drills.filter(d => S.tf === 'Alle' || d.data.tf === S.tf);
  const sessItems = session.map(bySlug).filter(Boolean);
  const tot = sessItems.reduce((a, d) => a + (+d.data.min || 0), 0);
  $('#view').innerHTML = `
    <div class="grid two">
      <div class="panel"><div class="kicker">Weekplan</div><h2>Trainingsplan</h2>
        ${plans.length ? `<ol class="clean">${plans.map(p => { const ds = (p.data.drills || []).map(bySlug).filter(Boolean); return `<li><strong>${esc(p.data.weken || '')}: ${esc(p.title)}</strong><br><span class="small muted">${esc(p.data.prob || '')} ${ds.reduce((a, d) => a + (+d.data.min || 0), 0)} minuten.</span><br><span class="small">${ds.map(d => esc(d.title)).join(', ')}</span><div class="row" style="margin:6px 0 10px"><button class="btn" data-plan="${p.id}">Gebruik deze training</button>${S.staff ? `<button class="btn ghost" data-eplan="${p.id}">Aanpassen</button>` : ''}</div></li>`; }).join('')}</ol>` : '<p class="muted">Nog geen weekplan.</p>'}
        ${S.staff ? '<button class="btn ghost" id="addPlan">Week toevoegen</button>' : ''}</div>
      <div class="panel" id="sess"><div class="kicker">Klaarzetten</div><h2>Jouw training</h2>
        ${sessItems.length ? `<ol class="clean">${sessItems.map((d, i) => `<li>${esc(d.title)} (${+d.data.min || 0} min) <button class="btn ghost" style="padding:2px 8px" data-rm="${i}" aria-label="Verwijderen">✕</button></li>`).join('')}</ol><p><strong>Totaal ${tot} minuten</strong></p><div class="row"><button class="btn primary" id="copyS">Training kopiëren</button><button class="btn ghost" id="clrS">Leegmaken</button></div>` : '<p class="muted">Kies een week uit het plan of voeg hieronder oefenvormen toe.</p>'}</div>
    </div>
    <div class="row mt" style="justify-content:space-between"><h2 class="h-cond" style="margin:8px 0;text-transform:uppercase">Oefenvormen</h2>${S.staff ? '<button class="btn primary" id="addDrill">Nieuwe oefenvorm</button>' : ''}</div>
    <div class="chips">${TF.map(t => `<button data-tf="${esc(t)}" class="${t === S.tf ? 'on' : ''}">${esc(t)}</button>`).join('')}</div>
    <div class="grid two">${list.map(d => { const inS = session.includes(d.data.slug || d.id); const x = d.data; return `<article class="panel drill">${drillSVG(x, d.id.slice(0, 8))}<div class="kicker">${esc(x.tf || '')} · ${+x.min || 0} min</div><h3>${esc(d.title)}</h3>
      ${x.prob ? `<p style="margin:0"><strong>Probleem:</strong> ${esc(x.prob)}</p>` : ''}
      <details><summary>Waarom en hoe</summary>${x.waarom ? `<p><strong>Waarom.</strong> ${esc(x.waarom)}</p>` : ''}${x.uitleg ? `<p><strong>Organisatie.</strong> ${esc(x.uitleg)}</p>` : ''}${(x.coach || []).length ? `<ul>${x.coach.map(c => `<li>${esc(c)}</li>`).join('')}</ul>` : ''}${x.vari ? `<p><strong>Makkelijker of moeilijker.</strong> ${esc(x.vari)}</p>` : ''}</details>
      <div class="row"><button class="btn ${inS ? '' : 'primary'}" data-add="${esc(d.data.slug || d.id)}">${inS ? 'In de training' : 'Toevoegen'}</button>${S.staff ? `<button class="btn ghost" data-edit="${d.id}">Bewerken</button>` : ''}</div></article>`; }).join('')}</div>`;
  const saveS = () => { store.set('sb:sessie', session); viewTrainings(); };
  document.querySelectorAll('[data-tf]').forEach(b => b.onclick = () => { S.tf = b.dataset.tf; viewTrainings(); });
  document.querySelectorAll('[data-add]').forEach(b => b.onclick = () => { const k = b.dataset.add; session = session.includes(k) ? session.filter(x => x !== k) : [...session, k]; saveS(); });
  document.querySelectorAll('[data-rm]').forEach(b => b.onclick = () => { session.splice(+b.dataset.rm, 1); saveS(); });
  document.querySelectorAll('[data-plan]').forEach(b => b.onclick = () => { const p = plans.find(x => x.id === b.dataset.plan); session = [...(p.data.drills || [])]; saveS(); toast(`${p.title} staat klaar`); });
  if ($('#clrS')) $('#clrS').onclick = () => { session = []; saveS(); };
  if ($('#copyS')) $('#copyS').onclick = () => copy(`Training ${S.team.name}, totaal ${tot} minuten\n\n` + sessItems.map((d, i) => `${i + 1}. ${d.title} (${d.data.min} min)\nDoel: ${d.data.doel || ''}\nOrganisatie: ${d.data.uitleg || ''}\nCoachpunten: ${(d.data.coach || []).join('; ')}`).join('\n\n'), 'Training gekopieerd, plak hem in WhatsApp of e-mail');
  if (S.staff) {
    document.querySelectorAll('[data-edit]').forEach(b => b.onclick = () => editDrill(drills.find(d => d.id === b.dataset.edit)));
    $('#addDrill').onclick = () => editDrill(null);
    document.querySelectorAll('[data-eplan]').forEach(b => b.onclick = () => editPlan(plans.find(p => p.id === b.dataset.eplan), drills));
    $('#addPlan').onclick = () => editPlan(null, drills);
  }
}
function editDrill(d) {
  const x = d?.data || { tf: 'Opbouwen', min: 15, coach: [], el: [], ar: [] };
  openDialog(`<h2>${d ? 'Oefenvorm bewerken' : 'Nieuwe oefenvorm'}</h2>
    <label class="f" for="dt">Naam</label><input class="i" id="dt" value="${esc(d?.title || '')}" maxlength="120">
    <div class="grid two"><div><label class="f" for="dtf">Teamtaak</label><input class="i" id="dtf" value="${esc(x.tf || '')}"></div><div><label class="f" for="dm">Minuten</label><input class="i" id="dm" type="number" min="1" max="90" value="${+x.min || 15}"></div></div>
    <label class="f" for="dp">Probleem dat het oplost</label><textarea class="i" id="dp">${esc(x.prob || '')}</textarea>
    <label class="f" for="dw">Waarom deze vorm</label><textarea class="i" id="dw">${esc(x.waarom || '')}</textarea>
    <label class="f" for="du">Organisatie</label><textarea class="i" id="du">${esc(x.uitleg || '')}</textarea>
    <label class="f" for="dc">Coachpunten (één per regel)</label><textarea class="i" id="dc">${esc((x.coach || []).join('\n'))}</textarea>
    <label class="f" for="dv">Makkelijker of moeilijker</label><textarea class="i" id="dv">${esc(x.vari || '')}</textarea>`,
    [...(d ? [['Verwijderen', 'danger', async () => { if (confirm('Deze oefenvorm verwijderen?')) { await deleteContent(d); viewTrainings(); } }]] : []),
    ['Annuleren'], ['Opslaan', 'primary', async () => {
      const title = $('#dt').value.trim(); if (!title) return toast('Geef de oefenvorm een naam');
      const data = { ...x, tf: $('#dtf').value.trim(), min: +$('#dm').value || 15, prob: $('#dp').value.trim(), waarom: $('#dw').value.trim(), uitleg: $('#du').value.trim(), coach: $('#dc').value.split('\n').map(s => s.trim()).filter(Boolean), vari: $('#dv').value.trim() };
      if (d) await saveContent(d, { title, data }); else { const r = await insertContent('drill', title, data); if (r) { r.data.slug = r.id; await saveContent(r, { data: r.data }); } }
      viewTrainings();
    }]]);
}
function editPlan(p, drills) {
  const x = p?.data || { drills: [] };
  openDialog(`<h2>${p ? 'Week aanpassen' : 'Week toevoegen'}</h2>
    <label class="f" for="pw">Weken</label><input class="i" id="pw" value="${esc(x.weken || '')}" placeholder="Week 9">
    <label class="f" for="pt">Thema</label><input class="i" id="pt" value="${esc(p?.title || '')}">
    <label class="f" for="pp">Probleem</label><textarea class="i" id="pp">${esc(x.prob || '')}</textarea>
    <label class="f">Oefenvormen</label><div class="grid two">${drills.map(d => { const k = d.data.slug || d.id; return `<label class="small"><input type="checkbox" class="pdc" value="${esc(k)}" ${(x.drills || []).includes(k) ? 'checked' : ''}> ${esc(d.title)}</label>`; }).join('')}</div>`,
    [...(p ? [['Verwijderen', 'danger', async () => { if (confirm('Deze week verwijderen?')) { await deleteContent(p); viewTrainings(); } }]] : []),
    ['Annuleren'], ['Opslaan', 'primary', async () => {
      const title = $('#pt').value.trim() || 'Thema';
      const data = { weken: $('#pw').value.trim(), prob: $('#pp').value.trim(), drills: [...document.querySelectorAll('.pdc:checked')].map(c => c.value) };
      if (p) await saveContent(p, { title, data }); else await insertContent('plan', title, data);
      viewTrainings();
    }]]);
}

/* ---------------- spelers ---------------- */
function viewPlayers() {
  const ps = S.players.filter(p => p.active);
  const ls = lineups(); const L = curLineup();
  $('#view').innerHTML = `<div class="pickers"><label class="pick"><span>Systeem</span><select class="i" id="scSel">${ls.map(l => `<option value="${l.id}" ${l.id === L?.id ? 'selected' : ''}>${l.data.match ? '★ ' : ''}${esc(lineupTitle(l))}</option>`).join('')}</select></label></div>
    <p class="muted small" style="margin:0 0 12px">De taken volgen uit de plek in “${esc(lineupTitle(L))}”. Kies een ander systeem om te zien wat er dan verandert.</p>
    ${S.staff ? `<div class="row" style="margin-bottom:12px"><button class="btn primary" id="addP">Speler toevoegen</button><button class="btn" id="roles">Taken per positie</button></div>` : ''}
    <div class="grid two">${ps.map(p => `<article class="panel">${cardHTML(p, { lineup: L })}${S.staff ? `<div class="row mt"><span class="badge">${p.consent_at ? 'Toestemming gegeven' : 'Nog geen toestemming'}</span><button class="btn ghost" data-ep="${p.id}">Bewerken</button><button class="btn" data-link="${p.id}">Spelerslink</button></div>` : ''}</article>`).join('') || '<div class="panel empty">Nog geen spelers.</div>'}</div>`;
  $('#scSel').onchange = () => { S.scen = $('#scSel').value; viewPlayers(); };
  if (S.staff) {
    $('#addP').onclick = () => editPlayer(null);
    $('#roles').onclick = () => viewRoles();
    document.querySelectorAll('[data-ep]').forEach(b => b.onclick = () => editPlayer(playerById(b.dataset.ep)));
    document.querySelectorAll('[data-link]').forEach(b => b.onclick = () => playerLink(playerById(b.dataset.link)));
  }
}
function viewRoles() {
  const rcs = roleCards();
  $('#view').innerHTML = `<div class="row" style="justify-content:space-between;margin-bottom:12px"><button class="btn ghost" id="back">‹ Terug naar spelers</button><button class="btn primary" id="addR">Positie toevoegen</button></div>
    <p class="muted small" style="margin:0 0 12px">Pas hier de taken per positie aan. Iedere speler die op die positie staat, krijgt deze taken en oefeningen automatisch.</p>
    <div class="grid two">${rcs.map(r => `<article class="panel"><div class="kicker">${esc(r.data.role)}</div><h3>${esc(r.title)}</h3><dl class="task"><dt>Wij hebben de bal</dt><dd>${esc(r.data.bal || '')}</dd><dt>Zij hebben de bal</dt><dd>${esc(r.data.geen || '')}</dd></dl><div class="row mt"><button class="btn ghost" data-er="${r.id}">Bewerken</button></div></article>`).join('')}</div>`;
  $('#back').onclick = () => viewPlayers();
  $('#addR').onclick = () => editRole(null);
  document.querySelectorAll('[data-er]').forEach(b => b.onclick = () => editRole(rcs.find(r => r.id === b.dataset.er)));
}
function editRole(rc) {
  const x = { ...(FM().ROLES[rc?.data.role] || {}), ...(rc?.data || { role: '', extra: [], drills: [], home: [] }) };
  const cb = (k, list, cls) => kind(k).map(d => { const sl = d.data.slug || d.id; return `<label class="small"><input type="checkbox" class="${cls}" value="${esc(sl)}" ${(list || []).includes(sl) ? 'checked' : ''}> ${esc(d.title)}</label>`; }).join('');
  openDialog(`<h2>${rc ? 'Positie bewerken' : 'Positie toevoegen'}</h2>
    <div class="grid two"><div><label class="f" for="rcode">Code</label><input class="i" id="rcode" maxlength="4" value="${esc(x.role)}" ${rc ? 'readonly' : ''} placeholder="bijv. CM"></div><div><label class="f" for="rnaam">Naam</label><input class="i" id="rnaam" value="${esc(rc?.title || '')}"></div></div>
    <label class="f" for="rbal">Wij hebben de bal</label><textarea class="i" id="rbal">${esc(x.bal || '')}</textarea>
    <label class="f" for="rgeen">Zij hebben de bal</label><textarea class="i" id="rgeen">${esc(x.geen || '')}</textarea>
    <label class="f" for="rverl">Na balverlies</label><textarea class="i" id="rverl">${esc(x.verlies || '')}</textarea>
    <label class="f" for="rwin">Na balwinst</label><textarea class="i" id="rwin">${esc(x.winst || '')}</textarea>
    <label class="f" for="rherv">Spelhervattingen</label><textarea class="i" id="rherv">${esc(x.herv || '')}</textarea>
    <label class="f" for="rex">Let op (één per regel)</label><textarea class="i" id="rex">${esc((x.extra || []).join('\n'))}</textarea>
    <label class="f">Oefenvormen op de training</label><div class="grid two">${cb('drill', x.drills, 'rdc')}</div>
    <label class="f">Thuis oefenen</label><div class="grid two">${cb('homedrill', x.home, 'rhc')}</div>`,
    [...(rc ? [['Verwijderen', 'danger', async () => { if (confirm('Deze positie verwijderen?')) { await deleteContent(rc); viewRoles(); } }]] : []),
    ['Annuleren'], ['Opslaan', 'primary', async () => {
      const role = $('#rcode').value.trim().toUpperCase(), naam = $('#rnaam').value.trim();
      if (!role || !naam) return toast('Vul een code en een naam in');
      const data = { role, naam, bal: $('#rbal').value.trim(), geen: $('#rgeen').value.trim(), verlies: $('#rverl').value.trim(), winst: $('#rwin').value.trim(), herv: $('#rherv').value.trim(), extra: $('#rex').value.split('\n').map(t => t.trim()).filter(Boolean),
        drills: [...document.querySelectorAll('.rdc:checked')].map(c => c.value), home: [...document.querySelectorAll('.rhc:checked')].map(c => c.value) };
      if (rc && !rc.std) await saveContent(rc, { title: naam, data }); else { const r = await insertContent('session', naam, data); if (!r) return; }
      viewRoles();
    }]]);
}
function editPlayer(p) {
  const tc = p ? kind('taskcard').find(c => c.data.player_id === p.id) : null;
  const t = tc?.data || {};
  openDialog(`<h2>${p ? 'Speler bewerken' : 'Speler toevoegen'}</h2>
    <div class="grid two"><div><label class="f" for="pn">Voornaam of bijnaam</label><input class="i" id="pn" maxlength="30" value="${esc(p?.nickname || '')}"></div>
    <div><label class="f" for="ps">Rugnummer</label><input class="i" id="ps" type="number" min="0" max="99" value="${p?.shirt ?? ''}"></div></div>
    <label class="f" for="pp">Voorkeurspositie</label><input class="i" id="pp" maxlength="30" value="${esc(p?.position || t.pos || '')}">
    <p class="small muted" style="margin:6px 0 0">De taken op het veld volgen automatisch uit de positie waarop je de speler in de opstelling zet.</p>
    <label class="f" for="pe">Persoonlijke aandachtspunten (één per regel)</label><textarea class="i" id="pe">${esc((t.extra || []).join('\n'))}</textarea>`,
    [...(p ? [['Verwijderen', 'danger', async () => {
      if (!confirm(`${p.nickname} en alle gegevens van deze speler verwijderen?`)) return;
      const { error } = await sb.from('players').delete().eq('id', p.id); if (error) return toast(error.message);
      if (tc) await deleteContent(tc);
      S.players = S.players.filter(x => x.id !== p.id); viewPlayers();
    }]] : []),
    ['Annuleren'], ['Opslaan', 'primary', async () => {
      const nickname = $('#pn').value.trim(); if (!nickname) return toast('Vul een naam in');
      const shirt = $('#ps').value === '' ? null : Math.max(0, Math.min(99, +$('#ps').value));
      const pos = $('#pp').value.trim();
      let pid = p?.id;
      if (p) {
        const { error } = await sb.from('players').update({ nickname, shirt, position: pos || null }).eq('id', p.id);
        if (error) return toast(error.message);
        Object.assign(p, { nickname, shirt, position: pos });
      } else {
        const { data, error } = await sb.rpc('add_player', { p_team: S.team.id, p_nickname: nickname, p_shirt: shirt, p_position: pos || null });
        if (error) return toast(error.message);
        pid = data[0].player_id; S.players.push({ id: pid, team_id: S.team.id, nickname, shirt, position: pos, active: true, alt_positions: [] });
      }
      const td = { player_id: pid, extra: $('#pe').value.split('\n').map(s => s.trim()).filter(Boolean) };
      if (tc) await saveContent(tc, { title: nickname, data: td }); else await insertContent('taskcard', nickname, td);
      viewPlayers();
    }]]);
}

/* ---------------- beheer ---------------- */
function viewAdmin() {
  const link = `${location.origin}${location.pathname}#t=${S.team.share_token}`;
  const c = S.team.colors || {};
  $('#view').innerHTML = `<div class="grid two">
    <div class="panel"><div class="kicker">Delen</div><h2>Teamlink</h2><p class="muted small">Iedereen met deze link kan meekijken, zonder in te loggen. Aanpassen kan alleen een trainer.</p>
      <input class="i" readonly value="${esc(link)}" id="tl"><div class="row mt"><button class="btn primary" id="cpl">Kopieer link</button><button class="btn ghost" id="newl">Nieuwe link maken</button></div>
      <p class="small muted">Een nieuwe link maakt de oude ongeldig.</p></div>
    <form class="panel" id="tf"><div class="kicker">Team · ${FM().label}</div><h2>Gegevens en kleuren</h2>
      <label class="f" for="an">Teamnaam</label><input class="i" id="an" value="${esc(S.team.name)}">
      <label class="f" for="ac">Club</label><input class="i" id="ac" value="${esc(S.team.club || '')}">
      <label class="f" for="as">Seizoen</label><input class="i" id="as" value="${esc(S.team.season || '')}">
      <div class="grid two"><div><label class="f" for="c1">Clubkleur</label><input class="i" id="c1" type="color" value="${esc(c.primary || '#db1e3b')}" style="height:44px;padding:4px"></div>
      <div><label class="f" for="c2">Tweede kleur</label><input class="i" id="c2" type="color" value="${esc(c.secondary || '#181519')}" style="height:44px;padding:4px"></div></div>
      <div class="row mt"><button class="btn primary" type="submit">Opslaan</button></div></form>
    <form class="panel" id="sf"><div class="kicker">Samenwerken</div><h2>Trainer of assistent toevoegen</h2>
      <p class="muted small">Laat diegene eerst één keer inloggen via deze app. Vul daarna hier het e-mailadres in.</p>
      <label class="f" for="se">E-mailadres</label><input class="i" id="se" type="email" required>
      <label class="f" for="sr">Rol</label><select class="i" id="sr"><option value="assistent">Assistent</option><option value="trainer">Trainer</option></select>
      <div class="row mt"><button class="btn primary" type="submit">Toevoegen</button></div></form>
    <div class="panel"><div class="kicker">Meer teams</div><h2>Nog een team</h2><p class="muted small">Maak een tweede team aan, bijvoorbeeld een variant voor 11 tegen 11 of een ander leeftijdsteam. Elk team heeft zijn eigen systemen en patronen; je wisselt bovenaan tussen teams.</p><button class="btn" id="newTeam">Nieuw team aanmaken</button></div>
    <div class="panel"><div class="kicker">Privacy</div><h2>Einde seizoen</h2><p class="muted small">Verwijdert alle spelers, taakkaarten en huiswerk. Opstellingen, patronen en oefenvormen blijven bewaard voor volgend seizoen.</p>
      <button class="btn danger" id="wipe">Seizoen afsluiten</button></div></div>`;
  $('#cpl').onclick = () => copy(link, 'Teamlink gekopieerd');
  $('#newTeam').onclick = () => renderCreateTeam();
  $('#newl').onclick = async () => { if (!confirm('Nieuwe link maken? De oude werkt daarna niet meer.')) return; const { data, error } = await sb.rpc('new_share_token', { p_team: S.team.id }); if (error) return toast(error.message); S.team.share_token = data; viewAdmin(); toast('Nieuwe link gemaakt'); };
  $('#tf').onsubmit = async e => {
    e.preventDefault();
    const patch = { name: $('#an').value.trim() || S.team.name, club: $('#ac').value.trim() || null, season: $('#as').value.trim() || null, colors: { ...(S.team.colors || {}), primary: $('#c1').value, secondary: $('#c2').value } };
    const { error } = await sb.from('teams').update(patch).eq('id', S.team.id); if (error) return toast(error.message);
    Object.assign(S.team, patch); applyColors(); render(); toast('Opgeslagen');
  };
  $('#sf').onsubmit = async e => { e.preventDefault(); const { error } = await sb.rpc('add_staff', { p_team: S.team.id, p_email: $('#se').value.trim(), p_role: $('#sr').value }); toast(error ? error.message : 'Toegevoegd'); };
  $('#wipe').onclick = async () => {
    const ans = prompt(`Typ de teamnaam (${S.team.name}) om het seizoen af te sluiten.`);
    if (ans !== S.team.name) return;
    const { error } = await sb.rpc('wipe_season', { p_team: S.team.id }); if (error) return toast(error.message);
    await reloadTeamData(); render(); toast('Seizoen afgesloten');
  };
}

/* ---------------- spelerslink ---------------- */
async function playerLink(p) {
  if (!confirm(`Nieuwe spelerslink maken voor ${p.nickname}? Een eerdere link van deze speler werkt daarna niet meer, en de ouder moet opnieuw toestemming geven.`)) return;
  const { data: token, error } = await sb.rpc('new_player_token', { p_player: p.id });
  if (error) return toast(error.message);
  p.consent_at = null;
  const link = `${location.origin}${location.pathname}#s=${token}`;
  const msg = `Hoi! Dit is de persoonlijke pagina van ${p.nickname} in Ons Speelboek van ${S.team.name}. Daar staan zijn taken en thuisoefeningen. Wil je de link openen en toestemming geven? ${link}`;
  openDialog(`<div class="kicker">Spelerslink</div><h2>${esc(p.nickname)}</h2>
    <p class="muted small">Stuur deze link naar de ouder of verzorger. De link is persoonlijk: deel hem niet in de teamgroep. Hij wordt maar één keer getoond.</p>
    <input class="i" readonly value="${esc(link)}">
    <div class="row mt"><button type="button" class="btn primary" id="plc">Kopieer link</button><a class="btn" target="_blank" rel="noopener" href="https://wa.me/?text=${encodeURIComponent(msg)}">Via WhatsApp</a></div>`,
    [['Sluiten']]);
  $('#plc').onclick = () => copy(link, 'Spelerslink gekopieerd');
  viewPlayers();
}

/* ---------------- huiswerk (trainer) ---------------- */
S.week = weekStart();
async function viewHomework() {
  const homes = kind('homedrill');
  $('#view').innerHTML = `<div class="row" style="justify-content:space-between;margin-bottom:12px">
      <div class="row"><button class="btn ghost" id="wPrev" aria-label="Vorige week">‹</button><div><div class="kicker">Week</div><strong>${weekLabel(S.week)}</strong></div><button class="btn ghost" id="wNext" aria-label="Volgende week">›</button></div>
      <div class="row"><button class="btn" id="assignRole">Per positie geven</button><button class="btn primary" id="assign">Huiswerk geven</button></div></div>
    <div id="hwList" class="grid"><div class="panel empty">Laden…</div></div>
    <div class="row mt" style="justify-content:space-between"><h2 class="h-cond" style="margin:16px 0 8px;text-transform:uppercase">Thuisoefeningen</h2><div class="row">${homes.length ? '' : '<button class="btn" id="seedHome">Startset laden</button>'}<button class="btn ghost" id="addHome">Nieuwe thuisoefening</button></div></div>
    <div class="grid two">${homes.map(h => `<article class="panel">${homeHTML(h)}<div class="row mt"><button class="btn ghost" data-eh="${h.id}">Bewerken</button></div></article>`).join('') || '<div class="panel empty">Nog geen thuisoefeningen.</div>'}</div>`;
  $('#wPrev').onclick = () => { S.week = shiftWeek(S.week, -1); viewHomework(); };
  $('#wNext').onclick = () => { S.week = shiftWeek(S.week, 1); viewHomework(); };
  $('#assign').onclick = () => assignDialog();
  $('#assignRole').onclick = () => assignByRole();
  $('#addHome').onclick = () => editHome(null);
  if ($('#seedHome')) $('#seedHome').onclick = async () => { for (const h of HOME) { const { title, ...rest } = h; await insertContent('homedrill', title, rest); } viewHomework(); };
  document.querySelectorAll('[data-eh]').forEach(b => b.onclick = () => editHome(homes.find(h => h.id === b.dataset.eh)));
  const { data, error } = await sb.rpc('week_overview', { p_team: S.team.id, p_week: S.week });
  if (error) { $('#hwList').innerHTML = `<div class="panel empty">${esc(error.message)}</div>`; return; }
  const active = S.players.filter(p => p.active);
  const total = (data || []).reduce((a, x) => a + x.done.length, 0);
  $('#hwList').innerHTML = (data || []).length ? `<div class="panel"><div class="kicker">Samen</div><h2>${total} keer geoefend</h2><p class="muted small" style="margin:0">Spelers zonder toestemming van een ouder zien hun huiswerk nog niet.</p></div>` + data.map(a => {
    const targets = a.player_id ? active.filter(p => p.id === a.player_id) : active;
    return `<div class="panel"><div class="kicker">${a.player_id ? 'Voor ' + esc(nick(a.player_id)) : 'Voor het hele team'}</div><h3>${esc(a.drill)}</h3>${a.note ? `<p class="small" style="margin:0 0 8px">“${esc(a.note)}”</p>` : ''}
      <div class="grid">${targets.map(p => { const d = a.done.find(x => x.player_id === p.id); return `<div class="row" style="justify-content:space-between;border-top:1px solid var(--line);padding-top:8px"><span>${esc(p.nickname)} ${d ? MOOD[d.mood] || '✓' : `<span class="muted small">${p.consent_at ? 'nog niet' : 'geen toestemming'}</span>`}</span>${d ? `<span class="row">${Object.entries(REACT).map(([k, l]) => `<button class="btn ${d.reaction === k ? 'primary' : 'ghost'}" style="padding:4px 9px;font-size:.8rem" data-react="${a.assignment_id}|${p.id}|${k}">${l}</button>`).join('')}</span>` : ''}</div>`; }).join('')}</div>
      <div class="row mt"><button class="btn ghost danger" data-del="${a.assignment_id}">Huiswerk verwijderen</button></div></div>`;
  }).join('') : `<div class="panel empty">Nog geen huiswerk voor deze week.</div>`;
  document.querySelectorAll('[data-react]').forEach(b => b.onclick = async () => { const [aid, pid, k] = b.dataset.react.split('|'); const { error } = await sb.from('completions').update({ reaction: k }).eq('assignment_id', aid).eq('player_id', pid); if (error) toast(error.message); else { toast('Compliment verstuurd'); viewHomework(); } });
  document.querySelectorAll('[data-del]').forEach(b => b.onclick = async () => { if (!confirm('Dit huiswerk verwijderen?')) return; const { error } = await sb.from('assignments').delete().eq('id', b.dataset.del); if (error) toast(error.message); viewHomework(); });
}
function homeHTML(h, extra = '') {
  const x = h.data;
  return `<div class="kicker">${esc(x.rol || '')} · ${+x.min || 10} min</div><h3>${esc(h.title)}</h3>
    <p class="small muted" style="margin:0 0 6px">${esc(x.waar || '')} · ${esc(x.wie || '')}</p>
    <ol class="clean">${(x.stappen || []).map(s => `<li>${esc(s)}</li>`).join('')}</ol>${x.tip ? `<p class="small"><strong>Tip:</strong> ${esc(x.tip)}</p>` : ''}${extra}`;
}
function assignDialog() {
  const homes = kind('homedrill'); if (!homes.length) return toast('Voeg eerst thuisoefeningen toe');
  const active = S.players.filter(p => p.active);
  openDialog(`<div class="kicker">Week ${weekLabel(S.week)}</div><h2>Huiswerk geven</h2>
    <label class="f" for="ah">Thuisoefening</label><select class="i" id="ah">${homes.map(h => `<option value="${h.id}">${esc(h.title)} (${esc(h.data.rol || '')})</option>`).join('')}</select>
    <label class="f">Voor wie</label><label class="small"><input type="radio" name="aw" value="team" checked> Het hele team</label><br><label class="small"><input type="radio" name="aw" value="some"> Bepaalde spelers</label>
    <div class="grid two mt" id="awp">${active.map(p => `<label class="small"><input type="checkbox" class="awc" value="${p.id}"> ${esc(p.nickname)}</label>`).join('')}</div>
    <label class="f" for="an2">Bericht van de trainer (optioneel)</label><input class="i" id="an2" maxlength="280" placeholder="Bijvoorbeeld: dit helpt bij het draaien op het middenveld">`,
    [['Annuleren'], ['Geven', 'primary', async () => {
      const drill = $('#ah').value, note = $('#an2').value.trim() || null;
      const some = document.querySelector('input[name=aw]:checked').value === 'some';
      const pids = some ? [...document.querySelectorAll('.awc:checked')].map(c => c.value) : [null];
      if (!pids.length) return toast('Kies minstens één speler');
      const { error } = await sb.from('assignments').insert(pids.map(pid => ({ team_id: S.team.id, drill_id: drill, player_id: pid, week_start: S.week, note })));
      if (error) return toast(error.message);
      toast('Huiswerk gegeven'); viewHomework();
    }]]);
}
function assignByRole(preId) {
  const lsA = lineups(); const pre = preId || curLineup()?.id;
  openDialog(`<div class="kicker">Week ${weekLabel(S.week)}</div><h2>Huiswerk per positie</h2>
    <p class="small muted">Iedere speler krijgt de thuisoefeningen die bij zijn positie horen, volgens de gekozen opstelling.</p>
    <label class="f" for="abl">Opstelling</label><select class="i" id="abl">${lsA.map(l => `<option value="${l.id}" ${l.id === pre ? 'selected' : ''}>${esc(lineupTitle(l))}${l.data.match ? ' ★' : ''}</option>`).join('')}</select>
    <label class="f" for="abn">Aantal oefeningen per speler</label><select class="i" id="abn"><option value="1">1</option><option value="2" selected>2</option><option value="3">3</option></select>
    <div id="abprev" class="small mt"></div>`,
    [['Annuleren'], ['Geven', 'primary', async () => {
      const rows = plan(); if (!rows.length) return toast('Geen passende oefeningen gevonden');
      const { error } = await sb.from('assignments').insert(rows.map(r => ({ team_id: S.team.id, drill_id: r.drill.id, player_id: r.pid, week_start: S.week, note: `Voor jouw plek: ${r.role}` })));
      if (error) return toast(error.message);
      toast(`${rows.length} oefeningen gegeven`); viewHomework();
    }]]);
  function plan() {
    const L = lsA.find(l => l.id === $("#abl").value), n = +$("#abn").value, rows = [];
    (L?.data.slots || []).forEach(s => { if (!s.player_id || !playerById(s.player_id)) return; const st = slotTasks(L, s); st.home.slice(0, n).forEach(sl => { const d = kind('homedrill').find(h => h.data.slug === sl || h.id === sl); if (d) rows.push({ pid: s.player_id, drill: d, role: `${st.naam} in ${lineupTitle(L)}` }); }); });
    return rows;
  }
  const prev = () => { const rows = plan(); const by = {}; rows.forEach(r => { (by[r.pid] ||= []).push(r.drill.title); }); $('#abprev').innerHTML = Object.entries(by).map(([pid, t]) => `<div><strong>${esc(nick(pid))}</strong>: ${t.map(esc).join(', ')}</div>`).join('') || '<span class="muted">Geen passende oefeningen.</span>'; };
  $('#abl').onchange = prev; $('#abn').onchange = prev; prev();
}
function editHome(h) {
  const x = h?.data || { min: 10, stappen: [] };
  openDialog(`<h2>${h ? 'Thuisoefening bewerken' : 'Nieuwe thuisoefening'}</h2>
    <label class="f" for="ht">Naam</label><input class="i" id="ht" value="${esc(h?.title || '')}" maxlength="120">
    <div class="grid two"><div><label class="f" for="hm">Minuten</label><input class="i" id="hm" type="number" min="1" max="60" value="${+x.min || 10}"></div><div><label class="f" for="hr">Voor (rol)</label><input class="i" id="hr" value="${esc(x.rol || '')}" placeholder="Iedereen, Middenveld…"></div></div>
    <div class="grid two"><div><label class="f" for="hw">Waar</label><input class="i" id="hw" value="${esc(x.waar || '')}" placeholder="Terras, pad, muur"></div><div><label class="f" for="hp">Met wie</label><input class="i" id="hp" value="${esc(x.wie || '')}" placeholder="Alleen, met ouder"></div></div>
    <label class="f" for="hs">Stappen (één per regel)</label><textarea class="i" id="hs">${esc((x.stappen || []).join('\n'))}</textarea>
    <label class="f" for="htip">Tip</label><input class="i" id="htip" value="${esc(x.tip || '')}">`,
    [...(h ? [['Verwijderen', 'danger', async () => { if (confirm('Deze thuisoefening verwijderen? Gegeven huiswerk ermee verdwijnt ook.')) { await deleteContent(h); viewHomework(); } }]] : []),
    ['Annuleren'], ['Opslaan', 'primary', async () => {
      const title = $('#ht').value.trim(); if (!title) return toast('Geef de oefening een naam');
      const data = { ...x, min: +$('#hm').value || 10, rol: $('#hr').value.trim(), waar: $('#hw').value.trim(), wie: $('#hp').value.trim(), stappen: $('#hs').value.split('\n').map(s => s.trim()).filter(Boolean), tip: $('#htip').value.trim() };
      if (h) await saveContent(h, { title, data }); else await insertContent('homedrill', title, data);
      viewHomework();
    }]]);
}

/* ---------------- spelerspagina ---------------- */
async function loadPlayer() {
  const { data, error } = await sb.rpc('get_player_view', { p_token: S.token });
  if (error || !data) return renderMessage('Deze spelerslink werkt niet (meer).', 'Vraag de trainer om een nieuwe link.');
  loadPublic(data); S.me = data.me; S.assign = data.assignments || []; S.teamTotal = data.team_total || 0; S.pweek = data.week;
  S.mode = 'player'; S.staff = false;
  if (!S.me.consent) return renderConsent();
  if (!S.view || S.view === 'opstelling') S.view = 'week';
  render();
}
function renderConsent() {
  shell(`<form class="panel" id="cf" style="max-width:640px"><div class="kicker">Voor ouders en verzorgers</div><h2>Toestemming voor ${esc(S.me.nickname)}</h2>
    <p>Via deze pagina krijgt ${esc(S.me.nickname)} thuisoefeningen van de trainer van ${esc(S.team.name)}, en kan hij of zij aanvinken wat er geoefend is.</p>
    <p class="small muted"><strong>Wat bewaren we?</strong> Alleen de voornaam of bijnaam, het rugnummer, de positie en welke oefeningen zijn afgevinkt (met een smiley). Geen achternaam, geboortedatum, foto of contactgegevens.<br>
    <strong>Wie ziet het?</strong> Alleen de trainers van het team. Andere spelers zien alleen het teamtotaal, geen individuele scores.<br>
    <strong>Hoe lang?</strong> Tot het einde van het seizoen; dan wordt alles gewist. Je kunt de toestemming altijd intrekken onderaan de pagina; dan worden de gegevens direct verwijderd.<br>
    <strong>Waar?</strong> De gegevens staan op een server in de EU.</p>
    <label class="small row"><input type="checkbox" id="cok" required> Ik ben ouder of verzorger van ${esc(S.me.nickname)} en geef toestemming.</label>
    <div class="row mt"><button class="btn primary" type="submit">Toestemming geven</button></div></form>`);
  $('#cf').onsubmit = async e => { e.preventDefault(); const { error } = await sb.rpc('give_consent', { p_token: S.token }); if (error) return toast(error.message); toast('Bedankt!'); loadPlayer(); };
}
function viewWeek() {
  const me = S.me;
  const done = S.assign.filter(a => a.done).length;
  $('#view').innerHTML = `<div class="layout">
    <div class="panel"><div class="pcard">${shirtSVG(me.shirt ?? '')}<div><div class="kicker">Week ${weekLabel(S.pweek)}</div><h2 style="margin:0">Hoi ${esc(me.nickname)}!</h2><div class="muted">${done} van ${S.assign.length} oefeningen gedaan</div></div></div>
      <div class="mt" style="padding:12px;border-radius:12px;background:color-mix(in srgb,var(--club) 18%,transparent);border:1px solid color-mix(in srgb,var(--club) 45%,transparent)"><div class="kicker" style="color:#fff">Het hele team</div><strong style="font:800 1.6rem 'Barlow Condensed'">${S.teamTotal}</strong> keer samen geoefend deze week</div>
      <div class="row mt"><button class="btn primary" id="toPat">Tactiek oefenen: volg jezelf</button></div>
      <h3 class="mt">Jouw taak op het veld</h3>${cardHTML(playerById(me.id) || { id: me.id, nickname: me.nickname, shirt: me.shirt }, { lineup: matchLineup() }).replace(/^<div class="pcard">[\s\S]*?<\/div><\/div><\/div>/, '')}</div>
    <div class="grid">${S.assign.map(a => { const h = { title: a.drill.title, data: a.drill.data };
      return `<article class="panel">${homeHTML(h, `${a.note ? `<p class="small"><strong>Trainer:</strong> “${esc(a.note)}”</p>` : ''}
        ${a.done ? `<p><strong>Gedaan ${MOOD[a.mood] || '✓'}</strong>${a.reaction ? ` · Trainer: <strong>${esc(REACT[a.reaction])}</strong>` : ''}</p><button class="btn ghost" data-undo="${a.id}">Toch nog niet gedaan</button>` :
        `<p class="small muted" style="margin-bottom:6px">Gedaan? Hoe ging het?</p><div class="row">${[1, 2, 3].map(m => `<button class="btn" style="font-size:1.3rem;padding:6px 14px" data-done="${a.id}|${m}" aria-label="Gedaan, ${['moeilijk', 'ging wel', 'ging goed'][m - 1]}">${MOOD[m]}</button>`).join('')}</div>`}`)}</article>`; }).join('') || '<div class="panel empty">Deze week nog geen huiswerk. Lekker vrij voetballen!</div>'}</div></div>
    <p class="small muted mt" style="text-align:center"><a href="#" id="wd" style="color:inherit">Toestemming intrekken en gegevens verwijderen</a></p>`;
  document.querySelectorAll('[data-done]').forEach(b => b.onclick = async () => { const [id, m] = b.dataset.done.split('|'); const { data, error } = await sb.rpc('complete_assignment', { p_token: S.token, p_assignment: id, p_mood: +m }); if (error || !data) return toast('Dat lukte niet'); toast('Goed gedaan!'); loadPlayer(); });
  document.querySelectorAll('[data-undo]').forEach(b => b.onclick = async () => { await sb.rpc('undo_completion', { p_token: S.token, p_assignment: b.dataset.undo }); loadPlayer(); });
  $('#toPat').onclick = () => { S.view = 'patronen'; S.follow = null; S.psys = null; render(); };
  $('#wd').onclick = async e => { e.preventDefault(); if (!confirm('Weet je het zeker? De gegevens van deze speler worden direct verwijderd en deze link werkt daarna niet meer.')) return; await sb.rpc('withdraw_consent', { p_token: S.token }); renderMessage('De gegevens zijn verwijderd.', 'Je kunt deze pagina sluiten.'); };
}


/* ---------------- handleiding ---------------- */
const HELP_TRAINER = [
  ['Starten', [
    ['Inloggen en een team maken', 'Log in met je e-mailadres en een wachtwoord. Bij je eerste keer maak je een team aan en kies je de speelvorm: 8 tegen 8 of 11 tegen 11. Het team krijgt meteen de kennisbank: beproefde systemen, spelpatronen, taken per positie, oefenvormen en trainingsplannen. Daarna voeg je in Spelers je eigen spelers toe (met hun voorkeurspositie) en zet je ze in de opstellingen. Wil je eerst rondkijken, vink dan “Voorbeeldspelers toevoegen” aan.'],
    ['De kennisbank', 'Systemen, taken en patronen zijn geschreven in posities, niet in namen: “de controleur speelt in op de spelmaker”. Staat er in jouw opstelling een speler op die plek, dan zie je zijn naam; anders de naam van de plek. Zo werkt dezelfde kennis voor elk team.'],
    ['8 tegen 8 en 11 tegen 11', 'Elke speelvorm is een eigen team met eigen posities, systemen, patronen en trainingen. Wil je beide, maak dan een tweede team aan via Beheer → Nieuw team aanmaken. Bovenaan wissel je tussen je teams. De speelvorm staat in de kop naast de teamnaam.']
  ]],
  ['Opstelling en systemen', [
    ['Kiezen op tegenstander', 'Bovenaan staat de keuzelijst “Tegenstander”: bouwt rustig op, speelt lang, zet hoog druk, staat laag, is snel in de omschakeling, speelt via de flanken, is sterk op het middenveld of is sterker dan wij. Kies er een, dan krijgen de systemen die daar goed tegen werken een vinkje, zie je bij elk systeem of het past, en toont Patronen alleen de patronen voor dat type tegenstander.'],
    ['Een systeem kiezen', 'Kies bovenaan in de keuzelijst “Systeem” een systeem; het veld staat schuin, zoals op tv. Met “Variant maken” maak je een eigen versie, bijvoorbeeld voor één tegenstander. Rechts (op de telefoon eronder) staan het idee, wat het systeem sterk maakt, het risico en wanneer je het kiest. Klap “Speelwijze per fase” open voor opbouwen, aanvallen, verdedigen, omschakelen en waar je als trainer op let.'],
    ['Taken van een speler zien', 'Tik op een shirt. Op de telefoon schuift er een blad omhoog, op de computer verschijnen de taken naast het veld. Op de computer zie je ook een korte samenvatting als je met de muis op een speler staat. De taken horen bij de plek in dit systeem: met bal, zonder bal, na balverlies, na balwinst, spelhervattingen, oefenvormen en thuisoefeningen.'],
    ['Wisselen', 'Tik onder “Niet opgesteld” op een naam en daarna op een shirt. De nieuwe speler krijgt direct de taken, oefeningen en thuisoefeningen van die plek. Een shirt verplaatsen doe je door het te slepen.'],
    ['Speler, positie of taken van een plek aanpassen', 'Tik op een shirt en kies “Speler, positie of taken wijzigen”. Je kiest de speler, de positie en de naam van de plek, en je past de taken in dit systeem aan. Kies je een andere positie, dan vullen de taken zich vanzelf met wat bij die positie hoort. Onderaan zet je wie hier ook kan spelen; die namen staan klein onder het shirt.'],
    ['Systeem toevoegen of eigen situatie', '“Systeem toevoegen” zet een systeem uit de bibliotheek neer, ingevuld op de kwaliteiten van de spelers. “Nieuwe situatie” kopieert de huidige opstelling, zodat je een eigen variant kunt maken, bijvoorbeeld voor een bepaalde tegenstander. Met “Naam en uitleg aanpassen” geef je hem een naam of verwijder je hem.'],
    ['Wedstrijdopstelling', 'Kies de opstelling voor de komende wedstrijd en tik op “☆ Maak wedstrijdopstelling”. Er komt een ster voor de naam. De spelerspagina’s, het tabblad Spelers en het huiswerk volgen dan automatisch deze opstelling. Wissel je daarin een speler, dan ziet hij op zijn eigen pagina meteen zijn nieuwe taken.']
  ]],
  ['Trainen', [
    ['Training voor een systeem', 'Tik bij een opstelling op “Training voor dit systeem”. De oefenvormen die bij dat systeem passen, staan dan klaar in het tabblad Trainingen onder “Jouw training”.'],
    ['Trainingsplan en oefenvormen', 'In Trainingen staat een weekplan. Met “Gebruik deze training” zet je een week klaar; met “Training kopiëren” plak je hem in WhatsApp of een mail. Bij elke oefenvorm staan het probleem, waarom en hoe, coachpunten en een makkelijkere of moeilijkere variant. Je kunt oefenvormen en weken aanpassen of toevoegen.'],
    ['Patronen als film', 'In Patronen kies je in de keuzelijsten het systeem (de ster is de wedstrijdopstelling) en het patroon; voor elk patroon staat de fase (opbouw, aanval, omschakelen, verdedigen) en tegen welk type tegenstander het werkt. Een pass vertrekt pas als de loopactie op gang is, een lange bal gaat door de lucht, tegenstanders schuiven mee met de bal en wie loopt laat een spoor achter. Het speelt af als een filmpje op een schuin veld, met rugnummers en gele pionnen als tegenstanders. “Langzaam” halveert het tempo; “Stap voor stap” laat pijlen en elke stap apart zien.'],
    ['Volg een speler', 'Kies bij “Volg een speler” een naam. Die speler krijgt een gele ring, de rest wordt lichter, en bij elke stap staat in één zin wat híj doet. Op de pagina van een speler staat hij zelf al gekozen.'],
    ['Delen als video', 'Tik bij een patroon op “Deel als video”. De app maakt er een filmpje van, met de uitleg in beeld; volg je een speler, dan staat ook zijn zin erbij. Op de telefoon kies je daarna direct WhatsApp, op de computer wordt het bestand gedownload.'],
    ['Zelf een patroon maken', 'Tik op “Nieuw patroon” (in het gekozen systeem) of “Patroon aanpassen”. Sleep spelers en pionnen naar hun plek, kies bij wie de bal is en schrijf bij elke stap een korte uitleg. Met “+ Stap erbij” maak je de volgende stap; die begint waar de vorige eindigde. De pijlen tekent de app zelf. Na “Opslaan” speelt je patroon als film en werkt “Waar loop jij naartoe?” er ook mee.'],
    ['Waar loop jij naartoe?', 'Kies eerst een speler en tik dan op “Waar loop jij naartoe?”. Het filmpje stopt vlak voor elke actie van die speler; hij sleept zijn rondje naar de plek waar hij heen gaat en ziet meteen of het klopt. Kijken én zelf aanwijzen blijft beter hangen dan alleen kijken. Laat kinderen het thuis doen, of samen op een tablet in de kleedkamer.']
  ]],
  ['Spelers en huiswerk', [
    ['Spelers en taken per positie', 'In Spelers zie je per speler zijn taken in de gekozen situatie. Met “Taken per positie” pas je de standaardtaken van een positie aan; elke speler op die positie krijgt ze automatisch, behalve waar een systeem of plek iets anders zegt.'],
    ['Huiswerk geven', 'Tik bij een opstelling op “Huiswerk voor deze opstelling”, of ga naar Huiswerk → “Per positie geven”. Iedere speler krijgt de thuisoefeningen van zijn plek, met de plek erbij in de notitie. Je kunt ook zelf één oefening aan het team of een speler geven. Je ziet wie wat gedaan heeft en kunt een compliment sturen.'],
    ['Spelerslink en toestemming', 'In Spelers maak je per speler een persoonlijke link en stuur je die naar de ouder. De ouder geeft eerst toestemming; daarna ziet de speler zijn taken en huiswerk. Een nieuwe link maakt de oude ongeldig.']
  ]],
  ['Delen en beheer', [
    ['Teamlink', 'In Beheer staat de teamlink. Iedereen met die link kan meekijken naar opstellingen, patronen en trainingen, zonder in te loggen. Aanpassen kan alleen een trainer.'],
    ['Assistent toevoegen', 'Laat de assistent eerst één keer inloggen in de app. Vul daarna in Beheer zijn e-mailadres in.'],
    ['Kleuren en seizoen', 'In Beheer pas je teamnaam, club, seizoen en kleuren aan. Aan het eind van het seizoen verwijdert “Seizoen afsluiten” alle spelers en huiswerk; opstellingen, patronen en oefenvormen blijven bewaard.']
  ]],
  ['Privacy', [
    ['Wat we bewaren', 'Alleen een voornaam of bijnaam, rugnummer, positie en welke oefeningen zijn afgevinkt, met een smiley. Geen achternaam, geboortedatum, foto of contactgegevens. Er is geen chat en geen ranglijst tussen kinderen. Een ouder kan op de spelerspagina zelf de toestemming intrekken; de gegevens worden dan direct verwijderd.']
  ]]
];
const HELP_PLAYER = [
  ['Voor spelers en ouders', [
    ['Mijn week', 'Hier staat jouw taak op het veld in de opstelling voor de komende wedstrijd: wat je doet met de bal, zonder de bal, na balverlies, na balwinst en bij corners en vrije trappen. Daaronder staan je thuisoefeningen van deze week.'],
    ['Thuis oefenen', 'Elke oefening duurt ongeveer tien minuten, op het terras, een pad of tegen een muur, alleen of met een ouder of vriend. Gedaan? Tik op de smiley die past bij hoe het ging. De trainer ziet dat en kan je een compliment sturen. Per ongeluk getikt? Kies “Toch nog niet gedaan”.'],
    ['Tactiek oefenen', 'Tik op “Tactiek oefenen: volg jezelf”. Je ziet een filmpje van een spelsituatie; jij hebt een gele ring en onder het veld staat wat jij doet. Tik op “Waar loop jij naartoe?”: het filmpje stopt en jij sleept je rondje naar de plek waar je heen moet. Hoeveel had je goed?'],
    ['Meekijken', 'In Opstelling tik je op een speler om zijn taken te zien. In Trainingen zie je wat we op de training doen.'],
    ['Privacy', 'We bewaren alleen je voornaam of bijnaam, rugnummer, positie en welke oefeningen je hebt gedaan. Onderaan Mijn week kan een ouder de toestemming intrekken; dan worden de gegevens meteen verwijderd.']
  ]]
];
const HELP_VIEW = [
  ['Meekijken', [
    ['Wat zie je hier', 'Dit is de meekijkpagina van het team. In Opstelling tik je op een speler om zijn taken in dat systeem te zien; op de computer kun je ook met de muis op een speler gaan staan. In Patronen speel je spelsituaties stap voor stap af, in Trainingen staan het weekplan en de oefenvormen.'],
    ['Aanpassen', 'Aanpassen kan alleen de trainer, na inloggen.']
  ]]
];
function viewHelp() {
  const parts = S.staff ? HELP_TRAINER : S.mode === 'player' ? HELP_PLAYER : HELP_VIEW;
  $('#view').innerHTML = `<div class="panel help"><div class="kicker">Handleiding · ${FM().label}</div><h2>${S.staff ? 'Zo werkt Ons Speelboek' : 'Uitleg'}</h2>
    <p class="muted" style="margin-top:0">${S.staff ? 'Alles in de app volgt de opstelling: kies je een systeem of wissel je een speler, dan passen taken, oefeningen en huiswerk zich vanzelf aan.' : 'Hier lees je hoe deze pagina werkt.'}</p>
    ${parts.map(([kop, items]) => `<h3 class="mt">${esc(kop)}</h3>${items.map(([t, x]) => `<details><summary>${esc(t)}</summary><p>${esc(x)}</p></details>`).join('')}`).join('')}</div>`;
}

/* ---------------- dialoog ---------------- */
function openDialog(body, buttons) {
  const d = $('#dlg'); $('#dlgBody').innerHTML = body; const foot = $('#dlgFoot'); foot.innerHTML = '';
  buttons.forEach(([label, cls, fn]) => {
    const b = document.createElement('button'); b.className = 'btn ' + (cls || 'ghost'); b.textContent = label; b.type = fn ? 'button' : 'submit';
    if (cls === 'danger') b.style.marginRight = 'auto';
    if (fn) b.onclick = async () => { b.disabled = true; try { await fn(); } finally { b.disabled = false; } if (cls !== 'danger' || !d.open) { } d.close(); };
    foot.appendChild(b);
  });
  d.showModal();
}

/* ---------------- start ---------------- */
window.addEventListener('hashchange', () => { if (!location.hash.startsWith('#access_token')) boot(); });
boot().catch(e => renderMessage('Er ging iets mis.', e.message));
