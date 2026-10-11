// Business rules of the agent flow "Onkostennota indienen" (docs/05-build/onkostennota-flow.md).
import { test } from "node:test";
import assert from "node:assert/strict";
import { approversFor, validateClaim, simulateRun, isDuplicate } from "../site/assets/lib/flow.mjs";

const claim = { bedrag: 42, datum: "2026-10-08", werf: "Kerkstraat 12", bewijsstuk: "foto.jpg" };

test("up to €250: site manager only; above: site manager + finance", () => {
  assert.deepEqual(approversFor(250), ["ploegbaas"]);
  assert.deepEqual(approversFor(250.01), ["ploegbaas", "boekhouding"]);
});

test("older than 30 days: finance must agree as well", () => {
  assert.deepEqual(approversFor(20, { ageDays: 31 }), ["ploegbaas", "boekhouding"]);
});

test("no receipt, no claim", () => {
  const r = validateClaim({ ...claim, bewijsstuk: null });
  assert.equal(r.ok, false);
  assert.match(r.errors.join(" "), /kasticket/);
});

test("fuel is refused: it goes through the fuel card", () => {
  assert.equal(validateClaim({ ...claim, categorie: "brandstof" }).ok, false);
});

test("a meal above €18 is a warning, not a block", () => {
  const r = validateClaim({ ...claim, bedrag: 24, categorie: "maaltijd" });
  assert.equal(r.ok, true);
  assert.equal(r.warnings.length, 1);
});

test("no decision after 5 working days escalates to finance", () => {
  assert.equal(simulateRun(claim, { ploegbaas: "timeout" }).status, "escalated");
});

test("a project code is not required: site address or customer name is enough", () => {
  assert.equal(validateClaim(claim).ok, true);
});

test("the same claim twice within 10 minutes is a duplicate; an hour later it is not", () => {
  const first = { ...claim, medewerker: "t-017", ingediendOp: Date.parse("2026-10-08T15:00:00Z") };
  const again = { ...first, werf: " kerkstraat 12 ", ingediendOp: first.ingediendOp + 4 * 60_000 };
  assert.equal(isDuplicate(again, [first]), true);
  assert.equal(isDuplicate({ ...again, ingediendOp: first.ingediendOp + 60 * 60_000 }, [first]), false);
});
