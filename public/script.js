// ✅ FIXED: Clean navigation functions that work with onclick attributes

function goClient() {
  window.location.href = "client.html";
}

function goAdmin() {
  window.location.href = "login.html"; // ✅ Go to login first, not directly to admin
}

// Expose functions globally for onclick attributes
window.goClient = goClient;
window.goAdmin = goAdmin;