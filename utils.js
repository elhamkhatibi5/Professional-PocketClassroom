
// =============================
// Utility Functions
// =============================

// Escape HTML to prevent broken HTML injection
function escapeHTML(str) {
  if (!str) return "";
  return str.replace(/[&<>"']/g, function (m) {
    switch (m) {
      case "&": return "&amp;";
      case "<": return "&lt;";
      case ">": return "&gt;";
      case '"': return "&quot;";
      case "'": return "&#039;";
      default: return m;
    }
  });
}

// Human-readable time ago
function timeAgo(isoDate) {
  const seconds = Math.floor((new Date() - new Date(isoDate)) / 1000);
  const intervals = [
    { label: "year", seconds: 31536000 },
    { label: "month", seconds: 2592000 },
    { label: "day", seconds: 86400 },
    { label: "hour", seconds: 3600 },
    { label: "minute", seconds: 60 },
    { label: "second", seconds: 1 },
  ];
  for (let i of intervals) {
    const count = Math.floor(seconds / i.seconds);
    if (count > 0) return `${count} ${i.label}${count > 1 ? "s" : ""} ago`;
  }
  return "just now";
}

// Debounce function for inputs
function debounce(func, wait = 300) {
  let timeout;
  return function(...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}

// Generate unique ID
function generateId() {
  return 'pc-' + Math.random().toString(36).substr(2, 9);
}

// Download JSON as file
function downloadJSON(obj, filename) {
  const blob = new Blob([JSON.stringify(obj, null, 2)], {type: "application/json"});
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
  URL.revokeObjectURL(link.href);
}
