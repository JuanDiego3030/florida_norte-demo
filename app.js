// Register GSAP ScrollTrigger Plugin
gsap.registerPlugin(ScrollTrigger);

// Navbar Scroll Effect
const mainNav = document.getElementById('main-nav');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        mainNav.classList.add('scrolled');
    } else {
        mainNav.classList.remove('scrolled');
    }
});

// Mock Database of Materials for Search
const mockProducts = [
    { id: 1, name: 'Cemento Loma Negra 50kg', price: 8500, category: 'cementos' },
    { id: 2, name: 'Cemento Holcim 50kg', price: 8200, category: 'cementos' },
    { id: 3, name: 'Cal Hidratada Cacique 25kg', price: 4200, category: 'cementos' },
    { id: 4, name: 'Hierro Acindar 8mm (Barra 12m)', price: 12000, category: 'hierros' },
    { id: 5, name: 'Hierro Acindar 10mm (Barra 12m)', price: 18500, category: 'hierros' },
    { id: 6, name: 'Malla Sima 15x15 4.2mm (2x3m)', price: 22000, category: 'hierros' },
    { id: 7, name: 'Ladrillo Hueco 18x18x33 (Pallet)', price: 45000, category: 'ladrillos' },
    { id: 8, name: 'Ladrillo Cerámico Portante 18x19x33 (Pallet)', price: 58000, category: 'ladrillos' },
    { id: 9, name: 'Arena de Río (Metro Cúbico)', price: 25000, category: 'aridos' },
    { id: 10, name: 'Piedra Partida (Metro Cúbico)', price: 28000, category: 'aridos' },
    { id: 11, name: 'Cascote Molido (Metro Cúbico)', price: 15000, category: 'aridos' },
    { id: 12, name: 'Chapa Acanalada Cincalum C25 (Metro)', price: 18500, category: 'techos' },
    { id: 13, name: 'Chapa Trapezoidal Color C25 (Metro)', price: 22000, category: 'techos' },
    { id: 14, name: 'Membrana Asfáltica 4mm (Rollo 10m)', price: 35000, category: 'techos' },
    { id: 15, name: 'Pintura Látex Interior 20L', price: 45000, category: 'herramientas' },
    { id: 16, name: 'Pala Ancha Forjada', price: 12500, category: 'herramientas' },
    { id: 17, name: 'Adhesivo Klaukol Impermeable 30kg', price: 9500, category: 'cementos' }
];

// Shopping Cart State
let shoppingCart = [];
const dynamicTotalElement = document.getElementById('dynamic-total');
const searchInput = document.getElementById('material-search');
const searchResults = document.getElementById('search-results');
const cartList = document.getElementById('cart-list');
const emptyState = document.getElementById('cart-empty-state');

function formatCurrency(amount) {
    return new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(amount);
}

function updateCartUI() {
    // Calculate total
    let total = shoppingCart.reduce((acc, item) => acc + (item.price * item.qty), 0);
    if(dynamicTotalElement) {
        dynamicTotalElement.textContent = formatCurrency(total);
    }

    // Render list
    if (shoppingCart.length === 0) {
        cartList.innerHTML = '';
        cartList.appendChild(emptyState);
        emptyState.style.display = 'block';
        return;
    }

    emptyState.style.display = 'none';
    cartList.innerHTML = '';
    
    shoppingCart.forEach((item, index) => {
        const li = document.createElement('li');
        li.className = 'list-group-item d-flex justify-content-between align-items-center py-3 cart-item';
        li.innerHTML = `
            <div class="d-flex flex-column" style="width: 50%;">
                <span class="fw-bold text-dark" style="font-size: 0.95rem;">${item.name}</span>
                <span class="text-muted small">${formatCurrency(item.price)} c/u</span>
            </div>
            <div class="d-flex align-items-center">
                <div class="bg-light rounded-pill p-1 d-flex align-items-center me-3 border">
                    <button class="btn btn-sm btn-light cart-qty-btn rounded-circle" onclick="changeQty(${index}, -1)">-</button>
                    <input type="number" class="cart-qty-input" value="${item.qty}" min="1" onchange="setQty(${index}, this.value)">
                    <button class="btn btn-sm btn-light cart-qty-btn rounded-circle" onclick="changeQty(${index}, 1)">+</button>
                </div>
                <div class="fw-bold text-accent" style="width: 90px; text-align: right;">
                    ${formatCurrency(item.price * item.qty)}
                </div>
                <i class="bi bi-trash3 ms-3 cart-item-remove fs-5" onclick="removeItem(${index})"></i>
            </div>
        `;
        cartList.appendChild(li);
    });
}

