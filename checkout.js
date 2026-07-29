document.addEventListener("DOMContentLoaded", () => {
  const checkoutItems = document.getElementById("checkoutItems");
  const deliveryTotal = document.getElementById("deliveryTotal");
  const checkoutForm = document.getElementById("checkoutForm");
  const thankYouModal = document.getElementById("thankYouModal");
  const thankYouSummary = document.getElementById("thankYouSummary");
  const confirmButton = checkoutForm ? checkoutForm.querySelector(".checkout-button") : null;
  const nameInput = document.getElementById("nameInput");
  const cityInput = document.getElementById("cityInput");
  const addressInput = document.getElementById("addressInput");
  const phoneInput = document.getElementById("phoneInput");

  const loadCart = () => {
    const stored = localStorage.getItem("cart");
    return stored ? JSON.parse(stored) : [];
  };

  const parsePrice = (priceText) => {
    const text = String(priceText || "").trim();
    const isLbp = text.toLowerCase().includes("lbp");
    const cleaned = text.replace(/[^0-9,.-]/g, "").replace(/,/g, "");
    const value = Number.parseFloat(cleaned);

    if (Number.isNaN(value)) {
      return 0;
    }

    return isLbp && value >= 1000 ? value / 1000 : value;
  };

  const formatPrice = (value) => `$${Number(value).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  const escapeHtml = (value) => String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#39;");

  const buildSummary = (cart, customerName, city, address, phone, total) => {
    const lines = [
      `<p><strong>Name:</strong> ${escapeHtml(customerName)}</p>`,
      `<p><strong>City:</strong> ${escapeHtml(city)}</p>`,
      `<p><strong>Address:</strong> ${escapeHtml(address)}</p>`,
      `<p><strong>Phone Number:</strong> ${escapeHtml(phone)}</p>`,
      "<p><strong>Order:</strong></p>",
    ];

    if (cart.length === 0) {
      lines.push("<p>No items selected.</p>");
    } else {
      cart.forEach((item) => {
        lines.push(`<p>${escapeHtml(`${item.quantity}x ${item.title}`)}</p>`);
      });
    }

    lines.push(`<p><strong>Total:</strong> ${formatPrice(total)}</p>`);
    return lines.join("");
  };

const sendOrderEmail = async (summaryText) => {
  const payload = new URLSearchParams({
    name: "New order",
    email: "rahykay@gmail.com",
    message: summaryText,
    _subject: "New order from onemorestitch.lb",
    _captcha: "false",
  });

  try {
    const response = await fetch("https://formsubmit.co/ajax/e8d98f8a146e093a04227129dc8769cf", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Accept: "application/json",
      },
      body: payload.toString(),
    });

    const result = await response.json();

    alert(JSON.stringify(result));   // <-- Add this

    if (!response.ok || result.success === false) {
      throw new Error(result.message || "Email failed.");
    }

    return true;

  } catch (error) {
    console.error(error);
    alert("Email failed: " + error.message);
    return false;
  }
};

  const renderCheckout = () => {
    const cart = loadCart();
    const subtotal = cart.reduce((sum, item) => sum + parsePrice(item.price) * item.quantity, 0);
    const deliveryFee = 4; // Editable delivery fee; change here later if needed
    const total = subtotal + deliveryFee;

    if (!checkoutItems) {
      return;
    }

    checkoutItems.innerHTML = "";

    if (cart.length === 0) {
      checkoutItems.innerHTML = '<p class="empty-message">Your cart is empty</p>';
      deliveryTotal.textContent = "Total Price + Delivery: $0";
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
    const name = nameInput ? nameInput.value.trim() : "";
    const city = cityInput ? cityInput.value.trim() : "";
    const address = addressInput ? addressInput.value.trim() : "";
    const phone = phoneInput ? phoneInput.value.trim() : "";
    const isComplete = !!(name && city && address && phone);

    if (confirmButton) {
      confirmButton.disabled = !isComplete;
      confirmButton.classList.toggle("disabled", !isComplete);
    }
  };

  [nameInput, cityInput, addressInput, phoneInput].forEach((input) => {
    if (input) {
      input.addEventListener("input", validateInputs);
    }
  });

  validateInputs();

  if (checkoutForm) {
    checkoutForm.addEventListener("submit", async (event) => {
      event.preventDefault();
      const name = nameInput ? nameInput.value.trim() : "";
      const city = cityInput ? cityInput.value.trim() : "";
      const address = addressInput ? addressInput.value.trim() : "";
      const phone = phoneInput ? phoneInput.value.trim() : "";

      if (!name || !city || !address || !phone) {
        return;
      }

      const cart = loadCart();
      const subtotal = cart.reduce((sum, item) => sum + parsePrice(item.price) * item.quantity, 0);
      const deliveryFee = 4;
      const total = subtotal + deliveryFee;
      const summaryText = [
        `Name: ${name}`,
        `City: ${city}`,
        `Address: ${address}`,
        `Phone Number: ${phone}`,
        "Order:",
        ...cart.map((item) => `${item.quantity}x ${item.title}`),
        `Total: ${formatPrice(total)}`,
      ].join("\n");

      if (thankYouSummary) {
        thankYouSummary.innerHTML = buildSummary(cart, name, city, address, phone, total);
      }

      const sent = await sendOrderEmail(summaryText);

    if (!sent) {
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
