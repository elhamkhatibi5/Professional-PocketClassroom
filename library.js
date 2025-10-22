
/* =============================
Base Theme
============================= */
body.light-mode {
  background-color: #f8f9fa;
  color: #212529;
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
}

body.dark-mode {
  background-color: #121212;
  color: #f1f1f1;
}

/* =============================
Navbar
============================= */
.navbar {
  background-color: #333;
}

.navbar .nav-link {
  cursor: pointer;
  transition: color 0.2s, transform 0.2s;
  color: #f8f9fa;
  font-weight: 500;
}

.navbar .nav-link:hover {
  color: #ffeb3b;
  transform: scale(1.05);
}

/* =============================
Capsule Cards
============================= */
.capsule-card {
  border-radius: 0.75rem;
  transition: transform 0.3s, box-shadow 0.3s;
  cursor: pointer;
  padding: 1rem;
  background-color: #fff;
  color: #212529;
  box-shadow: 0 2px 6px rgba(0,0,0,0.15);
}

.capsule-card:hover {
  transform: translateY(-4px) scale(1.03);
  box-shadow: 0 6px 18px rgba(0,0,0,0.25);
}

body.dark-mode .capsule-card {
  background-color: #1f1f1f;
  color: #ffffff; /* متن سفید روشن */
}

/* =============================
Flashcards
============================= */
.flashcard {
  border: none;
  border-radius: 0.75rem;
  padding: 1.2rem 1rem;
  cursor: pointer;
  min-width: 180px;
  min-height: 90px;
  max-width: 300px;
  text-align: center;
  font-size: 0.95rem;
  font-weight: 500;
  line-height: 1.4;
  user-select: none;
  background-color: #fff;
  color: #212529;
  box-shadow: 0 2px 6px rgba(0,0,0,0.15);
  transition: transform 0.25s, box-shadow 0.3s;
}

.flashcard:hover {
  transform: translateY(-2px) scale(1.03);
  box-shadow: 0 6px 18px rgba(0,0,0,0.2);
}

body.dark-mode .flashcard {
  background-color: #1e1e1e;
  color: #ffffff; /* متن سفید کامل برای خوانایی بالا */
}

body.dark-mode .flashcard:hover {
  box-shadow: 0 6px 18px rgba(255,255,255,0.15);
}

/* =============================
Footer
============================= */
footer {
  background-color: #f0f0f0;
  color: #212529;
  padding: 1rem 0;
  text-align: center;
  font-size: 0.9rem;
  border-top: 1px solid #ccc;
  position: relative;
  bottom: 0;
  width: 100%;
}

body.dark-mode footer {
  background-color: #1a1a1a; /* کمی روشن‌تر از پس‌زمینه اصلی */
  color: #ffffff;            /* متن سفید واضح */
  border-top: 1px solid #333;
}

/* =============================
Layout Fixes
============================= */
html, body {
  height: 100%;
}

main {
  min-height: calc(100vh - 80px);
  padding-bottom: 2rem;
}

/* =============================
Responsive
============================= */
@media (max-width: 768px) {
  .capsule-card, .flashcard {
    min-width: 150px;
    min-height: 80px;
    padding: 1rem;
    font-size: 0.85rem;
  }
    }
