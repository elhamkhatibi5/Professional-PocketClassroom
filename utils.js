
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

// ==========================
// مدیریت LocalStorage
// ==========================

const STORAGE_KEY = "pc_capsules_index";

// ذخیره تمام کپسول‌ها
function saveCapsules(capsules){
  localStorage.setItem(STORAGE_KEY, JSON.stringify(capsules));
}

// بارگذاری کپسول‌ها
function loadCapsules(){
  return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
}

// پیدا کردن کپسول با id
function getCapsuleById(id){
  const capsules = loadCapsules();
  return capsules.find(c=>c.id===id);
}

// اضافه یا ویرایش کپسول
function upsertCapsule(capsule){
  const capsules = loadCapsules();
  const idx = capsules.findIndex(c=>c.id===capsule.id);
  if(idx > -1) capsules[idx] = capsule;
  else capsules.push(capsule);
  saveCapsules(capsules);
}

// حذف کپسول
function deleteCapsule(id){
  let capsules = loadCapsules();
  capsules = capsules.filter(c=>c.id !== id);
  saveCapsules(capsules);
}
