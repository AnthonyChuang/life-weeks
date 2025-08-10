import { YEARS, WEEKS_PER_YEAR } from "./constants.js";
export function idx(r, c) {
  return r * WEEKS_PER_YEAR + c;
}
export function weeksBetween(d1, d2) {
  const ms = 7 * 24 * 60 * 60 * 1000;
  return Math.floor((d2 - d1) / ms);
}
export function clamp(n, lo, hi) {
  return Math.max(lo, Math.min(hi, n));
}
export function formatAge(bISO) {
  if (!bISO) return "Age: —";
  const b = new Date(bISO);
  const now = new Date();
  let years = now.getFullYear() - b.getFullYear();
  const had =
    now.getMonth() > b.getMonth() ||
    (now.getMonth() === b.getMonth() && now.getDate() >= b.getDate());
  if (!had) years -= 1;
  return `Age: ${Math.max(0, years)}`;
}
export function renderYearLabels(bISO) {
  const labels = [];
  for (let r = 0; r < YEARS; r++) {
    let label = `Age ${r}`;
    if (bISO) {
      const y = new Date(bISO).getFullYear() + r;
      label = `${y} (Age ${r})`;
    }
    labels.push(label);
  }
  return labels;
}
export function applyCellToEl(el, data) {
  el.classList.remove("past", "event");
  el.removeAttribute("title");
  if (data.state === "past") {
    el.classList.add("past");
  } else if (data.state === "event") {
    el.classList.add("event");
    if (data.text) el.title = data.text;
  }
}
