import mongoose from "mongoose";

const productCollection = "products";

const productSchema = new mongoose.Schema({
  title: String,
  description: String,
  price: Number,
  category: String,
  code: String,
  stock: Number,
  status: Boolean,
  thumbnails: Array,
});

export const productModel = mongoose.model(productCollection, productSchema);
