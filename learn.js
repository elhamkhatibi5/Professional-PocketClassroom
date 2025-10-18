
// learn.js
const $ = s=>document.querySelector(s);

const notesList = $("#notesList");
const flashcardDisplay = $("#flashcardDisplay");
const prevCardBtn = $("#prevCardBtn");
const nextCardBtn = $("#nextCardBtn");
const flipCardBtn = $("#flipCardBtn");
const quizContainer = $("#quizContainer");
const learnSelector = $("#learnSelector");

let currentCapsule = null;
let capsules = JSON.parse(localStorage.getItem("pc_capsules_index")||"[]");
let flashIndex=0, showingFront=true, quizIndex=0, score=0;

// Populate selector
function populateLearnSelector(){
  learnSelector.innerHTML = "";
  capsules.forEach(c=>{
    const opt = document.createElement("option");
    opt.value = c.id; // ← ID مهم است
    opt.textContent = c.title || "(No title)";
    learnSelector.appendChild(opt);
  });
  if(capsules.length>0){
    learnSelector.value = capsules[0].id;
    loadLearnCapsule(capsules[0].id);
  } else {
    currentCapsule = null;
    updateLearnMode();
  }
}

// Load capsule into Learn Mode
function loadLearnCapsule(id){
  currentCapsule = capsules.find(c=>c.id===id);
  flashIndex=0;
  showingFront=true;
  quizIndex=0;
  score=0;
  updateLearnMode();
}

// Update Learn Mode UI
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
  flashIndex=0; showingFront=true;
  renderFlashcard();

  // Quiz
  quizIndex=0; score=0;
  renderQuizQuestion();
}

// Flashcard
function renderFlashcard(){
  if(!currentCapsule || !currentCapsule.flashcards || currentCapsule.flashcards.length===0){
    flashcardDisplay.textContent = "No flashcards";
    return;
  }
  const card = currentCapsule.flashcards[flashIndex];
  flashcardDisplay.textContent = showingFront ? card.front : card.back;
}

flipCardBtn.addEventListener("click", ()=>{
  showingFront=!showingFront;
  renderFlashcard();
});

prevCardBtn.addEventListener("click", ()=>{
  if(!currentCapsule || flashIndex<=0) return;
  flashIndex--;
  showingFront=true;
  renderFlashcard();
});

nextCardBtn.addEventListener("click", ()=>{
  if(!currentCapsule || flashIndex>=currentCapsule.flashcards.length-1) return;
  flashIndex++;
  showingFront=true;
  renderFlashcard();
});

// Quiz
function renderQuizQuestion(){
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
    <div id="explanation" class="mt-2 text-muted"></div>
  `;

  quizContainer.querySelectorAll(".choiceBtn").forEach(btn=>{
    btn.addEventListener("click", ()=>{
      const selected = parseInt(btn.dataset.index);
      const explanationDiv = $("#explanation");
      if(selected === q.answer){
        btn.classList.remove("btn-outline-primary");
        btn.classList.add("btn-success");
        score++;
        explanationDiv.textContent = q.explanation ? `✅ ${q.explanation}` : "✅ Correct!";
      } else {
        btn.classList.remove("btn-outline-primary");
        btn.classList.add("btn-danger");
        explanationDiv.textContent = q.explanation ? `❌ ${q.explanation}` : "❌ Wrong!";
      }
      setTimeout(()=>{
        quizIndex++;
        renderQuizQuestion();
      },700);
    });
  });
}

// Selector change
learnSelector.addEventListener("change", ()=>{
  loadLearnCapsule(learnSelector.value);
});

// Initial load
document.addEventListener("DOMContentLoaded", ()=>{
  populateLearnSelector();
});
