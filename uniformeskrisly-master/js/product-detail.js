/* =====================
   STATE
===================== */
let selectedProduct = null;
let quantity = 1;

/* =====================
   RENDER SELECTED PRODUCT
===================== */
function showProduct(imageSrc) {
  selectedProduct = {
    image: imageSrc,
    name: imageSrc.split("/").pop().replace(".jpg", ""),
    size: "CH",
    quantity: 1
  };

  quantity = 1;

  document.getElementById("productImage").src = imageSrc;
  document.getElementById("productName").textContent = selectedProduct.name;
  document.getElementById("productSize").value = "CH";
  document.getElementById("qtyValue").textContent = "1";

  document.getElementById("productDetail").hidden = false;
}

/* =====================
   CONTROLS (this is the code you quoted)
===================== */
document.getElementById("productSize").addEventListener("change", (e) => {
  if (!selectedProduct) return;
  selectedProduct.size = e.target.value;
});

document.getElementById("qtyPlus").addEventListener("click", () => {
  if (!selectedProduct) return;
  quantity++;
  selectedProduct.quantity = quantity;
  document.getElementById("qtyValue").textContent = quantity;
});

document.getElementById("qtyMinus").addEventListener("click", () => {
  if (!selectedProduct || quantity === 1) return;
  quantity--;
  selectedProduct.quantity = quantity;
  document.getElementById("qtyValue").textContent = quantity;
});

/* =====================
   ADD TO CART (final step)
===================== */
document.getElementById("addToCartBtn").addEventListener("click", () => {
  if (!selectedProduct) return;
  addToCart({ ...selectedProduct });
});
