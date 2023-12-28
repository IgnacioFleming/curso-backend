import jwt from "jsonwebtoken";
import { mailingService } from "../services/index.js";
import { userModel } from "../dao/models/user.model.js";
import { createHash, isValidPassword } from "../utils.js";

const handleLogin = async (req, res) => {
  const { user } = req;
  const token = jwt.sign(user, process.env.JWT_SECRET_KEY, {
    expiresIn: "1h",
  });
  res.cookie("sessionCookie", token, { maxAge: 3600000, httpOnly: true });

  res.send({
    status: "success",
    description: { message: "Usuario logueado correctamente", token },
  });
};

const showCurrentUser = async (req, res) => {
  res.send(req.user);
};

const handleFailedLogin = async (req, res) => {
  res.send({ error: "Login Failed" });
};

const handleGithubCallback = async (req, res) => {
  const { user } = req;
  const plainUser = user.toObject();

  const token = jwt.sign(plainUser, process.env.JWT_SECRET_KEY, {
    expiresIn: "1h",
  });
  res.cookie("sessionCookie", token, { maxAge: 3600000, httpOnly: true });

  res.redirect("/products");
};

const handleRegister = async (req, res) => {
  res.send({
    status: "success",
    description: "Usuario registrado correctamente",
  });
};

const handleFailedRegister = async (req, res) => {
  res.send({ error: "Register Failed" });
};

const handleLogout = async (req, res) => {
  const user = await userModel.updateOne({ email: req.user.email }, { $set: { last_connection: Date() } });
  res.clearCookie("sessionCookie").redirect("/login");
};

const sendEmailToRestorePass = async (req, res) => {
  const { email } = req.params;
  const user = await userModel.findOne({ email });
  if (!user) return res.status(400).send({ status: "error", error: "No se puede restablecer un usuario no registrado" });
  const token = jwt.sign({ email }, process.env.JWT_SECRET_KEY, { expiresIn: "1h" });
  const message = `
  <p>Estimado Usuario,<br/><br/>
  Para dar curso al restablecimiento de su mail por favor hacer click en el siguiente boton:
  <p><br/><br/>
  <a href="http://localhost:8080/restorePass/${token}"><button>Restablecer Contraseña</button></a>
  `;
  const result = await mailingService.sendSimpleMail({
    from: process.env.USER,
    subject: "Restablece tu contraseña",
    to: email,
    html: message,
  });
  res.send({ status: "success", payload: message });
};

const restorePass = async (req, res) => {
  if (!req.user) return res.status(400).send({ status: "error", error: "Solicitud inválida, token de autenticacion faltante." });
  const { email } = req.user;
  const user = await userModel.findOne({ email }).lean();
  if (!user) return res.status(400).send({ status: "error", error: "Correo de origen inválido" });
  const { password } = req.body;
  const validation = await isValidPassword(password, user);
  if (validation) return res.status(400).send({ status: "error", error: "La contraseña no puede ser igual a la anterior" });
  const hashedNewPass = await createHash(password);
  const updatedUser = { ...user, password: hashedNewPass };
  const result = await userModel.updateOne({ _id: updatedUser._id }, updatedUser);
  res.send({ status: "success", payload: "Se restableción con exito su contraseña" });
};

export default {
  handleFailedLogin,
  handleFailedRegister,
  handleGithubCallback,
  handleLogin,
  handleLogout,
  handleRegister,
  showCurrentUser,
  sendEmailToRestorePass,
  restorePass,
};
