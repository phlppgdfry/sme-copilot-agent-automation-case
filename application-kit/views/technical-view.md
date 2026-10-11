# Technical view

| Onderwerp | Keuze | Waar |
|---|---|---|
| Identiteit | *Authenticate with Microsoft*; de agent werkt met de rechten van de gebruiker; testen als gewone gebruiker | [agentontwerp](../../docs/04-design/agentontwerp.md) |
| Orchestration | generative; selectie op naam/beschrijving; tool-beschrijving zegt ook wat ze níet doet | idem |
| Kennis | één SharePoint-bibliotheek; readiness op rechten en versies | [readiness](../../docs/04-design/readiness-en-kennisbronnen.md) |
| Tool | agent flow, trigger *When an agent calls the flow*; de flow hercontroleert alle geldregels | [flow](../../docs/05-build/onkostennota-flow.md), [flow.mjs](../../site/assets/lib/flow.mjs) |
| Lange goedkeuringen | status in de lijst; dagelijkse flow voor bundel en escalatie (geen run die dagen wacht) | idem |
| Foutafhandeling | Try/Catch-scopes, retry, correlatie-ID, dubbele indiening binnen 10 min geweerd | idem + [tests](../../tests/flow.test.mjs) |
| ALM | solution `BrevanAssist`, environment variables, connection references, pipelines, managed in test/prod, serviceaccount | [bouwspecificatie](../../docs/04-design/bouwspecificatie.md) |
| Governance | routing, Managed Environments, 2 DLP-policies, 10 regels als code | [policy.mjs](../../site/assets/lib/policy.mjs), [tests](../../tests/policy.test.mjs) |
| Kwaliteit | testset 40 (24/8/8) in CI tegen de simulator; importeerbaar in Copilot Studio-evaluatie | [agent.test.mjs](../../tests/agent.test.mjs), [CSV](../../copilot-studio/testset-import.csv) |
| Kosten | credits per gesprek, gratis voor M365 Copilot-gebruikers, limiet per agent | [waardecase](../../docs/03-prioritise/waardecase.md) |

**Grens van de case:** de simulator is deterministisch en afgestemd op de testset; hij toont de ontwerpkeuzes, niet de taalkwaliteit van een model.
