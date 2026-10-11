# Brevan Assist — samenvatting op één pagina

> Independent portfolio case study based on a fictional organisation. All figures are illustrative assumptions — not real company data.

## Uitdaging

Een installatie-kmo (140 medewerkers, 92 technici) kocht 25 Copilot-licenties; een derde wordt gebruikt. HR beantwoordt 25 vragen per dag die in het handboek staan, onkostennota's komen als WhatsApp-foto weken te laat, en een medewerker bouwde een flow die urenstaten naar zijn privé-gmail stuurt.

## Aanpak

Inspiratiesessie → discovery-workshop met technici en ploegbazen ("wat doe je elke week opnieuw?") → 12 use cases gescoord op waarde, haalbaarheid en risico → één agent ontworpen, getest en ingebed in governance → overdracht aan adoptie.

## Opgeleverd

- Use-caseportfolio: 3 gekozen (waarvan één zonder AI), 2 afgeraden, kosten in Copilot credits geraamd.
- **Brevan Assist** (Copilot Studio-ontwerp): beantwoordt HR-vragen met bron uit één gepubliceerde bibliotheek, start onkostennota's die de ploegbaas goedkeurt, weigert vragen over collega's en lonen.
- Testset van 40 vragen met HR: **29/40 met de hele HR-site, 40/40 met de gepubliceerde bibliotheek** (simulator, in CI).
- Governance-pakket: environments, DLP, ALM, 10 regels met een check die de gmail-flow blokkeert.
- Overdracht aan Change & Adoption met KPI's en een guardrail voor ploegbazen.

## Impact (raming)

±38 uur per maand minder telefoons, wachten en najagen; ±€60 per maand aan verbruik, onder het plafond van €150.

## Wat de rol vraagt → bewijs

| Rol | Bewijs |
|---|---|
| Use cases uit klantnoden halen | [use-caseportfolio](../../docs/03-prioritise/use-case-portfolio.md) |
| Workshops en inspiratiesessies | [draaiboek](../../docs/02-discover/workshop-draaiboek.md), [inspiratiesessie](../../docs/01-inspire/inspiratiesessie.md) |
| Agents in Copilot Studio | [agentontwerp](../../docs/04-design/agentontwerp.md), [bouwgids](../../copilot-studio/BOUWGIDS.md) |
| Power Platform-automatisering | [agent flow](../../docs/05-build/onkostennota-flow.md) |
| Governance | [governance-pakket](../../docs/07-govern/governance-pakket.md) |
| Change & Adoption | [overdracht](../../docs/08-adopt/overdracht-change-adoption.md) |

Demo: https://phlppgdfry.github.io/sme-copilot-agent-automation-case/demo/?tour
