import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.45.4/+esm';
const SEED = await fetch(new URL('./seed.json', import.meta.url)).then(r => r.json());

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
const ROLES = {
  K:  { naam: 'Keeper', bal: 'Speel kort uit naar de backs. Lang alleen als de spits al diep loopt.', geen: 'Praat met je verdedigers en roep duidelijk “keeper” als je de bal pakt.', extra: ['Tegen felle druk: krijg je de bal terug, speel hem meteen naar de vrije kant.', 'Na een fout: handschoenen goed, “volgende bal”.'], drills: ['keeper', 'opbouw'], home: ['h-keeper', 'h-kaatsen'] },
  LA: { naam: 'Linksachter', bal: 'Sta breed bij de zijlijn en speel kort op de centrale middenvelder of de linksbuiten.', geen: 'Houd je man voor je en laat je niet uitlokken. De linksbuiten komt je helpen.', extra: ['Tegen felle druk: blijf breed staan; bij twijfel terug op de laatste man of de keeper.'], drills: ['1tegen1', '5tegen4'], home: ['h-1tegen1', 'h-kaatsen', 'h-omkijken'] },
  CV: { naam: 'Laatste man', bal: 'Speel rustig en kort op de middenvelder of de vrije verdediger. Een actie alleen aan de zijkant, met ruimte voor je.', geen: 'Jij bent de laatste man. Kijk naar de bal en win je duel.', extra: ['Bij corners voor ons blijf je achter.', 'Zeg wat je ziet en stuur je medespelers.'], drills: ['1tegen1', 'compact', '5tegen4'], home: ['h-1tegen1', 'h-kaatsen', 'h-omkijken'] },
  RA: { naam: 'Rechtsachter', bal: 'Schuif in naast de centrale middenvelder. Speel in op de rechtsbuiten en vraag de bal terug.', geen: 'Terug naar rechtsachter. Jij coacht de verdediging.', extra: ['Tegen felle druk: blijf breed staan als aanspeelpunt.'], drills: ['5tegen4', 'derdeman'], home: ['h-kaatsen', 'h-omkijken', 'h-1tegen1'] },
  LB: { naam: 'Linksbuiten', bal: 'Sta hoog, naast de spits. Snij naar binnen op je sterke been en zoek het schot.', geen: 'Loop terug en help de linksachter.', extra: ['Vraag de bal in de ruimte, niet in de voeten.'], drills: ['actie', 'vleugelzones', 'derdeman'], home: ['h-aanname', 'h-dribbel', 'h-afronden'] },
  CM: { naam: 'Centrale middenvelder', bal: 'Haal de bal bij de verdedigers, kijk om voordat hij komt, draai en speel de spits of een buitenspeler diep. Dribbel vooral op de helft van de tegenstander.', geen: 'Jij zet als eerste druk. Spreek met de rechtsachter af wie er gaat, zodat het midden niet leeg komt.', extra: ['Tegen felle druk: zak terug tot naast de laatste man en vraag de bal.', 'Bij voorsprong: win je de bal, ga dan direct naar voren en zoek de spits.'], drills: ['draaien', 'positie', 'rondo'], home: ['h-muurpass', 'h-omkijken', 'h-draaien', 'h-steekpass'] },
  RB: { naam: 'Rechtsbuiten', bal: 'Sta breed en kaats met de rechtsachter. Eén actie, dan afspelen.', geen: 'Vijf seconden meejagen, dan terug naar je plek.', extra: ['Vraag de bal in de ruimte, niet in de voeten.'], drills: ['actie', 'vleugelzones', 'derdeman'], home: ['h-aanname', 'h-dribbel', 'h-afronden'] },
  SP: { naam: 'Spits', bal: 'Loop diep achter de verdediging, of kom kort om de bal in te kaatsen. Rond af in één of twee keer raken.', geen: 'Jij zet als eerste druk op de verdediger met de bal.', extra: ['Bij corners voor ons sta je rond de tweede paal.'], drills: ['afronden', 'golven', 'actie'], home: ['h-afronden', 'h-aanname', 'h-dribbel'] },
  LM: { naam: 'Links middenveld', bal: 'Speel breed en zoek de spitsen in de diepte.', geen: 'Loop terug en sluit de linkerkant af.', extra: [], drills: ['vleugelzones', 'actie'], home: ['h-aanname', 'h-steekpass'] },
  RM: { naam: 'Rechts middenveld', bal: 'Speel breed en zoek de spitsen in de diepte.', geen: 'Loop terug en sluit de rechterkant af.', extra: [], drills: ['vleugelzones', 'actie'], home: ['h-aanname', 'h-steekpass'] }
};
const PERSONAL = {
  Amine: ['De eerste weken begin je linksachter en schuif je bij balbezit naar binnen.'],
  Maddox: ['Als het tegenzit: bij het afgesproken signaal adem je even uit en speel je door.', 'Als Mees er niet is, keep jij.'],
  Joas: ['Als Mees er niet is, speel je links en loop je mee terug om Nassim te helpen.'],
  Mees: ['Na een fout: handschoenen goed, “volgende bal”.']
};
/* ---------------- systemen ----------------
   Per systeem: idee, sterk, risico en per plek (in volgorde) de speler die er op kwaliteit het best past,
   met taken die in dit systeem afwijken van de standaard positiekaart. Niet ingevuld = standaard positiekaart. */
