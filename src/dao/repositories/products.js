export default class ProductsRepository {
  constructor(dao) {
    this.dao = dao;
  }
  async getProducts() {
    try {
      const result = await this.dao.getProducts();
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
