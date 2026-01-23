import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getDatabase, ref, onValue, set, remove, update } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-database.js";

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
const database = getDatabase(app);

let allOrders = [];
let allProducts = [];

// Authentication
onAuthStateChanged(auth, (user) => {
  if (!user) {
    window.location.href = "login.html";
  } else {
    loadOrders();
    loadProducts();
  }
});

// Format prix
function formatPrice(price) {
  return price.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

// ===== GESTION DES ONGLETS =====
window.switchTab = function(tabName) {
  // Cacher tous les onglets
  document.querySelectorAll('.tab-content').forEach(tab => {
    tab.classList.remove('active');
  });
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.classList.remove('active');
  });

  // Afficher l'onglet sélectionné
  if (tabName === 'orders') {
    document.getElementById('ordersTab').classList.add('active');
    document.querySelector('[onclick="switchTab(\'orders\')"]').classList.add('active');
  } else if (tabName === 'products') {
    document.getElementById('productsTab').classList.add('active');
    document.querySelector('[onclick="switchTab(\'products\')"]').classList.add('active');
  }
};

// ===== CHARGEMENT DES COMMANDES =====
function loadOrders() {
  onValue(ref(database, "orders"), (snapshot) => {
    allOrders = [];
    
    if (!snapshot.exists()) {
      document.querySelector("#ordersTable tbody").innerHTML = `
        <tr><td colspan="9" style="text-align:center; color:#999;">Aucune commande</td></tr>
      `;
      updateStats();
      return;
    }

    snapshot.forEach(child => {
      allOrders.push({
        id: child.key,
        ...child.val()
      });
    });

    // Tri par date
    allOrders.sort((a, b) => {
      const dateA = new Date(a.createdAt.split(' ')[0].split('/').reverse().join('-'));
      const dateB = new Date(b.createdAt.split(' ')[0].split('/').reverse().join('-'));
      return dateB - dateA;
    });

    displayOrders(allOrders);
    updateStats();
  });
}

function displayOrders(orders) {
  const tbody = document.querySelector("#ordersTable tbody");
  tbody.innerHTML = "";

  if (orders.length === 0) {
    tbody.innerHTML = `<tr><td colspan="9" style="text-align:center; color:#999;">Aucune commande trouvée</td></tr>`;
    return;
  }

  orders.forEach(order => {
    const status = order.status || 'En attente';
    const statusClass = getStatusClass(status);
    const totalPrice = order.totalPrice || 0;

    const row = `
      <tr>
        <td><span class="status-badge ${statusClass}">${status}</span></td>
        <td>${order.name || '-'}</td>
        <td>${order.product || '-'}</td>
        <td>${order.quantity || '-'} kg</td>
        <td style="font-weight: bold;">${formatPrice(totalPrice)} FC</td>
        <td>${order.deliveryDate || '-'}</td>
        <td>${order.phone || '-'}</td>
        <td>${order.createdAt || '-'}</td>
        <td>
          <div class="action-btns">
            <button class="action-btn view" onclick="viewOrder('${order.id}')">👁️</button>
            ${status !== 'Livrée' ? `<button class="action-btn complete" onclick="markAsDelivered('${order.id}')">✅</button>` : ''}
            ${status !== 'Annulée' ? `<button class="action-btn cancel" onclick="cancelOrder('${order.id}')">❌</button>` : ''}
          </div>
        </td>
      </tr>
    `;
    tbody.innerHTML += row;
  });
}

function getStatusClass(status) {
  const classes = {
    'En attente': 'status-pending',
    'En cours': 'status-progress',
    'Livrée': 'status-completed',
    'Annulée': 'status-cancelled'
  };
  return classes[status] || 'status-pending';
}

// ===== FILTRAGE DES COMMANDES =====
window.filterOrders = function() {
  const searchTerm = document.getElementById('searchOrders').value.toLowerCase();
  const statusFilter = document.getElementById('filterStatus').value;
  const dateFilter = document.getElementById('filterDate').value;

  let filtered = allOrders.filter(order => {
    const matchSearch = !searchTerm || 
      (order.name && order.name.toLowerCase().includes(searchTerm)) ||
      (order.phone && order.phone.includes(searchTerm));
    
    const matchStatus = !statusFilter || order.status === statusFilter;
    
    const matchDate = !dateFilter || 
      (order.deliveryDate && order.deliveryDate === dateFilter);

    return matchSearch && matchStatus && matchDate;
  });

  displayOrders(filtered);
};

