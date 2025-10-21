
// ===============================
// Pocket Classroom - Main.js (Fixed Display + 4 default capsules)
// ===============================

// Sections
const librarySection = document.getElementById("library");
const authorSection = document.getElementById("author");
const learnSection = document.getElementById("learn");

// Navbar links
const navLinks = document.querySelectorAll(".nav-link");

// Theme toggle
const themeToggle = document.getElementById("themeToggle");
const body = document.body;

// Capsule Storage
let capsules = JSON.parse(localStorage.getItem("pc_capsules_index")) || [];
let currentCapsule = null;
let flashIndex = 0;
let showingFront = true;

// ===============================
// SPA Section Control
// ===============================
let currentSection = localStorage.getItem("pc_current_section") || "library";

function showSection(section){
  librarySection.style.display = "none";
  authorSection.style.display = "none";
  learnSection.style.display = "none";

  section.style.display = "block";

  if(section === authorSection && typeof loadAuthorForm === "function")
    loadAuthorForm(currentCapsule);

  if(section === learnSection){
    if(!currentCapsule && capsules.length > 0)
      setCurrentCapsule(capsules[0].id);
    if(currentCapsule){
      if(typeof populateLearnSelector === "function") populateLearnSelector();
      if(typeof updateLearnMode === "function") updateLearnMode();
      flashIndex = 0;
      showingFront = true;
    }
  }

  if(section === librarySection) currentSection = "library";
  else if(section === authorSection) currentSection = "author";
  else if(section === learnSection) currentSection = "learn";
  localStorage.setItem("pc_current_section", currentSection);
}

// Navbar clicks
navLinks.forEach(link=>{
  link.addEventListener("click", e=>{
    e.preventDefault();
    const target = link.getAttribute("href");
    if(target === "#library") showSection(librarySection);
    else if(target === "#author") showSection(authorSection);
    else if(target === "#learn") showSection(learnSection);
  });
});

// ===============================
// Theme Handling
// ===============================
function loadTheme(){
  const saved = localStorage.getItem("pc_theme");
  if(saved) body.className = saved;
  updateThemeButton();
}

function toggleTheme(){
  if(body.classList.contains("light-mode")) body.className = "dark-mode";
  else body.className = "light-mode";
  localStorage.setItem("pc_theme", body.className);
  updateThemeButton();
}

function updateThemeButton(){
  themeToggle.innerHTML = body.classList.contains("light-mode")
    ? '<i class="bi bi-moon-stars"></i> Dark'
    : '<i class="bi bi-sun"></i> Light';
}

themeToggle.addEventListener("click", toggleTheme);

// ===============================
// Save / Load Capsules
// ===============================
function saveCapsules(){
  localStorage.setItem("pc_capsules_index", JSON.stringify(capsules));
  if(currentCapsule) localStorage.setItem("pc_current_capsule", currentCapsule.id);

  if(typeof loadAuthorForm === "function") loadAuthorForm(currentCapsule);
  if(typeof populateLearnSelector === "function") populateLearnSelector();
  if(typeof updateLearnMode === "function") updateLearnMode();
}

function saveCapsule(capsule){
  const index = capsules.findIndex(c=>c.id===capsule.id);
  if(index>-1) capsules[index] = capsule;
  else capsules.push(capsule);
  currentCapsule = capsule;
  saveCapsules();
}

// ===============================
// Set Current Capsule
// ===============================
function setCurrentCapsule(id){
  const capsule = capsules.find(c=>c.id===id);
  if(!capsule) return;

  currentCapsule = capsule;
  localStorage.setItem("pc_current_capsule", capsule.id);

  if(typeof populateLearnSelector === "function") populateLearnSelector();
  if(typeof loadAuthorForm === "function") loadAuthorForm(currentCapsule);
  if(typeof updateLearnMode === "function") updateLearnMode();

  flashIndex = 0;
  showingFront = true;
}

// ===============================
// Export / Import
// ===============================
const exportBtn = document.getElementById("exportBtn");
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

