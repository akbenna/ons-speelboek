# Ons Speelboek

Teamapp voor jeugdvoetbal (JO12, FC Geleen Zuid): opstellingen, spelpatronen, trainingen, taken per positie en huiswerk voor spelers.

Statische webapp (geen build). Database en inloggen via Supabase.

## Speelvormen

Bij het aanmaken van een team kies je **8 tegen 8** of **11 tegen 11**. De speelvorm staat in `teams.colors.format` (11; leeg = 8). Elk team heeft zijn eigen posities, systemen, patronen en trainingen:

- `kennis8.json` / `kennis11.json`: de kennisbank, los van een team. Posities, beproefde systemen (met "goed tegen"-typen tegenstander), spelpatronen (met fase en type tegenstander). Teksten gebruiken plekken zoals `{CM}` of `{SP2}`; de app vult de naam van de speler op die plek in, of anders de naam van de plek.
- `seed.json` / `seed11.json`: startinhoud per team (oefenvormen, trainingsplannen) en de optionele voorbeeldspelers.
- Patronen uit de kennisbank staan niet in de database; alleen eigen patronen en eigen aanpassingen (`data.edited`) wel.

Taken per plek: eigen aanpassing in de opstelling, anders het systeem, anders de positiekaart.
