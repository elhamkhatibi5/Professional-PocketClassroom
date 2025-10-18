
// ==============================
// Pocket Classroom - main.js
// ==============================

// Sections
const librarySection = document.getElementById("library");
const authorSection = document.getElementById("author");
const learnSection = document.getElementById("learn");

// Navbar links
const navLinks = document.querySelectorAll(".nav-link");

// Theme toggle
const themeToggle = document.getElementById("themeToggle");
const body = document.body;

// ==============================
// Capsules Array + currentCapsule
// ==============================
let capsules = JSON.parse(localStorage.getItem("pc_capsules")) || [];
let lastCapsuleId = localStorage.getItem("pc_lastCapsule");
let currentCapsule = lastCapsuleId 
    ? capsules.find(c => c.id === lastCapsuleId) || capsules[0] 
    : capsules[0] || null;

// ==============================
// Generate Unique ID
// ==============================
function generateId() {
  return '_' + Math.random().toString(36).substr(2, 9);
}

// ==============================
// SPA Section Control
// ==============================
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

// Navbar link click
navLinks.forEach(link => {
  link.addEventListener("click", e => {
    e.preventDefault();
    const target = link.getAttribute("href");
    if (target === "#library") showSection(librarySection);
    else if (target === "#author") showSection(authorSection);
    else if (target === "#learn") showSection(learnSection);
  });
});

// ==============================
// Dark / Light Mode
// ==============================
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

// ==============================
// Save / Load Capsules
// ==============================
function saveCapsules() {
  localStorage.setItem("pc_capsules", JSON.stringify(capsules));
}

function saveCapsule(capsule) {
  const index = capsules.findIndex(c => c.id === capsule.id);
  if (index > -1) capsules[index] = capsule;
  else capsules.push(capsule);
  saveCapsules();
  currentCapsule = capsule;
  localStorage.setItem("pc_lastCapsule", capsule.id);
}

// ==============================
// Select Capsule
// ==============================
function selectCapsule(capsule) {
  currentCapsule = capsule;
  localStorage.setItem("pc_lastCapsule", capsule.id);
  if (typeof loadAuthorForm === "function") loadAuthorForm();
  if (typeof updateLearnMode === "function") updateLearnMode();
}

// ==============================
// Create New Capsule
// ==============================
function createNewCapsule() {
  const capsule = {
    id: generateId(),
    title: '',
    subject: '',
    level: 'Beginner',
    description: '',
    notes: [],
    flashcards: [],
    quiz: []
  };
  capsules.push(capsule);
  currentCapsule = capsule;
  saveCapsules();
  localStorage.setItem("pc_lastCapsule", capsule.id);
  if (typeof loadAuthorForm === "function") loadAuthorForm();
  if (typeof updateLearnMode === "function") updateLearnMode();
}

// ==============================
// Initial Load
// ==============================
document.addEventListener("DOMContentLoaded", () => {
  // Show last selected section based on hash
  const hash = window.location.hash;
  if (hash === "#author") showSection(authorSection, false);
  else if (hash === "#learn") showSection(learnSection, false);
  else showSection(librarySection, false);

  // Load Theme
  loadTheme();

  // Ensure currentCapsule is set
  if (!currentCapsule && capsules.length > 0) currentCapsule = capsules[0];

  // Load Author Form & Learn Mode
  if (typeof loadAuthorForm === "function") loadAuthorForm();
  if (typeof updateLearnMode === "function") updateLearnMode();
});
