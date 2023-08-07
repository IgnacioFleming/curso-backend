const express = require("express");
const fs = require("fs");
const app = express();
const ProductManager = require("./managerUsuarios");

app.use(express.urlencoded({ extended: true }));
app.get("/products", (req, res) => {
  const PM = new ProductManager("productos.json");
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

app.listen(8080, () => {
  console.log("Levantado el servidor 8080");
});
