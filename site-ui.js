document.addEventListener("DOMContentLoaded", () => {
  const header = document.querySelector(".site-header");
  const searchToggle = document.getElementById("searchToggle");
  const searchBox = document.getElementById("searchBox");
  const searchInput = document.getElementById("searchInput");
  const searchHint = document.getElementById("searchHint");

  if (!header || !searchToggle || !searchBox || !searchInput) {
    return;
  }

  searchToggle.addEventListener("click", () => {
    searchBox.classList.toggle("active");
    if (searchBox.classList.contains("active")) {
      searchInput.focus();
      if (!searchInput.value.trim()) {
        searchHint.classList.remove("hidden");
      }
    } else {
      searchInput.value = "";
      searchHint.classList.remove("hidden");
    }
  });

  searchInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      const term = searchInput.value.trim();
      if (term) {
        window.location.href = `search-results.html?q=${encodeURIComponent(term)}`;
      }
    }
  });

  searchInput.addEventListener("input", () => {
    if (searchInput.value.trim()) {
      searchHint.classList.add("hidden");
    } else {
      searchHint.classList.remove("hidden");
    }
  });

  searchInput.addEventListener("focus", () => {
    if (!searchInput.value.trim()) {
      searchHint.classList.remove("hidden");
    }
  });

  searchInput.addEventListener("blur", () => {
    if (!searchInput.value.trim()) {
      searchHint.classList.remove("hidden");
    }
  });

  document.addEventListener("click", (event) => {
    if (!header.contains(event.target)) {
      searchBox.classList.remove("active");
    }
  });
});

