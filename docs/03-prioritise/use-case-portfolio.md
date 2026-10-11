# Use-caseportfolio — 12 use cases, 3 gekozen, 2 afgeraden

> Wat is dit: alle use cases uit de workshop met oplossingstype, score, eigenaar en beslissing. Voor wie: zaakvoerder (beslist), IT (haalbaarheid), proceseigenaars. Waarom: één lijst waaruit zichtbaar wordt waarom iets eerst komt, later, of nooit.
> Vorige: [Workshopnotities](../02-discover/workshopnotities.md) · Volgende: [Waardecase](waardecase.md)

Bron: [`use-cases.json`](use-cases.json) · scoring: [`prioritise.mjs`](../../site/assets/lib/prioritise.mjs) · interactief met eigen gewichten: demo, tab "Use cases". *Illustrative assumption.*

## Hoe gescoord

| As | Vraag | Schaal |
|---|---|---|
| **Waarde** | gemiddelde van: hoe vaak (frequentie), hoeveel tijd per keer, hoeveel ergernis | 1–5 |
| **Haalbaarheid** | gemiddelde van: is de data juist en op één plek, is er een eigenaar, past de licentie | 1–5 |
| **Risico** | wat als het antwoord of de actie fout is (5 = letsel, geld, persoonsgegevens) | 1–5 |

**Score** = 40% waarde + 35% haalbaarheid + 25% (6 − risico), herschaald naar 0–100. Waarom zo: waarde weegt het zwaarst, maar een waardevolle use case zonder eigenaar of propere data mislukt in de PoC. Risico weegt mee zodat veiligheid en persoonsgegevens niet "toevallig" bovenaan komen.

## Resultaat (standaardgewichten)

| # | Use case | Type | Waarde | Haalb. | Risico | Score | Beslissing |
|---:|---|---|---:|---:|---:|---:|---|
| 1 | UC-01 Vragen over personeelszaken | agent | 4,0 | 4,3 | 2 | 78 | **PoC** — Brevan Assist |
| 2 | UC-10 Onboarding van nieuwe technici | flow | 2,7 | 4,7 | 1 | 74 | **PoC** — snelle winst zonder AI |
| 3 | UC-02 Onkostennota met foto | agent (tool) | 3,7 | 4,0 | 2 | 72 | **PoC** — in Brevan Assist |
| 4 | UC-04 Offertes samenvatten | Copilot | 3,3 | 4,0 | 2 | 68 | training, geen bouw |
| 5 | UC-05 Verslag werfoverleg | Copilot | 3,0 | 4,0 | 2 | 65 | training; licenties ploegbazen na meting |
| 6 | UC-03 Werkbon → factuurvoorstel | flow | 4,3 | 2,7 | 3 | 60 | later: eerst datakwaliteit + ERP-partner |
| 7 | UC-09 Leveranciersfacturen inlezen | flow | 3,3 | 3,0 | 2 | 60 | later: navragen bij de ERP-partner (e-facturatie) |
| 8 | UC-11 Herinneringen onderhoudscontracten | eerst proces | 3,0 | 3,0 | 2 | 56 | later: eerst één bron en een eigenaar |
| 9 | UC-06 Veiligheidsprocedures | agent | 3,0 | 3,7 | 4 | 50 | later: letterlijke citaten + eigen testset |
| 10 | UC-08 Klantchatbot | agent | 2,7 | 2,3 | 4 | 35 | later: externe doelgroep, geen eigenaar |
| — | UC-07 Planning optimaliseren met AI | — | 4,3 | 2,0 | 4 | 48 | **niet doen** |
| — | UC-12 "Alles over een klant" | — | 2,0 | 1,7 | 5 | 16 | **niet doen** |

## Waarom deze drie

- **UC-01 en UC-02 worden één agent.** Dezelfde gebruikers (technici in Teams), dezelfde eigenaar-kant (HR en boekhouding), één extra tool. Twee agents zou twee keer governance, testset en uitleg betekenen.
- **UC-10 is geen AI.** Een flow die bij een nieuwe medewerker een checklist aanmaakt. Ze staat in de top 3 omdat ze snel waarde geeft en de nieuwe environment-strategie test met een laag risico. Een consultant die alleen AI voorstelt, verkoopt een hamer.
- **UC-04 en UC-05 zijn training, geen project.** De licenties zijn er al; wat ontbreekt is weten hoe. Zie [overdracht aan Change & Adoption](../08-adopt/overdracht-change-adoption.md).

## Waarom twee keer "niet doen"

- **UC-07 Planning met AI.** Hoge waarde, maar er is geen planningssysteem en geen data over vaardigheden. AI op een Excel-planning geeft geen betere planning. Advies: een planningsmodule in het ERP of een gespecialiseerd pakket.
- **UC-12 "Alles over een klant".** Geen afgebakende vraag, geen eigenaar, persoonsgegevens, en het zou de oversharing (R2) uitvergroten. De echte behoefte, een klantdossier samenvatten, doet Copilot al voor wie toegang heeft.

## Wat dit niet is

Een raming van zekerheid. De scores komen uit één workshop en een inschatting met IT. Ze worden herzien na de PoC (gebruik, testscore, kosten) — zie [KPI's en meting](../08-adopt/kpis-en-meting.md).
