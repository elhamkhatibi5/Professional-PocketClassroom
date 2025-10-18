
// learn.js

// المان‌ها
const notesList = $("#notesList");
const flashcardDisplay = $("#flashcardDisplay");
const prevCardBtn = $("#prevCardBtn");
const nextCardBtn = $("#nextCardBtn");
const flipCardBtn = $("#flipCardBtn");
const quizContainer = $("#quizContainer");
const learnSelector = $("#learnSelector");

let flashIndex = 0;
let showingFront = true;
let quizIndex = 0;
let score = 0;

// آپدیت Learn Mode
function updateLearnMode() {
  if(!currentCapsule) {
    notesList.innerHTML = "";
    flashcardDisplay.textContent = "Select a capsule";
    quizContainer.innerHTML = "";
    return;
  }

  // Notes
  notesList.innerHTML = "";
  currentCapsule.notes.forEach(note=>{
    const li = document.createElement("li");
    li.textContent = note;
    notesList.appendChild(li);
  });

  // Flashcards
  flashIndex = 0;
  showingFront = true;
  renderFlashcard();

  // Quiz
  quizIndex = 0;
  score = 0;
  renderQuizQuestion();
}

// فلش‌کارت
function renderFlashcard() {
  if(!currentCapsule.flashcards || currentCapsule.flashcards.length===0){
    flashcardDisplay.textContent = "No flashcards";
    return;
  }
  const card = currentCapsule.flashcards[flashIndex];
  flashcardDisplay.textContent = showingFront ? card.front : card.back;
}

flipCardBtn.addEventListener("click",()=>{
  showingFront = !showingFront;
  renderFlashcard();
});

prevCardBtn.addEventListener("click",()=>{
  if(flashIndex>0) flashIndex--;
  showingFront = true;
  renderFlashcard();
});

nextCardBtn.addEventListener("click",()=>{
  if(currentCapsule.flashcards && flashIndex<currentCapsule.flashcards.length-1) flashIndex++;
  showingFront = true;
  renderFlashcard();
});

// Quiz
function renderQuizQuestion() {
  if(!currentCapsule.quiz || currentCapsule.quiz.length===0){
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
      // بعد از 700ms سوال بعدی
      setTimeout(()=>{
        quizIndex++;
        renderQuizQuestion();
      },700);
    });
  });
}

// تغییر کپسول از Selector
learnSelector.addEventListener("change", ()=>{
  const title = learnSelector.value;
  currentCapsule = capsules.find(c=>c.title===title);
  flashIndex = 0;
  showingFront = true;
  quizIndex = 0;
  score = 0;
  updateLearnMode();
});

// وقتی DOM بارگذاری شد، selector را پر کن و حالت Learn را آپدیت کن
document.addEventListener("DOMContentLoaded", ()=>{
  if(capsules.length>0){
    learnSelector.innerHTML = "";
    capsules.forEach(c=>{
      const opt = document.createElement("option");
      opt.value = c.title;
      opt.textContent = c.title;
      learnSelector.appendChild(opt);
    });
    currentCapsule = capsules[0];
    updateLearnMode();
  }
});
