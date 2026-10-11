# Governance-pakket Power Platform en agents — voor een kmo zonder CoE

> Wat is dit: de afspraken en instellingen waarmee Brevan zelf mag bouwen zonder dat het misloopt. Voor wie: de IT-verantwoordelijke (voert uit), de zaakvoerder (beslist), makers (volgen). Waarom: de flow die urenstaten naar gmail stuurde (R3) bewijst dat er vandaag al gebouwd wordt, alleen zonder kader.
> Vorige: [06 — Testen](../06-test/teststrategie-en-evaluatie.md) · Volgende: [08 — Overdracht aan Change & Adoption](../08-adopt/overdracht-change-adoption.md)

## Uitgangspunt: kanaliseren, niet verbieden

Power Platform helemaal afsluiten lijkt veilig, maar dan bouwen mensen met privé-tools verder (de gmail-flow is daar een voorbeeld van). Het doel: **de veilige weg is de makkelijkste weg**. Eén IT-verantwoordelijke moet het kunnen bijhouden in een uur per week.

## 1. Environments

| Environment | Type | Waarvoor | Wie bouwt | DLP |
|---|---|---|---|---|
| Default | default | persoonlijke productiviteit: eigen flows voor eigen werk | iedereen | DLP-Default (streng) |
| Dev-*maker* | developer | bouwen en uitproberen, één per maker | de maker | DLP-Standaard |
| Brevan-Test | sandbox | testen met de testset en key users | consultant/IT | DLP-Standaard |
| Brevan-Productie | production | gedeelde oplossingen in gebruik, alleen managed solutions via de pipeline | niemand rechtstreeks | DLP-Standaard |

