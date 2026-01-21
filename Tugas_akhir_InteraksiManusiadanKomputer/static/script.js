// ===========================================
// LEAFORA - MAIN APPLICATION SCRIPT (ROBUST VERSION)
// ===========================================

/**
 * 1. GLOBAL DATA & CONFIGURATION
 * Default products are hardcoded here to ensure they can always be restored.
 */
const defaultProducts = [
    {
        id: 1,
        name: "Peace Lily (Spathiphyllum)",
        price: 35.00,
        stock: 50,
        image: "../static/images/Peace Lily (Spathiphyllum).jpg",
        description: "An elegant indoor favorite with dark green foliage and striking white spathes. Beyond its beauty, it is celebrated for its exceptional air-purifying qualities and graceful, calming presence.",
        care: "Thrives in medium to low light; keep soil consistently moist but not waterlogged; it will 'tell' you it's thirsty by drooping its leaves.",
        cat: "Indoor"
    },
    {
        id: 2,
        name: "Aglaonema Red Siam",
        price: 45.00,
        stock: 40,
        image: "../static/images/Aglaonema Red Siam.jpg",
        description: "Adding a pop of vibrant color, this Aglaonema features striking red-edged leaves against deep green centers. It is a hardy, low-maintenance plant perfect for brightening up dim corners of a home or office.",
        care: "Tolerates low light but prefers medium indirect light for best color; water when the top half of the soil is dry; avoid overwatering.",
        cat: "Indoor"
    },
    {
        id: 3,
        name: "Phalaenopsis White Orchid",
        price: 60.00,
        stock: 25,
        image: "../static/images/Phalaenopsis White Orchid.jpg",
        description: "Exuding sophistication, this orchid displays long-lasting, snowy white blooms on elegant arching stems. It is the pinnacle of floral grace, suitable for minimalist and luxury interior settings.",
        care: "Requires bright, filtered light; water sparingly (about once a week) avoiding the crown; use orchid-specific bark or moss medium.",
        cat: "Indoor"
    },
    {
        id: 4,
        name: "Royal Evergreen Bonsai",
        price: 400.00,
        stock: 20,
        image: "../static/images/Royal Evergreen Bonsai.jpg",
        description: "This handcrafted bonsai features a well-established root system and naturally curved branches that display a harmonious growth pattern. The compact size allows it to thrive as a stunning centerpiece in small outdoor spaces.",
        care: "Place in a bright outdoor spot; water daily or when the soil surface feels dry; prune occasionally to maintain its artistic shape.",
        cat: "Bonsai"
    },
    {
        id: 5,
        name: "Japanese Black Pine",
        price: 250.00,
        stock: 10,
        image: "../static/images/Japanese Black Pine.jpeg",
        description: "A masterpiece of strength and longevity, this bonsai showcases rugged bark and stiff, deep-green needles. Its dramatic, wired silhouette reflects the resilience of ancient pines clinging to coastal cliffs.",
        care: "Requires full sun and high light intensity; allow the soil to dry slightly between waterings; needs a distinct winter dormancy period outdoors.",
        cat: "Bonsai"
    },
    {
        id: 6,
        name: "Juniper Bonsai",
        price: 72.00,
        stock: 30,
        image: "../static/images/Juniper Bonsai.jpg",
        description: "Known for its elegant, flowing foliage and flexible trunk, this Juniper captures the essence of a windswept mountain tree. Its fine-textured needles provide a lush, year-round green aesthetic.",
        care: "Must be kept outdoors; prefers full sun to partial shade; mist the foliage frequently and keep the soil moist but well-drained.",
        cat: "Bonsai"
    },
    {
        id: 7,
        name: "Ficus Golden Coin",
        price: 55.00,
        stock: 15,
        image: "../static/images/Ficus Golden Coin.jpg",
        description: "This banyan-style bonsai is prized for its thick, exposed aerial roots and glossy, coin-shaped leaves. It offers a miniature tropical forest vibe that adds a touch of ancient wisdom to any garden collection.",
        care: "Enjoys bright light and warm temperatures; water thoroughly when the soil is dry to the touch; very resilient to heavy pruning.",
        cat: "Bonsai"
    },
    {
        id: 8,
        name: "Cactus Barrel",
        price: 57.00,
        stock: 12,
        image: "../static/images/Cactus Barrel.jpg",
        description: "A perfectly symmetrical, globe-shaped cactus adorned with sharp golden spines. This slow-growing desert gem is a sculptural marvel that requires minimal attention to maintain its striking form.",
        care: "Needs 6+ hours of direct sunlight daily; water very sparingly (once every 3–4 weeks in summer, less in winter); use well-draining cactus soil.",
        cat: "Cactus"
    },
    {
        id: 9,
        name: "Echeveria Blue Prince",
        price: 30.00,
        stock: 50,
        image: "../static/images/Echeveria Blue Prince.jpg",
        description: "This succulent forms a tight, regal rosette of dusky blue-green leaves that can take on deep purple hues under the sun. Its neat, geometric pattern makes it an ideal choice for decorative tabletop planters.",
        care: "Provide plenty of sunlight to prevent stretching; use the 'soak and dry' method (water only when soil is bone dry); avoid getting water trapped in the leaves.",
        cat: "Cactus"
    },
    {
        id: 10,
        name: "Monstera Deliciosa",
        price: 87.00,
        stock: 30,
        image: "../static/images/Monstera Deliciosa.jpg",
        description: "A bold statement piece featuring large, heart-shaped leaves with iconic natural perforations (fenestrations). This fast-growing climber brings a lush, tropical jungle feel to any modern interior.",
        care: "Place in bright, indirect light; water once the top 2 inches of soil are dry; wipe leaves regularly to remove dust.",
        cat: "Indoor"
    }
];

// Global Cart State
let cart = [];
try {
    const storedCart = localStorage.getItem('cart');
    if (storedCart) cart = JSON.parse(storedCart);
} catch (e) {
    console.error("Cart Load Error", e);
}

/**
 * 2. GLOBAL HELPER FUNCTIONS
 */

// Retrieve Products
window.getProducts = function () {
    try {
        const stored = localStorage.getItem('products');
        if (stored) return JSON.parse(stored);
    } catch (e) { }
    return defaultProducts;
};

window.saveProducts = function (prods) {
    localStorage.setItem('products', JSON.stringify(prods));
};

// Add to Cart
window.addToCart = function (idOrName, price, image, qty = 1) {
    const products = window.getProducts();
    let product;

    if (typeof idOrName === 'number') {
        product = products.find(p => p.id === idOrName);
    } else {
        // 1. Try exact match
        product = products.find(p => p.name === idOrName);
        // 2. Try partial/loose match (for "Ficus" -> "Ficus Golden Coin")
        if (!product && typeof idOrName === 'string') {
            product = products.find(p => p.name.toLowerCase().includes(idOrName.toLowerCase()));
        }
    }

    if (!product) return;

    if (product.stock <= 0) {
        alert("Sorry, this item is Out of Stock!");
        return;
    }

    const existing = cart.find(item => item.id === product.id);
    if (existing) {
        existing.qty += qty;
    } else {
        cart.push({
            id: product.id,
            title: product.name,
            price: product.price,
            image: product.image,
            qty: qty
        });
    }

    // SAVE STATE
    localStorage.setItem('cart', JSON.stringify(cart));

    updateCartUI();
    openCart();
};

