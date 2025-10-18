// =============================
// Author.js
// =============================

// HTML Elements
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

// Update Author Form with current capsule
function updateAuthorForm() {
  if (!currentCapsule) return;

  titleInput.value = currentCapsule.title;
  subjectInput.value = currentCapsule.subject;
  levelInput.value = currentCapsule.level;
  descInput.value = currentCapsule.description || "";
  notesInput.value = (currentCapsule.notes || []).join("\n");

  renderFlashcards();
  renderQuiz();
}

// Render Flashcards list
function renderFlashcards() {
  flashcardsList.innerHTML = "";
  (currentCapsule.flashcards || []).forEach((fc, idx) => {
    const div = document.createElement("div");
    div.className = "mb-2 d-flex gap-2";
    div.innerHTML = `
      <input type="text" class="form-control form-control-sm front" placeholder="Front" value="${escapeHTML(fc.front)}">
      <input type="text" class="form-control form-control-sm back" placeholder="Back" value="${escapeHTML(fc.back)}">
      <button class="btn btn-danger btn-sm delFC"><i class="bi bi-trash"></i></button>
    `;
    flashcardsList.appendChild(div);

    div.querySelector(".delFC").addEventListener("click", () => {
      currentCapsule.flashcards.splice(idx, 1);
      renderFlashcards();
    });
  });
}

// Add new Flashcard
addFlashcardBtn.addEventListener("click", () => {
  if (!currentCapsule) return;
  currentCapsule.flashcards.push({ front: "", back: "" });
  renderFlashcards();
});

// Render Quiz list
function renderQuiz() {
  quizList.innerHTML = "";
  (currentCapsule.quiz || []).forEach((q, idx) => {
    const div = document.createElement("div");
    div.className = "mb-2 border p-2 rounded";
    div.innerHTML = `
      <input type="text" class="form-control form-control-sm question mb-1" placeholder="Question" value="${escapeHTML(q.question)}">
      <input type="text" class="form-control form-control-sm mb-1" placeholder="Choice A" value="${escapeHTML(q.choices[0] || "")}">
      <input type="text" class="form-control form-control-sm mb-1" placeholder="Choice B" value="${escapeHTML(q.choices[1] || "")}">
      <input type="text" class="form-control form-control-sm mb-1" placeholder="Choice C" value="${escapeHTML(q.choices[2] || "")}">
      <input type="text" class="form-control form-control-sm mb-1" placeholder="Choice D" value="${escapeHTML(q.choices[3] || "")}">
      <select class="form-select form-select-sm correct mb-1">
        <option value="0" ${q.correct===0?"selected":""}>A</option>
        <option value="1" ${q.correct===1?"selected":""}>B</option>
        <option value="2" ${q.correct===2?"selected":""}>C</option>
        <option value="3" ${q.correct===3?"selected":""}>D</option>
      </select>
      <button class="btn btn-danger btn-sm delQ"><i class="bi bi-trash"></i></button>
    `;
    quizList.appendChild(div);

    div.querySelector(".delQ").addEventListener("click", () => {
      currentCapsule.quiz.splice(idx, 1);
      renderQuiz();
    });
  });
}

// Add new Quiz question
addQuestionBtn.addEventListener("click", () => {
  if (!currentCapsule) return;
  currentCapsule.quiz.push({ question:"", choices:["","","",""], correct:0 });
  renderQuiz();
});

// Save Capsule button
saveCapsuleBtn.addEventListener("click", () => {
  if (!currentCapsule) return;

  // Update capsule data
  currentCapsule.title = titleInput.value.trim() || currentCapsule.title;
  currentCapsule.subject = subjectInput.value.trim() || "General";
  currentCapsule.level = levelInput.value;
  currentCapsule.description = descInput.value.trim();
  currentCapsule.notes = notesInput.value.split("\n").map(n=>n.trim()).filter(n=>n);
  currentCapsule.flashcards = Array.from(flashcardsList.children).map(div=>{
    return {
      front: div.querySelector(".front").value.trim(),
      back: div.querySelector(".back").value.trim()
    };
  }).filter(fc=>fc.front || fc.back);
  currentCapsule.quiz = Array.from(quizList.children).map(div=>{
    const choices = Array.from(div.querySelectorAll("input")).map(i=>i.value.trim());
    const correct = parseInt(div.querySelector(".correct").value);
    return { question: div.querySelector(".question").value.trim(), choices, correct };
  }).filter(q=>q.question || q.choices.some(c=>c));

  currentCapsule.updatedAt = new Date().toISOString();

  saveCapsules();
  renderLibrary();
  populateLearnSelector();

  alert("Capsule saved!");
});

// Update Author Form when capsule selected
function updateAuthorMode() {
  updateAuthorForm();
}
