/* =========================================================
   PRODUCT DETAIL -> PRE-ORDEN
   - Al hacer clic en una imagen del catálogo se abre el panel
   - Al dar clic en "Preordenar / Agregar Pre-Orden" se agrega al carrito (localStorage)
   - Se conecta con window.krislyCart (preorder-cart.js)
   ========================================================= */

let selectedProduct = null;
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
function showProduct(imageSrc) {
  selectedProduct = {
    img: imageSrc,
    // nombre legible (si luego quieres nombres "bonitos", aquí se ajusta)
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

  if (imgEl) imgEl.src = imageSrc;
  if (nameEl) nameEl.textContent = selectedProduct.name;
  if (sizeEl) sizeEl.value = "CH";
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
  const id = String(selectedProduct.img || selectedProduct.name || "item"); // id estable por producto
  const item = {
    id,
    school,
    name: selectedProduct.name,
    img: selectedProduct.img,
    qty: selectedProduct.qty || 1,
    size: selectedProduct.size || ""
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
