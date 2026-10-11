# Case study — Brevan Assist

> Het volledige verhaal in ±10 minuten lezen. *Independent portfolio case study based on a fictional organisation. All figures are illustrative assumptions — not real company data.*

## 1. Het probleem

Brevan Installaties is een fictief installatiebedrijf met 140 medewerkers, waarvan 92 technici op de baan. Vier maanden geleden kocht de zaakvoerder 25 Microsoft 365 Copilot-licenties. Een derde ervan wordt wekelijks gebruikt. HR beantwoordt elke dag een vijfentwintigtal vragen over onkosten, verlof en werkkledij, en onkostennota's komen als WhatsApp-foto binnen bij de ploegbaas, gemiddeld drie weken te laat.

Twee weken na de vraag "wat kunnen we hier echt mee?" vond de IT-verantwoordelijke een flow die elke week de urenstaten van een ploeg naar een privé-gmailadres stuurt. Er wordt dus al gebouwd, alleen zonder kader.

## 2. Hoe ik begon: bij het werk, niet bij de technologie

Een inspiratiesessie van 45 minuten liet drie soorten hulp zien: Copilot (een persoonlijke assistent), een agent (een nieuwe collega die alleen in één map mag lezen) en een flow (een vaste werkinstructie). Eerst de weigering van een agent tonen, dan pas het goede antwoord: mensen vertrouwen een agent sneller als ze zien wat hij niet doet.

De discovery-workshop van 2,5 uur stelde één vraag per rol: **wat doe je elke week opnieuw, hoe lang duurt het, wie wacht erop, waar staat de info?** Technici en ploegbazen zaten erbij, want zij doen het werk. Resultaat: 32 kaartjes, 15 clusters, en drie dingen die niemand vroeg: drie versies van het personeelshandboek, een loonmap die voor iedereen openstaat, en een technicus die de uren van zijn ploeg thuis wil kunnen nakijken (de reden achter de gmail-flow).

## 3. Wat ik koos, en wat niet

Twaalf use cases, gescoord op waarde (hoe vaak, hoeveel tijd, hoeveel ergernis), haalbaarheid (juiste data, eigenaar, licentie) en risico. De top drie:

1. **Vragen over personeelszaken** (agent) — vaak, één bron, een eigenaar die wil meewerken.
2. **Onboarding van nieuwe technici** (flow, zonder AI) — snelle winst en een veilige test voor de nieuwe environment-strategie.
3. **Onkostennota met foto** (tool in dezelfde agent) — zelfde gebruikers, één extra tool.

Twee ideeën heb ik afgeraden: planning optimaliseren met AI (er is geen planningssysteem om op te bouwen) en één chatbot met alles over de klanten (geen afgebakende vraag, geen eigenaar, persoonsgegevens). Offertes samenvatten en vergaderverslagen werden training, geen project: de licenties zijn er al.

De waardecase rekent in Copilot credits: technici hebben geen Copilot-licentie, dus hun gesprekken kosten verbruik. Geraamd ±€60 per maand, onder het plafond van €150 van de zaakvoerder, met een maandlimiet in het admin center.

## 4. Het ontwerp: Brevan Assist

Eén agent in Teams, met Microsoft-authenticatie, generative orchestration en drie lagen in vaste volgorde:

1. **Instructies, met wat hij níet doet:** geen gegevens van collega's, geen loonbedragen, geen medisch of juridisch advies, geen taken buiten personeelszaken, geen goedkeuringen.
2. **Eén tool:** *Onkostennota indienen*. De agent vraagt bedrag, datum, werf en foto; de flow controleert alles opnieuw en stuurt de nota naar de ploegbaas, boven €250 ook naar de boekhouding.
3. **Eén kennisbron:** de bibliotheek *Personeelszaken – Gepubliceerd*, beheerd door HR. Elk antwoord vermeldt het document.

