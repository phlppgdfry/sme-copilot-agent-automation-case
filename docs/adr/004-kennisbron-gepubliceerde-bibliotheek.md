# ADR-004 — Kennisbron: alleen de bibliotheek *Personeelszaken – Gepubliceerd*

**Status:** aanvaard · **Datum:** oktober 2026 (*fictief*) · **Beslist door:** HR-manager

## Context

De HR-site bevat drie versies van het personeelshandboek (R1) en een map met loonschalen die voor iedereen openstaat (R2). In Copilot Studio kan je een hele SharePoint-site als kennisbron toevoegen.

## Opties

| Optie | Voordelen | Nadelen |
|---|---|---|
| Hele HR-site | snel; "alles zit erin" | oude versies en open mappen komen in antwoorden; niemand weet wat de agent leest |
| **Eén bibliotheek die HR publiceert** | HR beslist wat de agent leest; één eigenaar; actueel | HR moet publiceren, een extra stap |
| Bestanden uploaden in de agent | volledig onder controle | nog een kopie die veroudert; HR kan het niet zelf bijwerken |

## Beslissing

Alleen *Personeelszaken – Gepubliceerd*. Daarnaast worden de oude versies gearchiveerd en de rechten van de loonmap rechtgezet. Dat is nodig los van de agent: Copilot en zoekfuncties zien die map ook.

## Bewijs

Dezelfde instructies en testset, twee configuraties (simulator):

| Kennisbron | Resultaat |
|---|---|
| Hele HR-site | 29/40 — 9 antwoorden uit het handboek van 2019, 2 met loonbedragen |
| Gepubliceerde bibliotheek | 40/40 |

Details: [teststrategie en evaluatie](../06-test/teststrategie-en-evaluatie.md). De test [`agent.test.mjs`](../../tests/agent.test.mjs) bewaakt dit verschil in CI.

## Gevolgen

- HR publiceert elk nieuw beleid eerst in *Gepubliceerd* en laat daarna de testvragen over dat onderwerp opnieuw draaien.
- Governance-regel GOV-07: elke kennisbron heeft een eigenaar.
