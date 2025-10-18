
// main.js

// Sections
const librarySection = document.getElementById("library");
const authorSection = document.getElementById("author");
const learnSection = document.getElementById("learn");

// Navbar links
const navLinks = document.querySelectorAll(".nav-link");

// Theme toggle
const themeToggle = document.getElementById("themeToggle");
const body = document.body;

// Capsules
let capsules = JSON.parse(localStorage.getItem("pc_capsules_index")) || [];
let currentCapsule;

// Show section
function showSection(section) {
  librarySection.style.display = "none";
  authorSection.style.display = "none";
  learnSection.style.display = "none";
  section.style.display = "block";
}

// Navbar click
navLinks.forEach(link=>{
  link.addEventListener("click", e=>{
    e.preventDefault();
    const target = link.getAttribute("href");
    if(target === "#library") showSection(librarySection);
    else if(target === "#author") showSection(authorSection);
    else if(target === "#learn") showSection(learnSection);
  });
});

// Theme functions
function loadTheme() {
  const saved = localStorage.getItem("pc_theme");
  if(saved) body.className = saved;
  updateThemeButton();
}

function toggleTheme() {
  if(body.classList.contains("light-mode")) body.className="dark-mode";
  else body.className="light-mode";
  localStorage.setItem("pc_theme", body.className);
  updateThemeButton();
}

function updateThemeButton() {
  themeToggle.innerHTML = body.classList.contains("light-mode") ? '<i class="bi bi-moon-stars"></i> Dark' : '<i class="bi bi-sun"></i> Light';
}

themeToggle.addEventListener("click", toggleTheme);

// INITIAL LOAD
document.addEventListener("DOMContentLoaded", ()=>{

  // If no capsules, create sample
  if(capsules.length === 0){
    const sample = {
      id: "caps1",
      title: "Sample Capsule",
      subject: "Math",
      level: "Beginner",
      description: "This is a sample capsule",
      notes: ["Introduction to Math", "Numbers and Operations"],
      flashcards: [
        { front: "2+2", back: "4" },
        { front: "3+5", back: "8" }
      ],
      quiz: [
        { question: "2+3=?", choices:["3","4","5","6"], answer:2 }
      ],
      updatedAt: new Date().toISOString()
    };
    capsules.push(sample);
    localStorage.setItem("pc_capsules_index", JSON.stringify(capsules));
  }

  currentCapsule = capsules[0];

  showSection(librarySection);
  loadTheme();
  loadLibrary();
  loadAuthorForm();
  updateLearnMode();
});

// -------------------- Library --------------------
function loadLibrary(){
  const capsuleGrid = document.getElementById("capsuleGrid");
  capsuleGrid.innerHTML = "";

  capsules.forEach((cap, idx)=>{
    const col = document.createElement("div");
    col.className = "col-md-4";
    col.innerHTML = `
      <div class="card shadow-sm">
        <div class="card-body">
          <h5 class="card-title">${cap.title}</h5>
          <h6 class="card-subtitle mb-2 text-muted">${cap.subject} • ${cap.level}</h6>
          <p class="card-text">${cap.description}</p>
          <div class="d-flex justify-content-between mt-3">
            <button class="btn btn-sm btn-primary learn-btn">Learn</button>
            <button class="btn btn-sm btn-warning edit-btn">Edit</button>
          </div>
        </div>
      </div>
    `;
    capsuleGrid.appendChild(col);

    // Buttons
    col.querySelector(".learn-btn").onclick = ()=>{
      currentCapsule = capsules[idx];
      loadAuthorForm();
      updateLearnMode();
      showSection(learnSection);
    };
    col.querySelector(".edit-btn").onclick = ()=>{
      currentCapsule = capsules[idx];
      loadAuthorForm();
      showSection(authorSection);
    };
  });
}

// -------------------- Author Form --------------------
function loadAuthorForm() {
  if(!currentCapsule) return;

  // Meta
  document.getElementById("titleInput").value = currentCapsule.title;
  document.getElementById("subjectInput").value = currentCapsule.subject;
  document.getElementById("levelInput").value = currentCapsule.level;
  document.getElementById("descInput").value = currentCapsule.description;

  // Notes
  document.getElementById("notesInput").value = currentCapsule.notes.join("\n");

  // Flashcards
  const flashcardsList = document.getElementById("flashcardsList");
  flashcardsList.innerHTML = "";
  currentCapsule.flashcards.forEach((fc)=>{
    const div = document.createElement("div");
    div.className = "list-group-item d-flex justify-content-between align-items-center";
    div.innerHTML = `<span>${fc.front} → ${fc.back}</span>`;
    flashcardsList.appendChild(div);
  });

  // Quiz
  const quizList = document.getElementById("quizList");
  quizList.innerHTML = "";
  currentCapsule.quiz.forEach((q,i)=>{
    const div = document.createElement("div");
    div.className = "list-group-item";
    div.innerHTML = `<strong>Q${i+1}:</strong> ${q.question} (Answer: ${q.choices[q.answer]})`;
    quizList.appendChild(div);
  });
}

// -------------------- Learn Mode --------------------
function updateLearnMode(){
  if(!currentCapsule) return;

  const learnSelector = document.getElementById("learnSelector");
  learnSelector.innerHTML = "";
  capsules.forEach((cap,i)=>{
    const opt = document.createElement("option");
    opt.value = i;
    opt.textContent = cap.title;
    learnSelector.appendChild(opt);
  });
  learnSelector.value = capsules.indexOf(currentCapsule);

  // Notes
  const notesList = document.getElementById("notesList");
  notesList.innerHTML = "";
  currentCapsule.notes.forEach(note=>{
    const li = document.createElement("li");
    li.className = "list-group-item";
    li.textContent = note;
    notesList.appendChild(li);
  });

  // Flashcards
  let flashIndex = 0;
  const flashcardDisplay = document.getElementById("flashcardDisplay");
  flashcardDisplay.textContent = currentCapsule.flashcards[flashIndex].front;

  document.getElementById("flipCardBtn").onclick = ()=>{
    const card = currentCapsule.flashcards[flashIndex];
    flashcardDisplay.textContent = flashcardDisplay.textContent === card.front ? card.back : card.front;
  };
  document.getElementById("nextCardBtn").onclick = ()=>{
    flashIndex = (flashIndex + 1) % currentCapsule.flashcards.length;
    flashcardDisplay.textContent = currentCapsule.flashcards[flashIndex].front;
  };
  document.getElementById("prevCardBtn").onclick = ()=>{
    flashIndex = (flashIndex - 1 + currentCapsule.flashcards.length) % currentCapsule.flashcards.length;
    flashcardDisplay.textContent = currentCapsule.flashcards[flashIndex].front;
  };

  // Quiz
  const quizContainer = document.getElementById("quizContainer");
  quizContainer.innerHTML = "";
  currentCapsule.quiz.forEach((q,i)=>{
    const div = document.createElement("div");
    div.className = "mb-2";
    div.innerHTML = `<strong>Q${i+1}:</strong> ${q.question} <br> Choices: ${q.choices.join(", ")}`;
    quizContainer.appendChild(div);
  });
}

// Learn selector change
document.getElementById("learnSelector").addEventListener("change", e=>{
  currentCapsule = capsules[e.target.value];
  loadAuthorForm();
  updateLearnMode();
});
