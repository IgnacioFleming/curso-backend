import { Router } from "express";
import cartsController from "../controllers/carts.js";
import { passportCall } from "../utils.js";
import { applyPolicy } from "../middlewares/errors/policies/policies.js";

const router = Router();

router.post("/", passportCall("jwt"), applyPolicy(["PUBLIC"]), cartsController.createCart);

router.get("/:cid", passportCall("jwt"), applyPolicy(["PUBLIC"]), cartsController.getCartById);

router.delete("/:cid", passportCall("jwt"), applyPolicy(["USUARIO", "PREMIUM"]), cartsController.resetCart);

router.put("/:cid", passportCall("jwt"), applyPolicy(["USUARIO", "PREMIUM"]), cartsController.updateProductsOfCart);

router.post("/:cid/products/:pid", passportCall("jwt"), applyPolicy(["USUARIO", "PREMIUM"]), cartsController.addProductToCart);

router.delete("/:cid/products/:pid", passportCall("jwt"), applyPolicy(["USUARIO", "PREMIUM"]), cartsController.deleteProductFromCart);

router.put("/:cid/products/:pid", passportCall("jwt"), applyPolicy(["USUARIO", "PREMIUM"]), cartsController.updateProductQuantityFromCart);

router.post("/:cid/purchase", passportCall("jwt"), applyPolicy(["USUARIO", "PREMIUM"]), cartsController.confirmPurchase);

export default router;
