# Kennisbronnen van Brevan Assist (fictief)

> Fictieve HR-documenten van de fictieve kmo Brevan Installaties. Ze bestaan om de agent-simulator en de testset te voeden. *Illustrative assumption — not real company data.* Geen echte personen, lonen of regels van een bestaande werkgever.

| Map | Wat | Gebruikt door de agent |
|---|---|---|
| [`gepubliceerd/`](gepubliceerd/) | de bibliotheek "Personeelszaken – Gepubliceerd": actuele, door HR goedgekeurde documenten, eigenaar HR-manager | **ja** — de enige kennisbron in het ontwerp (v2) |
| [`hr-site-overig/`](hr-site-overig/) | wat er verder op de HR-site staat: een oud handboek (2019) en een overzicht met loonschalen dat per ongeluk voor iedereen openstaat | **nee** — alleen in configuratie v1 ("hele HR-site"), om te tonen wat er dan misgaat |

Elke `##`-sectie is één fragment dat de simulator kan citeren. De eerste zin van een sectie is het kernantwoord.
Waarom de agent alleen de gepubliceerde bibliotheek krijgt: [ADR-004](../docs/adr/004-kennisbron-gepubliceerde-bibliotheek.md).
