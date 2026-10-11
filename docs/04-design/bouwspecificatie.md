# Bouwspecificatie en traceerbaarheid

> Wat is dit: wat de technische collega moet instellen, en hoe elke workshopvraag doorloopt tot een bouwsteen en een test. Voor wie: de engineer die de tenant inricht, en de reviewer. Waarom: de technische collega mag geen requirements moeten raden.
> Vorige: [Readiness](readiness-en-kennisbronnen.md) · Volgende: [05 — Onkostennota-flow](../05-build/onkostennota-flow.md)

## Wat er ingesteld moet worden

| # | Onderdeel | Instelling | Wie |
|---|---|---|---|
| B-01 | Environments | *Brevan-Dev* (developer), *Brevan-Test* (sandbox), *Brevan-Productie* (production), alle drie Managed Environments | IT + consultant |
| B-02 | DLP | *DLP-Standaard* op de drie environments, *DLP-Default* op Default ([governance](../07-govern/governance-pakket.md)) | IT |
| B-03 | Solution | `BrevanAssist`, publisher-prefix `brv`; bevat de agent, de agent flow, de tabel of lijst, environment variables en connection references | consultant |
| B-04 | Environment variables | `brv_HR_KnowledgeSiteUrl`, `brv_Onkosten_ListUrl`, `brv_Onkosten_FinanceLimit` (250) | consultant |
| B-05 | Connection references | SharePoint, Approvals, Microsoft Teams, Office 365 Users — in productie op `svc-powerplatform` | IT |
| B-06 | Kennisbron | SharePoint-bibliotheek *Personeelszaken – Gepubliceerd*; rechten: alle medewerkers lezen, HR schrijft | HR + IT |
| B-07 | Onkostenlijst | SharePoint-lijst *Onkostennota's* (kolommen in het [flowontwerp](../05-build/onkostennota-flow.md)); medewerkers zien alleen hun eigen items | IT |
| B-08 | Authenticatie | *Authenticate with Microsoft*; kanaal Teams; beschikbaar voor de groep *Alle medewerkers* | IT |
| B-09 | Verbruikslimiet | maandlimiet voor de agent in het Power Platform admin center (raming: [waardecase](../03-prioritise/waardecase.md)) | IT |
| B-10 | Pipeline | Power Platform Pipelines Dev → Test → Productie; managed in Test en Productie | consultant |

## Van workshop tot test (traceerbaarheid)

| Workshop (kaartje) | Requirement | Bouwsteen | Test | KPI |
|---|---|---|---|---|
| "25 telefoons per dag, meestal dezelfde vragen" (K-13) | R-01 De agent beantwoordt vragen over personeelszaken uit de gepubliceerde documenten, met bron | kennisbron (B-06), instructies | T-01…T-24 | deflectie HR-vragen |
| "Ik wil niet dat een chatbot foute dingen zegt over verlof" (K-16) | R-02 Geen antwoord zonder bron; anders doorverwijzen naar HR | instructies | T-33, T-40 | aandeel antwoorden met bron |
| "Ik weet niet welke versie van het handboek mensen lezen" (K-14) | R-03 Alleen de bibliotheek *Gepubliceerd* | B-06, ADR-004 | v1 vs v2 (29 → 40) | testscore ≥95% |
| "Wie heeft toegang tot de map Lonen?" (K-32) | R-04 Geen loonbedragen, geen gegevens van collega's | instructies G1, rechten (readiness) | T-33…T-35, T-40 | 0 incidenten |
| "Foto via WhatsApp, ik hoor er niets meer van" (K-03) | R-05 Onkostennota indienen in Teams met foto | agent flow, B-07 | T-26…T-28, flowtests | doorlooptijd onkosten |
| "Projectcode? Ik weet alleen het adres" (K-04) | R-06 Werfadres of klantnaam volstaat | flowinput *werf* | T-08, flowtest | % nota's met werf |
| "Goedkeuren op mijn gsm tussen twee werven: nee" (K-09) | R-07 Gebundelde goedkeuring, vervanger, escalatie na 5 dagen | agent flow, ADR-003 | flowtests | goedkeuring < 3 werkdagen |
| "Er draaien flows waarvan ik niet weet wie ze maakte" (K-30) | R-08 Elke gedeelde oplossing in een solution, met serviceaccount en check | B-01…B-05, B-10 | governance-check | 0 gedeelde flows in Default |

## Wat de engineer niet hoeft te bouwen

- geen koppeling met Business Central ([ADR-002](../adr/002-geen-erp-koppeling-in-poc.md));
- geen eigen app: Teams is de interface;
- geen Dataverse-tabellen: een SharePoint-lijst volstaat voor de PoC (geen premium licentie nodig voor de technici). Bij meer dan ±5.000 nota's per jaar of rechten per afdeling: herzien.
