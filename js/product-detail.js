/* =========================================================
   PRODUCT DETAIL -> PRE-ORDEN
   - Al hacer clic en una imagen del catálogo se abre el panel
   - Al dar clic en "Preordenar / Agregar Pre-Orden" se agrega al carrito (localStorage)
   - Se conecta con window.krislyCart (preorder-cart.js)
   ========================================================= */

let selectedProduct = null;

function money(n){
  try{
    return Number(n || 0).toLocaleString('es-MX', { style:'currency', currency:'MXN' });
  }catch{
    return '$' + (n || 0);
  }
}

let quantity = 1;

function prettyNameFromSrc(src){
  try{
    const file = (src || "").split("/").pop() || "";
    return file
      .replace(/\.(jpg|jpeg|png|webp)$/i, "")
      .replace(/[_-]+/g, " ")
      .trim()
      .replace(/^\s*\d+(?:\.\d+)?\s*/,'')
      .trim();
  }catch{
    return "Producto";
  }
}

/* =====================
   RENDER SELECTED PRODUCT
===================== */
function showProduct(productOrSrc) {

  // Si es string, mantenemos compatibilidad (galería vieja)
  if (typeof productOrSrc === "string"){
    const imageSrc = productOrSrc;
    selectedProduct = {
      img: imageSrc,
      name: prettyNameFromSrc(imageSrc),
      size: "CH",
      qty: 1
    };

    quantity = 1;

    const imgEl = document.getElementById("productImage");
    const nameEl = document.getElementById("productName");
    const sizeEl = document.getElementById("productSize");
    const qtyEl  = document.getElementById("qtyValue");
    const panel  = document.getElementById("productDetail");
    const priceEl = document.getElementById("productPrice");

    if (imgEl) imgEl.src = imageSrc;
    if (nameEl) nameEl.textContent = selectedProduct.name;

    // opciones default (CH, M, G, XG) si existen en el HTML
    if (sizeEl){
      if (!sizeEl.options.length){
        ["CH","M","G","XG"].forEach(t=>{
          const o = document.createElement("option");
          o.value = t; o.textContent = t;
          sizeEl.appendChild(o);
        });
      }
      sizeEl.value = "CH";
    }

    if (priceEl) priceEl.textContent = ""; // no hay precio por talla en modo galería
    if (qtyEl) qtyEl.textContent = "1";
    if (panel) panel.hidden = false;
    return;
  }

  // ✅ Nuevo: modo "producto" (tipo Liverpool)
  const p = productOrSrc || {};
  const precios = p.preciosPorTalla || {};
  const tallas = Object.keys(precios);

  const firstSize = tallas[0] || "";
  selectedProduct = {
    id: p.id || String(p.img || p.name || "item"),
    img: p.img || "",
    name: p.name || "Producto",
    preciosPorTalla: precios,
    size: firstSize,
    qty: 1
  };

  quantity = 1;

  const imgEl = document.getElementById("productImage");
  const nameEl = document.getElementById("productName");
  const sizeEl = document.getElementById("productSize");
  const qtyEl  = document.getElementById("qtyValue");
  const panel  = document.getElementById("productDetail");
  const priceEl = document.getElementById("productPrice");

  if (imgEl) imgEl.src = selectedProduct.img;
  if (nameEl) nameEl.textContent = selectedProduct.name;

  // Rellenar tallas dinámicamente
  if (sizeEl){
    sizeEl.innerHTML = "";
    if (!tallas.length){
      const o = document.createElement("option");
      o.value = ""; o.textContent = "Sin tallas";
      sizeEl.appendChild(o);
      selectedProduct.size = "";
    }else{
      tallas.forEach(t=>{
        const o = document.createElement("option");
        o.value = t; o.textContent = t;
        sizeEl.appendChild(o);
      });
      sizeEl.value = firstSize;
    }
  }

  // Mostrar precio según talla
  if (priceEl){
    const pr = precios[selectedProduct.size];
    priceEl.textContent = (pr != null) ? `Precio: ${money(pr)}` : "";
  }

  if (qtyEl) qtyEl.textContent = "1";
  if (panel) panel.hidden = false;
}

/* =====================
   CONTROLS
===================== */
const sizeSelect = document.getElementById("productSize");
if (sizeSelect){
  sizeSelect.addEventListener("change", (e) => {
    if (!selectedProduct) return;
    selectedProduct.size = e.target.value;
    const priceEl = document.getElementById('productPrice');
    if (priceEl && selectedProduct.preciosPorTalla){
      const pr = selectedProduct.preciosPorTalla[selectedProduct.size];
      priceEl.textContent = (pr != null) ? `Precio: ${money(pr)}` : '';
    }
  });
}

const plusBtn = document.getElementById("qtyPlus");
if (plusBtn){
  plusBtn.addEventListener("click", () => {
    if (!selectedProduct) return;
    quantity++;
    selectedProduct.qty = quantity;
    const qtyEl = document.getElementById("qtyValue");
    if (qtyEl) qtyEl.textContent = String(quantity);
  });
}

const minusBtn = document.getElementById("qtyMinus");
if (minusBtn){
  minusBtn.addEventListener("click", () => {
    if (!selectedProduct || quantity === 1) return;
    quantity--;
    selectedProduct.qty = quantity;
    const qtyEl = document.getElementById("qtyValue");
    if (qtyEl) qtyEl.textContent = String(quantity);
  });
}

/* =====================
   ADD TO CART (PRE-ORDENAR)
===================== */
function getSchoolSelected(){
  const sel = document.getElementById("escuelas");
  return sel ? (sel.value || sel.options?.[sel.selectedIndex]?.text || "") : "";
}

function addSelectedToCart(){
  if (!selectedProduct) return;

  const school = getSchoolSelected();
  const id = String(selectedProduct.id || selectedProduct.img || selectedProduct.name || "item"); // id estable por producto
  // precio unitario según talla (si existe tabla)
  const unitPrice = (selectedProduct.preciosPorTalla && selectedProduct.size)
    ? Number(selectedProduct.preciosPorTalla[selectedProduct.size] || 0)
    : Number(selectedProduct.price || 0);

  const item = {
    id,
    school,
    name: selectedProduct.name,
    img: selectedProduct.img,
    qty: selectedProduct.qty || 1,
    size: selectedProduct.size || "",
    price: unitPrice,
    preciosPorTalla: selectedProduct.preciosPorTalla || null,
    prendaKey: selectedProduct.prendaKey || ""
  };

  if (window.krislyCart && typeof window.krislyCart.addItem === "function"){
    window.krislyCart.addItem(item);
    // opcional: abrir el carrito automáticamente
    if (typeof window.krislyCart.open === "function") window.krislyCart.open();
  } else {
    alert("No se encontró el carrito (krislyCart). Revisa que cargue js/preorder-cart.js");
  }
}

// Soporta ambos IDs (por si el HTML usa addToCart o addToCartBtn)
const addBtnA = document.getElementById("addToCart");
if (addBtnA) addBtnA.addEventListener("click", addSelectedToCart);

const addBtnB = document.getElementById("addToCartBtn");
if (addBtnB) addBtnB.addEventListener("click", addSelectedToCart);
