import { Router } from "express";
import ProductManager from "../dao/MongoDB/productManager.mongoDB.js";
import { uploader } from "../utils.js";

const router = Router();

const PM = new ProductManager();

router.get("/", async (req, res) => {
  try {
    const { limit, queryPage, sort, query } = req.query;
    const {
      status,
      payload,
      description,
      page,
      nextPage,
      prevPage,
      hasNextPage,
      hasPrevPage,
      prevLink,
      nextLink,
      totalPages,
    } = await PM.getProducts(limit, queryPage, sort, query);
    if (status === "success") {
      res.send({
        status,
        payload,
        totalPages,
        prevPage,
        nextPage,
        page,
        hasPrevPage,
        hasNextPage,
        prevLink,
        nextLink,
      });
    } else {
      res.status(400).send({ status, description });
    }
  } catch (error) {
    res.status(500).send({ status: "error", description: error.toString() });
  }
});

router.get("/:pid", async (req, res) => {
  try {
    const { pid } = req.params;
    const { status, payload, description } = await PM.getProductById(pid);
    status === "error"
      ? res.status(400).send({ status, description })
      : res.send({ status, payload });
  } catch (error) {
    res.status(500).send({ status: "error", description: error.toString() });
  }
});

router.post("/", uploader.single("thumbnails"), async (req, res) => {
  console.log("entro en el router");
  try {
    console.log("pase por el try");
    const newProduct = req.body;
    console.log("el req.file es ", req.file);
    if (req.file) {
      newProduct.thumbnails = [req.file.path];
    }
    const { status, description, payload } = await PM.addProduct(newProduct);
    if (status === "success") {
      res.send({ status, payload });
    } else {
      res.status(400).send({ status, description });
    }
  } catch (error) {
    res.status(500).send({ status: "error", description: error.toString() });
  }
});

router.put("/:pid", async (req, res) => {
  try {
    const { pid } = req.params;
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
    res.status(500).send({ status: "error", description: error.toString() });
  }
});

router.delete("/:pid", async (req, res) => {
  try {
    const { pid } = req.params;
    const { status, payload } = await PM.deleteProduct(pid);
    if (status === "success") {
      res.send({ status, payload });
    } else {
      res.status(400).send({
        status,
        description: "Error al intentar eliminar el producto",
      });
    }
  } catch (error) {
    res.status(500).send({ status: "error", description: error.toString() });
  }
});

export default router;
