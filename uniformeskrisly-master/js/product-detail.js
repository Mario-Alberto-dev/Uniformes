let selectedProduct = null;
let quantity = 1;

document.addEventListener("DOMContentLoaded", () => {

  window.showProduct = function (imageSrc) {
    const productDetail = document.getElementById("productDetail");
    const productImage = document.getElementById("productImage");
    const productName = document.getElementById("productName");
    const productSize = document.getElementById("productSize");
    const qtyValue = document.getElementById("qtyValue");

    // SAFETY CHECK
    if (!productDetail || !productImage || !productName || !productSize || !qtyValue) {
      console.error("Product detail elements not found in DOM");
      return;
    }

    quantity = 1;

    selectedProduct = {
      image: imageSrc,
      size: productSize.value,
      quantity: quantity
    };

    productImage.src = imageSrc;
    productName.textContent = imageSrc
      .split("/")
      .pop()
      .replace(".jpg", "");

    qtyValue.textContent = quantity;
    productDetail.hidden = false;
  };

  // SIZE CHANGE
  document.getElementById("productSize")?.addEventListener("change", (e) => {
    if (!selectedProduct) return;
    selectedProduct.size = e.target.value;
  });

  // QUANTITY +
  document.getElementById("qtyPlus")?.addEventListener("click", () => {
    if (!selectedProduct) return;
    quantity++;
    selectedProduct.quantity = quantity;
    document.getElementById("qtyValue").textContent = quantity;
  });

  // QUANTITY -
  document.getElementById("qtyMinus")?.addEventListener("click", () => {
    if (!selectedProduct || quantity === 1) return;
    quantity--;
    selectedProduct.quantity = quantity;
    document.getElementById("qtyValue").textContent = quantity;
  });

});
