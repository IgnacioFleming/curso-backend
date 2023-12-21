export default class ProductsRepository {
  constructor(dao) {
    this.dao = dao;
  }
  async getProducts(limit = 10, queryPage = 1, sort, query) {
    try {
      const result = await this.dao.getProducts(limit, queryPage, sort, query);
      return result;
    } catch (error) {
      throw new Error(error);
    }
  }
  async getProductById(id) {
    try {
      const result = await this.dao.getProductById(id);
      return result;
    } catch (error) {
      throw new Error(error);
    }
  }
  async addProduct(product) {
    try {
      const result = await this.dao.addProduct(product);
      return result;
    } catch (error) {
      throw new Error(error);
    }
  }
  async updateProduct(id, product) {
    try {
      const result = await this.dao.updateProduct(id, product);
      return result;
    } catch (error) {
      throw new Error(error);
    }
  }
  async deleteProduct(id) {
    try {
      const result = await this.dao.deleteProduct(id);
      return result;
    } catch (error) {
      throw new Error(error);
    }
  }
}
