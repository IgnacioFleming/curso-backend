import { productModel } from "../../dao/models/product.model.js";
class ProductManager {
  constructor() {}
  async getProducts(limit = 10, page = 1, sort, query = {}) {
    try {
      if (isNaN(limit) || limit <= 0) {
        return {
          status: "error",
          description: "El limite debe ser un número positivo",
        };
      }
      if (query) {
        query = JSON.parse(query);
      }
      if (typeof query !== "object") {
        return {
          status: "error",
          description:
            "El parametro query debe ser un objeto en formato json con una clave correspondiente al campo y un valor a buscar",
        };
      }
      const options = { limit, page };
      sort && (options.sort = { price: sort });
      const { docs } = await productModel.paginate(query, options);
      return { status: "success", payload: docs };
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
      const product = await productModel.findOne({ _id: productId });
      return { status: "success", payload: product };
    } catch (error) {
      throw new Error(error);
    }
  }

  async updateProduct(productId, object) {
    try {
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
      const deletedProduct = await productModel.deleteOne({ _id: productId });
      return { status: "success", payload: deletedProduct };
    } catch (error) {
      throw new Error(error);
    }
  }
}

export default ProductManager;
