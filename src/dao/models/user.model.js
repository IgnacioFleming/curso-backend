import mongoose from "mongoose";

const userCollection = "users";

const userSchema = new mongoose.Schema({
  first_name: String,
  last_name: String,
  email: {
    type: String,
    unique: true,
  },
  age: Number,
  password: String,
  cart: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "carts",
  },
  role: String,
  documents: {
    type: [
      {
        name: String,
        reference: String,
      },
    ],
    default: [],
  },
  last_connection: String,
});

export const userModel = mongoose.model(userCollection, userSchema);
