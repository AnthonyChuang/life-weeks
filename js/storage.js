import { STORAGE_KEY } from "./constants.js";
import {
  TEST_MODE,
  cells,
  birthdateISO,
  setBirthdate,
  setCells,
} from "./state.js";
export function save() {
  if (TEST_MODE) return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ birthdateISO, cells }));
  } catch (e) {
    console.warn("Save failed", e);
  }
}
export function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed?.cells)) {
      setCells(
        parsed.cells.map((x) => ({
          state: x.state || "blank",
          text: x.text || "",
        }))
      );
    }
    if (parsed?.birthdateISO) setBirthdate(parsed.birthdateISO);
  } catch (e) {
    console.warn("Load failed", e);
  }
}
