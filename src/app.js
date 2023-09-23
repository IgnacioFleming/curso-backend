import express from "express";
import productsRouter from "./routes/products.js";
import cartsRouter from "./routes/carts.js";
import viewsRouter from "./routes/views.js";
import __dirname from "./utils.js";
import { Server } from "socket.io";
import handlebars from "express-handlebars";
import ProductManager from "./dao/FileSystem/productManager.fs.js";
import mongoose from "mongoose";
import { messagesModel } from "./dao/models/message.model.js";
import session from "express-session";
import MongoStore from "connect-mongo";

const app = express();
app.engine("handlebars", handlebars.engine());
app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(__dirname + "/public"));
app.use(
  session({
    store: MongoStore.create({
      mongoUrl:
        "mongodb+srv://ifleming816:Ricardo55,.@codercluster.zf1jrhg.mongodb.net/ecommerce",
      mongoOptions: { useNewUrlParser: true, useUnifiedTopology: true },
      ttl: 200,
    }),
    secret: "d8!e-v7j2m$!%6wn*g9+yzv)abn#007f$%ivcomu_2!+(+cu$c",
    resave: false,
    saveUninitialized: false,
  })
);
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
//Servicio Real Time Products
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
//Servicio de chat
socketServer.on("connection", async (socket) => {
  const messages = await messagesModel.find();
  socketServer.emit("log-messages", messages);
  console.log("Cliente chat conectado");
  socket.on("new-message", async (data) => {
    await messagesModel.create(data);
    const messages = await messagesModel.find();
    console.log("los mensajes de la db son", messages);
    socketServer.emit("log-messages", messages);
  });
});
