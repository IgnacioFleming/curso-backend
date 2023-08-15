import fs from "fs";

class CartManager {
  constructor(path, productsFile) {
    this.path = path;
    this.file = productsFile;
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

  getCartById = async (cartId) => {
    const carts = await fs.promises.readFile(this.path, "utf-8");
    if (isNaN(cartId) || cartId < 0 || cartId > carts.length) {
      return { status: "error", description: "El id provisto es invalido" };
    }
    const parsedCarts = JSON.parse(carts);
    const cartFound = parsedCarts.find((cart) => cart.id === cartId);
    if (!cartFound) {
      return {
        status: "error",
        description:
          "El id provisto no corresponde a un carrito existente en la base de datos",
      };
    }
    return { status: "success", description: cartFound };
  };

  addProductToCart = async (cartId, productId) => {
    if (isNaN(productId)) {
      return { status: "error", description: "El id provisto es invalido" };
    }
    c;
    const cart = this.getCartById(cartId).then(({ status, description }) => {
      if (status === "error") {
        return undefined;
      }
      return cart.description;
    });
    const products = await fs.promises.readFile(this.file, "utf-8");
    const parsedProducts = JSON.parse(products);
    const productFound = parsedProducts.find(
      (product) => product.id === productId
    );
    if (!productFound) {
      return {
        status: "error",
        description: `El id provisto no corresponde a un producto existente en el archivo ${this.file}`,
      };
    }
  };
}

export default CartManager;
