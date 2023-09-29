import { Router } from "express";
import { userModel } from "../models/user.model.js";
import { createHash, isValidPassword } from "../utils.js";

const router = Router();

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (email === "adminCoder@coder.com" && password === "adminCod3r123") {
    req.session.user = {
      email,
      status: "active",
      role: "admin",
      first_name: "Admin_User",
    };
    res.send({
      status: "success",
      description: "Usuario logueado correctamente",
    });
    return;
  }
  const user = await userModel.findOne({ email });
  const userValidation = user ? true : false;
  const pwdValidation = isValidPassword(password, user);
  if (userValidation && pwdValidation) {
    const { first_name, last_name, role, age, email } = user;
    req.session.user = {
      email,
      status: "active",
      role,
      first_name,
      last_name,
      age,
    };
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
  newUser.role = "usuario";

  if (mailValidation) {
    res.status(400).send({
      status: "error",
      error: "Ya existe un Usuario registrado con ese mail",
    });
    return;
  }
  newUser.password = createHash(newUser.password);
  console.log("la pass hasheada es ", newUser.password);
  const result = await userModel.create(newUser);
  res.send({
    status: "success",
    description: "Usuario registrado correctamente",
  });
});

router.get("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/login");
});

export default router;
