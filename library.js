
// ===== Library.js =====
const capsuleGrid = document.getElementById("library");
const newCapsuleBtn = document.getElementById("newCapsuleBtn");
const learnSelector = document.getElementById("learnSelector");

// ۴ کپسول نمونه
if(!localStorage.getItem("pc_capsules")){
  capsules = [
    {
      id: crypto.randomUUID(),
      title: "Biology Basics",
      subject: "Biology",
      level: "Beginner",
      description: "Intro to biology concepts",
      notes: ["Cell structure", "DNA basics"],
      flashcards: [{front:"Cell", back:"Basic unit of life"}, {front:"DNA", back:"Genetic material"}],
      quiz: [{question:"DNA shape?", choices:["Double helix","Single helix","Circle","Triangle"], answer:0}]
    },
    {
      id: crypto.randomUUID(),
      title: "Physics Intro",
      subject: "Physics",
      level: "Intermediate",
      description: "Basic physics principles",
      notes: ["Newton's laws", "Energy forms"],
      flashcards: [{front:"Force", back:"Mass x Acceleration"}],
      quiz: [{question:"Unit of force?", choices:["N","J","W","Pa"], answer:0}]
    },
    {
      id: crypto.randomUUID(),
      title: "Chemistry 101",
      subject: "Chemistry",
      level: "Beginner",
      description: "Intro to chemistry",
      notes: ["Periodic table", "Atoms"],
      flashcards: [{front:"Atom", back:"Smallest particle"}],
      quiz: [{question:"H2O is?", choices:["Water","Oxygen","Hydrogen","Salt"], answer:0}]
    },
    {
      id: crypto.randomUUID(),
      title: "Math Fun",
      subject: "Math",
      level: "Advanced",
      description: "Challenging math problems",
      notes: ["Algebra", "Geometry"],
      flashcards: [{front:"Pythagoras theorem", back:"a² + b² = c²"}],
      quiz: [{question:"2+2?", choices:["3","4","5","6"], answer:1}]
    }
  ];
  localStorage.setItem("pc_capsules", JSON.stringify(capsules));
} else {
  capsules = JSON.parse(localStorage.getItem("pc_capsules"));
}

// ===== Render Library =====
function renderLibrary() {
  capsuleGrid.innerHTML = "";
  capsules.forEach(c => {
    const div = document.createElement("div");
    div.className = "card capsule-card mb-3 shadow-sm p-2";
    div.innerHTML = `
      <div class="card-body">
        <h5 class="card-title">${c.title}</h5>
        <p class="card-text text-muted">${c.description}</p>
        <span class="badge ${c.level==="Beginner"?"bg-success":c.level==="Intermediate"?"bg-warning":"bg-danger"}">${c.level}</span>
        <div class="mt-2 text-end">
          <button class="btn btn-outline-primary btn-sm learnBtn"><i class="bi bi-play-circle"></i> Learn</button>
          <button class="btn btn-outline-secondary btn-sm editBtn"><i class="bi bi-pencil"></i> Edit</button>
          <button class="btn btn-outline-danger btn-sm delBtn"><i class="bi bi-trash"></i> Delete</button>
        </div>
      </div>
    `;
    capsuleGrid.appendChild(div);

    // دکمه‌ها
    div.querySelector(".learnBtn").addEventListener("click", ()=>{
      currentCapsule = c;
      if(typeof updateLearnMode==="function") updateLearnMode();
      window.scrollTo({top: document.getElementById("learn").offsetTop-70, behavior:"smooth"});
      showSection(learnSection);
    });

    div.querySelector(".editBtn").addEventListener("click", ()=>{
      currentCapsule = c;
      if(typeof loadAuthorForm==="function") loadAuthorForm();
      window.scrollTo({top: document.getElementById("author").offsetTop-70, behavior:"smooth"});
      showSection(authorSection);
    });

    div.querySelector(".delBtn").addEventListener("click", ()=>{
      if(confirm(`Delete "${c.title}"?`)){
        capsules = capsules.filter(cp => cp.id !== c.id);
        localStorage.setItem("pc_capsules", JSON.stringify(capsules));
        renderLibrary();
        populateLearnSelector();
      }
    });
  });
}

// ===== Learn Selector =====
function populateLearnSelector() {
  learnSelector.innerHTML = "";
  capsules.forEach(c => {
    const opt = document.createElement("option");
    opt.value = c.id;
    opt.innerText = c.title;
    learnSelector.appendChild(opt);
  });
}

// ===== New Capsule =====
newCapsuleBtn.addEventListener("click", ()=>{
  const title = prompt("Enter new capsule title:");
  if(!title) return;
  const newCap = {id:crypto.randomUUID(), title, subject:"General", level:"Beginner", description:"", notes:[], flashcards:[], quiz:[]};
  capsules.push(newCap);
  localStorage.setItem("pc_capsules", JSON.stringify(capsules));
  renderLibrary();
  populateLearnSelector();
  currentCapsule = newCap;
  if(typeof loadAuthorForm==="function") loadAuthorForm();
  showSection(authorSection);
});

// ===== INITIAL =====
renderLibrary();
populateLearnSelector();
