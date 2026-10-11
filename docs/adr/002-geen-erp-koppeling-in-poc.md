# ADR-002 — Geen ERP-koppeling in de PoC: werfadres in plaats van projectcode

**Status:** aanvaard · **Datum:** oktober 2026 (*fictief*) · **Beslist door:** financieel verantwoordelijke

## Context

De boekhouding wil elke onkostennota aan een project in Business Central koppelen. Technici kennen hun projectcode niet; ze weten het werfadres of de klant (workshop, R5). Een opzoeking in Business Central vanuit de agent vraagt de Business Central-connector, rechten voor technici in het ERP en afstemming met de externe ERP-partner.

## Opties

| Optie | Voordelen | Nadelen |
|---|---|---|
| Agent zoekt het project op in Business Central | volledig automatisch | ERP-partner nodig, rechten voor 92 technici, langere PoC, ERP-data (werfadressen) niet proper |
| Technicus kiest uit een lijst van projecten | geen ERP-koppeling | lijst met honderden projecten op een gsm; fouten |
| **Technicus geeft werfadres of klantnaam; boekhouding koppelt** | eenvoudig voor de technicus; geen ERP-werk in de PoC | 1–2 minuten werk per nota voor de boekhouding |

## Beslissing

Werfadres of klantnaam. De PoC moet bewijzen dat technici hun nota's op tijd en met bewijsstuk indienen; de projectkoppeling automatiseren is een tweede stap.

## Gevolgen

- Boekhouding: ±120 nota's × 1–2 minuten per maand. Aanvaard.
- Herzien als UC-03 (werkbonnen naar het ERP) gestart wordt: dan wordt de ERP-partner toch betrokken en kan de koppeling mee.
