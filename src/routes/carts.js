import { Router } from "express";
import CartManager from "../dao/MongoDB/cartManager.mongoDB.js";
import cartsController from "../controllers/carts.js";

const router = Router();

router.post("/", cartsController.createCart);

router.get("/:cid", cartsController.getCartById);

router.post("/:cid/products/:pid", cartsController.addProductToCart);

router.delete("/:cid/products/:pid", cartsController.deleteProductFromCart);

router.put("/:cid", cartsController.updateProductsOfCart);

router.put("/:cid/products/:pid", cartsController.updateProductQuantityFromCart);

router.delete("/:cid", cartsController.resetCart);

export default router;
