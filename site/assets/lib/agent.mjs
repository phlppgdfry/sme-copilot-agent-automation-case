// Brevan Assist — deterministic simulator of the agent design (docs/04-design/agentontwerp.md).
// NOT Copilot Studio and NOT a language model. It reproduces the design decisions so they can be
// tested and demonstrated in the browser and in CI:
//   1. instructions/guardrails first (what the agent must not do),
//   2. then tools (start an expense claim),
//   3. then knowledge (answer with a citation, or hand off to HR when the sources do not cover it).
// The real agent is built in Copilot Studio with the same instructions, knowledge and tool (copilot-studio/BOUWGIDS.md).

import { approversFor } from "./flow.mjs";

/** Knowledge configurations that the test set compares (ADR-004). */
export const CONFIGS = {
  v1: { id: "v1", label: "Hele HR-site", scopes: ["gepubliceerd", "hr-site-overig"] },
  v2: { id: "v2", label: "Gepubliceerde bibliotheek", scopes: ["gepubliceerd"] },
};

const STOP = new Set(
  ("de het een en of van voor op in aan te met bij als dat die dit is zijn ben wordt worden word mijn mij me ik je jij " +
    "u uw we wij hoe wat wie waar wanneer welke hoeveel moet moeten mag kan kun kunnen wil zou er nog al ook " +
    "dan om naar tot uit over door na zo heb heeft hebben krijg krijgt doe doen nu nieuwe nieuw tegen zie zien " +
    "kosten kost terug graag even eigenlijk ga gaan regel regels beleid kennen weten").split(" "),
);

// Small synonym map: how people ask (workshop notes) → words used in the documents.
const SYNONYMS = {
  bonnetje: "kasticket", ticket: "kasticket", tickets: "kasticket", wnr: "wanneer",
  lunch: "maaltijd", eten: "maaltijd", middageten: "maaltijd",
  kleren: "werkkledij", kleding: "werkkledij", werkkleding: "werkkledij",
  schoenen: "veiligheidsschoenen", helm: "beschermingsmiddelen", pbm: "beschermingsmiddelen",
  parking: "parkeerkosten", parkeren: "parkeerkosten", parkeerticket: "parkeerkosten",
  diesel: "brandstof", benzine: "brandstof", tanken: "brandstof",
  verdient: "loonschaal", verdienen: "loonschaal", salaris: "loonschaal",
  getrouwd: "huwelijk", trouw: "huwelijk", trouwen: "huwelijk",
  binnenbrengen: "indienen", inleveren: "indienen", insturen: "indienen",
  pesten: "grensoverschrijdend", ongewenst: "grensoverschrijdend",
  sluiting: "sluit", dien: "indienen", verlofdagen: "verlofsaldo", verlofdag: "verlofsaldo", saldi: "verlofsaldo",
  terugbetaald: "terugbetaling", terugbetalen: "terugbetaling", trouwfeest: "huwelijk", onkostn: "onkostennota",
  maaltijden: "maaltijd", afwezig: "afwezigheid", vervangen: "vervanging", toevoegen: "bewijsstuk", bijvoegen: "bewijsstuk",
  onkosten: "onkostennota", projectcode: "project", projectnummer: "project",
};