window.openCart = function () {
    const overlay = document.getElementById('cartOverlay');
    const sidebar = document.getElementById('cartSidebar');
    if (overlay) overlay.classList.add('active');
    if (sidebar) sidebar.classList.add('active');
};

window.closeCart = function () {
    const overlay = document.getElementById('cartOverlay');
    const sidebar = document.getElementById('cartSidebar');
    if (overlay) overlay.classList.remove('active');
    if (sidebar) sidebar.classList.remove('active');
};

window.removeCartItem = function (index) {
    cart.splice(index, 1);
    localStorage.setItem('cart', JSON.stringify(cart)); // SAVE STATE
    updateCartUI();
};


// Qty Selectors
window.increaseQty = function () {
    const input = document.getElementById('qtyInput');
    if (input) input.value = parseInt(input.value) + 1;
};

window.decreaseQty = function () {
    const input = document.getElementById('qtyInput');
    if (input && parseInt(input.value) > 1) input.value = parseInt(input.value) - 1;
};

// Back Button Logic
window.goBack = function () {
    // Try to go back, otherwise go store
    if (document.referrer.includes(window.location.host)) {
        history.back();
    } else {
        window.location.href = 'store.html';
    }
};


function updateCartUI() {
    const container = document.getElementById('cartItemsContainer');
    const totalDisplay = document.getElementById('cartTotalDisplay');

    // 1. Update Cart Badge (Global)
    const cartIconFn = document.querySelector('.header-right img[alt="Cart"]');
    if (cartIconFn) {
        let badge = cartIconFn.parentElement.querySelector('.cart-badge');
        const count = cart.reduce((acc, item) => acc + item.qty, 0);

        if (count > 0) {
            if (!badge) {
                badge = document.createElement('span');
                badge.className = 'cart-badge';
                badge.style.cssText = `
                    position: absolute;
                    top: -5px;
                    right: -5px;
                    background: #ffc107;
                    color: #333;
                    font-size: 0.7rem;
                    font-weight: bold;
                    width: 18px;
                    height: 18px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: 50%;
                `;
                // Ensure parent references relative for absolute positioning
                cartIconFn.parentElement.style.position = 'relative';
                cartIconFn.parentElement.appendChild(badge);
            }
            badge.innerText = count;
            badge.style.display = 'flex';
        } else {
            if (badge) badge.style.display = 'none';
        }
    }

    // 2. Update Sidebar Cart (Safely)
    if (!container) return;

    container.innerHTML = '';
    let total = 0;

    if (cart.length === 0) {
        container.innerHTML = '<p class="empty-msg">Your cart is empty.</p>';
    } else {
        cart.forEach((item, index) => {
            total += item.price * item.qty;
            const itemDiv = document.createElement('div');
            itemDiv.className = 'cart-item';
            itemDiv.innerHTML = `
                <img src="${item.image}" class="c-item-img">
                <div class="c-item-info">
                    <div class="c-item-title">${item.title}</div>
                    <div class="c-item-price">$${item.price.toFixed(2)} x ${item.qty}</div>
                </div>
                <button class="c-item-remove" onclick="removeCartItem(${index})">Remove</button>
            `;
            container.appendChild(itemDiv);
        });
    }

    if (totalDisplay) totalDisplay.innerText = `$${total.toFixed(2)} USD`;
}


/**
 * 3. MAIN APP INITIALIZATION
 * Runs when the DOM is fully loaded.
 */
