import { Router } from "express";
import CartManager from "../dao/MongoDB/cartManager.mongoDB.js";

const router = Router();
const CM = new CartManager();

router.post("/", async (req, res) => {
  try {
    const { status, payload } = await CM.createCart();
    res.send({ status, payload });
  } catch (error) {
    res.status(500).send({ status: "error", description: error.toString() });
  }
});

router.get("/:cid", async (req, res) => {
  try {
    const { cid } = req.params;
    const { status, description, payload } = await CM.getCartById(cid);

    if (status === "success") {
      res.send({ status, payload });
    } else {
      res.status(400).send({ status, description });
    }
  } catch (error) {
    res.status(500).send({ status: "error", description: error.toString() });
  }
});

router.post("/:cid/products/:pid", async (req, res) => {
  try {
    const { cid } = req.params;
    const { pid } = req.params;
    const { status, description, payload } = await CM.addProductToCart(
      cid,
      pid
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

export default router;
