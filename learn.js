
// ===============================
// Pocket Classroom - Learn JS (Flashcard Quiz + Green/Red)
// ===============================

const learnSelector = document.getElementById("learnSelector");
const notesList = document.getElementById("notesList");
const flashcardDisplay = document.getElementById("flashcardDisplay");
const prevCardBtn = document.getElementById("prevCardBtn");
const nextCardBtn = document.getElementById("nextCardBtn");
const flipCardBtn = document.getElementById("flipCardBtn");
const quizContainer = document.getElementById("quizContainer");

// Flashcard state
let flashIndexLearn = 0;
let showingFront = true;

// =====================
// Populate Learn Selector
// =====================
function populateLearnSelector(){
  if(!learnSelector) return;
  learnSelector.innerHTML = "";

  window.capsules.forEach(c=>{
    const opt = document.createElement("option");
    opt.value = c.id;
    opt.textContent = c.title + (c.subject ? ` (${c.subject})` : "");
    learnSelector.appendChild(opt);
  });

  if(window.currentCapsule) learnSelector.value = window.currentCapsule.id;
}

// =====================
// Learn Selector Change
// =====================
learnSelector.addEventListener("change", ()=>{
  const selectedId = learnSelector.value;
  window.currentCapsule = window.capsules.find(c=>c.id===selectedId);
  localStorage.setItem("pc_current_capsule", window.currentCapsule.id);
  flashIndexLearn = 0;
  showingFront = true;
  updateLearnMode();
});

// =====================
// Update Learn Mode
// =====================
function updateLearnMode(){
  if(!window.currentCapsule) return;

  // Notes
  notesList.innerHTML = "";
  if(window.currentCapsule.notes.length){
    window.currentCapsule.notes.forEach(n=>{
      const li = document.createElement("li");
      li.textContent = n;
      li.className = "list-group-item";
      notesList.appendChild(li);
    });
  } else {
    notesList.innerHTML = "<li class='list-group-item text-warning'>No notes available.</li>";
  }

  // Flashcards
  flashIndexLearn = 0;
  showingFront = true;
  renderFlashcard();

  // Quiz
  renderQuiz();
}

// =====================
// Flashcards
// =====================
function renderFlashcard(){
  if(!window.currentCapsule.flashcards.length){
    flashcardDisplay.innerHTML = "<div class='alert alert-warning'>No flashcards available!</div>";
    return;
  }

  const card = window.currentCapsule.flashcards[flashIndexLearn];

  // Card content
  flashcardDisplay.innerHTML = `<strong>${showingFront ? escapeHTML(card.front) : escapeHTML(card.back)}</strong>`;

  // Add choices if back has "options"
  if(!showingFront && card.choices && card.correctIndex != null){
    const ul = document.createElement("ul");
    ul.className = "list-group mt-2";

    card.choices.forEach((c,j)=>{
      const li = document.createElement("li");
      li.className = "list-group-item list-group-item-action";
      li.textContent = c;

      li.addEventListener("click", ()=>{
        Array.from(ul.children).forEach(child => child.style.pointerEvents = "none");

        if(j === card.correctIndex){
          li.classList.add("list-group-item-success");
        } else {
          li.classList.add("list-group-item-danger");
          ul.children[card.correctIndex].classList.add("list-group-item-success");
        }
      });

      ul.appendChild(li);
    });

    flashcardDisplay.appendChild(ul);
  }
}

// Flashcard navigation
nextCardBtn.onclick = ()=>{
  if(!window.currentCapsule.flashcards.length) return;
  flashIndexLearn = (flashIndexLearn + 1) % window.currentCapsule.flashcards.length;
  showingFront = true;
  renderFlashcard();
};

prevCardBtn.onclick = ()=>{
  if(!window.currentCapsule.flashcards.length) return;
  flashIndexLearn = (flashIndexLearn - 1 + window.currentCapsule.flashcards.length) % window.currentCapsule.flashcards.length;
  showingFront = true;
  renderFlashcard();
};

flipCardBtn.onclick = ()=>{
  if(!window.currentCapsule.flashcards.length) return;
  showingFront = !showingFront;
  renderFlashcard();
};

// =====================
// Quiz
// =====================
function renderQuiz(){
  quizContainer.innerHTML = "";
  if(!window.currentCapsule.quiz.length){
    quizContainer.innerHTML = "<p class='text-warning'>No quiz questions.</p>";
    return;
  }

  const questions = window.currentCapsule.quiz.slice(0,3);

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
        Array.from(ul.children).forEach(c=> c.style.pointerEvents = "none");

        if(j === q.correctIndex){
          li.classList.add("list-group-item-success");
        } else {
          li.classList.add("list-group-item-danger");
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
// Utility
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
  if(window.capsules.length > 0){
    const lastId = localStorage.getItem("pc_current_capsule");
    if(lastId) window.currentCapsule = window.capsules.find(c=>c.id===lastId);
    if(!window.currentCapsule) window.currentCapsule = window.capsules[0];
  }

  populateLearnSelector();
  updateLearnMode();
});
