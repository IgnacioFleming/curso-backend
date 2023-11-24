import { Router } from "express";
import cartsController from "../controllers/carts.js";
import { passportCall } from "../utils.js";
import { applyPolicy } from "../middlewares/errors/policies/policies.js";

const router = Router();

router.post("/", cartsController.createCart);

router.get("/:cid", cartsController.getCartById);

router.post("/:cid/products/:pid", passportCall("jwt"), applyPolicy(["USUARIO", "PREMIUM"]), cartsController.addProductToCart);

router.delete("/:cid/products/:pid", passportCall("jwt"), applyPolicy(["USUARIO", "PREMIUM"]), cartsController.deleteProductFromCart);

router.put("/:cid", passportCall("jwt"), applyPolicy(["USUARIO", "PREMIUM"]), cartsController.updateProductsOfCart);

router.put("/:cid/products/:pid", passportCall("jwt"), applyPolicy(["USUARIO", "PREMIUM"]), cartsController.updateProductQuantityFromCart);

router.delete("/:cid", passportCall("jwt"), applyPolicy(["USUARIO", "PREMIUM"]), cartsController.resetCart);

router.post("/:cid/purchase", cartsController.confirmPurchase);

export default router;
