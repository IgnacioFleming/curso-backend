//Desafío Manejo de Archivos
import fs from "fs";
class ProductManager {
  constructor(path) {
    this.path = path;
  }
  async getProducts() {
    if (fs.existsSync(this.path)) {
      const result = await fs.promises.readFile(this.path, "utf-8");
      const resultArray = JSON.parse(result);
      return resultArray;
    } else {
      return [];
    }
  }
  async addProduct(newproduct) {
    if (fs.existsSync(this.path)) {
      const products = await fs.promises.readFile(this.path, "utf-8");
      const parsedProducts = JSON.parse(products);

      for (const product of parsedProducts) {
        if (product.code === newproduct.code) {
          return {
            status: "error",
            description: `El codigo del producto ${newproduct.title} ya existe en la base, por favor corregir`,
          };
        }
      }
      newproduct.id =
        parsedProducts.length === 0
          ? 1
          : parsedProducts[parsedProducts.length - 1].id + 1;
      parsedProducts.push(newproduct);
      await fs.promises.writeFile(this.path, JSON.stringify(parsedProducts));
    } else {
      newproduct.id = 1;
      await fs.promises.writeFile(this.path, JSON.stringify([newproduct]));
    }
    return { status: "success", description: "Producto agregado exitosamente" };
  }

  async getProductById(productId) {
    if (!fs.existsSync(this.path)) {
      return "Not Found";
    }
    const products = await fs.promises.readFile(this.path, "utf-8");
    const productsParsed = JSON.parse(products);
    const productFound = productsParsed.find(
      (element) => element.id === productId
    );
    return productFound || "Not Found";
  }

  async updateProduct(productId, object) {
    const products = await fs.promises.readFile(this.path, "utf-8");
    const productsParsed = JSON.parse(products);
    if (productsParsed.length === 0) {
      return {
        status: "error",
        description: "El producto a modificar no existe en la base",
      };
    }
    const index = productsParsed.findIndex((e) => e.id === productId);
    const productFound = productsParsed.find(
      (element) => element.id === productId
    );
    if (!productFound) {
      return {
        status: "error",
        description: "El producto a modificar no existe en la base",
      };
    }
    productsParsed.splice(index, 1, {
      ...productFound,
      ...object,
      id: productFound.id,
    });
    await fs.promises.writeFile(this.path, JSON.stringify(productsParsed));
    return {
      status: "success",
      description: "Producto modificado exitosamente",
    };
  }

  async deleteProduct(productId) {
    const products = await fs.promises.readFile(this.path, "utf-8");
    const productsParsed = JSON.parse(products);
    const index = productsParsed.findIndex((e) => e.id === productId);

    if (index === -1) {
      return {
        status: "error",
        description: "El producto a modificar no existe en la base",
      };
    }
    productsParsed.splice(index, 1);

    await fs.promises.writeFile(this.path, JSON.stringify(productsParsed));
    return {
      status: "success",
      description: "Producto eliminado exitosamente",
    };
  }
}

export default ProductManager;
