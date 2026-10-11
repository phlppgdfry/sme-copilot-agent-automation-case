# Hiring manager view (5–10 minuten)

**De ambiguïteit:** "we betalen voor Copilot en zien niets" is geen use case. De case maakt er een besluit van: drie use cases met een eigenaar, twee afgeraden ([portfolio](../../docs/03-prioritise/use-case-portfolio.md)).

**Stakeholders en conflicten:** boekhouding wil een projectcode, technici kennen alleen het werfadres ([ADR-002](../../docs/adr/002-geen-erp-koppeling-in-poc.md)); ploegbazen willen niet goedkeuren tussen twee werven ([ADR-003](../../docs/adr/003-goedkeuring-gebundeld-in-teams.md)); HR vreest foute antwoorden ([testset met HR](../../docs/06-test/teststrategie-en-evaluatie.md)).

**Trade-offs:** één agent i.p.v. twee · SharePoint-lijst i.p.v. Dataverse (geen premium licentie voor 92 technici) · Copilot Studio i.p.v. pro-code ([ADR-001](../../docs/adr/001-copilot-studio-niet-foundry.md)) · afschermen i.p.v. extra regels ([ADR-004](../../docs/adr/004-kennisbron-gepubliceerde-bibliotheek.md)).

**Risico's en hoe ze afgedekt zijn:** oversharing (readiness als go/no-go), kosten (maandlimiet per agent), kwaliteit (≥95% testscore, GOV-08), adoptie (champions, guardrail-KPI).

**Overdracht:** [Change & Adoption](../../docs/08-adopt/overdracht-change-adoption.md) en [KPI's](../../docs/08-adopt/kpis-en-meting.md).

**Wat niet geclaimd wordt:** klantworkshops gegeven, agents in productie, tenant-beheer bij klanten.
