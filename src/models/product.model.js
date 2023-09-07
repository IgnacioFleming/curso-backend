import mongoose from "mongoose";

const productCollection = "products";

const productSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, required: true },
  code: { type: String, required: true, unique: true },
  stock: { type: Number, required: true },
  status: { type: Boolean, required: true, default: true },
  thumbnails: Array,
});

export const productModel = mongoose.model(productCollection, productSchema);
