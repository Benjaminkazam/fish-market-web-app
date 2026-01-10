import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getDatabase, ref, push } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-database.js";

const firebaseConfig = {
    apiKey: "AIzaSyDrwr3egZv73PPv9M03ePcZmD_ZPxdSMhw",
    authDomain: "web-vente.firebaseapp.com",
    projectId: "web-vente",
    storageBucket: "web-vente.firebasestorage.app",
    messagingSenderId: "1061123931906",
    appId: "1:1061123931906:web:e83483b43ffc44d7aa4c1b"
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

const form = document.getElementById("orderForm");
const result = document.getElementById("result");
const backBtn = document.getElementById("backBtn");

form.addEventListener("submit", (e) => {
  e.preventDefault();
  
  const quantity = Number(document.getElementById("quantity").value);
  const deliveryDate = document.getElementById("deliveryDate").value;
  const today = new Date().toISOString().split("T")[0];

  // ✅ Validation
  if (quantity < 1) {
    result.textContent = "❌ La quantité doit être au moins 1";
    result.style.color = "red";
    return;
  }

  if (deliveryDate < today) {
    result.textContent = "❌ La date de livraison est déjà passée";
    result.style.color = "red";
    return;
  }

  // ✅ Show loading state
  result.textContent = "⏳ Envoi de la commande...";
  result.style.color = "#1e90ff";

  const order = {
    name: document.getElementById("name").value.trim(),
    product: document.getElementById("product").value.trim(),
    quantity: quantity,
    deliveryDate: deliveryDate,
    address: document.getElementById("address").value.trim(),
    phone: document.getElementById("phone").value.trim(),
    createdAt: new Date().toLocaleString('fr-FR', { 
      dateStyle: 'short', 
      timeStyle: 'short' 
    })
  };

  push(ref(database, "orders"), order)
    .then(() => {
      result.textContent = "✅ Commande envoyée avec succès!";
      result.style.color = "green";
      backBtn.style.display = "block";
      form.reset();
      
      // ✅ Auto-hide success message after 5 seconds
      setTimeout(() => {
        result.textContent = "";
        backBtn.style.display = "none";
      }, 5000);
    })
    .catch((error) => {
      result.textContent = "❌ Erreur : " + error.message;
      result.style.color = "red";
    });
});

function goHome() {
  window.location.href = "index.html";
}

// ✅ FIXED: Proper way to expose function to HTML onclick
window.goHome = goHome;