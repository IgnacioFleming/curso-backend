import { userModel } from "../dao/models/user.model.js";
import { cartsService, productsService } from "../services/index.js";
const renderHome = (req, res) => {
  res.render("home", {});
};

const renderRealTimeProducts = (req, res) => {
  res.render("realTimeProducts", { style: "realTimeProducts.css" });
};

const renderChat = (req, res) => {
  req.logger.warning("Acceso concedido a chat. Ruta privada");
  res.render("chat", {});
};

const renderProducts = async (req, res) => {
  req.logger.warning("Acceso concedido a products. Ruta privada");
  const { limit, page, sort, query } = req.query;
  const result = await productsService.getProducts(limit, page, sort, query);
  const products = result.payload.map((product) => {
    return {
      title: product.title,
      stock: product.stock,
      code: product.code,
      status: product.status,
      _id: product._id,
      price: product.price,
      category: product.category,
      isAuthorized: req.user.role === "premium" || req.user.role === "admin" ? true : false,
    };
  });

  const { first_name, last_name, role } = req.user;
  const isAdmin = role === "admin";
  const cart = req.user.cart;
  res.render("products", {
    products,
    style: "products.css",
    totalPages: result.totalPages,
    prevPage: result.prevPage,
    nextPage: result.nextPage,
    page: result.page,
    hasPrevPage: result.hasPrevPage,
    hasNextPage: result.hasNextPage,
    prevLink: result.prevLink,
    nextLink: result.nextLink,
    limit,
    sort,
    query,
    first_name,
    last_name,
    isAdmin,
    role,
    cart,
  });
};

const renderProductDetail = async (req, res) => {
  const { pid } = req.params;
  const product = await productsService.getProductById(pid);
  const { title, description, price, category, code, stock, status, _id } = product.payload;
  res.render("productDetail", {
    title,
    description,
    price,
    category,
    code,
    stock,
    status,
    _id,
    style: "productDetail.css",
    cart: req.user.cart,
  });
};

const renderCart = async (req, res) => {
  const { cid } = req.params;
  const result = await cartsService.getCartById(cid);
  const products = result.payload.products.map((element) => {
    return {
      product: element.product.title,
      price: element.product.price,
      code: element.product.code,
      quantity: element.quantity,
    };
  });
  const totalValue = products.reduce((acc, value) => acc + value.price * value.quantity, 0);
  res.render("cart", { style: "cart.css", products, totalValue });
};

const renderRegister = (req, res) => {
  res.render("register");
};

const renderLogin = (req, res) => {
  res.render("login");
};

const renderProfile = async (req, res) => {
  req.logger.warning("Acceso concedido a profile. Ruta privada");
  const user = req.session.user;
  res.render("profile", user);
};

const renderForgottenPass = async (req, res) => {
  res.render("forgottenPass");
};

const restorePass = async (req, res) => {
  const { email } = req.user;
  res.render("restorePass", { email });
};

const userHandler = async (req, res) => {
  const users = await userModel.find().lean();
  res.render("users", {
    users,
    style: "users.css",
    delete: async (id) => {
      await userModel.findByIdAndDelete(id);
    },
  });
};

export default {
  renderCart,
  renderChat,
  renderHome,
  renderLogin,
  renderProductDetail,
  renderProducts,
  renderProfile,
  renderRealTimeProducts,
  renderRealTimeProducts,
  renderRegister,
  renderForgottenPass,
  restorePass,
  userHandler,
};
