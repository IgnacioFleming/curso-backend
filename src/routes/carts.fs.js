import { Router } from "express";
import CartManager from "../dao/FileSystem/cartManager.fs.js";

const router = Router();
const CM = new CartManager();

router.post("/", async (req, res) => {
  try {
    const { status, payload } = await CM.createCart();
    res.send({ status, payload });
  } catch (error) {
    res.status(500).send({ status: "error", description: error });
  }
});

router.get("/:cid", async (req, res) => {
  try {
    const cid = parseInt(req.params.cid);
    const { status, description, payload } = await CM.getCartById(cid);

    if (status === "success") {
      res.send({ status, payload });
    } else {
      res.status(400).send({ status, description });
    }
  } catch (error) {
    res.status(500).send({ status: "error", description: error });
  }
});

router.post("/:cid/products/:pid", async (req, res) => {
  try {
    const cid = parseInt(req.params.cid);
    const pid = parseInt(req.params.pid);
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
    res.status(500).send({ status: "error", description: error });
  }
});

export default router;
