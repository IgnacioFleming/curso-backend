import { Router } from "express";
import jwt from "jsonwebtoken";
import passport from "passport";
import { passportCall } from "../utils.js";

const router = Router();

router.post(
  "/login",
  passportCall("login", "/api/sessions/failedLogin"),
  async (req, res) => {
    const { user } = req;
    const token = jwt.sign(user, "JWTSecretKey", {
      session: false,
      expiresIn: "1h",
    });
    res.cookie("sessionCookie", token, { maxAge: 3600000 });

    res.send({
      status: "success",
      description: "Usuario logueado correctamente",
    });
  }
);

router.get("/failedLogin", async (req, res) => {
  res.send({ error: "Login Failed" });
});

router.get(
  "/github",
  passport.authenticate("github", { scope: ["user:email"] }),
  async (req, res) => {}
);

router.get(
  "/githubCallback",
  passport.authenticate("github", { failureRedirect: "/api/sessions/login" }),
  async (req, res) => {
    const { user } = req;
    user.status = "active";
    req.session.user = user;
    res.redirect("/products");
  }
);

router.post(
  "/register",
  passport.authenticate("register", {
    failureRedirect: "/api/sessions/failedRegister",
  }),
  async (req, res) => {
    res.send({
      status: "success",
      description: "Usuario registrado correctamente",
    });
  }
);

router.get("/failedRegister", async (req, res) => {
  res.send({ error: "Register Failed" });
});

router.get("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/login");
});

export default router;
