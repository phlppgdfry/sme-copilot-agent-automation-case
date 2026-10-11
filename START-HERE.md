# Start here

> Independent portfolio case — fictieve organisatie. Kies het pad dat bij je tijd past.

## Als je 2 minuten hebt

1. [Demo met rondleiding](https://phlppgdfry.github.io/sme-copilot-agent-automation-case/demo/?tour) — 10 stappen, van workshop tot governance
2. [Live site](https://phlppgdfry.github.io/sme-copilot-agent-automation-case/) — het probleem, drie keuzes en het bewijs op één pagina

## Als je 5 minuten hebt

3. [Use-caseportfolio](docs/03-prioritise/use-case-portfolio.md) — wat eerst, wat later, wat nooit
4. [Agentontwerp](docs/04-design/agentontwerp.md) — wat de agent doet en vooral wat niet
5. [Evidence](EVIDENCE.md) — wat de rol vraagt, waar het staat, wat niet geclaimd wordt

## Als je 15 minuten hebt

Het traject in volgorde:

1. [Context](docs/00-context/README.md) — Brevan, de mensen, de rommeligheid
2. [Inspiratiesessie](docs/01-inspire/inspiratiesessie.md) en [one-pager](docs/01-inspire/copilot-agent-of-flow.md)
3. [Workshop-draaiboek](docs/02-discover/workshop-draaiboek.md) en [notities](docs/02-discover/workshopnotities.md)
4. [Use-caseportfolio](docs/03-prioritise/use-case-portfolio.md) en [waardecase](docs/03-prioritise/waardecase.md)
5. [Agentontwerp](docs/04-design/agentontwerp.md), [readiness](docs/04-design/readiness-en-kennisbronnen.md), [bouwspecificatie](docs/04-design/bouwspecificatie.md)
6. [Onkostennota-flow](docs/05-build/onkostennota-flow.md)
7. [Testen en evalueren](docs/06-test/teststrategie-en-evaluatie.md)
8. [Governance-pakket](docs/07-govern/governance-pakket.md)
9. [Overdracht](docs/08-adopt/overdracht-change-adoption.md) en [KPI's](docs/08-adopt/kpis-en-meting.md)

## Als je de details wil

| Stap | Beste documenten |
|---|---|
| Discover | [workshopnotities](docs/02-discover/workshopnotities.md) · [kaartjes (JSON)](docs/02-discover/workshop-kaartjes.json) |
| Prioritise | [scoring (code)](site/assets/lib/prioritise.mjs) · [use cases (JSON)](docs/03-prioritise/use-cases.json) |
| Design | [ADR's](docs/adr/README.md) · [simulator](site/assets/lib/agent.mjs) |
| Build | [flowregels](site/assets/lib/flow.mjs) · [bouwgids Copilot Studio](copilot-studio/BOUWGIDS.md) |
| Test | [testset](tests/testset.json) · [agent-tests](tests/agent.test.mjs) |
| Govern | [check](site/assets/lib/policy.mjs) · [manifesten](governance/solutions/) · [governance-tests](tests/policy.test.mjs) |
