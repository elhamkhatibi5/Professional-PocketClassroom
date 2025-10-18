
// ==============================
// Pocket Classroom - author.js
// ==============================

// المان‌ها
const titleInput = document.getElementById("titleInput");
const subjectInput = document.getElementById("subjectInput");
const levelInput = document.getElementById("levelInput");
const descInput = document.getElementById("descInput");
const notesInput = document.getElementById("notesInput");
const flashcardsList = document.getElementById("flashcardsList");
const addFlashcardBtn = document.getElementById("addFlashcardBtn");
const quizList = document.getElementById("quizList");
const addQuestionBtn = document.getElementById("addQuestionBtn");
const saveCapsuleBtn = document.getElementById("saveCapsuleBtn");

// ==============================
// نمایش کپسول در فرم
// ==============================
function loadAuthorForm() {
  if(!currentCapsule) return;

  titleInput.value = currentCapsule.title || "";
  subjectInput.value = currentCapsule.subject || "";
  levelInput.value = currentCapsule.level || "Beginner";
  descInput.value = currentCapsule.description || "";
  notesInput.value = currentCapsule.notes ? currentCapsule.notes.join("\n") : "";

  renderFlashcards();
  renderQuiz();
}

// ==============================
// Flashcards
// ==============================
function renderFlashcards() {
  flashcardsList.innerHTML = "";
  if(!currentCapsule.flashcards) currentCapsule.flashcards = [];

  currentCapsule.flashcards.forEach((f, i) => {
    const div = document.createElement("div");
    div.className = "list-group-item d-flex gap-2 align-items-center mb-1";
    div.innerHTML = `
      <input type="text" class="form-control form-control-sm frontInput" value="${escapeHTML(f.front)}" placeholder="Front">
      <input type="text" class="form-control form-control-sm backInput" value="${escapeHTML(f.back)}" placeholder="Back">
      <button class="btn btn-sm btn-danger delFlashBtn"><i class="bi bi-trash"></i></button>
    `;
    flashcardsList.appendChild(div);

    div.querySelector(".delFlashBtn").addEventListener("click", () => {
      currentCapsule.flashcards.splice(i,1);
      renderFlashcards();
    });
  });
}

// ==============================
// Quiz
// ==============================
function renderQuiz() {
  quizList.innerHTML = "";
  if(!currentCapsule.quiz) currentCapsule.quiz = [];

  currentCapsule.quiz.forEach((q, i) => {
    const div = document.createElement("div");
    div.className = "list-group-item mb-2";
    div.innerHTML = `
      <input type="text" class="form-control form-control-sm questionInput mb-1" value="${escapeHTML(q.question)}" placeholder="Question">
      <div class="d-flex gap-1 mb-1">
        ${q.choices.map((c,j)=>`<input type="text" class="form-control form-control-sm choiceInput" data-index="${j}" value="${escapeHTML(c)}" placeholder="Choice ${j+1}">`).join("")}
      </div>
      <select class="form-select form-select-sm correctInput mb-1">
        ${q.choices.map((_,j)=>`<option value="${j}" ${q.answer===j?"selected":""}>${j+1}</option>`).join("")}
      </select>
      <textarea class="form-control form-control-sm explanationInput" placeholder="Explanation">${escapeHTML(q.explanation||"")}</textarea>
      <button class="btn btn-sm btn-danger delQuizBtn mt-1"><i class="bi bi-trash"></i> Delete</button>
    `;
    quizList.appendChild(div);

    div.querySelector(".delQuizBtn").addEventListener("click", ()=>{
      currentCapsule.quiz.splice(i,1);
      renderQuiz();
    });
  });
}

// ==============================
// دکمه‌ها
// ==============================
addFlashcardBtn.addEventListener("click", ()=>{
  if(!currentCapsule.flashcards) currentCapsule.flashcards = [];
  currentCapsule.flashcards.push({front:"", back:""});
  renderFlashcards();
});

addQuestionBtn.addEventListener("click", ()=>{
  if(!currentCapsule.quiz) currentCapsule.quiz = [];
  currentCapsule.quiz.push({question:"", choices:["","","",""], answer:0, explanation:""});
  renderQuiz();
});

saveCapsuleBtn.addEventListener("click", ()=>{
  if(!currentCapsule) return;

  // Update currentCapsule
  currentCapsule.title = titleInput.value.trim();
  currentCapsule.subject = subjectInput.value.trim();
  currentCapsule.level = levelInput.value;
  currentCapsule.description = descInput.value.trim();
  currentCapsule.notes = notesInput.value.split("\n").map(s=>s.trim()).filter(Boolean);

  // Flashcards
  flashcardsList.querySelectorAll(".list-group-item").forEach((div,i)=>{
    const front = div.querySelector(".frontInput").value.trim();
    const back = div.querySelector(".backInput").value.trim();
    currentCapsule.flashcards[i] = {front, back};
  });

  // Quiz
  quizList.querySelectorAll(".list-group-item").forEach((div,i)=>{
    const question = div.querySelector(".questionInput").value.trim();
    const choices = Array.from(div.querySelectorAll(".choiceInput")).map(inp=>inp.value.trim());
    const answer = parseInt(div.querySelector(".correctInput").value);
    const explanation = div.querySelector(".explanationInput").value.trim();
    currentCapsule.quiz[i] = {question, choices, answer, explanation};
  });

  // ذخیره در LocalStorage
  saveCapsules();
  localStorage.setItem("pc_lastCapsule", currentCapsule.id);

  alert("Capsule saved!");

  // Refresh فرم و Learn Mode
  if(typeof loadAuthorForm === "function") loadAuthorForm();
  if(typeof updateLearnMode === "function") updateLearnMode();
});

// ==============================
// Helper: Escape HTML
// ==============================
function escapeHTML(str) {
  if(!str) return "";
  return str.replace(/[&<>"']/g, function(m) {
    return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[m];
  });
}
