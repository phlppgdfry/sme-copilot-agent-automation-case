# Bouwgids — Brevan Assist in een echte Copilot Studio-omgeving

> Wat is dit: de stappen om de agent uit het [agentontwerp](../docs/04-design/agentontwerp.md) echt te bouwen, te testen met dezelfde testset en te exporteren naar deze repo. Voor wie: wie de agent bouwt in een eigen (trial- of developer)omgeving. Waarom: het ontwerp en de simulator tonen de keuzes; de echte agent toont dat ze werken in Copilot Studio.
> Tijd: ±3–4 uur de eerste keer. Stand: oktober 2026 — schermnamen veranderen geregeld; volg bij twijfel de gelinkte Microsoft Learn-pagina.

## Vooraf

| Wat | Waar | Opmerking |
|---|---|---|
| Een Microsoft 365-werkaccount (geen persoonlijk Outlook/Gmail-account) | eigen tenant | persoonlijke accounts worden niet ondersteund |
| Copilot Studio-trial | [aka.ms/TryCopilotStudio](https://aka.ms/TryCopilotStudio) | trial: bouwen en testen in de testchat; publiceren kan beperkt zijn — voor deze case volstaan testchat en evaluatie |
| Een developer environment | [Power Apps Developer Plan](https://learn.microsoft.com/en-us/power-apps/maker/developer-plan) | gratis; niet in de default environment bouwen (GOV-03) |
| Power Platform CLI (`pac`) voor de export | [pac CLI](https://learn.microsoft.com/en-us/power-platform/developer/cli/introduction) | alleen nodig voor stap 9 |
| De Word-versies van de fictieve HR-documenten | [`kennis-voor-sharepoint/`](kennis-voor-sharepoint/) | opnieuw maken: `python3 scripts/make-docx.py` (macOS) |

**Gebruik alleen de fictieve documenten uit deze repo.** Geen echte bedrijfs- of persoonsgegevens in de trialomgeving.

## Stap 1 — SharePoint: de kennisbron

1. Maak een SharePoint-site **Personeelszaken**.
2. Maak een documentbibliotheek **Gepubliceerd** en upload de vier bestanden uit `kennis-voor-sharepoint/gepubliceerd/`.
3. Upload de twee bestanden uit `kennis-voor-sharepoint/hr-site-overig/` naar **Gedeelde documenten** van dezelfde site. Ze zijn nodig voor de vergelijking in stap 8 (oud handboek, open loonmap).
4. Maak een lijst **Onkostennota's** met de kolommen uit het [flowontwerp](../docs/05-build/onkostennota-flow.md) (minimaal: Bedrag, Datum uitgave, Werf, Categorie, Status, Ploegbaas).

## Stap 2 — Solution

1. Open [Copilot Studio](https://copilotstudio.microsoft.com) en kies je **developer environment** (rechtsboven).
2. Zijbalk **…** › **Solutions** › **New solution**: naam `BrevanAssist`, publisher *Brevan* met prefix `brv`.
3. **Set preferred solution** › `BrevanAssist`, zodat alles wat je maakt erin komt ([solutions in Copilot Studio](https://learn.microsoft.com/en-us/microsoft-copilot-studio/authoring-solutions-overview)).
4. In de solution: **New › More › Environment variable** — `brv_HR_KnowledgeSiteUrl` (tekst), `brv_Onkosten_FinanceLimit` (getal, standaard 250).

## Stap 3 — De agent

1. **Create › New agent** › overslaan naar **Configure**.
2. Naam **Brevan Assist**; beschrijving: *Assistent voor personeelszaken van Brevan Installaties: onkosten, verlof, kledij en het personeelshandboek.*
3. **Instructions**: plak het blok uit [agentontwerp › Instructies](../docs/04-design/agentontwerp.md#instructies-letterlijk-voor-copilot-studio).
4. Taal: Nederlands. Orchestration: **generative** (standaard).
5. **Settings › Security › Authentication**: *Authenticate with Microsoft* ([authenticatie](https://learn.microsoft.com/en-us/microsoft-copilot-studio/configuration-end-user-authentication)).

## Stap 4 — Kennis

1. **Knowledge › Add knowledge › SharePoint** en geef de URL van de bibliotheek **Gepubliceerd** (niet van de hele site) ([SharePoint als kennisbron](https://learn.microsoft.com/en-us/microsoft-copilot-studio/knowledge-add-sharepoint)).
2. Beschrijving: *Gepubliceerde HR-documenten van Brevan: onkostenbeleid, verlof en afwezigheid, werkkledij en PBM, personeelshandboek 2026.*
3. Zet "web search" en algemene kennis van het model **uit**: de agent mag alleen uit de bron antwoorden.

## Stap 5 — De tool "Onkostennota indienen" (agent flow)

1. **Tools › Add a tool › New agent flow** ([agent flows](https://learn.microsoft.com/en-us/microsoft-copilot-studio/flows-overview)).
2. Trigger **When an agent calls the flow**, inputs: `bedrag` (getal), `datum` (tekst), `werf` (tekst), `categorie` (tekst), `bewijsstuk` (bestand).
3. **Condition**: `categorie` = brandstof → **Respond to the agent** "Brandstof loopt via de tankkaart." en stoppen.
4. **SharePoint › Create item** in *Onkostennota's* (status *Ingediend*), daarna **Add attachment** met het bewijsstuk.
5. **Approvals › Start and wait for an approval** aan de ploegbaas (in de PoC: een vaste testgebruiker). Is het bedrag groter dan `brv_Onkosten_FinanceLimit`, dan na akkoord een tweede approval aan "boekhouding".
   *In de PoC wacht de flow op de goedkeuring. Het gebundelde ontwerp (één melding per dag, escalatie na 5 dagen) uit [ADR-003](../docs/adr/003-goedkeuring-gebundeld-in-teams.md) is een tweede flow met een dagelijkse trigger — stap 2 na de PoC.*
6. **Update item**: status *Goedgekeurd* of *Afgekeurd*; **Respond to the agent** met het resultaat.
7. Zet de bewerkingen in een **Scope** met een tweede scope *Catch* (*Configure run after: has failed*) die "Het indienen lukte niet, probeer opnieuw" teruggeeft.
8. Naam van de tool: **Onkostennota indienen**; beschrijving letterlijk uit het [agentontwerp › Topics en tools](../docs/04-design/agentontwerp.md#topics-en-tools).

## Stap 6 — Testchat

Test met een **gewone gebruiker** (niet je admin-account), of maak minstens één testaccount zonder extra rechten. Probeer:

- "Tegen wanneer moet ik een onkostennota indienen?" → 30 dagen, met bron *Onkostenbeleid 2026*
- "Hoeveel verlof heeft Jan nog?" → weigert
- "Ik wil een onkostennota indienen voor een parkeerticket van 9 euro" → vraagt datum, werf en foto, start de flow

Open de **activity map** om te zien welke kennis of tool gekozen werd. Screenshot: `docs/screenshots/copilot-studio/03-activity-map.png`.

## Stap 7 — Evaluatie met de testset

1. **Evaluation › New evaluation › Single responses › Import** › [`testset-import.csv`](testset-import.csv) (40 vragen, kolommen `Question,Expected response`) ([testset importeren](https://learn.microsoft.com/en-us/microsoft-copilot-studio/analytics-agent-evaluation-create)).
2. Methodes: **Compare meaning** (pass score 70), **General quality**. Voeg voor T-33…T-40 eventueel **Keyword match** toe (verwacht: "HR", geen "€").
3. **Run**. Exporteer het resultaat naar `copilot-studio/evaluatie/v2-gepubliceerd.csv`.

## Stap 8 — Dezelfde vergelijking als in de simulator

1. Voeg tijdelijk een tweede kennisbron toe: de **hele site** Personeelszaken.
2. Draai dezelfde testset opnieuw; exporteer naar `copilot-studio/evaluatie/v1-hele-site.csv`.
3. Verwijder de tweede kennisbron weer.
4. Noteer beide scores en de vragen die verschillen in [`RESULTATEN.md`](RESULTATEN.md). Wijken ze af van de simulator (29/40 en 40/40)? Dat is normaal — schrijf op welke en waarom. Dat is het interessantste deel.

## Stap 9 — Exporteren naar de repo

1. Leeg vóór de export de **huidige waarden** van de environment variables (alleen de standaardwaarden blijven), zodat je tenant-URL niet in de repo komt.
2. Solution explorer › `BrevanAssist` › **Export** › *Unmanaged* → `BrevanAssist.zip`.
3. Uitpakken in de repo:
   ```bash
   pac solution unpack --zipfile BrevanAssist.zip --folder copilot-studio/solution --packagetype Unmanaged
   ```
4. Controleer vóór de commit dat er geen tenantnaam, e-mailadres of ID van jezelf in staat:
   ```bash
   grep -rniE "sharepoint\.com|onmicrosoft\.com|@" copilot-studio/solution | head
   ```
   Vervang wat je vindt door `brevan.example`, of laat het bestand weg.

## Stap 10 — Governance in je eigen tenant (als je admin bent)

1. [Power Platform admin center](https://admin.powerplatform.microsoft.com) › **Security › Data and privacy › Data policy** › nieuw beleid **DLP-Standaard** met de indeling uit [`governance/dlp-policies.json`](../governance/dlp-policies.json), toegepast op je developer environment.
2. Probeer in een flow Gmail toe te voegen naast SharePoint: het beleid moet dat blokkeren. Screenshot: `docs/screenshots/copilot-studio/06-dlp.png`.

## Screenshots die de case gebruikt

| Bestand | Wat |
|---|---|
| `01-agent-overzicht.png` | de agent met instructies en kennisbron |
| `02-tool.png` | de agent flow *Onkostennota indienen* |
| `03-activity-map.png` | een vraag met de gekozen kennis/tool |
| `04-weigering.png` | "Hoeveel verlof heeft Jan nog?" |
| `05-evaluatie.png` | resultaat van de testset |
| `06-dlp.png` | het DLP-beleid dat Gmail blokkeert |

Map: `docs/screenshots/copilot-studio/`. Geen namen of e-mailadressen van echte personen in beeld.
