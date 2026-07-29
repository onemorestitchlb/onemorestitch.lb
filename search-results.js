// All products database for searching
const ALL_PRODUCTS = [
  {
    title: "Hey",
    price: "$25.00",
    image: "hey.jpg",
    description: "This is a plushie item. Greetings.",
    category: "plushies"
  },
  {
    title: "Hi",
    price: "$30.00",
    image: "hi.jpg",
    description: "This is a plushie item. Greetings.",
    category: "plushies"
  },
  {
    title: "Crochet Keychain",
    price: "$10.00",
    image: "images/keychain1.jpg",
    description: "This is a keychain item. Write your description here.",
    category: "keychains"
  },
  {
    title: "Mini Keychain",
    price: "$15.00",
    image: "images/keychain2.jpg",
    description: "This is a keychain item. Write your description here.",
    category: "keychains"
  },
  {
    title: "Crochet Earrings",
    price: "$15.00",
    image: "images/earrings1.jpg",
    description: "This is an earring item. Write your description here.",
    category: "earrings"
  },
  {
    title: "Flower Earrings",
    price: "$20.00",
    image: "images/earrings2.jpg",
    description: "This is an earring item. Write your description here.",
    category: "earrings"
  },
  {
    title: "Create Your Own Piece",
    price: "Custom Pricing",
    image: "images/custom.jpg",
    description: "Have a favorite color, character, or idea? Request a custom handmade keychain or earrings designed especially for you.",
    category: "custom"
  },
  {
    title: "Crochet Bag",
    price: "$45.00",
    image: "images/bags1.svg",
    description: "A handmade bag made with care and texture.",
    category: "bags"
  },
  {
    title: "Mini Tote",
    price: "$50.00",
    image: "images/bags2.svg",
    description: "A compact tote with a handmade finish and roomy shape.",
    category: "bags"
  }
];

document.addEventListener("DOMContentLoaded", () => {
  const urlParams = new URLSearchParams(window.location.search);
  const searchTerm = urlParams.get("q") || "";
  const resultsGrid = document.getElementById("resultsGrid");
  const noResultsMessage = document.getElementById("noResultsMessage");
  const resultTitle = document.getElementById("resultTitle");

  const normalize = (value) => value.toLowerCase().trim();

  if (!searchTerm) {
    resultTitle.textContent = "Search Results";
    noResultsMessage.textContent = "No search term provided.";
    noResultsMessage.classList.remove("hidden");
    return;
  }

  const normalizedSearch = normalize(searchTerm);
  
  // Word boundary aware search
  const matches = ALL_PRODUCTS.filter((product) => {
    const title = normalize(product.title);
    const description = normalize(product.description);
    
    // Check if title equals search term or contains it as a word
    const titleMatch = title === normalizedSearch || 
                       new RegExp(`\\b${normalizedSearch}\\b`).test(title);
    
    // Check if description contains the search term as a word
    const descriptionMatch = new RegExp(`\\b${normalizedSearch}\\b`).test(description);
    
    return titleMatch || descriptionMatch;
  });

  resultTitle.textContent = `Search Results for "${searchTerm}"`;

  if (matches.length === 0) {
    noResultsMessage.innerHTML = `<h2>No results for \"${searchTerm}\"!</h2>`;
    noResultsMessage.classList.remove("hidden");
    resultsGrid.innerHTML = "";
    return;
  }

  noResultsMessage.classList.add("hidden");
  resultsGrid.innerHTML = "";

  matches.forEach((product) => {
    const card = document.createElement("div");
    card.className = "product-card";
    card.dataset.title = product.title;
    card.dataset.price = product.price;
    card.dataset.image = product.image;
    card.dataset.description = product.description;

    card.innerHTML = `
      <div class="image-container" tabindex="0" role="button" aria-label="View details for ${product.title}" data-image="${product.image}" data-title="${product.title}" data-price="${product.price}" data-description="${product.description}">
        <img src="${product.image}" alt="${product.title}">
        <div class="overlay">View Details</div>
      </div>
      <h2>${product.title}</h2>
      <p class="price">${product.price}</p>
    `;

    resultsGrid.appendChild(card);
  });

  // Re-attach image container click handlers
  document.querySelectorAll(".image-container").forEach((container) => {
    container.addEventListener("click", () => {
      const modal = document.getElementById("productModal");
      if (modal) {
        const detailImage = modal.querySelector(".detail-image");
        const detailName = modal.querySelector(".detail-name");
        const detailPrice = modal.querySelector(".detail-price");
        const detailDescription = modal.querySelector(".detail-description");
        const instagramButton = modal.querySelector("#instagramButton");

        if (detailImage && detailName && detailPrice && detailDescription) {
          detailImage.src = container.dataset.image;
          detailImage.alt = container.dataset.title;
          detailName.textContent = container.dataset.title;
          detailPrice.textContent = container.dataset.price;
          detailDescription.textContent = container.dataset.description || "Write your description here.";
          instagramButton.classList.add("hidden");

          const inquireButton = modal.querySelector("#inquireButton");
          const addToCartButton = modal.querySelector("#addToCartButton");
          if (inquireButton && addToCartButton) {
            inquireButton.classList.remove("hidden");
            addToCartButton.classList.remove("hidden");
          }

          modal.classList.add("active");
          modal.setAttribute("aria-hidden", "false");
          document.body.classList.add("modal-open");
        }
      }
    });

    container.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        container.click();
      }
    });
  });
});
