
// ==========================
// learn.js - Learn Mode Corrected
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
let capsules = loadCapsules(); // از utils.js
if(capsules.length === 0){
  // اگر LocalStorage خالی بود، نمونه اولیه بساز
  capsules = [
    {
      id: "capsule1",
      title: "کپسول اول",
      notes: ["یادداشت 1", "یادداشت 2"],
      flashcards: [
        { front: "سوال 1", back: "جواب 1" },
        { front: "سوال 2", back: "جواب 2" }
      ],
      quiz: [
        { question: "سوال کویز 1", choices: ["گزینه 1", "گزینه 2"], answer: 0 },
        { question: "سوال کویز 2", choices: ["گزینه A", "گزینه B"], answer: 1 }
      ]
    }
  ];
  saveCapsules(capsules);
}

let currentCapsule = capsules[0];
let currentIndex = 0;
let showingFront = true;
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
populateLearnSelector();

// ==========================
// Update Learn Mode
// ==========================
function updateLearnMode(){
  if(!currentCapsule) return;

  // Notes
  notesList.innerHTML = "";
  currentCapsule.notes.forEach(note=>{
    const li = document.createElement("li");
    li.textContent = note;
    li.className = "list-group-item";
    notesList.appendChild(li);
  });

  // Flashcards
  currentIndex = 0;
  showingFront = true;
  renderFlashcard();

  // Quiz
  quizIndex = 0;
  score = 0;
  renderQuizQuestion();
}

// ==========================
// Flashcards
// ==========================
function renderFlashcard(){
  if(!currentCapsule.flashcards.length){
    flashcardDisplay.textContent = "No flashcards";
    return;
  }
  const card = currentCapsule.flashcards[currentIndex];
  flashcardDisplay.textContent = showingFront ? card.front : card.back;
}

flipCardBtn.addEventListener("click", ()=>{
  showingFront = !showingFront;
  renderFlashcard();
});

prevCardBtn.addEventListener("click", ()=>{
  if(currentIndex > 0) currentIndex--;
  showingFront = true;
  renderFlashcard();
});

nextCardBtn.addEventListener("click", ()=>{
  if(currentIndex < currentCapsule.flashcards.length-1) currentIndex++;
  showingFront = true;
  renderFlashcard();
});

// ==========================
// Quiz
// ==========================
function renderQuizQuestion(){
  if(!currentCapsule.quiz.length){
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
