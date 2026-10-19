
"use strict";

// 1. Select HTML elements
const $ = (id) => document.getElementById(id);

const menuToggle = $("menuToggle");
const mainNav = $("mainNav");
const openCartButton = $("openCart");
const closeCartButton = $("closeCart");
const cartDrawer = $("cartDrawer");
const cartOverlay = $("cartOverlay");
const addToCartButton = $("addToCart");
const cartCountElement = $("cartCount");
const cartItemLabel = $("cartItemLabel");
const cartItemsElement = $("cartItems");
const cartTotalElement = $("cartTotal");
const demoCheckoutButton = $("demoCheckout");
const newsletterForm = $("newsletterForm");
const emailInput = $("emailInput");
const formMessage = $("formMessage");
const toast = $("toast");
const currentYear = $("currentYear");

// 2. Product and cart data
const product = {
  id: "tnh-concept-001",
  name: "TNH 5-in-1 Concept",
  description: "Illustrative concept product",
  price: 12
};

let cartQuantity = 0;
let toastTimeout;

// 3. Helper functions
function formatMoney(amount) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD"
  }).format(amount);
}

function showToast(message) {
  if (!toast) return;

  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimeout);

  toastTimeout = setTimeout(() => {
    toast.classList.remove("show");
  }, 2800);
}

// 4. Mobile navigation
function closeMobileMenu() {
  if (!menuToggle || !mainNav) return;

  mainNav.classList.remove("open");
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.setAttribute("aria-label", "Open navigation menu");
}

if (menuToggle && mainNav) {
  menuToggle.addEventListener("click", () => {
    const isOpen = mainNav.classList.toggle("open");

    menuToggle.setAttribute("aria-expanded", String(isOpen));
    menuToggle.setAttribute(
      "aria-label",
      isOpen ? "Close navigation menu" : "Open navigation menu"
    );
  });

  mainNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMobileMenu);
  });
}

// 5. Highlight the active navigation section
const sections = document.querySelectorAll("main section[id]");
const navLinks = document.querySelectorAll(".main-nav a");

if ("IntersectionObserver" in window && sections.length) {
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      navLinks.forEach((link) => {
        link.classList.toggle(
          "active",
          link.getAttribute("href") === `#${entry.target.id}`
        );
      });
    });
  }, {
    rootMargin: "-30% 0px -60% 0px"
  });

  sections.forEach((section) => sectionObserver.observe(section));
}

// 6. Open and close the shopping cart
function openCart() {
  if (!cartDrawer || !cartOverlay) return;

  cartOverlay.hidden = false;
  cartDrawer.classList.add("open");
  cartDrawer.setAttribute("aria-hidden", "false");
  document.body.classList.add("cart-open");
  closeCartButton?.focus();
}

function closeCart() {
  if (!cartDrawer || !cartOverlay) return;

  cartDrawer.classList.remove("open");
  cartDrawer.setAttribute("aria-hidden", "true");
  cartOverlay.hidden = true;
  document.body.classList.remove("cart-open");
  openCartButton?.focus();
}

openCartButton?.addEventListener("click", openCart);
closeCartButton?.addEventListener("click", closeCart);
cartOverlay?.addEventListener("click", closeCart);

// Close the menu or cart with Escape
document.addEventListener("keydown", (event) => {
  if (event.key !== "Escape") return;

  closeMobileMenu();

  if (cartDrawer?.classList.contains("open")) {
    closeCart();
  }
});

// 7. Add products to the cart
addToCartButton?.addEventListener("click", () => {
  cartQuantity++;
  updateCart();
  showToast(`${product.name} added to your demo bag.`);
  openCart();
});

function changeQuantity(amount) {
  cartQuantity = Math.max(0, cartQuantity + amount);
  updateCart();
}

// 8. Update cart information
function updateCart() {
  if (
    !cartCountElement ||
    !cartItemLabel ||
    !cartItemsElement ||
    !cartTotalElement
  ) return;

  const total = cartQuantity * product.price;

  cartCountElement.textContent = String(cartQuantity);
  cartItemLabel.textContent = `(${cartQuantity})`;
  cartTotalElement.textContent = formatMoney(total);

  if (cartQuantity === 0) {
    cartItemsElement.innerHTML = `
      <div class="empty-cart">
        <span aria-hidden="true">✳</span>
        <h3>Your bag is empty</h3>
        <p>Add the concept product to see how the cart works.</p>
      </div>
    `;
    return;
  }

  cartItemsElement.innerHTML = `
    <article class="cart-item">
      <div class="cart-product-art" aria-hidden="true">
        TNH<br>5 IN 1
      </div>

      <div class="cart-product-info">
        <h3>${product.name}</h3>
        <p>${formatMoney(product.price)} each</p>

        <div class="quantity-controls">
          <button type="button" data-action="decrease"
            aria-label="Remove one item">−</button>

          <span aria-live="polite">${cartQuantity}</span>

          <button type="button" data-action="increase"
            aria-label="Add one item">+</button>
        </div>
      </div>

      <div class="cart-line-total">${formatMoney(total)}</div>
    </article>
  `;
}

cartItemsElement?.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-action]");
  if (!button) return;

  changeQuantity(button.dataset.action === "increase" ? 1 : -1);
});

// 9. Demonstration checkout
demoCheckoutButton?.addEventListener("click", () => {
  showToast(
    cartQuantity
      ? "Demo only — no order or payment was processed."
      : "Your demo bag is empty."
  );
});

// 10. FAQ accordion
document.querySelectorAll(".faq-question").forEach((question) => {
  question.addEventListener("click", () => {
    const currentItem = question.closest(".faq-item");
    if (!currentItem) return;

    const willOpen = !currentItem.classList.contains("open");

    document.querySelectorAll(".faq-item").forEach((item) => {
      item.classList.remove("open");
      item.querySelector(".faq-question")
        ?.setAttribute("aria-expanded", "false");
    });

    if (willOpen) {
      currentItem.classList.add("open");
      question.setAttribute("aria-expanded", "true");
    }
  });
});

// 11. Newsletter form
if (newsletterForm && emailInput && formMessage) {
  newsletterForm.addEventListener("submit", (event) => {
    event.preventDefault();

    if (!emailInput.checkValidity() || !emailInput.value.trim()) {
      formMessage.textContent = "Please enter a valid email address.";
      emailInput.focus();
      return;
    }

    formMessage.textContent =
      "Thanks! The demo form works, but no email was sent or saved.";

    newsletterForm.reset();
  });
}

// 12. Footer year
if (currentYear) {
  currentYear.textContent = String(new Date().getFullYear());
}

// 13. Reveal content while scrolling
document.documentElement.classList.add("js-ready");

const revealTargets = document.querySelectorAll(
  ".use-card, .benefit, .review-card"
);

if (
  "IntersectionObserver" in window &&
  !window.matchMedia("(prefers-reduced-motion: reduce)").matches
) {
  revealTargets.forEach((element) => element.classList.add("reveal"));

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      entry.target.classList.add("visible");
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.12 });

  revealTargets.forEach((element) => revealObserver.observe(element));
} else {
  revealTargets.forEach((element) => element.classList.add("visible"));
}

// 14. Initialize the cart
updateCart();
