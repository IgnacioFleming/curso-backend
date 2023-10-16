import { Router } from "express";
import ProductManager from "../dao/MongoDB/productManager.mongoDB.js";
import { uploader } from "../utils.js";
import productsController from "../controllers/products.js";

const router = Router();

router.get("/", productsController.getProducts);

router.get("/:pid", productsController.getProductById);

router.post("/", uploader.single("thumbnails"), productsController.addProduct);

router.put("/:pid", productsController.updateProduct);

router.delete("/:pid", productsController.deleteProduct);

export default router;
