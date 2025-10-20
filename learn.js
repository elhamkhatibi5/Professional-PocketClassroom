// ==========================
// learn.js - Learn Mode با هماهنگی Author Mode
// ==========================

// المان‌ها
const learnSelector = document.getElementById("learnSelector");
const notesList = document.getElementById("notesList");
const flashcardDisplay = document.getElementById("flashcardDisplay");
const prevCardBtn = document.getElementById("prevCardBtn");
const nextCardBtn = document.getElementById("nextCardBtn");
const flipCardBtn = document.getElementById("flipCardBtn");
const quizContainer = document.getElementById("quizContainer");

// وضعیت Learn Mode
let capsules = JSON.parse(localStorage.getItem("pc_capsules_index")) || [];
let currentCapsule = capsules[0] || null;
let currentCardIndex = 0;
let showingAnswer = false;
let quizIndex = 0;
let score = 0;

// ==========================
// پر کردن Selector
// ==========================
function populateLearnSelector(){
  learnSelector.innerHTML = "";
  capsules.forEach(c=>{
    const option = document.createElement("option");
    option.value = c.id;
    option.textContent = c.title;
    learnSelector.appendChild(option);
  });
  if(currentCapsule) learnSelector.value = currentCapsule.id;
}

// ==========================
// آپدیت Learn Mode
// ==========================
function updateLearnMode(){
  // همگام سازی با LocalStorage
  capsules = JSON.parse(localStorage.getItem("pc_capsules_index")) || [];
  currentCapsule = capsules.find(c => c.id === currentCapsule?.id) || capsules[0];
  if(!currentCapsule) return;

  // Notes
  notesList.innerHTML = "";
  currentCapsule.notes.forEach(note=>{
    const li = document.createElement("li");
    li.className = "list-group-item";
    li.textContent = note;
    notesList.appendChild(li);
  });

  // Flashcards
  currentCardIndex = 0;
  showingAnswer = false;
  showFlashcard();

  // Quiz
  quizIndex = 0;
  score = 0;
  renderQuiz();

  // Selector
  populateLearnSelector();
}

// ==========================
// Flashcards
// ==========================
function showFlashcard(){
  if(!currentCapsule.flashcards.length){
    flashcardDisplay.textContent = "No flashcards";
    return;
  }
  const card = currentCapsule.flashcards[currentCardIndex];
  flashcardDisplay.textContent = showingAnswer ? card.back : card.front;
}

flipCardBtn.addEventListener("click", ()=>{
  showingAnswer = !showingAnswer;
  showFlashcard();
});

prevCardBtn.addEventListener("click", ()=>{
  if(currentCardIndex > 0) currentCardIndex--;
  showingAnswer = false;
  showFlashcard();
});

nextCardBtn.addEventListener("click", ()=>{
  if(currentCardIndex < currentCapsule.flashcards.length-1) currentCardIndex++;
  showingAnswer = false;
  showFlashcard();
});

// ==========================
// Quiz
// ==========================
function renderQuiz(){
  quizContainer.innerHTML = "";
  if(!currentCapsule.quiz.length){
    quizContainer.innerHTML = "<p>No quiz questions</p>";
    return;
  }

  currentCapsule.quiz.forEach((q,idx)=>{
    const card = document.createElement("div");
    card.className = "mb-2";
    card.innerHTML = `<p><strong>Q${idx+1}:</strong> ${q.question}</p>`;
    const div = document.createElement("div");
    q.choices.forEach((choice,i)=>{
      const btn = document.createElement("button");
      btn.className = "btn btn-outline-primary btn-sm me-2";
      btn.textContent = choice;
      btn.addEventListener("click", ()=>{
        if(i === q.answer) btn.classList.add("btn-success");
        else btn.classList.add("btn-danger");
      });
      div.appendChild(btn);
    });
    card.appendChild(div);
    quizContainer.appendChild(card);
  });
}

// ==========================
// تغییر کپسول از Selector
// ==========================
learnSelector.addEventListener("change", ()=>{
  const id = learnSelector.value;
  currentCapsule = capsules.find(c => c.id === id);
  updateLearnMode();
});

// ==========================
// فراخوانی اولیه
// ==========================
updateLearnMode();