window.changeQty = (index, delta) => {
    shoppingCart[index].qty += delta;
    if (shoppingCart[index].qty < 1) shoppingCart[index].qty = 1;
    updateCartUI();
};

window.setQty = (index, val) => {
    let newQty = parseInt(val);
    if (isNaN(newQty) || newQty < 1) newQty = 1;
    shoppingCart[index].qty = newQty;
    updateCartUI();
};

window.removeItem = (index) => {
    shoppingCart.splice(index, 1);
    updateCartUI();
};

function addToCart(product) {
    const existing = shoppingCart.find(p => p.id === product.id);
    if (existing) {
        existing.qty += 1;
    } else {
        shoppingCart.push({ ...product, qty: 1 });
    }
    updateCartUI();
    
    // Clear search
    if(searchInput) searchInput.value = '';
    if(searchResults) searchResults.style.display = 'none';
}

// Search Logic
if (searchInput && searchResults) {
    searchInput.addEventListener('input', (e) => {
        const term = e.target.value.toLowerCase().trim();
        if (term.length === 0) {
            searchResults.style.display = 'none';
            return;
        }

        const matches = mockProducts.filter(p => p.name.toLowerCase().includes(term));
        
        searchResults.innerHTML = '';
        if (matches.length > 0) {
            matches.forEach(p => {
                const div = document.createElement('div');
                div.className = 'search-result-item d-flex justify-content-between align-items-center';
                div.innerHTML = `
                    <span class="item-name">${p.name}</span>
                    <span class="item-price">${formatCurrency(p.price)}</span>
                `;
                div.onclick = () => addToCart(p);
                searchResults.appendChild(div);
            });
            searchResults.style.display = 'block';
        } else {
            searchResults.innerHTML = '<div class="p-3 text-muted text-center small">No se encontraron resultados para esta búsqueda.</div>';
            searchResults.style.display = 'block';
        }
    });

    // Hide dropdown when clicking outside
    document.addEventListener('click', (e) => {
        if (!searchInput.contains(e.target) && !searchResults.contains(e.target)) {
            searchResults.style.display = 'none';
        }
    });
}

// Quick Add Categories Logic
document.querySelectorAll('.material-quick-card').forEach(card => {
    card.addEventListener('click', () => {
        const cat = card.getAttribute('data-category');
        // Add the first product of this category as a quick-add
        const product = mockProducts.find(p => p.category === cat);
        if (product) {
            addToCart(product);
        }
    });
});

// Cotizador Form Submission and WhatsApp Message Generation
const expressQuoteForm = document.getElementById('express-quote-form');
if(expressQuoteForm) {
    expressQuoteForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const name = document.getElementById('quote-name').value.trim();
        const location = document.getElementById('quote-location').value.trim();
        const additionalMessage = document.getElementById('quote-message').value.trim();
        
        if (shoppingCart.length === 0) {
            alert('Por favor, busca y agrega al menos un material a tu lista para cotizar.');
            return;
        }
        
        let message = `Hola Corralón Florida Norte! 🏗️
`;
        message += `Quisiera solicitar un presupuesto formal basado en mi cotización online.

`;
        message += `👤 *Datos del Cliente:*
`;
        message += `- *Nombre:* ${name}
`;
        message += `- *Zona de Obra:* ${location}

`;
        message += `🛒 *Mi Lista de Materiales:*
`;
        
        let currentTotal = 0;
        shoppingCart.forEach(mat => {
            const subtotal = mat.qty * mat.price;
            currentTotal += subtotal;
            message += `- ${mat.qty}x ${mat.name} (${formatCurrency(subtotal)})
`;
        });
        
        message += `
💰 *Total Estimado: ${formatCurrency(currentTotal)}*
`;
        
        if (additionalMessage) {
            message += `
📝 *Detalles Adicionales:*
${additionalMessage}
`;
        }
        
        message += `
¡Espero su confirmación, muchas gracias!`;
        
        const encodedMessage = encodeURIComponent(message);
        const whatsappPhone = '5491166712813';
        const whatsappUrl = `https://wa.me/${whatsappPhone}?text=${encodedMessage}`;
        window.open(whatsappUrl, '_blank');
    });
}

