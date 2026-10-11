# Brevan Assist — van Copilot-licenties naar een agent die je kan vertrouwen

**Discovery en use cases + een Copilot Studio-agent met goedkeuringsflow, testset en Power Platform-governance**

> Een AI- en automatiseringstraject voor een fictieve installatie-kmo: van "we betalen voor Copilot en zien niets" naar één agent in Teams die HR-vragen met bron beantwoordt, onkostennota's laat goedkeuren door de ploegbaas, slaagt op 40 testvragen, en binnen een governance-kader draait.

> *Independent portfolio case study based on a fictional organisation (Brevan Installaties). It contains no confidential information from any real employer or the hiring company. All figures are illustrative assumptions — not real company data.*

**[Live site](https://phlppgdfry.github.io/sme-copilot-agent-automation-case/)** · **[Demo met rondleiding (2 min)](https://phlppgdfry.github.io/sme-copilot-agent-automation-case/demo/?tour)** · **[Start here](START-HERE.md)** · **[Evidence](EVIDENCE.md)** · **[Case study](CASE_STUDY.md)**

## Het traject

```text
Inspire      inspiratiesessie: Copilot, agent of flow?
   ↓
Discover     workshop van 2,5 u: "wat doe je elke week opnieuw?" → 32 kaartjes
   ↓
Prioritise   12 use cases gescoord; 3 gekozen (één zonder AI), 2 afgeraden; kosten geraamd
   ↓
Design       agent Brevan Assist: instructies, één kennisbron, één tool, wat hij níet doet
   ↓
Build        agent flow "Onkostennota indienen" met goedkeuring door de ploegbaas
   ↓
Test         40 testvragen met HR: 29/40 met de hele HR-site, 40/40 met de gepubliceerde bibliotheek
   ↓
Govern       environments, DLP, ALM, 10 regels met een check in CI
   ↓
Adopt        overdracht aan Change & Adoption, KPI's, guardrail
```

## Het probleem

Brevan Installaties (140 medewerkers, 92 technici op de baan) kocht 25 Microsoft 365 Copilot-licenties; na vier maanden gebruikt een derde ze. HR beantwoordt elke dag 25 vragen die meestal in het handboek staan, en onkostennota's komen als WhatsApp-foto binnen, weken te laat. Tegelijk vond IT een flow die urenstaten naar een privé-gmailadres stuurt.

## Wat ik deed

- Een [inspiratiesessie](docs/01-inspire/inspiratiesessie.md) en een [discovery-workshop](docs/02-discover/workshop-draaiboek.md) ontworpen die bij het werk beginnen; de [uitkomst](docs/02-discover/workshopnotities.md) vastgelegd, inclusief de tegenstrijdigheden.
- [12 use cases gescoord](docs/03-prioritise/use-case-portfolio.md) op waarde, haalbaarheid en risico, met een [waardecase](docs/03-prioritise/waardecase.md) in Copilot credits.
- De agent [Brevan Assist ontworpen](docs/04-design/agentontwerp.md), met een [readiness-check](docs/04-design/readiness-en-kennisbronnen.md) van de bronnen en een [bouwspecificatie](docs/04-design/bouwspecificatie.md) voor de technische collega.
- De [agent flow voor onkostennota's](docs/05-build/onkostennota-flow.md) ontworpen; de regels als code met tests.
- Met HR een [testset van 40 vragen](docs/06-test/teststrategie-en-evaluatie.md) opgesteld vóór de bouw, en getoond dat de kennisbron het verschil maakt.
- Een [governance-pakket](docs/07-govern/governance-pakket.md) voor een kmo zonder CoE opgezet, met een check die elke oplossing toetst.
- De [overdracht aan Change & Adoption](docs/08-adopt/overdracht-change-adoption.md) en de [KPI's](docs/08-adopt/kpis-en-meting.md) voorbereid.

## Key decisions

1. **Alleen de bibliotheek die HR publiceert als kennisbron** — met de hele HR-site faalt de agent op 11 van de 40 testvragen door een oud handboek en een open loonmap ([ADR-004](docs/adr/004-kennisbron-gepubliceerde-bibliotheek.md)).
2. **De agent start de onkostennota, de ploegbaas beslist, in één gebundelde melding per dag** — geld vraagt een mens, en ploegbazen willen niet goedkeuren tussen twee werven ([ADR-003](docs/adr/003-goedkeuring-gebundeld-in-teams.md)).
3. **Copilot Studio, niet pro-code Azure AI Foundry** — Brevan heeft één IT-verantwoordelijke en geen ontwikkelaars; de governance is dezelfde als voor de flows die er al zijn ([ADR-001](docs/adr/001-copilot-studio-niet-foundry.md)).

Ook: geen ERP-koppeling in de PoC ([ADR-002](docs/adr/002-geen-erp-koppeling-in-poc.md)).

## What this demonstrates

| Wat de rol vraagt | Bewijs |
|---|---|
| Noden vertalen naar AI- en automatiseringsuse cases | [use-caseportfolio](docs/03-prioritise/use-case-portfolio.md), [workshopnotities](docs/02-discover/workshopnotities.md) |
| Workshops en inspiratiesessies faciliteren | [draaiboek](docs/02-discover/workshop-draaiboek.md), [inspiratiesessie](docs/01-inspire/inspiratiesessie.md) |
| Agents bouwen in Copilot Studio | [agentontwerp](docs/04-design/agentontwerp.md), [simulator](site/assets/lib/agent.mjs), [bouwgids](copilot-studio/BOUWGIDS.md) |
| Power Platform-automatisering | [agent flow](docs/05-build/onkostennota-flow.md), [regels + tests](tests/flow.test.mjs) |
| Governance: security, compliance, lifecycle | [governance-pakket](docs/07-govern/governance-pakket.md), [check](site/assets/lib/policy.mjs) |
| Change & Adoption | [overdracht](docs/08-adopt/overdracht-change-adoption.md) |

Volledige mapping met "getoond / niet geclaimd": [EVIDENCE.md](EVIDENCE.md).

## How to run and verify

| Wat | Hoe | Je ziet |
|---|---|---|
| Demo openen | [demo/?tour](https://phlppgdfry.github.io/sme-copilot-agent-automation-case/demo/?tour) | de rondleiding van 10 stappen |
| Lokaal draaien | `python3 -m http.server -d site 8000` → http://localhost:8000 | dezelfde site |
| Tests (Node 22+) | `node --test tests/*.test.mjs` | 22 tests geslaagd: testset v2 40/40, v1 faalt alleen door het handboek van 2019 en de loonmap; flowregels; 10 governance-regels |
| Afgeleide data opnieuw maken | `node scripts/build-site-data.mjs` | `v1 Hele HR-site: 29/40`, `v2 Gepubliceerde bibliotheek: 40/40`; in CI mag dit niets wijzigen |
| Links controleren | `python3 scripts/check-links.py` | `OK` |
| Testset in Copilot Studio | [`copilot-studio/testset-import.csv`](copilot-studio/testset-import.csv) importeren ([bouwgids](copilot-studio/BOUWGIDS.md), stap 7) | 40 testvragen in *Evaluation* |

## If the demo does not load

Screenshots van de landingspagina en elke stap van de rondleiding: [docs/screenshots/](docs/screenshots/).

## Repository map

| Map | Inhoud |
|---|---|
| [`docs/00-context/`](docs/00-context/README.md) | organisatie, stakeholders, scope, rommeligheid, aannames, beperkingen |
| `docs/01-inspire/` … `docs/08-adopt/` | het traject, één map per stap |
| [`docs/adr/`](docs/adr/README.md) | ontwerpbeslissingen |
| [`knowledge/`](knowledge/README.md) | de fictieve HR-documenten (kennisbron) |
| [`tests/`](tests/) | testset (40 vragen) en tests voor agent, flow en governance |
| [`governance/`](governance/) | environments, DLP-policies, solution-manifesten |
| [`copilot-studio/`](copilot-studio/README.md) | bouwgids, importbestand, Word-versies van de documenten, resultaten |
| `site/` | GitHub Pages: landingspagina, demo, rol-lens; `site/assets/lib/` = simulator, flowregels, check, scoring |
| `scripts/` | data bouwen, Word-export, linkcheck |

## Sources, data and licences

| Bron / afhankelijkheid | Gebruikt voor | Licentie |
|---|---|---|
| Microsoft Learn: Copilot Studio ([orchestration](https://learn.microsoft.com/en-us/microsoft-copilot-studio/advanced-generative-actions), [evaluation](https://learn.microsoft.com/en-us/microsoft-copilot-studio/analytics-agent-evaluation-intro), [billing](https://learn.microsoft.com/en-us/microsoft-copilot-studio/requirements-messages-management)), Power Platform ([DLP](https://learn.microsoft.com/en-us/power-platform/admin/wp-data-loss-prevention), [environment strategy](https://learn.microsoft.com/en-us/power-platform/guidance/adoption/environment-strategy), [ALM](https://learn.microsoft.com/en-us/power-platform/alm/)) | productgedrag, tarieven, governance (stand oktober 2026) | documentatie van Microsoft, alleen gelinkt |
| [Prosci ADKAR](https://www.prosci.com/methodology/adkar), [EU AI Act art. 4](https://artificialintelligenceact.eu/article/4/) | adoptie, AI-geletterdheid | gelinkt |
| HR-documenten, workshop, use cases, testset, manifesten | kennisbron, demo, tests | zelf geschreven, fictief |

Deze repository: code (scripts, tests, site-JS/CSS, workflows) onder MIT, documentatie en data onder CC BY 4.0 — zie [LICENSE](LICENSE).

## Limitations and assumptions

- **Gesimuleerd:** de agent in de demo is een deterministische simulator van het ontwerp (weigerregels → tool → kennis), afgestemd op de 40 testvragen. Hij bewijst de ontwerpkeuzes, niet de taalkwaliteit van een echte agent. De goedkeuringsflow is gesimuleerd met een event-log.
- **Echte agent:** wordt gebouwd in Copilot Studio volgens de [bouwgids](copilot-studio/BOUWGIDS.md); de scores komen in [RESULTATEN.md](copilot-studio/RESULTATEN.md). Tot dan claimt deze case geen werkende Copilot Studio-agent.
- **Niet getest:** echte gebruikers, een echte tenant met DLP, verbruik in credits, Frans.
- **Fictief:** Brevan, de workshop, de documenten, de mensen en alle cijfers. Er was geen klant, pilot of meting.
- **Tarieven en functies** van Microsoft veranderen vaak; stand oktober 2026.
