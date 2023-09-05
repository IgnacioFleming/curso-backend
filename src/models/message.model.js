import mongoose from "mongoose";

const messageCollection = "carts";

const messageSchema = new mongoose.Schema({
  user: String,
  message: String,
});

export const messageModel = mongoose.model(messageCollection, messageSchema);