// Toggle Buttons Logic (Minorista / Mayorista)
const btnMinorista = document.getElementById('btn-minorista');
const btnMayorista = document.getElementById('btn-mayorista');
if (btnMinorista && btnMayorista) {
    btnMinorista.addEventListener('click', () => {
        btnMinorista.classList.add('active');
        btnMayorista.classList.remove('active');
    });
    btnMayorista.addEventListener('click', () => {
        btnMayorista.classList.add('active');
        btnMinorista.classList.remove('active');
    });
}

// Page Animations and ScrollTriggers
window.addEventListener('load', () => {
    // Hero Animations
    const heroTl = gsap.timeline();
    heroTl.fromTo('#hero-parallax-bg', 
        { scale: 1.1, autoAlpha: 0 },
        { scale: 1, autoAlpha: 1, duration: 1.5, ease: 'power2.out' }
    );
    heroTl.fromTo('#hero .gsap-reveal', 
        { y: 40, autoAlpha: 0 },
        { y: 0, autoAlpha: 1, duration: 0.8, stagger: 0.15, ease: 'power3.out' }, "-=1.0"
    );
    heroTl.fromTo('#hero .trust-badge-card', 
        { y: 30, autoAlpha: 0 },
        { y: 0, autoAlpha: 1, duration: 0.6, stagger: 0.1, ease: 'power2.out' }, "-=0.4"
    );

    // Refresh ScrollTrigger after layout shifts
    ScrollTrigger.refresh();

    // Parallax Effect on Hero Background
    gsap.to('#hero-parallax-bg', {
        yPercent: 15,
        ease: 'none',
        scrollTrigger: {
            trigger: '#hero',
            start: 'top top',
            end: 'bottom top',
            scrub: true
        }
    });

    // Scroll-Triggered Section Revelations
    gsap.fromTo('#nosotros .about-img-wrapper', 
        { x: -50, autoAlpha: 0 },
        { x: 0, autoAlpha: 1, duration: 1, ease: 'power2.out', scrollTrigger: { trigger: '#nosotros', start: 'top 75%' } }
    );

    gsap.fromTo('#nosotros .gsap-reveal', 
        { x: 50, autoAlpha: 0 },
        { x: 0, autoAlpha: 1, duration: 1, stagger: 0.2, ease: 'power2.out', scrollTrigger: { trigger: '#nosotros', start: 'top 75%' } }
    );

    // Horizontal Services Reveal
    gsap.fromTo('#servicios .service-grid-item', 
        { y: 40, autoAlpha: 0 },
        { y: 0, autoAlpha: 1, duration: 0.8, stagger: 0.1, ease: 'power2.out', scrollTrigger: { trigger: '#servicios', start: 'top 85%' } }
    );

    // Asesoramiento Section Reveal
    gsap.fromTo('#asesoramiento .toggle-group-olive, #asesoramiento p', 
        { y: 30, autoAlpha: 0 },
        { y: 0, autoAlpha: 1, duration: 0.8, stagger: 0.2, ease: 'power2.out', scrollTrigger: { trigger: '#asesoramiento', start: 'top 85%' } }
    );
    gsap.fromTo('#asesoramientoCarousel', 
        { scale: 0.95, autoAlpha: 0 },
        { scale: 1, autoAlpha: 1, duration: 1, ease: 'power2.out', scrollTrigger: { trigger: '#asesoramientoCarousel', start: 'top 85%' } }
    );

    // Cotizador Reveal
    gsap.fromTo('#cotizador .cotizador-container', 
        { y: 50, autoAlpha: 0 },
        { y: 0, autoAlpha: 1, duration: 1, ease: 'power2.out', scrollTrigger: { trigger: '#cotizador', start: 'top 80%' } }
    );

    // Footer Reveal
    gsap.fromTo('#contacto .footer-dark .row > div', 
        { y: 30, autoAlpha: 0 },
        { y: 0, autoAlpha: 1, duration: 0.8, stagger: 0.15, ease: 'power2.out', scrollTrigger: { trigger: '#contacto', start: 'top 90%' } }
    );
});


