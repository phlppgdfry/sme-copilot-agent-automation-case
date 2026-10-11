// Governance check (docs/07-govern/governance-pakket.md) on the three solutions in governance/solutions/.
import { test } from "node:test";
import assert from "node:assert/strict";
import { checkSolution, checkAll } from "../site/assets/lib/policy.mjs";
import { governance } from "./helpers.mjs";

const G = governance();
const byName = (n) => G.solutions.find((s) => s.name.startsWith(n));
const rules = (r) => r.findings.map((f) => `${f.rule}:${f.severity}`).sort();

test("Brevan Assist passes every rule", () => {
  assert.equal(checkSolution(byName("Brevan Assist"), G).status, "ok");
});

test("the timesheet flow is blocked: Gmail, Default environment, personal owner (+ hard-coded URL)", () => {
  const r = checkSolution(byName("Urenstaten"), G);
  assert.equal(r.status, "block");
  assert.deepEqual(rules(r), ["GOV-02:error", "GOV-03:error", "GOV-04:error", "GOV-09:warning"]);
});

test("the quote helper in a developer environment only gets warnings", () => {
  const r = checkSolution(byName("Offerte-helper"), G);
  assert.equal(r.status, "warn");
  assert.deepEqual(rules(r), ["GOV-07:warning", "GOV-08:warning"]);
});

test("the same gaps block the quote helper once it moves to test", () => {
  const moved = { ...byName("Offerte-helper"), environment: "Brevan-Test", stage: "test" };
  const r = checkSolution(moved, G);
  assert.equal(r.status, "block");
  assert.ok(rules(r).includes("GOV-04:error") && rules(r).includes("GOV-05:error") && rules(r).includes("GOV-08:error"));
});

test("a falling test score blocks Brevan Assist", () => {
  const worse = { ...byName("Brevan Assist"), testset: { cases: 40, refusalCases: 8, lastRun: { config: "v1", passed: 29, total: 40 } } };
  assert.deepEqual(rules(checkSolution(worse, G)), ["GOV-08:error"]);
});

test("mixing a business and a non-business connector is caught", () => {
  const s = byName("Brevan Assist");
  const mixed = { ...s, flows: [{ ...s.flows[0], connectors: [...s.flows[0].connectors, "MSN Weather"] }] };
  assert.deepEqual(rules(checkSolution(mixed, G)), ["GOV-01:error"]);
});

test("an expense flow without human approval is blocked", () => {
  const s = byName("Brevan Assist");
  const auto = { ...s, flows: [{ ...s.flows[0], humanApproval: false }] };
  assert.deepEqual(rules(checkSolution(auto, G)), ["GOV-10:error"]);
});

test("every rule is documented with a reason", () => {
  for (const r of checkAll(G).rules) assert.ok(r.why.length > 10, r.id);
});
