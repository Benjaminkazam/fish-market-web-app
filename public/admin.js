import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-database.js";

const firebaseConfig = {
    apiKey: "AIzaSyDrwr3egZv73PPv9M03ePcZmD_ZPxdSMhw",
    authDomain: "web-vente.firebaseapp.com",
    projectId: "web-vente",
    storageBucket: "web-vente.firebasestorage.app",
    messagingSenderId: "1061123931906",
    appId: "1:1061123931906:web:e83483b43ffc44d7aa4c1b"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);

// ✅ FIXED: Authentication enabled - redirects to login if not logged in
onAuthStateChanged(auth, (user) => {
  if (!user) {
    window.location.href = "login.html";
  } else {
    // User is logged in, load orders
    loadOrders();
  }
});

const tableBody = document.querySelector("#ordersTable tbody");

function loadOrders() {
  onValue(ref(database, "orders"), (snapshot) => {
    tableBody.innerHTML = "";

    if (!snapshot.exists()) {
      tableBody.innerHTML = `
        <tr>
          <td colspan="7" style="text-align:center; color:#999;">
            Aucune commande pour le moment
          </td>
        </tr>
      `;
      return;
    }

    // ✅ IMPROVEMENT: Sort orders by date (newest first)
    const orders = [];
    snapshot.forEach(child => {
      orders.push({
        key: child.key,
        ...child.val()
      });
    });

    // Sort by createdAt (newest first)
    orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    orders.forEach(o => {
      const row = `
        <tr>
          <td>${o.name || '-'}</td>
          <td>${o.product || '-'}</td>
          <td>${o.quantity || '-'}</td>
          <td>${o.deliveryDate || '-'}</td>
          <td>${o.address || '-'}</td>
          <td>${o.phone || '-'}</td>
          <td>${o.createdAt || '-'}</td>
        </tr>
      `;
      tableBody.innerHTML += row;
    });
  }, (error) => {
    console.error("Error loading orders:", error);
    tableBody.innerHTML = `
      <tr>
        <td colspan="7" style="text-align:center; color:red;">
          ❌ Erreur de chargement des commandes
        </td>
      </tr>
    `;
  });
}

function goHome() {
  window.location.href = "index.html";
}

function logout() {
  auth.signOut().then(() => {
    window.location.href = "login.html";
  }).catch((error) => {
    console.error("Logout error:", error);
    alert("Erreur lors de la déconnexion");
  });
}

// ✅ FIXED: Proper way to expose functions to HTML onclick
window.goHome = goHome;
window.logout = logout;