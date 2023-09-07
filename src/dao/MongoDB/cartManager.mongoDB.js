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
      const cart = await cartModel.findOne({ _id: cartId });
      return { status: "success", payload: cart };
    } catch (error) {
      throw new Error(error);
    }
  };

  addProductToCart = async (cartId, productId) => {
    try {
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
      const productIndex = cart.products.findIndex(
        (e) => e.product === productId
      );
      if (productIndex === -1) {
        cart.products.push({ product: productId, quantity: 1 });
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
}

export default CartManager;