const SYSTEMS = {
  '1331': { naam: '1-3-3-1', titel: 'Basis 1-3-3-1',
    idee: 'Drie achter, drie op het middenveld en één spits. Amine verdeelt het spel, Sasha schuift bij balbezit in naast hem en Maddox komt vanaf links naar binnen.',
    sterk: 'Evenwichtig: altijd drie spelers achter de bal en een vaste spelverdeler in het midden.',
    risico: 'Colin staat vaak alleen voorin; de buitenspelers moeten op tijd aansluiten.',
    slots: [
      ['K', 50, 94, 'Mees'], ['LA', 18, 76, 'Nassim'], ['CV', 50, 80, 'Sjoerd'], ['RA', 82, 76, 'Sasha'],
      ['LB', 18, 48, 'Maddox'], ['CM', 50, 56, 'Amine'], ['RB', 82, 48, 'Suleiman'], ['SP', 50, 24, 'Colin']
    ].map(([role, x, y, wie]) => ({ role, x, y, wie })) },
  '1322': { naam: '1-3-2-2', titel: 'Twee spitsen 1-3-2-2',
    idee: 'Drie achter, twee op het middenveld en twee spitsen. Colin gaat diep, Maddox komt kort en Amine bedient ze, met Suleiman als vangnet achter hem.',
    sterk: 'Altijd twee spelers voor het doel en veel druk op hun verdediging.',
    risico: 'Er staat niemand vast op de flanken: de buitenste verdedigers maken de breedte, maar nooit allebei tegelijk.',
    slots: [
      { role: 'K', x: 50, y: 94, wie: 'Mees', bal: 'Speel kort uit naar de buitenste verdedigers; zij staan breed. Is alles dicht, dan lang op Colin.' },
      { role: 'LA', x: 18, y: 78, wie: 'Nassim', bal: 'Jij bent ook de linksbuiten: schuif op langs de zijlijn als de bal rechts is, zo maak je het veld breed.', geen: 'Bij balverlies meteen terug. Jij en de rechtsachter staan nooit allebei hoog.' },
      { role: 'CV', x: 50, y: 82, wie: 'Sjoerd', geen: 'Met twee spitsen voorin zijn we achter met z\'n drieën: blijf centraal en stuur de buitenste verdedigers terug.' },
      { role: 'RA', x: 82, y: 78, wie: 'Sasha', bal: 'Schuif op langs de zijlijn als Nassim achter blijft. Jij maakt rechts de breedte en speelt in op Maddox.', geen: 'Nooit samen met Nassim hoog: één van jullie blijft altijd achter.' },
      { role: 'CM', x: 38, y: 56, wie: 'Amine', naam: 'Spelmaker', bal: 'Haal de bal, kijk om en draai. Zoek Colin in de diepte of Maddox in de voeten, en ga daarna mee voor de tweede bal.', geen: 'Zet druk op hun middenvelder. Suleiman blijft achter je.' },
      { role: 'CM', x: 62, y: 60, wie: 'Suleiman', naam: 'Controleur', bal: 'Sta schuin achter Amine als aanspeelpunt. Zit het midden dicht, speel dan simpel breed naar een buitenste verdediger.', geen: 'Jij blijft altijd voor de verdediging. Onderschep de bal en geef hem meteen aan Amine.' },
      { role: 'SP', x: 38, y: 24, wie: 'Colin', naam: 'Diepe spits', bal: 'Loop diep in de ruimte tussen hun centrale verdediger en de back. Maddox komt kort, jij gaat lang.', geen: 'Zet samen met Maddox druk op hun verdedigers en sluit de pass naar het midden af.' },
      { role: 'SP', x: 62, y: 26, wie: 'Maddox', naam: 'Tweede spits', bal: 'Kom kort tussen de linies, draai op je rechterbeen en schiet, of steek Colin diep.', geen: 'Jaag op de verdediger met de bal; Colin pakt de pass naar zijn maatje.' }
    ] },
  '1313': { naam: '1-3-1-3', titel: 'Breed aanvallen 1-3-1-3',
    idee: 'Drie achter, Amine als enige middenvelder en drie aanvallers hoog en breed. We zetten de tegenstander vast op zijn eigen helft.',
    sterk: 'Drie aanvallers houden hun hele verdediging bezig; het veld wordt groot en Amine krijgt ruimte.',
    risico: 'Amine staat alleen in het midden. Bij balverlies moeten de buitenspelers meteen terug tot de middenlijn.',
    slots: [
      { role: 'K', x: 50, y: 94, wie: 'Mees' },
      { role: 'LA', x: 18, y: 78, wie: 'Nassim', bal: 'Schuif op tot de middenlijn en speel kort op Amine of op Maddox aan de zijlijn.' },
      { role: 'CV', x: 50, y: 82, wie: 'Sjoerd' },
      { role: 'RA', x: 82, y: 78, wie: 'Sasha', bal: 'Schuif in naast Amine, zodat hij er niet alleen voor staat.', geen: 'Bij balverlies meteen terug naar rechtsachter.' },
      { role: 'CM', x: 50, y: 58, wie: 'Amine', naam: 'Enige middenvelder', bal: 'Jij bent het aanspeelpunt in het midden: blijf bewegen, kijk om en speel de drie aanvallers aan. Ga niet te ver mee naar voren.', geen: 'Blijf in het midden voor de verdediging en vertraag de tegenstander tot de buitenspelers terug zijn.' },
      { role: 'LB', x: 14, y: 28, wie: 'Maddox', bal: 'Blijf hoog en breed bij de zijlijn. Neem de bal aan en snij naar binnen op je rechterbeen.', geen: 'Zet druk op hun rechtsachter. Bij balverlies vijf seconden jagen, dan terug tot de middenlijn.' },
      { role: 'SP', x: 50, y: 22, wie: 'Colin', bal: 'Blijf tussen de centrale verdedigers. Kom kort om te kaatsen, ga diep zodra een buitenspeler de bal heeft.', geen: 'Zet druk op hun laatste man.' },
      { role: 'RB', x: 86, y: 28, wie: 'Suleiman', bal: 'Sta hoog en breed. Ga 1 tegen 1 of geef een lage voorzet op Colin.', geen: 'Zet druk op hun linksachter, dan terug tot de middenlijn.' }
    ] },
  '1232': { naam: '1-2-3-2', titel: 'Bij achterstand 1-2-3-2',
    idee: 'Twee verdedigers, drie middenvelders en twee spitsen. Aanvallender, maar kwetsbaar bij balverlies, dus alleen als we moeten scoren.',
    sterk: 'Veel spelers rond hun zestien; elke bal mag snel naar voren.',
    risico: 'Achter staan er maar twee. Bij balverlies moet iedereen een sprint terug trekken.',
    slots: [
      { role: 'K', x: 50, y: 94, wie: 'Mees', geen: 'Sta wat verder voor je doel; een lange bal achter de verdediging is voor jou.' },
      { role: 'CV', x: 34, y: 78, wie: 'Sjoerd', naam: 'Linker verdediger', bal: 'Jullie staan met z\'n tweeën achter. Speel rustig breed naar je maatje of kort op Amine.', geen: 'Jij blijft altijd achter, ook bij een corner voor ons.' },
      { role: 'CV', x: 66, y: 78, wie: 'Sasha', naam: 'Rechter verdediger', bal: 'Je mag inschuiven tot de middenlijn, nooit verder.', geen: 'Bij balverlies meteen terug naast Sjoerd. Blijf dicht bij elkaar.' },
      { role: 'LM', x: 15, y: 50, wie: 'Maddox', bal: 'Breed bij de zijlijn, snij naar binnen en schiet.', geen: 'Loop terug tot naast de verdedigers: jij bent nu ook linksachter.' },
      { role: 'CM', x: 50, y: 56, wie: 'Amine', bal: 'Speel snel vooruit naar de twee spitsen; elke bal mag naar voren.', geen: 'Zak terug voor de twee verdedigers.' },
      { role: 'RM', x: 85, y: 50, wie: 'Suleiman', bal: 'Breed en hoog, geef voorzetten op de spitsen.', geen: 'Terug tot naast Sasha.' },
      { role: 'SP', x: 38, y: 24, wie: 'Colin', naam: 'Diepe spits', bal: 'Loop diep; Joas komt kort.', geen: 'Zet druk op hun verdedigers.' },
      { role: 'SP', x: 62, y: 24, wie: 'Joas', naam: 'Tweede spits', bal: 'Kom kort, kaats op Amine en ga mee de zestien in.', geen: 'Zet druk op de verdediger met de bal.' }
    ] },
  '1421': { naam: '1-4-2-1', titel: 'Compact 1-4-2-1',
    idee: 'Vier achter, twee op het middenveld en Colin alleen voorin. Voor tegenstanders die sneller of sterker zijn: weinig ruimte achter ons, en bij balwinst snel naar Colin.',
    sterk: 'Moeilijk te bespelen; de verdediging kan altijd met één speler extra dekken.',
    risico: 'Colin staat alleen. Het middenveld moet snel aansluiten, anders komt de bal steeds terug.',
    slots: [
      { role: 'K', x: 50, y: 95, wie: 'Mees', geen: 'Kom uit je doel bij een lange bal achter de verdediging.' },
      { role: 'LA', x: 12, y: 78, wie: 'Nassim', bal: 'Speel kort op Amine of meteen diep op Colin.', geen: 'Blijf dicht bij je centrale verdediger, laat geen gat.' },
      { role: 'CV', x: 38, y: 83, wie: 'Sjoerd', bal: 'Speel breed naar Nassim of kort op Amine.', geen: 'Jij en Sasha staan dicht bij elkaar: één gaat naar de bal, de ander dekt achter hem.' },
      { role: 'CV', x: 62, y: 83, wie: 'Sasha', bal: 'Speel kort op Amine of breed naar rechts.', geen: 'Dek achter Sjoerd als hij naar de bal gaat.' },
      { role: 'RA', x: 88, y: 78, wie: 'Suleiman', bal: 'Schuif op als de bal rechts is en we rust hebben.', geen: 'Houd je man voor je en laat hem niet naar binnen.' },
      { role: 'CM', x: 38, y: 60, wie: 'Amine', naam: 'Controleur en spelverdeler', bal: 'Bij balwinst meteen kijken naar Colin. Is hij niet vrij, dan rustig kort houden.', geen: 'Blijf voor de verdediging en sluit het midden af.' },
      { role: 'CM', x: 62, y: 56, wie: 'Maddox', naam: 'Aanvallende middenvelder', bal: 'Sluit snel aan bij Colin als hij de bal heeft. Schiet van afstand als je ruimte krijgt.', geen: 'Loop terug tot naast Amine; samen sluiten jullie het midden af.' },
      { role: 'SP', x: 50, y: 32, wie: 'Colin', naam: 'Uitvalspunt', bal: 'Bij balwinst ben jij het aanspeelpunt. Houd de bal vast tot Maddox aansluit, of ga zelf diep.', geen: 'Blijf tussen hun verdedigers en de middenlijn; jaag niet op de keeper.' }
    ] }
};
const SLUG_SYS = { basis: '1331', fase1: '1331', druk: '1331', voorsprong: '1331', zondermees: '1331', achterstand: '1232', tweespitsen: '1322' };
const sysOf = L => L?.data?.sys || SLUG_SYS[L?.data?.slug] || null;
/* De plek in het systeemsjabloon die bij dit slot hoort: zelfde positie, zelfde volgnummer. */
function tplSlot(L, slot, orig = slot) {
  const T = SYSTEMS[sysOf(L)]; if (!T) return null;
  const at = L.data.slots.indexOf(orig);
  const nr = L.data.slots.slice(0, at < 0 ? 0 : at).filter(s => s.role === slot.role).length;
  return T.slots.filter(s => s.role === slot.role)[nr] || null;
}
/* Taken voor deze plek: eigen aanpassing in deze opstelling, anders het systeem, anders de positiekaart. */
function slotTasks(L, slot, orig = slot) {
  const rc = roleCard(slot.role)?.data || ROLES[slot.role] || {};
  const t = tplSlot(L, slot, orig) || {};
  return {
    naam: slot.naam || t.naam || rc.naam || slot.role,
    bal: slot.bal || t.bal || rc.bal || '', geen: slot.geen || t.geen || rc.geen || '',
    eigen: !!(slot.bal || slot.geen), rc
  };
}

