// ====== Utils ======

// زمان انسانی
function timeAgo(date) {
  const diff = (new Date() - new Date(date)) / 1000;
  if(diff < 60) return `${Math.floor(diff)} sec ago`;
  if(diff < 3600) return `${Math.floor(diff/60)} min ago`;
  if(diff < 86400) return `${Math.floor(diff/3600)} h ago`;
  return `${Math.floor(diff/86400)} d ago`;
}

// Escape HTML
function escapeHTML(str){
  return str.replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
}
