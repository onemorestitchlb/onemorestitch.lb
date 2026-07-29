document.addEventListener("DOMContentLoaded", () => {
  const cartItemsContainer = document.getElementById("cartItems");
  const emptyMessage = document.getElementById("emptyMessage");
  const cartSummary = document.getElementById("cartSummary");
  const checkoutLink = document.querySelector('.cart-actions .button[href="checkout.html"]');

  const loadCart = () => {
    const stored = localStorage.getItem("cart");
    return stored ? JSON.parse(stored) : [];
  };

  const saveCart = (cart) => {
    localStorage.setItem("cart", JSON.stringify(cart));
    renderCart();
    updateGlobalBadge();
  };

  const showNotification = (message) => {
    const notification = document.createElement("div");
    notification.className = "cart-notification";
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => notification.classList.add("show"), 10);

    setTimeout(() => {
      notification.classList.remove("show");
      setTimeout(() => notification.remove(), 300);
    }, 2000);
  };

  const parsePrice = (priceText) => {
    const text = String(priceText || "").trim();
    const isLbp = text.toLowerCase().includes("lbp");
    const cleaned = text.replace(/[^0-9,.-]/g, "").replace(/,/g, "");
    const parsed = Number.parseFloat(cleaned);

    if (Number.isNaN(parsed)) {
      return 0;
    }

    return isLbp && parsed >= 1000 ? parsed / 1000 : parsed;
  };

  const formatPrice = (value) => `$${Number(value).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  const removeItem = (title) => {
    let cart = loadCart();
    cart = cart.filter((item) => item.title !== title);
    saveCart(cart);
    showNotification(`${title} removed from cart`);
  };

  const updateQuantity = (title, newQuantity) => {
    const cart = loadCart();
    const item = cart.find((item) => item.title === title);
    if (item) {
      if (newQuantity <= 0) {
        removeItem(title);
      } else {
        item.quantity = newQuantity;
        saveCart(cart);
      }
    }
  };

  const updateGlobalBadge = () => {
    const cart = loadCart();
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const badge = document.getElementById("cartBadge");
    if (badge) {
      if (totalItems > 0) {
        badge.textContent = totalItems;
        badge.classList.remove("hidden");
      } else {
        badge.classList.add("hidden");
      }
    }
  };

  const updateCheckoutState = (cart) => {
    if (checkoutLink) {
      if (cart.length === 0) {
        checkoutLink.classList.add("disabled");
        checkoutLink.setAttribute("aria-disabled", "true");
        checkoutLink.removeAttribute("href");
      } else {
        checkoutLink.classList.remove("disabled");
        checkoutLink.setAttribute("aria-disabled", "false");
        checkoutLink.setAttribute("href", "checkout.html");
      }
    }
  };

  const renderCart = () => {
    const cart = loadCart();
    cartItemsContainer.innerHTML = "";

    if (cart.length === 0) {
      emptyMessage.classList.remove("hidden");
      cartSummary.innerHTML = "";
      cartSummary.classList.add("hidden");
      updateCheckoutState(cart);
      return;
    }

    emptyMessage.classList.add("hidden");

    cart.forEach((item) => {
      const itemDiv = document.createElement("div");
      itemDiv.className = "cart-item";

      const namePrice = document.createElement("div");
      namePrice.className = "cart-item-name-price";
      namePrice.innerHTML = `<span class="cart-item-name">${item.title}</span><span class="cart-item-price">${formatPrice(parsePrice(item.price))}</span>`;

      const controls = document.createElement("div");
      controls.className = "cart-item-controls";

      const decreaseBtn = document.createElement("button");
      decreaseBtn.className = "cart-control-btn decrease";
      decreaseBtn.textContent = "−";
      decreaseBtn.disabled = item.quantity <= 1;
      decreaseBtn.addEventListener("click", () => {
        updateQuantity(item.title, item.quantity - 1);
      });

      const quantityInput = document.createElement("input");
      quantityInput.className = "cart-quantity-input";
      quantityInput.type = "number";
      quantityInput.value = item.quantity;
      quantityInput.min = "1";
      quantityInput.addEventListener("change", () => {
        const newQty = parseInt(quantityInput.value) || 1;
        if (newQty > 0) {
          updateQuantity(item.title, newQty);
        } else {
          quantityInput.value = item.quantity;
        }
      });

      const increaseBtn = document.createElement("button");
      increaseBtn.className = "cart-control-btn increase";
      increaseBtn.textContent = "+";
      increaseBtn.addEventListener("click", () => {
        updateQuantity(item.title, item.quantity + 1);
      });

      const controlsBox = document.createElement("div");
      controlsBox.className = "controls-box";
      controlsBox.appendChild(decreaseBtn);
      controlsBox.appendChild(quantityInput);
      controlsBox.appendChild(increaseBtn);

      controls.appendChild(controlsBox);

      const removeBtn = document.createElement("button");
      removeBtn.className = "cart-remove-btn";
      removeBtn.textContent = "✕";
      removeBtn.addEventListener("click", () => {
        removeItem(item.title);
      });

      controls.appendChild(removeBtn);

      itemDiv.appendChild(namePrice);
      itemDiv.appendChild(controls);

      cartItemsContainer.appendChild(itemDiv);
    });

    const subtotal = cart.reduce((sum, item) => sum + parsePrice(item.price) * item.quantity, 0);
    cartSummary.innerHTML = `<div class="cart-summary-total">Total price: ${formatPrice(subtotal)}</div>`;
    cartSummary.classList.remove("hidden");
    updateCheckoutState(cart);
  };

  renderCart();
});
