import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-database.js";

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
