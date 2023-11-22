import jwt from "jsonwebtoken";
import config from "../config/config.js";
import MailingService from "../services/mails/mailingService.js";
import { userModel } from "../dao/models/user.model.js";
import { createHash, isValidPassword } from "../utils.js";

const handleLogin = async (req, res) => {
  const { user } = req;
  const token = jwt.sign(user, config.passport.jwt_secret_key, {
    expiresIn: "1h",
  });
  res.cookie("sessionCookie", token, { maxAge: 3600000, httpOnly: true });

  res.send({
    status: "success",
    description: { message: "Usuario logueado correctamente", token },
  });
};

const showCurrentUser = async (req, res) => {
  console.log(req.user);
  res.send(req.user);
};

const handleFailedLogin = async (req, res) => {
  res.send({ error: "Login Failed" });
};

const handleGithubCallback = async (req, res) => {
  const { user } = req;
  user.status = "active";
  req.session.user = user;
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

const handleLogout = (req, res) => {
  res.clearCookie("sessionCookie").redirect("/login");
};

const sendEmailToRestorePass = async (req, res) => {
  const { email } = req.params;
  console.log(email);
  const user = await userModel.findOne({ email });
  if (!user) return res.status(400).send({ status: "error", error: "No se puede restablecer un usuario no registrado" });
  const token = jwt.sign({ email }, config.passport.jwt_secret_key, { expiresIn: "1h" });
  const mailer = new MailingService();
  const message = `
  <p>Estimado Usuario,<br/><br/>
  Para dar curso al restablecimiento de su mail por favor hacer click en el siguiente boton:
  <p><br/><br/>
  <a href="http://localhost:8080/restorePass/${token}"><button>Restablecer Contraseña</button></a>
  `;
  const result = await mailer.sendSimpleMail({
    from: config.mailing.user,
    to: email,
    html: message,
  });
  console.log(result);
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
  res.send({ status: "success", payload: result });
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
