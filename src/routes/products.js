import { Router } from "express";
import ProductManager from "../productManager.js";
import { uploader } from "../utils.js";

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
    res.send({ status: "success", products: filteredProducts });
  });
});

router.get("/:pid", (req, res) => {
  const pid = parseInt(req.params.pid);
  if (isNaN(pid)) {
    res.send({ status: "error", description: "El id debe ser un numero" });
    return;
  }

  PM.getProductById(pid).then((product) =>
    product === "Not Found"
      ? res.status(400).send({ status: "error", description: product })
      : res.send({ status: "success", product })
  );
});

router.post("/", uploader.array("files", 3), (req, res) => {
  const newProduct = req.body;

  console.log("el req file es", req.files);
  if (!req.files) {
    res.status(400).send({
      status: "error",
      description: "No se puedo enviar las imagenes",
    });
    return;
  }
  if (req.files) {
    newProduct.thumbnails = [];
    req.files.forEach((e) => {
      console.log("el path del thumbnail", e.path);
      newProduct.thumbnails.push(e.path);
    });
    console.log("el nuevo producto es", newProduct);
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

router.put("/:pid", (req, res) => {
  const pid = parseInt(req.params.pid);
  if (isNaN(pid)) {
    res.send({ status: "error", description: "El id debe ser un numero" });
    return;
  }
  const newProduct = req.body;
  delete newProduct?.id;
  PM.updateProduct(pid, newProduct).then(({ status, description }) => {
    if (status === "success") {
      res.send({ status, description });
    } else {
      res.status(400).send({ status, description });
    }
  });
});

router.delete("/:pid", (req, res) => {
  const pid = parseInt(req.params.pid);
  if (isNaN(pid)) {
    res.send({ status: "error", description: "El id debe ser un numero" });
    return;
  }
  PM.deleteProduct(pid).then(({ status, description }) => {
    if (status === "success") {
      res.send({ status, description });
    } else {
      res.status(400).send({ status, description });
    }
  });
});

export default router;