- **Default environment routing** aan: wie voor het eerst Power Apps of Copilot Studio opent, komt in een eigen developer environment, niet in Default ([environment strategy](https://learn.microsoft.com/en-us/power-platform/guidance/adoption/environment-strategy)).
- Alle environments als **Managed Environments**: sharing limits, usage insights, solution checker, en een welkomstbericht voor makers met de link naar deze afspraken.
- Bron: [`governance/environments.json`](../../governance/environments.json).

## 2. Data policies (DLP)

| | DLP-Default | DLP-Standaard |
|---|---|---|
| Van toepassing op | Default | Dev, Test, Productie |
| Bedrijf (*business*) | SharePoint, OneDrive for Business, Outlook, Teams, Approvals, Office 365 Users, Planner | + Dataverse, Microsoft Copilot Studio, Business Central |
| Niet-bedrijf (*non-business*) | — | MSN Weather, RSS |
| Geblokkeerd | Gmail, Outlook.com, Dropbox, Google Drive, HTTP, X, Dataverse | Gmail, Outlook.com, Dropbox, Google Drive, X |
| Nieuwe connectors | geblokkeerd | niet-bedrijf |

Een flow of agent mag geen bedrijfs- en niet-bedrijfsconnectors mengen ([Power Platform DLP](https://learn.microsoft.com/en-us/power-platform/admin/wp-data-loss-prevention)). Bron: [`governance/dlp-policies.json`](../../governance/dlp-policies.json).

## 3. Rollen

| Rol | Wie bij Brevan | Doet |
|---|---|---|
| Maker | wie wil bouwen (nu 4 mensen) | bouwt in de eigen developer environment; vraagt een review aan als anderen de oplossing nodig hebben |
| Business owner | per oplossing (bv. HR-manager voor Brevan Assist) | beslist over inhoud, aanvaardt testresultaten |
| Platformbeheerder | IT-verantwoordelijke | environments, DLP, serviceaccount, pipeline, wekelijks het overzicht |
| Partner (consultant) | extern | ontwerp, eerste oplossingen, review, kwartaaloverleg |
| Zaakvoerder | — | beslist over uitzonderingen en budget |

## 4. ALM: van idee naar productie

1. Bouwen in een **solution** in de eigen developer environment, met **environment variables** en **connection references** ([ALM](https://learn.microsoft.com/en-us/power-platform/alm/)).
2. **Check** tegen de regels hieronder (in deze case automatisch, zie §6).
3. Via **Power Platform Pipelines** naar Brevan-Test als **managed** solution; testset draaien, key users testen.
4. Business owner keurt goed → pipeline naar Brevan-Productie; eigenaar wordt `svc-powerplatform`.
5. Elke wijziging opnieuw via dezelfde weg; niemand past in productie iets met de hand aan.

## 5. Regels die elke oplossing moet halen

| ID | Regel | Waarom |
|---|---|---|
| GOV-01 | Geen bedrijfs- en niet-bedrijfsconnectors samen | DLP: bedrijfsdata mag niet naar een niet-bedrijfsconnector stromen |
| GOV-02 | Geen geblokkeerde connectors | DLP |
| GOV-03 | Gedeelde processen niet in Default of een developer environment | wat anderen nodig hebben, hoort in Test of Productie met ALM |
| GOV-04 | Eigenaar is een serviceaccount zodra anderen ervan afhangen | vertrekt de maker, dan stopt de oplossing niet |
| GOV-05 | Managed solution in test en productie | geen handmatige wijzigingen buiten dev |
| GOV-06 | Interne agent met Microsoft-authenticatie | de agent antwoordt met de rechten van de gebruiker |
| GOV-07 | Elke kennisbron heeft een eigenaar | een bron zonder eigenaar veroudert |
| GOV-08 | Agent heeft een testset (≥20 vragen, ≥15% weigervragen, ≥95% geslaagd) | kwaliteit is een cijfer |
| GOV-09 | Configuratie via environment variables | dezelfde solution moet in dev, test en productie werken |
| GOV-10 | Menselijke goedkeuring bij financiële acties | een agent boekt of betaalt niet zelf |

In een developer environment gelden GOV-07 en GOV-08 als waarschuwing; vanaf Test blokkeren ze.

## 6. De check in deze case

[`policy.mjs`](../../site/assets/lib/policy.mjs) toetst elk solution-manifest in [`governance/solutions/`](../../governance/solutions/) aan deze regels; [`tests/policy.test.mjs`](../../tests/policy.test.mjs) draait in CI. Resultaat ([`policy-report.json`](../../site/data/policy-report.json), ook in de demo, tab "Governance"):

| Oplossing | Waar | Resultaat | Bevindingen |
|---|---|---|---|
| Brevan Assist | Brevan-Productie | **ok** | — |
| Offerte-helper (binnendienst) | Dev-*maker* | **waarschuwing** | GOV-07 kennisbron zonder eigenaar · GOV-08 geen testset |
| Urenstaten wekelijks doorsturen | Default | **geblokkeerd** | GOV-02 Gmail geblokkeerd · GOV-03 gedeeld proces in Default · GOV-04 persoonlijk account · GOV-09 vaste URL |

In een echte tenant komt dit overzicht uit het Power Platform admin center (inventaris, Managed Environments-rapporten) of de [CoE Starter Kit](https://learn.microsoft.com/en-us/power-platform/guidance/coe/starter-kit). Voor een kmo met één IT-verantwoordelijke is de admin center-inventaris genoeg om te beginnen; de CoE Starter Kit wordt pas interessant boven ±50 makers.

## 7. De gmail-flow (R3): hoe we het oplosten

1. **Flow uitgezet**, niet verwijderd (de run-geschiedenis toont wat er verstuurd werd).
2. **Gesprek met de maker**, niet via mail: wat wilde je oplossen? Antwoord: "de uren van mijn ploeg thuis kunnen nakijken".
3. **De behoefte opgelost**: de urenlijst staat in een SharePoint-lijst die hij in Teams op zijn gsm kan openen. Geen flow nodig.
4. **Melding aan de zaakvoerder en de DPO-rol**: urenstaten zijn persoonsgegevens. Beoordeeld als laag risico (eigen ploeg, eigen mailbox), gedocumenteerd.
5. **Beleid**: DLP-Default blokkeert Gmail en andere privédiensten; de maker krijgt een developer environment en de uitleg in één pagina.

Niemand werd berispt. Een maker die zich betrapt voelt, bouwt de volgende keer stiller.

## 8. Ritme

| Wanneer | Wat | Wie |
|---|---|---|
| Wekelijks (15 min) | nieuwe makers, nieuwe connectors, mislukte runs | IT |
| Maandelijks | verbruik agents vs limiet, doorverwezen vragen naar HR | IT + HR |
| Per kwartaal | regels herzien, nieuwe use cases, Microsoft-releasenotes | IT + partner |
