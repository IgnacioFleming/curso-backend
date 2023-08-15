import fs from "fs";

class CartManager {
  constructor(path) {
    this.path = path;
  }

  createCart = async () => {
    const cart = { products: [] };
    if (fs.existsSync(this.path)) {
      const data = await fs.promises.readFile(this.path, "utf-8");
      const fileProducts = JSON.parse(data);
      fileProducts.length === 0
        ? (cart.id = 1)
        : (cart.id = fileProducts[fileProducts.length - 1].id + 1);
      fileProducts.push(cart);
      await fs.promises.writeFile(this.path, JSON.stringify(fileProducts));
      return {
        status: "success",
        description: "El carrito fue creado exitosamente",
      };
    } else {
      cart.id = 1;
      await fs.promises.writeFile(this.path, JSON.stringify([cart]));
      return {
        status: "success",
        description: "El carrito fue creado exitosamente",
      };
    }
  };
}

export default CartManager;
