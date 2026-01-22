document.getElementById("qtyPlus").addEventListener("click", () => {
  quantity++;
  document.getElementById("qtyValue").textContent = quantity;
});

document.getElementById("qtyMinus").addEventListener("click", () => {
  if (quantity > 1) quantity--;
  document.getElementById("qtyValue").textContent = quantity;
});

/* add to cart  */

const cart = [];

document.getElementById("addToCartBtn").addEventListener("click", () => {
  const size = document.getElementById("productSize").value;

  cart.push({
    image: selectedProduct.image,
    size,
    quantity
  });

  console.log(cart);
});