// Runs the test set (tests/testset.json) against the agent simulator and scores each case.
// Mirrors how Copilot Studio agent evaluation is used in this case: expected behaviour, expected source
// ("tool use"/knowledge used), keywords that must and must not appear ("keyword match").

import { respond } from "./agent.mjs";

export function scoreCase(testCase, response) {
  const exp = testCase.expected;
  const reasons = [];
  if (response.behaviour !== exp.behaviour) reasons.push(`gedrag ${response.behaviour}, verwacht ${exp.behaviour}`);
  if (exp.source) {
    const hit = response.citations.some((c) => c.id === exp.source || c.doc === exp.source);
    if (!hit) {
      const got = response.citations.map((c) => c.id).join(", ") || "geen bron";
      reasons.push(`bron ${got}, verwacht ${exp.source}`);
    }
  }
  const text = response.text.toLowerCase();
  for (const word of exp.mustContain ?? []) if (!text.includes(word.toLowerCase())) reasons.push(`mist "${word}"`);
  for (const word of exp.mustNotContain ?? []) if (text.includes(word.toLowerCase())) reasons.push(`bevat "${word}"`);
  if (exp.approvers) {
    const got = (response.tool?.approvers ?? []).join("+");
    if (got !== exp.approvers.join("+")) reasons.push(`goedkeurders ${got || "geen"}, verwacht ${exp.approvers.join("+")}`);
  }
  return { id: testCase.id, pass: reasons.length === 0, reasons };
}

export function runTestset(testset, { chunks, config }) {
  const results = testset.cases.map((tc) => {
    const response = respond(tc.question, { chunks, config });
    return { ...scoreCase(tc, response), category: tc.category, question: tc.question, response };
  });
  const passed = results.filter((r) => r.pass).length;
  const byCategory = {};
  for (const r of results) {
    byCategory[r.category] ??= { passed: 0, total: 0 };
    byCategory[r.category].total += 1;
    if (r.pass) byCategory[r.category].passed += 1;
  }
  return { config: config.id, passed, total: results.length, byCategory, results };
}
