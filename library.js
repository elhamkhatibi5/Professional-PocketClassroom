
// ===============================
// Pocket Classroom - Library JS (Fixed)
// ===============================

const capsuleGrid = document.getElementById("capsuleGrid");
const newCapsuleBtn = document.getElementById("newCapsuleBtn");
const learnSelector = document.getElementById("learnSelector");
const searchCapsule = document.getElementById("searchCapsule");

// Render Library
function renderLibrary(filter = "") {
  capsuleGrid.innerHTML = "";

  // اصلاح مقادیر پیش‌فرض
  capsules.forEach(c => {
    if(!c.title || c.title.trim() === "") c.title = "کپسول بدون عنوان";
    if(!c.notes) c.notes = [];
    if(!c.flashcards) c.flashcards = [];
    if(!c.quiz) c.quiz = [];
  });

  capsules
    .filter(c => c.title.toLowerCase().includes(filter.toLowerCase()))
    .forEach(c => {
      const div = document.createElement("div");
      div.className = "col-md-4";
      div.innerHTML = `
        <div class="card capsule-card shadow-sm">
          <div class="card-body">
            <h5 class="card-title">${escapeHTML(c.title)}</h5>
            <p class="card-text text-muted">${escapeHTML(c.description)}</p>
            <span class="badge ${c.level==="Beginner"?"bg-success":c.level==="Intermediate"?"bg-warning":"bg-danger"}">
              ${c.level}
            </span>
            <div class="mt-3 text-end">
              <button class="btn btn-outline-primary btn-sm learnBtn"><i class="bi bi-play-circle"></i> Learn</button>
              <button class="btn btn-outline-secondary btn-sm editBtn"><i class="bi bi-pencil"></i></button>
              <button class="btn btn-outline-danger btn-sm delBtn"><i class="bi bi-trash"></i></button>
            </div>
          </div>
        </div>`;
      capsuleGrid.appendChild(div);

      // Learn button
      div.querySelector(".learnBtn").addEventListener("click", () => {
        setCurrentCapsule(c.id);
        showSection(learnSection);
      });

      // Edit button
      div.querySelector(".editBtn").addEventListener("click", () => {
        setCurrentCapsule(c.id);
        showSection(authorSection);
      });

      // Delete button
      div.querySelector(".delBtn").addEventListener("click", () => {
        if (confirm(`Delete ${c.title}?`)) {
          capsules = capsules.filter(cp => cp.id !== c.id);
          saveCapsules();
          renderLibrary(searchCapsule.value);
        }
      });
  });
}

// Learn Selector
function populateLearnSelector() {
  learnSelector.innerHTML = "";
  capsules.forEach(c => {
    // اصلاح مقادیر پیش‌فرض
    if(!c.title || c.title.trim() === "") c.title = "کپسول بدون عنوان";
    if(!c.notes) c.notes = [];
    if(!c.flashcards) c.flashcards = [];
    if(!c.quiz) c.quiz = [];

    const opt = document.createElement("option");
    opt.value = c.id;
    opt.textContent = c.title;
    learnSelector.appendChild(opt);
  });

  if (capsules.length > 0) {
    const selectedId = currentCapsule ? currentCapsule.id : capsules[0].id;
    learnSelector.value = selectedId;
  }
}

// New Capsule
newCapsuleBtn.addEventListener("click", () => {
  const newCap = {
    id: Date.now().toString(),
    title: "New Capsule",
    subject: "General",
    level: "Beginner",
    description: "",
    notes: [],
    flashcards: [],
    quiz: []
  };
  capsules.push(newCap);
  currentCapsule = newCap;
  saveCapsules();
  renderLibrary();
  populateLearnSelector();
  showSection(authorSection);
});

// Search
searchCapsule.addEventListener("input", debounce(() => renderLibrary(searchCapsule.value), 300));

// Initial Render
document.addEventListener("DOMContentLoaded", () => {
  renderLibrary();
  populateLearnSelector();
});