// ===== ACTIONS SUR COMMANDES =====
window.viewOrder = function(orderId) {
  const order = allOrders.find(o => o.id === orderId);
  if (!order) return;

  const details = `
    <div class="order-summary">
      <h3>Informations Client</h3>
      <p><strong>Nom:</strong> ${order.name}</p>
      <p><strong>Téléphone:</strong> ${order.phone}</p>
      <p><strong>Adresse:</strong> ${order.address}</p>
      
      <hr>
      
      <h3>Détails Commande</h3>
      <p><strong>Produit:</strong> ${order.product}</p>
      <p><strong>Quantité:</strong> ${order.quantity} kg</p>
      <p><strong>Prix/kg:</strong> ${formatPrice(order.pricePerKg || 0)} FC</p>
      <p><strong>Total:</strong> <span style="color:#2ecc71; font-size:1.5rem; font-weight:bold;">${formatPrice(order.totalPrice || 0)} FC</span></p>
      
      <hr>
      
      <p><strong>Date livraison:</strong> ${order.deliveryDate}</p>
      <p><strong>Date commande:</strong> ${order.createdAt}</p>
      <p><strong>Statut:</strong> <span class="status-badge ${getStatusClass(order.status || 'En attente')}">${order.status || 'En attente'}</span></p>
    </div>
  `;

  document.getElementById('orderDetails').innerHTML = details;
  document.getElementById('orderModal').style.display = 'flex';
};

window.markAsDelivered = function(orderId) {
  if (!confirm('Marquer cette commande comme livrée ?')) return;

  update(ref(database, `orders/${orderId}`), {
    status: 'Livrée',
    deliveredAt: new Date().toLocaleString('fr-FR')
  }).then(() => {
    alert('✅ Commande marquée comme livrée');
  }).catch(err => {
    alert('❌ Erreur: ' + err.message);
  });
};

window.cancelOrder = function(orderId) {
  if (!confirm('Annuler cette commande ?')) return;

  update(ref(database, `orders/${orderId}`), {
    status: 'Annulée',
    cancelledAt: new Date().toLocaleString('fr-FR')
  }).then(() => {
    alert('❌ Commande annulée');
  }).catch(err => {
    alert('❌ Erreur: ' + err.message);
  });
};

window.closeOrderModal = function() {
  document.getElementById('orderModal').style.display = 'none';
};

// ===== STATISTIQUES =====
function updateStats() {
  const total = allOrders.length;
  const pending = allOrders.filter(o => (o.status || 'En attente') === 'En attente').length;
  const completed = allOrders.filter(o => o.status === 'Livrée').length;
  const revenue = allOrders.reduce((sum, o) => sum + (o.totalPrice || 0), 0);

  document.getElementById('totalOrders').textContent = total;
  document.getElementById('pendingOrders').textContent = pending;
  document.getElementById('completedOrders').textContent = completed;
  document.getElementById('totalRevenue').textContent = formatPrice(revenue) + ' FC';
}

// ===== GESTION DES PRODUITS =====
function loadProducts() {
  onValue(ref(database, "products"), (snapshot) => {
    allProducts = [];
    const grid = document.getElementById('productsGrid');

    if (!snapshot.exists()) {
      grid.innerHTML = `
        <div style="text-align:center; padding:40px; color:#999; grid-column: 1/-1;">
          <p>Aucun produit</p>
          <button class="btn-primary" onclick="openProductModal()">➕ Ajouter votre premier produit</button>
        </div>
      `;
      return;
    }

    snapshot.forEach(child => {
      allProducts.push({
        id: child.key,
        ...child.val()
      });
    });

    displayProducts();
  });
}

