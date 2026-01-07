import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getDatabase, ref, push } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyAm8DR4ul2w-80xfo8uhzpTskaWvO_MwhU",
  authDomain: "poissonerie-website.firebaseapp.com",
  databaseURL: "https://poissonerie-website-default-rtdb.firebaseio.com",
  projectId: "poissonerie-website",
  storageBucket: "poissonerie-website.appspot.com",
  messagingSenderId: "305612877784",
  appId: "1:305612877784:web:71cb27c5d4cc5e754b0cad"
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

const form = document.getElementById("orderForm");
const result = document.getElementById("result");

form.addEventListener("submit", (e) => {
  e.preventDefault();

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
      form.reset();
    })
    .catch((error) => {
      result.textContent = " Erreur : " + error.message;
    });
});
