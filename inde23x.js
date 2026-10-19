


"use strict";


const menuToggle = document.getElementById("menuToggle");
const mainNav = document.getElementById("mainNav");

const openCartButton = document.getElementById("openCart");
const closeCartButton = document.getElementById("closeCart");
const cartDrawer = document.getElementById("cartDrawer");
const cartOverlay = document.getElementById("cartOverlay");

const addToCartButton = document.getElementById("addToCart");
const cartCountElement = document.getElementById("cartCount");
const cartItemLabel = document.getElementById("cartItemLabel");
const cartItemsElement = document.getElementById("cartItems");
const cartTotalElement = document.getElementById("cartTotal");
const demoCheckoutButton = document.getElementById("demoCheckout");

const newsletterForm = document.getElementById("newsletterForm");
const emailInput = document.getElementById("emailInput");
const formMessage = document.getElementById("formMessage");

const toast = document.getElementById("toast");
const currentYear = document.getElementById("currentYear");

/* 2. Product information
   This is demonstration data, not a real sale. */
const product = {
  id: "tnh-concept-001",
  name: "TNH 5-in-1 Concept",
  description: "Illustrative concept product",
  price: 12.00
};


let cartQuantity = 0;
let toastTimeout;

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

  window.clearTimeout(toastTimeout);

  toastTimeout = window.setTimeout(() => {
    toast.classList.remove("show");
  }, 2800);
}


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


  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeMobileMenu();
    }
  });
}


const observedSections = document.querySelectorAll(
  "main section[id]"
);

const navLinks = document.querySelectorAll(".main-nav a");

if ("IntersectionObserver" in window && observedSections.length > 0) {
  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        navLinks.forEach((link) => {
          const matches = link.getAttribute("href") === `#${entry.target.id}`;

          if (matches) {
            link.classList.add("active");
          } else {
            link.classList.remove("active");
          }
        });
      });
    },
    {
      rootMargin: "-30% 0px -60% 0px",
      threshold: 0
    }
  );

  observedSections.forEach((section) => {
    sectionObserver.observe(section);
  });
}

function openCart() {
  if (!cartDrawer || !cartOverlay) return;

  cartOverlay.hidden = false;
  cartDrawer.classList.add("open");
  cartDrawer.setAttribute("aria-hidden", "false");
  document.body.classList.add("cart-open");

  if (closeCartButton) {
    closeCartButton.focus();
  }
}

function closeCart() {
  if (!cartDrawer || !cartOverlay) return;

  cartDrawer.classList.remove("open");
  cartDrawer.setAttribute("aria-hidden", "true");
  cartOverlay.hidden = true;
  document.body.classList.remove("cart-open");

  if (openCartButton) {
    openCartButton.focus();
  }
}

if (openCartButton) {
  openCartButton.addEventListener("click", openCart);
}

if (closeCartButton) {
  closeCartButton.addEventListener("click", closeCart);
}

if (cartOverlay) {
  cartOverlay.addEventListener("click", closeCart);
}

// Escape closes the cart drawer.
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && cartDrawer?.classList.contains("open")) {
    closeCart();
  }
});


if (addToCartButton) {
  addToCartButton.addEventListener("click", () => {
    cartQuantity += 1;

    updateCart();
    showToast(`${product.name} added to your demo bag.`);
    openCart();
  });
}


function changeQuantity(amount) {
  cartQuantity += amount;

  // The quantity cannot be negative.
  if (cartQuantity < 0) {
    cartQuantity = 0;
  }

  updateCart();
}


function updateCart() {
  if (
    !cartCountElement ||
    !cartItemLabel ||
    !cartItemsElement ||
    !cartTotalElement
  ) {
    return;
  }

  cartCountElement.textContent = String(cartQuantity);
  cartItemLabel.textContent = `(${cartQuantity})`;

  const subtotal = cartQuantity * product.price;
  cartTotalElement.textContent = formatMoney(subtotal);

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
      <div class="cart-product-art" aria-hidden="true">TNH<br />5 IN 1</div>

      <div class="cart-product-info">
        <h3>${product.name}</h3>
        <p>${formatMoney(product.price)} each</p>

        <div class="quantity-controls" aria-label="Change product quantity">
          <button
            type="button"
            data-action="decrease"
            aria-label="Remove one item"
          >−</button>

          <span aria-live="polite">${cartQuantity}</span>

          <button
            type="button"
            data-action="increase"
            aria-label="Add one item"
          >+</button>
        </div>
      </div>

      <div class="cart-line-total">
        ${formatMoney(subtotal)}
      </div>
    </article>
  `;
}

/* 11. Handle clicks on quantity buttons */
if (cartItemsElement) {
  cartItemsElement.addEventListener("click", (event) => {
    const button = event.target.closest("button[data-action]");

    if (!button) return;

    const action = button.dataset.action;

    if (action === "increase") {
      changeQuantity(1);
    } else if (action === "decrease") {
      changeQuantity(-1);
    }
  });
}

/* 12. Demonstration checkout
   This intentionally does not collect payment or place an order. */
if (demoCheckoutButton) {
  demoCheckoutButton.addEventListener("click", () => {
    if (cartQuantity === 0) {
      showToast("Your demo bag is empty.");
      return;
    }

    showToast("Demo only — no order or payment was processed.");
  });
}

/* 13. FAQ accordion */
const faqQuestions = document.querySelectorAll(".faq-question");

faqQuestions.forEach((question) => {
  question.addEventListener("click", () => {
    const currentItem = question.closest(".faq-item");

    if (!currentItem) return;

    const willOpen = !currentItem.classList.contains("open");

    // Close all FAQ items first.
    document.querySelectorAll(".faq-item").forEach((item) => {
      item.classList.remove("open");

      const itemButton = item.querySelector(".faq-question");

      if (itemButton) {
        itemButton.setAttribute("aria-expanded", "false");
      }
    });

    // Open only the item that was clicked.
    if (willOpen) {
      currentItem.classList.add("open");
      question.setAttribute("aria-expanded", "true");
    }
  });
});

/* 14. Newsletter form demonstration */
if (newsletterForm && emailInput && formMessage) {
  newsletterForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const email = emailInput.value.trim();

    if (!emailInput.checkValidity() || email === "") {
      formMessage.textContent = "Please enter a valid email address.";
      emailInput.focus();
      return;
    }

    // This demo does not send or store the email anywhere.
    formMessage.textContent =
      "Thanks! The demo form works, but no email was sent or saved.";

    newsletterForm.reset();
  });
}

/* 15. Current year in the footer */
if (currentYear) {
  currentYear.textContent = String(new Date().getFullYear());
}

/* 16. Reveal selected sections as the user scrolls */
document.documentElement.classList.add("js-ready");

const revealTargets = document.querySelectorAll(
  ".use-card, .benefit, .review-card"
);

if (
  "IntersectionObserver" in window &&
  !window.matchMedia("(prefers-reduced-motion: reduce)").matches
) {
  revealTargets.forEach((element) => {
    element.classList.add("reveal");
  });

  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      });
    },
    {
      threshold: 0.12
    }
  );

  revealTargets.forEach((element) => {
    revealObserver.observe(element);
  });
} else {
  // Keep content visible if the browser doesn't support the observer
  // or the user prefers reduced motion.
  revealTargets.forEach((element) => {
    element.classList.add("visible");
  });
}

/* 17. Initial page setup */
updateCart();
