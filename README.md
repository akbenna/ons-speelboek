# Ons Speelboek

Teamapp voor jeugdvoetbal (JO12, FC Geleen Zuid): opstellingen, spelpatronen, trainingen, taken per positie en huiswerk voor spelers.

Statische webapp (geen build). Database en inloggen via Supabase.

## Speelvormen

Bij het aanmaken van een team kies je **8 tegen 8** of **11 tegen 11**. De speelvorm staat in `teams.colors.format` (11; leeg = 8). Elk team heeft zijn eigen posities, systemen, patronen en trainingen:

- `seed.json`: 8 tegen 8 (systemen 1-3-3-1, 1-3-2-2, 1-3-1-3, 1-2-3-2, 1-4-2-1 staan in `app.js`)
- `seed11.json`: 11 tegen 11 (posities, systemen 1-4-3-3, 1-4-2-3-1, 1-4-4-2, 1-3-4-3, 1-4-1-4-1, patronen, oefenvormen en trainingsplannen)

Taken per plek: eigen aanpassing in de opstelling, anders het systeem, anders de positiekaart.
