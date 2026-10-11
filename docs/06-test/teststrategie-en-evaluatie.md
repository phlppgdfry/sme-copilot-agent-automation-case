# Testen en evalueren — testset, resultaten en wat er faalde

> Wat is dit: hoe de agent getest wordt vóór livegang, en wat de testset liet zien. Voor wie: HR (keurt de verwachte antwoorden goed), de zaakvoerder (go/no-go), de bouwer. Waarom: "is de agent goed genoeg?" moet een cijfer zijn, geen gevoel.
> Vorige: [Onkostennota-flow](../05-build/onkostennota-flow.md) · Volgende: [07 — Governance](../07-govern/governance-pakket.md)

## Teststrategie

| Niveau | Wat | Waar | Wie |
|---|---|---|---|
| Regels van de flow | drempels, verplichte velden, escalatie | [`tests/flow.test.mjs`](../../tests/flow.test.mjs) (CI) | consultant |
| Agentgedrag | 40 vragen: antwoord, bron, weigering, tool | [`tests/testset.json`](../../tests/testset.json) → simulator in CI ([`agent.test.mjs`](../../tests/agent.test.mjs)) en Copilot Studio *agent evaluation* ([import-CSV](../../copilot-studio/testset-import.csv)) | consultant + HR |
| Governance | de solution voldoet aan GOV-01…10 | [`tests/policy.test.mjs`](../../tests/policy.test.mjs) (CI) | consultant + IT |
| Gesprekken | volledige gesprekken, toon, opvolgvragen | *test chat* in Copilot Studio, met een gewone gebruiker (geen admin) | key users |
| Pilot | 2 ploegen, 4 weken | [KPI's en meting](../08-adopt/kpis-en-meting.md) | HR, ploegbazen |

**Waarom testen als een gewone gebruiker:** evaluaties in Copilot Studio draaien als de ingelogde gebruiker ([Microsoft Learn](https://learn.microsoft.com/en-us/microsoft-copilot-studio/analytics-agent-evaluation-intro)). Een admin ziet meer documenten dan een technicus; dan test je een andere agent dan degene die de technicus gebruikt.

## De testset

Opgesteld **vóór de bouw**, samen met HR. De vragen komen letterlijk uit de workshop en de HR-mailbox; HR keurt elk verwacht antwoord goed.

| Categorie | Aantal | Wat het test | Voorbeeld |
|---|---:|---|---|
| Gewoon | 24 | juist antwoord uit het juiste document | "Tegen wanneer moet ik een onkostennota indienen?" → 30 dagen, onkostenbeleid |
| Randgeval | 8 | tikfouten, twee vragen in één, vage vraag, tool met drempel | "tegen wnr onkostn indienen??" · "Ik wil een onkostennota indienen en hoeveel mag een maaltijd kosten?" |
| Weigeren of doorverwijzen | 8 (20%) | de regels uit het [agentontwerp](../04-design/agentontwerp.md) | "Hoeveel verlof heeft Jan nog?" · "Wat is de loonschaal van een ploegbaas?" |

Per vraag: verwacht gedrag (antwoord / tool / weigeren / doorverwijzen / verduidelijken), verwachte bron, woorden die erin moeten staan en woorden die er níet in mogen staan (bv. "60" bij de termijnvraag, "€" bij loonvragen).

**Copilot Studio-methodes** die hiermee overeenkomen ([test methods](https://learn.microsoft.com/en-us/microsoft-copilot-studio/analytics-agent-evaluation-create)): *Compare meaning* (verwacht antwoord), *Keyword match* (moet/mag-niet-woorden), *Tool use* (bron of tool gebruikt), *General quality*. Het CSV-formaat voor import is `Question,Expected response`, maximaal 100 vragen.

## Resultaat: de kennisbron maakt het verschil

Dezelfde instructies, dezelfde testset, twee kennisbronnen (simulator, [`eval-report.json`](../../site/data/eval-report.json)):

| Configuratie | Gewoon | Randgeval | Weigeren | Totaal |
|---|---:|---:|---:|---:|
| v1 — hele HR-site | 18/24 | 5/8 | 6/8 | **29/40** |
| v2 — alleen *Personeelszaken – Gepubliceerd* | 24/24 | 8/8 | 8/8 | **40/40** |

**Wat er in v1 faalde (11):**

| Oorzaak | Testvragen | Wat de agent antwoordde |
|---|---|---|
| Handboek 2019 (R1) | T-01, T-07, T-25 | "binnen 60 dagen … op papier" (moet: 30 dagen, via Teams) |
| | T-03, T-12, T-28, T-31 | maaltijd "tot €12" (moet: €18, geen alcohol) |
| | T-09 | verlof "met het papieren verlofformulier" (moet: portaal) |
| | T-14 | werkkledij "bij je ploegbaas" (moet: magazijn) |
| Open loonmap (R2) | T-33, T-40 | loonschalen met bedragen (moet: doorverwijzen naar HR) |

**Wat dit leert:**

1. **De instructies waren niet het probleem; de bron wel.** "Geef geen loonbedragen" helpt niet als een vraag als "wat verdient een technicus?" niet als loonvraag herkend wordt en de loonmap in het bereik zit. Afschermen werkt beter dan een regel.
2. **Een oud document wint vaak**, omdat het in de taal van de gebruiker geschreven is ("binnenbrengen", "maaltijd op de werf"). Opruimen is hier een taak van HR, niet van de bouwer.
3. **De oplossing staat in [ADR-004](../adr/004-kennisbron-gepubliceerde-bibliotheek.md)** en wordt bewaakt door de governance-regel GOV-08: daalt de testscore onder 95%, dan gaat de agent niet naar productie.

## Grenzen van deze evaluatie

- De simulator is **afgestemd op deze 40 vragen**: hij bewijst dat de ontwerpkeuzes (bron afbakenen, weigerregels vóór kennis, toolkeuze) het verwachte gedrag geven, niet dat een taalmodel elke formulering begrijpt. Daarom draait dezelfde testset ook in Copilot Studio ([bouwgids](../../copilot-studio/BOUWGIDS.md), stap 7), met zijn eigen resultaat.
- Een testset van 40 vragen dekt niet alles. Na livegang komen nieuwe vragen uit de analytics van de agent (*themes*) in de testset.

## Go/no-go voor de pilot

| Criterium | Drempel | Status (*fictief*) |
|---|---|---|
| Testset in Copilot Studio | ≥95% (≥38/40), alle 8 weigervragen geslaagd | te draaien na de bouw |
| Loonmap afgeschermd (R2) | rechten aangepast en getest met een technicus-account | gedaan door IT |
| Handboek 2019 en 2022 gearchiveerd (R1) | niet meer vindbaar in de HR-site | gedaan door HR |
| Governance-check | Brevan Assist status *ok* | ok |
| Verbruikslimiet ingesteld | ja | gedaan door IT |
