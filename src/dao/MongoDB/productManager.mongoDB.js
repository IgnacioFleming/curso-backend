import { productModel } from "../../models/product.model.js";
class ProductManager {
  constructor() {}
  async getProducts() {
    try {
      const products = await productModel.find();
      return { status: "success", payload: products };
    } catch (error) {
      throw new Error(error);
    }
  }

  async addProduct(newproduct) {
    try {
      const addedProduct = await productModel.create(newproduct);
      return { status: "success", payload: addedProduct };
    } catch (error) {
      throw new Error(error);
    }
  }

  async getProductById(productId) {
    try {
      if (isNaN(productId)) {
        return { status: "error", description: "El id debe ser un numero" };
      }
      const product = await productModel.findOne({ _id: productId });
      return { status: "success", payload: product };
    } catch (error) {
      throw new Error(error);
    }
  }

  async updateProduct(productId, object) {
    try {
      if (isNaN(productId)) {
        return { status: "error", description: "El id debe ser un numero" };
      }

      const updatedProduct = await productModel.updateOne(
        { _id: productId },
        object
      );
      return { status: "success", payload: updatedProduct };
    } catch (error) {
      throw new Error(error);
    }
  }

  async deleteProduct(productId) {
    try {
      if (isNaN(productId)) {
        return { status: "error", description: "El id debe ser un numero" };
      }

      const deletedProduct = await productModel.deleteOne({ _id: productId });
      return { status: "success", payload: deletedProduct };
    } catch (error) {
      throw new Error(error);
    }
  }
}

export default ProductManager;
