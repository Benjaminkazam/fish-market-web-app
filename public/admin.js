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

// ✅ Authentication enabled
onAuthStateChanged(auth, (user) => {
  if (!user) {
    window.location.href = "login.html";
  } else {
    loadOrders();
  }
});

const tableBody = document.querySelector("#ordersTable tbody");

// Format prix avec séparateur
function formatPrice(price) {
  return price.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

function loadOrders() {
  onValue(ref(database, "orders"), (snapshot) => {
    tableBody.innerHTML = "";

    if (!snapshot.exists()) {
      tableBody.innerHTML = `
        <tr>
          <td colspan="9" style="text-align:center; color:#999;">
            Aucune commande pour le moment
          </td>
        </tr>
      `;
      return;
    }

    // Convertir en array et trier
    const orders = [];
    snapshot.forEach(child => {
      orders.push({
        key: child.key,
        ...child.val()
      });
    });

    // Trier par date (plus récent en premier)
    orders.sort((a, b) => {
      const dateA = new Date(a.createdAt.split(' ')[0].split('/').reverse().join('-'));
      const dateB = new Date(b.createdAt.split(' ')[0].split('/').reverse().join('-'));
      return dateB - dateA;
    });

    // Afficher les commandes
    orders.forEach(o => {
      const pricePerKg = o.pricePerKg || 0;
      const totalPrice = o.totalPrice || (pricePerKg * (o.quantity || 0));
      
      const row = `
        <tr>
          <td>${o.name || '-'}</td>
          <td>${o.product || '-'}</td>
          <td>${o.quantity || '-'} kg</td>
          <td>${formatPrice(pricePerKg)} FC</td>
          <td style="font-weight: bold; color: #2ecc71;">${formatPrice(totalPrice)} FC</td>
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
        <td colspan="9" style="text-align:center; color:red;">
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

window.goHome = goHome;
window.logout = logout;