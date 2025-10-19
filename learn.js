
// ===============================
// Pocket Classroom - Learn Mode
// ===============================

const learnTitle = document.getElementById("learnTitle");
const learnSubject = document.getElementById("learnSubject");
const learnFlashcards = document.getElementById("learnFlashcards");
const learnQuiz = document.getElementById("learnQuiz");
const learnProgress = document.getElementById("learnProgress");

function updateLearnMode() {
  if (!currentCapsule) {
    learnTitle.textContent = "No Capsule Selected";
    learnSubject.textContent = "";
    learnFlashcards.innerHTML = "<p class='text-muted'>Select a capsule to start learning.</p>";
    learnQuiz.innerHTML = "";
    learnProgress.textContent = "";
    return;
  }

  learnTitle.textContent = currentCapsule.title || "Untitled Capsule";
  learnSubject.textContent = currentCapsule.subject || "";

  // ------------------ Flashcards ------------------
  learnFlashcards.innerHTML = "";
  (currentCapsule.flashcards || []).forEach(fc => {
    const card = document.createElement("div");
    card.className = "card mb-2 p-2";
    card.innerHTML = `
      <div class="front">${fc.front}</div>
      <div class="back d-none">${fc.back}${fc.explanation ? "<br><small>"+fc.explanation+"</small>":""}</div>
      <button class="btn btn-sm btn-secondary mt-1 flip-btn">Flip</button>
    `;
    learnFlashcards.appendChild(card);

    card.querySelector(".flip-btn").addEventListener("click", ()=>{
      card.querySelector(".front").classList.toggle("d-none");
      card.querySelector(".back").classList.toggle("d-none");
    });
  });

  // ------------------ Quiz ------------------
  learnQuiz.innerHTML = "";
  let correctCount = 0;
  (currentCapsule.quiz || []).forEach((q,i)=>{
    const div = document.createElement("div");
    div.className = "card mb-2 p-2";
    div.innerHTML = `
      <p><strong>Q${i+1}:</strong> ${q.question}</p>
      <div class="d-flex flex-column gap-1">
        ${q.choices.map((c,j)=>`<button class="btn btn-sm btn-outline-primary choice-btn" data-index="${j}">${c}</button>`).join("")}
      </div>
      <div class="mt-1 result text-success fw-bold d-none"></div>
    `;
    learnQuiz.appendChild(div);

    div.querySelectorAll(".choice-btn").forEach(btn=>{
      btn.addEventListener("click", ()=>{
        const selected = parseInt(btn.dataset.index);
        const resultDiv = div.querySelector(".result");
        if (selected === q.answer) {
          resultDiv.textContent = "Correct ✅";
          correctCount++;
        } else {
          resultDiv.textContent = `Wrong ❌ (Correct: ${q.choices[q.answer]})`;
        }
        resultDiv.classList.remove("d-none");
        // disable all buttons
        div.querySelectorAll(".choice-btn").forEach(b=>b.disabled=true);
        learnProgress.textContent = `Score: ${correctCount} / ${currentCapsule.quiz.length}`;
      });
    });
  });

  // Initial progress
  learnProgress.textContent = currentCapsule.quiz.length ? `Score: 0 / ${currentCapsule.quiz.length}` : "";
}

// ------------------ Initial Learn Load ------------------
if (typeof updateLearnMode === "function") updateLearnMode();
