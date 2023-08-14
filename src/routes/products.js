import { Router } from "express";
import ProductManager from "../productManager.js";

const router = Router();

const PM = new ProductManager("products.json");

router.get("/", (req, res) => {
  const limit = parseInt(req.query.limit);

  PM.getProducts().then((products) => {
    if (isNaN(limit) || limit < 0 || limit > products.length) {
      res.send({ status: "success", products });
      return;
    }
    const filteredProducts = products.slice(0, limit);
    res.send({ status: "success", products });
  });
});

router.get("/:pid", (req, res) => {
  const pid = parseInt(req.params.pid);

  PM.getProductById(pid).then((product) =>
    product === "Not Found"
      ? res.status(400).send({ status: "error", product })
      : res.send({ status: "success", product })
  );
});

router.post("/", (req, res) => {
  const newProduct = req.body;
  newProduct.status || (newProduct.status = true);
  newProduct.thumbnails || (newProduct.thumbnails = []);
  const newProductValidation =
    newProduct.title &&
    newProduct.description &&
    newProduct.price &&
    newProduct.code &&
    newProduct.stock &&
    newProduct.status &&
    newProduct.category;
  console.log(newProduct);
  if (!newProductValidation) {
    res.status(400).send({
      status: "error",
      error: "Faltan campos en el producto, por favor completar los mismos",
    });
    return;
  }
  PM.addProduct(newProduct).then(({ status, description }) => {
    if (status === "success") {
      res.send({ status, description });
    } else {
      res.send({ status, description });
    }
  });
});

export default router;
