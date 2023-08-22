import { Router } from "express";
import { uploader } from "../utils.js";
import ProductManager from "../productManager.js";

const router = Router();
const PM = new ProductManager("products.json");

router.get("/", (req, res) => {
  res.render("home", {});
});

router.get("/realTimeProducts", (req, res) => {
  res.render("realTimeProducts", { style: "realTimeProducts.css" });
});

router.post("/realTimeProducts", uploader.single("file"), (req, res) => {
  const newProduct = req.body;
  if (req.file) {
    newProduct.thumbnails = [];

    newProduct.thumbnails.push(req.file.path);
  }
  let { title, description, price, code, stock, status, category } = newProduct;
  const statusValidation = status ?? "Sin status";
  if (statusValidation === "Sin status") {
    res.status(400).send({
      status: "error",
      error: "Faltan campos en el producto, por favor completar los mismos",
    });
    return;
  }
  if (!(title && description && price && code && stock && category)) {
    res.status(400).send({
      status: "error",
      error: "Faltan campos en el producto, por favor completar los mismos",
    });
    return;
  }
  newProduct.status || (newProduct.status = true);
  newProduct.thumbnails || (newProduct.thumbnails = []);
  PM.addProduct(newProduct).then(({ status, description }) => {
    if (status === "success") {
      res.send({ status, description });
    } else {
      res.status(400).send({ status, description });
    }
  });
});

export default router;
