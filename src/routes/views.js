import { Router } from "express";
import ProductManager from "../dao/MongoDB/productManager.mongoDB.js";
import CartManager from "../dao/MongoDB/cartManager.mongoDB.js";
import { passportCall } from "../utils.js";

const router = Router();
const PM = new ProductManager();
const CM = new CartManager();

router.get("/", passportCall("jwt"), (req, res) => {
  res.render("home", {});
});

router.get("/realTimeProducts", passportCall("jwt"), (req, res) => {
  res.render("realTimeProducts", { style: "realTimeProducts.css" });
});

router.get("/chat", passportCall("jwt"), (req, res) => {
  res.render("chat", {});
});

router.get("/products", passportCall("jwt"), async (req, res) => {
  const { limit, page, sort, query } = req.query;
  const result = await PM.getProducts(limit, page, sort, query);
  const products = result.payload.map((product) => {
    return {
      title: product.title,
      stock: product.stock,
      code: product.code,
      status: product.status,
      _id: product._id,
      price: product.price,
      category: product.category,
    };
  });

  const { first_name, last_name, role } = req.user;
  const isAdmin = role === "admin";

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
  });
});
router.get("/products/:pid", passportCall("jwt"), async (req, res) => {
  const { pid } = req.params;
  const product = await PM.getProductById(pid);
  const { title, description, price, category, code, stock, status, _id } =
    product.payload;

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
  });
});

router.get("/carts/:cid", passportCall("jwt"), async (req, res) => {
  const { cid } = req.params;
  const result = await CM.getCartById(cid);
  const products = result.payload.products.map((element) => {
    return {
      product: element.product.title,
      price: element.product.price,
      code: element.product.code,
      quantity: element.quantity,
    };
  });
  res.render("cart", { style: "cart.css", products });
});

router.get("/register", (req, res) => {
  res.render("register");
});

router.get("/login", (req, res) => {
  res.render("login");
});

router.get("/profile", passportCall("jwt"), async (req, res) => {
  const user = req.session.user;
  res.render("profile", user);
});

export default router;
