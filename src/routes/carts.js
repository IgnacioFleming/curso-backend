import { Router } from "express";
import CartManager from "../cartManager.js";

const router = Router();
const CM = new CartManager("carts.json");

router.post("/", (req, res) => {
  CM.createCart();
  res.send({ status: "success", description: "Nuevo Carrito creado" });
});

export default router;
