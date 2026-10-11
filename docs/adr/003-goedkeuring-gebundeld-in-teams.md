# ADR-003 — Goedkeuring door de ploegbaas gebundeld in één Teams-melding per dag

**Status:** aanvaard · **Datum:** oktober 2026 (*fictief*) · **Beslist door:** operationeel directeur

## Context

Het onkostenbeleid zegt dat de ploegbaas goedkeurt. Ploegbazen weigeren "goedkeuren op de gsm tussen twee werven" (workshop, R4). De boekhouding vreest dat nota's dan nog later binnenkomen.

## Opties

| Optie | Voordelen | Nadelen |
|---|---|---|
| Elke nota meteen een Teams-goedkeuring | snel | onderbreekt de ploegbaas op de werf; weerstand |
| Agent keurt kleine bedragen zelf goed | geen werk voor de ploegbaas | een agent beslist over geld; tegen het beleid; misbruik moeilijk te zien |
| **Eén gebundelde melding per dag om 16u, met alle nota's van de ploeg; vervanger bij afwezigheid; na 5 werkdagen naar de boekhouding** | voorspelbaar moment, minder onderbrekingen, niets blijft hangen | tot een dag vertraging |

## Beslissing

Gebundelde melding om 16 uur. De ploegbaas keurt goed of af met reden; de agent beslist nooit.

## Gevolgen

- Flowontwerp: de status staat in de lijst, een dagelijkse flow stuurt de bundel en escaleert ([onkostennota-flow](../05-build/onkostennota-flow.md)).
- Guardrail-KPI: maximaal 10 minuten per dag per ploegbaas ([KPI's](../08-adopt/kpis-en-meting.md)).
