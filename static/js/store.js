
"use strict";

// ============================================
// VELTRIX — Storefront and shopping cart
// ============================================

const productGrid = document.getElementById("product-grid");
const productCount = document.getElementById("product-count");
const searchInput = document.getElementById("search-input");
const categoryButtons = document.querySelectorAll(".category-button");

const cartCount = document.getElementById("cart-count");
const cartButton = document.getElementById("cart-button");
const cartOverlay = document.getElementById("cart-overlay");
const cartDrawer = document.getElementById("cart-drawer");
const closeCartButton = document.getElementById("close-cart");
const cartItemsContainer = document.getElementById("cart-items");
const drawerCartCount = document.getElementById("drawer-cart-count");
const cartSubtotal = document.getElementById("cart-subtotal");
const checkoutButton = document.getElementById("checkout-button");

let products = [];
let selectedCategory = "All";
let cart = [];

// ---------- Helpers ----------

function escapeHTML(value) {
    return String(value ?? "").replace(/[&<>"']/g, (character) => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    })[character]);
}

function formatPrice(price) {
    return `₹${Number(price || 0).toLocaleString("en-IN")}`;
}

function getCartTotal() {
    return cart.reduce(
        (sum, product) => sum + Number(product.price || 0),
        0
    );
}

// ---------- Product display ----------

function renderProducts() {
    if (!productGrid) return;

    const searchTerm = searchInput
        ? searchInput.value.trim().toLowerCase()
        : "";

    const filteredProducts = products.filter((product) => {
        const matchesCategory =
            selectedCategory === "All" ||
            product.category === selectedCategory;

        const searchableText = [
            product.name,
            product.description,
            product.category
        ].join(" ").toLowerCase();

        return matchesCategory && searchableText.includes(searchTerm);
    });

    if (productCount) {
        productCount.textContent = `${filteredProducts.length} products`;
    }

    if (filteredProducts.length === 0) {
        productGrid.innerHTML =
            '<p class="muted">No products found. Try another search.</p>';
        return;
    }

    productGrid.innerHTML = filteredProducts.map((product) => `
        <article class="product-card">
            <img
                class="product-image"
                src="${escapeHTML(product.image)}"
                alt="${escapeHTML(product.name)}"
                loading="lazy"
            >

            <div class="product-details">
                <p class="product-category">
                    ${escapeHTML(product.category)}
                </p>

                <h3>${escapeHTML(product.name)}</h3>

                <p class="product-description">
                    ${escapeHTML(product.description)}
                </p>

                <div class="product-bottom">
                    <strong>${formatPrice(product.price)}</strong>

                    <button
                        class="add-to-cart"
                        data-product-id="${Number(product.id)}"
                        type="button"
                    >
                        ADD TO CART
                    </button>
                </div>
            </div>
        </article>
    `).join("");
}

// ---------- Cart drawer ----------


function openCart() {
    if (cartOverlay) cartOverlay.classList.add("open");
    if (cartDrawer) cartDrawer.classList.add("open");

    document.body.classList.add("cart-open");
    renderCart();
}

function closeCart() {
    if (cartOverlay) cartOverlay.classList.remove("open");
    if (cartDrawer) cartDrawer.classList.remove("open");

    document.body.classList.remove("cart-open");
}


function renderCart() {
    // Update the header count.
    if (cartCount) {
        cartCount.textContent = String(cart.length);
    }

    // Update the count in the drawer.
    if (drawerCartCount) {
        drawerCartCount.textContent = `(${cart.length})`;
    }

    // Update subtotal.
    if (cartSubtotal) {
        cartSubtotal.textContent = formatPrice(getCartTotal());
    }

    // Draw the cart contents.
    if (cartItemsContainer) {
        if (cart.length === 0) {
            cartItemsContainer.innerHTML = `
                <p class="cart-empty">
                    Your bag is waiting for something special.
                </p>
            `;
        } else {
            cartItemsContainer.innerHTML = cart.map((product, index) => `
                <article class="cart-item">
                    <img
                        class="cart-item-image"
                        src="${escapeHTML(product.image)}"
                        alt="${escapeHTML(product.name)}"
                    >

                    <div class="cart-item-details">
                        <h3>${escapeHTML(product.name)}</h3>
                        <p>${formatPrice(product.price)}</p>

                        <button
                            class="remove-cart-item"
                            type="button"
                            data-cart-index="${index}"
                        >
                            REMOVE
                        </button>
                    </div>
                </article>
            `).join("");
        }
    }

    if (checkoutButton) {
        checkoutButton.disabled = cart.length === 0;
    }
}

// ---------- Add and remove products ----------

if (productGrid) {
    productGrid.addEventListener("click", (event) => {
        const button = event.target.closest(".add-to-cart");
        if (!button) return;

        const productId = Number(button.dataset.productId);
        const product = products.find(
            (item) => Number(item.id) === productId
        );

        if (!product) return;

        // Each click adds one item to the cart.
        cart.push(product);
        renderCart();

        const originalText = button.textContent;
        button.textContent = "ADDED ✓";
        button.disabled = true;

        setTimeout(() => {
            if (button.isConnected) {
                button.textContent = originalText;
                button.disabled = false;
            }
        }, 900);
    });
}

if (cartItemsContainer) {
    cartItemsContainer.addEventListener("click", (event) => {
        const button = event.target.closest(".remove-cart-item");
        if (!button) return;

        const index = Number(button.dataset.cartIndex);

        if (Number.isInteger(index) && index >= 0 && index < cart.length) {
            cart.splice(index, 1);
            renderCart();
        }
    });
}

// ---------- Search and category filters ----------

if (searchInput) {
    searchInput.addEventListener("input", renderProducts);
}

categoryButtons.forEach((button) => {
    button.addEventListener("click", () => {
        selectedCategory = button.dataset.category || "All";

        categoryButtons.forEach((item) => {
            item.classList.toggle("active", item === button);
        });

        renderProducts();
    });
});

// ---------- Cart controls ----------

if (cartButton) {
    cartButton.addEventListener("click", openCart);
}

if (closeCartButton) {
    closeCartButton.addEventListener("click", closeCart);
}

if (cartOverlay) {
    cartOverlay.addEventListener("click", closeCart);
}

document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
        closeCart();

        const checkoutWindow = document.querySelector(".checkout-overlay");
        if (checkoutWindow) checkoutWindow.remove();

        document.body.classList.remove("checkout-open");
    }
});

