// Simple theme toggler for light/dark mode
export function setupThemeToggle() {
  const btn = document.createElement("button");
  btn.id = "themeToggle";
  btn.style.marginLeft = "8px";
  btn.style.padding = "8px 12px";
  btn.style.borderRadius = "10px";
  btn.style.border = "1px solid var(--border)";
  btn.style.background = "var(--panel)";
  btn.style.cursor = "pointer";
  btn.style.fontSize = "14px";
  // Detect initial mode
  let dark = document.body.classList.contains("dark");
  btn.textContent = dark ? "☀️ Light Mode" : "🌙 Dark Mode";
  btn.onclick = () => {
    dark = !dark;
    if (dark) {
      document.body.classList.add("dark");
      btn.textContent = "☀️ Light Mode";
    } else {
      document.body.classList.remove("dark");
      btn.textContent = "🌙 Dark Mode";
    }
  };
  // Insert into controls
  const controls = document.querySelector(".controls");
  if (controls) controls.appendChild(btn);
}
