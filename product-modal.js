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
  const inquireButton = document.getElementById("inquireButton");
  const instagramButton = document.getElementById("instagramButton");

  const openModal = (card) => {
    detailImage.src = card.dataset.image;
    detailImage.alt = card.dataset.title;
    detailName.textContent = card.dataset.title;
    detailPrice.textContent = card.dataset.price;
    detailDescription.textContent = card.dataset.description || "Write your description here.";
    instagramButton.classList.add("hidden");
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

  if (inquireButton) {
    inquireButton.addEventListener("click", () => {
      instagramButton.classList.remove("hidden");
    });
  }

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && modal.classList.contains("active")) {
      closeModal();
    }
  });
});
