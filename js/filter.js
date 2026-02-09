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

  
  function money(n){
    try{
      return Number(n || 0).toLocaleString("es-MX", { style:"currency", currency:"MXN" });
    }catch{
      return "$" + (n || 0);
    }
  }

  function precioDesde(preciosPorTalla){
    if (!preciosPorTalla) return null;
    const vals = Object.values(preciosPorTalla).map(Number).filter(v => !isNaN(v));
    if (!vals.length) return null;
    return Math.min(...vals);
  }

  function renderSchoolImages(school) {
    const container = document.getElementById("clothesContainer");
    container.innerHTML = "";

    if (!school) {
      container.innerHTML = "<p>No products found</p>";
      return;
    }

    // ✅ Nuevo: si hay products, render tipo Liverpool
    if (Array.isArray(school.products) && school.products.length){
      school.products.forEach(p => {
        const card = document.createElement("article");
        card.className = "product-card";

        const desde = precioDesde(p.preciosPorTalla);
        const desdeTxt = (desde != null) ? `Desde ${money(desde)}` : "";

        card.innerHTML = `
          <img src="${p.img}" alt="${(p.name || "Producto").replace(/"/g,'&quot;')}" loading="lazy">
          <div class="p-name">${p.name || "Producto"}</div>
          <div class="p-price">${desdeTxt}</div>
        `;

        card.addEventListener("click", () => {
          if (typeof showProduct !== "function") {
            console.error("showProduct is not defined");
            return;
          }
          showProduct(p);
        });

        container.appendChild(card);
      });
      return;
    }

    // Fallback: galería de imágenes (como antes)
    if (!school.images?.length) {
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
