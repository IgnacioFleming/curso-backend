const addToCart = document.getElementById("addToCart");
addToCart.addEventListener("click", () => {
  let cartId = "6504f744b07752b35e65c067";
  const productId = addToCart.getAttribute("data-product-id");

  fetch(`/api/carts/${cartId}/products/${productId}`, {
    method: "POST",
  })
    .then((response) => response.json())
    .then((data) => console.log(data));
});
