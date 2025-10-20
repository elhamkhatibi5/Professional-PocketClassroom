
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

    // ذخیره آخرین بخش انتخاب شده
    localStorage.setItem("pc_lastSection", section.id);

    // Update UI after section change
    if (section === authorSection && typeof loadAuthorForm === "function") loadAuthorForm(currentCapsule);

    if (section === learnSection && typeof updateLearnMode === "function") {
        // همگام سازی currentCapsule با آخرین داده‌ها
        capsules = JSON.parse(localStorage.getItem("pc_capsules_index")) || [];
        currentCapsule = capsules.find(c => c.id === currentCapsule?.id) || capsules[0];

        // اطمینان از وجود آرایه‌های flashcards و quiz
        if(!currentCapsule.flashcards) currentCapsule.flashcards = [];
        if(!currentCapsule.quiz) currentCapsule.quiz = [];

        updateLearnMode();
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

    // Refresh UI after save
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

    let currentCardIndex = 0;
    let showingAnswer = false;

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
        if (!currentCapsule.flashcards.length) return;
        currentCardIndex = (currentCardIndex - 1 + currentCapsule.flashcards.length) % currentCapsule.flashcards.length;
        showingAnswer = false;
        showFlashcard();
    };
    if(nextCardBtn) nextCardBtn.onclick = () => {
        if (!currentCapsule.flashcards.length) return;
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
            const q = currentCapsule.quiz[0]; // فقط سوال اول
            quizContainer.innerHTML = `<p><strong>Q1:</strong> ${q.question}</p>`;
            const div = document.createElement("div");
            (q.options || []).forEach(opt => {
                const btn = document.createElement("button");
                btn.className = "btn btn-outline-primary btn-sm me-2";
                btn.innerText = opt;
                btn.onclick = () => alert(opt === q.answer ? "✅ Correct!" : "❌ Wrong!");
                div.appendChild(btn);
            });
            quizContainer.appendChild(div);
        }
    }
}

// ===============================
// Initial Load
// ===============================
document.addEventListener("DOMContentLoaded", ()=>{
    loadTheme();

    // نمایش آخرین بخش بعد از رفرش
    const lastSectionId = localStorage.getItem("pc_lastSection");
    if (lastSectionId === "author") showSection(authorSection);
    else if (lastSectionId === "learn") showSection(learnSection);
    else showSection(librarySection);

    // Ensure capsules are loaded
    capsules = JSON.parse(localStorage.getItem("pc_capsules_index")) || [];
    if (capsules.length > 0 && !currentCapsule) currentCapsule = capsules[0];
});
