document.addEventListener("DOMContentLoaded", () => {
  const cartButton = document.getElementById("cartButton");
  const cartBadge = document.getElementById("cartBadge");
  const addToCartButtons = document.querySelectorAll(".add-to-cart-button");

  // Load cart from localStorage
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
    if (totalItems > 0) {
      cartBadge.textContent = totalItems;
      cartBadge.classList.remove("hidden");
    } else {
      cartBadge.classList.add("hidden");
    }
  };

  const showNotification = (message) => {
    const notification = document.createElement("div");
    notification.className = "cart-notification";
    notification.textContent = message;
    document.body.appendChild(notification);

    // Trigger animation
    setTimeout(() => notification.classList.add("show"), 10);

    // Remove after 2 seconds
    setTimeout(() => {
      notification.classList.remove("show");
      setTimeout(() => notification.remove(), 300);
    }, 2000);
  };

  const addToCart = (title, price) => {
    const cart = loadCart();
    const existing = cart.find((item) => item.title === title);
    if (existing) {
      existing.quantity += 1;
    } else {
      cart.push({ title, price, quantity: 1 });
    }
    saveCart(cart);
    showNotification(`${title} added to cart`);
  };

  // Add to Cart button handlers in modals
  addToCartButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const modal = btn.closest(".modal");
      if (modal) {
        const titleElem = modal.querySelector(".detail-name");
        const priceElem = modal.querySelector(".detail-price");
        if (titleElem && priceElem) {
          addToCart(titleElem.textContent, priceElem.textContent);
        }
      }
    });
  });

  // Cart button click
  if (cartButton) {
    cartButton.addEventListener("click", (e) => {
      e.preventDefault();
      window.location.href = "cart.html";
    });
  }

  updateBadge();
});
