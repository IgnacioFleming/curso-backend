import { Router } from "express";
import cartsController from "../controllers/carts.js";
import { passportCall, userAuthorizations } from "../utils.js";

const router = Router();

router.post("/", cartsController.createCart);

router.get("/:cid", cartsController.getCartById);

router.post("/:cid/products/:pid", passportCall("jwt"), userAuthorizations, cartsController.addProductToCart);

router.delete("/:cid/products/:pid", passportCall("jwt"), userAuthorizations, cartsController.deleteProductFromCart);

router.put("/:cid", passportCall("jwt"), userAuthorizations, cartsController.updateProductsOfCart);

router.put("/:cid/products/:pid", passportCall("jwt"), userAuthorizations, cartsController.updateProductQuantityFromCart);

router.delete("/:cid", passportCall("jwt"), userAuthorizations, cartsController.resetCart);

export default router;
