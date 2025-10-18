// =============================
// Learn.js
// =============================

// HTML Elements
const notesList = document.getElementById("notesList");
const flashcardDisplay = document.getElementById("flashcardDisplay");
const prevCardBtn = document.getElementById("prevCardBtn");
const nextCardBtn = document.getElementById("nextCardBtn");
const flipCardBtn = document.getElementById("flipCardBtn");
const quizContainer = document.getElementById("quizContainer");

// State
let currentIndex = 0;
let flashcardFlipped = false;

// Update Learn Mode when capsule selected
function updateLearnMode() {
  if (!currentCapsule) return;

  renderNotes();
  renderFlashcard();
  currentIndex = 0;
  flashcardFlipped = false;
  renderQuiz();
}

// ========== Notes ==========
function renderNotes() {
  notesList.innerHTML = "";
  (currentCapsule.notes || []).forEach(note => {
    const li = document.createElement("li");
    li.className = "list-group-item";
    li.innerText = note;
    notesList.appendChild(li);
  });
}

// ========== Flashcards ==========
function renderFlashcard() {
  if (!currentCapsule.flashcards || currentCapsule.flashcards.length === 0) {
    flashcardDisplay.innerText = "No flashcards available";
    return;
  }
  const fc = currentCapsule.flashcards[currentIndex];
  flashcardDisplay.innerText = flashcardFlipped ? fc.back : fc.front;
}

// Flip Flashcard
flipCardBtn.addEventListener("click", () => {
  flashcardFlipped = !flashcardFlipped;
  renderFlashcard();
});

flashcardDisplay.addEventListener("click", () => {
  flashcardFlipped = !flashcardFlipped;
  renderFlashcard();
});

// Prev / Next Flashcard
prevCardBtn.addEventListener("click", () => {
  if (!currentCapsule.flashcards || currentCapsule.flashcards.length === 0) return;
  currentIndex = (currentIndex - 1 + currentCapsule.flashcards.length) % currentCapsule.flashcards.length;
  flashcardFlipped = false;
  renderFlashcard();
});

nextCardBtn.addEventListener("click", () => {
  if (!currentCapsule.flashcards || currentCapsule.flashcards.length === 0) return;
  currentIndex = (currentIndex + 1) % currentCapsule.flashcards.length;
  flashcardFlipped = false;
  renderFlashcard();
});

// ========== Quiz ==========
function renderQuiz() {
  quizContainer.innerHTML = "";
  if (!currentCapsule.quiz || currentCapsule.quiz.length === 0) {
    quizContainer.innerText = "No quiz questions available";
    return;
  }

  let quizIndex = 0;
  let score = 0;

  function showQuestion(i) {
    const q = currentCapsule.quiz[i];
    quizContainer.innerHTML = `
      <h6>${escapeHTML(q.question)}</h6>
      <div class="d-flex flex-column gap-2">
        ${q.choices.map((c,j)=>`<button class="btn btn-outline-primary btn-sm choiceBtn" data-index="${j}">${escapeHTML(c)}</button>`).join("")}
      </div>
      <p class="mt-2" id="feedback"></p>
    `;

    quizContainer.querySelectorAll(".choiceBtn").forEach(btn => {
      btn.addEventListener("click", () => {
        const chosen = parseInt(btn.dataset.index);
        const feedback = quizContainer.querySelector("#feedback");
        if (chosen === q.correct) {
          feedback.innerText = "✅ Correct!";
          score++;
        } else {
          feedback.innerText = `❌ Wrong! Correct: ${q.choices[q.correct]}`;
        }

        setTimeout(() => {
          quizIndex++;
          if (quizIndex < currentCapsule.quiz.length) {
            showQuestion(quizIndex);
          } else {
            quizContainer.innerHTML = `<h5>Quiz Completed</h5><p>Score: ${score}/${currentCapsule.quiz.length}</p>`;
          }
        }, 800);
      });
    });
  }

  showQuestion(quizIndex);
}
