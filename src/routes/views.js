import { Router } from "express";
import ProductManager from "../dao/MongoDB/productManager.mongoDB.js";
import CartManager from "../dao/MongoDB/cartManager.mongoDB.js";

const router = Router();
const PM = new ProductManager();
const CM = new CartManager();

router.get("/", (req, res) => {
  res.render("home", {});
});

router.get("/realTimeProducts", (req, res) => {
  res.render("realTimeProducts", { style: "realTimeProducts.css" });
});

router.get("/chat", (req, res) => {
  res.render("chat", {});
});

router.get("/products", async (req, res) => {
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
  });
});
router.get("/products/:pid", async (req, res) => {
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

router.get("/carts/:cid", async (req, res) => {
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

const publicRoute = (req, res, next) => {
  console.log(req.session);
  const sessionValidation = req.session.user?.status === "active";
  if (!sessionValidation) {
    return res.redirect("/login");
  }
  next();
};

const privateRoute = (req, res, next) => {
  const sessionValidation = req.session.user?.status === "active";
  if (sessionValidation) {
    return res.redirect("/profile");
  }
  next();
};

router.get("/register", privateRoute, (req, res) => {
  res.render("register");
});

router.get("/login", privateRoute, (req, res) => {
  res.render("login");
});

router.get("/profile", publicRoute, async (req, res) => {
  const user = await userModel.findOne({ email: req.session.user.email });
  const data = JSON.stringify(user);
  const userData = JSON.parse(data);
  console.log(typeof userData);
  res.render("profile", userData);
});

export default router;
