
// ===============================
// Pocket Classroom - Main JS (Author & Learn Ready)
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
// SPA Section Control
// ===============================
function showSection(section) {
    librarySection.style.display = "none";
    authorSection.style.display = "none";
    learnSection.style.display = "none";
    section.style.display = "block";

    localStorage.setItem("pc_lastSection", section.id);

    if (section === authorSection && typeof loadAuthorForm === "function") loadAuthorForm(currentCapsule);

    if (section === learnSection && typeof updateLearnMode === "function") {
        capsules = JSON.parse(localStorage.getItem("pc_capsules_index")) || [];
        currentCapsule = capsules.find(c => c.id === currentCapsule?.id) || capsules[0];

        if (!currentCapsule.flashcards) currentCapsule.flashcards = [];
        if (!currentCapsule.quiz) currentCapsule.quiz = [];

        populateLearnSelector();
        const learnSelector = document.getElementById("learnSelector");
        if (learnSelector) learnSelector.value = currentCapsule.id;

        updateLearnMode();
    }
}

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
}

function saveCapsule(capsule) {
    const index = capsules.findIndex(c => c.id === capsule.id);
    if (index > -1) capsules[index] = capsule;
    else capsules.push(capsule);
    saveCapsules();
    currentCapsule = capsule;
}

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
    const dataStr = JSON.stringify({capsules}, null, 2);
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
                if(imported.capsules && Array.isArray(imported.capsules)){
                    imported.capsules.forEach(c=>{
                        if(!c.id) c.id = Date.now().toString() + Math.random();
                        capsules.push(c);
                    });
                    saveCapsules();
                    alert("Capsules imported successfully!");
                }
            } catch(err){ alert("Invalid JSON file."); }
        };
        reader.readAsText(file);
    });
    input.click();
});

// ===============================
// Learn Mode Renderer
// ===============================
let currentCardIndex = 0;
let showingAnswer = false;

function updateLearnMode() {
    if (!currentCapsule) return;

    // Notes
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

    // Flashcards
    const flashcardDisplay = document.getElementById("flashcardDisplay");
    const prevCardBtn = document.getElementById("prevCardBtn");
    const nextCardBtn = document.getElementById("nextCardBtn");
    const flipCardBtn = document.getElementById("flipCardBtn");

    function showFlashcard() {
        if (!(currentCapsule.flashcards && currentCapsule.flashcards.length)) {
            if(flashcardDisplay) flashcardDisplay.innerText = "No flashcards";
            return;
        }
        const card = currentCapsule.flashcards[currentCardIndex];
        if(flashcardDisplay) flashcardDisplay.innerText = showingAnswer ? card.answer : card.question;
    }

    showFlashcard();

    if(flipCardBtn) flipCardBtn.onclick = () => { showingAnswer = !showingAnswer; showFlashcard(); };
    if(prevCardBtn) prevCardBtn.onclick = () => {
        if (!(currentCapsule.flashcards && currentCapsule.flashcards.length)) return;
        currentCardIndex = (currentCardIndex - 1 + currentCapsule.flashcards.length) % currentCapsule.flashcards.length;
        showingAnswer = false;
        showFlashcard();
    };
    if(nextCardBtn) nextCardBtn.onclick = () => {
        if (!(currentCapsule.flashcards && currentCapsule.flashcards.length)) return;
        currentCardIndex = (currentCardIndex + 1) % currentCapsule.flashcards.length;
        showingAnswer = false;
        showFlashcard();
    };

    // Quiz
    const quizContainer = document.getElementById("quizContainer");
    if(quizContainer) {
        quizContainer.innerHTML = "";
        if (!(currentCapsule.quiz && currentCapsule.quiz.length)) {
            quizContainer.innerHTML = "<p>No quiz questions</p>";
        } else {
            currentCapsule.quiz.forEach((q, idx) => {
                const card = document.createElement("div");
                card.className = "mb-2";
                card.innerHTML = `<p><strong>Q${idx+1}:</strong> ${q.question}</p>`;
                const div = document.createElement("div");

                (q.choices || []).forEach((choice, i) => {
                    const btn = document.createElement("button");
                    btn.className = "btn btn-outline-primary btn-sm me-2";
                    btn.innerText = choice;
                    btn.onclick = () => {
                        // Correct / Wrong coloring
                        const allBtns = div.querySelectorAll("button");
                        allBtns.forEach(b => b.classList.remove("btn-success","btn-danger"));
                        if (i === q.answer) btn.classList.add("btn-success");
                        else btn.classList.add("btn-danger");
                    };
                    div.appendChild(btn);
                });

                card.appendChild(div);
                quizContainer.appendChild(card);
            });
        }
    }

    // Selector
    populateLearnSelector();
}

// ===============================
// Populate Learn Selector
// ===============================
function populateLearnSelector() {
    const learnSelector = document.getElementById("learnSelector");
    if(!learnSelector) return;
    learnSelector.innerHTML = "";
    capsules.forEach(c=>{
        const option = document.createElement("option");
        option.value = c.id;
        option.textContent = c.title;
        learnSelector.appendChild(option);
    });
    if(currentCapsule) learnSelector.value = currentCapsule.id;

    learnSelector.onchange = ()=>{
        const id = learnSelector.value;
        currentCapsule = capsules.find(c => c.id === id);
        updateLearnMode();
    };
}

// ===============================
// Initial Load
// ===============================
document.addEventListener("DOMContentLoaded", ()=>{
    loadTheme();

    const lastSectionId = localStorage.getItem("pc_lastSection");
    if (lastSectionId === "author") showSection(authorSection);
    else if (lastSectionId === "learn") showSection(learnSection);
    else showSection(librarySection);

    capsules = JSON.parse(localStorage.getItem("pc_capsules_index")) || [];
    if (capsules.length > 0 && !currentCapsule) currentCapsule = capsules[0];
});
