document.addEventListener("DOMContentLoaded", () => {
  const header = document.querySelector(".site-header");
  const homeButton = document.getElementById("homeButton");

  if (homeButton) {
    homeButton.addEventListener("click", () => {
      window.location.href = "index.html";
    });
  }

  if (header && !header.querySelector(".home-button")) {
    const homeButtonNode = document.createElement("button");
    homeButtonNode.type = "button";
    homeButtonNode.className = "home-button";
    homeButtonNode.id = "homeButton";
    homeButtonNode.setAttribute("aria-label", "Back to homepage");
    homeButtonNode.innerHTML = "<span aria-hidden=\"true\">&lt;</span>";
    homeButtonNode.addEventListener("click", () => {
      window.location.href = "index.html";
    });
    header.insertBefore(homeButtonNode, header.firstChild);
  }

  const searchToggle = document.getElementById("searchToggle");
  const searchBox = document.getElementById("searchBox");
  const searchInput = document.getElementById("searchInput");
  const searchHint = document.getElementById("searchHint");

  if (!header || !searchToggle || !searchBox || !searchInput) {
    return;
  }

  const headerActions = header.querySelector(".header-actions");
  if (!headerActions) {
    const actions = document.createElement("div");
    actions.className = "header-actions";
    const searchToggleNode = header.querySelector("#searchToggle");
    const cartButtonNode = header.querySelector("#cartButton");

    if (searchToggleNode) {
      actions.appendChild(searchToggleNode);
    }
    if (cartButtonNode) {
      actions.appendChild(cartButtonNode);
    }
    header.appendChild(actions);
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

