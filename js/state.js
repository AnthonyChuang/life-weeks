import { TOTAL } from "./constants.js";
export let TEST_MODE = false;
export let cells = Array.from({ length: TOTAL }, () => ({ state: "blank" }));
export let birthdateISO = null;
export function setBirthdate(val) {
  birthdateISO = val;
}
export function setCells(newCells) {
  cells = newCells;
}
