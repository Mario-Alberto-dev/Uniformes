const container = document.getElementById("clothesContainer");

function renderCatalogImages(filteredCatalog) {
  container.innerHTML = ""; // clear previous images

  filteredCatalog.images.forEach((src) => {
    const img = document.createElement("img");
    img.src = src;
    img.className = "imagen_galeria";

    img.addEventListener("click", () => {
      showProduct(src);
    });

    container.appendChild(img);
  });
}
