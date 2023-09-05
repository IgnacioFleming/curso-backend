import { cartModel } from "../../models/cart.model.js";
import ProductManager from "./productManager.mongoDB.js";

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
      if (isNaN(cartId)) {
        return {
          status: "error",
          description: "El id provisto debe ser un numero",
        };
      }
      const cart = await cartModel.findOne({ _id: cartId });
      return { status: "success", payload: cart };
    } catch (error) {
      throw new Error(error);
    }
  };

  addProductToCart = async (cartId, productId) => {
    try {
      if (isNaN(cartId)) {
        return {
          status: "error",
          description: "El id del carrito debe ser un numero",
        };
      }
      if (isNaN(productId)) {
        return {
          status: "error",
          description: "El id del producto debe ser un numero",
        };
      }
      const PM = new ProductManager();
      const product = await PM.getProductById(productId);
      if (product.status === "error") {
        return {
          status: "error",
          description:
            "El id provisto no corresponde a un carrito existente en la base de datos",
        };
      }
      const cart = await cartModel.findOne({ _id: cartId });
      cart.products.push(product);
      const updatedCart = await cartModel.updateOne({ _id: cartId, cart });
      return { status: "success", payload: updatedCart };
    } catch (error) {
      throw new Error(error);
    }
  };
}

export default CartManager;
