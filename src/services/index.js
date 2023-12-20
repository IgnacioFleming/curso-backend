import ProductsRepository from "../dao/repositories/products.js";
import CartsRepository from "../dao/repositories/carts.js";
import { productsPersistence, cartsPersistence } from "../dao/factory.js";
import MailingService from "./mails/mailingService.js";

export const productsService = new ProductsRepository(new productsPersistence());
export const cartsService = new CartsRepository(new cartsPersistence());
export const mailingService = new MailingService();
