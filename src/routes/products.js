import { Router } from "express";
import { passportCall, uploader } from "../utils.js";
import productsController from "../controllers/products.js";
import { applyPolicy } from "../middlewares/policies/policies.js";

const router = Router();

router.get("/", passportCall("jwt"), applyPolicy(["PUBLIC"]), productsController.getProducts);

router.get("/mockingproducts", productsController.mockingProducts);

router.get("/:pid", passportCall("jwt"), applyPolicy(["PUBLIC"]), productsController.getProductById);

router.post("/", passportCall("jwt"), applyPolicy(["ADMIN", "PREMIUM"]), uploader.single("thumbnails"), productsController.addProduct);

router.put("/:pid", passportCall("jwt"), applyPolicy(["ADMIN", "PREMIUM"]), productsController.updateProduct);

router.delete("/:pid", passportCall("jwt"), applyPolicy(["ADMIN", "PREMIUM"]), productsController.deleteProduct);

export default router;
