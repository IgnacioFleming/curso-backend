import express from "express";
import productsRouter from "./routes/products.js";
import cartsRouter from "./routes/carts.js";
import viewsRouter from "./routes/views.js";
import __dirname from "./utils.js";
import { Server } from "socket.io";
import handlebars from "express-handlebars";
import { productsService } from "./dao/repositories/index.js";
import { messagesModel } from "./dao/models/message.model.js";
import sessionRouter from "./routes/sessions.js";
import passport from "passport";
import initializePassport from "./config/passport.js";
import cookieParser from "cookie-parser";

const app = express();

app.engine("handlebars", handlebars.engine());
app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));
app.use(cookieParser());
initializePassport();
app.use("/", viewsRouter);
app.use("/api/carts", cartsRouter);
app.use(passport.initialize());
app.use("/api/sessions", sessionRouter);
app.use("/api/products", productsRouter);

const server = app.listen(8080, () => {
  console.log("Levantado el servidor 8080");
});

const socketServer = new Server(server);
//Servicio Real Time Products
socketServer.on("connection", (socket) => {
  console.log("Cliente Conectado");
  productsService.getProducts().then((products) => {
    socketServer.emit("log", products);
  });
  socket.on("addProduct", (data) => {
    data.thumbnails = [];
    productsService.addProduct(data);
  });
  socket.on("deleteProduct", (data) => {
    console.log("la data es", data);
    productsService.deleteProduct(data).then((result) => console.log(result));
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
