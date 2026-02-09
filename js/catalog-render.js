const container = document.getElementById("clothesContainer");

function renderCatalogImages(filteredCatalog) {
  container.innerHTML = ""; // clear previous

  if (!filteredCatalog) return;

  // ✅ Nuevo: render products si existen
  if (Array.isArray(filteredCatalog.products) && filteredCatalog.products.length){
    const money = (n)=>Number(n||0).toLocaleString("es-MX",{style:"currency",currency:"MXN"});
    const precioDesde = (pt)=>{
      const vals = Object.values(pt||{}).map(Number).filter(v=>!isNaN(v));
      return vals.length ? Math.min(...vals) : null;
    };

    filteredCatalog.products.forEach(p=>{
      const card = document.createElement("article");
      card.className = "product-card";
      const desde = precioDesde(p.preciosPorTalla);
      card.innerHTML = `
        <img src="${p.img}" alt="${(p.name||"Producto").replace(/"/g,"&quot;")}" loading="lazy">
        <div class="p-name">${p.name || "Producto"}</div>
        <div class="p-price">${desde!=null ? `Desde ${money(desde)}` : ""}</div>
      `;
      card.addEventListener("click", ()=> showProduct(p));
      container.appendChild(card);
    });
    return;
  }

  // Fallback: imágenes
  (filteredCatalog.images || []).forEach((src) => {
    const img = document.createElement("img");
    img.src = src;
    img.className = "imagen_galeria";

    img.addEventListener("click", () => {
      showProduct(src);
    });

    container.appendChild(img);
  });
}
