import { YEARS, WEEKS_PER_YEAR } from "./constants.js";
import { save, load } from "./storage.js";
import { cells, birthdateISO, setBirthdate } from "./state.js";
import { idx, formatAge, renderYearLabels, applyCellToEl } from "./ui.js";
import {
  cycleState,
  editEvent,
  markSkipNextClick,
  shouldSkipClick,
  recomputePast,
} from "./grid.js";
import "./tests.js";
import { setupThemeToggle } from "./theme.js";

const board = document.getElementById("board");
const birthInput = document.getElementById("birthdate");
const applyBirthBtn = document.getElementById("applyBirth");
const clearPastBtn = document.getElementById("clearPast");
const resetAllBtn = document.getElementById("resetAll");
const ageInfo = document.getElementById("ageInfo");

function refreshAgeInfo() {
  ageInfo.textContent = formatAge(birthdateISO);
}

// Add event listener for Apply & Fill Past button
applyBirthBtn.addEventListener("click", () => {
  const val = birthInput.value;
  if (!val) return;
  setBirthdate(val);
  refreshAgeInfo();
  recomputePast(true);
  buildBoard();
  save();
});

// Add event listener for Clear Past button
clearPastBtn.addEventListener("click", () => {
  recomputePast(true); // fillAll = true
  buildBoard();
  refreshAgeInfo();
  save();
});

// Add event listener for Reset All button
resetAllBtn.addEventListener("click", () => {
  if (
    !confirm(
      "Are you sure you want to reset everything? This will clear all data."
    )
  )
    return;
  localStorage.clear();
  location.reload();
});

// Initialize app on page load
load();
if (birthdateISO) birthInput.value = birthdateISO;
refreshAgeInfo();
buildBoard();
setupThemeToggle();

export function buildBoard() {
  board.innerHTML = "";
  const labels = renderYearLabels(birthdateISO);
  for (let r = 0; r < YEARS; r++) {
    const yl = document.createElement("div");
    yl.className = "year-label";
    yl.textContent = labels[r];
    board.appendChild(yl);
    for (let c = 0; c < WEEKS_PER_YEAR; c++) {
      const i = idx(r, c);
      const el = document.createElement("button");
      el.className = "cell";
      el.setAttribute("aria-label", `Year ${r}, Week ${c + 1}`);
      applyCellToEl(el, cells[i]);
      el.addEventListener("click", () => {
        if (shouldSkipClick(el)) return;
        const updated = cycleState(i);
        applyCellToEl(el, updated);
      });
      el.addEventListener("dblclick", () => {
        editEvent(i, el);
        applyCellToEl(el, cells[i]);
      });
      el.addEventListener("contextmenu", (e) => {
        e.preventDefault();
        editEvent(i, el);
        applyCellToEl(el, cells[i]);
      });
      // Long-press opens note editor & suppresses next click
      let pressTimer = null;
      el.addEventListener("mousedown", (e) => {
        if (e.button !== 0) return; // Only left mouse
        pressTimer = setTimeout(() => {
          editEvent(i, el);
          applyCellToEl(el, cells[i]);
          markSkipNextClick(el);
        }, 500);
      });
      el.addEventListener("mouseup", () => {
        clearTimeout(pressTimer);
      });
      el.addEventListener("mouseleave", () => {
        clearTimeout(pressTimer);
      });
      board.appendChild(el);
    }
  }
}
