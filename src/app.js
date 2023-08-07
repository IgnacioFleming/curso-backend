const express = require("express");
const fs = require("fs");
const app = express();
const ProductManager = require("./managerUsuarios");

const PM = new ProductManager("productos.json");
app.get("/products", (req, res) => {
  app.use(express.urlencoded({ extended: true }));
  const limit = req.query.limit;
  if (!limit) {
    PM.getProducts().then((products) => {
      res.send({ products });
    });
    return;
  }
  PM.getProducts().then((e) => {
    const products = [];
    for (let i = 0; i < limit; i++) {
      products[i] = e[i];
    }
    res.send({ products });
  });
});

app.get("/products/:id", (req, res) => {
  const idProduct = req.params.id;
  if (!idProduct) {
    PM.getProducts().then((products) => {
      res.send({ products });
    });
    return;
  }
  PM.getProducts().then((products) => {
    const product = products.find((e) => e.id == idProduct);
    res.send({ product });
  });
});

app.listen(8080, () => {
  console.log("Levantado el servidor 8080");
});
