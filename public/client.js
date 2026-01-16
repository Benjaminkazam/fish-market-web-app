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

// Éléments du DOM
const form = document.getElementById("orderForm");
const result = document.getElementById("result");
const productSelect = document.getElementById("product");
const quantityInput = document.getElementById("quantity");
const totalAmountDisplay = document.getElementById("totalAmount");
const modal = document.getElementById("confirmModal");

// Variable globale pour stocker la commande temporaire
let pendingOrder = null;

// ===== CALCUL AUTOMATIQUE DU PRIX =====
function calculateTotal() {
  const selectedOption = productSelect.options[productSelect.selectedIndex];
  const pricePerKg = parseInt(selectedOption.getAttribute('data-price')) || 0;
  const quantity = parseFloat(quantityInput.value) || 0;
  
  const total = pricePerKg * quantity;
  
  // Format avec séparateur de milliers (style européen : 75.000)
  totalAmountDisplay.textContent = formatPrice(total) + " FC";
}

// Formater le prix avec des points
function formatPrice(price) {
  return price.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

// Écouter les changements pour recalculer
productSelect.addEventListener('change', calculateTotal);
quantityInput.addEventListener('input', calculateTotal);

// ===== SOUMISSION DU FORMULAIRE =====
form.addEventListener("submit", (e) => {
  e.preventDefault();
  
  // Récupérer les valeurs
  const name = document.getElementById("name").value.trim();
  const selectedOption = productSelect.options[productSelect.selectedIndex];
  const product = selectedOption.value;
  const pricePerKg = parseInt(selectedOption.getAttribute('data-price'));
  const quantity = parseFloat(quantityInput.value);
  const deliveryDate = document.getElementById("deliveryDate").value;
  const address = document.getElementById("address").value.trim();
  const phone = document.getElementById("phone").value.trim();
  const today = new Date().toISOString().split("T")[0];

  // ===== VALIDATIONS =====
  if (!product) {
    result.textContent = "❌ Veuillez sélectionner un produit";
    result.style.color = "red";
    return;
  }

  if (quantity < 1) {
    result.textContent = "❌ La quantité minimum est 1 kg";
    result.style.color = "red";
    return;
  }

  if (quantity > 100) {
    result.textContent = "❌ La quantité maximum est 100 kg";
    result.style.color = "red";
    return;
  }

  if (deliveryDate < today) {
    result.textContent = "❌ La date de livraison est déjà passée";
    result.style.color = "red";
    return;
  }

  // Calculer le total
  const totalPrice = pricePerKg * quantity;

  // Stocker la commande temporaire
  pendingOrder = {
    name: name,
    product: product,
    quantity: quantity,
    pricePerKg: pricePerKg,
    totalPrice: totalPrice,
    deliveryDate: deliveryDate,
    address: address,
    phone: phone,
    createdAt: new Date().toLocaleString('fr-FR', { 
      dateStyle: 'short', 
      timeStyle: 'short' 
    })
  };

  // Afficher le modal de confirmation
  showConfirmationModal(pendingOrder);
});

// ===== AFFICHER LE MODAL DE CONFIRMATION =====
function showConfirmationModal(order) {
  document.getElementById("modalName").textContent = order.name;
  document.getElementById("modalProduct").textContent = order.product;
  document.getElementById("modalQuantity").textContent = order.quantity;
  document.getElementById("modalPricePerKg").textContent = formatPrice(order.pricePerKg);
  document.getElementById("modalTotal").textContent = formatPrice(order.totalPrice) + " FC";
  document.getElementById("modalDate").textContent = new Date(order.deliveryDate).toLocaleDateString('fr-FR');
  document.getElementById("modalAddress").textContent = order.address;
  
  modal.style.display = "flex";
}

// ===== CONFIRMER LA COMMANDE =====
window.confirmOrder = function() {
  if (!pendingOrder) return;

  // Enregistrer dans Firebase
  push(ref(database, "orders"), pendingOrder)
    .then(() => {
      // Fermer le modal
      modal.style.display = "none";
      
      // Afficher message de succès
      result.innerHTML = `
        <div style="text-align: center; color: green; font-weight: bold; padding: 20px; background: #d4edda; border-radius: 10px; margin-top: 20px;">
          ✅ Commande envoyée avec succès !<br><br>
          Votre commande de ${pendingOrder.quantity}kg pour ${formatPrice(pendingOrder.totalPrice)} FC<br>
          a été enregistrée avec succès.<br><br>
          Merci de votre confiance !<br><br>
          <small>Redirection vers l'accueil dans 3 secondes...</small>
        </div>
      `;
      
      // Masquer le formulaire
      form.style.display = "none";
      
      // Réinitialiser
      pendingOrder = null;
      
      // Rediriger après 3 secondes
      setTimeout(() => {
        window.location.href = "index.html";
      }, 3000);
    })
    .catch((error) => {
      modal.style.display = "none";
      result.textContent = "❌ Erreur : " + error.message;
      result.style.color = "red";
    });
};

// ===== ANNULER LA COMMANDE =====
window.cancelOrder = function() {
  modal.style.display = "none";
  pendingOrder = null;
  result.textContent = "";
};

// ===== FONCTION RETOUR ACCUEIL =====
window.goHome = function() {
  window.location.href = "index.html";
};

// Fermer le modal si on clique en dehors
window.onclick = function(event) {
  if (event.target === modal) {
    cancelOrder();
  }
};