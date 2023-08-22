import express from "express";
import productsRouter from "./routes/products.js";
import cartsRouter from "./routes/carts.js";
import viewsRouter from "./routes/views.js";
import __dirname from "./utils.js";
import { Server } from "socket.io";
import handlebars from "express-handlebars";
import ProductManager from "./productManager.js";

const app = express();
app.engine("handlebars", handlebars.engine());
app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(__dirname + "/public"));

app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/", viewsRouter);

const server = app.listen(8080, () => {
  console.log("Levantado el servidor 8080");
});

const socketServer = new Server(server);
const PM = new ProductManager("./products.json");

socketServer.on("connection", (socket) => {
  PM.getProducts().then((products) => {
    socketServer.emit("log", products);
  });
  socket.on("addProduct", (data) => {
    data.thumbnails = [];
    PM.addProduct(data);
  });
  socket.on("deleteProduct", (data) => {
    console.log("la data es", data);
    PM.deleteProduct(data).then((result) => console.log(result));
  });
});
