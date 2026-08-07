// All products database for searching
const ALL_PRODUCTS = [
  {
    title: "Baby Bear",
    price: "$15.00",
    image: "images/mini-bear.png",
    description: "14cm x 18cm",
    category: "plushies"
  },
  {
    title: "Beaver",
    price: "$35.00",
    image: "images/beaver1.png",
    description: "28cm x 40cm",
    category: "plushies"
  },
  {
    title: "Bear",
    price: "$25.00",
    image: "images/bear.png",
    description: "19cm x 27cm",
    category: "plushies"
  },
  {
    title: "Bearnigiri (Bear + Onigiri)",
    price: "$25.00",
    image: "images/bear-onigiri1.png",
    description: "20cm x 20cm",
    category: "plushies"
  },
  {
    title: "Black Cat Scrunchie",
    price: "$10.00",
    image: "images/black-cat-scrunchie.png",
    description: "Can be used as a hair tie or wrist accessory",
    category: "scrunchies"
  },
  {
    title: "Bunny",
    price: "$20.00",
    image: "images/bunny.png",
    description: "28cm x 23cm",
    category: "plushies"
  },
  {
    title: "Brontosaurus",
    price: "$15.00",
    image: "images/brontosaurus1.png",
    description: "14cm x 19cm",
    category: "plushies"
  },
  {
    title: "Chocolate Milk Carton",
    price: "$17.00",
    image: "images/chocomilk.png",
    description: "20cm x 19cm",
    category: "plushies"
  },
  {
    title: "Cow",
    price: "$20.00",
    image: "images/cow1.png",
    description: "24cm x 30cm",
    category: "plushies"
  },
  {
    title: "DNA",
    price: "$15.00",
    image: "images/dna1.png",
    description: "10cm x 24cm",
    category: "plushies"
  },
  {
    title: "Fat Duck",
    price: "$35.00",
    image: "images/fat-duck.png",
    description: "32cm x 25cm",
    category: "plushies"
  },
  {
    title: "Fat Panda",
    price: "$40.00",
    image: "images/panda1.png",
    description: "23cm x 27cm",
    category: "plushies"
  },
  {
    title: "Ketchup'd Nugget",
    price: "$20.00",
    image: "images/distinguished-potato.png",
    description: "23cm x 22cm",
    category: "plushies"
  },
   {
    title: "Mini Bearcake (Bear + Pancake)",
    price: "$12.00",
    image: "images/mini-bearcake.png",
    description: "9cm x 8cm",
    category: "plushies"
  },
  {
    title: "Mini Otter",
    price: "$12.00",
    image: "images/mini-otter.png",
    description: "8cm x 13cm",
    category: "plushies"
  },
  {
    title: "Mini Penguin",
    price: "$12.00",
    image: "images/mini-penguin.png",
    description: "8cm x 11cm",
    category: "plushies"
  },
  {
    title: "Mini Potato",
    price: "$10.00",
    image: "images/potato.png",
    description: "9cm x 12cm",
    category: "plushies"
  },
  {
    title: "Mini Red Panda",
    price: "$20.00",
    image: "images/red-panda1.png",
    description: "9.5cm x 13cm",
    category: "plushies"
  },
  {
    title: "Mini Seated Bunny",
    price: "$15.00",
    image: "images/mini-bunny.png",
    description: "9cm x 13cm",
    category: "plushies"
  },
  {
    title: "Mini Turtle",
    price: "$15.00",
    image: "images/mini-turtle.png",
    description: "9cm x 13cm",
    category: "plushies"
  },
  {
    title: "Mushroom Garden Turtle",
    price: "$55.00",
    image: "images/mmushroom-turtle1.png",
    description: "27cm x 23cm",
    category: "plushies"
  },
  {
    title: "Mushroom Turtle",
    price: "$45.00",
    image: "images/mushroom-turtle1.png",
    description: "27cm x 23cm",
    category: "plushies"
  },
  {
    title: "Peach Turtle",
    price: "$40.00",
    image: "images/peach-turtle1.png",
    description: "27cm x 23cm",
    category: "plushies"
  },
  {
    title: "Pokeball Bag",
    price: "$45.00",
    image: "images/pokeball-bag1.png",
    description: "Perfect for carrying your essentials in style.",
    category: "bags"
  },
  {
    title: "Pompompurin",
    price: "$25.00",
    image: "images/pompompurin.png",
    description: "21cm x 19cm",
    category: "plushies"
  },
  {
    title: "Seal Keychain",
    price: "$5.00",
    image: "images/seals.png",
    description: "5cm x 5cm (excluding chain)",
    category: "plushies"
  },
  {
    title: "Radish Pig Wearing Chick",
    price: "$25.00",
    image: "images/radish-pig-wearing-chick.png",
    description: "23cm x 31cm",
    category: "plushies"
  },
  {
    title: "Stegosaurus",
    price: "$25.00",
    image: "images/blue-steg1.png",
    description: "32cm x 30cm",
    category: "plushies"
  },
  {
    title: "Strawberry Milk Carton",
    price: "$17.00",
    image: "images/strawberrymilk.png",
    description: "20cm x 19cm",
    category: "plushies"
  },
  {
    title: "Strawberry Turtle",
    price: "$40.00",
    image: "images/strawberry-turtle1.png",
    description: "27cm x 23cm",
    category: "plushies"
  },
   {
    title: "Totoro",
    price: "$55.00",
    image: "images/totoro2.png",
    description: "33cm x 36cm",
    category: "plushies"
  },
  {
    title: "White Cat Scrunchie",
    price: "$10.00",
    image: "images/white-cat-scrunchie.png",
    description: "Can be used as a hair tie or wrist accessory",
    category: "scrunchies"
  },
  {
    title: "Winnie The Pooh",
    price: "$25.00",
    image: "images/winniethepooh.png",
    description: "18cm x 24cm",
    category: "plushies"
  },
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
          if (instagramButton) {
            instagramButton.classList.add("hidden");
          }

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
