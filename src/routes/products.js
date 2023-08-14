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
      ? res.send({ status: "error", product })
      : res.send({ status: "success", product })
  );
});

export default router;
