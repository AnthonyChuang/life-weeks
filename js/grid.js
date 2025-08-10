import { TOTAL, LONG_PRESS_MS } from "./constants.js";
import { save } from "./storage.js";
import { cells, birthdateISO } from "./state.js";
import { clamp, weeksBetween, applyCellToEl } from "./ui.js";
import { openNoteEditor } from "./notes.js";
export function cycleState(i) {
  const order = ["blank", "past", "event"];
  const cur = cells[i].state || "blank";
  const next = order[(order.indexOf(cur) + 1) % order.length];
  cells[i].state = next;
  if (next !== "event") {
    cells[i].text = "";
  }
  save();
  return cells[i];
}
export function editEvent(i, anchorEl) {
  if (cells[i].state !== "event") cells[i].state = "event";
  openNoteEditor(i, anchorEl);
}
export function markSkipNextClick(el) {
  el.dataset.skipNextClick = "1";
}
export function shouldSkipClick(el) {
  if (el.dataset && el.dataset.skipNextClick === "1") {
    delete el.dataset.skipNextClick;
    return true;
  }
  return false;
}
export function recomputePast(fillAll = false) {
  if (!birthdateISO) return;
  const b = new Date(birthdateISO);
  const now = new Date();
  const livedWeeks = clamp(weeksBetween(b, now), 0, TOTAL);
  for (let i = 0; i < TOTAL; i++) {
    if (i < livedWeeks) {
      if (cells[i].state === "blank" || fillAll) {
        if (cells[i].state !== "event") {
          cells[i].state = "past";
          cells[i].text = "";
        }
      }
    } else if (fillAll) {
      if (cells[i].state === "past") cells[i].state = "blank";
    }
  }
  save();
}
