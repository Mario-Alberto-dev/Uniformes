document.addEventListener("DOMContentLoaded", () => {

  // SAFETY CHECK
  if (typeof schoolsCatalog === "undefined") {
    console.error("schoolsCatalog is not loaded");
    return;
  }

  function getFilters() {
    return {
      estado: document.getElementById("estados")?.value,
      escuela: document.getElementById("escuelas")?.value,
      escolaridad: document.getElementById("escolaridad")?.value
    };
  }

  function findSchool() {
    const { estado, escuela, escolaridad } = getFilters();

    if (!estado || !escuela) return null;

    return schoolsCatalog.find(school =>
      school.estado === estado &&
      school.escuela === escuela &&
      (escolaridad === "all" || school.escolaridad.includes(escolaridad))
    );
  }

  function renderSchoolImages(school) {
    const container = document.getElementById("clothesContainer");
    container.innerHTML = "";

    if (!school || !school.images?.length) {
      container.innerHTML = "<p>No products found</p>";
      return;
    }

    school.images.forEach(src => {
      const img = document.createElement("img");
      img.src = src;
      img.className = "imagen_galeria";

      img.addEventListener("click", () => {
        if (typeof showProduct !== "function") {
          console.error("showProduct is not defined");
          return;
        }
        showProduct(src);
      });

      container.appendChild(img);
    });
  }

  document
    .getElementById("filter-form")
    ?.addEventListener("change", () => {
      renderSchoolImages(findSchool());
    });

  // FIRST RENDER
  renderSchoolImages(findSchool());

});
