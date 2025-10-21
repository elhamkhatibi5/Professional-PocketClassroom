
// ===============================
// Pocket Classroom - Learn JS (Fixed Quiz with Green/Red Answers)
// ===============================

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
  if(!learnSelector) return;
  learnSelector.innerHTML = "";

  capsules.forEach(c=>{
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
learnSelector.addEventListener("change", ()=>{
  const selectedId = learnSelector.value;
  currentCapsule = capsules.find(c=>c.id===selectedId);
  localStorage.setItem("pc_current_capsule", currentCapsule.id);
  flashIndex = 0;
  showingFront = true;
  updateLearnMode();
});

// =====================
// Update Learn Mode
// =====================
function updateLearnMode(){
  if(!currentCapsule) return;

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
    : `<strong>${escapeHTML(card.back)}</strong>${card.explanation?`<br><em>${escapeHTML(card.explanation)}</em>`:""}`;
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
  flashIndex = (flashIndex-1+currentCapsule.flashcards.length)%currentCapsule.flashcards.length;
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
  quizContainer.innerHTML = "";
  if(!currentCapsule.quiz.length){
    quizContainer.innerHTML = "<p class='text-warning'>No quiz questions.</p>";
    return;
  }

  // Take first 3 questions
  const questions = currentCapsule.quiz.slice(0,3);

  questions.forEach((q,i)=>{
    const div = document.createElement("div");
    div.className = "mb-3 card p-2 shadow-sm";
    
    const p = document.createElement("p");
    p.innerHTML = `<strong>Q${i+1}: ${escapeHTML(q.question)}</strong>`;
    div.appendChild(p);

    const ul = document.createElement("ul");
    ul.className = "list-group";
    
    q.choices.forEach((choice,j)=>{
      const li = document.createElement("li");
      li.className = "list-group-item list-group-item-action";
      li.textContent = choice;

      li.addEventListener("click", ()=>{
        // Disable all choices after click
        Array.from(ul.children).forEach(c=>{
          c.style.pointerEvents = "none";
        });

        // Mark correct/incorrect
        if(j === q.correctIndex){
          li.classList.add("list-group-item-success");
        } else {
          li.classList.add("list-group-item-danger");
          // Optionally highlight correct answer
          ul.children[q.correctIndex].classList.add("list-group-item-success");
        }
      });

      ul.appendChild(li);
    });

    div.appendChild(ul);

    if(q.explanation){
      const expl = document.createElement("p");
      expl.innerHTML = `<em>${escapeHTML(q.explanation)}</em>`;
      div.appendChild(expl);
    }

    quizContainer.appendChild(div);
  });
}

// =====================
// Utility: Escape HTML
// =====================
function escapeHTML(str){
  if(!str) return "";
  return str.replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
}

// =====================
// Initial Load
// =====================
document.addEventListener("DOMContentLoaded", ()=>{
  if(capsules.length > 0){
    const lastId = localStorage.getItem("pc_current_capsule");
    if(lastId) currentCapsule = capsules.find(c=>c.id===lastId);
    if(!currentCapsule) currentCapsule = capsules[0];
  }

  populateLearnSelector();
  updateLearnMode();
});
