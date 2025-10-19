
// ===============================
// Pocket Classroom - Main JS (Final SPA Ready)
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

// Capsule Storage
let capsules = JSON.parse(localStorage.getItem("pc_capsules_index")) || [];
let currentCapsule = capsules.length > 0 ? capsules[0] : null;

// ===============================
// SPA Section Control
// ===============================
function showSection(section) {
  librarySection.style.display = "none";
  authorSection.style.display = "none";
  learnSection.style.display = "none";
  section.style.display = "block";

  if (section === authorSection && typeof loadAuthorForm === "function") loadAuthorForm(currentCapsule);
  if (section === learnSection && typeof updateLearnMode === "function") updateLearnMode();
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

  if (typeof loadAuthorForm === "function") loadAuthorForm(currentCapsule);
  if (typeof populateLearnSelector === "function") populateLearnSelector();
  if (typeof updateLearnMode === "function") updateLearnMode();

  renderLibrary(); // همیشه Library بروزرسانی شود
}

function saveCapsule(capsule) {
  const index = capsules.findIndex(c => c.id === capsule.id);
  if (index > -1) capsules[index] = capsule;
  else capsules.push(capsule);
  saveCapsules();
  currentCapsule = capsule;
}

// ===============================
// Set Current Capsule
// ===============================
function setCurrentCapsule(id) {
  const capsule = capsules.find(c => c.id === id);
  if (capsule) {
    currentCapsule = capsule;
    if (typeof loadAuthorForm === "function") loadAuthorForm(currentCapsule);
    if (typeof updateLearnMode === "function") updateLearnMode();
  }
}

// ===============================
// Export / Import
// ===============================
const exportBtn = document.getElementById("exportBtn");
exportBtn.addEventListener("click", ()=>{
  const dataStr = JSON.stringify(capsules, null, 2);
  const blob = new Blob([dataStr], {type:"application/json"});
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "capsules.json";
  a.click();
  URL.revokeObjectURL(url);
});

const importBtn = document.getElementById("importBtn");
importBtn.addEventListener("click", ()=>{
  const input = document.createElement("input");
  input.type = "file";
  input.accept = ".json";
  input.addEventListener("change", e=>{
    const file = e.target.files[0];
    if(!file) return;
    const reader = new FileReader();
    reader.onload = ev=>{
      try {
        const imported = JSON.parse(ev.target.result);
        let importedCapsules = [];
        if(Array.isArray(imported)) importedCapsules = imported;
        else if(imported.capsules && Array.isArray(imported.capsules)) importedCapsules = imported.capsules;
        importedCapsules.forEach(c=>{
          if(!c.id) c.id = Date.now().toString() + Math.random();
          capsules.push(c);
        });
        currentCapsule = capsules[capsules.length-1];
        saveCapsules();
        alert("Capsules imported successfully!");
        showSection(authorSection);
      } catch(err){ alert("Invalid JSON file."); console.error(err); }
    };
    reader.readAsText(file);
  });
  input.click();
});

// ===============================
// Library Rendering
// ===============================
const capsuleGrid = document.getElementById("capsuleGrid");

function renderLibrary() {
  if (!capsuleGrid) return;
  capsuleGrid.innerHTML = "";

  if (capsules.length === 0) {
    capsuleGrid.innerHTML = `<p class="text-muted">No capsules yet. Create one in Author section.</p>`;
    return;
  }

  capsules.forEach(c => {
    const card = document.createElement("div");
    card.className = "card m-2 p-3 shadow-sm";

    card.innerHTML = `
      <h5>${c.title || "Untitled Capsule"}</h5>
      <p class="mb-2 text-secondary">${c.subject || "No subject"}</p>
      <div class="d-flex gap-2">
        <button class="btn btn-sm btn-primary edit-btn">Edit</button>
        <button class="btn btn-sm btn-success learn-btn">Learn</button>
        <button class="btn btn-sm btn-danger delete-btn">Delete</button>
      </div>
    `;

    card.querySelector(".edit-btn").addEventListener("click", () => {
      setCurrentCapsule(c.id);
      showSection(authorSection);
    });

    card.querySelector(".learn-btn").addEventListener("click", () => {
      setCurrentCapsule(c.id);
      showSection(learnSection);
    });

    card.querySelector(".delete-btn").addEventListener("click", () => {
      if (confirm("Delete this capsule?")) {
        capsules = capsules.filter(x => x.id !== c.id);
        saveCapsules();
      }
    });

    capsuleGrid.appendChild(card);
  });
}

// ===============================
// New Capsule
// ===============================
newCapsuleBtn.addEventListener("click", () => {
  const newCap = {
    id: Date.now().toString(),
    title: "",
    subject: "",
    level: "Beginner",
    description: "",
    notes: [],
    flashcards: [],
    quiz: []
  };
  capsules.push(newCap);
  currentCapsule = newCap;

  saveCapsules();       // Library بروزرسانی شود
  loadAuthorForm();     // فرم Author پر شود
  showSection(authorSection); // حتما Author نمایش داده شود
  window.scrollTo(0, 0); // Scroll به بالا
});

// ===============================
// Initial Load
// ===============================
document.addEventListener("DOMContentLoaded", ()=>{
  loadTheme();

  capsules = JSON.parse(localStorage.getItem("pc_capsules_index")) || [];
  if (capsules.length > 0 && !currentCapsule) currentCapsule = capsules[0];

  renderLibrary();

  const hash = window.location.hash;
  if (hash === "#author") showSection(authorSection);
  else if (hash === "#learn") showSection(learnSection);
  else showSection(librarySection);
});
