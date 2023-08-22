const socket = io();
const list = document.getElementById("list");
list.classList.add("products");

socket.on("log", (data) => {
  list.innerHTML = "";
  data.forEach((element) => {
    if (element.thumbnails.length === 0) {
      element.thumbnails = "Sin imagen";
    } else {
      const imagesUrl = element.thumbnails.join(",");
      element.thumbnails = imagesUrl;
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

//Formulario de creacion de producto

const newProduct = document.getElementById("newProduct");
const title = document.getElementById("title");
const description = document.getElementById("description");
const price = document.getElementById("price");
const status = document.getElementById("status");
const category = document.getElementById("category");
const code = document.getElementById("code");
const stock = document.getElementById("stock");
const file = document.getElementById("file");

newProduct.addEventListener("submit", (e) => {
  e.preventDefault();

  const product = {
    title: title.value,
    description: description.value,
    price: price.value,
    category: category.value,
    code: code.value,
    stock: stock.value,
  };
  if (status.checked) {
    product.status = true;
  } else {
    product.status = false;
  }
  socket.emit("addProduct", product);
  newProduct.reset();
});

const deleteProduct = document.getElementById("deleteProduct");
const id = document.getElementById("id");
deleteProduct.addEventListener("submit", (e) => {
  e.preventDefault();
  console.log(id);
  socket.emit("deleteProduct", id.value);
  deleteProduct.reset();
});
