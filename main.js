
// main.js

// Sections
const librarySection = $("#library");
const authorSection = $("#author");
const learnSection = $("#learn");

// Navbar links
const navLinks = $$(".nav-link");

// Theme toggle
const themeToggle = $("#themeToggle");
const body = document.body;

// Capsules Array
let capsules = JSON.parse(localStorage.getItem("pc_capsules")) || [
  {
    id:"1", title:"Biology Basics", subject:"Biology", level:"Beginner", description:"Intro to biology concepts",
    notes:["Cell structure","DNA basics"],
    flashcards:[{front:"Cell",back:"Basic unit of life"},{front:"DNA",back:"Genetic material"}],
    quiz:[{question:"DNA shape?",choices:["Double helix","Single helix","Circle","Triangle"],answer:0,explanation:"DNA is double helix"}]
  },
  {
    id:"2", title:"Physics Intro", subject:"Physics", level:"Intermediate", description:"Basic physics principles",
    notes:["Newton's laws","Energy forms"],
    flashcards:[{front:"Force",back:"Mass x Acceleration"}],
    quiz:[{question:"Unit of force?",choices:["N","J","W","Pa"],answer:0,explanation:"Force unit is Newton"}]
  },
  {
    id:"3", title:"Chemistry 101", subject:"Chemistry", level:"Beginner", description:"Intro to chemistry",
    notes:["Periodic table","Atoms"],
    flashcards:[{front:"Atom",back:"Smallest particle"}],
    quiz:[{question:"H2O is?",choices:["Water","Oxygen","Hydrogen","Salt"],answer:0,explanation:"H2O is Water"}]
  },
  {
    id:"4", title:"Math Fun", subject:"Math", level:"Advanced", description:"Challenging math problems",
    notes:["Algebra","Geometry"],
    flashcards:[{front:"Pythagoras theorem",back:"a² + b² = c²"}],
    quiz:[{question:"2+2?",choices:["3","4","5","6"],answer:1,explanation:"2+2=4"}]
  }
];

// ذخیره در LocalStorage
function saveCapsules() {
  localStorage.setItem("pc_capsules", JSON.stringify(capsules));
}

// نمایش سشن
function showSection(section, saveHash=true){
  [librarySection,authorSection,learnSection].forEach(s=>s.style.display="none");
  section.style.display="block";
  if(saveHash){
    window.location.hash = section.id;
  }
}

// Navbar click
navLinks.forEach(link=>{
  link.addEventListener("click",e=>{
    e.preventDefault();
    const target = link.getAttribute("href");
    if(target==="#library") showSection(librarySection);
    else if(target==="#author") showSection(authorSection);
    else if(target==="#learn") showSection(learnSection);
  });
});

// Dark / Light
function loadTheme(){
  const saved = localStorage.getItem("pc_theme");
  if(saved) body.className = saved;
  updateThemeButton();
}
function toggleTheme(){
  if(body.classList.contains("light-mode")) body.className="dark-mode";
  else body.className="light-mode";
  localStorage.setItem("pc_theme",body.className);
  updateThemeButton();
}
function updateThemeButton(){
  themeToggle.innerHTML = body.classList.contains("light-mode") ? '<i class="bi bi-moon-stars"></i> Dark' : '<i class="bi bi-sun"></i> Light';
}
themeToggle.addEventListener("click",toggleTheme);

// Initial load
let currentCapsule = capsules[0];

document.addEventListener("DOMContentLoaded",()=>{
  const hash = window.location.hash;
  if(hash==="#author") showSection(authorSection,false);
  else if(hash==="#learn") showSection(learnSection,false);
  else showSection(librarySection,false);

  loadTheme();

  if(typeof loadAuthorForm==="function") loadAuthorForm();
  if(typeof updateLearnMode==="function") updateLearnMode();
});
