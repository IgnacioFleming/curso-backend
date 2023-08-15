import { Router } from "express";
import CartManager from "../cartManager.js";

const router = Router();
const CM = new CartManager("carts.json", "products.json");

router.post("/", (req, res) => {
  CM.createCart().then(({ status, description }) =>
    res.send({ status, description })
  );
});

router.get("/:cid", (req, res) => {
  const cid = JSON.parse(req.params.cid);

  CM.getCartById(cid).then(({ status, description }) => {
    if (status === "success") {
      res.send({ status, description });
    } else {
      res.status(400).send({ status, description });
    }
  });
});

export default router;
