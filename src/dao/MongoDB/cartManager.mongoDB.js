import { cartModel } from "../models/cart.model.js";
import { productModel } from "../models/product.model.js";
import { ticketModel } from "../models/ticket.model.js";
import mongoose from "mongoose";

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
      const product = await productModel.findById(productId);
      if (!product) {
        return {
          status: "error",
          description: "El id provisto no corresponde a un producto existente en la base de datos",
        };
      }
      const cart = await cartModel.findOne({ _id: cartId });
      const productIndex = cart.products.findIndex((e) => e.product.toString() === productId);
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
      const product = await productModel.findById(productId);
      if (!product) {
        return {
          status: "error",
          description: "El id provisto no corresponde a un producto existente en la base de datos",
        };
      }
      const cart = await cartModel.findOne({ _id: cartId });
      const productIndex = cart.products.findIndex((e) => e.product.toString() === productId);
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
      const productIndex = cart.products.findIndex((e) => e.product.toString() === productId);
      if (productIndex === -1) {
        return {
          status: "error",
          description: "El producto a modificar no existe en el carrito",
        };
      }
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

  confirmPurchase = async (cartId, purchaser) => {
    const { payload: cart } = await this.getCartById(cartId);
    if (!cart) return { status: "error", description: "Hay un error en el ID provisto" };
    let amount = 0;
    const remainingCart = [];
    await Promise.all(
      cart.products.map(async (e) => {
        if (e.quantity <= e.product.stock) {
          amount += e.quantity * e.product.price;
          e.product.stock -= e.quantity;
          const result = await productModel.updateOne({ _id: e.product._id.toString() }, e.product);
          return;
        } else {
          remainingCart.push(e);
          return;
        }
      })
    );
    const newTicket = {
      code: new mongoose.Types.ObjectId(),
      purchase_datetime: new Date().toString(),
      amount,
      purchaser,
    };
    const result = await ticketModel.create(newTicket);
    await this.updateProductsOfCart(cartId, remainingCart);
    const productsNotProcessedCodes = remainingCart.length !== 0 && remainingCart.map((e) => e.product.code);
    if (newTicket.amount === 0) return { status: "error", description: "No se confirmó ningun producto por falta de stock" };
    return { status: "success", payload: { result, productsNotProcessedCodes } };
  };
}

export default CartManager;
