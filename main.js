
// ===============================
// Pocket Classroom - Main Script (Fixed Version)
// ===============================

// Sections
const librarySection = document.getElementById("library");
const authorSection = document.getElementById("author");
const learnSection = document.getElementById("learn");

// Navbar links
const navLinks = document.querySelectorAll(".nav-link");

// Theme toggle
const themeToggle = document.getElementById("themeToggle");
const body = document.body;

// ===============================
// Capsule Storage
// ===============================
let capsules = JSON.parse(localStorage.getItem("pc_capsules_index")) || [];
let currentCapsule = capsules.length > 0 ? capsules[0] : null;

// ===============================
// Section Control (SPA)
// ===============================
function showSection(section, saveHash = true) {
  librarySection.style.display = "none";
  authorSection.style.display = "none";
  learnSection.style.display = "none";
  section.style.display = "block";

  if (saveHash) {
    if (section === librarySection) window.location.hash = "#library";
    else if (section === authorSection) window.location.hash = "#author";
    else if (section === learnSection) window.location.hash = "#learn";
  }
}

// Navbar click
navLinks.forEach(link => {
  link.addEventListener("click", e => {
    e.preventDefault();
    const target = link.getAttribute("href");
    if (target === "#library") showSection(librarySection);
    else if (target === "#author") showSection(authorSection);
    else if (target === "#learn") showSection(learnSection);
  });
});

// ===============================
// Theme Handling
// ===============================
function loadTheme() {
  const saved = localStorage.getItem("pc_theme");
  if (saved) body.className = saved;
  updateThemeButton();
}

function toggleTheme() {
  if (body.classList.contains("light-mode")) body.className = "dark-mode";
  else body.className = "light-mode";
  localStorage.setItem("pc_theme", body.className);
  updateThemeButton();
}

function updateThemeButton() {
  themeToggle.innerHTML = body.classList.contains("light-mode")
    ? '<i class="bi bi-moon-stars"></i> Dark'
    : '<i class="bi bi-sun"></i> Light';
}

themeToggle.addEventListener("click", toggleTheme);

// ===============================
// Save / Load Capsules
// ===============================
function saveCapsules() {
  localStorage.setItem("pc_capsules_index", JSON.stringify(capsules));
}

function saveCapsule(capsule) {
  const index = capsules.findIndex(c => c.id === capsule.id);
  if (index > -1) capsules[index] = capsule;
  else capsules.push(capsule);
  saveCapsules();
  currentCapsule = capsule;
}

// ===============================
// Auto-load sample-capsule.json if empty
// ===============================
async function loadSampleCapsulesIfEmpty() {
  const stored = localStorage.getItem("pc_capsules_index");
  if (!stored || stored === "[]") {
    try {
      const res = await fetch("sample-capsule.json");
      const data = await res.json();

      if (data && Array.isArray(data.capsules)) {
        localStorage.setItem("pc_capsules_index", JSON.stringify(data.capsules));
        capsules = data.capsules;
        currentCapsule = capsules[0];
        console.log("✅ Loaded sample capsules successfully.");
      }
    } catch (err) {
      console.error("❌ Failed to load sample-capsule.json:", err);
    }
  }
}

// ===============================
// Initial Load
// ===============================
document.addEventListener("DOMContentLoaded", async () => {
  await loadSampleCapsulesIfEmpty();

  const hash = window.location.hash;
  if (hash === "#author") showSection(authorSection, false);
  else if (hash === "#learn") showSection(learnSection, false);
  else showSection(librarySection, false);

  loadTheme();

  // Update capsule references after loading
  capsules = JSON.parse(localStorage.getItem("pc_capsules_index")) || [];
  if (capsules.length > 0) currentCapsule = capsules[0];

  // Trigger submodules if they exist
  if (typeof loadAuthorForm === "function") loadAuthorForm();
  if (typeof updateLearnMode === "function") updateLearnMode();
});