document.addEventListener('DOMContentLoaded', async () => {
    // A. INITIALIZE DATA (SYNC WITH DATABASE)
    try {
        const response = await fetch('/api/products');
        if (response.ok) {
            const dbProducts = await response.json();
            // Update localStorage to match Database
            localStorage.setItem('products', JSON.stringify(dbProducts));
            console.log("Data synced with SQLite Database.");
        }
    } catch (e) {
        console.error("API Error - Using Offline/Cached Data", e);
        // Fallback initialization if API fails
        if (!localStorage.getItem('products')) {
            localStorage.setItem('products', JSON.stringify(defaultProducts));
        }
    }

    // B. AUTHENTICATION (Login/Register)
    const authForm = document.querySelector('.auth-form');
    if (authForm) {
        authForm.addEventListener('submit', (e) => {
            e.preventDefault();
            // Simple credential check
            const inputs = Array.from(authForm.querySelectorAll('input'));
            const emailInput = inputs.find(i => i.type === 'email' || i.name === 'email' || i.placeholder.toLowerCase().includes('email'));
            const passInput = inputs.find(i => i.type === 'password');

            const u = emailInput ? emailInput.value : '';
            const p = passInput ? passInput.value : '';

            if (u === 'admin@gmail.com' && p === '123') {
                localStorage.setItem('isAdmin', 'true');
                localStorage.setItem('isLoggedIn', 'true');
                window.location.href = 'admin.html';
            } else {
                localStorage.setItem('isLoggedIn', 'true');
                window.location.href = 'index.html';
            }
        });
    }

    // Order Now Button (Header)
    const btnOrderNow = document.querySelector('.btn-order');
    if (btnOrderNow) {
        btnOrderNow.addEventListener('click', (e) => {
            e.preventDefault();
            const logged = localStorage.getItem('isLoggedIn') === 'true';
            window.location.href = logged ? 'store.html' : 'login.html';
        });
    }

    // C. GENERAL NAVIGATION HANDLERS (Header Icons)
    const userIconImg = document.querySelector('.header-right img[alt="User"]');
    if (userIconImg) {
        userIconImg.parentElement.addEventListener('click', () => {
            const logged = localStorage.getItem('isLoggedIn') === 'true';
            window.location.href = logged ? 'profile.html' : 'login.html';
        });
    }

    // Cart Icon
    const cartIconImg = document.querySelector('.header-right img[alt="Cart"]');
    if (cartIconImg) {
        cartIconImg.parentElement.addEventListener('click', window.openCart);
    }
    // Cart Close Listeners
    const closeCartBtn = document.getElementById('closeCart');
    if (closeCartBtn) closeCartBtn.addEventListener('click', window.closeCart);
    const cartOverlay = document.getElementById('cartOverlay');
    if (cartOverlay) cartOverlay.addEventListener('click', window.closeCart);


    // D. DETAIL PRODUCT PAGE LOGIC
    // Checks if we are on detail page by looking for specific ID
    if (document.getElementById('dName')) {
        const params = new URLSearchParams(window.location.search);
        let id = params.get('id');
        if (!id) id = 4; // Default fallback

        const products = window.getProducts();
        const product = products.find(p => p.id == id);

        if (product) {
            // Populate DOM Elements safely
            const safeSetText = (id, text) => {
                const el = document.getElementById(id);
                if (el) el.innerText = text;
            };

            safeSetText('dName', product.name);
            safeSetText('dDesc', product.description);
            safeSetText('dPrice', `$${product.price ? product.price.toFixed(2) : '0.00'}`);
            safeSetText('dCare', product.care);
            safeSetText('dNameRef', product.name);

            // Images
            const dImg = document.getElementById('dImg');
            if (dImg) dImg.src = product.image;
            const dImgRef = document.getElementById('dImgRef');
            if (dImgRef) dImgRef.src = product.image;

            // NEW: Hero Add to Cart Button
            const heroBtn = document.getElementById('heroAddCartBtn');
            if (heroBtn) {
                heroBtn.onclick = () => window.addToCart(product.id, product.price, product.image, 1);
            }

            // Buttons
            const btnBuyNow = document.querySelector('.ref-btn-buy');
            if (btnBuyNow) {
                btnBuyNow.onclick = () => window.addToCart(product.id, product.price, product.image, 1);
            }
            const btnAddToCart = document.querySelector('.ref-btn-cart');
            if (btnAddToCart) {
                btnAddToCart.onclick = () => {
                    const qInput = document.getElementById('qtyInput');
                    const q = qInput ? parseInt(qInput.value) : 1;
                    window.addToCart(product.id, product.price, product.image, q);
                };
            }
        }
    }


    // E. HOMEPAGE HERO SLIDER (Dynamic from Popular)
    const heroSliderContainer = document.querySelector('.hero-slider-container');
    if (heroSliderContainer) {
        const products = window.getProducts();
        // Popular IDs based on Store "Popular" tab (10, 4, 6, 8)
        const popularIds = [10, 4, 6, 8];
        const popularProducts = products.filter(p => popularIds.includes(p.id));

        // Use all defaults if popular not found (fallback)
        const slidesToUse = popularProducts.length > 0 ? popularProducts : products.slice(0, 4);

        if (slidesToUse.length > 0) {
            heroSliderContainer.innerHTML = ''; // Clear hardcoded
            slidesToUse.forEach((p, index) => {
                const img = document.createElement('img');
                img.src = p.image;
                img.className = `hero-slide ${index === 0 ? 'active' : ''}`;
                img.alt = p.name;
                heroSliderContainer.appendChild(img);
            });

            // Rotation Logic
            let currentSlide = 0;
            const slides = heroSliderContainer.querySelectorAll('.hero-slide');

            setInterval(() => {
                slides[currentSlide].classList.remove('active');
                currentSlide = (currentSlide + 1) % slides.length;
                slides[currentSlide].classList.add('active');
            }, 3000); // 3 Seconds
        }
    }


    // F. STORE PAGE LOGIC (Tabs & Slider) - ADDED
    // (Also runs on Index or any page with these sliders)
    const tabs = document.querySelectorAll('.tab-item');
    const track = document.getElementById('sliderTrack');

    if (tabs.length > 0 && track) {

        function switchTab(index) {
            // Update Tabs
            tabs.forEach(t => t.classList.remove('active'));
            const targetTab = document.querySelector(`.tab-item[data-tab="${index}"]`);
            if (targetTab) targetTab.classList.add('active');

            // Move Slider
            // Assuming each slide takes 100% width.
            // NOTE: In the provided store.html CSS (from context), it usually uses transform
            track.style.transform = `translateX(-${index * 100}%)`;
        }

        // Click Handlers
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const idx = parseInt(tab.getAttribute('data-tab'));
                switchTab(idx);
            });
        });

        // Check URL Params for default tab
        const params = new URLSearchParams(window.location.search);
        const tabParam = params.get('tab');
        if (tabParam) {
            switchTab(parseInt(tabParam));
        }
    }

    // G. GLOBAL: Product Card "Add to Cart" Button Logic
    // This handles the small cart buttons on the cards in Store and Home
    const cardCartBtns = document.querySelectorAll('.btn-card-cart');
    cardCartBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();

            // Find parent anchor to get ID
            const parentLink = btn.closest('.product-card') || btn.closest('.discovery-card'); // fallback
            if (parentLink) {
                const href = parentLink.getAttribute('href');
                // href looks like "detail_product.html?id=10"
                if (href && href.includes('id=')) {
                    const idStr = href.split('id=')[1];
                    const id = parseInt(idStr);
                    const products = window.getProducts();
                    const product = products.find(p => p.id === id);
                    if (product) {
                        window.addToCart(product.id, product.price, product.image, 1);
                    }
                }
            }
        });
    });


    // F. ADMIN DASHBOARD LOGIC (ROBUST NAVIGATION)
    if (window.location.pathname.includes('admin.html')) {

        // --- 1. Navigation Logic (Explicit) ---
        // We select the links based on the attributes we confirmed in admin.html
        const btnDashboard = document.querySelector('.admin-link[data-view="dashboard"]');
        const btnProducts = document.querySelector('.admin-link[data-view="products"]');
        const btnOrders = document.querySelector('.admin-link[data-view="orders"]');

        const viewDashboard = document.getElementById('view-dashboard');
        const viewProducts = document.getElementById('view-products');
        const viewOrders = document.getElementById('view-orders');

        const allLinks = [btnDashboard, btnProducts, btnOrders];
        const allViews = [viewDashboard, viewProducts, viewOrders];

        // Helper to switch view
        function switchAdminView(targetBtn, targetView) {
            if (!targetBtn || !targetView) return;

            // Reset all
            allLinks.forEach(l => { if (l) l.classList.remove('active'); });
            allViews.forEach(v => { if (v) v.classList.add('hidden'); });

            // Activate target
            targetBtn.classList.add('active');
            targetView.classList.remove('hidden');

            // Force Re-render if switching to products/orders to ensure fresh data
            if (targetView === viewProducts) renderAdminProducts();
            if (targetView === viewOrders) renderAdminOrders(); // if implemented
        }

        // Attach Listeners explicitly
        if (btnDashboard) {
            btnDashboard.addEventListener('click', (e) => {
                e.preventDefault();
                switchAdminView(btnDashboard, viewDashboard);
            });
        }
        if (btnProducts) {
            btnProducts.addEventListener('click', (e) => {
                e.preventDefault();
                switchAdminView(btnProducts, viewProducts);
            });
        }
        if (btnOrders) {
            btnOrders.addEventListener('click', (e) => {
                e.preventDefault();
                switchAdminView(btnOrders, viewOrders);
            });
        }


        // --- 2. Product Management Logic ---
        function renderAdminProducts() {
            const table = document.getElementById('productsTable');
            if (!table) return;

            table.innerHTML = '';
            const products = window.getProducts();

            products.forEach(p => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td class="td-product">
                        <img src="${p.image}" onerror="this.src='../static/images/Logo.png'">
                        <span>${p.name}</span>
                    </td>
                    <td class="td-stock">${p.stock}</td>
                    <td>$${p.price.toFixed(2)}</td>
                    <td class="td-actions">
                         <button class="btn-action edit" onclick="editProduct(${p.id})">Edit</button>
                         <button class="btn-action delete" onclick="deleteProduct(${p.id})">Delete</button>
                    </td>
                `;
                table.appendChild(tr);
            });

            // Update Stats
            const statTotal = document.getElementById('statTotalProducts');
            if (statTotal) statTotal.innerText = products.length;
        }

        // Initialize table on load
        renderAdminProducts();
        renderDashboardStats();
        // Initial render of orders if on orders view (or just pre-load)
        // renderAdminOrders(); 

        // --- 3. Global Admin Actions (Delete/Edit/Add) ---
        window.deleteProduct = function (id) {
            if (!confirm("Are you sure you want to delete this product?")) return;

            let products = window.getProducts();
            products = products.filter(p => p.id !== id);
            window.saveProducts(products);
            renderAdminProducts();
            renderDashboardStats();
        };

        // --- 4. ORDER MANAGEMENT LOGIC ---
        function renderAdminOrders(filterType = 'all') {
            const tableBody = document.getElementById('manageOrdersTable');
            if (!tableBody) return;
            tableBody.innerHTML = '';

            let allOrders = JSON.parse(localStorage.getItem('all_orders') || '[]');

            // User Request: "Finished" orders disappear from management
            // We filter them out unless specifically handling an archive view (not requested yet)
            let visibleOrders = allOrders.filter(o => o.status !== 'Finished');

            // Apply Tab Filters
            if (filterType !== 'all') {
                visibleOrders = visibleOrders.filter(o => o.status.toLowerCase() === filterType.toLowerCase());
            }

            visibleOrders.forEach(order => {
                const tr = document.createElement('tr');
                // Status Select
                const statusOptions = ['Pending', 'Processed', 'Sent', 'Finished'];
                let optionsHtml = '';
                statusOptions.forEach(opt => {
                    const selected = order.status === opt ? 'selected' : '';
                    optionsHtml += `<option value="${opt}" ${selected}>${opt}</option>`;
                });

                tr.innerHTML = `
                    <td>${order.id}</td>
                    <td>${order.date}</td>
                    <td>${order.customer}</td>
                    <td>
                        <select onchange="updateOrderStatus('${order.id}', this.value)" class="status-select ${order.status.toLowerCase()}">
                            ${optionsHtml}
                        </select>
                    </td>
                    <td>${order.note || '-'}</td>
                    <td>$${order.total.toFixed(2)}</td>
                `;
                tableBody.appendChild(tr);
            });
        }

        // Expose Update Function
        window.updateOrderStatus = function (orderId, newStatus) {
            let allOrders = JSON.parse(localStorage.getItem('all_orders') || '[]');
            const orderIndex = allOrders.findIndex(o => o.id === orderId);

            if (orderIndex > -1) {
                allOrders[orderIndex].status = newStatus;

                // Also update User's "My Orders" logic? 
                // It's tricky to sync back to "my_orders" without user ID. 
                // For this MVP, we assume "all_orders" is the master for Admin. 
                // Ideally, we'd sync back, but let's stick to Admin view requirements first.

                localStorage.setItem('all_orders', JSON.stringify(allOrders));

                // If status is Finished, it will disappear on re-render
                renderAdminOrders();
                renderDashboardStats();
            }
        };

        // Filter Buttons Logic
        const filterBtns = document.querySelectorAll('.filter-btn');
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                renderAdminOrders(btn.getAttribute('data-filter'));
            });
        });

        // --- DASHBOARD STATS LOGIC ---
        function renderDashboardStats() {
            let allOrders = JSON.parse(localStorage.getItem('all_orders') || '[]');
            const products = window.getProducts();

            const pending = allOrders.filter(o => o.status === 'Pending').length;
            const finished = allOrders.filter(o => o.status === 'Finished').length;

            const elTotalOrders = document.getElementById('statTotalOrders');
            const elTotalProds = document.getElementById('statTotalProducts');
            const elPending = document.getElementById('statPendingOrders');
            const elCompleted = document.getElementById('statCompletedOrders');

            if (elTotalOrders) elTotalOrders.innerText = allOrders.length;
            if (elTotalProds) elTotalProds.innerText = products.length;
            if (elPending) elPending.innerText = pending;
            if (elCompleted) elCompleted.innerText = finished;

            // Render Recent Orders (Dashboard View) - Top 5
            const dashTable = document.getElementById('dashboardOrdersTable');
            if (dashTable) {
                dashTable.innerHTML = '';
                const recent = allOrders.slice(0, 5);
                recent.forEach(order => {
                    const tr = document.createElement('tr');
                    tr.innerHTML = `
                        <td>${order.id}</td>
                        <td>${order.date}</td>
                        <td>${order.customer}</td>
                        <td><span class="badge ${order.status.toLowerCase()}">${order.status}</span></td>
                        <td>$${order.total.toFixed(2)}</td>
                    `;
                    dashTable.appendChild(tr);
                });
            }
        }


        window.editProduct = function (id) {
            let products = window.getProducts();
            let product = products.find(p => p.id === id);
            if (!product) return;

            // Simple prompt edit for robust quick fix
            let newPrice = prompt(`Enter new price for ${product.name}:`, product.price);
            let newStock = prompt(`Enter new stock for ${product.name}:`, product.stock);

            if (newPrice !== null && newStock !== null) {
                product.price = parseFloat(newPrice);
                product.stock = parseInt(newStock);
                window.saveProducts(products);
                renderAdminProducts();
            }
        };

        // Add Product Modal
        const btnAdd = document.querySelector('.btn-add-product');
        const modal = document.getElementById('addProductModal');
        const closeModal = document.querySelector('.close-modal');
        const formAdd = document.getElementById('addProductForm');

        if (btnAdd && modal) {
            btnAdd.addEventListener('click', () => modal.classList.remove('hidden'));
        }
        if (closeModal && modal) {
            closeModal.addEventListener('click', () => modal.classList.add('hidden'));
        }

        if (formAdd) {
            formAdd.addEventListener('submit', (e) => {
                e.preventDefault();

                // Get values safely
                const name = document.getElementById('newProdName').value;
                const price = parseFloat(document.getElementById('newProdPrice').value);
                const stock = parseInt(document.getElementById('newProdStock').value);
                // Image handling - defaulting to logo if empty for simplicity
                const imgInput = document.getElementById('newProdImage');
                let imgUrl = '../static/images/Logo.png';

                // Process
                const finish = () => {
                    let products = window.getProducts();
                    const newId = products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1;

                    products.push({
                        id: newId,
                        name: name,
                        price: price,
                        stock: stock,
                        image: imgUrl,
                        description: "New Product",
                        care: "General Care",
                        cat: "Indoor"
                    });

                    window.saveProducts(products);
                    renderAdminProducts();
                    modal.classList.add('hidden');
                    formAdd.reset();
                };

                // Check file
                if (imgInput && imgInput.files && imgInput.files[0]) {
                    const reader = new FileReader();
                    reader.onload = (ev) => {
                        imgUrl = ev.target.result;
                        finish();
                    };
                    reader.readAsDataURL(imgInput.files[0]);
                } else {
                    finish();
                }
            });
        }

        // Reset Defaults Button
        const btnReset = document.querySelector('.btn-reset-defaults');
        if (btnReset) {
            btnReset.addEventListener('click', () => {
                if (confirm("This will reset all product data. Continue?")) {
                    localStorage.setItem('products', JSON.stringify(defaultProducts));
                    location.reload();
                }
            });
        }
    }

    // H. CHECKOUT PAGE LOGIC (Wizard & Progress)
    if (document.querySelector('.page-checkout')) {
        let currentStep = 1;
        const totalSteps = 3;

        const slideWrapper = document.getElementById('slidesWrapper');
        const progressLine = document.querySelector('.progress-line');
        const steps = document.querySelectorAll('.progress-step');

        // Validation Helper
        function validateStep(step) {
            if (step === 1) { // Shipping
                const name = document.getElementById('shipName').value.trim();
                const phone = document.getElementById('shipPhone').value.trim();
                const street = document.getElementById('shipStreet').value.trim();
                const city = document.getElementById('shipCity').value.trim();
                const zip = document.getElementById('shipZip').value.trim();

                if (!name || !phone || !street || !city || !zip) {
                    alert("Please fill in all shipping details.");
                    return false;
                }

                // Postal Code Validation (Must be exactly 5 digits)
                if (!/^\d{5}$/.test(zip)) {
                    alert("Postal Code must be exactly 5 digits (Indonesia standard).");
                    return false;
                }

                return true;
            }
            if (step === 2) { // Payment
                const activeTab = document.querySelector('.p-tab.active');
                const method = activeTab ? activeTab.getAttribute('data-method') : 'card';

                if (method === 'card') {
                    const num = document.getElementById('payCardNum').value.trim();
                    const exp = document.getElementById('payCardExp').value.trim();
                    const cvv = document.getElementById('payCardCvv').value.trim();
                    const name = document.getElementById('payCardName').value.trim();

                    if (!num || !exp || !cvv || !name) {
                        alert("Please fill in all credit card details.");
                        return false;
                    }

                    // Card Number (Max 16 digits as per request)
                    // Removing spaces for check
                    const cleanNum = num.replace(/\s/g, '');
                    if (cleanNum.length > 16) {
                        alert("Card Number must be maximum 16 digits.");
                        return false;
                    }
                    if (!/^\d+$/.test(cleanNum)) {
                        alert("Card Number must contain numbers only.");
                        return false;
                    }

                    // Expiration Date (MM/YY format, max 5 chars)
                    if (!/^\d{2}\/\d{2}$/.test(exp)) {
                        alert("Expiration must be in MM/YY format (e.g. 12/25).");
                        return false;
                    }

                } else if (method === 'bank') {
                    const fileInput = document.getElementById('payBankFile');
                    if (!fileInput || fileInput.files.length === 0) {
                        alert("Please upload transfer evidence for Bank Transfer.");
                        return false;
                    }
                } else if (method === 'wallet') {
                    const fileInput = document.getElementById('payWalletFile');
                    if (!fileInput || fileInput.files.length === 0) {
                        alert("Please upload transfer evidence for Digital Wallet.");
                        return false;
                    }
                }
                return true;
            }
            return true;
        }

        // Function to update UI
        // Function to update UI
        window.updateCheckoutStep = function (step) {
            // Validation Logic: If trying to go forward (step > currentStep), validate current
            if (step > currentStep) {
                if (!validateStep(currentStep)) return;
            }

            currentStep = step;

            // 1. Move Slider (33.33% per slide because wrapper is 300% width)
            if (slideWrapper) {
                slideWrapper.style.transform = `translateX(-${(step - 1) * 33.3333}%)`;
            }

            // 2. Update Progress Bar Line (Fill Animation)
            if (progressLine) {
                progressLine.classList.remove('filled-50', 'filled-100');
                if (step === 2) progressLine.classList.add('filled-50');
                if (step === 3) progressLine.classList.add('filled-100');
            }

            // 3. Update Progress Steps
            for (let i = 1; i <= totalSteps; i++) {
                const el = document.getElementById(`progStep${i}`);
                if (el) {
                    if (i <= step) {
                        el.classList.add('active');
                    } else {
                        el.classList.remove('active');
                    }
                }
            }

            // 4. Render Summary if on Step 3
            if (step === 3) {
                if (window.renderCheckoutSummary) window.renderCheckoutSummary();
            }
        };

        // Expose globally
        window.goToSlide = window.updateCheckoutStep;

        // Render Summary Function
        // EXPOSE renderCheckoutSummary GLOBALLY
        window.renderCheckoutSummary = function () {
            const container = document.getElementById('summaryProductContainer');
            if (!container) return;
            container.innerHTML = '';

            // Carousel Elements
            const sliderContainer = document.querySelector('.summary-slider-container');
            const prevBtn = document.getElementById('btnSumPrev');
            const nextBtn = document.getElementById('btnSumNext');

            let total = 0;
            if (cart.length === 0) {
                container.innerHTML = '<p>Your cart is empty.</p>';
            } else {
                // Determine Mode: Slider (>3 items) or List
                const isSlider = cart.length > 3;

                if (isSlider) {
                    sliderContainer.classList.add('active-slider');
                    container.classList.remove('no-slider');
                    if (prevBtn) prevBtn.style.display = 'flex';
                    if (nextBtn) nextBtn.style.display = 'flex';
                } else {
                    sliderContainer.classList.remove('active-slider');
                    container.classList.add('no-slider');
                    if (prevBtn) prevBtn.style.display = 'none';
                    if (nextBtn) nextBtn.style.display = 'none';
                }

                cart.forEach(item => {
                    total += item.price * item.qty;
                    const row = document.createElement('div');
                    row.className = 'summary-product';
                    // Adjust layout based on carousel mode (handled by CSS .no-slider)

                    row.innerHTML = `
                         <img src="${item.image}" alt="${item.title}">
                        <div class="sum-prod-info">
                            <h4>${item.title}</h4>
                            <span>$${item.price.toFixed(2)} x ${item.qty}</span>
                        </div>
                        <div class="sum-prod-price" style="${isSlider ? 'margin-top:5px;' : 'margin-left:auto;'} font-weight:600; color:#fff;">
                            $${(item.price * item.qty).toFixed(2)}
                        </div>
                    `;
                    container.appendChild(row);
                });

                // Carousel Logic State
                if (isSlider) {
                    let currentSlide = 0;
                    const visibleItems = 3;
                    const totalItems = cart.length;
                    const maxSlide = Math.ceil(totalItems - visibleItems); // Max index shift

                    const updateSlide = () => {
                        // Move by percentage of item width (33.33%)
                        const percentage = currentSlide * (100 / visibleItems);
                        container.style.transform = `translateX(-${percentage}%)`;
                    };

                    prevBtn.onclick = (e) => {
                        e.preventDefault(); // Check if necessary
                        if (currentSlide > 0) {
                            currentSlide--;
                            updateSlide();
                        }
                    };

                    nextBtn.onclick = (e) => {
                        e.preventDefault();
                        // Allows sliding until strictly empty space? Or just one by one?
                        // Let's cap it so we don't scroll past last item
                        if (currentSlide < maxSlide) {
                            currentSlide++;
                            updateSlide();
                        }
                    };
                } else {
                    container.style.transform = 'none'; // Reset
                }
            }

            const subEl = document.getElementById('checkoutSubtotal');
            const totEl = document.getElementById('checkoutTotal');
            if (subEl) subEl.innerText = `$${total.toFixed(2)}`;
            if (totEl) totEl.innerText = `$${(total + 40).toFixed(2)}`;

            // Address Review
            const nameEl = document.getElementById('shipName');
            const streetEl = document.getElementById('shipStreet');
            const cityEl = document.getElementById('shipCity');

            if (nameEl && streetEl && cityEl) {
                const name = nameEl.value;
                const street = streetEl.value;
                const city = cityEl.value;
                const reviewAddr = document.getElementById('reviewAddress');
                if (reviewAddr) reviewAddr.innerText = `${name} (${street}, ${city})`;
            }

            // Place Order Logic (Attach only once?)
            // Ideally remove old listener or clone node, but here simple replacement is fine if function called once per view
            const btnPlace = document.getElementById('placeOrderBtn');
            if (btnPlace) {
                // Remove existing listener to verify no dupes?
                // For this structure, we can just replace the element relative to itself to clean listeners
                const newBtn = btnPlace.cloneNode(true);
                btnPlace.parentNode.replaceChild(newBtn, btnPlace);

                newBtn.addEventListener('click', async () => {
                    if (cart.length === 0) {
                        alert("Your cart is empty!");
                        return;
                    }

                    // 1. Gather Order Data
                    const nameVal = document.getElementById('shipName').value || "Guest";
                    const noteVal = document.getElementById('checkoutNote').value || "";
                    const totalVal = cart.reduce((acc, item) => acc + (item.price * item.qty), 0) + 40;

                    // Check Payment Method & Evidence
                    const activeTab = document.querySelector('.p-tab.active');
                    const paymentMethod = activeTab ? activeTab.getAttribute('data-method') : 'card';

                    const newOrder = {
                        id: 'ORD-' + Date.now().toString().slice(-6),
                        customer: nameVal,
                        date: new Date().toLocaleDateString(),
                        status: 'Pending',
                        total: totalVal,
                        items: [...cart],
                        note: noteVal,
                        paymentMethod: paymentMethod
                    };

                    // 2. SEND TO BACKEND (STOCK REDUCTION)
                    try {
                        const response = await fetch('/api/checkout', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ items: cart })
                        });

                        const resData = await response.json();

                        if (!response.ok) {
                            alert("Order Failed: " + (resData.error || "Unknown Error"));
                            return;
                        }

                        // 3. Save to LocalStorage 'all_orders'
                        let allOrders = [];
                        try {
                            const stored = localStorage.getItem('all_orders');
                            if (stored) allOrders = JSON.parse(stored);
                        } catch (e) { }

                        allOrders.unshift(newOrder); // Add to top
                        localStorage.setItem('all_orders', JSON.stringify(allOrders));

                        // 4. Save to User History 'my_orders'
                        let myOrders = [];
                        try {
                            const stored = localStorage.getItem('my_orders');
                            if (stored) myOrders = JSON.parse(stored);
                        } catch (e) { }

                        myOrders.unshift(newOrder);
                        localStorage.setItem('my_orders', JSON.stringify(myOrders));

                        alert("Order placed successfully! Redirecting to your profile...");

                        // 5. Cleanup
                        cart = [];
                        if (window.updateCartUI) updateCartUI();
                        localStorage.removeItem('cart');
                        window.location.href = 'profile.html';

                    } catch (error) {
                        console.error('Checkout Error:', error);
                        alert("Network error occurred during checkout.");
                    }
                });
            }


            // Payment Tabs Logic (Moved here, but also ensure it's run initally)
            window.initPaymentTabs();
        }; // End renderCheckoutSummary

        // GLOBAL: Payment Tabs Logic Helper
        window.initPaymentTabs = function () {
            const pTabs = document.querySelectorAll('.p-tab');
            pTabs.forEach(tab => {
                // Remove old listener if any by cloning (optional but safer)
                // Here we just re-assign onclick which overrides
                tab.onclick = (e) => {
                    e.preventDefault();
                    pTabs.forEach(t => t.classList.remove('active'));
                    document.querySelectorAll('.payment-content').forEach(c => c.classList.add('hidden'));

                    tab.classList.add('active');
                    const method = tab.getAttribute('data-method');
                    let targetId = 'payMethodCard';
                    if (method === 'bank') targetId = 'payMethodBank';
                    if (method === 'wallet') targetId = 'payMethodWallet';

                    const target = document.getElementById(targetId);
                    if (target) target.classList.remove('hidden');
                };
            });
        };
        // Call it immediately on load too, in case user navigates back/forth
        window.initPaymentTabs();


        // Initial Call
        // window.renderCheckoutSummary(); // Called by checkout step logic usually

    }

    // I. PROFILE PAGE LOGIC (History & Logout)
    if (document.querySelector('.page-profile')) {
        // 1. Logout
        const btnLogout = document.getElementById('logoutBtn');
        if (btnLogout) {
            btnLogout.addEventListener('click', () => {
                if (confirm("Are you sure you want to logout?")) {
                    localStorage.removeItem('isLoggedIn');
                    localStorage.removeItem('isAdmin');
                    window.location.href = 'index.html';
                }
            });
        }

        // 2. Render Order History
        const ordersList = document.getElementById('ordersListContainer');
        if (ordersList) {
            let myOrders = [];
            try {
                const stored = localStorage.getItem('my_orders');
                if (stored) myOrders = JSON.parse(stored);
            } catch (e) { }

            // Render History Function
            const renderHistory = (filter = 'all') => {
                ordersList.innerHTML = '';

                // Filter
                let filtered = myOrders;
                if (filter !== 'all') {
                    filtered = myOrders.filter(o => o.status.toLowerCase() === filter.toLowerCase());
                }

                if (filtered.length === 0) {
                    ordersList.innerHTML = `<p style="padding:1rem; opacity:0.7;">No ${filter !== 'all' ? filter : ''} orders found.</p>`;
                } else {
                    filtered.forEach(order => {
                        const firstItem = order.items[0];
                        const img = firstItem ? firstItem.image : '../static/images/Logo.png';
                        const listHtml = order.items.map(i => `${i.qty}x ${i.title}`).join(', ');

                        const card = document.createElement('div');
                        const statusClass = order.status ? order.status.toLowerCase() : 'pending';
                        card.className = `order-card p-status-${statusClass}`;
                        card.innerHTML = `
                            <div class="o-card-img">
                                <img src="${img}" alt="Product">
                            </div>
                            <div class="o-card-info">
                                <div class="o-header">
                                    <h3>${order.id}</h3>
                                    <span class="status-badge ${statusClass}">${order.status}</span>
                                </div>
                                <div class="o-details">
                                    <p>${order.date}</p>
                                    <p>${order.items.length} Items (${listHtml})</p>
                                    <p class="o-total">Total : <strong>$${order.total.toFixed(2)}</strong></p>
                                </div>
                            </div>
                            <button class="btn-view-details" data-id="${order.id}">View Details</button>
                        `;
                        ordersList.appendChild(card);
                    });

                    // Attach Listeners to Generated Buttons
                    document.querySelectorAll('.btn-view-details').forEach(btn => {
                        btn.addEventListener('click', () => {
                            const oid = btn.getAttribute('data-id');
                            const order = myOrders.find(o => o.id === oid);
                            if (order) showOrderDetail(order);
                        });
                    });
                }
            };

            // Detail View Logic
            const historyView = document.getElementById('orderHistoryView');
            const detailView = document.getElementById('orderDetailView');

            function showOrderDetail(order) {
                if (!historyView || !detailView) return;
                historyView.classList.add('hidden');
                detailView.classList.remove('hidden');

                // Populate Info
                document.getElementById('detailOrderId').innerText = order.id;
                document.getElementById('detailOrderIdBreadcrumb').innerText = order.id;
                document.getElementById('detailDate').innerText = order.date;
                document.getElementById('detailName').innerText = order.customer;
                document.getElementById('detailTotal').innerText = '$' + order.total.toFixed(2);

                // Populate Items
                const list = document.getElementById('detailItemsList');
                if (list) {
                    list.innerHTML = '';
                    order.items.forEach(item => {
                        const row = document.createElement('div');
                        row.className = 'summary-product'; // Reusing style
                        row.style.borderBottom = '1px solid rgba(255,255,255,0.1)';
                        row.style.padding = '10px 0';
                        row.innerHTML = `
                             <img src="${item.image}" style="width:60px; height:60px; border-radius:4px; object-fit:cover;">
                             <div class="sum-prod-info" style="margin-left:15px;">
                                 <h4 style="margin:0; font-size:0.95rem;">${item.title}</h4>
                                 <span style="opacity:0.7; font-size:0.85rem;">$${item.price} x ${item.qty}</span>
                             </div>
                             <div style="margin-left:auto; font-weight:bold;">$${(item.price * item.qty).toFixed(2)}</div>
                         `;
                        list.appendChild(row);
                    });
                }

                // Dynamic Status Timeline
                const timelineContainer = document.querySelector('.status-timeline');
                if (timelineContainer) {
                    timelineContainer.innerHTML = ''; // Clear existing static HTML
                    const statuses = ['Pending', 'Processed', 'Sent', 'Finished'];
                    const currentStatus = order.status || 'Pending';
                    const currentIndex = statuses.indexOf(currentStatus); // Case sensitive match, assuming capitalized in DB

                    statuses.forEach((status, index) => {
                        const isPast = index <= currentIndex;
                        const isActive = index === currentIndex;
                        const isFuture = index > currentIndex;

                        const item = document.createElement('div');
                        item.className = `timeline-item ${isPast ? 'active' : ''}`;

                        // Determine date display (Mock logic as we only have order date)
                        let dateDisplay = '';
                        if (index === 0) dateDisplay = order.date;
                        if (isActive && index > 0) dateDisplay = 'Today';

                        item.innerHTML = `
                            <div class="t-dot" style="background:${isPast ? 'var(--color-accent)' : 'rgba(255,255,255,0.2)'}; border-color:${isPast ? 'var(--color-accent)' : 'rgba(255,255,255,0.2)'}"></div>
                            <div class="t-content">
                                <h4 style="color:${isPast ? '#fff' : 'rgba(255,255,255,0.5)'}">${status}</h4>
                                ${dateDisplay ? `<p>${dateDisplay}</p>` : ''}
                            </div>
                         `;
                        timelineContainer.appendChild(item);
                    });
                }
            }

            // Back Buttons
            const backBtns = [document.getElementById('backToOrdersBtn'), document.getElementById('backToOrdersBreadcrumb')];
            backBtns.forEach(btn => {
                if (btn) {
                    btn.addEventListener('click', () => {
                        detailView.classList.add('hidden');
                        historyView.classList.remove('hidden');
                    });
                }
            });

            // Invoice Download (Mock)
            document.querySelectorAll('.btn-download-invoice, .btn-download-invoice-secondary').forEach(btn => {
                btn.addEventListener('click', () => {
                    const originalContent = document.body.innerHTML;
                    const invoiceContent = document.getElementById('orderDetailView').innerHTML;

                    // Simple Print Strategy
                    // Temporarily replace body with invoice content to print, then restore (or just alert)
                    // Printing detailed view is usually cleaner than a new window in single page apps
                    alert("Generating Invoice PDF... (Simulation)\nIn a real app, this would download a PDF.");

                    // Optional: window.print() if user wants to see print dialog
                    // document.body.innerHTML = invoiceContent;
                    // window.print();
                    // document.body.innerHTML = originalContent;
                    // window.location.reload(); // Safer to reload after heavy DOM manipulation
                });
            });

            // Initial Render
            renderHistory('pending'); // Default tab is usually All or Pending? 
            // In layout, Pending is active class.

            // Tab Listeners
            const hTabs = document.querySelectorAll('.h-tab');
            hTabs.forEach(tab => {
                tab.addEventListener('click', () => {
                    hTabs.forEach(t => t.classList.remove('active'));
                    tab.classList.add('active');
                    const filter = tab.getAttribute('data-filter');
                    renderHistory(filter);
                });
            });
        }

        // 3. Edit Profile Logic
        const viewMode = document.getElementById('profileViewMode');
        const editMode = document.getElementById('profileEditMode');
        const btnEdit = document.getElementById('editProfileBtn');
        const btnCancel = document.getElementById('cancelProfileBtn');
        const btnSave = document.getElementById('saveProfileBtn');

        if (btnEdit && viewMode && editMode) {
            btnEdit.addEventListener('click', () => {
                viewMode.classList.add('hidden');
                editMode.classList.remove('hidden');

                // Pre-fill inputs
                document.getElementById('profileFirstName').value = "User";
                document.getElementById('profileLastName').value = "Name";
                document.getElementById('profileEmail').value = "user@example.com";
            });
        }

        if (btnCancel && viewMode && editMode) {
            btnCancel.addEventListener('click', () => {
                editMode.classList.add('hidden');
                viewMode.classList.remove('hidden');
            });
        }

        if (btnSave && viewMode && editMode) {
            btnSave.addEventListener('click', () => {
                // Update View
                const fName = document.getElementById('profileFirstName').value;
                const lName = document.getElementById('profileLastName').value;
                const email = document.getElementById('profileEmail').value;
                const addr = document.getElementById('profileAddress').value; // if exists

                document.getElementById('viewName').innerText = `${fName} ${lName}`;
                document.getElementById('viewEmail').innerText = email;
                if (addr) document.getElementById('viewAddress').innerText = addr;

                alert("Profile Updated Successfully!");
                editMode.classList.add('hidden');
                viewMode.classList.remove('hidden');
            });
        }
    }

    // J. ADMIN ORDERS LOGIC
    if (document.querySelector('.admin-content')) {
        const ordersTableBody = document.querySelector('#view-orders table tbody');
        // Note: we assume there's a table in #view-orders. If not, we might need to create it or selector might fail.
        // Let's rely on the ID if possible or just standard table logic if I saw admin.html. 
        // I haven't seen admin.html "view-orders" content. 
        // I'll assume standard <table> structure or I will inject it if I can't find it.
        // Safest: Check localstorage for 'all_orders' and if existing, try to render.

        // Actually, the user said "mungkin di admin pun tidak muncul".
        // I should probably ensure the 'view-orders' logic exists.
        // Let's look for a table with ID or just generic inside that view.
        if (ordersTableBody) {
            // ... logic to render ...
            // renderAdminOrders(ordersTableBody); // This line will be removed as renderAdminOrders is now global and targets by ID
        } else {
            // Setup listener to render when view becomes active?
        }

        // --- 5. Dashboard Recent Orders Logic ---
        function renderDashboardRecent() {
            const tbody = document.getElementById('dashboardOrdersTable');
            if (!tbody) return;
            tbody.innerHTML = '';

            let allOrders = [];
            try {
                const stored = localStorage.getItem('all_orders');
                if (stored) allOrders = JSON.parse(stored);
            } catch (e) { }

            // Take top 5
            const recent = allOrders.slice(0, 5);

            if (recent.length === 0) {
                tbody.innerHTML = '<tr><td colspan="5" style="text-align:center; opacity:0.7;">No recent orders.</td></tr>';
            } else {
                recent.forEach(order => {
                    const tr = document.createElement('tr');
                    const statusClass = order.status ? order.status.toLowerCase() : 'pending';
                    tr.innerHTML = `
                         <td style="color:#fff;">${order.id}</td>
                         <td>${order.date}</td>
                         <td>${order.customer}</td>
                         <td><span class="status-badge ${statusClass}">${order.status}</span></td>
                         <td style="font-weight:bold;">$${order.total.toFixed(2)}</td>
                     `;
                    tbody.appendChild(tr);
                });
            }
        }
        // Initial call
        renderDashboardRecent();

        // View All Button Logic
        const btnViewAll = document.getElementById('viewAllOrdersBtn');
        if (btnViewAll) {
            btnViewAll.addEventListener('click', (e) => {
                e.preventDefault();
                // Find and click the 'Manage Orders' nav link to handle switching
                const navOrders = document.querySelector('.admin-link[data-view="orders"]');
                if (navOrders) navOrders.click();
            });
        }    // Existing switchAdminView calls renderAdminOrders() if existing.
        // I need to define window.renderAdminOrders.
    }

    // --- 3. Manage Order Logic ---
    function renderAdminOrders(filter = 'all') {
        const tbody = document.getElementById('manageOrdersTable');
        if (!tbody) return;
        tbody.innerHTML = '';

        let allOrders = [];
        try {
            const stored = localStorage.getItem('all_orders');
            if (stored) allOrders = JSON.parse(stored);
        } catch (e) { }

        // Filter Logic
        let filtered = allOrders;
        if (filter !== 'all') {
            filtered = allOrders.filter(o => o.status.toLowerCase() === filter.toLowerCase());
        }

        if (filtered.length === 0) {
            tbody.innerHTML = `<tr><td colspan="6" style="text-align:center; opacity:0.7;">No ${filter !== 'all' ? filter : ''} orders found.</td></tr>`;
        } else {
            filtered.forEach(order => {
                const tr = document.createElement('tr');

                // Status Dropdown Logic
                const statuses = ['Pending', 'Processed', 'Sent', 'Finished'];
                let options = statuses.map(s =>
                    `<option value="${s}" ${order.status === s ? 'selected' : ''}>${s}</option>`
                ).join('');

                const statusSelect = `
                    <select onchange="window.updateOrderStatus('${order.id}', this.value)" class="status-select ${order.status ? order.status.toLowerCase() : ''}" style="border:none; padding:5px; border-radius:4px; font-weight:bold;">
                        ${options}
                    </select>
                `;

                tr.innerHTML = `
                    <td style="color:#fff;">${order.id}</td>
                    <td>${order.date}</td>
                    <td>${order.customer}</td>
                    <td>${statusSelect}</td>
                    <td>${order.note ? order.note : '-'}</td>
                    <td style="font-weight:bold;">$${order.total.toFixed(2)}</td>
                `;
                tbody.appendChild(tr);
            });
        }

        // Update Stats (Always based on ALL orders)
        const statTotalOrders = document.getElementById('statTotalOrders');
        const statPending = document.getElementById('statPendingOrders');
        const statCompleted = document.getElementById('statCompletedOrders');

        if (statTotalOrders) statTotalOrders.innerText = allOrders.length;
        if (statPending) statPending.innerText = allOrders.filter(o => o.status === 'Pending').length;
        if (statCompleted) statCompleted.innerText = allOrders.filter(o => o.status === 'Finished' || o.status === 'Sent').length;
    }

    // --- 4. Global Order Status Update ---
    window.updateOrderStatus = function (orderId, newStatus) {
        // Update All Orders
        let allOrders = [];
        try {
            const stored = localStorage.getItem('all_orders');
            if (stored) allOrders = JSON.parse(stored);
        } catch (e) { }

        const order = allOrders.find(o => o.id === orderId);
        if (order) {
            order.status = newStatus;
            localStorage.setItem('all_orders', JSON.stringify(allOrders));
        }

        // Update My Orders (User Side)
        let myOrders = [];
        try {
            const stored = localStorage.getItem('my_orders');
            if (stored) myOrders = JSON.parse(stored);
        } catch (e) { }

        const myOrder = myOrders.find(o => o.id === orderId);
        if (myOrder) {
            myOrder.status = newStatus;
            localStorage.setItem('my_orders', JSON.stringify(myOrders));
        }

        // Re-render to update colors/stats (Keep current filter)
        // Ideally we find the currently active filter button
        const activeBtn = document.querySelector('.filter-btn.active');
        const currentFilter = activeBtn ? activeBtn.getAttribute('data-filter') : 'all';

        renderAdminOrders(currentFilter);

        // Also refresh dashboard recent if visible is handled by reload or switch
        if (typeof renderDashboardRecent === 'function') renderDashboardRecent();
    };


    // --- 5. Admin Initialization (Listeners) ---
    // Only run if elements exist
    const adminFilterBtns = document.querySelectorAll('.filter-btn');
    if (adminFilterBtns.length > 0) {
        // Initial Render
        renderAdminOrders();

        adminFilterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                adminFilterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                renderAdminOrders(btn.getAttribute('data-filter'));
            });
        });
    }

    // Force refresh buttons for explicit render (e.g. Nav Clicks handled above)
    // No extra listener needed if Nav Click calls renderAdminOrders, 
    // BUT nav click in Section F calls `renderAdminOrders` if it exists. 
    // Since we just defined it, Section F (lines 461+) will use it correctly 
    // IF function hoisting works. 
    // Function declarations are hoisted, but this is inside an arrow function (DOMContentLoaded?).
    // No, renderAdminOrders is defined inside DOMContentLoaded scope. 
    // Section F (461) attempts to call it. 
    // As long as Section F runs AFTER definition? No, Section F runs immediately.
    // BUT Section F uses it inside a click handler OR `switchAdminView`.
    // `switchAdminView` calls `renderAdminOrders()` inside it.
    // Since `switchAdminView` is defined before, but calls it lazily (on click), 
    // and `renderAdminOrders` is defined here, it should be fine due to closure scope.

    // Global Click Listener for Redirects (Cart Checkout)
    document.addEventListener('click', (e) => {
        if (e.target && (e.target.classList.contains('btn-checkout') || e.target.closest('.btn-checkout'))) {
            window.location.href = 'checkout.html';
        }
    });

});
