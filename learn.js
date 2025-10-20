
const flashcardDisplay = document.getElementById("flashcardDisplay");
const prevCardBtn = document.getElementById("prevCardBtn");
const nextCardBtn = document.getElementById("nextCardBtn");
const flipCardBtn = document.getElementById("flipCardBtn");
const notesList = document.getElementById("notesList");
const learnSelector = document.getElementById("learnSelector");
const quizContainer = document.getElementById("quizContainer");

let currentCardIndex = 0;
let showingAnswer = false;

function updateLearnMode() {
  notesList.innerHTML = "";
  currentCapsule.notes.forEach(note=>{
    const li=document.createElement("li");
    li.className="list-group-item";
    li.innerText=note;
    notesList.appendChild(li);
  });

  currentCardIndex=0; showingAnswer=false; showFlashcard();
  renderQuiz();
  populateAuthorFlashcards();
  populateAuthorQuiz();
  learnSelector.value=currentCapsule.title;
}

function showFlashcard(){
  if(!currentCapsule.flashcards.length){flashcardDisplay.innerText="No flashcards";return;}
  const card=currentCapsule.flashcards[currentCardIndex];
  flashcardDisplay.innerText=showingAnswer?card.answer:card.question;
}

function renderQuiz(){
  quizContainer.innerHTML="";
  if(!currentCapsule.quiz.length){quizContainer.innerHTML="<p>No quiz questions</p>";return;}
  currentCapsule.quiz.forEach((q,idx)=>{
    const card=document.createElement("div");
    card.className="mb-2";
    card.innerHTML=`<p><strong>Q${idx+1}:</strong> ${q.question}</p>`;
    const div=document.createElement("div");
    q.options.forEach(opt=>{
      const btn=document.createElement("button");
      btn.className="btn btn-outline-primary btn-sm me-2";
      btn.innerText=opt;
      btn.addEventListener("click",()=>{alert(opt===q.answer?"✅ Correct!":"❌ Wrong!");});
      div.appendChild(btn);
    });
    card.appendChild(div);
    quizContainer.appendChild(card);
  });
}

flashcardDisplay.addEventListener("click",()=>{showingAnswer=!showingAnswer;showFlashcard();});
flipCardBtn.addEventListener("click",()=>{showingAnswer=!showingAnswer;showFlashcard();});
prevCardBtn.addEventListener("click",()=>{currentCardIndex=(currentCardIndex-1+currentCapsule.flashcards.length)%currentCapsule.flashcards.length; showingAnswer=false; showFlashcard();});
nextCardBtn.addEventListener("click",()=>{currentCardIndex=(currentCardIndex+1)%currentCapsule.flashcards.length; showingAnswer=false; showFlashcard();});
learnSelector.addEventListener("change",(e)=>{selectCapsule(e.target.value);});
