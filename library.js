
const capsuleGrid = document.getElementById("capsuleGrid");
const newCapsuleBtn = document.getElementById("newCapsuleBtn");
const learnSelector = document.getElementById("learnSelector");
const searchCapsule = document.getElementById("searchCapsule");

// Render Library
function renderLibrary(filter=""){
  capsuleGrid.innerHTML="";
  capsules.filter(c=>c.title.toLowerCase().includes(filter.toLowerCase())).forEach(c=>{
    const div=document.createElement("div");
    div.className="col-md-4";
    div.innerHTML=`<div class="card capsule-card shadow-sm">
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

    div.querySelector(".learnBtn").addEventListener("click", ()=>{
      selectCapsule(c.title);
      window.scrollTo({top: document.getElementById("learn").offsetTop-70, behavior:"smooth"});
    });
    div.querySelector(".editBtn").addEventListener("click", ()=>{
      selectCapsule(c.title);
      window.scrollTo({top: document.getElementById("author").offsetTop-70, behavior:"smooth"});
    });
    div.querySelector(".delBtn").addEventListener("click", ()=>{
      if(confirm(`Delete ${c.title}?`)){
        capsules=capsules.filter(cp=>cp.title!==c.title);
        saveCapsules();
        renderLibrary(searchCapsule.value);
        populateLearnSelector();
      }
    });
  });
}

// Learn Selector
function populateLearnSelector(){
  learnSelector.innerHTML="";
  capsules.forEach(c=>{
    const opt=document.createElement("option");
    opt.value=c.title;
    opt.innerText=c.title;
    learnSelector.appendChild(opt);
  });
}

// Select Capsule
function selectCapsule(title){
  currentCapsule=capsules.find(c=>c.title===title);
  updateLearnMode();
}

// New Capsule
newCapsuleBtn.addEventListener("click", ()=>{
  const title=prompt("Enter new capsule title:"); if(!title) return;
  const subject=prompt("Enter subject:")||"General";
  const level=prompt("Enter level (Beginner/Intermediate/Advanced):")||"Beginner";
  const description=prompt("Enter description:")||"";
  const newCap={title, subject, level, description, notes:[], flashcards:[], quiz:[]};
  capsules.push(newCap);
  saveCapsules();
  renderLibrary();
  populateLearnSelector();
  selectCapsule(title);
  window.scrollTo({top: document.getElementById("author").offsetTop-70, behavior:"smooth"});
});

// Search
searchCapsule.addEventListener("input",debounce(()=>renderLibrary(searchCapsule.value),300));

// Initial Render
renderLibrary();
populateLearnSelector();
