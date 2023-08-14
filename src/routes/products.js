import { Router } from "express";
import ProductManager from "../productManager.js";

const router = Router();

const PM = new ProductManager("products.json");

router.get("/", (req, res) => {
  const limit = parseInt(req.query.limit);

  PM.getProducts().then((data) => {
    if (isNaN(limit) || limit < 0 || limit > data.length) {
      res.send({ status: "success", data });
      return;
    }
    const filteredProducts = data.slice(0, limit);
    res.send({ status: "success", products: filteredProducts });
  });
});

export default router;
