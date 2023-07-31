//Desafío Clases con ECMAScript y ECMAScript avanzado

const fs = require("fs");

class ProductManager {
  constructor(path) {
    this.products = [];
    this.path = path;
  }
  addProduct({ title, description, price, thumbnail, code, stock }) {
    const newproduct = {
      title,
      description,
      price,
      thumbnail,
      code,
      stock,
    };

    for (const product of this.products) {
      if (product.code === code) {
        console.log(
          `El codigo del producto ${newproduct.title} ya existe en la base, por favor corregir`
        );
        return;
      }
    }

    newproduct.id =
      this.products.length === 0
        ? 1
        : this.products[this.products.length - 1].id + 1;
    this.products.push(newproduct);
    this.writeNewProduct();
  }

  async writeNewProduct() {
    fs.promises.writeFile(this.path, JSON.stringify(this.products));
  }

  async getProducts() {
    const result = await fs.promises.readFile(this.path, "utf-8");
    const resultArray = JSON.parse(result);
    return resultArray;
  }

  async getProductById(productId) {
    const arrayProducts = await fs.promises.readFile(this.path, "utf-8");
    const arrayProductsParsed = await JSON.parse(arrayProducts);

    const productFound = arrayProductsParsed.find(
      (element) => element.id === productId
    );
    console.log(productFound) || "Not Found";
    return productFound || "Not Found";
  }

  async updateProduct(productId, object) {
    const arrayProducts = await fs.promises.readFile(this.path, "utf-8");
    const arrayProductsParsed = await JSON.parse(arrayProducts);
    const productFound = arrayProductsParsed.find(
      (element) => element.id === productId
    );
    const productFoundIndex = arrayProductsParsed.indexOf(productFound);
  }
}

//Testing Entregable

const PM1 = new ProductManager("./productos.txt");

const product1 = {
  title: "producto prueba",
  description: "Este es un producto prueba",
  price: 200,
  thumbnail: "sin imagen",
  code: "abc123",
  stock: 25,
};

PM1.addProduct(product1);
const showProducts = async (instance) => {
  console.log(await instance.getProducts());
};

// showProducts(PM1);

PM1.getProductById(1);
