import express from "express";

const ProductManager = require("./managerUsuarios.js");

const app = express();

app.listen(8080, () => {
  console.log("Levantado el servidor 8080");
});
