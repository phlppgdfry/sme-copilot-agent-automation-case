// Brevan Assist demo: six tabs along the consultant's journey + a 2-minute guided tour.
// Everything runs in the browser on the JSON in ../data/ (built by scripts/build-site-data.mjs).
import { CONFIGS, parseKnowledge, respond } from "./lib/agent.mjs";
import { runTestset } from "./lib/evaluate.mjs";
import { simulateRun, approversFor } from "./lib/flow.mjs";
import { checkAll } from "./lib/policy.mjs";
import { rank } from "./lib/prioritise.mjs";
import { createTour } from "./tour.js";

const $ = (s) => document.querySelector(s);
const el = (tag, attrs = {}, ...children) => {
  const n = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (k === "class") n.className = v;
    else if (k.startsWith("on")) n.addEventListener(k.slice(2), v);
    else n.setAttribute(k, v);
  }
  for (const c of children.flat()) if (c != null) n.append(c);
  return n;
};
const load = (f) => fetch(`../data/${f}`).then((r) => r.json());

const [knowledge, testset, governance, useCases, workshop] = await Promise.all(
  ["knowledge.json", "testset.json", "governance.json", "use-cases.json", "workshop.json"].map(load),
);
const chunks = parseKnowledge(knowledge);
const state = { config: CONFIGS.v2, cluster: null, testRun: null };

// --- tabs -------------------------------------------------------------------------------------------
function selectTab(name) {
  document.querySelectorAll('[role="tab"]').forEach((t) => t.setAttribute("aria-selected", String(t.id === `tab-${name}`)));
  document.querySelectorAll(".panel").forEach((p) => p.classList.toggle("active", p.id === `panel-${name}`));
}
document.querySelectorAll('[role="tab"]').forEach((t) => t.addEventListener("click", () => selectTab(t.id.slice(4))));

// --- 1 workshop -------------------------------------------------------------------------------------
const CLUSTER_LABEL = { R3: "urenstaten (R3)", R2: "loonmap (R2)", kost: "kosten", governance: "governance" };
function renderWorkshop() {
  const roles = [...new Set(workshop.cards.map((c) => c.rol))];
  $("#board").replaceChildren(
    ...roles.map((rol) =>
      el("div", {}, el("h3", {}, rol),
        ...workshop.cards.filter((c) => c.rol === rol).map((c) =>
          el("div", { class: `sticky${state.cluster && c.cluster !== state.cluster ? " dim" : ""}` }, c.tekst,
            el("small", {}, `${c.id} → ${CLUSTER_LABEL[c.cluster] ?? c.cluster}`))))),
  );
  const clusters = [...new Set(workshop.cards.map((c) => c.cluster))].filter((c) => c.startsWith("UC")).sort();
  $("#cluster-filter").replaceChildren(
    el("button", { type: "button", onclick: () => { state.cluster = null; renderWorkshop(); } }, "Alles"),
    ...clusters.map((c) => el("button", { type: "button", "aria-pressed": String(state.cluster === c),
      onclick: () => { state.cluster = c; renderWorkshop(); } }, `${c} (${workshop.cards.filter((k) => k.cluster === c).length})`)),
  );
}

// --- 2 use cases ------------------------------------------------------------------------------------
const DECISION = { poc: ["PoC", "ok"], training: ["training", "ok"], later: ["later", "warn"], "niet-doen": ["niet doen", "risk"] };
function renderUseCases() {
  const w = { value: +$("#w-value").value, feasibility: +$("#w-feas").value, risk: +$("#w-risk").value };
  $("#w-value-out").textContent = w.value; $("#w-feas-out").textContent = w.feasibility; $("#w-risk-out").textContent = w.risk;
  const ranked = rank(useCases.useCases, w);
  let n = 0;
  $("#uc-table").replaceChildren(el("table", {},
    el("thead", {}, el("tr", {}, ...["#", "Use case", "Type", "Waarde", "Haalb.", "Risico", "Score", "Beslissing"].map((h) => el("th", {}, h)))),
    el("tbody", {}, ...ranked.map((u) => {
      const nd = u.beslissing === "niet-doen";
      const [label, cls] = DECISION[u.beslissing];
      return el("tr", { title: u.reden },
        el("td", {}, nd ? "—" : String(++n)), el("td", {}, el("b", {}, u.id), " ", u.titel, el("br"), el("span", { class: "muted", style: "font-size:13px" }, u.reden)),
        el("td", {}, u.type), el("td", {}, u.value.toFixed(1)), el("td", {}, u.feasibility.toFixed(1)), el("td", {}, String(u.risico)),
        el("td", {}, nd ? el("s", {}, String(u.score)) : String(u.score)), el("td", {}, el("span", { class: `chip ${cls}` }, label)));
    }))));
}
["#w-value", "#w-feas", "#w-risk"].forEach((s) => $(s).addEventListener("input", renderUseCases));

