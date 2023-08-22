import { Router } from "express";
import { uploader } from "../utils.js";
import ProductManager from "../productManager.js";

const router = Router();
const PM = new ProductManager("products.json");

router.get("/", (req, res) => {
  res.render("home", {});
});

router.get("/realTimeProducts", (req, res) => {
  res.render("realTimeProducts", { style: "realTimeProducts.css" });
});


export default router;
