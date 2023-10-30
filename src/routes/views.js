import { Router } from "express";
import ProductManager from "../dao/MongoDB/productManager.mongoDB.js";
import CartManager from "../dao/MongoDB/cartManager.mongoDB.js";
import { passportCall, userAuthorizations } from "../utils.js";
import viewsController from "../controllers/views.js";

const router = Router();

router.get("/", passportCall("jwt"), viewsController.renderHome);
router.get("/realTimeProducts", passportCall("jwt"), viewsController.renderRealTimeProducts);
router.get("/chat", passportCall("jwt"), userAuthorizations, viewsController.renderChat);
router.get("/products", passportCall("jwt"), viewsController.renderProducts);
router.get("/products/:pid", passportCall("jwt"), viewsController.renderProductDetail);
router.get("/carts/:cid", passportCall("jwt"), viewsController.renderCart);
router.get("/register", viewsController.renderRegister);
router.get("/login", viewsController.renderLogin);
router.get("/profile", passportCall("jwt"), viewsController.renderProfile);

export default router;
