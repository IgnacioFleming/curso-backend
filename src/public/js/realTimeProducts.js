const socket = io();
const list = document.getElementById("list");
list.classList.add("products");

socket.on("log", (data) => {
  data.forEach((element) => {
    if (element.thumbnails.length === 0) {
      element.thumbnails = "Sin imagen";
    } else {
      const imagesUrl = element.thumbnails.join(",");
      element.thumbnails = imagesUrl;
      console.log(element.thumbnails);
    }
    list.innerHTML += `
    <div class="product">
    <h2>Producto ID: ${element.id}</h2>
    <p>Titulo: ${element.title}</p>
    <p>Descripción: ${element.description}</p>
    <p>Precio: $${element.price}</p>
    <p>Categoría: ${element.category}</p>
    <p>Código: ${element.code}</p>
    <p>Stock: ${element.stock}</p>
    <p>Status: ${element.status}</p>
    <p class="thumbnail">Imagenes: ${element.thumbnails}</p>
    </div>
    `;
  });
});
