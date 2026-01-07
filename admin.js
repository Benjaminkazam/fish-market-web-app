import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getDatabase, ref, onChildAdded } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-database.js";

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
const db = getDatabase(app);

const ordersDiv = document.getElementById("orders");

onChildAdded(ref(db, "orders"), (snapshot) => {
  const o = snapshot.val();

  ordersDiv.innerHTML += `
    <div class="order-card">
      <strong>${o.name}</strong><br>
      Produit : ${o.product}<br>
      Quantité : ${o.quantity}<br>
      Livraison : ${o.deliveryDate}<br>
      Adresse : ${o.address}<br>
      Téléphone : ${o.phone}<br>
      <small>Commande passée le ${o.time}</small>
    </div>
  `;
});
