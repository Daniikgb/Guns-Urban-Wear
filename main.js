// Product Data Catalog
const products = [
    { id: 1, name: "Camisa de Lino White", price: 180000, img: "assets/prod-1.png", category: "Camisas" },
    { id: 2, name: "Camisa de Lino Black", price: 180000, img: "assets/prod-2.png", category: "Camisas" },
    { id: 3, name: "Pantalón Sport Cargo", price: 220000, img: "assets/prod-3.png", category: "Pantalones" },
    { id: 4, name: "Pantalón Jogger Urban", price: 210000, img: "assets/prod-4.png", category: "Pantalones" },
    { id: 5, name: "Polo Premium Navy", price: 150000, img: "assets/prod-5.png", category: "Remeras" },
    { id: 6, name: "Remera Oversize White", price: 120000, img: "assets/prod-6.png", category: "Remeras" },
    { id: 7, name: "Remera Oversize Black", price: 120000, img: "assets/prod-7.png", category: "Remeras" },
    { id: 8, name: "Remera Acid Wash", price: 130000, img: "assets/prod-8.png", category: "Remeras" },
    { id: 9, name: "Remera Boxy Fit", price: 125000, img: "assets/prod-9.png", category: "Remeras" },
    { id: 10, name: "Pantalón Safari", price: 240000, img: "assets/prod-10.png", category: "Pantalones" },
    { id: 11, name: "Short Denim Light", price: 160000, img: "assets/prod-11.png", category: "Pantalones" },
    { id: 12, name: "Short Denim Dark", price: 160000, img: "assets/prod-12.png", category: "Pantalones" },
    { id: 13, name: "Vaquero Slim Blue", price: 250000, img: "assets/prod-13.png", category: "Jeans" },
    { id: 14, name: "Vaquero Straight Black", price: 250000, img: "assets/prod-14.png", category: "Jeans" },
    { id: 15, name: "Vaquero Baggy Grey", price: 260000, img: "assets/prod-15.png", category: "Jeans" }
];

// App State
let cart = JSON.parse(localStorage.getItem('gunUrbanWear_cart')) || [];

// DOM Elements
const productGrid = document.getElementById('productGrid');
const cartDrawer = document.getElementById('cartDrawer');
const cartOverlay = document.getElementById('cartOverlay');
const cartItemsList = document.getElementById('cartItemsList');
const cartCount = document.getElementById('cartCount');
const cartTotalText = document.getElementById('cartTotalText');
const openCartBtn = document.getElementById('openCart');
const closeCartBtn = document.getElementById('closeCart');
const checkoutBtn = document.getElementById('checkoutBtn');

// Initialize Website
document.addEventListener('DOMContentLoaded', () => {
    renderProducts();
    updateCartUI();
    setupEventListeners();
});

// Render Catalog
function renderProducts() {
    productGrid.innerHTML = products.map(product => `
        <div class="product-card">
            <div class="product-img-box">
                <img src="${product.img}" alt="${product.name}">
                <div class="add-btn-premium" onclick="addToCart(${product.id})">Añadir</div>
            </div>
            <div class="product-meta">
                <h4>${product.name}</h4>
                <p>Gs. ${product.price.toLocaleString('es-PY')}</p>
            </div>
        </div>
    `).join('');
}

// Cart Logic
window.addToCart = (productId) => {
    const product = products.find(p => p.id === productId);
    const existing = cart.find(item => item.id === productId);

    if (existing) {
        existing.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }

    saveCart();
    updateCartUI();
    toggleCart(true);
};

window.removeFromCart = (productId) => {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
    updateCartUI();
};

function saveCart() {
    localStorage.setItem('gunUrbanWear_cart', JSON.stringify(cart));
}

function updateCartUI() {
    const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
    cartCount.innerText = totalItems;

    if (cart.length === 0) {
        cartItemsList.innerHTML = '<p style="text-align: center; color: var(--text-secondary); margin-top: 50px;">Tu carrito está vacío.</p>';
    } else {
        cartItemsList.innerHTML = cart.map(item => `
            <div style="display: grid; grid-template-columns: 80px 1fr auto; gap: 20px; align-items: center; margin-bottom: 25px;">
                <div style="background: #111; border-radius: 12px; padding: 10px;">
                    <img src="${item.img}" style="width: 100%; height: 80px; object-fit: contain;">
                </div>
                <div>
                    <h4 style="font-size: 0.9rem; margin-bottom: 5px;">${item.name}</h4>
                    <p style="font-size: 0.8rem; color: var(--text-secondary);">${item.quantity}x Gs. ${item.price.toLocaleString('es-PY')}</p>
                </div>
                <span style="color: #ff4d4d; cursor: pointer; font-weight: 700; font-size: 0.7rem;" onclick="removeFromCart(${item.id})">ELIMINAR</span>
            </div>
        `).join('');
    }

    const total = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    cartTotalText.innerText = `Gs. ${total.toLocaleString('es-PY')}`;
}

function toggleCart(show) {
    if (show) {
        cartDrawer.classList.add('active');
        cartOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    } else {
        cartDrawer.classList.remove('active');
        cartOverlay.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
}

// Event Listeners
function setupEventListeners() {
    openCartBtn.addEventListener('click', () => toggleCart(true));
    closeCartBtn.addEventListener('click', () => toggleCart(false));
    cartOverlay.addEventListener('click', () => toggleCart(false));

    checkoutBtn.addEventListener('click', () => {
        const message = `Hola Gun's Urban Wear, me gustaría realizar un pedido:\n\n` +
            cart.map(item => `- ${item.name} (${item.quantity}x)`).join('\n') +
            `\n\nTotal: ${cartTotalText.innerText}`;

        const waUrl = `https://wa.me/595984849863?text=${encodeURIComponent(message)}`;
        window.open(waUrl, '_blank');
    });

    // Contact Modal Logic
    const contactTrigger = document.getElementById('contactTrigger');
    const contactModal = document.getElementById('contactModal');
    const contactOverlay = document.getElementById('contactOverlay');
    const closeContact = document.getElementById('closeContact');

    function toggleContact(show) {
        if (show) {
            contactModal.classList.add('active');
            contactOverlay.classList.add('active');
            document.body.style.overflow = 'hidden';
        } else {
            contactModal.classList.remove('active');
            contactOverlay.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    }

    contactTrigger.addEventListener('click', () => toggleContact(true));
    closeContact.addEventListener('click', () => toggleContact(false));
    contactOverlay.addEventListener('click', () => toggleContact(false));
}
