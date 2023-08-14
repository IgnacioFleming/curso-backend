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
  async addProduct({ title, description, price, thumbnail, code, stock }) {
    const newproduct = {
      title,
      description,
      price,
      thumbnail,
      code,
      stock,
    };
    if (fs.existsSync(this.path)) {
      const products = await fs.promises.readFile(this.path, "utf-8");
      const parsedProducts = JSON.parse(products);

      for (const product of parsedProducts) {
        if (product.code === code) {
          console.log(
            `El codigo del producto ${newproduct.title} ya existe en la base, por favor corregir`
          );
          return;
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
  }

  async getProductById(productId) {
    const products = await fs.promises.readFile(this.path, "utf-8");
    const productsParsed = JSON.parse(products);
    const productFound = productsParsed.find(
      (element) => element.id === productId
    );
    console.log(productFound || "Not Found");
    return productFound || "Not Found";
  }

  async updateProduct(productId, object) {
    const products = await fs.promises.readFile(this.path, "utf-8");
    const productsParsed = JSON.parse(products);
    if (productsParsed.length === 0) {
      return;
    }
    const index = productsParsed.findIndex((e) => e.id === productId);
    const productFound = productsParsed.find(
      (element) => element.id === productId
    );
    productsParsed.splice(index, 1, { ...productFound, ...object });
    await fs.promises.writeFile(this.path, JSON.stringify(productsParsed));
  }

  async deleteProduct(productId) {
    const products = await fs.promises.readFile(this.path, "utf-8");
    const productsParsed = JSON.parse(products);
    console.log("estos son los productsParsed", productsParsed);
    const index = productsParsed.findIndex((e) => e.id === productId);
    console.log("este es el index", index);
    if (index === -1) {
      return console.log("El id no correpsonde a un producto");
    }
    productsParsed.splice(index, 1);
    console.log("este es el productParsed deleted", productsParsed);
    await fs.promises.writeFile(this.path, JSON.stringify(productsParsed));
  }
}

export default ProductManager;