Twee conflicten uit de workshop werden ontwerpkeuzes. De boekhouding wil een projectcode, maar technici kennen alleen het werfadres: de technicus geeft het adres, de boekhouding koppelt (geen ERP-koppeling in de PoC). Ploegbazen willen niet goedkeuren tussen twee werven: ze krijgen één gebundelde Teams-melding per dag om 16 uur, met een vervanger en escalatie na vijf werkdagen.

## 5. Testen: de kennisbron maakt het verschil

Vóór de bouw stelden HR en ik 40 testvragen op, letterlijk zoals mensen ze stellen: 24 gewone vragen, 8 randgevallen (tikfouten, twee vragen in één, een vage vraag) en 8 vragen die de agent moet weigeren of doorverwijzen.

Met dezelfde instructies draaide ik de testset met twee kennisbronnen:

- **De hele HR-site:** 29 van de 40. Negen antwoorden kwamen uit het handboek van 2019 ("binnen 60 dagen, op papier", "maaltijd tot €12"), twee gaven loonschalen met bedragen uit de open map.
- **Alleen de gepubliceerde bibliotheek:** 40 van de 40.

De les: de instructie "geef geen loonbedragen" hielp niet, omdat "wat verdient een technicus?" niet als loonvraag herkend werd terwijl de map in bereik lag. Afschermen werkte beter dan een extra regel. Het oude handboek won vaak omdat het in de taal van de gebruikers geschreven was. Opruimen is daarom een taak van HR, met de agent als aanleiding.

De demo gebruikt een deterministische simulator van dit ontwerp, afgestemd op de testset. Hij bewijst de keuzes, niet de taalkwaliteit van een echte agent. Dezelfde testset staat klaar om te importeren in Copilot Studio.

## 6. Governance: kanaliseren, niet verbieden

Een kmo met één IT-verantwoordelijke heeft geen Center of Excellence nodig, wel vier afspraken die technisch afgedwongen worden:

- **Environments:** default environment routing stuurt makers naar een eigen developer environment; Test en Productie als Managed Environments.
- **Data policies:** in Default alleen Microsoft 365-connectors; privédiensten zoals Gmail en Dropbox geblokkeerd.
- **ALM:** alles in solutions met environment variables en connection references; via een pipeline naar productie; eigenaar in productie is een serviceaccount.
- **Tien regels** die elke oplossing moet halen, van "geen geblokkeerde connectors" tot "agent heeft een testset met ≥95% geslaagd". Een check in deze repo toetst de manifesten: Brevan Assist haalt alles, de gmail-flow wordt geblokkeerd op drie regels.

De gmail-flow werd een gesprek, geen sanctie: flow uitgezet, de behoefte opgelost met een lijst die de technicus in Teams op zijn gsm kan openen, het risico gedocumenteerd.

## 7. Adoptie en meten

De overdracht aan de Change & Adoption-collega's beschrijft per doelgroep waar ze staan (ADKAR), welke weerstand we hoorden en wat er al aan gedaan is, en welke training past: tien minuten op de werf voor technici, twintig voor ploegbazen, anderhalf uur per rol voor de Copilot-gebruikers. Na drie maanden meten we HR-vragen (−30%), deflectie (≥60%), doorlooptijd van onkostennota's (≤7 dagen), testscore (≥95%) en verbruik. De guardrail: geen ploegbaas meer dan tien minuten per dag aan goedkeuringen.

## 8. Wat deze case over mij zegt

Ik begin bij het werk en de mensen, niet bij de tool. Ik zeg ook "nee" of "eerst opruimen" als dat beter is. Ik ontwerp een agent vanuit wat hij níet mag doen, en ik test voor ik iets beloof. Ik laat het achter met een eigenaar, een kader en een meetplan.

Wat deze case níet aantoont: workshops gegeven voor echte klanten, agents in productie, of tenant-beheer. Brevan, de workshop en alle cijfers zijn fictief.
