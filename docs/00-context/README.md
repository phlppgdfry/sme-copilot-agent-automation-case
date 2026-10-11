# 00 — Context: Brevan Installaties, scope, aannames en beperkingen

> Wat is dit: de uitgangssituatie van de case, voor wie de case leest of een gesprek voorbereidt. Waarom: elk document hierna verwijst naar deze organisatie, deze mensen en deze aannames.
> Volgende stap: [01 — Inspire](../01-inspire/copilot-agent-of-flow.md)

*Independent portfolio case study based on a fictional organisation. It contains no confidential information from any real employer or the hiring company. All figures are illustrative assumptions — not real company data.*

## De klant

**Brevan Installaties NV** is een fictief technisch installatiebedrijf (HVAC, sanitair, elektriciteit) in West-Vlaanderen met twee vestigingen.

| | *Illustrative assumption* |
|---|---|
| Medewerkers | 140: 92 technici op de baan, 14 ploegbazen, 34 bedienden |
| Microsoft 365 | Business Premium voor 48 bedienden en ploegbazen, F3 voor 92 technici; iedereen heeft Teams op de gsm |
| Copilot | 25 Microsoft 365 Copilot-licenties, vier maanden geleden gekocht; 30% wekelijks actief |
| Power Platform | geen beleid, alleen de default environment; 11 flows en 2 apps van 4 medewerkers |
| ERP | Business Central, beheerd door een externe ERP-partner |
| IT | één IT-verantwoordelijke, geen ontwikkelaars |

## De consultant

Een consultant van een (naamloze) Microsoft-partner. De zaakvoerder vroeg: *"We betalen voor Copilot en zien niets. Wat kunnen we er echt mee?"* Twee weken later vond de IT-verantwoordelijke een flow die elke week de urenstaten van een ploeg naar een privé-gmailadres stuurt.

## Stakeholders

| Wie | Wil | Vreest |
|---|---|---|
| Zaakvoerder | rendement op de licenties, beheersbare kosten (plafond €150/maand voor agentverbruik) | een project dat blijft duren |
| Operationeel directeur | minder administratie voor technici en ploegbazen | nog een app voor de technici |
| HR-manager | minder telefoons met dezelfde vragen | een chatbot die foute dingen zegt over verlof of loon |
| Financieel verantwoordelijke | onkostennota's op tijd en aan een project gekoppeld | betalingen zonder controle |
| Ploegbazen (14) | snel, op de werf | goedkeuren "tussen twee werven" op de gsm |
| Technici (92) | eenvoudig, in Teams, zonder projectcode | nóg een formulier |
| IT-verantwoordelijke | overzicht en controle | geen tijd om alles te controleren |

## Scope

| In scope | Buiten scope |
|---|---|
| Inspiratiesessie en discovery-workshop | Planningsoptimalisatie (UC-07, afgeraden) |
| Use-caseportfolio met keuzes en "niet doen" | Klantchatbot (UC-08, later) |
| PoC-agent **Brevan Assist**: personeelszaken + onkostennota met goedkeuring | ERP-integratie (ADR-002) |
| Testset en evaluatie | Copilot-training per rol (beschreven, niet uitgewerkt) |
| Governance-pakket Power Platform + check | CoE Starter Kit installeren (alleen beschreven) |
| Overdracht aan Change & Adoption, KPI's | Pilot uitvoeren en meten (gepland, niet gesimuleerd) |

## Rommeligheid die in de case zit

| # | Wat | Waar je het ziet |
|---|---|---|
| R1 | Drie versies van het personeelshandboek; de versie van 2019 zegt nog "60 dagen" en "€12" | [testresultaten](../06-test/teststrategie-en-evaluatie.md) |
| R2 | De map "Lonen 2025" staat open voor iedereen in het bedrijf | [readiness](../04-design/readiness-en-kennisbronnen.md) |
| R3 | Een flow stuurt urenstaten naar een privé-gmailadres | [governance](../07-govern/governance-pakket.md) |
| R4 | Ploegbazen willen niet goedkeuren op de gsm tussen twee werven | [ADR-003](../adr/003-goedkeuring-gebundeld-in-teams.md) |
| R5 | Technici kennen hun projectcode niet | [ADR-002](../adr/002-geen-erp-koppeling-in-poc.md) |
| R6 | Kostenplafond voor agentverbruik | [waardecase](../03-prioritise/waardecase.md) |
| R7 | Technici hebben geen M365 Copilot-licentie (F3) | [agentontwerp](../04-design/agentontwerp.md) |

## Data en bronnen

- Alle HR-documenten in [`knowledge/`](../../knowledge/) zijn zelf geschreven en fictief; bedragen en regels zijn verzonnen.
- Productgedrag van Copilot Studio en Power Platform volgt Microsoft Learn (links per document, stand oktober 2026). Functies en licenties veranderen vaak: controleer vóór gebruik.
- Geen echte persoonsgegevens; namen in de testset (Jan, Sofie) zijn voorbeelden.

## Beperkingen

- De **browserdemo is een deterministische simulator** van het ontwerp, geen Copilot Studio en geen taalmodel. Hij is afgestemd op de testset en bewijst de ontwerpkeuzes (bron afbakenen, weigerregels, toolkeuze, goedkeuring), niet de taalkwaliteit van een echte agent.
- De echte agent wordt in Copilot Studio gebouwd volgens de [bouwgids](../../copilot-studio/BOUWGIDS.md).
- Er was geen echte klant, workshop, pilot of meting. Workshopnotities en cijfers zijn fictief.
- Kostenramingen zijn aannames; Microsoft wijzigt prijzen en verbruiksregels regelmatig.
