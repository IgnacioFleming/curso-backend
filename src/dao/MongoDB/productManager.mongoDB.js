import { productModel } from "../../dao/models/product.model.js";
class ProductManager {
  constructor() {}
  async getProducts(limit = 10, queryPage = 1, sort, query) {
    try {
      if (isNaN(limit) || limit <= 0) {
        return {
          status: "error",
          description: "El limite debe ser un número positivo",
        };
      }
      if (!query) {
        query = {};
      } else {
        query = JSON.parse(query);
      }
      if (!("category" in query || "status" in query)) {
        return {
          status: "error",
          description:
            "El parametro query debe ser un objeto en formato json con una clave category o status y un valor a buscar",
        };
      }
      const options = { limit, queryPage };
      sort && (options.sort = { price: sort });
      const {
        docs,
        totalPages,
        page,
        prevPage,
        nextPage,
        hasPrevPage,
        hasNextPage,
      } = await productModel.paginate(query, options);
      let prevLink;
      if (hasPrevPage) {
        prevLink = `/api/products?limit=${limit}&page=${prevPage}&sort=${sort}&query=${query}`;
      } else {
        prevLink = null;
      }
      let nextLink;
      if (hasNextPage) {
        nextLink = `/api/products?limit=${limit}&page=${nextPage}&sort=${sort}&query=${query}`;
      } else {
        nextLink = null;
      }
      return {
        status: "success",
        payload: docs,
        totalPages,
        prevPage,
        nextPage,
        page,
        hasPrevPage,
        hasNextPage,
        prevLink,
        nextLink,
      };
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