// --- 3 agent ----------------------------------------------------------------------------------------
const TAG = { answer: "antwoord", refuse: "weigert", handoff: "naar HR", clarify: "vraagt verduidelijking", tool: "tool", "tool+answer": "tool + antwoord" };
const SUGGESTIONS = [
  "Tegen wanneer moet ik een onkostennota indienen?",
  "Hoeveel verlof heeft Jan nog?",
  "Ik heb 320 euro aan materiaal betaald, ik wil dat indienen als onkostennota",
  "Wat verdient een technicus bij Brevan?",
  "Hoeveel krijg ik terug voor een maaltijd op de werf?",
];

function setConfig(id) {
  state.config = CONFIGS[id];
  document.querySelectorAll("[data-config]").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.config === id)));
}
document.querySelectorAll("[data-config]").forEach((b) => b.addEventListener("click", () => setConfig(b.dataset.config)));

function ask(question) {
  const r = respond(question, { chunks, config: state.config });
  const chat = $("#chat");
  chat.append(el("div", { class: "msg user" }, question));
  chat.append(el("div", { class: "msg bot" },
    el("span", { class: `tag ${r.behaviour.split("+")[0]}` }, TAG[r.behaviour]), r.text,
    ...r.citations.map((c) => el("span", { class: "cite" }, `Bron: ${c.docTitle} › ${c.section}${c.scope !== "gepubliceerd" ? " ⚠ niet gepubliceerd" : ""}`))));
  chat.scrollTop = chat.scrollHeight;
  $("#trace").replaceChildren(...r.trace.map((t) => el("li", {}, el("b", {}, t.step), " ", t.detail)));
  if (r.tool) showClaim(r.tool);
  return r;
}
$("#chat-form").addEventListener("submit", (e) => {
  e.preventDefault();
  const q = $("#chat-input").value.trim();
  if (q) ask(q);
  $("#chat-input").value = "";
});
$("#suggestions").replaceChildren(...SUGGESTIONS.map((q) => el("button", { type: "button", onclick: () => ask(q) }, q)));

function showClaim(tool) {
  const box = $("#claim");
  box.classList.remove("hidden");
  const today = "2026-10-08";
  box.replaceChildren(
    el("h3", {}, "Onkostennota indienen"),
    el("p", { class: "muted", style: "font-size:14px" }, "De agent vraagt wat ontbreekt; de flow controleert alles opnieuw. Een projectcode is niet nodig."),
    el("div", { class: "claim" },
      el("label", {}, "Bedrag (€)", el("input", { id: "c-amount", type: "number", value: String(tool.inputs.bedrag ?? 42) })),
      el("label", {}, "Datum", el("input", { id: "c-date", type: "date", value: today })),
      el("label", {}, "Werf", el("input", { id: "c-site", value: "Kerkstraat 12, Torhout" })),
      el("label", {}, "Categorie", el("select", { id: "c-cat" }, ...["werfaankoop", "parking", "tol", "maaltijd", "brandstof"].map((c) => el("option", {}, c)))),
      el("label", {}, "Foto kasticket", el("select", { id: "c-photo" }, el("option", { value: "ja" }, "toegevoegd"), el("option", { value: "" }, "ontbreekt")))),
    el("p", { id: "c-approvers", class: "muted", style: "font-size:14px" }),
    el("div", { class: "chips" },
      el("button", { class: "btn-sm primary", type: "button", id: "c-submit", onclick: () => submitClaim("approve") }, "Indienen → ploegbaas keurt goed"),
      el("button", { class: "btn-sm", type: "button", onclick: () => submitClaim("reject") }, "… ploegbaas keurt af"),
      el("button", { class: "btn-sm", type: "button", onclick: () => submitClaim("timeout") }, "… geen reactie (5 dagen)")),
  );
  const upd = () => { $("#c-approvers").textContent = `Goedkeuring door: ${approversFor(+$("#c-amount").value).join(" → ")} (gebundeld om 16u, ADR-003).`; };
  $("#c-amount").addEventListener("input", upd); upd();
}

function submitClaim(decision) {
  const claim = { bedrag: +$("#c-amount").value, datum: $("#c-date").value, werf: $("#c-site").value, categorie: $("#c-cat").value, bewijsstuk: $("#c-photo").value || null };
  const run = simulateRun(claim, { ploegbaas: decision, boekhouding: "approve" });
  $("#log").replaceChildren(...run.events.map((e) => el("li", {}, `${e.at.padEnd(5)} ${e.actor}: ${e.event}`)));
  return run;
}

