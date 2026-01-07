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
const db = getDatabase(app);

document.getElementById("sendBtn").addEventListener("click", () => {
  const order = {
    name: name.value,
    product: product.value,
    quantity: quantity.value,
    deliveryDate: deliveryDate.value,
    address: address.value,
    phone: phone.value,
    time: new Date().toLocaleString()
  };

  push(ref(db, "orders"), order).then(() => {
    alert("Commande envoyée avec succès !");
  });
});
