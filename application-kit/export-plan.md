# Export plan

| Artefact | PDF | PPTX | Web | GitHub | Status |
|---|---|---|---|---|---|
| One-pager | [one-pager.pdf](exports/one-pager.pdf) | — | `site/one-pager/` | [samenvatting](executive/one-page-summary.md) | klaar |
| Interview-deck (8 slides) | [interview-deck.pdf](exports/interview-deck.pdf) | — (PDF volstaat; PPTX op vraag) | `site/deck/` | [deck](presentation/interview-deck.md) + [notities](presentation/speaker-notes.md) | klaar |
| Case study | — | — | site | [CASE_STUDY.md](../CASE_STUDY.md) | klaar |
| Demo-scripts 2 / 5 / 15 min | — | — | `demo/?tour` | [demo/](demo/) | klaar |
| Views | — | — | — | [views/](views/) | klaar |

Opnieuw exporteren: `python3 -m http.server -d site 8765` en dan headless Chrome `--print-to-pdf` op `/one-pager/` en `/deck/`.
