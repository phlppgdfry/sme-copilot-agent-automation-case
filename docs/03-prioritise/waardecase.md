# Waardecase en kosten — Brevan Assist (UC-01 + UC-02)

> Wat is dit: een eenvoudige raming van wat de PoC-agent oplevert en kost. Voor wie: de zaakvoerder, die een plafond van €150 per maand voor agentverbruik zette (R6). Waarom: kosten horen vóór de PoC op tafel, niet erna.
> Vorige: [Use-caseportfolio](use-case-portfolio.md) · Volgende: [04 — Agentontwerp](../04-design/agentontwerp.md)

*Alle cijfers zijn illustrative assumptions — not real company data. Microsoft-tarieven: stand oktober 2026, te controleren in de [Copilot Studio Licensing Guide](https://go.microsoft.com/fwlink/?linkid=2320995) vóór een offerte.*

## Wie betaalt wat

- Copilot Studio-agents rekenen in **Copilot credits** ([billing rates](https://learn.microsoft.com/en-us/microsoft-copilot-studio/requirements-messages-management)): een gegenereerd antwoord kost 2 credits, een agent action (bv. een tool aanroepen) 5 credits, agent flows 13 credits per 100 acties.
- **Gebruik door medewerkers met een Microsoft 365 Copilot-licentie is gratis** (interne agent, aangemeld met hun eigen identiteit). Bij Brevan heeft alleen de binnendienst zo'n licentie (25).
- De **92 technici (F3) en 14 ploegbazen** hebben er geen: hun gebruik kost credits. Dat is de groep waarvoor de agent bedoeld is (R7).

## Verbruik per maand

| Wat | Aanname | Credits per keer | Per maand |
|---|---|---:|---:|
| Vragen over personeelszaken | 30 gesprekken per werkdag × 21 dagen = 630; per gesprek gemiddeld 1,5 gegenereerd antwoord + 1 agent action | 3 + 5 = 8 | 5.040 |
| Onkostennota's | 120 per maand (±1,3 per technicus); 1 agent action + 1 antwoord + ±15 flow-acties | 5 + 2 + 2 = 9 | 1.080 |
| **Totaal** | | | **±6.100** |
| Gevoeligheid: dubbel zoveel gebruik | | | ±12.200 |

Met pay-as-you-go aan ongeveer €0,01 per credit (aanname) is dat **±€60 per maand**, en ±€120 bij dubbel gebruik — onder het plafond van €150. **Maatregel:** een maandlimiet per agent instellen in het Power Platform admin center (Licensing › Copilot Studio › Manage agents), zodat het plafond technisch afgedwongen wordt, en na 4 weken het echte verbruik vergelijken met deze raming.

## Wat het oplevert

| Baat | Aanname | Per maand |
|---|---|---:|
| HR beantwoordt minder telefoons | 25 vragen/dag, 40% staat in de documenten; de agent vangt 60% daarvan op = 6 vragen/dag × 4 min | ±8 uur |
| Technici wachten niet op HR | dezelfde 6 vragen/dag × 5 min (bellen, wachten, terugbellen) | ±10 uur |
| Onkostennota's zonder najagen | 120 nota's × 10 min minder bij ploegbaas en boekhouding (foto's zoeken, werf navragen) | ±20 uur |
| **Totaal** | | **±38 uur** |

Bij een gemiddelde loonkost van €45 per uur (aanname) is dat **±€1.700 per maand** aan tijd die vrijkomt. Dat is geen besparing op de loonlijst; het is tijd die HR en de boekhouding anders gebruiken. Zo wordt het ook gecommuniceerd.

## Eenmalig

| Wat | Aanname |
|---|---|
| PoC: workshop, ontwerp, bouw, testset, governance-basis | 6 consultantdagen |
| HR: documenten opruimen, testvragen goedkeuren | 1,5 dag |
| IT: rechten rechtzetten (R2), environments en DLP | 1 dag |
| Pilot met 2 ploegen (4 weken) + training | 2 dagen |

**Terugverdientijd:** ongeveer een half jaar bij de aannames hierboven. Belangrijker dan het cijfer zijn de drie dingen die het kunnen breken:

1. **Gebruik.** Als technici de agent niet openen, is er geen baat. → Pilot met 2 ploegen en een ploegbaas als champion ([overdracht](../08-adopt/overdracht-change-adoption.md)).
2. **Kwaliteit.** Eén fout antwoord over verlof en HR trekt de stekker eruit. → [Testset](../06-test/teststrategie-en-evaluatie.md) ≥95% vóór livegang.
3. **Kosten.** Als het gebruik veel hoger ligt (goed nieuws), loopt het verbruik op. → Limiet per agent, maandelijkse opvolging.

Opvolging van deze raming: [KPI's en meting](../08-adopt/kpis-en-meting.md).
