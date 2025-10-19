

// =====================
// Learn Mode JS
// =====================
const learnSelector = document.getElementById("learnSelector");
const notesList = document.getElementById("notesList");
const flashcardDisplay = document.getElementById("flashcardDisplay");
const flashcardCounter = document.createElement("div"); // نمایش شمارنده
const flashcardCounter = document.createElement("div");
flashcardDisplay.after(flashcardCounter);
const prevCardBtn = document.getElementById("prevCardBtn");
const nextCardBtn = document.getElementById("nextCardBtn");
 function updateLearnMode(){
// =====================
function renderFlashcard(){
  if(!currentCapsule || !currentCapsule.flashcards?.length){
    flashcardDisplay.textContent = "No flashcards";
    flashcardDisplay.innerHTML = "<div class='alert alert-warning'>No flashcards available!</div>";
    flashcardCounter.textContent = "";
    return;
  }
  const card = currentCapsule.flashcards[flashIndex];
  flashcardDisplay.textContent = showingFront ? card.front : card.back;
  flashcardDisplay.innerHTML = showingFront 
    ? `<strong>${card.front}</strong>` 
    : `<strong>${card.back}</strong>${card.explanation ? `<br><em>${card.explanation}</em>` : ""}`;
  flashcardCounter.textContent = `Card ${flashIndex+1} / ${currentCapsule.flashcards.length}`;
}

nextCardBtn.onclick = ()=>{
// =====================
function renderQuizQuestion(){
  if(!currentCapsule || !currentCapsule.quiz?.length){
    quizContainer.innerHTML = "<p>No quiz questions.</p>";
    quizContainer.innerHTML = "<p class='text-warning'>No quiz questions.</p>";
    return;
  }
