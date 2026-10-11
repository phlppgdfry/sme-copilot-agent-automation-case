# KPI's en meting

> Wat is dit: hoe we weten of de PoC werkt, en wanneer we stoppen of uitbreiden. Voor wie: zaakvoerder, HR, financieel verantwoordelijke. Waarom: "de klant vond het leuk" leidt niet tot een tweede project, een cijfer wel.
> Vorige: [Overdracht](overdracht-change-adoption.md) · Terug naar het begin: [00 — Context](../00-context/README.md)

*Baselines en doelen zijn illustrative assumptions — not real company data.* De baseline wordt in de twee weken vóór de pilot gemeten.

| KPI | Baseline | Doel na 3 maanden | Meten met | Eigenaar | Frequentie |
|---|---|---|---|---|---|
| HR-vragen per dag (telefoon + mail) | 25 | ≤ 17 (−30%) | turflijst HR (2 weken vóór, dan maandelijks 1 week) | HR-manager | maandelijks |
| Deflectie: gesprekken zonder doorverwijzing naar HR | — | ≥ 60% | Copilot Studio-analytics | HR-manager | maandelijks |
| Antwoorden met bronvermelding | — | 100% | testset + steekproef van 20 gesprekken | consultant / HR | maandelijks |
| Testscore (40 vragen) | 40/40 simulator | ≥ 38/40 in Copilot Studio, alle weigervragen geslaagd | agent evaluation | consultant | bij elke wijziging |
| Doorlooptijd onkostennota (uitgave → goedgekeurd) | 21 dagen | ≤ 7 dagen | lijst *Onkostennota's* | financieel verantwoordelijke | maandelijks |
| Nota's met werf ingevuld | 80% | ≥ 98% | lijst *Onkostennota's* | financieel verantwoordelijke | maandelijks |
| Gebruik | — | ≥ 60% van de pilotploegen gebruikt de agent minstens 1×/maand | analytics | HR | maandelijks |
| Verbruik vs limiet | raming ±6.100 credits | binnen limiet | Power Platform admin center | IT | maandelijks |
| Incidenten (fout of vertrouwelijk antwoord) | — | 0 ernstige | feedbackkanaal | HR | wekelijks |

## Beslismomenten

| Wanneer | Vraag | Als ja | Als nee |
|---|---|---|---|
| Na 4 weken pilot | Testscore ≥95% in productie, geen ernstig incident, ≥60% gebruik? | uitrol naar alle ploegen | oorzaak zoeken (bron, instructies, adoptie) en 4 weken verlengen |
| Na 3 maanden | HR-vragen −30% en doorlooptijd ≤7 dagen? | volgende use case (UC-06 veiligheid of UC-03 werkbonnen) | kosten en waarde herzien; desnoods stoppen |
| Elke maand | Verbruik binnen de limiet? | — | limiet of capaciteit herzien met de zaakvoerder |

## Guardrail-KPI

**Geen enkele ploegbaas mag meer dan 10 minuten per dag kwijt zijn aan goedkeuringen.** Halen we die niet, dan verliezen we de ploegbazen en daarmee de technici. Gemeten met een korte vraag in het champions-kanaal na 2 en 6 weken.
