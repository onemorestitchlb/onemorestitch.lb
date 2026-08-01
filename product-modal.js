document.addEventListener("DOMContentLoaded", () => {
  const modal = document.getElementById("productModal");

  if (!modal) {
    return;
  }

  const closeButton = modal.querySelector(".modal-close");
  const galleryWrapper = modal.querySelector(".detail-gallery");
  const detailImage = modal.querySelector(".detail-image");
  const detailName = modal.querySelector(".detail-name");
  const detailPrice = modal.querySelector(".detail-price");
  const detailDescription = modal.querySelector(".detail-description");
  const buttonRow = modal.querySelector(".modal-actions");
  const inquireButton = document.getElementById("inquireButton");
  const instagramButton = document.getElementById("instagramButton");
  const addToCartButton = document.getElementById("addToCartButton");
  const modalContent = modal.querySelector(".modal-content");
  const instagramUrl = "https://www.instagram.com/onemorestitch.lb?igsh=cTN5Mm93dzJjZDBz&utm_source=qr";

  if (inquireButton) {
    inquireButton.dataset.instagramUrl = instagramUrl;
  }

  let keychainPicker = null;
  let activeModalImages = [];
  let activeModalIndex = 0;
  let modalGalleryState = null;

  const parseImages = (value) => {
    const raw = String(value || "").trim();
    if (!raw) {
      return [];
    }

    return raw
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean)
      .map((item) => {
        if (!item) {
          return "";
        }

        const normalized = item.replace(/\\/g, "/");
        if (normalized.startsWith("http") || normalized.startsWith("/") || normalized.startsWith("images/")) {
          return normalized;
        }

        return `images/${normalized}`;
      })
      .filter(Boolean);
  };

  const getCardImages = (card) => parseImages(card.dataset.images || card.dataset.image || card.querySelector("img")?.getAttribute("src") || "");

  const getCardModalImages = (card) => parseImages(card.dataset.modalImages || card.dataset.images || card.dataset.image || card.querySelector("img")?.getAttribute("src") || "");

  const setModalImage = (imageIndex) => {
    if (!activeModalImages.length) {
      return;
    }

    activeModalIndex = (imageIndex + activeModalImages.length) % activeModalImages.length;
    detailImage.src = activeModalImages[activeModalIndex];
    detailImage.alt = detailName.textContent || "Product image";

    if (modalGalleryState) {
      modalGalleryState.setActiveIndex(activeModalIndex);
    }
  };

  const createModalGallery = (images, title) => {
    if (!galleryWrapper || !detailImage) {
      return null;
    }

    activeModalImages = images;
    activeModalIndex = 0;
    detailImage.src = images[0] || "";
    detailImage.alt = title || "Product image";

    if (modalGalleryState) {
      modalGalleryState.destroy();
    }

    if (images.length <= 1) {
      galleryWrapper.querySelectorAll(".gallery-controls").forEach((control) => control.remove());
      modalGalleryState = { setActiveIndex: () => {}, destroy: () => {} };
      return modalGalleryState;
    }

    const gallery = document.createElement("div");
    gallery.className = "gallery-controls";

    const prevButton = document.createElement("button");
    prevButton.type = "button";
    prevButton.className = "gallery-nav-button";
    prevButton.setAttribute("aria-label", "Previous image");
    prevButton.innerHTML = "&#10094;";

    const nextButton = document.createElement("button");
    nextButton.type = "button";
    nextButton.className = "gallery-nav-button";
    nextButton.setAttribute("aria-label", "Next image");
    nextButton.innerHTML = "&#10095;";

    const dots = document.createElement("div");
    dots.className = "gallery-dots";

    const setActiveIndex = (index) => {
      activeModalIndex = (index + images.length) % images.length;
      detailImage.src = images[activeModalIndex];
      detailImage.alt = title || "Product image";
      dots.querySelectorAll("button").forEach((dot, dotIndex) => {
        dot.classList.toggle("active", dotIndex === activeModalIndex);
      });
    };

    prevButton.addEventListener("click", (event) => {
      event.stopPropagation();
      setActiveIndex(activeModalIndex - 1);
    });

    nextButton.addEventListener("click", (event) => {
      event.stopPropagation();
      setActiveIndex(activeModalIndex + 1);
    });

    images.forEach((_, index) => {
      const dot = document.createElement("button");
      dot.type = "button";
      dot.className = "gallery-dot";
      dot.setAttribute("aria-label", `Show image ${index + 1}`);
      dot.addEventListener("click", (event) => {
        event.stopPropagation();
        setActiveIndex(index);
      });
      dots.appendChild(dot);
    });

    gallery.appendChild(prevButton);
    gallery.appendChild(nextButton);
    gallery.appendChild(dots);

    if (galleryWrapper) {
      galleryWrapper.querySelectorAll(".gallery-controls").forEach((control) => control.remove());
      galleryWrapper.appendChild(gallery);
    }

    let touchStartX = 0;
    const handleTouchStart = (event) => {
      touchStartX = event.touches[0].clientX;
    };
    const handleTouchEnd = (event) => {
      const delta = event.changedTouches[0].clientX - touchStartX;
      if (Math.abs(delta) > 50) {
        if (delta < 0) {
          setActiveIndex(activeModalIndex + 1);
        } else {
          setActiveIndex(activeModalIndex - 1);
        }
      }
    };

    if (galleryWrapper) {
      galleryWrapper.removeEventListener("touchstart", handleTouchStart);
      galleryWrapper.removeEventListener("touchend", handleTouchEnd);
      galleryWrapper.addEventListener("touchstart", handleTouchStart, { passive: true });
      galleryWrapper.addEventListener("touchend", handleTouchEnd, { passive: true });
    }

    modalGalleryState = {
      setActiveIndex,
      destroy() {
        if (galleryWrapper) {
          galleryWrapper.querySelectorAll(".gallery-controls").forEach((control) => control.remove());
        }
      },
    };

    setActiveIndex(0);
    return modalGalleryState;
  };

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
    const images = getCardModalImages(card);
    const title = card.dataset.title || "Product";
    const price = card.querySelector(".price")?.textContent?.trim() || card.dataset.price || "";
    const description = card.dataset.description || "Write your description here.";

    detailName.textContent = title;
    detailPrice.textContent = price;
    detailDescription.textContent = description;
    inquireButton.classList.remove("hidden");
    addToCartButton.classList.remove("hidden");
    if (instagramButton) {
      instagramButton.classList.add("hidden");
    }

    const titleText = (title || "").toLowerCase();
    const isKeychain = titleText.includes("keychain");

    if (isKeychain) {
      createKeychainPicker();
      keychainPicker.classList.remove("hidden");
      resetKeychainSelection();
    } else {
      if (keychainPicker) {
        keychainPicker.classList.add("hidden");
      }
    }

    if (addToCartButton) {
      addToCartButton.dataset.selection = "";
      addToCartButton.disabled = false;
      addToCartButton.classList.remove("disabled");
    }

    createModalGallery(images.length ? images : [card.querySelector("img")?.getAttribute("src") || ""], title);
    modal.classList.add("active");
    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-open");
  };

  const closeModal = () => {
    modal.classList.remove("active");
    modal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("modal-open");
    if (modalGalleryState) {
      modalGalleryState.destroy();
      modalGalleryState = null;
    }
  };

  document.querySelectorAll(".image-container").forEach((container) => {
    const image = container.querySelector("img");
    const images = getCardImages(container);
    let startX = 0;
    let currentIndex = 0;

    if (image) {
      image.src = images[0] || image.getAttribute("src") || "";
      image.alt = container.dataset.title || "Product image";
    }

    if (images.length > 1) {
      const nav = document.createElement("div");
      nav.className = "gallery-nav";

      const prevButton = document.createElement("button");
      prevButton.type = "button";
      prevButton.className = "gallery-nav-button";
      prevButton.setAttribute("aria-label", "Previous image");
      prevButton.innerHTML = "&#10094;";

      const nextButton = document.createElement("button");
      nextButton.type = "button";
      nextButton.className = "gallery-nav-button";
      nextButton.setAttribute("aria-label", "Next image");
      nextButton.innerHTML = "&#10095;";

      const dots = document.createElement("div");
      dots.className = "gallery-dots";

      const setActiveIndex = (index) => {
        currentIndex = (index + images.length) % images.length;
        if (image) {
          image.src = images[currentIndex];
          image.alt = container.dataset.title || "Product image";
        }
        dots.querySelectorAll("button").forEach((dot, dotIndex) => {
          dot.classList.toggle("active", dotIndex === currentIndex);
        });
      };

      prevButton.addEventListener("click", (event) => {
        event.stopPropagation();
        setActiveIndex(currentIndex - 1);
      });

      nextButton.addEventListener("click", (event) => {
        event.stopPropagation();
        setActiveIndex(currentIndex + 1);
      });

      images.forEach((_, index) => {
        const dot = document.createElement("button");
        dot.type = "button";
        dot.className = "gallery-dot";
        dot.setAttribute("aria-label", `Show image ${index + 1}`);
        dot.addEventListener("click", (event) => {
          event.stopPropagation();
          setActiveIndex(index);
        });
        dots.appendChild(dot);
      });

      nav.appendChild(prevButton);
      nav.appendChild(nextButton);
      container.appendChild(nav);
      container.appendChild(dots);
      setActiveIndex(0);

      container.addEventListener("touchstart", (event) => {
        startX = event.touches[0].clientX;
      }, { passive: true });

      container.addEventListener("touchend", (event) => {
        const delta = event.changedTouches[0].clientX - startX;
        if (delta > 50) {
          setActiveIndex(currentIndex - 1);
        } else if (delta < -50) {
          setActiveIndex(currentIndex + 1);
        }
      });
    }

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

  if (inquireButton) {
    inquireButton.addEventListener("click", () => {
      if (inquireButton.dataset.instagramUrl) {
        window.open(inquireButton.dataset.instagramUrl, "_blank", "noopener,noreferrer");
      } else if (instagramButton) {
        instagramButton.classList.remove("hidden");
      }
    });
  }

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && modal.classList.contains("active")) {
      closeModal();
    }
  });
});
