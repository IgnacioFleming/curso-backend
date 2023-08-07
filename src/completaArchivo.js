const ProductManager = require("./managerUsuarios");

const PM = new ProductManager("productos.json");

const product1 = {
  title: "computadora",
  description: "laptop lenovo nueva",
  price: 12000,
  thumbnail: "sin thumbnail",
  code: "abc123",
  stock: 20,
};

const product2 = {
  title: "teclado",
  description: "teclado nuevo con luces",
  price: 1500,
  thumbnail: "sin thumbnail",
  code: "abc1234",
  stock: 5,
};

const product3 = {
  title: "mouse",
  description: "mouse inalambrico gamer",
  price: 800,
  thumbnail: "sin thumbnail",
  code: "abc12345",
  stock: 15,
};
//Esto sirve para armar el archivo si no lo tengo
PM.addProduct(product1).then(() => {
  PM.addProduct(product2).then(() => {
    PM.addProduct(product3).then(() => {
      console.log("finaliza la carga");
    });
  });
});
