
// ===============================
// Pocket Classroom - Learn.js (Fixed for Main.js)
// ===============================

// Elements
const learnSelector = document.getElementById("learnSelector");
const notesList = document.getElementById("notesList");
const flashcardDisplay = document.getElementById("flashcardDisplay");
const prevCardBtn = document.getElementById("prevCardBtn");
const nextCardBtn = document.getElementById("nextCardBtn");
const flipCardBtn = document.getElementById("flipCardBtn");
const quizContainer = document.getElementById("quizContainer");

// Flashcard state
let flashIndex = 0;
let showingFront = true;

// =====================
// Populate Learn Selector
// =====================
function populateLearnSelector(){
  if(!learnSelector || !capsules) return;
  learnSelector.innerHTML = "";

  capsules.forEach(c=>{
    if(!c.title || c.title.trim() === "") c.title = "Capsule without title";
    if(!c.notes) c.notes = [];
    if(!c.flashcards) c.flashcards = [];
    if(!c.quiz) c.quiz = [];

    const opt = document.createElement("option");
    opt.value = c.id;
    opt.textContent = c.title + (c.subject ? ` (${c.subject})` : "");
    learnSelector.appendChild(opt);
  });

  if(currentCapsule) learnSelector.value = currentCapsule.id;
}

// =====================
// Learn Selector Change
// =====================
if(learnSelector){
  learnSelector.addEventListener("change", ()=>{
    const selectedId = learnSelector.value;
    currentCapsule = capsules.find(c => c.id === selectedId);
    localStorage.setItem("pc_current_capsule", currentCapsule.id);

    flashIndex = 0;
    showingFront = true;
    updateLearnMode();
  });
}

// =====================
// Update Learn Mode
// =====================
function updateLearnMode(){
  if(!currentCapsule) return;

  if(!currentCapsule.notes) currentCapsule.notes = [];
  if(!currentCapsule.flashcards) currentCapsule.flashcards = [];
  if(!currentCapsule.quiz) currentCapsule.quiz = [];

  // Notes
  notesList.innerHTML = "";
  if(currentCapsule.notes.length){
    currentCapsule.notes.forEach(n=>{
      const li = document.createElement("li");
      li.textContent = n;
      li.className = "list-group-item";
      notesList.appendChild(li);
    });
  } else {
    notesList.innerHTML = "<li class='list-group-item text-warning'>No notes available.</li>";
  }

  // Flashcards
  flashIndex = 0;
  showingFront = true;
  renderFlashcard();

  // Quiz
  renderQuiz();
}

// =====================
// Flashcards
// =====================
function renderFlashcard(){
  if(!currentCapsule.flashcards.length){
    flashcardDisplay.innerHTML = "<div class='alert alert-warning'>No flashcards available!</div>";
    return;
  }

  const card = currentCapsule.flashcards[flashIndex];
  flashcardDisplay.innerHTML = showingFront
    ? `<strong>${escapeHTML(card.front)}</strong>`
    : `<strong>${escapeHTML(card.back)}</strong>${card.explanation ? `<br><em>${escapeHTML(card.explanation)}</em>` : ""}`;
}

// Flashcard navigation
nextCardBtn.onclick = ()=>{
  if(!currentCapsule.flashcards.length) return;
  flashIndex = (flashIndex+1) % currentCapsule.flashcards.length;
  showingFront = true;
  renderFlashcard();
};

prevCardBtn.onclick = ()=>{
  if(!currentCapsule.flashcards.length) return;
  flashIndex = (flashIndex-1+currentCapsule.flashcards.length) % currentCapsule.flashcards.length;
  showingFront = true;
  renderFlashcard();
};

flipCardBtn.onclick = ()=>{
  if(!currentCapsule.flashcards.length) return;
  showingFront = !showingFront;
  renderFlashcard();
};

// =====================
// Quiz
// =====================
function renderQuiz(){
  if(!currentCapsule.quiz.length){
    quizContainer.innerHTML = "<p class='text-warning'>No quiz questions.</p>";
    return;
  }

  quizContainer.innerHTML = "";
  currentCapsule.quiz.forEach((q, i)=>{
    const div = document.createElement("div");
    div.className = "mb-3";
    div.innerHTML = `
      <p><strong>Q${i+1}: ${escapeHTML(q.question)}</strong></p>
      <ul class="list-group">
        ${q.choices.map((c,j)=>`<li class="list-group-item ${j===q.correctIndex?'list-group-item-success':''}">${escapeHTML(c)}</li>`).join("")}
      </ul>
      ${q.explanation ? `<p><em>${escapeHTML(q.explanation)}</em></p>` : ""}
    `;
    quizContainer.appendChild(div);
  });
}

// =====================
// Helper
// =====================
function escapeHTML(str){
  if(!str) return "";
  return str.replace(/[&<>"']/g, function(m){
    return {
      '&':'&amp;',
      '<':'&lt;',
      '>':'&gt;',
      '"':'&quot;',
      "'":'&#39;'
    }[m];
  });
}
