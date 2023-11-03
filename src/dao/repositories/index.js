import ProductsRepository from "./products.js";
import CartsRepository from "./carts.js";
import { productsPersistence, cartsPersistence } from "../factory.js";

export const productsService = new ProductsRepository(new productsPersistence());
export const cartsService = new CartsRepository(new cartsPersistence());
