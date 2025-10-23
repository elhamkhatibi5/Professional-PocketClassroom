
// ===============================
// Pocket Classroom - Learn.js (Final)
// ===============================

(() => {
  // المان‌ها
  const learnSelector_Learn = document.getElementById("learnSelector");
  const notesList_Learn = document.getElementById("notesList");
  const flashcardDisplay_Learn = document.getElementById("flashcardDisplay");
  const prevCardBtn_Learn = document.getElementById("prevCardBtn");
  const flipCardBtn_Learn = document.getElementById("flipCardBtn");
  const nextCardBtn_Learn = document.getElementById("nextCardBtn");
  const quizContainer_Learn = document.getElementById("quizContainer");

  // حالت‌ها
  let currentCapsule_Learn = null;
  let currentFlashcards = [];
  let currentCardIndex = 0;

  // ===============================
  // Load Capsules
  // ===============================
  function loadCapsulesForLearning() {
    const capsules = JSON.parse(localStorage.getItem("pc_capsules_index") || "[]");
    learnSelector_Learn.innerHTML = "";

    if(capsules.length === 0){
      const opt = document.createElement("option");
      opt.textContent = "No capsules available";
      learnSelector_Learn.appendChild(opt);
      disableLearnSections();
      return;
    }

    capsules.forEach((c,i)=>{
      const opt = document.createElement("option");
      opt.value = i;
      opt.textContent = `${c.title} (${c.subject})`;
      learnSelector_Learn.appendChild(opt);
    });

    currentCapsule_Learn = capsules[0];
    displayLearnContent(currentCapsule_Learn);
  }

  function disableLearnSections(){
    notesList_Learn.innerHTML = "";
    flashcardDisplay_Learn.textContent = "No content";
    quizContainer_Learn.innerHTML = "<p class='text-muted'>No quiz available</p>";
  }

  // ===============================
  // Display Learn Content
  // ===============================
  function displayLearnContent(capsule){
    if(!capsule) return;

    // Notes
    notesList_Learn.innerHTML = "";
    if(capsule.notes && capsule.notes.length>0){
      capsule.notes.forEach(n=>{
        const li = document.createElement("li");
        li.className = "list-group-item";
        li.textContent = n;
        notesList_Learn.appendChild(li);
      });
    } else {
      notesList_Learn.innerHTML = "<li class='list-group-item text-muted'>No notes found</li>";
    }

    // Flashcards
    currentFlashcards = capsule.flashcards || [];
    currentCardIndex = 0;
    showFlashcard();

    // Quiz
    renderQuiz(capsule.quiz || []);
  }

  // ===============================
  // Flashcards
  // ===============================
  function showFlashcard(){
    if(currentFlashcards.length === 0){
      flashcardDisplay_Learn.textContent = "No flashcards";
      return;
    }
    const card = currentFlashcards[currentCardIndex];
    flashcardDisplay_Learn.textContent = card.front;
    flashcardDisplay_Learn.dataset.flipped = "false";
  }

  function flipFlashcard(){
    if(currentFlashcards.length === 0) return;
    const flipped = flashcardDisplay_Learn.dataset.flipped === "true";
    flashcardDisplay_Learn.textContent = flipped
      ? currentFlashcards[currentCardIndex].front
      : currentFlashcards[currentCardIndex].back;
    flashcardDisplay_Learn.dataset.flipped = (!flipped).toString();
  }

  prevCardBtn_Learn.addEventListener("click", ()=>{
    if(currentFlashcards.length===0) return;
    currentCardIndex = (currentCardIndex-1 + currentFlashcards.length) % currentFlashcards.length;
    showFlashcard();
  });

  nextCardBtn_Learn.addEventListener("click", ()=>{
    if(currentFlashcards.length===0) return;
    currentCardIndex = (currentCardIndex+1) % currentFlashcards.length;
    showFlashcard();
  });

  flipCardBtn_Learn.addEventListener("click", flipFlashcard);
  flashcardDisplay_Learn.addEventListener("click", flipFlashcard);

  // ===============================
  // Quiz
  // ===============================
  function renderQuiz(quiz){
    quizContainer_Learn.innerHTML = "";
    if(!quiz || quiz.length===0){
      quizContainer_Learn.innerHTML = "<p class='text-muted'>No quiz questions</p>";
      return;
    }

    // حداقل ۴ سوال نمایش داده شود
    const displayQuiz = [];
    while(displayQuiz.length < 4){
      for(let q of quiz){
        if(displayQuiz.length < 4) displayQuiz.push(q);
        else break;
      }
    }

    displayQuiz.forEach((q,i)=>{
      const card = document.createElement("div");
      card.className = "mb-3 p-2 border rounded";
      card.innerHTML = `
        <p><strong>Q${i+1}:</strong> ${q.question}</p>
        ${Array.isArray(q.choices) ? q.choices.map((opt,idx)=>`
          <div class="form-check">
            <input class="form-check-input" type="radio" name="q${i}" id="q${i}_opt${idx}" value="${idx}">
            <label class="form-check-label" for="q${i}_opt${idx}">${opt}</label>
          </div>
        `).join("") : ''}
      `;
      quizContainer_Learn.appendChild(card);
    });

    const checkBtn = document.createElement("button");
    checkBtn.className = "btn btn-success mt-2";
    checkBtn.textContent = "Check Answers";
    checkBtn.addEventListener("click", ()=>{
      checkAnswers(displayQuiz);
    });
    quizContainer_Learn.appendChild(checkBtn);
  }

  function checkAnswers(quiz){
    quiz.forEach((q,i)=>{
      const options = document.getElementsByName(`q${i}`);
      options.forEach(opt=>{
        const label = document.querySelector(`label[for="${opt.id}"]`);
        if(Number(opt.value) === q.correctIndex){
          // جواب درست سبز
          label.style.backgroundColor = "#d4edda";
          label.style.color = "#155724";
        } else if(opt.checked && Number(opt.value) !== q.correctIndex){
          // جواب اشتباه قرمز
          label.style.backgroundColor = "#f8d7da";
          label.style.color = "#721c24";
        } else {
          // بقیه بدون رنگ
          label.style.backgroundColor = "";
          label.style.color = "";
        }
      });
    });
  }

  // ===============================
  // Learn Selector
  // ===============================
  learnSelector_Learn.addEventListener("change", ()=>{
    const capsules = JSON.parse(localStorage.getItem("pc_capsules_index") || "[]");
    currentCapsule_Learn = capsules[Number(learnSelector_Learn.value)];
    displayLearnContent(currentCapsule_Learn);
  });

  // ===============================
  // Compatibility with main.js
  // ===============================
  window.populateLearnSelector = function(){
    const capsules = JSON.parse(localStorage.getItem("pc_capsules_index") || "[]");
    learnSelector_Learn.innerHTML = "";
    capsules.forEach((c,i)=>{
      const opt = document.createElement("option");
      opt.value = i;
      opt.textContent = `${c.title} (${c.subject})`;
      learnSelector_Learn.appendChild(opt);
    });
  };

  window.updateLearnMode = function(){
    const capsules = JSON.parse(localStorage.getItem("pc_capsules_index") || "[]");
    const index = Number(learnSelector_Learn.value) || 0;
    currentCapsule_Learn = capsules[index];
    displayLearnContent(currentCapsule_Learn);
  };

  document.addEventListener("DOMContentLoaded", loadCapsulesForLearning);

})();
