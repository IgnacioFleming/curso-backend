import { Router } from "express";
import ProductManager from "../dao/MongoDB/productManager.mongoDB.js";

const router = Router();
const PM = new ProductManager();

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
  console.log(result.nextLink);
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
router.get("/product", async (req, res) => {
  const { pid } = req.query;
  console.log(pid);
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

export default router;
