import { productModel } from "./src/dao/models/product.model.js";
import mongoose from "mongoose";
import { products } from "./productsSample.js";

mongoose.connect(
  "mongodb+srv://ifleming816:Ricardo55,.@codercluster.zf1jrhg.mongodb.net/ecommerce"
);
const loadProducts = async () => {
  const result = await productModel.insertMany(products);
  console.log(result);
  process.exit();
};

loadProducts();
