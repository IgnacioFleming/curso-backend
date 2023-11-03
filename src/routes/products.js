import { Router } from "express";
import { adminAuthorizations, passportCall, uploader } from "../utils.js";
import productsController from "../controllers/products.js";

const router = Router();

router.get("/", productsController.getProducts);

router.get("/:pid", productsController.getProductById);

router.post("/", passportCall("jwt"), adminAuthorizations, uploader.single("thumbnails"), productsController.addProduct);

router.put("/:pid", passportCall("jwt"), adminAuthorizations, productsController.updateProduct);

router.delete("/:pid", passportCall("jwt"), adminAuthorizations, productsController.deleteProduct);

export default router;
