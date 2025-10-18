// ==============================
// Pocket Classroom - utils.js
// ==============================

// جلوگیری از تزریق HTML
function escapeHTML(str) {
  if (typeof str !== "string") str = String(str || "");
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

// نمایش زمان گذشته به صورت انسانی
function timeAgo(date) {
  const seconds = Math.floor((new Date() - new Date(date)) / 1000);
  let interval = Math.floor(seconds / 31536000);
  if (interval >= 1) return interval + " year" + (interval > 1 ? "s" : "") + " ago";
  interval = Math.floor(seconds / 2592000);
  if (interval >= 1) return interval + " month" + (interval > 1 ? "s" : "") + " ago";
  interval = Math.floor(seconds / 86400);
  if (interval >= 1) return interval + " day" + (interval > 1 ? "s" : "") + " ago";
  interval = Math.floor(seconds / 3600);
  if (interval >= 1) return interval + " hour" + (interval > 1 ? "s" : "") + " ago";
  interval = Math.floor(seconds / 60);
  if (interval >= 1) return interval + " minute" + (interval > 1 ? "s" : "") + " ago";
  return "Just now";
}

// تابع debounce برای کاهش فراخوانی‌های سریع
function debounce(func, wait) {
  let timeout;
  return function(...args) {
    const context = this;
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(context, args), wait);
  };
}

// انتخابگر کوتاه
const $ = selector => document.querySelector(selector);
const $$ = selector => document.querySelectorAll(selector);
