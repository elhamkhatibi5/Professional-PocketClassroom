// ====== Global State ======
let capsules = [];           // همه کپسول‌ها
let currentCapsule = null;   // کپسول فعال در Learn / Author
const learnSelector = document.getElementById("learnSelector");

// ====== DOM Elements ======
const capsuleGrid = document.getElementById("capsuleGrid");
const newCapsuleBtn = document.getElementById("newCapsuleBtn");

// ====== Library Rendering ======
function renderLibrary() {
  capsuleGrid.innerHTML = "";
  capsules.forEach(c => {
    const div = document.createElement("div");
    div.className = "col-md-4";
    div.innerHTML = `
      <div class="card capsule-card shadow-sm">
        <div class="card-body">
          <h5 class="card-title">${c.title}</h5>
          <p class="card-text text-muted">${c.description}</p>
          <span class="badge ${c.level==="Beginner"?"bg-success":c.level==="Intermediate"?"bg-warning":"bg-danger"}">${c.level}</span>
          <div class="mt-3 text-end">
            <button class="btn btn-outline-primary btn-sm learnBtn"><i class="bi bi-play-circle"></i> Learn</button>
            <button class="btn btn-outline-secondary btn-sm editBtn"><i class="bi bi-pencil"></i></button>
            <button class="btn btn-outline-danger btn-sm delBtn"><i class="bi bi-trash"></i></button>
          </div>
        </div>
      </div>`;
    capsuleGrid.appendChild(div);

    div.querySelector(".learnBtn").addEventListener("click", () => {
      selectCapsule(c.title);
      window.scrollTo({top: document.getElementById("learn").offsetTop-70, behavior:"smooth"});
    });

    div.querySelector(".editBtn").addEventListener("click", () => {
      selectCapsule(c.title);
      window.scrollTo({top: document.getElementById("author").offsetTop-70, behavior:"smooth"});
    });

    div.querySelector(".delBtn").addEventListener("click", () => {
      if(confirm(`Delete ${c.title}?`)) {
        capsules = capsules.filter(cp => cp.title !== c.title);
        renderLibrary();
        populateLearnSelector();
      }
    });
  });
}

// ====== Learn Selector ======
function populateLearnSelector(){
  learnSelector.innerHTML = "";
  capsules.forEach(c => {
    const opt = document.createElement("option");
    opt.value = c.title;
    opt.innerText = c.title;
    learnSelector.appendChild(opt);
  });
}

// ====== Select Capsule ======
function selectCapsule(title){
  currentCapsule = capsules.find(c => c.title === title);
  updateLearnMode();
  updateAuthorForm();
}

// ====== New Capsule Button ======
newCapsuleBtn.addEventListener("click", () => {
  const title = prompt("Enter new capsule title:");
  if(!title) return;
  const subject = prompt("Enter subject:") || "General";
  const level = prompt("Enter level (Beginner/Intermediate/Advanced):") || "Beginner";
  const description = prompt("Enter description:") || "";
  const newCap = {title, subject, level, description, notes:[], flashcards:[], quiz:[]};
  capsules.push(newCap);
  renderLibrary();
  populateLearnSelector();
  selectCapsule(title);
});

// ====== INITIAL SETUP ======
renderLibrary();
populateLearnSelector();
