// ===============================
// Pocket Classroom - Main JS (Fixed Learn Mode & Author Sync)
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
let currentCapsule = null;

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
    if (target === "#library") { showSection(librarySection); location.hash = "#library"; }
    else if (target === "#author") { showSection(authorSection); location.hash = "#author"; }
    else if (target === "#learn") { showSection(learnSection); location.hash = "#learn"; }
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
  if (currentCapsule) localStorage.setItem("pc_current_capsule", currentCapsule.id);

  if (typeof loadAuthorForm === "function") loadAuthorForm(currentCapsule);
  if (typeof populateLearnSelector === "function") populateLearnSelector();
  if (typeof updateLearnMode === "function") updateLearnMode();
}

function saveCapsule(capsule) {
  const index = capsules.findIndex(c => c.id === capsule.id);
  if (index > -1) capsules[index] = capsule;
  else capsules.push(capsule);
  currentCapsule = capsule;
  saveCapsules();
}

// ===============================
// Set Current Capsule
// ===============================
function setCurrentCapsule(id) {
  const capsule = capsules.find(c => c.id === id);
  if (capsule) {
    currentCapsule = capsule;
    localStorage.setItem("pc_current_capsule", capsule.id);
    if (typeof loadAuthorForm === "function") loadAuthorForm(currentCapsule);
    if (typeof updateLearnMode === "function") updateLearnMode();
  }
}

// ===============================
// Export / Import
// ===============================
const exportBtn = document.getElementById("exportBtn");
exportBtn.addEventListener("click", () => {
  const dataStr = JSON.stringify({ capsules }, null, 2);
  const blob = new Blob([dataStr], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "capsules.json";
  a.click();
  URL.revokeObjectURL(url);
});

const importBtn = document.getElementById("importBtn");
importBtn.addEventListener("click", () => {
  const input = document.createElement("input");
  input.type = "file";
  input.accept = ".json";
  input.addEventListener("change", e => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
      try {
        const imported = JSON.parse(ev.target.result);
        if (imported.capsules && Array.isArray(imported.capsules)) {
          imported.capsules.forEach(c => {
            if (!c.id) c.id = Date.now().toString() + Math.random();
            capsules.push(c);
          });
          saveCapsules();
          alert("Capsules imported successfully!");
        }
      } catch (err) { alert("Invalid JSON file."); }
    };
    reader.readAsText(file);
  });
  input.click();
});

// ===============================
// Learn Mode Renderer
// ===============================
function updateLearnMode() {
  if (!currentCapsule) return;

  // --- Notes ---
  const notesList = document.getElementById("notesList");
  if (notesList) {
    notesList.innerHTML = "";
    (currentCapsule.notes || []).forEach(note => {
      const li = document.createElement("li");
      li.className = "list-group-item";
      li.innerText = note;
      notesList.appendChild(li);
    });
  }

  // --- Flashcards ---
  const flashcardDisplay = document.getElementById("flashcardDisplay");
  const prevCardBtn = document.getElementById("prevCardBtn");
  const nextCardBtn = document.getElementById("nextCardBtn");
  const flipCardBtn = document.getElementById("flipCardBtn");

  let currentCardIndex = 0;
  let showingAnswer = false;

  function showFlashcard() {
    if (!(currentCapsule.flashcards && currentCapsule.flashcards.length)) {
      if (flashcardDisplay) flashcardDisplay.innerText = "No flashcards";
      return;
    }
    const card = currentCapsule.flashcards[currentCardIndex];
    if (flashcardDisplay) flashcardDisplay.innerText = showingAnswer ? card.back : card.front;
  }

  showFlashcard();

  if (flipCardBtn) flipCardBtn.onclick = () => { showingAnswer = !showingAnswer; showFlashcard(); };
  if (prevCardBtn) prevCardBtn.onclick = () => {
    if (!currentCapsule.flashcards.length) return;
    currentCardIndex = (currentCardIndex - 1 + currentCapsule.flashcards.length) % currentCapsule.flashcards.length;
    showingAnswer = false;
    showFlashcard();
  };
  if (nextCardBtn) nextCardBtn.onclick = () => {
    if (!currentCapsule.flashcards.length) return;
    currentCardIndex = (currentCardIndex + 1) % currentCapsule.flashcards.length;
    showingAnswer = false;
    showFlashcard();
  };

  // --- Quiz ---
  const quizContainer = document.getElementById("quizContainer");
  if (quizContainer) {
    quizContainer.innerHTML = "";

    if (!(currentCapsule.quiz && currentCapsule.quiz.length)) {
      quizContainer.innerHTML = "<p>No quiz questions</p>";
    } else {
      currentCapsule.quiz.forEach((q, i) => {
        const qDiv = document.createElement("div");
        qDiv.className = "mb-3 p-2 border rounded";

        const qTitle = document.createElement("p");
        qTitle.innerHTML = `<strong>Q${i + 1}:</strong> ${q.question}`;
        qDiv.appendChild(qTitle);

        const btnDiv = document.createElement("div");
        (q.choices || []).forEach((choice, j) => {
          const btn = document.createElement("button");
          btn.className = "btn btn-outline-primary btn-sm me-2 mb-1";
          btn.innerText = choice;
          btn.onclick = () => alert(choice === q.choices[q.answer] ? "✅ Correct!" : `❌ Wrong! Answer: ${q.choices[q.answer]}`);
          btnDiv.appendChild(btn);
        });
        qDiv.appendChild(btnDiv);

        if (q.explanation) {
          const expl = document.createElement("p");
          expl.className = "mt-1 text-muted";
          expl.innerText = `Explanation: ${q.explanation}`;
          qDiv.appendChild(expl);
        }

        quizContainer.appendChild(qDiv);
      });
    }
  }
}

// ===============================
// Initial Load
// ===============================
document.addEventListener("DOMContentLoaded", () => {
  loadTheme();

  // Load capsules
  capsules = JSON.parse(localStorage.getItem("pc_capsules_index")) || [];

  // Restore last opened capsule
  const lastId = localStorage.getItem("pc_current_capsule");
  if (lastId) currentCapsule = capsules.find(c => c.id === lastId);
  if (!currentCapsule && capsules.length > 0) currentCapsule = capsules[0];

  // Ensure Learn Mode updates AFTER loading data
  if (typeof populateLearnSelector === "function") populateLearnSelector();
  if (typeof updateLearnMode === "function") updateLearnMode();

  // Restore section by hash
  const hash = window.location.hash;
  if (hash === "#author") showSection(authorSection);
  else if (hash === "#learn") showSection(learnSection);
  else showSection(librarySection);
});
