import fs from "fs";
import ProductManager from "./productManager.js";

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
    if (isNaN(cartId)) {
      return {
        status: "error",
        description: "El id provisto debe ser un numero",
      };
    }

    const carts = await fs.promises.readFile(this.path, "utf-8");
    if (cartId < 0 || cartId > carts.length) {
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
    const PM = new ProductManager("products.json");
    const cart = await this.getCartById(cartId).then(
      ({ status, description }) => {
        if (status === "error") {
          return null;
        }
        return description;
      }
    );
    if (!cart) {
      return {
        status: "error",
        description: `El id provisto no corresponde a un carrito existente en el archivo ${this.path}`,
      };
    }

    const carts = await fs.promises.readFile(this.path, "utf-8");
    const parsedCarts = JSON.parse(carts);
    const cartIndex = parsedCarts.findIndex((e) => e.id === cartId);

    if (cartIndex === -1) {
      return {
        status: "error",
        description: `El id provisto no corresponde a un carrito existente en el archivo ${this.path}`,
      };
    }

    const product = await PM.getProductById(productId);

    if (product === "Not Found") {
      return {
        status: "error",
        description: `El id provisto no corresponde a un producto existente en el archivo ${this.file}`,
      };
    }
    const productsOfCart = parsedCarts[cartIndex].products;
    const productValidation = productsOfCart.findIndex(
      (e) => e.product === productId
    );
    if (productValidation === -1) {
      productsOfCart.push({ product: productId, quantity: 1 });
    } else {
      productsOfCart[productValidation].quantity += 1;
    }
    await fs.promises.writeFile(this.path, JSON.stringify(parsedCarts));
    return {
      status: "success",
      description: `El producto con id ${productId} fue agregado exitosamente al carrito id ${cartId}`,
    };
  };
}

export default CartManager;
