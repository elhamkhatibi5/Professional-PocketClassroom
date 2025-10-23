
// ===============================
// Pocket Classroom - Learn.js (Fully Synced & Instant Feedback)
// ===============================
(() => {
  const learnSelector = document.getElementById("learnSelector");
  const notesList = document.getElementById("notesList");
  const flashcardDisplay = document.getElementById("flashcardDisplay");
  const prevCardBtn = document.getElementById("prevCardBtn");
  const flipCardBtn = document.getElementById("flipCardBtn");
  const nextCardBtn = document.getElementById("nextCardBtn");
  const quizContainer = document.getElementById("quizContainer");

  let currentCapsule = null;
  let flashcards = [];
  let cardIndex = 0;

  // ===============================
  // Load Capsules
  // ===============================
  function loadCapsules() {
    const capsules = JSON.parse(localStorage.getItem("pc_capsules_index") || "[]");
    learnSelector.innerHTML = "";

    if(capsules.length === 0){
      const opt = document.createElement("option");
      opt.textContent = "No capsules available";
      learnSelector.appendChild(opt);
      disableLearn();
      return;
    }

    capsules.forEach((c,i)=>{
      const opt = document.createElement("option");
      opt.value = i;
      opt.textContent = `${c.title} (${c.subject})`;
      learnSelector.appendChild(opt);
    });

    const lastId = localStorage.getItem("pc_current_capsule");
    currentCapsule = capsules.find(c=>c.id===lastId) || capsules[0];
    learnSelector.value = capsules.indexOf(currentCapsule);
    showContent();
  }

  function disableLearn(){
    notesList.innerHTML = "";
    flashcardDisplay.textContent = "No content";
    quizContainer.innerHTML = "<p class='text-muted'>No quiz available</p>";
  }

  // ===============================
  // Display Content
  // ===============================
  function showContent(){
    if(!currentCapsule) return;

    // Notes
    notesList.innerHTML = "";
    if(currentCapsule.notes && currentCapsule.notes.length>0){
      currentCapsule.notes.forEach(n=>{
        const li = document.createElement("li");
        li.className = "list-group-item";
        li.textContent = n;
        notesList.appendChild(li);
      });
    } else {
      notesList.innerHTML = "<li class='list-group-item text-muted'>No notes found</li>";
    }

    // Flashcards
    flashcards = currentCapsule.flashcards || [];
    cardIndex = 0;
    showFlashcard();

    // Quiz
    renderQuiz(currentCapsule.quiz || []);
  }

  function showFlashcard(){
    if(flashcards.length === 0){
      flashcardDisplay.textContent = "No flashcards";
      return;
    }
    const card = flashcards[cardIndex];
    flashcardDisplay.textContent = card.front;
    flashcardDisplay.dataset.flipped = "false";
  }

  function flipFlashcard(){
    if(flashcards.length === 0) return;
    const flipped = flashcardDisplay.dataset.flipped === "true";
    flashcardDisplay.textContent = flipped
      ? flashcards[cardIndex].front
      : flashcards[cardIndex].back;
    flashcardDisplay.dataset.flipped = (!flipped).toString();
  }

  prevCardBtn.addEventListener("click", ()=>{
    if(flashcards.length === 0) return;
    cardIndex = (cardIndex-1 + flashcards.length) % flashcards.length;
    showFlashcard();
  });

  nextCardBtn.addEventListener("click", ()=>{
    if(flashcards.length === 0) return;
    cardIndex = (cardIndex+1) % flashcards.length;
    showFlashcard();
  });

  flipCardBtn.addEventListener("click", flipFlashcard);
  flashcardDisplay.addEventListener("click", flipFlashcard);

  // ===============================
  // Quiz Rendering
  // ===============================
  function renderQuiz(quiz){
    quizContainer.innerHTML = "";
    if(!quiz || quiz.length===0){
      quizContainer.innerHTML = "<p class='text-muted'>No quiz questions</p>";
      return;
    }

    quiz.forEach((q,i)=>{
      const cardDiv = document.createElement("div");
      cardDiv.className = "mb-3";
      cardDiv.innerHTML = `<p><strong>Q${i+1}:</strong> ${q.question}</p>`;

      q.choices.forEach((choice,idx)=>{
        const choiceDiv = document.createElement("div");
        choiceDiv.className = "form-check";

        const input = document.createElement("input");
        input.className = "form-check-input";
        input.type = "radio";
        input.name = `q${i}`;
        input.id = `q${i}_opt${idx}`;
        input.value = choice;

        const label = document.createElement("label");
        label.className = "form-check-label";
        label.htmlFor = input.id;
        label.textContent = choice;

        choiceDiv.appendChild(input);
        choiceDiv.appendChild(label);
        cardDiv.appendChild(choiceDiv);

        // فوراً رنگ‌بندی پاسخ
        input.addEventListener("change", ()=>{
          if(idx === q.correctIndex){
            label.style.color = "green";
          } else {
            label.style.color = "red";
            // نمایش پاسخ درست
            const correctLabel = document.getElementById(`q${i}_opt${q.correctIndex}`).nextSibling;
            if(correctLabel) correctLabel.style.color = "green";
          }
        });
      });

      quizContainer.appendChild(cardDiv);
    });
  }

  // ===============================
  // Learn Selector
  // ===============================
  learnSelector.addEventListener("change", ()=>{
    const capsules = JSON.parse(localStorage.getItem("pc_capsules_index") || "[]");
    currentCapsule = capsules[Number(learnSelector.value)];
    localStorage.setItem("pc_current_capsule", currentCapsule.id);
    showContent();
  });

  // ===============================
  // For Main.js Compatibility
  // ===============================
  window.populateLearnSelector = function(){
    const capsules = JSON.parse(localStorage.getItem("pc_capsules_index") || "[]");
    learnSelector.innerHTML = "";
    capsules.forEach((c,i)=>{
      const opt = document.createElement("option");
      opt.value = i;
      opt.textContent = `${c.title} (${c.subject})`;
      learnSelector.appendChild(opt);
    });

    // هماهنگ شدن با currentCapsule
    if(currentCapsule){
      const index = capsules.indexOf(currentCapsule);
      if(index>=0) learnSelector.value = index;
    }
  };

  window.updateLearnMode = showContent;

  document.addEventListener("DOMContentLoaded", loadCapsules);
})();
