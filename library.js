
// ====== Library.js ======
const capsuleGrid = $("#capsuleGrid");
const newCapsuleBtn = $("#newCapsuleBtn");
const learnSelector = $("#learnSelector");

// نمونه داده‌ها (4 کپسول)
let capsules = [
  {
    id: "1",
    title: "Biology Basics",
    subject: "Biology",
    level: "Beginner",
    description: "Intro to biology concepts",
    thumbnail: "https://via.placeholder.com/320x180?text=Biology",
    notes: ["Cell structure", "DNA basics"],
    flashcards: [{front:"Cell", back:"Basic unit of life"}, {front:"DNA", back:"Genetic material"}],
    quiz: [{question:"DNA shape?", choices:["Double helix","Single helix","Circle","Triangle"], answer:0, explanation:"DNA is a double helix."}]
  },
  {
    id: "2",
    title: "Physics Intro",
    subject: "Physics",
    level: "Intermediate",
    description: "Basic physics principles",
    thumbnail: "https://via.placeholder.com/320x180?text=Physics",
    notes: ["Newton's laws", "Energy forms"],
    flashcards: [{front:"Force", back:"Mass x Acceleration"}],
    quiz: [{question:"Unit of force?", choices:["N","J","W","Pa"], answer:0, explanation:"Force is measured in Newtons (N)."}]
  },
  {
    id: "3",
    title: "Chemistry 101",
    subject: "Chemistry",
    level: "Beginner",
    description: "Intro to chemistry",
    thumbnail: "https://via.placeholder.com/320x180?text=Chemistry",
    notes: ["Periodic table", "Atoms"],
    flashcards: [{front:"Atom", back:"Smallest particle"}],
    quiz: [{question:"H2O is?", choices:["Water","Oxygen","Hydrogen","Salt"], answer:0, explanation:"H2O is water."}]
  },
  {
    id: "4",
    title: "Math Fun",
    subject: "Math",
    level: "Advanced",
    description: "Challenging math problems",
    thumbnail: "https://via.placeholder.com/320x180?text=Math",
    notes: ["Algebra", "Geometry"],
    flashcards: [{front:"Pythagoras theorem", back:"a² + b² = c²"}],
    quiz: [{question:"2+2?", choices:["3","4","5","6"], answer:1, explanation:"2+2 equals 4."}]
  }
];

// ذخیره در LocalStorage
if(!localStorage.getItem("pc_capsules")) {
    localStorage.setItem("pc_capsules", JSON.stringify(capsules));
} else {
    capsules = JSON.parse(localStorage.getItem("pc_capsules"));
}

// ===== رندر Library =====
function renderLibrary() {
    capsuleGrid.innerHTML = "";
    capsules.forEach(c => {
        const div = document.createElement("div");
        div.className = "col-md-4 mb-4";
        div.innerHTML = `
        <div class="card capsule-card shadow-sm">
            <img src="${c.thumbnail}" class="card-img-top" alt="${c.title}">
            <div class="card-body">
                <h5 class="card-title">${c.title}</h5>
                <p class="card-text text-muted">${c.description}</p>
                <span class="badge ${c.level==="Beginner"?"bg-success":c.level==="Intermediate"?"bg-warning":"bg-danger"}">${c.level}</span>
                <div class="mt-3 d-flex justify-content-between align-items-center">
                    <button class="btn btn-outline-primary btn-sm learnBtn"><i class="bi bi-play-circle"></i> Learn</button>
                    <div>
                        <button class="btn btn-outline-secondary btn-sm editBtn"><i class="bi bi-pencil"></i></button>
                        <button class="btn btn-outline-danger btn-sm delBtn"><i class="bi bi-trash"></i></button>
                    </div>
                </div>
            </div>
        </div>`;
        capsuleGrid.appendChild(div);

        // Event Listeners
        div.querySelector(".learnBtn").addEventListener("click", ()=>{
            selectCapsule(c.id);
            showSection($("#learn"));
        });
        div.querySelector(".editBtn").addEventListener("click", ()=>{
            selectCapsule(c.id);
            showSection($("#author"));
        });
        div.querySelector(".delBtn").addEventListener("click", ()=>{
            if(confirm(`Delete "${c.title}"?`)){
                capsules = capsules.filter(cp => cp.id !== c.id);
                localStorage.setItem("pc_capsules", JSON.stringify(capsules));
                renderLibrary();
                populateLearnSelector();
                currentCapsule = capsules[0] || null;
                updateLearnMode();
                loadAuthorForm();
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

// ===== انتخاب کپسول =====
function selectCapsule(id){
    currentCapsule = capsules.find(c => c.id === id);
    loadAuthorForm();
    updateLearnMode();
}

// ===== New Capsule =====
newCapsuleBtn.addEventListener("click", ()=>{
    const title = prompt("Enter new capsule title:"); if(!title) return;
    const subject = prompt("Enter subject:") || "General";
    const level = prompt("Enter level (Beginner/Intermediate/Advanced):") || "Beginner";
    const description = prompt("Enter description:") || "";
    const thumbnail = "https://via.placeholder.com/320x180?text=New";
    const newCap = {id: Date.now().toString(), title, subject, level, description, thumbnail, notes:[], flashcards:[], quiz:[]};
    capsules.push(newCap);
    localStorage.setItem("pc_capsules", JSON.stringify(capsules));
    renderLibrary();
    populateLearnSelector();
    selectCapsule(newCap.id);
    showSection($("#author"));
});

// ===== INITIAL SETUP =====
renderLibrary();
populateLearnSelector();
