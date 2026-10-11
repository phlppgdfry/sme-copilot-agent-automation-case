// Use-case scoring (docs/03-prioritise/use-case-portfolio.md):
//   value       = mean(frequency, time saved, pain)          1–5
//   feasibility = mean(data quality, owner, licence fit)     1–5
//   risk        = impact of a wrong answer or action          1–5 (5 = worst)
//   score       = weights.value·value + weights.feasibility·feasibility + weights.risk·(6 − risk), on a 0–100 scale
// "niet-doen" stays visible with its reason but is never ranked: saying no is part of the advice.
export const DEFAULT_WEIGHTS = { value: 0.4, feasibility: 0.35, risk: 0.25 };

const mean = (o) => Object.values(o).reduce((a, b) => a + b, 0) / Object.values(o).length;

export function scoreUseCase(uc, weights = DEFAULT_WEIGHTS) {
  const value = mean(uc.waarde);
  const feasibility = mean(uc.haalbaarheid);
  const sum = weights.value + weights.feasibility + weights.risk || 1;
  const raw = (weights.value * value + weights.feasibility * feasibility + weights.risk * (6 - uc.risico)) / sum;
  return { value, feasibility, score: Math.round(((raw - 1) / 4) * 100) };
}

export function rank(useCases, weights = DEFAULT_WEIGHTS) {
  return useCases
    .map((uc) => ({ ...uc, ...scoreUseCase(uc, weights) }))
    .sort((a, b) => (a.beslissing === "niet-doen") - (b.beslissing === "niet-doen") || b.score - a.score);
}