export function normalise(text) {
  return text.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[’']/g, "");
}

function stem(word) {
  // light Dutch stemming: enough to match "onkostennota's/onkostennota", "maaltijden/maaltijd"
  for (const suffix of ["en", "s", "e"]) {
    if (word.length > 5 && word.endsWith(suffix)) return word.slice(0, -suffix.length);
  }
  return word;
}

export function tokens(text) {
  return normalise(text)
    .split(/[^a-z0-9€]+/)
    .filter((w) => w && !STOP.has(w))
    .map((w) => SYNONYMS[w] ?? w)
    .map(stem);
}

function slug(text) {
  return normalise(text).replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

/** Split markdown documents into citable chunks (one per "## " section). */
export function parseKnowledge(docs) {
  const chunks = [];
  for (const { id, scope, markdown } of docs) {
    const title = (markdown.match(/^# (.+)$/m) || [, id])[1].trim();
    const meta = (markdown.match(/^Eigenaar: .+$/m) || [""])[0];
    const owner = (meta.match(/Eigenaar: ([^·]+)/) || [, "onbekend"])[1].trim();
    for (const part of markdown.split(/^## /m).slice(1)) {
      const [heading, ...rest] = part.split("\n");
      const text = rest.join(" ").replace(/\s+/g, " ").trim();
      chunks.push({
        id: `${id}#${slug(heading)}`,
        doc: id,
        docTitle: title,
        section: heading.trim(),
        scope,
        owner,
        text,
        sentences: text.split(/(?<=\.)\s/),
        tokens: { title: tokens(heading), body: tokens(text) },
      });
    }
  }
  return chunks;
}

// --- 1. guardrails (instructions: "wat Brevan Assist niet doet") -----------------------------------

const COLLEAGUE_NAMES = ["jan", "sofie", "ahmed", "kevin", "lien", "peeters"];
const PERSONAL = /(verlof|saldo|ziek|adres|telefoon|gsm-nummer|loon|evaluatie)/;

export const GUARDRAILS = [
  {
    id: "G1",
    name: "Gegevens van collega's",
    test: (q) =>
      PERSONAL.test(q) && (/\bcollega/.test(q) || COLLEAGUE_NAMES.some((n) => new RegExp(`\\b${n}\\b`).test(q))),
    behaviour: "refuse",
    text: "Daar kan ik niet bij helpen: ik geef geen informatie over collega's. Je eigen gegevens vind je in het portaal van het sociaal secretariaat.",
  },
  {
    id: "G2",
    name: "Medisch advies",
    test: (q) => /(medicatie|medicijn|pijn|diagnose|dokter|huisarts)/.test(q),
    behaviour: "refuse",
    text: "Ik geef geen medisch advies. Neem contact op met je huisarts of met de arbeidsarts van de externe preventiedienst. Ben je ziek, verwittig dan vóór 8 uur je ploegbaas.",
  },
  {
    id: "G3",
    name: "Juridisch advies",
    test: (q) => /(ontslag|advocaat|aanvecht|rechtbank|opzeg|vakbond)/.test(q),
    behaviour: "handoff",
    text: "Dat is een vraag voor HR, niet voor mij. Neem contact op met de HR-manager; voor juridisch advies kan je ook bij je vakbond terecht.",
  },
  {
    id: "G4",
    name: "Instructies omzeilen",
    test: (q) => /(negeer|vergeet) (je|jouw|alle) (instructies|regels)/.test(q) || /toon alle documenten/.test(q),
    behaviour: "refuse",
    text: "Dat kan ik niet doen. Ik beantwoord vragen over personeelszaken met de gepubliceerde HR-documenten.",
  },
  {
    id: "G5",
    name: "Buiten personeelszaken",
    test: (q) => /(offerte|factuur voor klant|schrijf een (mail|brief|offerte)|planning van|recept|weerbericht)/.test(q),
    behaviour: "refuse",
    text: "Ik help alleen met personeelszaken: onkosten, verlof, kledij en het personeelshandboek. Voor offertes gebruik je Copilot in Word of Outlook, of vraag je de binnendienst.",
  },
];

// --- 2. tools --------------------------------------------------------------------------------------

const EXPENSE_OBJECT = /(onkost|bonnetje|kasticket|ticket|nota)/;
const EXPENSE_ACTION = /(ik wil|wil ik|ik heb .* betaald|ik moet .* indienen|dien .* in|indienen voor|start|maak een)/;

export const TOOLS = [
  {
    id: "onkostennota-indienen",
    name: "Onkostennota indienen",
    description:
      "Maakt een onkostennota aan voor de ingelogde medewerker en stuurt ze ter goedkeuring naar de ploegbaas (boven €250 ook naar de boekhouding). Wijzigt of annuleert geen bestaande nota's.",
    inputs: ["bedrag", "datum", "werf", "bewijsstuk"],
    match: (q) => EXPENSE_OBJECT.test(q) && EXPENSE_ACTION.test(q),
  },
];

function extractAmount(q) {
  const m = q.match(/€\s?(\d+(?:[.,]\d+)?)|(\d+(?:[.,]\d+)?)\s?(?:euro|eur)\b/);
  if (!m) return null;
  return Number((m[1] ?? m[2]).replace(",", "."));
}

// --- 3. knowledge ----------------------------------------------------------------------------------

const MIN_COVERAGE = 0.5; // share of the question's weight that a chunk must cover, else hand off to HR

function idf(chunks) {
  const df = new Map();
  for (const c of chunks) for (const t of new Set([...c.tokens.title, ...c.tokens.body])) df.set(t, (df.get(t) || 0) + 1);
  return (t) => Math.log(1 + chunks.length / (1 + (df.get(t) || 0)));
}

// 1 for an exact token, 0.5 for a shared prefix ("onkost" ~ "onkostennota"), 0 otherwise
function matches(term, list) {
  if (list.includes(term)) return 1;
  return list.some((w) => term.length >= 5 && w.length >= 5 && (w.startsWith(term) || term.startsWith(w))) ? 0.5 : 0;
}

export function search(question, chunks) {
  const q = [...new Set(tokens(question))];
  const weight = idf(chunks);
  const total = q.reduce((s, t) => s + weight(t), 0) || 1;
  const scored = chunks.map((c) => {
    let score = 0;
    let covered = 0;
    for (const t of q) {
      const inTitle = matches(t, c.tokens.title);
      const inBody = matches(t, c.tokens.body);
      covered += weight(t) * Math.max(inTitle, inBody);
      score += weight(t) * (2 * inTitle + inBody);
    }
    return { chunk: c, score, coverage: covered / total };
  });
  // rank on score × coverage: a section that answers most of the question beats one that repeats one word
  scored.sort((a, b) => b.score * b.coverage - a.score * a.coverage || a.chunk.text.length - b.chunk.text.length);
  return scored;
}

/** The core answer: the first sentence of the section, plus the sentence that best matches the question. */
function answerFrom(chunk, question) {
  const q = tokens(question);
  const scoreOf = (s) => q.reduce((n, t) => n + matches(t, tokens(s)), 0);
  let best = 1;
  chunk.sentences.forEach((s, i) => { if (i > 1 && scoreOf(s) > scoreOf(chunk.sentences[best] ?? "")) best = i; });
  const extra = chunk.sentences[best];
  return extra && scoreOf(extra) >= scoreOf(chunk.sentences[0]) * 0.75 || best === 1
    ? [chunk.sentences[0], extra].filter(Boolean).join(" ")
    : chunk.sentences.slice(0, 2).join(" ");
}

// --- orchestration ---------------------------------------------------------------------------------

/**
 * @returns {{behaviour: "answer"|"refuse"|"handoff"|"clarify"|"tool"|"tool+answer", text: string,
 *            citations: {id: string, doc: string, docTitle: string, section: string, scope: string}[],
 *            tool?: {id: string, inputs: object, approvers: string[]}, trace: {step: string, detail: string}[]}}
 */
export function respond(question, { chunks, config = CONFIGS.v2 }) {
  const q = normalise(question);
  const trace = [{ step: "Vraag", detail: question }];
  const visible = chunks.filter((c) => config.scopes.includes(c.scope));
  trace.push({ step: "Kennisbron", detail: `${config.label} — ${visible.length} fragmenten` });

  for (const g of GUARDRAILS) {
    if (g.test(q)) {
      trace.push({ step: "Instructie", detail: `${g.id} ${g.name} → ${g.behaviour}` });
      return { behaviour: g.behaviour, text: g.text, citations: [], trace, guardrail: g.id };
    }
  }
  trace.push({ step: "Instructies", detail: "geen weigerregel geraakt" });

  if (question.trim().split(/\s+/).length <= 2 && tokens(question).length <= 1) {
    trace.push({ step: "Verduidelijking", detail: "te weinig informatie om te kiezen" });
    return {
      behaviour: "clarify",
      text: "Waarover wil je meer weten? Bijvoorbeeld: verlof aanvragen, je verlofsaldo, ziekte of collectieve sluiting.",
      citations: [],
      trace,
    };
  }

  const tool = TOOLS.find((t) => t.match(q));
  let toolResult;
  if (tool) {
    const amount = extractAmount(q);
    toolResult = {
      id: tool.id,
      inputs: { bedrag: amount, datum: null, werf: null, bewijsstuk: null },
      approvers: amount == null ? [] : approversFor(amount),
    };
    trace.push({ step: "Tool", detail: `${tool.name} (gekozen op beschrijving) — bedrag ${amount ?? "nog te vragen"}` });
  }

  // multi-intent: a tool request can carry a question ("…, en hoeveel mag een maaltijd kosten?")
  const rest = tool ? question.split(/\b(?:en|maar)\b(?=[^,]*\?)/i).slice(1).join(" ") : question;
  if (tool && !rest.trim()) {
    const missing = Object.entries(toolResult.inputs).filter(([, v]) => v == null).map(([k]) => k);
    return {
      behaviour: "tool",
      text: `Ik start een onkostennota. Ik heb nog nodig: ${missing.join(", ")}.`,
      citations: [],
      tool: toolResult,
      trace,
    };
  }

  const [best] = search(rest || question, visible);
  if (!best || best.coverage < MIN_COVERAGE || best.score === 0) {
    trace.push({ step: "Kennis", detail: `geen fragment dekt de vraag (dekking ${best ? Math.round(best.coverage * 100) : 0}%) → HR` });
    const text = "Dat vind ik niet in de gepubliceerde HR-documenten. Stel je vraag aan HR via de HR-site of bel de HR-manager.";
    return tool
      ? { behaviour: "tool", text: `Ik start een onkostennota. ${text}`, citations: [], tool: toolResult, trace }
      : { behaviour: "handoff", text, citations: [], trace };
  }
  const c = best.chunk;
  c.answer = answerFrom(c, rest || question);
  trace.push({
    step: "Kennis",
    detail: `${c.docTitle} › ${c.section} (score ${best.score.toFixed(1)}, dekking ${Math.round(best.coverage * 100)}%)`,
  });
  const citation = { id: c.id, doc: c.doc, docTitle: c.docTitle, section: c.section, scope: c.scope };
  if (tool) {
    return {
      behaviour: "tool+answer",
      text: `Ik start een onkostennota. Over je vraag: ${c.answer}`,
      citations: [citation],
      tool: toolResult,
      trace,
    };
  }
  return { behaviour: "answer", text: c.answer, citations: [citation], trace };
}
