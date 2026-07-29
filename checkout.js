document.addEventListener("DOMContentLoaded", () => {
  const checkoutItems = document.getElementById("checkoutItems");
  const deliveryTotal = document.getElementById("deliveryTotal");
  const checkoutForm = document.getElementById("checkoutForm");
  const thankYouModal = document.getElementById("thankYouModal");
  const confirmButton = checkoutForm ? checkoutForm.querySelector(".checkout-button") : null;
  const cityInput = document.getElementById("cityInput");
  const addressInput = document.getElementById("addressInput");
  const phoneInput = document.getElementById("phoneInput");

  const loadCart = () => {
    const stored = localStorage.getItem("cart");
    return stored ? JSON.parse(stored) : [];
  };

  const parsePrice = (priceText) => {
    const cleaned = priceText.replace(/[^0-9,.-]/g, "").replace(/,/g, "");
    const value = Number.parseFloat(cleaned);
    return Number.isNaN(value) ? 0 : value;
  };

  const formatPrice = (value) => `${value.toLocaleString("en-US")} LBP`;

  const renderCheckout = () => {
    const cart = loadCart();
    const subtotal = cart.reduce((sum, item) => sum + parsePrice(item.price) * item.quantity, 0);
    const deliveryFee = 400000; // Editable delivery fee; change here later if needed
    const total = subtotal + deliveryFee;

    if (!checkoutItems) {
      return;
    }

    checkoutItems.innerHTML = "";

    if (cart.length === 0) {
      checkoutItems.innerHTML = '<p class="empty-message">Your cart is empty</p>';
      deliveryTotal.textContent = "Total Price + Delivery: 0 LBP";
      return;
    }

    cart.forEach((item) => {
      const row = document.createElement("div");
      row.className = "checkout-item-row";
      row.innerHTML = `
        <div class="checkout-item-main">
          <span class="checkout-item-qty">${item.quantity}x</span>
          <span class="checkout-item-name">${item.title}</span>
        </div>
        <span class="checkout-item-price">${formatPrice(parsePrice(item.price) * item.quantity)}</span>
      `;
      checkoutItems.appendChild(row);
    });

    deliveryTotal.textContent = `Total Price + Delivery: ${formatPrice(total)}`;
  };

  const validateInputs = () => {
    const city = cityInput ? cityInput.value.trim() : "";
    const address = addressInput ? addressInput.value.trim() : "";
    const phone = phoneInput ? phoneInput.value.trim() : "";

    if (confirmButton) {
      confirmButton.disabled = !(city && address && phone);
      confirmButton.classList.toggle("disabled", !(city && address && phone));
    }
  };

  [cityInput, addressInput, phoneInput].forEach((input) => {
    if (input) {
      input.addEventListener("input", validateInputs);
    }
  });

  validateInputs();

  if (checkoutForm) {
    checkoutForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const city = cityInput ? cityInput.value.trim() : "";
      const address = addressInput ? addressInput.value.trim() : "";
      const phone = phoneInput ? phoneInput.value.trim() : "";

      if (!city || !address || !phone) {
        return;
      }

      localStorage.removeItem("cart");
      thankYouModal.classList.add("active");
      thankYouModal.setAttribute("aria-hidden", "false");
      document.body.classList.add("modal-open");
    });
  }

  if (thankYouModal) {
    thankYouModal.addEventListener("click", (event) => {
      if (event.target === thankYouModal) {
        thankYouModal.classList.remove("active");
        thankYouModal.setAttribute("aria-hidden", "true");
        document.body.classList.remove("modal-open");
      }
    });
  }

  renderCheckout();
});
