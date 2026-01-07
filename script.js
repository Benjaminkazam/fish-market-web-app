// Import Firebase (version 9 - module)
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getDatabase, ref, push } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-database.js";

// Configuration Firebase
const firebaseConfig = {
  apiKey: "AIzaSyAm8DR4ul2w-80xfo8uhzpTskaWvO_MwhU",
  authDomain: "poissonerie-website.firebaseapp.com",
  databaseURL: "https://poissonerie-website-default-rtdb.firebaseio.com",
  projectId: "poissonerie-website",
  storageBucket: "poissonerie-website.appspot.com",
  messagingSenderId: "305612877784",
  appId: "1:305612877784:web:71cb27c5d4cc5e754b0cad"
};

// Initialiser Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

// Sélection du formulaire
const form = document.getElementById("userForm");

// Sécurité : vérifier que le formulaire existe
if (form) {
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;

    if (name === "" || email === "") {
      alert("Veuillez remplir tous les champs");
      return;
    }

    // Envoi vers Realtime Database
    push(ref(database, "users"), {
      name: name,
      email: email
    })
    .then(() => {
      document.getElementById("result").innerText =
        "Data saved successfully!";
      form.reset();
    })
    .catch((error) => {
      alert("Erreur : " + error.message);
    });
  });
}
