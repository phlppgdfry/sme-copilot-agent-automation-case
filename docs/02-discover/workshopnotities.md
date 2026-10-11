# Workshopnotities — discovery Brevan Installaties

> Wat is dit: de (fictieve) uitkomst van de [discovery-workshop](workshop-draaiboek.md): wat er gezegd werd, waar mensen het oneens waren, wat open bleef. Voor wie: deelnemers, zaakvoerder, de collega's die bouwen. Waarom: elke keuze verderop moet terug te voeren zijn naar iets wat hier gezegd werd.
> Vorige: [Draaiboek](workshop-draaiboek.md) · Volgende: [03 — Use-caseportfolio](../03-prioritise/use-case-portfolio.md)

*Illustrative assumption — fictional workshop, 9 deelnemers, 2,5 uur.* Alle 32 kaartjes: [`workshop-kaartjes.json`](workshop-kaartjes.json) (ook in de demo, tab "Workshop").

## Wat er op de muur kwam

| Cluster | Kaartjes | Letterlijk (voorbeeld) | → |
|---|---:|---|---|
| Vragen aan HR | 6 | "25 telefoons per dag, meestal dezelfde vragen" (HR) | UC-01 |
| Onkostennota's | 6 | "Ik stuur een foto via WhatsApp naar mijn ploegbaas en hoor er niets meer van" (technicus) | UC-02 |
| Werkbonnen en facturatie | 2 | "Werkbonnen overtypen in Business Central" (boekhouding) | UC-03 |
| Offertes en klantmails | 3 | "Oude offertes terugzoeken kost uren" (binnendienst) | UC-04 |
| Werfoverleg | 1 | "Na het werfoverleg weet niemand meer wat afgesproken is" (ploegbaas) | UC-05 |
| Veiligheid | 1 | "Welke procedure voor werken op hoogte? PDF staat ergens" (technicus) | UC-06 |
| Planning | 2 | "Spoedinterventies gooien de planning om" (ploegbaas) | UC-07 |
| Klantstatus | 1 | "Klanten bellen voor de status van hun interventie" (binnendienst) | UC-08 |
| Leveranciersfacturen | 1 | "300 leveranciersfacturen per maand overtypen" (boekhouding) | UC-09 |
| Onboarding | 2 | "Nieuwe technicus: altijd iets vergeten (gsm, kledij, VCA)" (ploegbaas) | UC-10 |
| Onderhoudscontracten | 1 | "Onderhoudscontracten: niemand verwittigt de klant" (binnendienst) | UC-11 |
| "Alles over een klant" | 1 | "Ik wil alles over een klant kunnen vragen" (directie) | UC-12 |
| Governance (geen use case) | 3 | "Er draaien flows waarvan ik niet weet wie ze maakte" (IT) | [07 — Govern](../07-govern/governance-pakket.md) |
| Kosten (geen use case) | 1 | "Wat kost dit per maand?" (directie) | [waardecase](../03-prioritise/waardecase.md) |
| Urenstaten thuis nakijken | 1 | "Uren van de ploeg nakijken kan alleen op kantoor" (technicus) | de behoefte achter de gmail-flow (R3) |

## Waar mensen het oneens waren

1. **Projectcode op onkostennota's.** Boekhouding: "elke nota moet aan een project hangen." Technici: "ik weet alleen het adres van de werf." → Afspraak: de technicus geeft werfadres of klantnaam, de boekhouding koppelt het project. Geen ERP-opzoeking in de PoC ([ADR-002](../adr/002-geen-erp-koppeling-in-poc.md)).
2. **Goedkeuren op de gsm.** Ploegbazen: "goedkeuren tussen twee werven: nee bedankt." Boekhouding: "dan komen ze nog later." → Eén gebundelde Teams-melding per dag om 16 uur, vervanger bij afwezigheid, na 5 werkdagen naar de boekhouding ([ADR-003](../adr/003-goedkeuring-gebundeld-in-teams.md)).
3. **Mag een chatbot over verlof antwoorden?** HR: "ik wil niet dat hij foute dingen zegt." → De agent antwoordt alleen uit door HR gepubliceerde documenten, met bron; HR keurt de verwachte antwoorden in de testset goed; saldo's en gegevens van collega's weigert hij.
4. **Ploegbazen en Copilot-licenties.** Operationeel directeur wil licenties voor alle 14 ploegbazen voor werfverslagen. Zaakvoerder: "eerst zien dat het werkt." → Eerst testen met de 3 gelicentieerde planners (UC-05), licenties pas na meting.

## Wat we ontdekten dat niemand vroeg

- Er staan **drie versies van het personeelshandboek** op de HR-site; HR wist niet dat de versie van 2019 nog in "Gedeelde documenten" stond (R1).
- Bij het opzoeken van het handboek bleek de map **"Lonen 2025"** open te staan voor iedereen in het bedrijf (R2). Gemeld aan de IT-verantwoordelijke tijdens de pauze, niet in de groep.
- De flow die urenstaten naar gmail stuurt, is gemaakt door een technicus die **thuis de uren van zijn ploeg wil nakijken**. De behoefte is legitiem; de oplossing niet (R3).

## Open vragen (parkeerbord)

| Vraag | Wie zoekt het uit | Tegen |
|---|---|---|
| Wat kost een agent per maand voor 92 technici zonder Copilot-licentie? | consultant | waardecase |
| Biedt de ERP-partner e-facturatie (Peppol) voor leveranciersfacturen? | financieel verantwoordelijke | 2 weken |
| Mag de agent in het Frans antwoorden voor de 4 Franstalige technici? | HR | voor de pilot |
| Wie wordt eigenaar van de veiligheidsprocedures als kennisbron? | preventieadviseur | fase 2 |
