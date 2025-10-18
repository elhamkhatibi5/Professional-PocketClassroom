
// library.js

const capsuleGrid = $("#capsuleGrid");
const newCapsuleBtn = $("#newCapsuleBtn");
const learnSelector = $("#learnSelector");
const searchCapsule = $("#searchCapsule");

// رندر Library
function renderLibrary(filter=""){
  capsuleGrid.innerHTML = "";
  const filtered = capsules.filter(c => c.title.toLowerCase().includes(filter.toLowerCase()));
  filtered.forEach(c=>{
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
            <button class="btn btn-outline-secondary btn-sm editBtn"><i class="bi bi-pencil"></i></button>
            <button class="btn btn-outline-danger btn-sm delBtn"><i class="bi bi-trash"></i></button>
          </div>
        </div>
      </div>
    `;
    capsuleGrid.appendChild(div);

    // Event Listeners
    div.querySelector(".learnBtn").addEventListener("click",()=>{
      selectCapsule(c.id);
      showSection($("#learn"));
      window.scrollTo({top: learnSection.offsetTop-70, behavior:"smooth"});
    });

    div.querySelector(".editBtn").addEventListener("click",()=>{
      selectCapsule(c.id);
      showSection($("#author"));
      if(typeof loadAuthorForm==="function") loadAuthorForm();
      window.scrollTo({top: authorSection.offsetTop-70, behavior:"smooth"});
    });

    div.querySelector(".delBtn").addEventListener("click",()=>{
      if(confirm(`Delete "${c.title}"?`)){
        capsules = capsules.filter(cp=>cp.id!==c.id);
        saveCapsules();
        renderLibrary(searchCapsule.value);
        populateLearnSelector();
      }
    });
  });
}

// Learn Selector
function populateLearnSelector(){
  learnSelector.innerHTML = "";
  capsules.forEach(c=>{
    const opt = document.createElement("option");
    opt.value = c.id;
    opt.innerText = c.title;
    learnSelector.appendChild(opt);
  });
}

// انتخاب کپسول
function selectCapsule(id){
  currentCapsule = capsules.find(c=>c.id===id);
  if(typeof updateLearnMode==="function") updateLearnMode();
}

// New Capsule
newCapsuleBtn.addEventListener("click",()=>{
  const title = prompt("Enter new capsule title:");
  if(!title) return;
  const subject = prompt("Enter subject:") || "General";
  const level = prompt("Enter level (Beginner/Intermediate/Advanced):") || "Beginner";
  const description = prompt("Enter description:") || "";
  const newCap = {id:Date.now().toString(), title, subject, level, description, notes:[], flashcards:[], quiz:[]};
  capsules.push(newCap);
  saveCapsules();
  renderLibrary();
  populateLearnSelector();
  selectCapsule(newCap.id);
  showSection($("#author"));
  if(typeof loadAuthorForm==="function") loadAuthorForm();
  window.scrollTo({top: authorSection.offsetTop-70, behavior:"smooth"});
});

// Search filter
searchCapsule.addEventListener("input",debounce((e)=>{
  renderLibrary(e.target.value);
},300));

// INITIAL SETUP
renderLibrary();
populateLearnSelector();
