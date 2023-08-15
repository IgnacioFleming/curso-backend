import fs from "fs";
import ProductManager from "./productManager.js";

const PM = new ProductManager("productsSample.json");

const products = fs.readFileSync(PM.path, "utf-8");

const parsedProducts = JSON.parse(products);

fs.writeFileSync("products.json", parsedProducts);
