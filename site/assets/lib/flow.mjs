// Agent flow "Onkostennota indienen" — the business rules of docs/05-build/onkostennota-flow.md as code,
// so the demo, the test set and the documentation use one source. Simulated: no SharePoint, Teams or Dataverse.

export const RULES = {
  approvalLimitFinance: 250, // > €250 per claim: also finance (onkostenbeleid 2026, "Goedkeuring")
  deadlineDays: 30, // later than 30 days: finance must agree (onkostenbeleid 2026, "Termijn")
  mealMax: 18, // per site day > 10 h (onkostenbeleid 2026, "Maaltijden")
  reminderHour: 16, // one bundled reminder per day for site managers (ADR-003)
  escalateAfterDays: 5, // no decision after 5 working days → finance (ADR-003)
};

export function approversFor(amount, { ageDays = 0 } = {}) {
  const approvers = ["ploegbaas"];
  if (amount > RULES.approvalLimitFinance || ageDays > RULES.deadlineDays) approvers.push("boekhouding");
  return approvers;
}

/** Validate a claim before it is submitted. Returns blocking errors and non-blocking warnings. */
export function validateClaim({ bedrag, datum, werf, bewijsstuk, categorie, ageDays = 0 }) {
  const errors = [];
  const warnings = [];
  if (!(bedrag > 0)) errors.push("Bedrag ontbreekt.");
  if (!datum) errors.push("Datum van de uitgave ontbreekt.");
  if (!werf) errors.push("Werfadres of klantnaam ontbreekt (projectcode is niet nodig).");
  if (!bewijsstuk) errors.push("Foto van het kasticket ontbreekt — zonder bewijsstuk geen terugbetaling.");
  if (categorie === "brandstof") errors.push("Brandstof loopt via de tankkaart, niet via een onkostennota.");
  if (categorie === "maaltijd" && bedrag > RULES.mealMax) warnings.push(`Maaltijd boven €${RULES.mealMax}: alleen €${RULES.mealMax} wordt terugbetaald.`);
  if (ageDays > RULES.deadlineDays) warnings.push(`Ouder dan ${RULES.deadlineDays} dagen: de boekhouding moet akkoord geven.`);
  return { ok: errors.length === 0, errors, warnings };
}

/** Same employee, amount, date and site within 10 minutes = the same claim submitted twice. */
export function isDuplicate(claim, existing, { windowMinutes = 10 } = {}) {
  return existing.some(
    (e) =>
      e.medewerker === claim.medewerker &&
      e.bedrag === claim.bedrag &&
      e.datum === claim.datum &&
      e.werf.trim().toLowerCase() === claim.werf.trim().toLowerCase() &&
      Math.abs(claim.ingediendOp - e.ingediendOp) <= windowMinutes * 60_000,
  );
}

/** Simulated run: the events that the real agent flow would produce (for the demo's event log). */
export function simulateRun(claim, decisions = {}) {
  const check = validateClaim(claim);
  const events = [{ at: "T+0", actor: "Brevan Assist", event: "Agent flow gestart: Onkostennota indienen" }];
  if (!check.ok) {
    events.push({ at: "T+0", actor: "Agent flow", event: `Geweigerd vóór indienen: ${check.errors.join(" ")}` });
    return { status: "rejected-input", events, check };
  }
  const approvers = approversFor(claim.bedrag, claim);
  events.push({ at: "T+0", actor: "Agent flow", event: `Rij aangemaakt in tabel Onkostennota's (status: Ingediend), bewijsstuk opgeslagen` });
  for (const w of check.warnings) events.push({ at: "T+0", actor: "Agent flow", event: `Waarschuwing: ${w}` });
  let status = "approved";
  for (const who of approvers) {
    events.push({ at: "T+0", actor: "Agent flow", event: `Goedkeuring gevraagd aan ${who} (Teams-kaart, gebundeld om ${RULES.reminderHour}u)` });
    const decision = decisions[who] ?? "approve";
    if (decision === "timeout") {
      events.push({ at: `T+${RULES.escalateAfterDays}d`, actor: "Agent flow", event: `Geen beslissing na ${RULES.escalateAfterDays} werkdagen → geëscaleerd naar boekhouding` });
      status = "escalated";
      break;
    }
    events.push({ at: "T+1d", actor: who, event: decision === "approve" ? "Goedgekeurd" : "Afgekeurd met reden" });
    if (decision !== "approve") {
      status = "rejected";
      break;
    }
  }
  events.push({
    at: "T+1d",
    actor: "Agent flow",
    event:
      status === "approved"
        ? "Status: Goedgekeurd → export naar boekhouding (terugbetaling met het loon van volgende maand); melding aan medewerker"
        : status === "rejected"
          ? "Status: Afgekeurd → melding met reden aan medewerker"
          : "Status: Geëscaleerd → taak voor boekhouding",
  });
  return { status, events, check, approvers };
}
