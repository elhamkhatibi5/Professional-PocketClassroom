
// ===============================
// Pocket Classroom - Author JS (Fixed for main.js sync)
// ===============================

const titleInput = document.getElementById("titleInput");
const subjectInput = document.getElementById("subjectInput");
const levelInput = document.getElementById("levelInput");
const notesInput = document.getElementById("notesInput");

const flashcardList = document.getElementById("flashcardList");
const quizList = document.getElementById("quizList");

const addFlashcardBtn = document.getElementById("addFlashcardBtn");
const addQuizBtn = document.getElementById("addQuizBtn");
const saveCapsuleBtn = document.getElementById("saveCapsuleBtn");
const cancelBtn = document.getElementById("cancelBtn");

// Render Author form
function loadAuthorForm(capsule) {
  if (!capsule) capsule = { id: Date.now().toString(), title: "", subject: "", level: "", notes: "", flashcards: [], quiz: [] };

  titleInput.value = capsule.title || "";
  subjectInput.value = capsule.subject || "";
  levelInput.value = capsule.level || "";
  notesInput.value = capsule.notes || "";

  renderFlashcards(capsule.flashcards || []);
  renderQuiz(capsule.quiz || []);

  // Re-bind buttons every time
  addFlashcardBtn.onclick = () => {
    capsule.flashcards.push({ q: "", a: "" });
    renderFlashcards(capsule.flashcards);
  };

  addQuizBtn.onclick = () => {
    capsule.quiz.push({ q: "", options: ["", "", "", ""], correct: 0 });
    renderQuiz(capsule.quiz);
  };

  saveCapsuleBtn.onclick = () => {
    capsule.title = titleInput.value.trim();
    capsule.subject = subjectInput.value.trim();
    capsule.level = levelInput.value.trim();
    capsule.notes = notesInput.value.trim();

    // Get current state of flashcards and quiz
    capsule.flashcards = getFlashcardsFromDOM();
    capsule.quiz = getQuizFromDOM();

    saveCapsule(capsule); // ✅ use main.js global save function
    alert("Capsule saved successfully!");
  };

  cancelBtn.onclick = () => {
    loadAuthorForm(currentCapsule);
  };
}

// --------------------
// Flashcards
// --------------------
function renderFlashcards(flashcards) {
  flashcardList.innerHTML = "";
  flashcards.forEach((fc, i) => {
    const div = document.createElement("div");
    div.className = "card p-2 mb-2";
    div.innerHTML = `
      <label>Q:</label>
      <input class="form-control mb-1 fc-q" value="${fc.q}">
      <label>A:</label>
      <input class="form-control fc-a" value="${fc.a}">
      <button class="btn btn-sm btn-danger mt-1 remove-fc">Remove</button>
    `;
    div.querySelector(".remove-fc").onclick = () => {
      flashcards.splice(i, 1);
      renderFlashcards(flashcards);
    };
    flashcardList.appendChild(div);
  });
}

function getFlashcardsFromDOM() {
  const items = [];
  flashcardList.querySelectorAll(".card").forEach(div => {
    const q = div.querySelector(".fc-q").value.trim();
    const a = div.querySelector(".fc-a").value.trim();
    if (q && a) items.push({ q, a });
  });
  return items;
}

// --------------------
// Quiz
// --------------------
function renderQuiz(quiz) {
  quizList.innerHTML = "";
  quiz.forEach((qz, i) => {
    const div = document.createElement("div");
    div.className = "card p-2 mb-2";
    div.innerHTML = `
      <label>Question:</label>
      <input class="form-control mb-2 qz-q" value="${qz.q}">
      ${qz.options
        .map(
          (opt, idx) => `
        <div class="input-group mb-1">
          <div class="input-group-text">
            <input type="radio" name="correct-${i}" ${idx === qz.correct ? "checked" : ""}>
          </div>
          <input class="form-control qz-opt" value="${opt}">
        </div>
      `
        )
        .join("")}
      <button class="btn btn-sm btn-danger mt-1 remove-qz">Remove</button>
    `;
    div.querySelector(".remove-qz").onclick = () => {
      quiz.splice(i, 1);
      renderQuiz(quiz);
    };
    quizList.appendChild(div);
  });
}

function getQuizFromDOM() {
  const items = [];
  quizList.querySelectorAll(".card").forEach(div => {
    const q = div.querySelector(".qz-q").value.trim();
    const opts = Array.from(div.querySelectorAll(".qz-opt")).map(i => i.value.trim());
    const correct = Array.from(div.querySelectorAll('input[type="radio"]')).findIndex(r => r.checked);
    if (q && opts.length === 4) items.push({ q, options: opts, correct });
  });
  return items;
}
