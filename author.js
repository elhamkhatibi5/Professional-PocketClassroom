
// author.js

const $ = s => document.querySelector(s);

// المان‌ها
const titleInput = $("#titleInput");
const subjectInput = $("#subjectInput");
const levelInput = $("#levelInput");
const descInput = $("#descInput");
const notesInput = $("#notesInput");
const flashcardsList = $("#flashcardsList");
const addFlashcardBtn = $("#addFlashcardBtn");
const quizList = $("#quizList");
const addQuestionBtn = $("#addQuestionBtn");
const saveCapsuleBtn = $("#saveCapsuleBtn");
const importBtn = $("#importBtn");
const exportBtn = $("#exportBtn");
const newCapsuleBtn = $("#newCapsuleBtn");
const searchCapsule = $("#searchCapsule");

let currentCapsule = null;
let capsules = JSON.parse(localStorage.getItem("pc_capsules_index")||"[]");

function escapeHTML(str){
  return str.replace(/[&<>"']/g, c => ({
    "&":"&amp;",
    "<":"&lt;",
    ">":"&gt;",
    '"':"&quot;",
    "'":"&#39;"
  })[c]);
}

function saveCapsules(){
  localStorage.setItem("pc_capsules_index", JSON.stringify(capsules));
}

// Load form
function loadAuthorForm(){
  if(!currentCapsule) return;
  titleInput.value = currentCapsule.title || "";
  subjectInput.value = currentCapsule.subject || "";
  levelInput.value = currentCapsule.level || "Beginner";
  descInput.value = currentCapsule.description || "";
  notesInput.value = (currentCapsule.notes||[]).join("\n");
  renderFlashcards();
  renderQuiz();
}

// Flashcards
function renderFlashcards(){
  flashcardsList.innerHTML = "";
  (currentCapsule.flashcards||[]).forEach((f,i)=>{
    const div = document.createElement("div");
    div.className = "list-group-item d-flex gap-2 align-items-center mb-1";
    div.innerHTML = `
      <input type="text" class="form-control form-control-sm frontInput" value="${escapeHTML(f.front||'')}" placeholder="Front">
      <input type="text" class="form-control form-control-sm backInput" value="${escapeHTML(f.back||'')}" placeholder="Back">
      <button class="btn btn-sm btn-danger delFlashBtn"><i class="bi bi-trash"></i></button>
    `;
    flashcardsList.appendChild(div);

    div.querySelector(".delFlashBtn").addEventListener("click",()=>{
      currentCapsule.flashcards.splice(i,1);
      renderFlashcards();
    });
  });
}

// Quiz
function renderQuiz(){
  quizList.innerHTML = "";
  (currentCapsule.quiz||[]).forEach((q,i)=>{
    const div = document.createElement("div");
    div.className = "list-group-item mb-2 p-2";
    div.innerHTML = `
      <input type="text" class="form-control form-control-sm questionInput mb-1" value="${escapeHTML(q.question||'')}" placeholder="Question">
      <div class="d-flex gap-1 mb-1">
        ${q.choices.map((c,j)=>`<input type="text" class="form-control form-control-sm choiceInput" data-index="${j}" value="${escapeHTML(c||'')}" placeholder="Choice ${j+1}">`).join("")}
      </div>
      <select class="form-select form-select-sm correctInput mb-1">
        ${q.choices.map((_,j)=>`<option value="${j}" ${q.answer===j?"selected":""}>${j+1}</option>`).join("")}
      </select>
      <textarea class="form-control form-control-sm explanationInput" placeholder="Explanation">${escapeHTML(q.explanation||"")}</textarea>
      <button class="btn btn-sm btn-danger delQuizBtn mt-1"><i class="bi bi-trash"></i> Delete</button>
    `;
    quizList.appendChild(div);

    div.querySelector(".delQuizBtn").addEventListener("click",()=>{
      currentCapsule.quiz.splice(i,1);
      renderQuiz();
    });
  });
}

// New Capsule
newCapsuleBtn.addEventListener("click",()=>{
  currentCapsule = {id:Date.now().toString(), title:"", subject:"", level:"Beginner", description:"", notes:[], flashcards:[], quiz:[]};
  loadAuthorForm();
});

// Add Flashcard
addFlashcardBtn.addEventListener("click",()=>{
  if(!currentCapsule) return alert("Create a new capsule first!");
  currentCapsule.flashcards.push({front:"", back:""});
  renderFlashcards();
});

// Add Question
addQuestionBtn.addEventListener("click",()=>{
  if(!currentCapsule) return alert("Create a new capsule first!");
  currentCapsule.quiz.push({question:"", choices:["","","",""], answer:0, explanation:""});
  renderQuiz();
});

// Save Capsule
saveCapsuleBtn.addEventListener("click",()=>{
  if(!currentCapsule) return alert("No capsule to save!");
  currentCapsule.title = titleInput.value.trim() || currentCapsule.title;
  currentCapsule.subject = subjectInput.value.trim() || currentCapsule.subject;
  currentCapsule.level = levelInput.value;
  currentCapsule.description = descInput.value.trim();
  currentCapsule.notes = notesInput.value.split("\n").map(s=>s.trim()).filter(Boolean);

  // Flashcards (حذف خالی‌ها)
  currentCapsule.flashcards = Array.from(flashcardsList.querySelectorAll(".list-group-item"))
    .map(div=>{
      const front = div.querySelector(".frontInput").value.trim();
      const back = div.querySelector(".backInput").value.trim();
      if(!front && !back) return null;
      return {front, back};
    })
    .filter(Boolean);

  // Quiz (حذف خالی‌ها)
  currentCapsule.quiz = Array.from(quizList.querySelectorAll(".list-group-item"))
    .map((div,i)=>{
      const question = div.querySelector(".questionInput").value.trim();
      const choices = Array.from(div.querySelectorAll(".choiceInput")).map(inp=>inp.value.trim());
      const answer = parseInt(div.querySelector(".correctInput").value);
      const explanation = div.querySelector(".explanationInput").value.trim();
      if(!question && choices.every(c=>!c)) return null;
      return {question, choices, answer, explanation};
    })
    .filter(Boolean);

  const idx = capsules.findIndex(c=>c.id===currentCapsule.id);
  if(idx>-1) capsules[idx]=currentCapsule;
  else capsules.push(currentCapsule);

  saveCapsules();
  alert("Capsule saved!");
  populateLearnSelector();
});
