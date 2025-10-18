
// ==============================
// Pocket Classroom - learn.js
// ==============================

// المان‌ها
const learnNotes = document.getElementById("learn-notes");
const notesList = document.getElementById("notesList");
const learnFlashcards = document.getElementById("learn-flashcards");
const flashcardDisplay = document.getElementById("flashcardDisplay");
const prevCardBtn = document.getElementById("prevCardBtn");
const nextCardBtn = document.getElementById("nextCardBtn");
const flipCardBtn = document.getElementById("flipCardBtn");
const learnQuiz = document.getElementById("learn-quiz");
const quizContainer = document.getElementById("quizContainer");
const learnSelector = document.getElementById("learnSelector");

let currentIndex = 0;
let showingFront = true;
let quizIndex = 0;
let score = 0;

// ==============================
// Populate Learn Selector
// ==============================
function populateLearnSelector() {
  learnSelector.innerHTML = "";
  if(!capsules.length) {
    learnSelector.innerHTML = `<option value="">No capsules</option>`;
    return;
  }
  capsules.forEach(c=>{
    const opt = document.createElement("option");
    opt.value = c.id;
    opt.textContent = c.title || "Untitled Capsule";
    learnSelector.appendChild(opt);
  });

  // Set selected to currentCapsule
  if(currentCapsule) learnSelector.value = currentCapsule.id;
}

// ==============================
// Update Learn Mode
// ==============================
function updateLearnMode() {
  populateLearnSelector();

  if(!currentCapsule) {
    notesList.innerHTML = "";
    flashcardDisplay.textContent = "Select a capsule";
    quizContainer.innerHTML = "";
    return;
  }

  // Notes
  notesList.innerHTML = "";
  if(currentCapsule.notes && currentCapsule.notes.length){
    currentCapsule.notes.forEach(note=>{
      const li = document.createElement("li");
      li.textContent = note;
      notesList.appendChild(li);
    });
  }

  // Flashcards
  currentIndex = 0;
  showingFront = true;
  renderFlashcard();

  // Quiz
  quizIndex = 0;
  score = 0;
  renderQuizQuestion();
}

// ==============================
// Flashcards
// ==============================
function renderFlashcard() {
  if(!currentCapsule || !currentCapsule.flashcards || currentCapsule.flashcards.length === 0){
    flashcardDisplay.textContent = "No flashcards";
    return;
  }
  const card = currentCapsule.flashcards[currentIndex];
  flashcardDisplay.textContent = showingFront ? card.front : card.back;
}

// Flip & Navigation
flipCardBtn.addEventListener("click", ()=>{
  showingFront = !showingFront;
  renderFlashcard();
});

prevCardBtn.addEventListener("click", ()=>{
  if(currentIndex>0) currentIndex--;
  showingFront = true;
  renderFlashcard();
});

nextCardBtn.addEventListener("click", ()=>{
  if(currentIndex < currentCapsule.flashcards.length-1) currentIndex++;
  showingFront = true;
  renderFlashcard();
});

// ==============================
// Quiz
// ==============================
function renderQuizQuestion() {
  if(!currentCapsule || !currentCapsule.quiz || currentCapsule.quiz.length===0){
    quizContainer.innerHTML = "<p>No quiz questions.</p>";
    return;
  }

  if(quizIndex >= currentCapsule.quiz.length){
    quizContainer.innerHTML = `<p>Quiz finished! Score: ${score}/${currentCapsule.quiz.length}</p>`;
    return;
  }

  const q = currentCapsule.quiz[quizIndex];
  quizContainer.innerHTML = `
    <p><strong>Q${quizIndex+1}:</strong> ${q.question}</p>
    <div class="d-flex flex-column gap-2">
      ${q.choices.map((c,i)=>`<button class="btn btn-outline-primary btn-sm choiceBtn" data-index="${i}">${c}</button>`).join("")}
    </div>
  `;

  quizContainer.querySelectorAll(".choiceBtn").forEach(btn=>{
    btn.addEventListener("click", ()=>{
      const answer = parseInt(btn.dataset.index);
      if(answer === q.answer){
        btn.classList.add("btn-success");
        score++;
      } else {
        btn.classList.add("btn-danger");
      }
      setTimeout(()=>{
        quizIndex++;
        renderQuizQuestion();
      },500);
    });
  });
}

// ==============================
// Selector Change
// ==============================
learnSelector.addEventListener("change", ()=>{
  const id = learnSelector.value;
  currentCapsule = capsules.find(c=>c.id===id) || null;
  currentIndex = 0;
  showingFront = true;
  quizIndex = 0;
  score = 0;
  updateLearnMode();
});

// ==============================
// Initial Load
// ==============================
document.addEventListener("DOMContentLoaded", ()=>{
  populateLearnSelector();
  updateLearnMode();
});