const REACT = { top: 'Top!', goed_bezig: 'Goed bezig', knap: 'Knap gedaan', volhouden: 'Volhouden' };
const MOOD = { 1: '😕', 2: '🙂', 3: '😄' };
function weekStart(d = new Date()) { const x = new Date(d.getFullYear(), d.getMonth(), d.getDate()); x.setDate(x.getDate() - ((x.getDay() + 6) % 7)); return `${x.getFullYear()}-${String(x.getMonth() + 1).padStart(2, '0')}-${String(x.getDate()).padStart(2, '0')}`; }
function shiftWeek(ws, n) { const [y, m, d] = ws.split('-').map(Number); return weekStart(new Date(y, m - 1, d + 7 * n)); }
function weekLabel(ws) { const [y, m, d] = ws.split('-').map(Number); const a = new Date(y, m - 1, d), b = new Date(y, m - 1, d + 6); const f = x => x.toLocaleDateString('nl-NL', { day: 'numeric', month: 'short' }); return `${f(a)} – ${f(b)}`; }

/* ---------------- toestand ---------------- */
const S = { mode: 'loading', user: null, teams: [], team: null, players: [], content: [], staff: false, view: 'opstelling', scen: null, pat: null, step: 0, tf: 'Alle' };
const kind = k => S.content.filter(c => c.kind === k).sort((a, b) => a.sort - b.sort);
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
    const { error } = await sb.from('content').insert(Object.entries(ROLES).map(([code, r], i) => ({ team_id: S.team.id, kind: 'session', title: r.naam, sort: i, data: { role: code, ...r }, updated_by: S.user.id })));
    if (!error) await reloadTeamData();
  }
  await ensureSystems();
  render();
}
/* Elk systeem uit de bibliotheek staat één keer klaar als opstelling, ingevuld op kwaliteit. */
function lineupFromSystem(code) {
  const T = SYSTEMS[code], byName = n => S.players.find(p => p.nickname.toLowerCase() === String(n || '').toLowerCase())?.id || null;
  const used = new Set();
  const slots = T.slots.map(t => { const id = byName(t.wie); if (id) used.add(id); return { role: t.role, x: t.x, y: t.y, player_id: id }; });
  slots.forEach(sl => { sl.alt = (SEED.ALT[sl.role] || []).map(byName).filter(id => id && id !== sl.player_id); });
  return { sys: code, slug: 'sys-' + code, note: T.idee, slots };
}
async function ensureSystems() {
  if (!S.staff || !S.players.length) return;
  const have = new Set(kind('lineup').map(sysOf).filter(Boolean));
  const missing = Object.keys(SYSTEMS).filter(c => !have.has(c));
  if (!missing.length) return;
  const base = Math.max(-1, ...kind('lineup').map(c => c.sort)) + 1;
  const { error } = await sb.from('content').insert(missing.map((c, i) => ({ team_id: S.team.id, kind: 'lineup', title: SYSTEMS[c].titel, sort: base + i, data: lineupFromSystem(c), updated_by: S.user.id })));
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
    <p class="muted small">Het team start met de opstellingen, patronen, trainingen en taken die al zijn uitgewerkt. Alles is daarna aan te passen.</p>
    <label class="f" for="tn">Teamnaam</label><input class="i" id="tn" required value="JO12">
    <label class="f" for="tc">Club</label><input class="i" id="tc" value="FC Geleen Zuid">
    <label class="f" for="ts">Seizoen</label><input class="i" id="ts" value="2026-2027">
    <label class="row small mt"><input type="checkbox" id="tseed" checked> Startinhoud en selectie laden (12 spelers met voornaam)</label>
    <div class="row mt"><button class="btn primary" type="submit" id="ctBtn">Team aanmaken</button></div><p class="small muted" id="ctMsg"></p></form>`);
  $('#ctForm').onsubmit = async e => {
    e.preventDefault(); $('#ctBtn').disabled = true; $('#ctMsg').textContent = 'Team aanmaken…';
    const { data: id, error } = await sb.rpc('create_team', { p_name: $('#tn').value.trim(), p_club: $('#tc').value.trim() || null, p_season: $('#ts').value.trim() || null });
    if (error) { $('#ctMsg').textContent = error.message; $('#ctBtn').disabled = false; return; }
    if ($('#tseed').checked) { $('#ctMsg').textContent = 'Startinhoud laden…'; await seedTeam(id); }
    await loadStaff(id);
  };
}

/* ---------------- startinhoud ---------------- */
async function seedTeam(teamId) {
  const ids = {};
  for (const name of SEED.ROSTER) {
    const t = SEED.TASK[name];
    const { data } = await sb.rpc('add_player', { p_team: teamId, p_nickname: name, p_position: t?.pos || null });
    if (data?.[0]) ids[name] = data[0].player_id;
  }
  const rows = [];
  SEED.SCEN.forEach((s, i) => rows.push({ team_id: teamId, kind: 'lineup', title: s.name, sort: i, data: {
    slug: s.id, note: s.note,
    slots: Object.entries(s.pos).map(([n, v]) => ({ role: v[2], x: v[0], y: v[1], player_id: ids[n] || null,
      alt: (SEED.ALT[v[2]] || []).map(a => ids[a]).filter(Boolean) })) } }));
  SEED.PAT.forEach((p, i) => rows.push({ team_id: teamId, kind: 'pattern', title: p.name, sort: i, data: { slug: p.id, frames: p.frames } }));
  SEED.DRILLS.forEach((d, i) => { const { name, ...rest } = d; rows.push({ team_id: teamId, kind: 'drill', title: name, sort: i, data: { ...rest, slug: d.id } }); });
  SEED.TRAIN.forEach((t, i) => rows.push({ team_id: teamId, kind: 'plan', title: t.name, sort: i, data: { weken: t.weken, prob: t.prob, drills: t.drills } }));
  HOME.forEach((h, i) => { const { title, ...rest } = h; rows.push({ team_id: teamId, kind: 'homedrill', title, sort: i, data: rest }); });
  SEED.ROSTER.forEach((n, i) => { if (ids[n]) rows.push({ team_id: teamId, kind: 'taskcard', title: n, sort: i, data: { player_id: ids[n], extra: PERSONAL[n] || [] } }); });
  const { error } = await sb.from('content').insert(rows);
  if (error) toast('Startinhoud deels geladen: ' + error.message);
  await sb.from('content').insert(Object.entries(ROLES).map(([code, r], i) => ({ team_id: teamId, kind: 'session', title: r.naam, sort: i, data: { role: code, ...r } })));
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
  const views = S.staff ? [VIEWS[0], ['huiswerk', 'Huiswerk'], ...VIEWS.slice(1), ['beheer', 'Beheer']] : S.mode === 'player' ? [['week', 'Mijn week'], ...VIEWS] : VIEWS;
  if (!views.some(v => v[0] === S.view)) S.view = views[0][0];
  const teamSel = S.staff && S.teams.length > 1 ? `<select class="i" id="teamSel" style="width:auto;padding:6px 10px">${S.teams.map(t => `<option value="${t.id}" ${t.id === S.team.id ? 'selected' : ''}>${esc(t.name)}</option>`).join('')}</select>` : '';
  $('#app').innerHTML = `<header class="top"><div><div class="club">${esc(S.team.club || '')} · ${esc(S.team.name)}</div><h1 class="title">Ons <span>Speelboek</span></h1></div>
    <div class="who">${S.staff ? `${teamSel}<div class="mt small">Trainer · <a href="#" id="logout" style="color:inherit">uitloggen</a></div>` : S.mode === 'player' ? `<span class="badge">${esc(S.me.nickname)}</span>` : '<span class="badge">Meekijken</span>'}</div></header>
    <nav class="tabs" aria-label="Onderdelen">${views.map(([k, l]) => `<button data-v="${k}" ${k === S.view ? 'aria-current="page"' : ''}>${l}</button>`).join('')}</nav>
    <section id="view"></section>`;
  document.querySelectorAll('nav.tabs button').forEach(b => b.onclick = () => { S.view = b.dataset.v; stopPlay(); render(); });
  if ($('#logout')) $('#logout').onclick = async e => { e.preventDefault(); await sb.auth.signOut(); location.hash = ''; location.reload(); };
  if ($('#teamSel')) $('#teamSel').onchange = e => loadStaff(e.target.value);
  ({ week: viewWeek, huiswerk: viewHomework, opstelling: viewLineup, patronen: viewPatterns, trainingen: viewTrainings, spelers: viewPlayers, beheer: viewAdmin })[S.view]();
}

/* ---------------- veld ---------------- */
function Board(svg, prefix) {
  svg.setAttribute('viewBox', '0 0 60 90'); svg.innerHTML = '';
  const defs = el('defs', {}, svg);
  [['W', '#ffffff'], ['Y', '#ffd84d']].forEach(([n, c]) => { const m = el('marker', { id: prefix + n, viewBox: '0 0 6 6', refX: '5', refY: '3', markerWidth: '4', markerHeight: '4', orient: 'auto' }, defs); el('path', { d: 'M0,0 L6,3 L0,6 z', fill: c }, m); });
  const g = el('linearGradient', { id: prefix + 'g', x1: '0', y1: '0', x2: '0', y2: '1' }, defs);
  el('stop', { offset: '0', 'stop-color': '#2f7a46' }, g); el('stop', { offset: '1', 'stop-color': '#1d5631' }, g);
  const v = el('radialGradient', { id: prefix + 'v', cx: '.5', cy: '.45', r: '.75' }, defs);
  el('stop', { offset: '.55', 'stop-color': '#000', 'stop-opacity': '0' }, v); el('stop', { offset: '1', 'stop-color': '#000', 'stop-opacity': '.45' }, v);
  const sh = el('filter', { id: prefix + 's', x: '-50%', y: '-50%', width: '200%', height: '200%' }, defs);
  el('feDropShadow', { dx: '0', dy: '.6', stdDeviation: '.6', 'flood-color': '#000', 'flood-opacity': '.55' }, sh);
  el('rect', { x: 0, y: 0, width: 60, height: 90, fill: `url(#${prefix}g)` }, svg);
  for (let i = 0; i < 9; i++) if (i % 2) el('rect', { x: 0, y: i * 10, width: 60, height: 10, fill: '#fff', opacity: '.035' }, svg);
  const L = el('g', { stroke: 'rgba(255,255,255,.78)', 'stroke-width': '.3', fill: 'none' }, svg);
  el('rect', { x: 2, y: 2, width: 56, height: 86 }, L); el('line', { x1: 2, y1: 45, x2: 58, y2: 45 }, L); el('circle', { cx: 30, cy: 45, r: 6 }, L);
  el('rect', { x: 15, y: 2, width: 30, height: 13 }, L); el('rect', { x: 23, y: 2, width: 14, height: 5 }, L);
  el('rect', { x: 15, y: 75, width: 30, height: 13 }, L); el('rect', { x: 23, y: 83, width: 14, height: 5 }, L);
  el('rect', { x: 26, y: .5, width: 8, height: 1.5 }, L); el('rect', { x: 26, y: 88, width: 8, height: 1.5 }, L);
  [[30, 45], [30, 11], [30, 79]].forEach(([a, b]) => el('circle', { cx: a, cy: b, r: .4, fill: 'rgba(255,255,255,.8)' }, svg));
  el('rect', { x: 0, y: 0, width: 60, height: 90, fill: `url(#${prefix}v)`, 'pointer-events': 'none' }, svg);
  const gA = el('g', {}, svg), gT = el('g', {}, svg);
  const ball = el('g', { class: 'ballg' }, svg);
  el('circle', { r: 1.3, fill: '#fff', stroke: '#111', 'stroke-width': '.3', filter: `url(#${prefix}s)` }, ball); ball.style.display = 'none';
  const toks = {};
  const place = (k, x, y) => { const t = toks[k]; if (t) t.g.style.transform = `translate(${X(x)}px,${Y(y)}px)`; };
  function make(o) {
    const g = el('g', { class: 'tok' }, gT); g.dataset.key = o.key;
    const own = o.team !== 'opp';
    const club = getComputedStyle(document.documentElement).getPropertyValue('--club').trim() || '#db1e3b';
    el('path', { d: SHIRT, fill: own ? club : '#e9edf2', stroke: own ? 'rgba(0,0,0,.55)' : '#24364d', 'stroke-width': '.35', filter: `url(#${prefix}s)` }, g);
    const lab = el('text', { y: '1.4', 'text-anchor': 'middle', 'font-size': '2.3', 'font-weight': '800', 'font-family': 'Barlow Condensed, Arial Narrow, sans-serif', fill: own ? '#fff' : '#24364d' }, g);
    const nm = el('text', { y: '6.6', 'text-anchor': 'middle', 'font-size': '2.5', 'font-weight': '700', 'font-family': 'Barlow, sans-serif', fill: '#fff', stroke: 'rgba(0,0,0,.7)', 'stroke-width': '.6', 'paint-order': 'stroke' }, g);
    return (toks[o.key] = { g, lab, nm });
  }
  return {
    svg, place,
    render(list, instant) {
      if (instant) svg.classList.add('noanim');
      const keys = new Set(list.map(o => o.key));
      Object.keys(toks).forEach(k => { if (!keys.has(k)) { toks[k].g.remove(); delete toks[k]; } });
      list.forEach(o => {
        const t = toks[o.key] || make(o);
        t.lab.textContent = o.label || '';
        t.nm.textContent = '';
        (o.names || [o.name || '']).forEach((n, i) => { const ts = el('tspan', { x: '0', dy: i ? '2.5' : '0', 'font-size': i ? '2.05' : '2.5', 'fill-opacity': i ? '.85' : '1' }, t.nm); ts.textContent = n; });
        t.g.setAttribute('aria-label', o.name ? `${o.name}${o.label ? ', ' + o.label : ''}` : 'Tegenstander');
        place(o.key, o.x, o.y);
      });
      if (instant) { svg.getBoundingClientRect(); requestAnimationFrame(() => svg.classList.remove('noanim')); }
    },
    ball(b) { if (!b) { ball.style.display = 'none'; return; } ball.style.display = ''; ball.style.transform = `translate(${X(b[0])}px,${Y(b[1]) + 2.8}px)`; },
    arrows(arr) {
      gA.innerHTML = '';
      (arr || []).forEach(a => {
        const at = a[4] === 'run' ? { stroke: '#ffd84d', 'stroke-width': '.5', 'stroke-dasharray': '1.3 .9', 'marker-end': `url(#${prefix}Y)` }
          : a[4] === 'drib' ? { stroke: '#fff', 'stroke-width': '.5', 'stroke-dasharray': '.3 .8', 'stroke-linecap': 'round', 'marker-end': `url(#${prefix}W)` }
            : { stroke: '#fff', 'stroke-width': '.45', 'marker-end': `url(#${prefix}W)` };
        el('line', Object.assign({ x1: X(a[0]), y1: Y(a[1]), x2: X(a[2]), y2: Y(a[3]), fill: 'none' }, at), gA);
      });
    }
  };
}

/* ---------------- opstelling ---------------- */
const OPP = SEED.OPP;
let lineupBoard = null, showOpp = false, benchSel = null;
let selSlot = null;
function viewLineup() {
  const lineups = kind('lineup');
  if (!lineups.length) { $('#view').innerHTML = `<div class="panel empty">Nog geen opstellingen.</div>`; return; }
  if (!S.scen || !lineups.find(l => l.id === S.scen)) S.scen = lineups[0].id;
  const L = lineups.find(l => l.id === S.scen);
  const T = SYSTEMS[sysOf(L)];
  $('#view').innerHTML = `<div class="chips" role="group" aria-label="Systeem of wedstrijdsituatie">${lineups.map(l => `<button data-id="${l.id}" class="${l.id === S.scen ? 'on' : ''}">${esc(l.title)}</button>`).join('')}</div>
    <div class="layout"><div><svg class="pitch ${S.staff ? 'edit' : ''}" id="pitch" aria-label="Veld met opstelling"></svg>
      <div class="row mt"><button class="btn" id="oppT">${showOpp ? 'Tegenstander verbergen' : 'Tegenstander tonen'}</button>${S.staff ? '<button class="btn ghost" id="addSys">Systeem toevoegen</button><button class="btn ghost" id="addL">Nieuwe situatie</button>' : ''}</div></div>
      <div><div class="panel"><div class="kicker">${T ? 'Systeem ' + esc(T.naam) : 'Wedstrijdsituatie'}</div><h2>${esc(L.title)}</h2><p style="margin:0">${esc(L.data.note || '')}</p>
        ${T ? `<dl class="task sysinfo"><dt>Sterk</dt><dd>${esc(T.sterk)}</dd><dt>Risico</dt><dd>${esc(T.risico)}</dd></dl>` : ''}
        ${S.staff ? `<p class="small muted mt">Tik op een shirt voor de taken van die speler in dit systeem. Sleep een shirt om het te verplaatsen.</p><div class="row"><button class="btn ghost" id="editL">Naam en uitleg aanpassen</button></div>
        <h3 class="mt">Niet opgesteld</h3><div class="bench" id="bench"></div><p class="small muted" style="margin:6px 0 0">Tik op een naam en daarna op een shirt om te wisselen. De taken passen zich meteen aan.</p>` : '<p class="small muted mt">Tik op een speler voor zijn taken in dit systeem.</p>'}</div>
        <div class="panel mt" id="card" aria-live="polite"></div></div></div>`;
  document.querySelectorAll('.chips button').forEach(b => b.onclick = () => { S.scen = b.dataset.id; benchSel = null; selSlot = null; viewLineup(); });
  $('#oppT').onclick = () => { showOpp = !showOpp; viewLineup(); };
  lineupBoard = Board($('#pitch'), 'b');
  if (selSlot == null || !L.data.slots[selSlot]) selSlot = Math.max(0, L.data.slots.findIndex(s => s.role === 'CM'));
  drawLineup(L, true);
  if (S.staff) {
    $('#editL').onclick = () => editLineupMeta(L);
    $('#addL').onclick = async () => { const base = L; const row = await insertContent('lineup', 'Nieuwe situatie', JSON.parse(JSON.stringify({ ...base.data, slug: null, note: '' }))); if (row) { S.scen = row.id; viewLineup(); } };
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
    ${Object.entries(SYSTEMS).map(([c, T]) => `<label class="sysopt"><input type="radio" name="sysc" value="${c}" ${c === '1322' ? 'checked' : ''}><span><b>${esc(T.titel)}</b><br><span class="small muted">${esc(T.idee)}</span></span></label>`).join('')}`,
    [['Annuleren'], ['Toevoegen', 'primary', async () => {
      const c = document.querySelector('input[name=sysc]:checked')?.value; if (!c) return;
      const row = await insertContent('lineup', SYSTEMS[c].titel, lineupFromSystem(c));
      if (row) { S.scen = row.id; selSlot = null; viewLineup(); toast(`${SYSTEMS[c].titel} staat klaar`); }
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
  return `<div class="pcard">${shirtSVG(slot.role)}<div><h2 style="margin:0">Nog leeg</h2><div class="muted">${esc(st.naam)} · ${esc(L.title)}</div></div></div>
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
    return { key: 's' + i, name: p ? p.nickname : '—', names: alts.length ? [p ? p.nickname : '—', alts.join(' / ')] : [p ? p.nickname : '—'], label: p?.shirt ?? s.role, x: s.x, y: s.y };
  });
  if (showOpp) OPP.forEach((o, i) => list.push({ key: 'o' + i, team: 'opp', x: o[0], y: o[1] }));
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
  const toU = e => { const pt = svg.createSVGPoint(); pt.x = e.clientX; pt.y = e.clientY; const p = pt.matrixTransform(svg.getScreenCTM().inverse()); return [Math.min(99, Math.max(1, (p.x - 2) / .56)), Math.min(99, Math.max(1, (p.y - 2) / .86))]; };
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
function curLineup() { const ls = kind('lineup'); return ls.find(l => l.id === S.scen) || ls[0]; }
function roleCards() { const db = kind('session'); return db.length ? db : Object.entries(ROLES).map(([code, r], i) => ({ id: 'std-' + code, kind: 'session', title: r.naam, sort: i, std: true, data: { role: code, ...r } })); }
function roleCard(code) { return roleCards().find(r => r.data.role === code); }
function roleName(code) { return roleCard(code)?.data.naam || ROLES[code]?.naam || code; }
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
  const drills = (r?.drills || []).map(sl => bySlug('drill', sl)).filter(Boolean);
  const homes = (r?.home || []).map(sl => bySlug('homedrill', sl)).filter(Boolean);
  const roleExtra = (rc?.data.extra || []).map(x => x.split(' ').slice(0, 3).join(' ').toLowerCase());
  const personal = (tc?.data.extra || []).filter(x => !roleExtra.includes(x.split(' ').slice(0, 3).join(' ').toLowerCase()));
  const st = slot ? slotTasks(L, slot) : null;
  const head = `<div class="pcard">${shirtSVG(p.shirt ?? (slot?.role || ''))}<div><h2 style="margin:0">${esc(p.nickname)}</h2><div class="muted">${slot ? `${esc(st.naam)} · ${esc(L.title)}` : `Niet opgesteld in ${esc(L?.title || 'deze situatie')}`}</div></div></div>`;
  if (!r && !st) {
    const legacy = tc?.data;
    return head + (alsoRoles.length ? `<p class="small muted mt">Kan in deze situatie ook spelen als ${alsoRoles.map(x => esc(roleName(x))).join(' of ')}.</p>` : '') +
      (legacy?.bal ? `<dl class="task"><dt>Wij hebben de bal</dt><dd>${esc(legacy.bal)}</dd><dt>Zij hebben de bal</dt><dd>${esc(legacy.geen || '')}</dd></dl>` : '') +
      (personal.length ? `<dl class="task"><dt>Persoonlijk</dt>${personal.map(x => `<dd>${esc(x)}</dd>`).join('')}</dl>` : '');
  }
  const extra = [...(r?.extra || []), ...(slot?.note ? [slot.note] : [])];
  return head + `<dl class="task"><dt>Wij hebben de bal</dt><dd>${esc(st.bal)}</dd><dt>Zij hebben de bal</dt><dd>${esc(st.geen)}</dd>
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
    <p class="small muted" style="margin:4px 0 0">Kies je een andere positie, dan vullen deze velden zich met de taken van die positie in dit systeem.</p>
    <label class="f" for="sno">Extra taak in deze situatie (optioneel)</label><input class="i" id="sno" maxlength="200" value="${esc(slot.note || '')}">
    <label class="f">Kan hier ook spelen</label><div class="grid two">${opts.map(p => `<label class="small"><input type="checkbox" value="${p.id}" class="altc" ${(slot.alt || []).includes(p.id) ? 'checked' : ''}> ${esc(p.nickname)}</label>`).join('')}</div>`,
    [['Annuleren'], ['Opslaan', 'primary', () => {
      slot.player_id = $('#sp').value || null; slot.note = $('#sno').value.trim() || undefined;
      slot.role = $('#sr').value || slot.role;
      const auto = slotTasks(L, { ...slot, bal: undefined, geen: undefined, naam: undefined }, slot);
      const v = { bal: $('#sbal').value.trim(), geen: $('#sgeen').value.trim(), naam: $('#snm').value.trim() };
      for (const k of ['bal', 'geen', 'naam']) { if (v[k] && v[k] !== auto[k]) slot[k] = v[k]; else delete slot[k]; }
      slot.alt = [...document.querySelectorAll('.altc:checked')].map(c => c.value);
      saveContent(L, { data: L.data }); const i = L.data.slots.indexOf(slot); if ($('#pitch')) pickSlot(L, i); else showCard(slot.player_id);
    }]]);
  $('#sr').onchange = () => { const t = slotTasks(L, { ...slot, role: $('#sr').value, bal: undefined, geen: undefined, naam: undefined }, slot); $('#sbal').value = t.bal; $('#sgeen').value = t.geen; $('#snm').value = t.naam; };
}
function editLineupMeta(L) {
  openDialog(`<h2>Situatie aanpassen</h2><label class="f" for="lt">Naam</label><input class="i" id="lt" value="${esc(L.title)}" maxlength="60">
    <label class="f" for="ln">Uitleg</label><textarea class="i" id="ln">${esc(L.data.note || '')}</textarea>`,
    [['Verwijderen', 'danger', async () => { if (confirm('Deze situatie verwijderen?')) { await deleteContent(L); S.scen = null; viewLineup(); } }],
    ['Annuleren'], ['Opslaan', 'primary', async () => { await saveContent(L, { title: $('#lt').value.trim() || L.title, data: { ...L.data, note: $('#ln').value } }); viewLineup(); }]]);
}

