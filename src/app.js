import express from "express";
import ProductManager from "./productManager.js";
import productsRouter from "./routes/products.js";
import cartsRouter from "./routes/carts.js";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("api/products", productsRouter);
app.get("api/carts", cartsRouter);

app.listen(8080, () => {
  console.log("Levantado el servidor 8080");
});
