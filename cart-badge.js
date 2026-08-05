document.addEventListener("DOMContentLoaded", () => {
  const cartButton = document.getElementById("cartButton");
  const cartBadge = document.getElementById("cartBadge");
  const addToCartButtons = document.querySelectorAll(".add-to-cart-button");

  const loadCart = () => {
    const stored = localStorage.getItem("cart");
    return stored ? JSON.parse(stored) : [];
  };

  const saveCart = (cart) => {
    localStorage.setItem("cart", JSON.stringify(cart));
    updateBadge();
  };

  const updateBadge = () => {
    const cart = loadCart();
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    if (cartBadge) {
      if (totalItems > 0) {
        cartBadge.textContent = totalItems;
        cartBadge.classList.remove("hidden");
      } else {
        cartBadge.classList.add("hidden");
      }
    }
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

  const normalizePrice = (priceText) => {
    const text = String(priceText || "").trim();
    const isLbp = text.toLowerCase().includes("lbp");
    const cleaned = text.replace(/[^0-9,.-]/g, "").replace(/,/g, "");
    const parsed = Number.parseFloat(cleaned);

    if (Number.isNaN(parsed)) {
      return text || "$0.00";
    }

    const normalizedValue = isLbp && parsed >= 1000 ? parsed / 1000 : parsed;
    return `$${normalizedValue.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  const addToCart = (title, price, variation = "") => {
    const cart = loadCart();
    const itemTitle = variation ? `${title} (${variation})` : title;
    const normalizedPrice = normalizePrice(price);
    const existing = cart.find((item) => item.title === itemTitle);
    if (existing) {
      existing.quantity += 1;
    } else {
      cart.push({ title: itemTitle, price: normalizedPrice, quantity: 1, variation });
    }
    saveCart(cart);
    showNotification(`${title} added to cart`);
  };

  addToCartButtons.forEach((btn) => {
    btn.addEventListener("click", (event) => {
      const button = event.currentTarget;
      const modal = button.closest(".modal");
      const titleElem = modal?.querySelector(".detail-name");
      const priceElem = modal?.querySelector(".detail-price");
      if (!titleElem || !priceElem) {
        return;
      }
      addToCart(titleElem.textContent, priceElem.textContent, button.dataset.selection || "");
    });
  });

  if (cartButton) {
    cartButton.addEventListener("click", (e) => {
      e.preventDefault();
      window.location.href = "cart.html";
    });
  }

  updateBadge();
});
