const socket = io();
const list = document.getElementById("list");

socket.on("log", (data) => {
  data.forEach((element) => {
    if (element.thumbnails.length === 0) {
      element.thumbnails = "Sin imagen";
    }
    list.innerHTML += `
    <h2>Producto ID: ${element.id}</h2>
    <p>Titulo: ${element.title}</p>
    <p>Descripción: ${element.description}</p>
    <p>Precio: $${element.price}</p>
    <p>Categoría: ${element.category}</p>
    <p>Código: ${element.code}</p>
    <p>Stock: ${element.stock}</p>
    <p>Status: ${element.status}</p>
    <p>Imagenes: ${element.thumbnails}</p>
    `;
  });
});
