
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

let currentCapsule = null;
let capsules = JSON.parse(localStorage.getItem("pc_capsules_index") || "[]");

// HTML escaping
function escapeHTML(str) {
  return str.replace(/[&<>"']/g, c => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  })[c]);
}

// Save capsules to LocalStorage
function saveCapsules() {
  localStorage.setItem("pc_capsules_index", JSON.stringify(capsules));
  if (typeof populateLearnSelector === "function") populateLearnSelector();
}

// Load form with current capsule
function loadAuthorForm() {
  if (!currentCapsule) return;
  titleInput.value = currentCapsule.title || "";
  subjectInput.value = currentCapsule.subject || "";
  levelInput.value = currentCapsule.level || "Beginner";
  descInput.value = currentCapsule.description || "";
  notesInput.value = (currentCapsule.notes || []).join("\n");
  renderFlashcards();
  renderQuiz();
}

// ------------------ Flashcards ------------------
function renderFlashcards() {
  flashcardsList.innerHTML = "";
  (currentCapsule.flashcards || []).forEach(f => {
    const div = document.createElement("div");
    div.className = "list-group-item d-flex gap-2 align-items-center mb-1";
    div.dataset.id = f.id; // ✅ id یکتا
    div.innerHTML = `
      <input type="text" class="form-control form-control-sm frontInput" value="${escapeHTML(f.front||'')}" placeholder="Front">
      <input type="text" class="form-control form-control-sm backInput" value="${escapeHTML(f.back||'')}" placeholder="Back">
      <button class="btn btn-sm btn-danger delFlashBtn"><i class="bi bi-trash"></i></button>
    `;
    flashcardsList.appendChild(div);

    div.querySelector(".delFlashBtn").addEventListener("click", () => {
      currentCapsule.flashcards = currentCapsule.flashcards.filter(fc => fc.id !== f.id);
      renderFlashcards();
    });
  });
}

addFlashcardBtn.addEventListener("click", () => {
  if (!currentCapsule) return alert("Create a capsule first!");
  currentCapsule.flashcards.push({id: Date.now().toString(), front:"", back:""});
  renderFlashcards();
});

// ------------------ Quiz ------------------
function renderQuiz() {
  quizList.innerHTML = "";
  (currentCapsule.quiz || []).forEach(q => {
    const div = document.createElement("div");
    div.className = "list-group-item mb-2 p-2";
    div.dataset.id = q.id; // ✅ id یکتا
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

    div.querySelector(".delQuizBtn").addEventListener("click", ()=>{
      currentCapsule.quiz = currentCapsule.quiz.filter(qq => qq.id !== q.id);
      renderQuiz();
    });
  });
}

addQuestionBtn.addEventListener("click", ()=>{
  if (!currentCapsule) return alert("Create a capsule first!");
  currentCapsule.quiz.push({
    id: Date.now().toString(),
    question:"",
    choices:["","","",""],
    answer:0,
    explanation:""
  });
  renderQuiz();
});

// ------------------ Save Capsule ------------------
saveCapsuleBtn.addEventListener("click", ()=>{
  if (!currentCapsule) return alert("No capsule to save!");

  currentCapsule.title = titleInput.value.trim() || currentCapsule.title;
  currentCapsule.subject = subjectInput.value.trim() || currentCapsule.subject;
  currentCapsule.level = levelInput.value;
  currentCapsule.description = descInput.value.trim();
  currentCapsule.notes = notesInput.value.split("\n").map(s=>s.trim()).filter(Boolean);

  // Flashcards
  currentCapsule.flashcards = Array.from(flashcardsList.querySelectorAll(".list-group-item"))
    .map(div=>{
      const id = div.dataset.id;
      const front = div.querySelector(".frontInput").value.trim();
      const back = div.querySelector(".backInput").value.trim();
      if(!front && !back) return null;
      return {id, front, back};
    }).filter(Boolean);

  // Quiz
  currentCapsule.quiz = Array.from(quizList.querySelectorAll(".list-group-item"))
    .map(div=>{
      const id = div.dataset.id;
      const question = div.querySelector(".questionInput").value.trim();
      const choices = Array.from(div.querySelectorAll(".choiceInput")).map(inp=>inp.value.trim());
      const answer = parseInt(div.querySelector(".correctInput").value);
      const explanation = div.querySelector(".explanationInput").value.trim();
      if(!question && choices.every(c=>!c)) return null;
      return {id, question, choices, answer, explanation};
    }).filter(Boolean);

  const idx = capsules.findIndex(c=>c.id===currentCapsule.id);
  if(idx>-1) capsules[idx] = currentCapsule;
  else capsules.push(currentCapsule);

  saveCapsules();
  alert("Capsule saved!");
  loadAuthorForm();
});

// ------------------ New Capsule ------------------
newCapsuleBtn.addEventListener("click", ()=>{
  const newCap = {
    id: Date.now().toString(),
    title:"",
    subject:"",
    level:"Beginner",
    description:"",
    notes:[],
    flashcards:[],
    quiz:[]
  };
  capsules.push(newCap);
  currentCapsule = newCap;
  saveCapsules();
  loadAuthorForm();
});

// ------------------ Export ------------------
exportBtn.addEventListener("click", ()=>{
  const dataStr = JSON.stringify({capsules}, null, 2);
  const blob = new Blob([dataStr], {type:"application/json"});
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "capsules.json";
  a.click();
  URL.revokeObjectURL(url);
});

// ------------------ Import ------------------
importBtn.addEventListener("click", ()=>{
  const input = document.createElement("input");
  input.type = "file";
  input.accept = ".json";
  input.addEventListener("change", e=>{
    const file = e.target.files[0];
    if(!file) return;
    const reader = new FileReader();
    reader.onload = ev=>{
      try {
        const imported = JSON.parse(ev.target.result);
        if(imported.capsules && Array.isArray(imported.capsules)){
          imported.capsules.forEach(c=>{
            if(!c.id) c.id = Date.now().toString() + Math.random();
            capsules.push(c);
          });
          saveCapsules();
          alert("Capsules imported successfully!");
        }
      } catch(err){ alert("Invalid JSON file."); }
    };
    reader.readAsText(file);
  });
  input.click();
});

// ------------------ Initial Load ------------------
if(capsules.length>0){
  currentCapsule = capsules[0];
  loadAuthorForm();
}