// --- 4 testset --------------------------------------------------------------------------------------
const CAT = { gewoon: "Gewoon", randgeval: "Randgeval", weigeren: "Weigeren / doorverwijzen" };
function runTests(id) {
  const run = runTestset(testset, { chunks, config: CONFIGS[id] });
  state.testRun = run;
  document.querySelectorAll("[data-run]").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.run === id)));
  $("#test-summary").replaceChildren(
    el("article", { class: "card" }, el("p", { class: `score-big ${run.passed === run.total ? "pass" : "fail"}` }, `${run.passed}/${run.total}`), el("p", {}, CONFIGS[id].label)),
    ...Object.entries(run.byCategory).map(([k, v]) => el("article", { class: "card" }, el("p", { class: "kpi-value" }, `${v.passed}/${v.total}`), el("p", {}, CAT[k]))),
  );
  $("#test-table").replaceChildren(el("table", {},
    el("thead", {}, el("tr", {}, ...["ID", "Vraag", "Uitslag"].map((h) => el("th", {}, h)))),
    el("tbody", {}, ...run.results.map((r) => el("tr", { class: "clickable", id: `row-${r.id}`, tabindex: "0", onclick: () => detail(r.id), onkeydown: (e) => e.key === "Enter" && detail(r.id) },
      el("td", {}, r.id), el("td", {}, r.question), el("td", {}, el("span", { class: r.pass ? "pass" : "fail" }, r.pass ? "geslaagd" : "gefaald")))))));
  return run;
}
function detail(id) {
  const r = state.testRun.results.find((x) => x.id === id);
  const tc = testset.cases.find((x) => x.id === id);
  document.querySelectorAll("#test-table tr").forEach((tr) => tr.classList.toggle("selected", tr.id === `row-${id}`));
  $("#test-detail").replaceChildren(
    el("h3", {}, `${id} · ${CAT[r.category]}`), el("p", {}, el("b", {}, "Vraag: "), r.question),
    el("p", {}, el("b", {}, "Agent: "), r.response.text),
    el("p", { class: "muted" }, "Bron: ", r.response.citations.map((c) => c.id).join(", ") || "geen"),
    el("p", {}, el("b", {}, "Verwacht: "), tc.expectedResponse),
    r.pass ? el("p", { class: "pass" }, "Geslaagd") : el("p", { class: "fail" }, `Gefaald: ${r.reasons.join("; ")}`),
    tc.why ? el("p", { class: "muted", style: "font-size:14px" }, `Waarom in de testset: ${tc.why}`) : null,
  );
}
document.querySelectorAll("[data-run]").forEach((b) => b.addEventListener("click", () => runTests(b.dataset.run)));

// --- 5 governance -----------------------------------------------------------------------------------
const STATUS = { ok: "ok", warn: "waarschuwing", block: "geblokkeerd" };
function renderGovernance() {
  const report = checkAll(governance);
  $("#gov-results").replaceChildren(...report.results.map((r, i) => el("article", { class: "card", id: `gov-${i}` },
    el("p", { class: `status ${r.status}` }, STATUS[r.status]), el("h3", {}, r.name),
    el("p", {}, `${r.environment} · ${r.stage}`),
    r.findings.length ? el("ul", { class: "findings" }, ...r.findings.map((f) => el("li", { class: f.severity }, `${f.rule} ${f.message}`))) : el("p", { class: "pass" }, "Alle regels gehaald."))));
  $("#gov-rules").replaceChildren(el("table", {},
    el("thead", {}, el("tr", {}, el("th", {}, "Regel"), el("th", {}, "Waarom"))),
    el("tbody", {}, ...report.rules.map((r) => el("tr", {}, el("td", {}, el("b", {}, r.id), " ", r.title), el("td", {}, r.why))))));
}

// --- reset + tour -----------------------------------------------------------------------------------
function reset() {
  state.cluster = null;
  setConfig("v2");
  $("#chat").replaceChildren(el("div", { class: "msg bot" }, el("span", { class: "tag answer" }, "start"),
    "Hallo, ik ben Brevan Assist, een AI-assistent voor personeelszaken. Controleer belangrijke antwoorden in het document dat ik vermeld."));
  $("#trace").replaceChildren();
  $("#log").replaceChildren(el("li", { class: "muted" }, "Nog geen flow gestart."));
  $("#claim").classList.add("hidden");
  ["#w-value", "#w-feas", "#w-risk"].forEach((s, i) => { $(s).value = [40, 35, 25][i]; });
  renderWorkshop(); renderUseCases(); runTests("v2"); renderGovernance();
  $("#test-detail").replaceChildren(el("p", { class: "muted" }, "Klik een testvraag voor het antwoord, de bron en de reden."));
  selectTab("workshop");
}
$("#btn-reset").addEventListener("click", reset);
reset();

