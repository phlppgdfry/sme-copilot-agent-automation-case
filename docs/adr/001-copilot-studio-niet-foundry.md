# ADR-001 — Copilot Studio voor deze agent, niet Azure AI Foundry

**Status:** aanvaard · **Datum:** oktober 2026 (*fictief*) · **Beslist door:** IT-verantwoordelijke, op voorstel van de consultant

## Context

Brevan wil een interne agent in Teams die HR-vragen beantwoordt en een onkostennota start. Er is één IT-verantwoordelijke en geen ontwikkelaar. De bronnen staan in SharePoint; de goedkeuring hoort in Teams.

## Opties

| Optie | Voordelen | Nadelen |
|---|---|---|
| **Copilot Studio** | low-code; SharePoint-kennis en Teams-kanaal standaard; authenticatie met Entra ID; zelfde governance en ALM als Power Platform; agent flows voor de goedkeuring | minder controle over retrieval en model; verbruik in credits |
| Azure AI Foundry (pro-code) | volledige controle over model, retrieval, evaluatie | vraagt ontwikkelaars, hosting, eigen Teams-integratie, eigen beveiliging; niemand bij Brevan kan het onderhouden |
| M365 Copilot alleen (geen agent) | geen bouw | technici hebben geen Copilot-licentie (F3); geen afgebakende bron; geen onkostentool |

## Beslissing

Copilot Studio. Het onderhoud past bij de mensen die Brevan heeft, en de governance is dezelfde als voor de flows die er al zijn.

## Gevolgen

- Verbruik in Copilot credits voor niet-gelicentieerde gebruikers → [waardecase](../03-prioritise/waardecase.md) en een maandlimiet.
- Als Brevan later een agent nodig heeft met eigen modellen of complexe retrieval (bv. technische handleidingen van 2.000 pagina's), kan Copilot Studio een Foundry-agent of Azure AI Search aanroepen. Dat is een latere stap, geen reden om nu pro-code te starten.
