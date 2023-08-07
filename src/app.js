const express = require("express");
const fs = require("fs");
const app = express();
const ProductManager = require("./managerUsuarios");

const PM = new ProductManager("productos.json");

app.use(express.urlencoded({ extended: true }));
app.get("/products", (req, res) => {
  const products = PM.getProducts().then((products) => res.send(products));
});

app.listen(8080, () => {
  console.log("Levantado el servidor 8080");
});
