import express from "express";
import productsRouter from "./routes/FileSystem/products.fs.js";
import cartsRouter from "./routes/FileSystem/carts.fs.js";
import viewsRouter from "./routes/FileSystem/views.fs.js";
import __dirname from "./utils.js";
import { Server } from "socket.io";
import handlebars from "express-handlebars";
import ProductManager from "./dao/FileSystem/productManager.fs.js";
import mongoose from "mongoose";
import { messageModel } from "./models/message.model.js";

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

const connection = mongoose.connect(
  "mongodb+srv://ifleming816:Ricardo55,.@codercluster.zf1jrhg.mongodb.net/ecommerce"
);

const server = app.listen(8080, () => {
  console.log("Levantado el servidor 8080");
});

const socketServer = new Server(server);
const PM = new ProductManager("./products.json");

socketServer.on("connection", (socket) => {
  console.log("Cliente Conectado");
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

socketServer.on("connection", async (socket) => {
  console.log("Cliente chat conectado");
  socket.on("new-message", async (data) => {
    await messageModel.create(data);
    const messages = await messageModel.find();
    socketServer.emit("log-messages", messages);
  });
});
