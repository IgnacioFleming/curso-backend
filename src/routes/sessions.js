import { Router } from "express";
import { userModel } from "../models/user.js";

const router = Router();

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const validation = (await userModel.findOne({ email, password }))
    ? true
    : false;
  if (validation) {
    req.session.user = { email, status: "active" };
    res.send({
      status: "success",
      description: "Usuario logueado correctamente",
    });
    return;
  } else {
    res
      .status(400)
      .send({ status: "error", error: "error en el usuario o contraseña" });
  }
});

router.post("/register", async (req, res) => {
  const newUser = req.body;
  const mailValidation = (await userModel.findOne({ email: newUser.email }))
    ? true
    : false;

  if (mailValidation) {
    res.status(400).send({
      status: "error",
      error: "Ya existe un Usuario registrado con ese mail",
    });
    return;
  }
  const result = await userModel.create(newUser);
  res.send({
    status: "success",
    description: "Usuario registrado correctamente",
  });
});

router.get("/logout", (req, res) => {
  console.log("pase por aca");
  req.session.destroy();
  res.redirect("/login");
});

export default router;
