import { save } from "./storage.js";
import { cells } from "./state.js";
const boardWrap = document.getElementById("boardWrap");
let popoverEl = null;
function ensurePopover() {
  if (popoverEl) return popoverEl;
  popoverEl = document.createElement("div");
  popoverEl.className = "note-popover";
  popoverEl.innerHTML = `<h3>Event note</h3><textarea id="noteInput" placeholder="Add a short note..."></textarea><div class="note-actions"><button type="button" id="cancelNote">Cancel</button><button type="button" id="saveNote">Save</button></div>`;
  boardWrap.appendChild(popoverEl);
  return popoverEl;
}
function closePopover() {
  if (!popoverEl) return;
  popoverEl.style.display = "none";
  popoverEl.dataset.index = "";
  document.removeEventListener("keydown", escClose);
  document.removeEventListener("click", outsideClick, true);
}
function escClose(e) {
  if (e.key === "Escape") closePopover();
}
function outsideClick(e) {
  if (!popoverEl) return;
  if (!popoverEl.contains(e.target)) closePopover();
}
export function setNote(i, text) {
  cells[i].state = "event";
  cells[i].text = (text || "").trim();
  save();
}
export function openNoteEditor(i, anchorEl) {
  const pop = ensurePopover();
  pop.style.display = "block";
  pop.dataset.index = String(i);
  const ta = pop.querySelector("#noteInput");
  ta.value = cells[i].text || "";
  ta.focus();
  ta.select();
  const wrapRect = boardWrap.getBoundingClientRect();
  const a = anchorEl.getBoundingClientRect();
  let left = a.right - wrapRect.left + 8 + boardWrap.scrollLeft;
  let top = a.top - wrapRect.top - 10 + boardWrap.scrollTop;
  left = Math.max(
    8 + boardWrap.scrollLeft,
    Math.min(left, boardWrap.scrollWidth - 340)
  );
  top = Math.max(
    8 + boardWrap.scrollTop,
    Math.min(top, boardWrap.scrollHeight - 140)
  );
  pop.style.left = left + "px";
  pop.style.top = top + "px";
  const saveBtn = pop.querySelector("#saveNote");
  const cancelBtn = pop.querySelector("#cancelNote");
  saveBtn.onclick = () => {
    setNote(i, ta.value);
    anchorEl && (anchorEl.title = cells[i].text || "");
    closePopover();
  };
  cancelBtn.onclick = () => closePopover();
  document.addEventListener("keydown", escClose);
  document.addEventListener("click", outsideClick, true);
}
