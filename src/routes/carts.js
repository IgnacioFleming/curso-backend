import { Router } from "express";
import cartsController from "../controllers/carts.js";
import { passportCall } from "../middlewares/auth/passportCall.js";
import { applyPolicy } from "../middlewares/policies/policies.js";

const router = Router();

router.use(passportCall("jwt"));

router.post("/", applyPolicy(["PUBLIC"]), cartsController.createCart);

router.get("/:cid", applyPolicy(["PUBLIC"]), cartsController.getCartById);

router.delete("/:cid", applyPolicy(["USUARIO", "PREMIUM"]), cartsController.resetCart);

router.put("/:cid", applyPolicy(["USUARIO", "PREMIUM"]), cartsController.updateProductsOfCart);

router.post("/:cid/products/:pid", applyPolicy(["USUARIO", "PREMIUM"]), cartsController.addProductToCart);

router.delete("/:cid/products/:pid", applyPolicy(["USUARIO", "PREMIUM"]), cartsController.deleteProductFromCart);

router.put("/:cid/products/:pid", applyPolicy(["USUARIO", "PREMIUM"]), cartsController.updateProductQuantityFromCart);

router.post("/:cid/purchase", applyPolicy(["USUARIO", "PREMIUM"]), cartsController.confirmPurchase);

export default router;
