/* =========================================================
   PRE-ORDEN (carrito) para Uniformes Krisly
   - Guarda la pre-orden en localStorage (funciona en GitHub Pages)
   - Permite agregar el uniforme "seleccionado" en páginas de escuela
   - En index.html muestra un panel (drawer) con el resumen y envío por WhatsApp
   ========================================================= */

(() => {
  // --- Config ---
  const CART_KEY = "krisly_preorder_cart_v1"; // <-- clave única del carrito (localStorage)

  // --- Helpers ---
  const $ = (q, root=document) => root.querySelector(q);
  const $$ = (q, root=document) => Array.from(root.querySelectorAll(q));
  const money = (n) => Number(n || 0).toLocaleString("es-MX", { style:"currency", currency:"MXN" });

  const loadCart = () => {
    try { return JSON.parse(localStorage.getItem(CART_KEY)) || []; }
    catch { return []; }
  };
  const saveCart = (cart) => localStorage.setItem(CART_KEY, JSON.stringify(cart));

  const escapeHtml = (str) => String(str).replace(/[&<>"']/g, m => ({
    "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"
  }[m]));

  const toast = (msg) => {
    // --- Toast simple (sin dependencias) ---
    let t = $("#krislyToast");
    if (!t){
      t = document.createElement("div");
      t.id = "krislyToast";
      t.style.cssText = "position:fixed;left:50%;bottom:22px;transform:translateX(-50%);padding:10px 14px;border-radius:12px;background:rgba(0,0,0,.82);color:#fff;z-index:10000;font-size:14px;max-width:92vw;text-align:center;opacity:0;transition:opacity .15s ease;";
      document.body.appendChild(t);
    }
    t.textContent = msg;
    t.style.opacity = "1";
    clearTimeout(toast._tm);
    toast._tm = setTimeout(()=>{ t.style.opacity="0"; }, 1600);
  };

  // --- Core ---
  const cartAPI = {
    getCart(){ return loadCart(); },

    addItem(item){
      // item: { id, school, name, img, qty, size, notes }
      if (!item || !item.id || !item.name) return;

      const cart = loadCart();
      const existing = cart.find(x => x.id === item.id && x.size === (item.size || ""));
      if (existing){
        existing.qty = Math.max(1, (existing.qty || 1) + (item.qty || 1));
      } else {
        cart.push({
          id: String(item.id),
          school: item.school || "",
          name: item.name || "",
          img: item.img || "",
          qty: Math.max(1, Number(item.qty || 1)),
          size: item.size || "",   // <-- talla (opcional)
          notes: item.notes || ""  // <-- notas (opcional)
        });
      }
      saveCart(cart);
      cartAPI._syncBadges();
      toast("Agregado a tu pre-orden ✅");
    },

    updateItem(index, patch){
      const cart = loadCart();
      if (!cart[index]) return;
      cart[index] = { ...cart[index], ...patch };
      // normalizamos qty
      cart[index].qty = Math.max(1, Number(cart[index].qty || 1));
      saveCart(cart);
      cartAPI._syncBadges();
    },

    removeItem(index){
      const cart = loadCart();
      cart.splice(index, 1);
      saveCart(cart);
      cartAPI._syncBadges();
    },

    clear(){
      saveCart([]);
      cartAPI._syncBadges();
    },

    count(){
      return loadCart().reduce((acc, it) => acc + Number(it.qty || 0), 0);
    },

    // --- UI (solo si existe en la página) ---
    _hasDrawer(){
      return !!($("#cartDrawer") && $("#cartOverlay") && $("#cartItems"));
    },

    _open(){
      if (!cartAPI._hasDrawer()) return;
      $("#cartDrawer").classList.add("open");        // <-- abre el panel
      $("#cartDrawer").setAttribute("aria-hidden", "false");
      $("#cartOverlay").hidden = false;
    },

    _close(){
      if (!cartAPI._hasDrawer()) return;
      $("#cartDrawer").classList.remove("open");     // <-- cierra el panel
      $("#cartDrawer").setAttribute("aria-hidden", "true");
      $("#cartOverlay").hidden = true;
    },

    _render(){
      if (!cartAPI._hasDrawer()) return;

      const cart = loadCart();
      const wrap = $("#cartItems");
      const totalEl = $("#cartTotal");
      const countEl = $("#cartCount");

      // badge del header
      if (countEl) countEl.textContent = String(cartAPI.count());

      if (!cart.length){
        wrap.innerHTML = `<p style="opacity:.7;margin:10px 0;">Tu pre-orden está vacía.</p>`;
        totalEl.textContent = money(0);
        return;
      }

      wrap.innerHTML = cart.map((it, idx) => `
        <div class="cart-item">
          <img src="${escapeHtml(it.img || "img/core-img/logok.png")}" alt="">
          <div style="flex:1;">
            <h6>${escapeHtml(it.name)}</h6>
            ${it.school ? `<div class="meta"><strong>Escuela:</strong> ${escapeHtml(it.school)}</div>` : ``}

            <!-- NUEVO: talla / notas -->
            <div class="cart-field">
              <label>Talla</label>
              <input type="text" value="${escapeHtml(it.size || "")}" data-size="${idx}" placeholder="Ej: CH / M / G / 6 / 8">
            </div>

            <div class="cart-field">
              <label>Notas</label>
              <input type="text" value="${escapeHtml(it.notes || "")}" data-notes="${idx}" placeholder="Ej: Niño, bordado, etc.">
            </div>

            <div class="cart-qty">
              <button type="button" data-dec="${idx}" aria-label="Restar">-</button>
              <strong>${it.qty}</strong>
              <button type="button" data-inc="${idx}" aria-label="Sumar">+</button>
            </div>
          </div>
          <button type="button" class="cart-remove" data-del="${idx}">Eliminar</button>
        </div>
      `).join("");

      // total (si no tienes precios, se queda en $0.00)
      const total = cart.reduce((acc, it) => acc + (Number(it.price||0) * Number(it.qty||0)), 0);
      totalEl.textContent = money(total);

      // listeners: qty
      $$("[data-inc]", wrap).forEach(b => b.onclick = () => {
        const i = Number(b.getAttribute("data-inc"));
        const cart = loadCart();
        cartAPI.updateItem(i, { qty: Number(cart[i].qty||1) + 1 });
        cartAPI._render();
      });

      $$("[data-dec]", wrap).forEach(b => b.onclick = () => {
        const i = Number(b.getAttribute("data-dec"));
        const cart = loadCart();
        cartAPI.updateItem(i, { qty: Math.max(1, Number(cart[i].qty||1) - 1) });
        cartAPI._render();
      });

      // listeners: delete
      $$("[data-del]", wrap).forEach(b => b.onclick = () => {
        const i = Number(b.getAttribute("data-del"));
        cartAPI.removeItem(i);
        cartAPI._render();
      });

      // listeners: inputs (talla / notas)
      $$("input[data-size]", wrap).forEach(inp => inp.oninput = () => {
        const i = Number(inp.getAttribute("data-size"));
        cartAPI.updateItem(i, { size: inp.value });
      });
      $$("input[data-notes]", wrap).forEach(inp => inp.oninput = () => {
        const i = Number(inp.getAttribute("data-notes"));
        cartAPI.updateItem(i, { notes: inp.value });
      });
    },

    _syncBadges(){
      // badge simple (si existe)
      const countEl = $("#cartCount");
      if (countEl) countEl.textContent = String(cartAPI.count());
    }
  };

  // Exponemos API para usar en onclick si lo necesitas
  window.krislyCart = cartAPI; // <-- uso: krislyCart.addItem({...})

  // =========================================================
  // 1) BOTÓN FLOTA: Agregar a pre-orden el uniforme SELECCIONADO
  //    Se activa automáticamente si detecta:
  //    - #contenedor_IMA (imagen principal)
  //    - #Producto (texto del producto)
  // =========================================================
  const mainImg = $("#contenedor_IMA");
  const prodText = $("#Producto");

  if (mainImg && prodText){
    // detectamos escuela desde el <title> o fallback
    const schoolFromTitle = (document.title || "").replace(/^Krisly\s*\|\s*/i, "").trim();

    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "preorder-fab";
    btn.textContent = "➕ Pre-orden"; // <-- botón flotante
    btn.title = "Agregar el uniforme seleccionado a tu pre-orden";

    btn.onclick = () => {
      const name = (prodText.textContent || "").trim() || "Uniforme";
      const img = mainImg.getAttribute("src") || "";
      const school = schoolFromTitle || "";

      // id estable: escuela + nombre + imagen (para evitar duplicados raros)
      const id = `${school}::${name}::${img}`;

      cartAPI.addItem({ id, school, name, img, qty: 1 });
    };

    document.body.appendChild(btn);
  }

  // =========================================================
  // 2) UI del carrito (solo en páginas que lo incluyan, ej: index.html)
  // =========================================================
  const btnOpen = $("#cartBtn");
  const btnClose = $("#cartClose");
  const overlay = $("#cartOverlay");
  const btnClear = $("#cartClear");
  const btnCheckout = $("#cartCheckout");

  if (btnOpen && cartAPI._hasDrawer()){
    btnOpen.addEventListener("click", () => { cartAPI._render(); cartAPI._open(); }); // <-- abre panel
    if (btnClose) btnClose.addEventListener("click", () => cartAPI._close());        // <-- cierra panel
    if (overlay) overlay.addEventListener("click", () => cartAPI._close());          // <-- clic fuera cierra

    if (btnClear) btnClear.addEventListener("click", () => {                          // <-- vaciar carrito
      cartAPI.clear();
      cartAPI._render();
    });

    if (btnCheckout) btnCheckout.addEventListener("click", async () => {
      // --- Genera el texto de pre-orden para WhatsApp (sin compra, solo solicitud) ---
      const cart = loadCart();
      if (!cart.length){
        toast("Tu pre-orden está vacía.");
        return;
      }

      // Tomar filtros elegidos (si existen en la página)
      const estado = $("#estados")?.value || "";
      const escuelaSel = $("#escuelas")?.value || "";
      const escolaridadSel = $("#escolaridad")?.value || "";

      // Helper para imprimir solo si tiene valor útil
      const pretty = (label, val) => {
        if (!val) return null;
          if (String(val).toLowerCase() === "all") return null;
           return `${label}: ${val}`;
           };
           
           const lines = [];
           lines.push("Hola, buen día");
           lines.push("");
           lines.push("Me gustaría solicitar la *cotización* de la siguiente pre-orden de uniformes:");
           lines.push("");

           // Datos seleccionados por el usuario
           const meta = [
              pretty("Estado", estado),
                pretty("Escuela", escuelaSel),
                  pretty("Escolaridad", escolaridadSel),
                  ].filter(Boolean);

                  if (meta.length) {
                      lines.push(meta.join("\n"));
                        lines.push("");
                        }
                        
                        lines.push(" Pedido:");
                        cart.forEach((it, n) => {
                            const talla = it.size ? ` – Talla: ${it.size}` : "";
                              const notas = it.notes ? ` – Notas: ${it.notes}` : "";
                                const cleanName = String(it.name || "")
                                  .replace(/^[\s.\d]+/, "")
                                  .trim();
      lines.push(`${n+1}) ${it.qty} x ${cleanName}${talla}${notas}`);
                                });
                                
                                lines.push("");
                                lines.push("¿Me podrían apoyar con el *costo por pieza y el total*, por favor?");
                                lines.push("Quedo atento(a). ¡Gracias!");
                                const text = lines.join("\n");


      // Copiar al portapapeles si el navegador lo permite
      try {
        await navigator.clipboard.writeText(text);
        toast("Texto copiado ✅ Abriendo WhatsApp…");
      } catch {
        toast("Abriendo WhatsApp…");
      }

      // WhatsApp share sin número (el usuario elige contacto)
      const WHATSAPP_PHONE = "522722487124";
      const url = `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(text)}`;
      window.open(url, "_blank");
    });

    // render inicial del badge
    cartAPI._syncBadges();
  } else {
    // si no hay UI, al menos sincroniza badge si existe
    cartAPI._syncBadges();
  }
})();

(function setAppVH(){
  function apply(){
    const h = (window.visualViewport ? window.visualViewport.height : window.innerHeight);
    document.documentElement.style.setProperty('--app-vh', h + 'px');
  }
  apply();
  window.addEventListener('resize', apply);
  if (window.visualViewport) window.visualViewport.addEventListener('resize', apply);
})();
