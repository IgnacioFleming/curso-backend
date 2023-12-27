import { Router } from "express";
import { passportCall } from "../utils.js";
import viewsController from "../controllers/views.js";
import { applyPolicy } from "../middlewares/policies/policies.js";

const router = Router();

router.get("/", passportCall("jwt"), viewsController.renderHome);
router.get("/realTimeProducts", passportCall("jwt"), viewsController.renderRealTimeProducts);
router.get("/chat", passportCall("jwt"), applyPolicy(["USUARIO"]), viewsController.renderChat);
router.get("/products", passportCall("jwt"), viewsController.renderProducts);
router.get("/products/:pid", passportCall("jwt"), viewsController.renderProductDetail);
router.get("/carts/:cid", passportCall("jwt"), viewsController.renderCart);
router.get("/register", viewsController.renderRegister);
router.get("/login", viewsController.renderLogin);
router.get("/profile", passportCall("jwt"), viewsController.renderProfile);
router.get("/forgottenPass", viewsController.renderForgottenPass);
router.get("/restorePass/:token", passportCall("restorePass"), viewsController.restorePass);
router.get("/users", passportCall("jwt"), applyPolicy(["ADMIN"]), viewsController.userHandler);
router.get("/tickets", passportCall("jwt"), applyPolicy(["ADMIN"]), viewsController.getTickets);

export default router;
