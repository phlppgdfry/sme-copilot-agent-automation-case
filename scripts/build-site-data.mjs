// Builds the data the site and the checks use, from the sources in the repo:
//   knowledge/**/*.md      → site/data/knowledge.json
//   tests/testset.json     → site/data/testset.json + copilot-studio/testset-import.csv (Copilot Studio import format)
//   governance/**/*.json   → site/data/governance.json
//   docs/02-discover/workshop-kaartjes.json, docs/03-prioritise/use-cases.json → site/data/
//   evaluation v1 + v2     → site/data/eval-report.json
//   governance check       → site/data/policy-report.json
// CI runs this and fails when the committed output is out of date (git diff --exit-code).
import { readFileSync, writeFileSync, readdirSync, mkdirSync } from "node:fs";
import { join, dirname, basename } from "node:path";
import { fileURLToPath } from "node:url";
import { CONFIGS, parseKnowledge } from "../site/assets/lib/agent.mjs";
import { runTestset } from "../site/assets/lib/evaluate.mjs";
import { checkAll } from "../site/assets/lib/policy.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const out = join(root, "site", "data");
mkdirSync(out, { recursive: true });
const write = (file, data) => writeFileSync(file, typeof data === "string" ? data : JSON.stringify(data, null, 2) + "\n");

export function loadKnowledgeDocs() {
  const docs = [];
  for (const scope of ["gepubliceerd", "hr-site-overig"]) {
    for (const f of readdirSync(join(root, "knowledge", scope)).filter((f) => f.endsWith(".md")).sort()) {
      docs.push({ id: basename(f, ".md"), scope, path: `knowledge/${scope}/${f}`, markdown: readFileSync(join(root, "knowledge", scope, f), "utf8") });
    }
  }
  return docs;
}

export function loadGovernance() {
  const read = (p) => JSON.parse(readFileSync(join(root, p), "utf8"));
  const solutions = readdirSync(join(root, "governance", "solutions")).filter((f) => f.endsWith(".json")).sort()
    .map((f) => read(`governance/solutions/${f}`));
  return { environments: read("governance/environments.json"), policies: read("governance/dlp-policies.json"), solutions };
}

const docs = loadKnowledgeDocs();
const testset = JSON.parse(readFileSync(join(root, "tests", "testset.json"), "utf8"));
const governance = loadGovernance();
const chunks = parseKnowledge(docs);

write(join(out, "knowledge.json"), docs);
write(join(out, "testset.json"), testset);
write(join(out, "governance.json"), governance);
write(join(out, "use-cases.json"), JSON.parse(readFileSync(join(root, "docs", "03-prioritise", "use-cases.json"), "utf8")));
write(join(out, "workshop.json"), JSON.parse(readFileSync(join(root, "docs", "02-discover", "workshop-kaartjes.json"), "utf8")));

const strip = ({ response, ...r }) => ({ ...r, behaviour: response.behaviour, citations: response.citations.map((c) => c.id) });
const report = {};
for (const config of Object.values(CONFIGS)) {
  const run = runTestset(testset, { chunks, config });
  report[config.id] = { label: config.label, passed: run.passed, total: run.total, byCategory: run.byCategory, failed: run.results.filter((r) => !r.pass).map(strip) };
}
write(join(out, "eval-report.json"), report);
write(join(out, "policy-report.json"), checkAll(governance));

const csv = (s) => `"${String(s).replace(/"/g, '""')}"`;
write(join(root, "copilot-studio", "testset-import.csv"),
  "Question,Expected response\n" + testset.cases.map((c) => `${csv(c.question)},${csv(c.expectedResponse)}`).join("\n") + "\n");

for (const [id, r] of Object.entries(report)) console.log(`${id} ${r.label}: ${r.passed}/${r.total}`, r.failed.map((f) => `${f.id} (${f.reasons.join("; ")})`));
