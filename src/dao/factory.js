import mongoose from "mongoose";

export let productsPersistence;
export let cartsPersistence;

switch (process.env.PERSISTENCE) {
  case "MONGO":
    const { default: ProductsMongo } = await import("./MongoDB/productManager.mongoDB.js");
    const { default: CartsMongo } = await import("./MongoDB/cartManager.mongoDB.js");
    const connection = mongoose.connect(process.env.MONGO_URL);
    productsPersistence = ProductsMongo;
    cartsPersistence = CartsMongo;
    break;

  case "FILE":
    const { default: ProductsFile } = await import("./FileSystem/productManager.fs.js");
    const { default: CartsFile } = await import("./FileSystem/cartManager.fs.js");
    productsPersistence = ProductsFile;
    cartsPersistence = CartsFile;
    break;
}
