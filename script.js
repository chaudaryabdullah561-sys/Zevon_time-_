// Shopping Cart Functionality
let cart = [];

// Products Data
const products = [
    { id: 1, name: 'Zevon Classic', price: 299.99 },
    { id: 2, name: 'Zevon Luxe', price: 549.99 },
    { id: 3, name: 'Zevon Sport', price: 399.99 },
    { id: 4, name: 'Zevon Elite', price: 799.99 },
    { id: 5, name: 'Zevon Minimal', price: 149.99 },
    { id: 6, name: 'Zevon Heritage', price: 349.99 }
];

// Load cart from localStorage
function loadCart() {
    const saved = localStorage.getItem('zevonCart');
    if (saved) {
        cart = JSON.parse(saved);
    }
}

// Save cart to localStorage
function saveCart() {
    localStorage.setItem('zevonCart', JSON.stringify(cart));
}

// Add to Cart
function addToCart(productName, price) {
    const existingItem = cart.find(item => item.name === productName);
    
    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({
            name: productName,
            price: price,
            quantity: 1
        });
    }
    
    saveCart();
    updateCart();
    showNotification(`${productName} added to cart!`);
}

// Update Cart Display
function updateCart() {
    const cartItems = document.querySelector('.cart-items');
    const cartTotal = document.querySelector('.cart-total');
    
    if (cart.length === 0) {
        cartItems.innerHTML = '<p style="text-align: center; color: #999;">Your cart is empty</p>';
        cartTotal.innerHTML = '<strong>Total: $0.00</strong>';
        return;
    }
    
    let html = '';
    let total = 0;
    
    cart.forEach((item, index) => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        html += `
            <div style="display: flex; justify-content: space-between; align-items: center; padding: 1rem 0; border-bottom: 1px solid #eee;">
                <div>
                    <strong>${item.name}</strong><br>
                    <span style="color: #999;">$${item.price.toFixed(2)} x ${item.quantity}</span>
                </div>
                <div style="display: flex; align-items: center; gap: 1rem;">
                    <strong>$${itemTotal.toFixed(2)}</strong>
                    <button onclick="removeFromCart(${index})" style="background: #c9302c; color: white; border: none; padding: 5px 10px; border-radius: 3px; cursor: pointer;">Remove</button>
                </div>
            </div>
        `;
    });
    
    cartItems.innerHTML = html;
    cartTotal.innerHTML = `<strong>Total: $${total.toFixed(2)}</strong>`;
}

// Remove from Cart
function removeFromCart(index) {
    cart.splice(index, 1);
    saveCart();
    updateCart();
}

// Show Notification
function showNotification(message) {
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background-color: #28a745;
        color: white;
        padding: 15px 20px;
        border-radius: 5px;
        z-index: 1000;
        animation: slideIn 0.3s ease;
    `;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Smooth Scroll Navigation
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});

// Cart Modal Control
function setupCartModal() {
    const cartIcon = document.querySelector('.cart-icon');
    const cartModal = document.getElementById('cart');
    const closeBtn = document.querySelector('.close');
    
    if (cartIcon) {
        cartIcon.addEventListener('click', (e) => {
            e.preventDefault();
            cartModal.classList.add('active');
        });
    }
    
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            cartModal.classList.remove('active');
        });
    }
    
    window.addEventListener('click', (e) => {
        if (e.target === cartModal) {
            cartModal.classList.remove('active');
        }
    });
}

// Contact Form Submission
function setupContactForm() {
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            showNotification('Thank you for your message! We\'ll get back to you soon.');
            contactForm.reset();
        });
    }
}

// Add to Cart Button Handler
function setupAddToCartButtons() {
    const buttons = document.querySelectorAll('.add-to-cart');
    buttons.forEach((button, index) => {
        button.addEventListener('click', () => {
            const productCard = button.closest('.product-card');
            const productName = productCard.querySelector('.product-info h3').textContent;
            const priceText = productCard.querySelector('.price').textContent;
            const price = parseFloat(priceText.replace('$', '').split(' ')[priceText.includes('$') ? 0 : 1] || 0);
            
            addToCart(productName, price);
        });
    });
}

// Checkout Button Handler
function setupCheckoutButton() {
    const checkoutBtn = document.querySelector('.checkout-button');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', () => {
            if (cart.length === 0) {
                showNotification('Your cart is empty!');
                return;
            }
            showNotification('Proceeding to checkout...');
            setTimeout(() => {
                showNotification('Thank you for your order!');
                cart = [];
                saveCart();
                updateCart();
            }, 1000);
        });
    }
}

// Navbar Active State
function updateActiveNavLink() {
    const sections = document.querySelectorAll('section, header');
    const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');
    
    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            if (window.scrollY >= sectionTop - 200) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').slice(1) === current) {
                link.classList.add('active');
            }
        });
    });
}

// Add Active Link Styles
function addActiveNavStyles() {
    const style = document.createElement('style');
    style.textContent = `
        .nav-links a.active {
            color: var(--secondary-color) !important;
            border-bottom: 2px solid var(--secondary-color);
            padding-bottom: 5px;
        }
        
        @keyframes slideIn {
            from {
                transform: translateX(400px);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
    `;
    document.head.appendChild(style);
}

// Initialize on Page Load
document.addEventListener('DOMContentLoaded', () => {
    loadCart();
    updateCart();
    setupCartModal();
    setupContactForm();
    setupAddToCartButtons();
    setupCheckoutButton();
    updateActiveNavLink();
    addActiveNavStyles();
    
    console.log('Zevon Time - E-commerce Ready! 🕐');
});

// Quantity Update (optional enhancement)
function updateQuantity(index, quantity) {
    if (quantity <= 0) {
        removeFromCart(index);
    } else {
        cart[index].quantity = quantity;
        saveCart();
        updateCart();
    }
}