const tour = createTour([
  { text: "Brevan kocht 25 Copilot-licenties en na vier maanden gebruikt een derde ze. De consultant begint niet met een demo maar met het werk: 32 kaartjes uit de workshop, per rol. De cluster UC-02 toont hoe zes klachten over onkostennota's één use case worden.",
    focus: "#board", before: () => { selectTab("workshop"); state.cluster = "UC-02"; renderWorkshop(); } },
  { text: "12 use cases, gescoord op waarde, haalbaarheid en risico. De top 3 bevat een flow zonder AI (onboarding), en twee ideeën worden bewust afgeraden: planning met AI en 'één chatbot met alles over onze klanten'. Een advies dat alles goedkeurt, is geen advies.",
    focus: "#uc-table", before: () => { selectTab("usecases"); renderUseCases(); } },
  { text: "De agent Brevan Assist in Teams. Een technicus vraagt naar de termijn: het antwoord komt uit het onkostenbeleid 2026, met bron. De activity map rechts toont de volgorde: eerst de weigerregels, dan tools, dan de kennis.",
    focus: "#activity", before: () => { selectTab("agent"); reset(); selectTab("agent"); ask("Tegen wanneer moet ik een onkostennota indienen?"); } },
  { text: "Wat de agent níet doet, is even belangrijk. Een vraag over het verlof van een collega wordt geweigerd door regel G1 — nog vóór de agent in de documenten zoekt.",
    focus: "#chat", before: () => { selectTab("agent"); ask("Hoeveel verlof heeft Jan nog?"); } },
  { text: "Een onkostennota van €320: de agent kiest de tool op basis van haar beschrijving. Boven €250 keurt na de ploegbaas ook de boekhouding goed. De agent beslist nooit zelf over geld; het event-log toont wat de echte flow zou doen.",
    focus: "#claim", before: () => { selectTab("agent"); ask("Ik heb 320 euro aan materiaal betaald, ik wil dat indienen als onkostennota"); submitClaim("approve"); } },
  { text: "De testset: 40 vragen, opgesteld met HR vóór de bouw. Met de hele HR-site als bron slaagt de agent maar voor 29: het oude handboek van 2019 zegt '60 dagen' en '€12', en de loonmap staat open. Klik T-07 of T-40.",
    focus: "#test-summary", before: () => { selectTab("testset"); runTests("v1"); detail("T-07"); } },
  { text: "Ontwerpkeuze (ADR-004): de agent krijgt alleen de bibliotheek die HR publiceert. Zelfde instructies, zelfde vragen: 40 op 40. De bron afbakenen werkte beter dan een extra regel 'geef geen loonbedragen'.",
    focus: "#test-summary", before: () => { selectTab("testset"); runTests("v2"); detail("T-40"); } },
  { text: "Governance: elke oplossing wordt getoetst voor ze naar productie mag. De flow die urenstaten naar een privé-gmail stuurde, wordt geblokkeerd op drie regels (Gmail, Default environment, persoonlijk account). Brevan Assist haalt alles.",
    focus: "#gov-results", before: () => { selectTab("governance"); } },
  { text: "Overdracht aan Change & Adoption: doelgroepen, de weerstand van de ploegbazen en hoe we die opvingen, en wat we na 3 maanden meten. Doelen zijn illustratief.",
    focus: "#panel-handover .grid", before: () => { selectTab("handover"); } },
  { text: "Beperkingen: de agent hier is een simulator van het ontwerp, afgestemd op de testset. De echte agent wordt in Copilot Studio gebouwd met dezelfde instructies en testset (repo: copilot-studio/). Brevan en alle cijfers zijn fictief.",
    focus: "#limits", before: () => { selectTab("handover"); } },
], { label: "Rondleiding", labels: { step: "Stap", of: "van", back: "Terug", next: "Volgende", finish: "Klaar", close: "Sluiten" } });
$("#btn-tour").addEventListener("click", () => tour.start());
// ?tour=N opens the tour at step N (used for the fallback screenshots in docs/screenshots/)
const startAt = Number(new URLSearchParams(location.search).get("tour"));
if (startAt > 1) setTimeout(() => tour.show(startAt - 1), 10);