const importBtn = document.getElementById("importBtn");
importBtn.addEventListener("click", ()=>{
  const input = document.createElement("input");
  input.type = "file";
  input.accept = ".json";
  input.addEventListener("change", e=>{
    const file = e.target.files[0];
    if(!file) return;
    const reader = new FileReader();
    reader.onload = ev=>{
      try{
        const imported = JSON.parse(ev.target.result);
        if(imported.capsules && Array.isArray(imported.capsules)){
          imported.capsules.forEach(c=>{
            if(!c.id) c.id = Date.now().toString()+Math.random();
            capsules.push(c);
          });
          saveCapsules();
          alert("Capsules imported successfully!");
        }
      }catch(err){alert("Invalid JSON file.");}
    };
    reader.readAsText(file);
  });
  input.click();
});

// ===============================
// Default 4 Capsules
// ===============================
function createDefaultCapsules(){
  return [
    {
      id: "c1",
      title: "Algebra Basics",
      subject: "Math",
      level: "Beginner",
      description: "Learn fundamental algebra concepts including variables, equations, and functions.",
      notes: ["Variables and expressions", "Solving equations", "Slope and intercept"],
      flashcards: [
        { front: "What is x in 2x+3=7?", back: "x=2" },
        { front: "Formula for slope?", back: "(y2-y1)/(x2-x1)" }
      ],
      quiz: [
        { question: "Solve: 5x - 10 = 0", choices: ["x=0","x=1","x=2","x=3"], correctIndex: 2 }
      ],
      updatedAt: new Date().toISOString()
    },
    {
      id: "c2",
      title: "Human Anatomy Overview",
      subject: "Biology",
      level: "Beginner",
      description: "Learn the major systems of the human body and their functions.",
      notes: ["Skeletal system","Muscular system","Circulatory system"],
      flashcards: [
        { front: "Largest organ?", back: "Skin" },
        { front: "Function of red blood cells?", back: "Carry oxygen" }
      ],
      quiz: [
        { question: "Which organ pumps blood?", choices: ["Lungs","Heart","Liver","Kidney"], correctIndex: 1 }
      ],
      updatedAt: new Date().toISOString()
    },
    {
      id: "c3",
      title: "Python Programming",
      subject: "Programming",
      level: "Beginner",
      description: "Learn Python fundamentals: variables, loops, functions, and data structures.",
      notes: ["Variables and types","For/while loops","Functions","Lists and dicts"],
      flashcards: [
        { front: "Print function?", back: "print()" },
        { front: "Keyword to define function?", back: "def" }
      ],
      quiz: [
        { question: "Python list method to add element?", choices: ["append","push","insert","add"], correctIndex: 0 }
      ],
      updatedAt: new Date().toISOString()
    },
    {
      id: "c4",
      title: "Ancient Civilizations",
      subject: "History",
      level: "Intermediate",
      description: "Explore the key ancient civilizations and their cultural, political, and technological achievements.",
      notes: ["Mesopotamia","Egypt","Greece","Rome"],
      flashcards: [
        { front: "Who built the Pyramids?", back: "Ancient Egyptians" },
        { front: "Famous Mesopotamian invention?", back: "Cuneiform writing" }
      ],
      quiz: [
        { question: "Which civilization invented the wheel?", choices: ["Egyptians","Sumerians","Romans","Greeks"], correctIndex: 1 }
      ],
      updatedAt: new Date().toISOString()
    }
  ];
}

// ===============================
// Initial Load
// ===============================
document.addEventListener("DOMContentLoaded", ()=>{
  loadTheme();

  capsules = JSON.parse(localStorage.getItem("pc_capsules_index")) || [];

  // ⚡ اگر LocalStorage خالی بود، ۴ کپسول واقعی بساز
  if(capsules.length === 0){
    capsules = createDefaultCapsules();
    saveCapsules();
  }

  const lastId = localStorage.getItem("pc_current_capsule");
  if(lastId) currentCapsule = capsules.find(c=>c.id===lastId);
  if(!currentCapsule && capsules.length>0) currentCapsule = capsules[0];

  if(typeof populateLearnSelector === "function") populateLearnSelector();
  if(typeof updateLearnMode === "function") updateLearnMode();

  if(currentSection === "author") showSection(authorSection);
  else if(currentSection === "learn") showSection(learnSection);
  else showSection(librarySection);
});
