//Desafío Clases con ECMAScript y ECMAScript avanzado

class ProductManager {
  constructor() {
    this.products = [];
  }
  addProduct(title, description, price, thumbnail, code, stock) {
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
  }

  getProducts() {
    return this.products;
  }

  getProductById(productId) {
    const productFound = this.products.find(
      (element) => element.id === productId
    );
    return productFound || "Not Found";
  }
}

//Testing Entregable

const PM1 = new ProductManager();

console.log(PM1.getProducts());

PM1.addProduct(
  "producto prueba",
  "Este es un producto prueba",
  200,
  "sin imagen",
  "abc123",
  25
);

console.log(PM1.getProducts());

PM1.addProduct(
  "producto prueba",
  "Este es un producto prueba",
  200,
  "sin imagen",
  "abc123",
  25
);

console.log(PM1.getProductById(1));
console.log(PM1.getProductById(2));
