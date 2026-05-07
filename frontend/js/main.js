const API_URL = 'https://your-backend-render-url.onrender.com/api';

let cart = JSON.parse(localStorage.getItem('zenith_cart')) || [];

function updateCartCount() {
    const countElement = document.getElementById('cart-count');
    if (countElement) {
        countElement.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
    }
}

function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const existing = cart.find(item => item.id === productId);

    if (existing) {
        existing.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }

    localStorage.setItem('zenith_cart', JSON.stringify(cart));
    updateCartCount();
    alert(`${product.name} added to cart`);
}

function renderProducts(productsList, targetId = 'products-grid') {
    const grid = document.getElementById(targetId);
    if (!grid) return;

    grid.innerHTML = productsList.map(product => `
        <div class="product-card">
            <div style="background: var(--secondary); height: 200px; border-radius: 8px; margin-bottom: 15px; display: flex; align-items: center; justify-content: center; overflow: hidden;">
                <img src="${product.image}" alt="${product.name}" style="width: 100%; height: 100%; object-fit: cover;">
            </div>
            <p style="color: var(--text-muted); font-size: 0.8rem; text-transform: uppercase; letter-spacing: 1px;">${product.category}</p>
            <h3 style="margin: 5px 0 10px 0;">${product.name}</h3>
            <p style="font-weight: 600; color: var(--accent); margin-bottom: 15px;">$${product.price.toFixed(2)}</p>
            <button class="btn" style="width: 100%;" onclick="addToCart(${product.id})">Add to Cart</button>
        </div>
    `).join('');
}

function checkAuth() {
    const user = JSON.parse(localStorage.getItem('zenith_user'));
    const authLinks = document.getElementById('auth-links');
    
    if (user && authLinks) {
        authLinks.innerHTML = `
            <span style="color: var(--text-muted);">Hi, ${user.name}</span>
            ${user.role === 'admin' ? '<a href="admin.html" style="margin-left: 20px; text-decoration: none; color: var(--accent);">Admin</a>' : ''}
            <a href="#" onclick="logout()" style="margin-left: 20px; text-decoration: none; color: var(--text-main);">Logout</a>
        `;
    }
}

function logout() {
    localStorage.removeItem('zenith_user');
    window.location.href = 'index.html';
}

document.addEventListener('DOMContentLoaded', () => {
    updateCartCount();
    checkAuth();
    if(document.getElementById('featured-grid')) {
        renderProducts(products.slice(0, 3), 'featured-grid');
    }
});