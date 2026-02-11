document.addEventListener("DOMContentLoaded", () => {

  // SAFETY CHECK
  if (typeof schoolsCatalog === "undefined") {
    console.error("schoolsCatalog is not loaded");
    return;
  }

  // -----------------------------
  // Select dependiente: Estado -> Escuelas
  // -----------------------------
  function getEscuelasDisponibles(estado, escolaridad){
    if (!estado) return [];
    const esc = (schoolsCatalog || [])
      .filter(s => s.estado === estado)
      .filter(s => !escolaridad || escolaridad === 'all' || (Array.isArray(s.escolaridad) && s.escolaridad.includes(escolaridad)))
      .map(s => s.escuela)
      .filter(Boolean);
    // únicos, ordenados
    return Array.from(new Set(esc)).sort((a,b)=>a.localeCompare(b,'es'));
  }

  function repoblarEscuelas(){
    const estadoSel = document.getElementById('estados');
    const escuelaSel = document.getElementById('escuelas');
    const escolaridadSel = document.getElementById('escolaridad');

    if (!estadoSel || !escuelaSel) return;

    const estado = estadoSel.value;
    const escolaridad = escolaridadSel ? escolaridadSel.value : 'all';
    const prev = escuelaSel.value;

    // ¿Este estado tiene escuelas en general (sin importar escolaridad)?
    const escuelasAny = getEscuelasDisponibles(estado, 'all');
    const hayEscuelasEnEstado = escuelasAny.length > 0;

    // Si el estado NO tiene escuelas, también bloqueamos Escolaridad (y lo reseteamos)
    if (escolaridadSel) {
      escolaridadSel.disabled = Boolean(estado) && !hayEscuelasEnEstado;
      if (escolaridadSel.disabled) {
        escolaridadSel.value = 'all';
      }
    }

    const escuelas = getEscuelasDisponibles(estado, escolaridadSel && escolaridadSel.disabled ? 'all' : escolaridad);

    // reconstruir options (incluye placeholder para poder resetear)
    escuelaSel.innerHTML = '';
    const ph = document.createElement('option');
    ph.value = '';
    if (!estado) {
      ph.textContent = 'Selecciona escuela';
    } else if (escuelas.length) {
      ph.textContent = 'Selecciona escuela';
    } else {
      ph.textContent = hayEscuelasEnEstado ? 'No hay escuelas para esta escolaridad' : 'No hay escuelas para este estado';
    }
    escuelaSel.appendChild(ph);

    escuelas.forEach(nombre => {
      const opt = document.createElement('option');
      opt.value = nombre;
      opt.textContent = nombre;
      escuelaSel.appendChild(opt);
    });

    // habilitar/deshabilitar si hay opciones
    escuelaSel.disabled = !escuelas.length;

    // conservar selección previa si sigue existiendo; si no, resetear
    if (prev && escuelas.includes(prev)) {
      escuelaSel.value = prev;
    } else {
      escuelaSel.value = '';
    }
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
    ?.addEventListener("change", (e) => {
      // Si cambia Estado o Escolaridad, re-cargamos escuelas antes de filtrar
      if (e?.target?.id === "estados" || e?.target?.id === "escolaridad") {
        repoblarEscuelas();
      }
      renderSchoolImages(findSchool());
    });
// FIRST RENDER
  // Asegura que los selects estén sincronizados al cargar
  repoblarEscuelas();
  renderSchoolImages(findSchool());

});