import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";

// ✅ FIXED: Using correct Firebase config (web-vente)
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

const form = document.getElementById("loginForm");
const result = document.getElementById("result");

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  // Show loading state
  result.textContent = "Connexion en cours...";
  result.style.color = "#1e90ff";

  signInWithEmailAndPassword(auth, email, password)
    .then(() => {
      result.textContent = "✅ Connexion réussie!";
      result.style.color = "green";
      // Redirect to admin page
      setTimeout(() => {
        window.location.href = "admin.html";
      }, 500);
    })
    .catch((error) => {
      result.style.color = "red";
      // More helpful error messages
      if (error.code === "auth/invalid-email") {
        result.textContent = "❌ Email invalide";
      } else if (error.code === "auth/user-not-found") {
        result.textContent = "❌ Utilisateur non trouvé";
      } else if (error.code === "auth/wrong-password") {
        result.textContent = "❌ Mot de passe incorrect";
      } else if (error.code === "auth/invalid-credential") {
        result.textContent = "❌ Email ou mot de passe incorrect";
      } else {
        result.textContent = "❌ Erreur : " + error.message;
      }
    });
});

window.goHome = function () {
  window.location.href = "index.html";
};