
// =============================
// Main.js
// =============================

const themeToggle = document.getElementById("themeToggle");
const body = document.body;

// ===== Dark / Light Mode =====

// Load saved theme from localStorage
let currentTheme = localStorage.getItem("pc_theme") || "light";
applyTheme(currentTheme);

// Toggle theme on button click
themeToggle.addEventListener("click", () => {
  currentTheme = currentTheme === "light" ? "dark" : "light";
  applyTheme(currentTheme);
  localStorage.setItem("pc_theme", currentTheme);
});

function applyTheme(theme) {
  if (theme === "dark") {
    body.classList.remove("light-mode");
    body.classList.add("dark-mode");
    themeToggle.innerHTML = `<i class="bi bi-sun-fill"></i> Light`;
  } else {
    body.classList.remove("dark-mode");
    body.classList.add("light-mode");
    themeToggle.innerHTML = `<i class="bi bi-moon-stars"></i> Dark`;
  }
}

// ===== Capsule selection from Learn dropdown =====
learnSelector.addEventListener("change", () => {
  selectCapsule(learnSelector.value);
});

// ===== Initialize =====
renderLibrary();
populateLearnSelector();
updateAuthorMode();
updateLearnMode();
