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

onAuthStateChanged(auth, (user) => {
  if (!user) {
    window.location.href = "login.html";
  }
});
const database = getDatabase(app);

const tableBody = document.querySelector("#ordersTable tbody");

onValue(ref(database, "orders"), (snapshot) => {
  tableBody.innerHTML = "";

  snapshot.forEach(child => {
    const o = child.val();

    const row = `
      <tr>
        <td>${o.name}</td>
        <td>${o.product}</td>
        <td>${o.quantity}</td>
        <td>${o.deliveryDate}</td>
        <td>${o.address}</td>
        <td>${o.phone}</td>
        <td>${o.createdAt}</td>
      </tr>
    `;

    tableBody.innerHTML += row;
  });
});
function goHome() {
  window.location.href = "index.html";
}
window.goHome = goHome;
