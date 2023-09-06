import { Router } from "express";

const router = Router();

router.get("/", (req, res) => {
  res.render("home", {});
});

router.get("/realTimeProducts", (req, res) => {
  res.render("realTimeProducts", { style: "realTimeProducts.css" });
});

router.get("/chat", (req, res) => {
  res.render("chat", {});
});

export default router;