/* ---------------- patronen ---------------- */
let patBoard = null, timer = null;
function basisRoleMap() {
  const basis = kind('lineup')[0];
  const m = {}; (basis?.data.slots || []).forEach(s => { m[s.role] = s.player_id; });
  return m;
}
function viewPatterns() {
  const pats = kind('pattern');
  if (!pats.length) { $('#view').innerHTML = `<div class="panel empty">Nog geen patronen.</div>`; return; }
  if (!S.pat || !pats.find(p => p.id === S.pat)) S.pat = pats[0].id;
  $('#view').innerHTML = `<div class="chips">${pats.map(p => `<button data-id="${p.id}" class="${p.id === S.pat ? 'on' : ''}">${esc(p.title)}</button>`).join('')}</div>
    <div class="layout"><svg class="pitch" id="ppitch" aria-label="Veld met spelpatroon"></svg>
    <div class="panel"><div class="kicker" id="pstep"></div><h2 id="ptitle"></h2><p class="caption" id="pcap" aria-live="polite"></p>
      <div class="row mt"><button class="btn" id="pprev">Vorige</button><button class="btn primary" id="pplay">Afspelen</button><button class="btn" id="pnext">Volgende</button></div>
      <p class="small muted mt">Witte lijn: pass. Gele stippellijn: loopactie. Witte stippen: dribbel.</p></div></div>`;
  document.querySelectorAll('.chips button').forEach(b => b.onclick = () => { S.pat = b.dataset.id; S.step = 0; stopPlay(); viewPatterns(); });
  patBoard = Board($('#ppitch'), 'p');
  $('#pprev').onclick = () => { stopPlay(); if (S.step > 0) { S.step--; drawPat(); } };
  $('#pnext').onclick = () => { const P = curPat(); stopPlay(); if (S.step < P.data.frames.length - 1) { S.step++; drawPat(); } };
  $('#pplay').onclick = () => { if (timer) return stopPlay(); S.step = 0; drawPat(true); $('#pplay').textContent = 'Pauze'; timer = setInterval(() => { const P = curPat(); if (S.step < P.data.frames.length - 1) { S.step++; drawPat(); } else stopPlay(); }, 2300); };
  drawPat(true);
}
const curPat = () => kind('pattern').find(p => p.id === S.pat);
function stopPlay() { if (timer) { clearInterval(timer); timer = null; } const b = $('#pplay'); if (b) b.textContent = 'Afspelen'; }
function drawPat(instant) {
  const P = curPat(); const fr = P.data.frames; const f = fr[S.step];
  const roles = basisRoleMap();
  const st = {}; Object.entries(SEED.BASIS).forEach(([n, v]) => st[n] = [v[0], v[1], v[2]]);
  for (let k = 0; k <= S.step; k++) if (fr[k].set) Object.entries(fr[k].set).forEach(([n, v]) => { if (st[n]) { st[n][0] = v[0]; st[n][1] = v[1]; } });
  const list = Object.entries(st).map(([n, v]) => { const pid = roles[v[2]]; return { key: 's' + n, name: pid ? nick(pid) : n, label: v[2], x: v[0], y: v[1] }; });
  (f.opp || []).forEach((o, i) => list.push({ key: 'o' + i, team: 'opp', x: o[0], y: o[1] }));
  patBoard.render(list, instant); patBoard.ball(f.ball); patBoard.arrows(f.ar);
  $('#ptitle').textContent = P.title; $('#pstep').textContent = `Stap ${S.step + 1} van ${fr.length}`;
  let cap = f.cap; Object.keys(SEED.BASIS).forEach(n => { const pid = roles[SEED.BASIS[n][2]]; if (pid && nick(pid) !== n) cap = cap.replaceAll(n, nick(pid)); });
  $('#pcap').textContent = cap;
  $('#pprev').disabled = S.step === 0; $('#pnext').disabled = S.step === fr.length - 1;
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
  const lineups = kind('lineup'); const L = curLineup();
  $('#view').innerHTML = `<div class="chips" role="group" aria-label="Situatie">${lineups.map(l => `<button data-sc="${l.id}" class="${l.id === L?.id ? 'on' : ''}">${esc(l.title)}</button>`).join('')}</div>
    <p class="muted small" style="margin:0 0 12px">De taken volgen uit de positie in de opstelling “${esc(L?.title || '')}”. Kies hierboven een andere situatie om te zien wat er dan verandert.</p>
    ${S.staff ? `<div class="row" style="margin-bottom:12px"><button class="btn primary" id="addP">Speler toevoegen</button><button class="btn" id="roles">Taken per positie</button></div>` : ''}
    <div class="grid two">${ps.map(p => `<article class="panel">${cardHTML(p, { lineup: L })}${S.staff ? `<div class="row mt"><span class="badge">${p.consent_at ? 'Toestemming gegeven' : 'Nog geen toestemming'}</span><button class="btn ghost" data-ep="${p.id}">Bewerken</button><button class="btn" data-link="${p.id}">Spelerslink</button></div>` : ''}</article>`).join('') || '<div class="panel empty">Nog geen spelers.</div>'}</div>`;
  document.querySelectorAll('[data-sc]').forEach(b => b.onclick = () => { S.scen = b.dataset.sc; viewPlayers(); });
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
  const x = rc?.data || { role: '', extra: [], drills: [], home: [] };
  const cb = (k, list, cls) => kind(k).map(d => { const sl = d.data.slug || d.id; return `<label class="small"><input type="checkbox" class="${cls}" value="${esc(sl)}" ${(list || []).includes(sl) ? 'checked' : ''}> ${esc(d.title)}</label>`; }).join('');
  openDialog(`<h2>${rc ? 'Positie bewerken' : 'Positie toevoegen'}</h2>
    <div class="grid two"><div><label class="f" for="rcode">Code</label><input class="i" id="rcode" maxlength="4" value="${esc(x.role)}" ${rc ? 'readonly' : ''} placeholder="bijv. CM"></div><div><label class="f" for="rnaam">Naam</label><input class="i" id="rnaam" value="${esc(rc?.title || '')}"></div></div>
    <label class="f" for="rbal">Wij hebben de bal</label><textarea class="i" id="rbal">${esc(x.bal || '')}</textarea>
    <label class="f" for="rgeen">Zij hebben de bal</label><textarea class="i" id="rgeen">${esc(x.geen || '')}</textarea>
    <label class="f" for="rex">Let op (één per regel)</label><textarea class="i" id="rex">${esc((x.extra || []).join('\n'))}</textarea>
    <label class="f">Oefenvormen op de training</label><div class="grid two">${cb('drill', x.drills, 'rdc')}</div>
    <label class="f">Thuis oefenen</label><div class="grid two">${cb('homedrill', x.home, 'rhc')}</div>`,
    [...(rc ? [['Verwijderen', 'danger', async () => { if (confirm('Deze positie verwijderen?')) { await deleteContent(rc); viewRoles(); } }]] : []),
    ['Annuleren'], ['Opslaan', 'primary', async () => {
      const role = $('#rcode').value.trim().toUpperCase(), naam = $('#rnaam').value.trim();
      if (!role || !naam) return toast('Vul een code en een naam in');
      const data = { role, naam, bal: $('#rbal').value.trim(), geen: $('#rgeen').value.trim(), extra: $('#rex').value.split('\n').map(t => t.trim()).filter(Boolean),
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
    <form class="panel" id="tf"><div class="kicker">Team</div><h2>Gegevens en kleuren</h2>
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
    <div class="panel"><div class="kicker">Meer teams</div><h2>Nog een team</h2><p class="muted small">Maak een tweede team aan, bijvoorbeeld voor een ander leeftijdsteam. Je wisselt bovenaan tussen teams.</p><button class="btn" id="newTeam">Nieuw team aanmaken</button></div>
    <div class="panel"><div class="kicker">Privacy</div><h2>Einde seizoen</h2><p class="muted small">Verwijdert alle spelers, taakkaarten en huiswerk. Opstellingen, patronen en oefenvormen blijven bewaard voor volgend seizoen.</p>
      <button class="btn danger" id="wipe">Seizoen afsluiten</button></div></div>`;
  $('#cpl').onclick = () => copy(link, 'Teamlink gekopieerd');
  $('#newTeam').onclick = () => renderCreateTeam();
  $('#newl').onclick = async () => { if (!confirm('Nieuwe link maken? De oude werkt daarna niet meer.')) return; const { data, error } = await sb.rpc('new_share_token', { p_team: S.team.id }); if (error) return toast(error.message); S.team.share_token = data; viewAdmin(); toast('Nieuwe link gemaakt'); };
  $('#tf').onsubmit = async e => {
    e.preventDefault();
    const patch = { name: $('#an').value.trim() || S.team.name, club: $('#ac').value.trim() || null, season: $('#as').value.trim() || null, colors: { primary: $('#c1').value, secondary: $('#c2').value } };
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
function assignByRole() {
  const lineups = kind('lineup');
  openDialog(`<div class="kicker">Week ${weekLabel(S.week)}</div><h2>Huiswerk per positie</h2>
    <p class="small muted">Iedere speler krijgt de thuisoefeningen die bij zijn positie horen, volgens de gekozen opstelling.</p>
    <label class="f" for="abl">Opstelling</label><select class="i" id="abl">${lineups.map(l => `<option value="${l.id}" ${l.id === curLineup()?.id ? 'selected' : ''}>${esc(l.title)}</option>`).join('')}</select>
    <label class="f" for="abn">Aantal oefeningen per speler</label><select class="i" id="abn"><option value="1">1</option><option value="2" selected>2</option><option value="3">3</option></select>
    <div id="abprev" class="small mt"></div>`,
    [['Annuleren'], ['Geven', 'primary', async () => {
      const rows = plan(); if (!rows.length) return toast('Geen passende oefeningen gevonden');
      const { error } = await sb.from('assignments').insert(rows.map(r => ({ team_id: S.team.id, drill_id: r.drill.id, player_id: r.pid, week_start: S.week, note: `Voor jouw positie: ${r.role}` })));
      if (error) return toast(error.message);
      toast(`${rows.length} oefeningen gegeven`); viewHomework();
    }]]);
  function plan() {
    const L = lineups.find(l => l.id === $('#abl').value), n = +$('#abn').value, rows = [];
    (L?.data.slots || []).forEach(s => { if (!s.player_id || !playerById(s.player_id)) return; const rc = roleCard(s.role); (rc?.data.home || []).slice(0, n).forEach(sl => { const d = kind('homedrill').find(h => h.data.slug === sl || h.id === sl); if (d) rows.push({ pid: s.player_id, drill: d, role: rc.title }); }); });
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
      <h3 class="mt">Jouw taak op het veld</h3>${cardHTML(playerById(me.id) || { id: me.id, nickname: me.nickname, shirt: me.shirt }, { lineup: kind('lineup')[0] }).replace(/^<div class="pcard">[\s\S]*?<\/div><\/div><\/div>/, '')}</div>
    <div class="grid">${S.assign.map(a => { const h = { title: a.drill.title, data: a.drill.data };
      return `<article class="panel">${homeHTML(h, `${a.note ? `<p class="small"><strong>Trainer:</strong> “${esc(a.note)}”</p>` : ''}
        ${a.done ? `<p><strong>Gedaan ${MOOD[a.mood] || '✓'}</strong>${a.reaction ? ` · Trainer: <strong>${esc(REACT[a.reaction])}</strong>` : ''}</p><button class="btn ghost" data-undo="${a.id}">Toch nog niet gedaan</button>` :
        `<p class="small muted" style="margin-bottom:6px">Gedaan? Hoe ging het?</p><div class="row">${[1, 2, 3].map(m => `<button class="btn" style="font-size:1.3rem;padding:6px 14px" data-done="${a.id}|${m}" aria-label="Gedaan, ${['moeilijk', 'ging wel', 'ging goed'][m - 1]}">${MOOD[m]}</button>`).join('')}</div>`}`)}</article>`; }).join('') || '<div class="panel empty">Deze week nog geen huiswerk. Lekker vrij voetballen!</div>'}</div></div>
    <p class="small muted mt" style="text-align:center"><a href="#" id="wd" style="color:inherit">Toestemming intrekken en gegevens verwijderen</a></p>`;
  document.querySelectorAll('[data-done]').forEach(b => b.onclick = async () => { const [id, m] = b.dataset.done.split('|'); const { data, error } = await sb.rpc('complete_assignment', { p_token: S.token, p_assignment: id, p_mood: +m }); if (error || !data) return toast('Dat lukte niet'); toast('Goed gedaan!'); loadPlayer(); });
  document.querySelectorAll('[data-undo]').forEach(b => b.onclick = async () => { await sb.rpc('undo_completion', { p_token: S.token, p_assignment: b.dataset.undo }); loadPlayer(); });
  $('#wd').onclick = async e => { e.preventDefault(); if (!confirm('Weet je het zeker? De gegevens van deze speler worden direct verwijderd en deze link werkt daarna niet meer.')) return; await sb.rpc('withdraw_consent', { p_token: S.token }); renderMessage('De gegevens zijn verwijderd.', 'Je kunt deze pagina sluiten.'); };
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
