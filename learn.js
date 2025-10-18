
const learnSelector = document.getElementById("learnSelector");
const notesList = document.getElementById("notesList");
const flashcardDisplay = document.getElementById("flashcardDisplay");
const flashcardCounter = document.createElement("div");
flashcardDisplay.after(flashcardCounter);
const prevCardBtn = document.getElementById("prevCardBtn");
const nextCardBtn = document.getElementById("nextCardBtn");
const flipCardBtn = document.getElementById("flipCardBtn");
const quizContainer = document.getElementById("quizContainer");

let capsules = JSON.parse(localStorage.getItem("pc_capsules_index") || "[]");
let currentCapsule = null;
let flashIndex = 0, showingFront = true;
let quizIndex = 0, score = 0;

// =====================
// Populate Selector
// =====================
function populateLearnSelector() {
  capsules = JSON.parse(localStorage.getItem("pc_capsules_index") || "[]");
  learnSelector.innerHTML = "";
  capsules.forEach(c=>{
    const opt = document.createElement("option");
    opt.value = c.id;
    opt.textContent = c.title || "(No title)";
    learnSelector.appendChild(opt);
  });

  if(capsules.length>0){
    const selectedId = currentCapsule ? currentCapsule.id : capsules[0].id;
    learnSelector.value = selectedId;
    loadLearnCapsule(selectedId);
  } else {
    currentCapsule = null;
    updateLearnMode();
  }
}

// =====================
// Load Capsule
// =====================
function loadLearnCapsule(id){
  capsules = JSON.parse(localStorage.getItem("pc_capsules_index") || "[]");
  currentCapsule = capsules.find(c=>c.id===id);
  flashIndex = 0; showingFront = true;
  quizIndex = 0; score = 0;
  updateLearnMode();
}

// =====================
// Update Learn Mode UI
// =====================
function updateLearnMode(){
  // Notes
  notesList.innerHTML = "";
  if(currentCapsule && currentCapsule.notes){
    currentCapsule.notes.forEach(n=>{
      const li = document.createElement("li");
      li.textContent = n;
      notesList.appendChild(li);
    });
  }

  // Flashcards
  renderFlashcard();

  // Quiz
  renderQuizQuestion();
}

// =====================
// Flashcards
// =====================
function renderFlashcard(){
  if(!currentCapsule || !currentCapsule.flashcards?.length){
    flashcardDisplay.innerHTML = "<div class='alert alert-warning'>No flashcards available!</div>";
    flashcardCounter.textContent = "";
    return;
  }
  const card = currentCapsule.flashcards[flashIndex];
  flashcardDisplay.innerHTML = showingFront 
    ? `<strong>${card.front}</strong>` 
    : `<strong>${card.back}</strong>${card.explanation ? `<br><em>${card.explanation}</em>` : ""}`;
  flashcardCounter.textContent = `Card ${flashIndex+1} / ${currentCapsule.flashcards.length}`;
}

flipCardBtn.onclick = ()=>{
  if(!currentCapsule?.flashcards?.length) return;
  showingFront = !showingFront;
  renderFlashcard();
};
prevCardBtn.onclick = ()=>{
  if(!currentCapsule?.flashcards?.length) return;
  if(flashIndex>0) flashIndex--;
  showingFront=true;
  renderFlashcard();
};
nextCardBtn.onclick = ()=>{
  if(!currentCapsule?.flashcards?.length) return;
  if(flashIndex<currentCapsule.flashcards.length-1) flashIndex++;
  showingFront=true;
  renderFlashcard();
};

// =====================
// Quiz
// =====================
function renderQuizQuestion(){
  if(!currentCapsule || !currentCapsule.quiz?.length){
    quizContainer.innerHTML = "<p class='text-warning'>No quiz questions.</p>";
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
      ${q.choices.map((c,i)=>`<button class="choiceBtn btn btn-outline-primary btn-sm" data-index="${i}">${c}</button>`).join("")}
    </div>
    <div id="explanation" class="mt-2 text-muted"></div>
  `;

  quizContainer.querySelectorAll(".choiceBtn").forEach(btn=>{
    btn.onclick = ()=>{
      const selected = parseInt(btn.dataset.index);
      const exp = document.getElementById("explanation");
      if(selected===q.answer){
        btn.className="btn btn-success btn-sm";
        score++;
        exp.textContent = q.explanation ? `✅ ${q.explanation}` : "✅ Correct!";
      } else {
        btn.className="btn btn-danger btn-sm";
        exp.textContent = q.explanation ? `❌ ${q.explanation}` : "❌ Wrong!";
      }
      setTimeout(()=>{
        quizIndex++;
        renderQuizQuestion();
      },700);
    };
  });
}

// =====================
// Selector change
// =====================
learnSelector.onchange = ()=>{
  loadLearnCapsule(learnSelector.value);
};

// =====================
// Initial load
// =====================
document.addEventListener("DOMContentLoaded",()=>{
  populateLearnSelector();
});
