
// library.js

let capsules = []; // آرایه کپسول‌ها
let currentCapsule = null;

// المان‌ها
const capsuleGrid = document.getElementById("capsuleGrid");
const newCapsuleBtn = document.getElementById("newCapsuleBtn");
const learnSelector = document.getElementById("learnSelector");
const searchCapsule = document.getElementById("searchCapsule");

// بارگذاری داده‌ها از LocalStorage
function loadCapsules() {
  const stored = localStorage.getItem("pc_capsules");
  if(stored) capsules = JSON.parse(stored);
}

// ذخیره داده‌ها در LocalStorage
function saveCapsules() {
  localStorage.setItem("pc_capsules", JSON.stringify(capsules));
}

// نمایش کارت‌ها
function renderLibrary(filter="") {
  capsuleGrid.innerHTML = "";
  capsules
    .filter(c => c.title.toLowerCase().includes(filter.toLowerCase()))
    .forEach(c => {
      const div = document.createElement("div");
      div.className = "col-md-4";
      div.innerHTML = `
        <div class="card capsule-card shadow-sm">
          <div class="card-body">
            <h5 class="card-title">${escapeHTML(c.title)}</h5>
            <p class="card-text text-muted">${escapeHTML(c.description)}</p>
            <span class="badge ${c.level==="Beginner"?"bg-success":c.level==="Intermediate"?"bg-warning":"bg-danger"}">${c.level}</span>
            <div class="mt-3 text-end">
              <button class="btn btn-outline-primary btn-sm learnBtn"><i class="bi bi-play-circle"></i> Learn</button>
              <button class="btn btn-outline-secondary btn-sm editBtn"><i class="bi bi-pencil"></i> Edit</button>
              <button class="btn btn-outline-danger btn-sm delBtn"><i class="bi bi-trash"></i> Delete</button>
            </div>
          </div>
        </div>`;
      capsuleGrid.appendChild(div);

      div.querySelector(".learnBtn").addEventListener("click", ()=> {
        selectCapsule(c.id);
        window.scrollTo({top: document.getElementById("learn").offsetTop-70, behavior:"smooth"});
      });

      div.querySelector(".editBtn").addEventListener("click", ()=> {
        selectCapsule(c.id);
        window.scrollTo({top: document.getElementById("author").offsetTop-70, behavior:"smooth"});
      });

      div.querySelector(".delBtn").addEventListener("click", ()=> {
        if(confirm(`Delete ${c.title}?`)) {
          capsules = capsules.filter(cp => cp.id !== c.id);
          saveCapsules();
          renderLibrary(searchCapsule.value);
          populateLearnSelector();
        }
      });
    });
}

// فیلتر جستجو
searchCapsule.addEventListener("input", debounce((e)=>{
  renderLibrary(e.target.value);
}, 300));

// پر کردن Learn Selector
function populateLearnSelector() {
  learnSelector.innerHTML = "";
  capsules.forEach(c => {
    const opt = document.createElement("option");
    opt.value = c.id;
    opt.innerText = c.title;
    learnSelector.appendChild(opt);
  });
}

// انتخاب کپسول
function selectCapsule(id) {
  currentCapsule = capsules.find(c => c.id === id);
  updateLearnMode();
}

// دکمه New Capsule
newCapsuleBtn.addEventListener("click", ()=>{
  const title = prompt("Enter new capsule title:");
  if(!title) return;
  const newCap = {
    id: "cap" + Date.now(),
    title: title,
    subject: "General",
    level: "Beginner",
    description: "",
    notes: [],
    flashcards: [],
    quiz: []
  };
  capsules.push(newCap);
  saveCapsules();
  renderLibrary();
  populateLearnSelector();
  selectCapsule(newCap.id);
  window.scrollTo({top: document.getElementById("author").offsetTop-70, behavior:"smooth"});
});

// INITIAL LOAD
loadCapsules();
renderLibrary();
populateLearnSelector();
