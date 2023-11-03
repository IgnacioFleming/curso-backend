import { cartModel } from "../models/cart.model.js";
import { ticketModel } from "../models/ticket.model.js";
import config from "../../config/config.js";
import mongoose from "mongoose";
let productsService;
switch (config.persistence) {
  case "MONGO":
    const { default: ProductsMongo } = await import("./productManager.mongoDB.js");
    productsService = new ProductsMongo();
    break;
  case "FILE":
    const { default: ProductsFile } = await import("../FileSystem/productManager.fs.js");
    productsService = new ProductsFile();
    break;
}
class CartManager {
  constructor() {}

  createCart = async () => {
    try {
      const cart = { products: [] };
      const createdCart = await cartModel.create(cart);
      return { status: "success", payload: createdCart };
    } catch (error) {
      throw new Error(error);
    }
  };

  getCartById = async (cartId) => {
    try {
      const cart = await cartModel.findOne({ _id: cartId }).populate("products.product");
      return { status: "success", payload: cart };
    } catch (error) {
      throw new Error(error);
    }
  };

  addProductToCart = async (cartId, productId) => {
    try {
      const product = await productsService.getProductById(productId);
      if (product.status === "error") {
        return {
          status: "error",
          description: "El id provisto no corresponde a un producto existente en la base de datos",
        };
      }
      const cart = await cartModel.findOne({ _id: cartId });
      const productIndex = cart.products.findIndex((e) => e.product.toString() === productId);
      console.log(productIndex);
      console.log(productId);
      if (productIndex === -1) {
        const newProduct = { product: productId, quantity: 1 };
        cart.products.push(newProduct);
      } else {
        cart.products[productIndex].quantity++;
      }
      const updatedCart = await cartModel.updateOne(
        {
          _id: cartId,
        },
        cart
      );
      return { status: "success", payload: updatedCart };
    } catch (error) {
      throw new Error(error);
    }
  };

  deleteProductFromCart = async (cartId, productId) => {
    try {
      const product = await productsService.getProductById(productId);
      if (product.status === "error") {
        return {
          status: "error",
          description: "El id provisto no corresponde a un producto existente en la base de datos",
        };
      }
      const cart = await cartModel.findOne({ _id: cartId });
      const productIndex = cart.products.findIndex((e) => e.product === productId);
      if (productIndex === -1) {
        return {
          status: "error",
          description: "El id provisto no corresponde a un producto existente en el carrito",
        };
      }

      let productQuantity = cart.products[productIndex].quantity;
      if (productQuantity > 1) {
        cart.products[productIndex].quantity--;
      } else {
        cart.products.splice(productIndex, 1);
      }
      const result = await cartModel.updateOne({ _id: cartId }, cart);
      return { status: "success", payload: result };
    } catch (error) {
      throw new Error(error);
    }
  };

  updateProductsOfCart = async (cartId, products) => {
    try {
      const cart = await cartModel.findOne({ _id: cartId });
      cart.products = [...products];
      const result = await cartModel.updateOne({ _id: cartId }, cart);
      return { status: "success", payload: result };
    } catch (error) {
      throw new Error(error);
    }
  };
  updateProductOfCartQuantity = async (cartId, productId, quantity) => {
    try {
      const cart = await cartModel.findOne({ _id: cartId });
      const productIndex = cart.products.findIndex((e) => e.product === productId);
      if (productIndex === -1) {
        return {
          status: "error",
          description: "El producto a modificar no existe en el carrito",
        };
      }
      console.log(cart.products);
      cart.products[productIndex].quantity = quantity.quantity;
      const result = await cartModel.updateOne({ _id: cartId }, cart);
      return { status: "success", payload: result };
    } catch (error) {
      throw new Error(error);
    }
  };
  deleteAllProductsFromCart = async (cartId) => {
    try {
      const cart = await cartModel.findOne({ _id: cartId });
      cart.products = [];
      const result = await cartModel.updateOne({ _id: cartId }, cart);
      return { status: "success", payload: result };
    } catch (error) {
      throw new Error(error);
    }
  };

  confirmPurchase = async (cartId) => {
    const { payload: cart } = await this.getCartById(cartId);
    let amount = 0;
    const remainingCart = [];
    await Promise.all(
      cart.products.map(async (e) => {
        if (e.quantity <= e.product.stock) {
          console.log("este es el id", e.product._id.toString());
          amount += e.quantity * e.product.price;
          e.product.stock -= e.quantity;
          const result = await productsService.updateProduct(e.product._id.toString(), e.product);

          console.log(result);
          return;
        } else {
          remainingCart.push(e);
          return;
        }
      })
    );
    console.log(amount);
    if (remainingCart.length !== 0) {
      const newTicket = {
        code: new mongoose.Types.ObjectId(),
        purchase_datetime: new Date().toString(),
        amount,
        purchaser: "User",
      };
      const result = await ticketModel.create(newTicket);
      await this.updateProductsOfCart(cartId, remainingCart);
      const ids = remainingCart.map((e) => e.product._id);
      return { status: "success", payload: ids };
    }
    const newTicket = {
      code: new mongoose.Types.ObjectId(),
      purchase_datetime: new Date().toString(),
      amount,
      purchaser: "User",
    };
    console.log(newTicket);
    const result = await ticketModel.create(newTicket);
    console.log("el ticket es", result);
    return { status: "success", payload: "La compra se procesó correctamente" };
  };
}

export default CartManager;
