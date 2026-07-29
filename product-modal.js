document.addEventListener("DOMContentLoaded", () => {
  const modal = document.getElementById("productModal");

  if (!modal) {
    return;
  }

  const closeButton = modal.querySelector(".modal-close");
  const detailImage = modal.querySelector(".detail-image");
  const detailName = modal.querySelector(".detail-name");
  const detailPrice = modal.querySelector(".detail-price");
  const detailDescription = modal.querySelector(".detail-description");
  const buttonRow = modal.querySelector(".modal-actions");
  const inquireButton = document.getElementById("inquireButton");
  const instagramButton = document.getElementById("instagramButton");
  const addToCartButton = document.getElementById("addToCartButton");
  const modalContent = modal.querySelector(".modal-content");

  let keychainPicker = null;

  const createKeychainPicker = () => {
    if (keychainPicker) {
      return keychainPicker;
    }

    keychainPicker = document.createElement("div");
    keychainPicker.className = "keychain-option-picker hidden";
    keychainPicker.innerHTML = `
      <div class="keychain-option-label">Do you want it with a <span class="keychain-select-trigger" tabindex="0" role="button"><span class="option-display">Select..</span></span></div>
      <div class="keychain-option-menu hidden">
        <button type="button" class="keychain-option" data-value="Chain (regular)">Chain (regular)</button>
        <button type="button" class="keychain-option" data-value="Strap (to hang in car, etc)">Strap (to hang in car, etc)</button>
      </div>
    `;

    const trigger = keychainPicker.querySelector(".keychain-select-trigger");
    const menu = keychainPicker.querySelector(".keychain-option-menu");

    trigger.addEventListener("click", () => {
      menu.classList.toggle("hidden");
    });

    trigger.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        menu.classList.toggle("hidden");
      }
    });

    keychainPicker.querySelectorAll(".keychain-option").forEach((option) => {
      option.addEventListener("click", () => {
        const selected = option.dataset.value;
        const display = keychainPicker.querySelector(".option-display");
        display.textContent = selected;
        addToCartButton.dataset.selection = selected;
        addToCartButton.disabled = false;
        addToCartButton.classList.remove("disabled");
        menu.classList.add("hidden");
      });
    });

    document.addEventListener("click", (event) => {
      if (!keychainPicker.contains(event.target)) {
        menu.classList.add("hidden");
      }
    });

    modalContent.insertBefore(keychainPicker, buttonRow);
    return keychainPicker;
  };

  const resetKeychainSelection = () => {
    if (!keychainPicker) {
      return;
    }

    const display = keychainPicker.querySelector(".option-display");
    if (display) {
      display.textContent = "Select below..";
    }

    if (addToCartButton) {
      addToCartButton.dataset.selection = "";
      addToCartButton.disabled = true;
      addToCartButton.classList.add("disabled");
    }
  };

  const openModal = (card) => {
    detailImage.src = card.dataset.image;
    detailImage.alt = card.dataset.title;
    detailName.textContent = card.dataset.title;
    detailPrice.textContent = card.querySelector(".price")?.textContent?.trim() || card.dataset.price || "";
    detailDescription.textContent = card.dataset.description || "Write your description here.";
    inquireButton.classList.remove("hidden");
    addToCartButton.classList.remove("hidden");
    instagramButton.classList.add("hidden");

    const titleText = (card.dataset.title || "").toLowerCase();
    const isKeychain = titleText.includes("keychain");

    if (isKeychain) {
      createKeychainPicker();
      keychainPicker.classList.remove("hidden");
      resetKeychainSelection();
    } else {
      if (keychainPicker) {
        keychainPicker.classList.add("hidden");
      }
      if (addToCartButton) {
        addToCartButton.dataset.selection = "";
        addToCartButton.disabled = false;
        addToCartButton.classList.remove("disabled");
      }
    }

    modal.classList.add("active");
    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-open");
  };

  const closeModal = () => {
    modal.classList.remove("active");
    modal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("modal-open");
  };

  document.querySelectorAll(".image-container").forEach((container) => {
    container.addEventListener("click", () => openModal(container));
    container.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        openModal(container);
      }
    });
  });

  if (closeButton) {
    closeButton.addEventListener("click", closeModal);
  }

  modal.addEventListener("click", (event) => {
    if (event.target === modal) {
      closeModal();
    }
  });

  if (inquireButton && instagramButton && addToCartButton) {
    inquireButton.addEventListener("click", () => {
      inquireButton.classList.add("hidden");
      addToCartButton.classList.add("hidden");
      instagramButton.classList.remove("hidden");
    });
  }

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && modal.classList.contains("active")) {
      closeModal();
    }
  });
});
