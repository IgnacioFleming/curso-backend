const addToCart = document.getElementById("addToCart");
addToCart.addEventListener("click", () => {
  const cartId = addToCart.getAttribute("data-cart-id") || "NotFound";
  const productId = addToCart.getAttribute("data-product-id");

  fetch(`/api/carts/${cartId}/products/${productId}`, {
    method: "POST",
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.status === "error") {
        alert(JSON.stringify(data.error));
      }
    });
});
