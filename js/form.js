document.addEventListener("DOMContentLoaded", () => {
  const productForm = document.querySelector(".product-form");
  const sizeSelect = document.querySelector(".product-size");
  const qtyValue = document.querySelector(".qty-value");
  const btnPlus = document.querySelector(".qty-plus");
  const btnMinus = document.querySelector(".qty-minus");
  const btnAdd = document.querySelector(".add-to-cart");
  const productTitle = document.getElementById("Producto");
  const productImages = document.querySelectorAll(".imagen_galeria");

  let quantity = 1;

  // Show form when any product image is clicked
  productImages.forEach((img) => {
    img.addEventListener("click", () => {
      productForm.hidden = false;
      quantity = 1;
      qtyValue.textContent = "1";
    });
  });

  // Increase quantity
  btnPlus.addEventListener("click", () => {
    quantity++;
    qtyValue.textContent = quantity;
  });

  // Decrease quantity
  btnMinus.addEventListener("click", () => {
    if (quantity > 1) {
      quantity--;
      qtyValue.textContent = quantity;
    }
  });

  // Add to cart
  btnAdd.addEventListener("click", () => {
    const productData = {
      name: productTitle.textContent.trim(),
      size: sizeSelect.value,
      quantity: quantity
    };

    console.log("Producto agregado:", productData);

    // 👉 Connect with your preorder cart
    if (typeof addToCart === "function") {
      addToCart(productData);
    }

    // Reset & hide form
    productForm.hidden = true;
    quantity = 1;
    qtyValue.textContent = "1";
  });
});
