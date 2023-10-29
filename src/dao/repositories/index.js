import { productsPersistence, cartsPersistence } from "../factory.js";
import ProductsRepository from "./products.js";
import CartsRepository from "./carts.js";

export const productsService = new ProductsRepository(new productsPersistence());
export const cartsService = new CartsRepository(new cartsPersistence());
