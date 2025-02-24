// Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyDksaEMrHB5Wk4yWwg7GbKEeQlo0RZueq0",
  authDomain: "price-list-542e6.firebaseapp.com",
  projectId: "price-list-542e6",
  storageBucket: "price-list-542e6.firebasestorage.app",
  messagingSenderId: "1009713697691",
  appId: "1:1009713697691:web:9ef1ad1aa4f0be214a473e",
  measurementId: "G-HQLQS92RLV"
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const database = firebase.database();

// App State
let isAdmin = false;

// Authentication
function loginAdmin() {
    const password = document.getElementById('adminPassword').value;
    const errorDiv = document.getElementById('loginError');
    
    // Basic password check (replace with Firebase Auth later)
    if(password === 'admin123') {
        isAdmin = true;
        document.getElementById('adminControls').style.display = 'block';
        document.getElementById('adminLogin').style.display = 'none';
        errorDiv.textContent = '';
        showMessage('Login successful!', 'success');
        loadItems();
    } else {
        errorDiv.textContent = 'Invalid password!';
        showMessage('Authentication failed', 'error');
    }
}

// Database Operations
async function addOrUpdateItem() {
    const name = document.getElementById('itemName').value.trim();
    const price = document.getElementById('itemPrice').value;
    const statusDiv = document.getElementById('saveStatus');

    if (!isAdmin) {
        showMessage('Unauthorized access!', 'error');
        return;
    }

    if (!name || !price) {
        showMessage('Please fill all fields!', 'error');
        return;
    }

    try {
        const timestamp = new Date().toISOString();
        await database.ref('items/' + name).set({
            price: parseFloat(price),
            timestamp: timestamp
        });
        showMessage('Item saved successfully!', 'success');
        clearForm();
    } catch (error) {
        showMessage(`Error: ${error.message}`, 'error');
    }
}

// Real-time Updates
function loadItems() {
    database.ref('items').on('value', (snapshot) => {
        const items = snapshot.val() || {};
        displayItems(items);
    });
}

// Display Items
function displayItems(items) {
    const itemsList = document.getElementById('itemsList');
    itemsList.innerHTML = '';

    Object.entries(items).forEach(([name, details]) => {
        const itemElement = document.createElement('div');
        itemElement.className = 'item-card';
        itemElement.innerHTML = `
            <h3>${name}</h3>
            <p>Price: $${details.price.toFixed(2)}</p>
            <p class="timestamp">Last updated: ${new Date(details.timestamp).toLocaleString()}</p>
        `;
        itemsList.appendChild(itemElement);
    });
}

// Helpers
function showMessage(message, type) {
    const statusDiv = document.getElementById('saveStatus');
    statusDiv.textContent = message;
    statusDiv.className = `status-message ${type}`;
    setTimeout(() => statusDiv.textContent = '', 3000);
}

function clearForm() {
    document.getElementById('itemName').value = '';
    document.getElementById('itemPrice').value = '';
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadItems();
});