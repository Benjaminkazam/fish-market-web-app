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

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const quantity = Number(document.getElementById("quantity").value);
  const deliveryDate = document.getElementById("deliveryDate").value;
  const today = new Date().toISOString().split("T")[0];

  if (quantity < 1) {
    result.textContent = "La quantité doit être au moins 1";
    return;
  }

  if (deliveryDate < today) {
    result.textContent = "La date de livraison est déjà passée";
    return;
  }

  const order = {
    name: document.getElementById("name").value,
    product: document.getElementById("product").value,
    quantity: document.getElementById("quantity").value,
    deliveryDate: document.getElementById("deliveryDate").value,
    address: document.getElementById("address").value,
    phone: document.getElementById("phone").value,
    createdAt: new Date().toLocaleString()
  };

  push(ref(database, "orders"), order)
    .then(() => {
      result.textContent = " Commande envoyée avec succès";
      document.getElementById("backBtn").style.display = "block";
      form.reset();
    })
    .catch((error) => {
      result.textContent = " Erreur : " + error.message;
    });
});
function goHome() {
  window.location.href = "index.html";
}

