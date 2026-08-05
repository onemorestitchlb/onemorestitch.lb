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

  let optionPicker = null;
  let activeOptionPlaceholder = "Select..";
  let activeModalImages = [];
  let activeModalIndex = 0;
  let modalGalleryState = null;
  let currentRequired = { option: false, color: false };
  let selectedParts = { option: null, color: null };

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
        return normalized;
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

  const createOptionPicker = () => {
    if (optionPicker) {
      return optionPicker;
    }

    optionPicker = document.createElement("div");
    optionPicker.className = "product-option-picker hidden";
    optionPicker.innerHTML = `
      <div class="product-option-label"><span class="product-option-label-text"></span> <span class="product-option-trigger" tabindex="0" role="button"><span class="option-display">${activeOptionPlaceholder}</span></span></div>
      <div class="product-option-menu hidden"></div>
    `;

    const trigger = optionPicker.querySelector(".product-option-trigger");
    const menu = optionPicker.querySelector(".product-option-menu");

    trigger.addEventListener("click", () => {
      menu.classList.toggle("hidden");
    });

    trigger.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        menu.classList.toggle("hidden");
      }
    });

    document.addEventListener("click", (event) => {
      if (optionPicker && !optionPicker.contains(event.target)) {
        menu.classList.add("hidden");
      }
    });

    modalContent.insertBefore(optionPicker, buttonRow);
    return optionPicker;
  };

  const updateVariationString = () => {
    if (!addToCartButton) return;
    const values = [];
    if (selectedParts.option) values.push(selectedParts.option);
    if (selectedParts.color) values.push(selectedParts.color);
    addToCartButton.dataset.selection = values.join('; ');
  };

  const setVariationPart = (key, value) => {
    if (!addToCartButton) return;
    selectedParts[key] = value || null;
    updateVariationString();
  };

  const updateAddToCartState = () => {
    if (!addToCartButton) return;
    const needOption = currentRequired.option && !selectedParts.option;
    const needColor = currentRequired.color && !selectedParts.color;
    if (needOption || needColor) {
      addToCartButton.disabled = true;
      addToCartButton.classList.add('disabled');
    } else {
      addToCartButton.disabled = false;
      addToCartButton.classList.remove('disabled');
    }
  };

  /* Color picker: optional selector that can also swap images */
  const createColorPicker = () => {
    let picker = optionPicker && optionPicker.querySelector('.color-option-picker');
    if (picker) return picker;
    // create a dedicated color picker inside the optionPicker container (shared)
    const container = createOptionPicker();
    picker = document.createElement('div');
    picker.className = 'color-option-picker';
    picker.innerHTML = `
      <div class="product-option-label"><span class="product-option-label-text color-label"></span> <span class="product-option-trigger color-trigger" tabindex="0" role="button"><span class="option-display">${activeOptionPlaceholder}</span></span></div>
      <div class="product-option-menu color-menu hidden"></div>
    `;
    container.appendChild(picker);

    const trigger = picker.querySelector('.color-trigger');
    const menu = picker.querySelector('.color-menu');
    trigger.addEventListener('click', () => menu.classList.toggle('hidden'));
    trigger.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); menu.classList.toggle('hidden'); } });
    return picker;
  };

  const parseLabelSrcPairs = (value) => {
    return String(value || "").split('|').map((item) => item.trim()).filter(Boolean).map((entry) => {
      const idx = entry.indexOf(':');
      if (idx === -1) return { label: entry, src: '' };
      const label = entry.slice(0, idx).trim();
      const src = entry.slice(idx + 1).trim();
      return { label, src };
    });
  };

  const updateColorPicker = (choices, labelText) => {
    if (!choices || !choices.length) return;
    const picker = createColorPicker();
    const display = picker.querySelector('.option-display');
    const label = picker.querySelector('.color-label');
    const menu = picker.querySelector('.color-menu');
    if (label) label.textContent = labelText || 'Color';
    if (display) display.textContent = activeOptionPlaceholder;
    menu.innerHTML = '';
    choices.forEach(({ label: choiceLabel, src }) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'product-option-choice color-choice';
      btn.dataset.value = choiceLabel;
      btn.dataset.src = src;
      btn.textContent = choiceLabel;
      btn.addEventListener('click', () => {
        if (!display) return;
        display.textContent = choiceLabel;
        setVariationPart('color', choiceLabel);
        selectedParts.color = choiceLabel;
        if (src) {
          if (modalGalleryState) {
            modalGalleryState.destroy();
            modalGalleryState = { setActiveIndex: () => {}, destroy: () => {} };
          }
          if (galleryWrapper) {
            galleryWrapper.querySelectorAll('.gallery-controls').forEach((c) => c.remove());
          }
          detailImage.src = src;
          activeModalImages = [src];
          activeModalIndex = 0;
        }
        updateAddToCartState();
        menu.classList.add('hidden');
      });
      menu.appendChild(btn);
    });
  };

  const updateOptionPicker = (options, labelText) => {
    if (!options || !options.length) {
      return;
    }

    const picker = createOptionPicker();
    const display = picker.querySelector(".option-display");
    const label = picker.querySelector(".product-option-label-text");
    const menu = picker.querySelector(".product-option-menu");

    if (label) {
      label.textContent = labelText || "I would like it with a";
    }
    if (display) {
      display.textContent = activeOptionPlaceholder;
    }

    menu.innerHTML = "";
    options.forEach((optionValue) => {
      const optionButton = document.createElement("button");
      optionButton.type = "button";
      optionButton.className = "product-option-choice";
      optionButton.dataset.value = optionValue;
      optionButton.textContent = optionValue;
      optionButton.addEventListener("click", () => {
        if (!display) return;
        display.textContent = optionValue;
        setVariationPart('option', optionValue);
        selectedParts.option = optionValue;
        updateAddToCartState();
        menu.classList.add('hidden');
      });
      menu.appendChild(optionButton);
    });
  };

  const resetOptionSelection = () => {
    if (!optionPicker) {
      return;
    }

    const display = optionPicker.querySelector(".option-display");
    if (display) {
      display.textContent = activeOptionPlaceholder;
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

    if (detailName) {
      detailName.textContent = title;
    }
    if (detailPrice) {
      detailPrice.textContent = price;
    }
    if (detailDescription) {
      detailDescription.textContent = description;
    }
    inquireButton.classList.remove("hidden");
    addToCartButton.classList.remove("hidden");
    if (instagramButton) {
      instagramButton.classList.add("hidden");
    }

    const optionSource = card.dataset.options || card.closest(".product-card")?.dataset.options || "";
    const optionLabel = card.dataset.optionLabel || card.closest(".product-card")?.dataset.optionLabel || "I would like it with a";
    const optionPlaceholder = card.dataset.optionPlaceholder || "Select..";
    const optionChoices = String(optionSource)
      .split("|")
      .map((item) => item.trim())
      .filter(Boolean);

    activeOptionPlaceholder = optionPlaceholder;
    const colorSource = card.dataset.colorChoices || card.closest(".product-card")?.dataset.colorChoices || "";
    const colorLabel = card.dataset.colorLabel || card.closest(".product-card")?.dataset.colorLabel || "Color";
    const colorChoices = parseLabelSrcPairs(colorSource);

    currentRequired.option = optionChoices.length > 0;
    currentRequired.color = colorChoices.length > 0;
    selectedParts.option = null;
    selectedParts.color = null;
    updateAddToCartState();

    if (optionChoices.length) {
      updateOptionPicker(optionChoices, optionLabel);
      resetOptionSelection();
    }

    if (colorChoices.length) {
      updateColorPicker(colorChoices, colorLabel);
    }

    // show/hide the picker container based on available pickers
    if ((optionChoices.length || colorChoices.length) && optionPicker) {
      optionPicker.classList.remove('hidden');
    } else if (optionPicker) {
      optionPicker.classList.add('hidden');
      if (addToCartButton) {
        addToCartButton.dataset.selection = "";
        addToCartButton.disabled = false;
        addToCartButton.classList.remove("disabled");
      }
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
