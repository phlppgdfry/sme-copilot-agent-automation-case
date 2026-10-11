// Governance check: every Power Platform solution (agent or flow) is tested against the governance
// package (docs/07-govern/governance-pakket.md) before it may move to test or production.
// Input: governance/environments.json, governance/dlp-policies.json, governance/solutions/*.json.
// The same module runs in CI (tests/policy.test.mjs) and in the demo (Governance tab).

const SHARED_STAGES = new Set(["test", "productie", "in gebruik"]);
const isShared = (s) => SHARED_STAGES.has(s.stage);

export const RULES = [
  { id: "GOV-01", title: "Geen bedrijfs- en niet-bedrijfsconnectors samen", why: "DLP: bedrijfsdata mag niet naar een niet-bedrijfsconnector stromen." },
  { id: "GOV-02", title: "Geen geblokkeerde connectors", why: "DLP: deze connectors zijn in deze environment niet toegestaan." },
  { id: "GOV-03", title: "Gedeelde processen niet in Default of een developer environment", why: "Wat anderen nodig hebben, hoort in Test of Productie met ALM." },
  { id: "GOV-04", title: "Eigenaar is een serviceaccount zodra anderen ervan afhangen", why: "Vertrekt de maker, dan stopt de oplossing niet." },
  { id: "GOV-05", title: "Managed solution in test en productie", why: "Geen handmatige wijzigingen buiten dev; uitrol via de pipeline." },
  { id: "GOV-06", title: "Interne agent met Microsoft-authenticatie", why: "De agent antwoordt met de rechten van de gebruiker en is niet anoniem bereikbaar." },
  { id: "GOV-07", title: "Elke kennisbron heeft een eigenaar", why: "Een bron zonder eigenaar veroudert; de agent geeft dan foute antwoorden." },
  { id: "GOV-08", title: "Agent heeft een testset (≥20 vragen, ≥15% weigervragen, ≥95% geslaagd)", why: "Kwaliteit is een cijfer, geen gevoel." },
  { id: "GOV-09", title: "Configuratie via environment variables", why: "Dezelfde solution moet in dev, test en productie werken." },
  { id: "GOV-10", title: "Menselijke goedkeuring bij financiële acties", why: "Een agent boekt of betaalt niet zelf." },
];

function policyFor(environment, governance) {
  const envName = governance.environments.environments.find((e) => e.name === environment)?.name ?? environment;
  return governance.policies.policies.find((p) => p.appliesTo.includes(envName));
}

function groupOf(connector, policy) {
  if (policy.business.includes(connector)) return "business";
  if (policy.nonBusiness.includes(connector)) return "nonBusiness";
  if (policy.blocked.includes(connector)) return "blocked";
  return policy.default;
}

export function checkSolution(solution, governance) {
  const findings = [];
  const add = (rule, severity, message) => findings.push({ rule, severity, message });
  const env = governance.environments.environments.find((e) => e.name === solution.environment);
  const policy = policyFor(solution.environment, governance);
  const sev = isShared(solution) ? "error" : "warning";

  if (policy) {
    for (const flow of solution.flows ?? []) {
      const groups = new Map(flow.connectors.map((c) => [c, groupOf(c, policy)]));
      const blocked = [...groups].filter(([, g]) => g === "blocked").map(([c]) => c);
      if (blocked.length) add("GOV-02", "error", `${flow.name}: ${blocked.join(", ")} is geblokkeerd in ${policy.name}.`);
      const kinds = new Set([...groups.values()].filter((g) => g !== "blocked"));
      if (kinds.has("business") && kinds.has("nonBusiness")) {
        add("GOV-01", "error", `${flow.name}: mengt bedrijfs- en niet-bedrijfsconnectors (${policy.name}).`);
      }
    }
  }
  if (isShared(solution) && env && ["default", "developer"].includes(env.type)) {
    add("GOV-03", "error", `In gebruik door anderen maar staat in ${solution.environment} (${env.type}).`);
  }
  if (solution.stage === "productie" && env && env.type !== "production") {
    add("GOV-03", "error", `Productie hoort in een production environment, niet in ${solution.environment}.`);
  }
  if (isShared(solution) && solution.owner?.type !== "service-account") {
    add("GOV-04", "error", `Eigenaar is ${solution.owner?.id ?? "onbekend"}; zet een serviceaccount als eigenaar.`);
  }
  if (["test", "productie"].includes(solution.stage) && !solution.managed) {
    add("GOV-05", "error", "Unmanaged solution in test of productie.");
  }
  if (solution.kind === "agent") {
    if (solution.agent?.auth !== "microsoft") add("GOV-06", "error", `Authenticatie is "${solution.agent?.auth}", verwacht "microsoft".`);
    for (const k of solution.knowledge ?? []) {
      if (!k.owner) add("GOV-07", sev, `Kennisbron "${k.name}" heeft geen eigenaar.`);
    }
    const t = solution.testset;
    if (!t) add("GOV-08", sev, "Geen testset.");
    else {
      if (t.cases < 20) add("GOV-08", sev, `Testset heeft ${t.cases} vragen (minstens 20).`);
      if (t.refusalCases / t.cases < 0.15) add("GOV-08", sev, `Te weinig weigervragen (${t.refusalCases}/${t.cases}).`);
      if (t.lastRun && t.lastRun.passed / t.lastRun.total < 0.95) {
        add("GOV-08", sev, `Laatste run ${t.lastRun.passed}/${t.lastRun.total} (minstens 95%).`);
      }
    }
  }
  if ((solution.hardcodedUrls ?? []).length) {
    add("GOV-09", "warning", `Vaste URL in plaats van environment variable: ${solution.hardcodedUrls.join(", ")}.`);
  }
  for (const flow of solution.flows ?? []) {
    if (flow.writes && flow.finance && !flow.humanApproval) add("GOV-10", "error", `${flow.name}: financiële actie zonder menselijke goedkeuring.`);
  }

  const status = findings.some((f) => f.severity === "error") ? "block" : findings.length ? "warn" : "ok";
  return { name: solution.name, environment: solution.environment, stage: solution.stage, status, findings };
}

export function checkAll(governance) {
  return { rules: RULES, results: governance.solutions.map((s) => checkSolution(s, governance)) };
}
