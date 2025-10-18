
// utils.js

// جلوگیری از تزریق HTML
function escapeHTML(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

// debounce ساده
function debounce(func, wait) {
  let timeout;
  return function(...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}

// کوتاه‌کننده selector
const $ = s => document.querySelector(s);
const $$ = s => document.querySelectorAll(s);
