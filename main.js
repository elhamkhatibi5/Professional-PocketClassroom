
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

// نمایش یک سشن و مخفی کردن بقیه
function showSection(section) {
  librarySection.style.display = "none";
  authorSection.style.display = "none";
  learnSection.style.display = "none";
  section.style.display = "block";
}

// تغییر سشن با Navbar
navLinks.forEach(link=>{
  link.addEventListener("click", e=>{
    e.preventDefault();
    const target = link.getAttribute("href");
    if(target === "#library") showSection(librarySection);
    else if(target === "#author") showSection(authorSection);
    else if(target === "#learn") showSection(learnSection);
  });
});

// Dark / Light Mode
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
  showSection(librarySection);
  loadTheme();
  if(capsules.length>0) currentCapsule = capsules[0];
  loadAuthorForm();
  updateLearnMode();
});
