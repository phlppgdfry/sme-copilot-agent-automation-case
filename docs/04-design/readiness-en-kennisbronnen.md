# Readiness-check en kennisbronnen

> Wat is dit: de controle van de bronnen en rechten vóór de agent gebouwd wordt. Voor wie: HR (eigenaar van de inhoud) en de IT-verantwoordelijke (rechten). Waarom: een agent antwoordt met wat hij vindt. Staat er een oud of vertrouwelijk document in zijn bereik, dan komt dat in een antwoord terecht.
> Vorige: [Agentontwerp](agentontwerp.md) · Volgende: [Bouwspecificatie](bouwspecificatie.md)

## Wat we controleerden

| Controle | Bevinding (*fictief*) | Actie | Wie | Go/no-go |
|---|---|---|---|---|
| Welke versies van het handboek bestaan? | 3 versies; 2019 staat nog in "Gedeelde documenten" (R1) | 2019 en 2022 archiveren; alleen 2026 in de bibliotheek *Gepubliceerd* | HR | **ja** |
| Wie heeft toegang tot de HR-site? | map "Lonen 2025" open voor "Iedereen behalve externe gebruikers" (R2) | rechten beperken tot HR en directie; deellinks intrekken | IT | **ja** — blokkerend |
| Heeft elke bron een eigenaar? | onkosten, verlof, handboek: HR-manager; kledij/PBM: preventieadviseur | eigenaar in de bibliotheek als kolom | HR | ja |
| Zijn de documenten leesbaar voor een agent? | 2 gescande PDF's zonder tekst | opnieuw publiceren als Word/tekst-PDF | HR | ja |
| Staan er persoonsgegevens in de bron? | één formulier met voorbeeldnamen | anonimiseren | HR | ja |
| Labels | geen sensitivity labels in gebruik | voorstel: label *Vertrouwelijk – HR* voor de loonmap (Purview) | IT | nee (aanbeveling) |

Deze controle volgt de logica van [Copilot-readiness](https://learn.microsoft.com/en-us/copilot/microsoft-365/microsoft-365-copilot-overview): Copilot en agents gebruiken de rechten die er al zijn. Oversharing wordt pas zichtbaar als iemand er een vraag over stelt.

## De keuze: één bibliotheek

| Optie | Voordeel | Nadeel | Gekozen |
|---|---|---|---|
| Hele HR-site als kennisbron | snel, alles is "erbij" | oude versies en open mappen komen in antwoorden; niemand weet wat de agent leest | nee |
| **Bibliotheek *Personeelszaken – Gepubliceerd*** | HR beslist wat de agent leest; één eigenaar; actueel | HR moet publiceren (een extra stap) | **ja** |
| Documenten uploaden in de agent | volledig onder controle | nog een kopie die veroudert | nee |

**Het bewijs** zit in de testset: met de hele HR-site als bron slaagt de simulator voor 29 van de 40 vragen, met alleen de gepubliceerde bibliotheek voor 40 van de 40. De 11 fouten komen uit het handboek van 2019 (9) en de loonmap (2). Details: [teststrategie en evaluatie](../06-test/teststrategie-en-evaluatie.md) · beslissing: [ADR-004](../adr/004-kennisbron-gepubliceerde-bibliotheek.md).

## Afspraken met HR (de eigenaar)

1. Alleen wat in *Gepubliceerd* staat, gebruikt de agent.
2. Een nieuw of gewijzigd beleid → eerst publiceren, dan de testvragen over dat onderwerp opnieuw draaien.
3. Elke maand: HR bekijkt de vragen die naar HR doorverwezen werden (analytics). Een vraag die vaak terugkomt en in geen document staat, is een ontbrekend document.
