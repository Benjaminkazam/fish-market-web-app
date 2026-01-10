import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyAm8DR4ul2w-80xfo8uhzpTskaWvO_MwhU",
  authDomain: "poissonerie-website.firebaseapp.com",
  projectId: "poissonerie-website",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const form = document.getElementById("loginForm");
const result = document.getElementById("result");

form.addEventListener("submit", (e) => {
  e.preventDefault();

  signInWithEmailAndPassword(
    auth,
    email.value,
    password.value
  )
    .then(() => {
      result.textContent = " Connexion réussie";
      window.location.href = "Admin.html";
    })
    .catch(() => {
      result.textContent = "Email ou mot de passe incorrect";
    });
});

function goHome() {
  window.location.href = "index.html";
}

window.goHome = goHome;
