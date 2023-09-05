import { Router } from "express";
import ProductManager from "../dao/MongoDB/productManager.mongoDB.js";
import { uploader } from "../utils.js";

const router = Router();

const PM = new ProductManager();

router.get("/", async (req, res) => {
  try {
    const limit = parseInt(req.query.limit);
    const { status, payload } = await PM.getProducts();
    if (isNaN(limit) || limit < 0 || limit > status.length) {
      res.send({ status, products: payload });
      return;
    }
    const filteredProducts = payload.slice(0, limit);
    res.send({ status, payload: filteredProducts });
  } catch (error) {
    res.status(500).send({ status: "error", description: error });
  }
});

router.get("/:pid", async (req, res) => {
  try {
    const pid = parseInt(req.params.pid);
    const { status, payload, description } = await PM.getProductById(pid);
    status === "error"
      ? res.status(400).send({ status, description })
      : res.send({ status, payload });
  } catch (error) {
    res.status(500).send({ status: "error", description: error });
  }
});

router.post("/", uploader.single("file"), async (req, res) => {
  try {
    const newProduct = req.body;
    if (req.file) {
      newProduct.thumbnails = [req.file];
    }
    newProduct.thumbnails || (newProduct.thumbnails = []);
    const { status, description, payload } = await PM.addProduct(newProduct);
    if (status === "success") {
      res.send({ status, payload });
    } else {
      res.status(400).send({ status, description });
    }
  } catch (error) {
    res.status(500).send({ status: "error", description: error });
  }
});

router.put("/:pid", async (req, res) => {
  try {
    const pid = parseInt(req.params.pid);
    const newProduct = req.body;
    delete newProduct?.id;
    const { status, description, payload } = await PM.updateProduct(
      pid,
      newProduct
    );

    if (status === "success") {
      res.send({ status, payload });
    } else {
      res.status(400).send({ status, description });
    }
  } catch (error) {
    res.status(500).send({ status: "error", description: error });
  }
});

router.delete("/:pid", (req, res) => {
  try {
    const pid = parseInt(req.params.pid);
    const { status, description, payload } = PM.deleteProduct(pid);
    if (status === "success") {
      res.send({ status, payload });
    } else {
      res.status(400).send({ status, description });
    }
  } catch (error) {
    res.status(500).send({ status: "error", description: error });
  }
});

export default router;
