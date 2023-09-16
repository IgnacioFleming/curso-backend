const addToCart = document.getElementById("addToCart");
addToCart.addEventListener("click", () => {
  let cartId = "";
  const productId = addToCart.getAttribute("data-product-id");
  fetch("/api/carts", {
    method: "POST",
  })
    .then((response) => response.json())
    .then((data) => {
      cartId = data.payload._id;
    })
    .then((res) => {
      console.log("nuevo cartId", cartId);
      fetch(`/api/carts/${cartId}/products/${productId}`, {
        method: "POST",
      })
        .then((response) => response.json())
        .then((data) => console.log(data));
    });
});
