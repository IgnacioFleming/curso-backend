import jwt from "jsonwebtoken";
const handleLogin = async (req, res) => {
  const { user } = req;
  const token = jwt.sign(user, "JWTSecretKey", {
    expiresIn: "1h",
  });
  res.cookie("sessionCookie", token, { maxAge: 3600000, httpOnly: true });

  res.send({
    status: "success",
    description: "Usuario logueado correctamente",
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

export default {
  handleFailedLogin,
  handleFailedRegister,
  handleGithubCallback,
  handleLogin,
  handleLogout,
  handleRegister,
  showCurrentUser,
};
