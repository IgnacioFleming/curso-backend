export default class CartsRepository {
  constructor(dao) {
    this.dao = dao;
  }
  async createCart() {
    try {
      const result = await this.dao.createCart();
      return result;
    } catch (error) {
      throw new Error(error);
    }
  }
  async getCartById(id) {
    try {
      const result = await this.dao.getCartById(id);
      return result;
    } catch (error) {
      throw new Error(error);
    }
  }
  async addProductToCart(cid, pid) {
    try {
      const result = await this.dao.addProductToCart(cid, pid);
      return result;
    } catch (error) {
      throw new Error(error);
    }
  }
  async deleteProductFromCart(cid, pid) {
    try {
      const result = await this.dao.deleteProductFromCart(cid, pid);
      return result;
    } catch (error) {
      throw new Error(error);
    }
  }
  async updateProductsOfCart(cid, products) {
    try {
      const result = await this.dao.updateProductsOfCart(cid, products);
      return result;
    } catch (error) {
      throw new Error(error);
    }
  }
  async updateProductOfCartQuantity(cid, pid, quantity) {
    try {
      const result = await this.dao.updateProductOfCartQuantity(cid, pid, quantity);
      return result;
    } catch (error) {
      throw new Error(error);
    }
  }
  async deleteAllProductsFromCart(cid) {
    try {
      const result = await this.dao.deleteAllProductsFromCart(cid);
      return result;
    } catch (error) {
      throw new Error(error);
    }
  }
  async confirmPurchase(cid) {
    try {
      const result = await this.dao.confirmPurchase(cid);
      return result;
    } catch (error) {
      throw new Error(error);
    }
  }
}