function displayProducts() {
  const grid = document.getElementById('productsGrid');
  grid.innerHTML = '';

  allProducts.forEach(product => {
    const activeClass = product.active !== false ? 'active' : 'inactive';
    const statusText = product.active !== false ? 'Actif' : 'Inactif';
    
    const card = `
      <div class="product-item ${activeClass}">
        <div class="product-header">
          <div class="product-icon-large">${product.icon || '📦'}</div>
          <div class="product-actions">
            <button class="icon-btn edit" onclick="editProduct('${product.id}')" title="Modifier">✏️</button>
            <button class="icon-btn delete" onclick="deleteProduct('${product.id}')" title="Supprimer">🗑️</button>
          </div>
        </div>
        <div class="product-name">${product.name}</div>
        <div class="product-price">${formatPrice(product.price)} FC/kg</div>
        <div class="product-description">${product.description || 'Pas de description'}</div>
        <span class="product-status ${activeClass}">${statusText}</span>
      </div>
    `;
    
    grid.innerHTML += card;
  });
}

window.openProductModal = function(productId = null) {
  const modal = document.getElementById('productModal');
  const form = document.getElementById('productForm');
  const title = document.getElementById('productModalTitle');

  form.reset();
  document.getElementById('productId').value = '';

  if (productId) {
    const product = allProducts.find(p => p.id === productId);
    if (product) {
      title.textContent = 'Modifier le Produit';
      document.getElementById('productId').value = product.id;
      document.getElementById('productName').value = product.name;
      document.getElementById('productPrice').value = product.price;
      document.getElementById('productIcon').value = product.icon || '';
      document.getElementById('productDescription').value = product.description || '';
      document.getElementById('productActive').checked = product.active !== false;
    }
  } else {
    title.textContent = 'Ajouter un Produit';
    document.getElementById('productActive').checked = true;
  }

  modal.style.display = 'flex';
};

window.editProduct = function(productId) {
  openProductModal(productId);
};

window.closeProductModal = function() {
  document.getElementById('productModal').style.display = 'none';
};

document.getElementById('productForm').addEventListener('submit', (e) => {
  e.preventDefault();

  const productId = document.getElementById('productId').value;
  const productData = {
    name: document.getElementById('productName').value.trim(),
    price: parseFloat(document.getElementById('productPrice').value),
    icon: document.getElementById('productIcon').value.trim() || '📦',
    description: document.getElementById('productDescription').value.trim(),
    active: document.getElementById('productActive').checked,
    updatedAt: new Date().toLocaleString('fr-FR')
  };

  if (productId) {
    // Mise à jour
    update(ref(database, `products/${productId}`), productData)
      .then(() => {
        alert('✅ Produit mis à jour');
        closeProductModal();
        
        // Mettre à jour aussi le sélecteur dans client.html via reload
        updateClientProductList();
      })
      .catch(err => alert('❌ Erreur: ' + err.message));
  } else {
    // Création
    const newId = 'prod_' + Date.now();
    productData.createdAt = new Date().toLocaleString('fr-FR');
    
    set(ref(database, `products/${newId}`), productData)
      .then(() => {
        alert('✅ Produit ajouté');
        closeProductModal();
        updateClientProductList();
      })
      .catch(err => alert('❌ Erreur: ' + err.message));
  }
});

window.deleteProduct = function(productId) {
  const product = allProducts.find(p => p.id === productId);
  if (!product) return;

  if (!confirm(`Supprimer "${product.name}" ?\n\nCette action est irréversible.`)) return;

  remove(ref(database, `products/${productId}`))
    .then(() => {
      alert('✅ Produit supprimé');
      updateClientProductList();
    })
    .catch(err => alert('❌ Erreur: ' + err.message));
};

// Fonction pour synchroniser avec client.html
function updateClientProductList() {
  // Cette fonction est appelée pour indiquer qu'il faut recharger la liste
  // Dans client.js, on écoute déjà la base de données en temps réel
  console.log('Liste des produits mise à jour');
}

window.goHome = function() {
  window.location.href = "index.html";
};

window.logout = function() {
  auth.signOut().then(() => {
    window.location.href = "login.html";
  });
};