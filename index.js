//Desafío Manejo de Archivos

const fs = require("fs");

class ProductManager {
  constructor(path) {
    this.products = [];
    this.path = path;
    fs.writeFileSync(this.path, JSON.stringify(this.products));
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
    fs.writeFileSync(this.path, JSON.stringify(this.products));
  }

  getProducts() {
    const result = fs.readFileSync(this.path, "utf-8");
    const resultArray = JSON.parse(result);
    return console.log(resultArray);
  }

  getProductById(productId) {
    const arrayProducts = fs.readFileSync(this.path, "utf-8");
    const arrayProductsParsed = JSON.parse(arrayProducts);

    const productFound = arrayProductsParsed.find(
      (element) => element.id === productId
    );
    return console.log(productFound || "Not Found");
  }

  updateProduct(productId, object) {
    const arrayProducts = fs.readFileSync(this.path, "utf-8");
    const arrayProductsParsed = JSON.parse(arrayProducts);
    const productFound = arrayProductsParsed.find(
      (element) => element.id === productId
    );
    const index = arrayProductsParsed.findIndex((e) => e.id === productId);
    this.products.splice(index, 1, { ...productFound, ...object });
    fs.writeFileSync(this.path, JSON.stringify(this.products));
  }

  deleteProduct(productId) {
    const arrayProducts = fs.readFileSync(this.path, "utf-8");
    const arrayProductsParsed = JSON.parse(arrayProducts);
    const index = arrayProductsParsed.findIndex((e) => e.id === productId);
    if (index === -1) {
      return console.log("El id no correpsonde a un producto");
    }
    this.products.splice(index, 1);
    fs.writeFileSync(this.path, JSON.stringify(this.products));
  }
}

//Testing Entregable

// Instancio la clase y se crea el archivo con un array vacio
const PM1 = new ProductManager("./productos.txt");
//Traemos por consola el array vacio del archivo
PM1.getProducts();
//Agrego un producto
PM1.addProduct({
  title: "producto prueba",
  description: "este es un producto prueba",
  price: 200,
  thumbnail: "sin imagen",
  code: "abc123",
  stock: 25,
});
//Traemos la info del archivo con el producto agregado
PM1.getProducts();
//Volvemos a traer el producto como objeto
PM1.getProductById(1);
//Testeamos probar con un id inexistente, devuelve Not Found
PM1.getProductById(2);
//Modificamos el producto sin cambiar su id
PM1.updateProduct(1, { price: 500 });
//Traemos el producto modificado
PM1.getProducts();
//Testeamos borrar un producto usando id inexistente con lo cual tira un error por consola.
PM1.deleteProduct(2);
//Borramos el producto existente.
PM1.deleteProduct(1);
