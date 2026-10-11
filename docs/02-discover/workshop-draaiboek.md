# Discovery-workshop — draaiboek (2,5 uur)

> Wat is dit: het draaiboek van de workshop waarin de use cases ontstaan. Voor wie: de consultant (en een collega die meeloopt). Waarom: een workshop zonder draaiboek eindigt in een wensenlijst; deze eindigt met drie use cases, elk met een eigenaar en een datum.
> Vorige: [Inspiratiesessie](../01-inspire/inspiratiesessie.md) · Volgende: [Workshopnotities](workshopnotities.md)

## Voorbereiding

| Wat | Wie | Wanneer |
|---|---|---|
| Deelnemers: HR-manager, financieel verantwoordelijke, 2 ploegbazen, 2 technici, 1 binnendienst, 1 planner, IT-verantwoordelijke (9) | zaakvoerder nodigt uit | 1 week vooraf |
| Huiswerk uit de inspiratiesessie verzamelen (2 kaartjes p.p.) | consultant | 2 dagen vooraf |
| Licentie-overzicht (wie heeft Copilot, wie F3) en lijst van bestaande flows | IT-verantwoordelijke | 2 dagen vooraf |
| Zaal met muur of whiteboard, kaartjes in 3 kleuren, stippen voor stemmen | consultant | — |
| Zaakvoerder komt voor het laatste blok (beslissing) | zaakvoerder | — |

Technici en ploegbazen zitten erbij omdat zij het werk doen. Een workshop met alleen kantoorpersoneel geeft use cases die op kantoor werken.

## Agenda

| Tijd | Blok | Vraag of werkvorm | Output |
|---|---|---|---|
| 0:00 | Opening (10') | doel, spelregels: "we praten over werk, niet over AI"; niemand wordt afgerekend op een idee | gedeelde verwachting |
| 0:10 | Werk in kaart (40') | per rol, stil schrijven (8'), dan voorlezen: **"Wat doe je elke week opnieuw? Hoe lang duurt het? Wie wacht erop? Waar staat de info?"** | 25–40 kaartjes |
| 0:50 | Clusteren (20') | samen kaartjes groeperen op de muur; dubbels samenvoegen | 8–14 clusters |
| 1:10 | Pauze (10') | consultant typeert de clusters alvast | — |
| 1:20 | Typeren (20') | per cluster: Copilot / agent / flow / eerst het proces / niets — met de [one-pager "Copilot, agent of flow?"](../01-inspire/copilot-agent-of-flow.md) | use-caselijst |
| 1:40 | Scoren (25') | per use case 1–5: hoe vaak, hoeveel tijd, hoeveel ergernis (waarde); is de info juist, is er een eigenaar, past de licentie (haalbaarheid); wat als het fout gaat (risico) | gescoorde lijst |
| 2:05 | Beslissen (20') | zaakvoerder erbij; top 3 + 2–3 bewuste "niet doen" | top 3 met eigenaar |
| 2:25 | Afspraken (5') | per top-use-case: eigenaar, welke bron, wie levert testvragen, datum demo | actielijst |

## Technieken en waarom

| Techniek | Waarom hier |
|---|---|
| Stil schrijven vóór bespreken | technici zeggen minder als de directeur eerst spreekt |
| Vragen naar werk, niet naar AI | "waar kan AI helpen?" levert buzzwords; "wat doe je elke week opnieuw?" levert use cases |
| 5 whys op de 3 grootste clusters | om "onkostennota's komen te laat" terug te brengen tot "de ploegbaas ziet de foto niet tussen twee werven" |
| Stippen (dot voting) alleen voor waarde | haalbaarheid en risico schat de consultant met IT in; daar heeft de zaal geen goed zicht op |
| Expliciete "niet doen" | een advies dat alles goedkeurt is geen advies |

## Wat de consultant letterlijk noteert

- de zinnen van gebruikers (worden testvragen, zie [testset](../../tests/testset.json));
- tegenstrijdigheden tussen rollen (bv. boekhouding wil projectcode, technici kennen ze niet);
- gevoelige punten (lonen, ziekte, evaluaties) — die horen in de weigerregels van een agent.

## Na de workshop (binnen 3 werkdagen)

1. [Workshopnotities](workshopnotities.md) en [use-caseportfolio](../03-prioritise/use-case-portfolio.md) naar alle deelnemers.
2. [Waardecase](../03-prioritise/waardecase.md) voor de top 3 naar de zaakvoerder.
3. Met HR: testvragen voor de agent opstellen ([teststrategie](../06-test/teststrategie-en-evaluatie.md)).
4. Met IT: [readiness-check](../04-design/readiness-en-kennisbronnen.md) van de bronnen.
