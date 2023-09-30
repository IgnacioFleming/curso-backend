import { Router } from "express";
import passport from "passport";

const router = Router();

router.post(
  "/login",
  passport.authenticate("login", {
    failureRedirect: "/api/sessions/failedLogin",
  }),
  async (req, res) => {
    const { user } = req;
    req.session.user = {
      email: user.email,
      status: "active",
      role: user.role,
      first_name: user.first_name,
      last_name: user.last_name,
      age: user.age,
    };
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
