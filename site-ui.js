document.addEventListener("DOMContentLoaded", () => {
  const header = document.querySelector(".site-header");
  const searchToggle = document.getElementById("searchToggle");
  const searchBox = document.getElementById("searchBox");
  const searchInput = document.getElementById("searchInput");
  const searchHint = document.getElementById("searchHint");
  const resultsBox = document.getElementById("searchResults");
  const productCards = Array.from(document.querySelectorAll(".product-card"));

  if (!header || !searchToggle || !searchBox || !searchInput || !resultsBox) {
    return;
  }

  const normalize = (value) => value.toLowerCase().trim();

  const updateResults = () => {
    const term = normalize(searchInput.value);
    resultsBox.innerHTML = "";

    if (!term) {
      resultsBox.classList.remove("active");
      return;
    }

    const matches = productCards.filter((card) => {
      const title = normalize(card.dataset.title || "");
      const description = normalize(card.dataset.description || "");
      return title.includes(term) || description.includes(term);
    });

    if (matches.length === 0) {
      resultsBox.innerHTML = '<div class="search-result-item no-result">No items found.</div>';
      resultsBox.classList.add("active");
      return;
    }

    matches.forEach((card) => {
      const link = document.createElement("a");
      link.href = card.dataset.link || "#";
      link.className = "search-result-item";
      link.textContent = card.dataset.title || "Item";
      link.addEventListener("click", () => {
        resultsBox.classList.remove("active");
      });
      resultsBox.appendChild(link);
    });

    resultsBox.classList.add("active");
  };

  searchToggle.addEventListener("click", () => {
    searchBox.classList.toggle("active");
    if (searchBox.classList.contains("active")) {
      searchInput.focus();
    } else {
      searchInput.value = "";
      searchHint.classList.remove("hidden");
      resultsBox.classList.remove("active");
      resultsBox.innerHTML = "";
    }
  });

  searchInput.addEventListener("input", () => {
    if (searchInput.value.trim()) {
      searchHint.classList.add("hidden");
    } else {
      searchHint.classList.remove("hidden");
    }
    updateResults();
  });

  searchInput.addEventListener("focus", () => {
    if (searchInput.value.trim()) {
      searchHint.classList.add("hidden");
    }
  });

  document.addEventListener("click", (event) => {
    if (!header.contains(event.target)) {
      searchBox.classList.remove("active");
      searchInput.value = "";
      searchHint.classList.remove("hidden");
      resultsBox.classList.remove("active");
      resultsBox.innerHTML = "";
    }
  });
});