// ---------- Checkout ----------

function openCheckout() {
    if (cart.length === 0) {
        alert("Your cart is empty. Add a product before checkout.");
        return;
    }

    // Take a snapshot of the current order.
    const orderItems = [...cart];
    const total = orderItems.reduce(
        (sum, product) => sum + Number(product.price || 0),
        0
    );

    closeCart();

    // Prevent duplicate checkout overlays.
    const existingCheckout = document.querySelector(".checkout-overlay");
    if (existingCheckout) existingCheckout.remove();

    const checkoutWindow = document.createElement("div");
    checkoutWindow.className = "checkout-overlay";

    checkoutWindow.innerHTML = `
        <div class="checkout-panel">
            <button
                class="checkout-close"
                type="button"
                aria-label="Close checkout"
            >&times;</button>

            <p class="checkout-eyebrow">VELTRIX / CHECKOUT</p>
            <h2>Complete your order</h2>
            <p class="checkout-subtitle">
                Your details and order summary
            </p>

            <div class="checkout-order-summary">
                <h3>Order summary (${orderItems.length} items)</h3>
                ${orderItems.map((product) => `
                    <div class="checkout-summary-item">
                        <span>${escapeHTML(product.name)}</span>
                        <strong>${formatPrice(product.price)}</strong>
                    </div>
                `).join("")}
            </div>

            <form id="checkout-form">
                <label for="customer-name">Full name</label>
                <input
                    id="customer-name"
                    name="name"
                    required
                    autocomplete="name"
                    placeholder="Enter your full name"
                >

                <label for="customer-email">Email address</label>
                <input
                    id="customer-email"
                    name="email"
                    type="email"
                    required
                    autocomplete="email"
                    placeholder="you@example.com"
                >

                <label for="customer-phone">Phone number</label>
                <input
                    id="customer-phone"
                    name="phone"
                    type="tel"
                    pattern="[0-9]{10}"
                    maxlength="10"
                    required
                    autocomplete="tel"
                    placeholder="10-digit mobile number"
                >

                <label for="customer-address">Delivery address</label>
                <textarea
                    id="customer-address"
                    name="address"
                    rows="3"
                    required
                    autocomplete="street-address"
                    placeholder="House number, street, city, PIN code"
                ></textarea>

                <div class="checkout-total">
                    <span>Total amount</span>
                    <strong>${formatPrice(total)}</strong>
                </div>

                <button class="checkout-place-order" type="submit">
                    PLACE DEMO ORDER
                </button>

                <p class="checkout-disclaimer">
                    Demo only. No payment will be collected.
                </p>
            </form>
        </div>
    `;

    document.body.appendChild(checkoutWindow);
    document.body.classList.add("checkout-open");

    const closeCheckout = () => {
        checkoutWindow.remove();
        document.body.classList.remove("checkout-open");
    };

    checkoutWindow.querySelector(".checkout-close")
        .addEventListener("click", closeCheckout);

    checkoutWindow.addEventListener("click", (event) => {
        if (event.target === checkoutWindow) closeCheckout();
    });

    checkoutWindow.querySelector("#checkout-form")
        .addEventListener("submit", (event) => {
            event.preventDefault();

            if (!event.target.reportValidity()) return;

            const formData = new FormData(event.target);
            const customerName = String(formData.get("name") || "").trim();

            // Prepare confirmation before resetting the cart.
            checkoutWindow.querySelector(".checkout-panel").innerHTML = `
                <p class="checkout-eyebrow">
                    VELTRIX / ORDER CONFIRMED
                </p>

                <h2>Thank you, ${escapeHTML(customerName)}.</h2>

                <p>Your demo order has been completed successfully.</p>

                <div class="checkout-total">
                    <span>Items</span>
                    <strong>${orderItems.length}</strong>
                </div>

                <div class="checkout-total">
                    <span>Order total</span>
                    <strong>${formatPrice(total)}</strong>
                </div>

                <p class="checkout-disclaimer">
                    This is a demonstration. No payment was taken
                    and no order was saved to a database.
                </p>

                <button
                    class="checkout-place-order"
                    type="button"
                    id="continue-shopping"
                >
                    CONTINUE SHOPPING
                </button>
            `;

            // Clear the real cart state after a successful demo order.
            cart.length = 0;
            renderCart();
            closeCart();

            // Clear any previously stored cart, if present.
            try {
                localStorage.removeItem("veltrix-cart");
            } catch (error) {
                console.warn("Could not clear saved cart data.", error);
            }

            checkoutWindow.querySelector("#continue-shopping")
                .addEventListener("click", () => {
                    closeCheckout();
                    renderCart();
                    window.scrollTo({ top: 0, behavior: "smooth" });
                });
        });
}

if (checkoutButton) {
    checkoutButton.addEventListener("click", openCheckout);
}

// ---------- Load products from Flask ----------

async function loadProducts() {
    if (!productGrid) return;

    try {
        const response = await fetch("/api/products");

        if (!response.ok) {
            throw new Error(`Product request failed: ${response.status}`);
        }

        const data = await response.json();

        if (!Array.isArray(data)) {
            throw new Error("The products API did not return a list.");
        }

        products = data;
        renderProducts();
        renderCart();
    } catch (error) {
        console.error("Veltrix product loading error:", error);

        if (productCount) {
            productCount.textContent = "Unable to load products";
        }

        productGrid.innerHTML = `
            <p class="muted">
                Products could not be loaded. Please refresh the page.
            </p>
        `;
    }
}

renderCart();
loadProducts();
