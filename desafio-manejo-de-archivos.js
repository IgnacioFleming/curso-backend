//Desafío Manejo de Archivos

const fs = require("fs");

class ProductManager {
  constructor(path) {
    this.path = path;
  }
  async getProducts() {
    
    if(fs.existsSync(this.path)){
      const result = await fs.promises.readFile(this.path, "utf-8");
      const resultArray = JSON.parse(result);
      console.log(resultArray)
      return resultArray;
    } else{
      await fs.promises.writeFile(this.path, "[]")
      console.log([])
      return [];
    }
  }
  async addProduct({ title, description, price, thumbnail, code, stock }) {
    const products = await fs.promises.readFile(this.path, "utf-8");
    const parsedProducts = JSON.parse(products)
    const newproduct = {
      title,
      description,
      price,
      thumbnail,
      code,
      stock,
    };

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
  }


  async getProductById(productId) {

    const products = await fs.promises.readFile(this.path, "utf-8");
    const productsParsed = JSON.parse(products);

    const productFound = productsParsed.find(
      (element) => element.id === productId
    );
    console.log(productFound || "Not Found")
    return productFound || "Not Found";
  }

  async updateProduct(productId, object) {
    const products = await fs.promises.readFile(this.path, "utf-8");
    const productsParsed = JSON.parse(products);
    if(productsParsed.length === 0){
      return;
    }
    const index = productsParsed.findIndex((e) => e.id === productId);
    const productFound = productsParsed.find(
      (element) => element.id === productId
    );
    productsParsed.splice(index ,1 ,{...productFound,...object});
    await fs.promises.writeFile(this.path, JSON.stringify(productsParsed));
  }

  async deleteProduct(productId) {
    const products = await fs.promises.readFile(this.path, "utf-8");
    const productsParsed = JSON.parse(products);
    console.log("estos son los productsParsed", productsParsed)
    const index = productsParsed.findIndex((e) => e.id === productId);
    console.log("este es el index", index)
    if (index === -1) {
      return console.log("El id no correpsonde a un producto");
    }
    productsParsed.splice(index, 1);
    console.log("este es el productParsed deleted", productsParsed)
    await fs.promises.writeFile(this.path, JSON.stringify(productsParsed));
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
// //Traemos la info del archivo con el producto agregado
PM1.getProducts();
// //Volvemos a traer el producto como objeto
PM1.getProductById(1);
// // //Testeamos probar con un id inexistente, devuelve Not Found
PM1.getProductById(2);
// // //Modificamos el producto sin cambiar su id
PM1.updateProduct(1, { price: 500 });
// // //Traemos el producto modificado
PM1.getProducts();
// // //Testeamos borrar un producto usando id inexistente con lo cual tira un error por consola.
// PM1.deleteProduct(2);
// // //Borramos el producto existente.
PM1.deleteProduct(1);
