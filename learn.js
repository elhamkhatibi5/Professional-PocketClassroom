
/* =============================
Base Theme with Gradient Background
============================= */
body.light-mode {
  background: linear-gradient(135deg, #f0f4ff, #d9e4ff); /* آبی ملایم گرادیان */
  color: #1c1c1c;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  transition: background 0.5s, color 0.5s;
}

body.dark-mode {
  background: linear-gradient(135deg, #0f0c29, #302b63, #24243e); /* گرادیان تاریک حرفه‌ای */
  color: #e6e6e6;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  transition: background 0.5s, color 0.5s;
}

/* =============================
Navbar with Gradient
============================= */
.navbar {
  background: linear-gradient(135deg, #6a11cb, #2575fc);
  box-shadow: 0 4px 12px rgba(0,0,0,0.25);
  transition: background 0.5s;
}

.navbar .nav-link {
  cursor: pointer;
  transition: color 0.2s, text-shadow 0.2s;
  color: #fff;
  font-weight: 500;
}

.navbar .nav-link:hover {
  color: #ffd369;
  text-shadow: 0 0 6px rgba(255,211,105,0.7);
}

/* =============================
Capsule Cards
============================= */
.capsule-card {
  transition: transform 0.3s, box-shadow 0.3s;
  cursor: pointer;
  background: linear-gradient(145deg, #ffffff, #e6f0ff);
  border: 1px solid #d1d9e6;
  border-radius: 12px;
  padding: 1rem;
  box-shadow: 0 4px 15px rgba(0,0,0,0.08);
}
.capsule-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0,0,0,0.15);
}

body.dark-mode .capsule-card {
  background: linear-gradient(145deg, #1e1e2f, #2c2c48);
  color: #f1f1f1;
  border: 1px solid #44475a;
  box-shadow: 0 4px 15px rgba(255,255,255,0.05);
}

/* =============================
Buttons: Learn / Edit / Delete
============================= */
.capsule-card .learnBtn {
  background: linear-gradient(135deg, #3d8bfd, #4361ee);
  color: #fff;
  border: none;
  border-radius: 6px;
  transition: background 0.3s;
}
.capsule-card .learnBtn:hover {
  background: linear-gradient(135deg, #2a7af1, #3a4fe0);
}

.capsule-card .editBtn {
  background: linear-gradient(135deg, #00b894, #00cec9);
  color: #fff;
  border: none;
  border-radius: 6px;
}
.capsule-card .editBtn:hover {
  background: linear-gradient(135deg, #00a387, #00b1b1);
}

.capsule-card .delBtn {
  background: linear-gradient(135deg, #ff4b5c, #c9184a);
  color: #fff;
  border: none;
  border-radius: 6px;
}
.capsule-card .delBtn:hover {
  background: linear-gradient(135deg, #e63946, #a4161a);
}

/* =============================
Flashcards
============================= */
.flashcard {
  border-radius: 0.75rem;
  padding: 2rem;
  cursor: pointer;
  min-width: 200px;
  min-height: 120px;
  user-select: none;
  background: linear-gradient(145deg, #ffffff, #e6f0ff);
  color: #1a1a1a;
  border: 1px solid #d1d9e6;
  transition: transform 0.3s, box-shadow 0.3s, background 0.5s, color 0.5s;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}
.flashcard:hover {
  transform: scale(1.05);
  box-shadow: 0 8px 20px rgba(0,0,0,0.18);
}

body.dark-mode .flashcard {
  background: linear-gradient(145deg, #1e1e2f, #2c2c48);
  color: #f1f1f1;
  border: 1px solid #44475a;
  box-shadow: 0 4px 12px rgba(255,255,255,0.05);
}

/* =============================
Inputs / Notes / Quiz
============================= */
.list-group-item input {
  margin-bottom: 0.3rem;
}

#notesList li {
  margin-bottom: 0.3rem;
}

#quizContainer button {
  width: 100%;
  background: linear-gradient(135deg, #5a67d8, #6b46c1);
  color: #fff;
  border: none;
  border-radius: 6px;
  transition: background 0.3s;
}
#quizContainer button:hover {
  background: linear-gradient(135deg, #4c51bf, #553c9a);
}

/* =============================
Generic Buttons
============================= */
button {
  transition: transform 0.1s, box-shadow 0.2s;
  border-radius: 6px;
}
button:active {
  transform: scale(0.97);
  box-shadow: 0 2px 6px rgba(0,0,0,0.2) inset;
}
