let quantity = 0;
let price = 6.70;

function addToCart() {
    quantity++;
    updateCart();
    alert("5-in-1 Shampoo added to your cart!");
}

function updateCart() {
    document.getElementById("cartCount").innerHTML = quantity;
    let cartItems = document.getElementById("cartItems");
    let total = document.getElementById("total");

    if (quantity == 0) {
        cartItems.innerHTML = "Your cart is empty.";
        total.innerHTML = "0.00";
    } else {
        cartItems.innerHTML = `
            <div>
                <strong>🧴 TNH 5-in-1 Shampoo</strong>
                <br>
                Price: $6.70
                <div class="quantity">
                    <button onclick="decreaseQuantity()">−</button>
                    <span>${quantity}</span>
                    <button onclick="increaseQuantity()">+</button>
                </div>
            </div>
        `;
        total.innerHTML = (quantity * price).toFixed(2);
    }
}

function increaseQuantity() {
    quantity++;
    updateCart();
}

function decreaseQuantity() {
    if (quantity > 0) {
        quantity--;
    }
    updateCart();
}

function openCart() {
    document.getElementById("cartBox").style.display = "block";
    updateCart();
}

function closeCart() {
    document.getElementById("cartBox").style.display = "none";
}

function checkout() {
    if (quantity == 0) {
        alert("Your cart is empty!");
    } else {
        let totalPrice = (quantity * price).toFixed(2);
        alert(
            "Thank you for your order!\n\n" +
            "Product: TNH 5-in-1 Shampoo\n" +
            "Quantity: " + quantity + "\n" +
            "Total: $" + totalPrice
        );

        quantity = 0;
        updateCart();
        closeCart();
    }
}
