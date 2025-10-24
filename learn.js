
// ===============================
// Pocket Classroom - Learn.js (Fixed Full Sync with Library + Correct/Wrong Quiz)
// ===============================
(() => {
  const learnSelector = document.getElementById("learnSelector");
  const learnTitle = document.getElementById("learnTitle"); // اضافه شد برای هماهنگی عنوان
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

    if (capsules.length === 0) {
      const opt = document.createElement("option");
      opt.textContent = "No capsules available";
      learnSelector.appendChild(opt);
      disableLearn();
      return;
    }

    capsules.forEach((c, i) => {
      const opt = document.createElement("option");
      opt.value = c.id; // استفاده از id به جای index
      opt.textContent = c.title;
      learnSelector.appendChild(opt);
    });

    const lastId = localStorage.getItem("pc_current_capsule");
    currentCapsule = capsules.find(c => c.id === lastId) || capsules[0];
    learnSelector.value = currentCapsule.id;
    showContent();
  }

  function disableLearn() {
    if(learnTitle) learnTitle.textContent = "Learn Mode";
    notesList.innerHTML = "";
    flashcardDisplay.textContent = "No content";
    quizContainer.innerHTML = "<p class='text-muted'>No quiz available</p>";
  }

  // ===============================
  // Display Content
  // ===============================
  function showContent() {
    if (!currentCapsule) return;

    // عنوان کپسول
    if(learnTitle) learnTitle.textContent = currentCapsule.title;

    // Notes
    notesList.innerHTML = "";
    if (currentCapsule.notes && currentCapsule.notes.length > 0) {
      currentCapsule.notes.forEach(n => {
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

  function showFlashcard() {
    if (flashcards.length === 0) {
      flashcardDisplay.textContent = "No flashcards";
      return;
    }
    const card = flashcards[cardIndex];
    flashcardDisplay.textContent = card.front;
    flashcardDisplay.dataset.flipped = "false";
  }

  function flipFlashcard() {
    if (flashcards.length === 0) return;
    const flipped = flashcardDisplay.dataset.flipped === "true";
    flashcardDisplay.textContent = flipped
      ? flashcards[cardIndex].front
      : flashcards[cardIndex].back;
    flashcardDisplay.dataset.flipped = (!flipped).toString();
  }

  prevCardBtn.addEventListener("click", () => {
    if (flashcards.length === 0) return;
    cardIndex = (cardIndex - 1 + flashcards.length) % flashcards.length;
    showFlashcard();
  });

  nextCardBtn.addEventListener("click", () => {
    if (flashcards.length === 0) return;
    cardIndex = (cardIndex + 1) % flashcards.length;
    showFlashcard();
  });

  flipCardBtn.addEventListener("click", flipFlashcard);
  flashcardDisplay.addEventListener("click", flipFlashcard);

  // ===============================
  // Quiz Rendering (Correct/Wrong Indicator)
  // ===============================
  function renderQuiz(quiz) {
    quizContainer.innerHTML = "";
    if (!quiz || quiz.length === 0) {
      quizContainer.innerHTML = "<p class='text-muted'>No quiz questions</p>";
      return;
    }

    quiz.forEach((q, i) => {
      const cardDiv = document.createElement("div");
      cardDiv.className = "mb-3";
      cardDiv.innerHTML = `<p><strong>Q${i + 1}:</strong> ${q.question}</p>`;

      q.choices.forEach((choice, idx) => {
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

        input.addEventListener("change", () => {
          // ریست همه گزینه‌ها
          q.choices.forEach((_, j) => {
            const lbl = document.getElementById(`q${i}_opt${j}`).nextSibling;
            if(lbl) {
              lbl.style.color = "";
              lbl.textContent = q.choices[j];
            }
          });

          if (idx === q.correctIndex) {
            label.style.color = "green";
            label.textContent = choice + " ✅ Correct";
          } else {
            label.style.color = "red";
            label.textContent = choice + " ❌ Wrong";
            const correctLabel = document.getElementById(`q${i}_opt${q.correctIndex}`).nextSibling;
            if(correctLabel) {
              correctLabel.style.color = "green";
              correctLabel.textContent = q.choices[q.correctIndex] + " ✅ Correct";
            }
          }
        });
      });

      quizContainer.appendChild(cardDiv);
    });
  }

  // ===============================
  // Learn Selector
  // ===============================
  learnSelector.addEventListener("change", () => {
    const capsules = JSON.parse(localStorage.getItem("pc_capsules_index") || "[]");
    const selectedId = learnSelector.value;
    currentCapsule = capsules.find(c => c.id === selectedId);
    if(currentCapsule) {
      localStorage.setItem("pc_current_capsule", currentCapsule.id);
      showContent();
    }
  });

  // ===============================
  // For Main.js Compatibility
  // ===============================
  window.populateLearnSelector = function () {
    const capsules = JSON.parse(localStorage.getItem("pc_capsules_index") || "[]");
    learnSelector.innerHTML = "";
    capsules.forEach(c => {
      const opt = document.createElement("option");
      opt.value = c.id;
      opt.textContent = c.title;
      learnSelector.appendChild(opt);
    });

    if (currentCapsule) learnSelector.value = currentCapsule.id;
  };

  window.updateLearnMode = function () {
    const capsules = JSON.parse(localStorage.getItem("pc_capsules_index") || "[]");
    const lastId = localStorage.getItem("pc_current_capsule");
    currentCapsule = capsules.find(c => c.id === lastId) || capsules[0];
    showContent();
  };

  document.addEventListener("DOMContentLoaded", loadCapsules);
})();
