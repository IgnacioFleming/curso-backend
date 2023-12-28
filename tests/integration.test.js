import chai from "chai";
import supertest from "supertest";
import { generateMockedProduct } from "../src/mocks/products.js";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { userModel } from "../src/dao/models/user.model.js";

const connection = mongoose.connect("mongodb+srv://ifleming816:Ricardo55,.@codercluster.zf1jrhg.mongodb.net/test");

const expect = chai.expect;
const requester = supertest("http://localhost:8080");
let cookie;
const cookieSetter = async (email, password) => {
  const loginUser = { email, password };
  const result = await requester.post("/api/sessions/login").send(loginUser);
  const cookieResult = result.headers["set-cookie"][0];
  cookie = {
    name: cookieResult.split("=")[0],
    value: cookieResult.split("=")[1],
  };
};

describe("Testing de mi App Ecommerce", () => {
  describe("Test de Router de products", async () => {
    before(async () => await cookieSetter(process.env.ADMIN_USER, process.env.ADMIN_PASSWORD));
    it("El servicio GET de productos debe devolver un status 200 y un payload de tipo array", async () => {
      const { statusCode, ok, _body } = await requester.get("/api/products").set("Cookie", [`${cookie.name}=${cookie.value}`]);
      expect(statusCode).to.be.equal(200);
      expect(Array.isArray(_body.payload)).to.be.ok;
    });
    it("Al agregar un nuevo producto, debe recibir un status 200 y se debe guardar en base de datos con id de mongo", async () => {
      const mockedProduct = generateMockedProduct();
      const { statusCode, _body } = await requester
        .post("/api/products")
        .send(mockedProduct)
        .set("Cookie", [`${cookie.name}=${cookie.value}`]);
      expect(statusCode).to.be.equal(200);
      expect(_body.payload).to.have.property("_id");
    });
    it("Al agregar un nuevo producto sin algun campo requerido, debemos recibir un status 400", async () => {
      const mockedProduct = generateMockedProduct();
      delete mockedProduct.title;
      const { statusCode, _body } = await requester
        .post("/api/products")
        .send(mockedProduct)
        .set("Cookie", [`${cookie.name}=${cookie.value}`]);
      expect(statusCode).to.be.equal(400);
      expect(_body.error).to.be.ok;
    });
  });
  describe("Test de Router de carts", async () => {
    before(async () => await cookieSetter("pgrillo@example.com", "123"));

    it("Al crear un nuevo carrito, se debe crear un carrito con una propiedad products que debe ser un array vacio", async () => {
      const { statusCode, ok, _body } = await requester.post("/api/carts").set("Cookie", [`${cookie.name}=${cookie.value}`]);
      expect(statusCode).to.be.equal(200);
      expect(_body.payload).to.have.property("_id");
      expect(_body.payload.products).to.be.deep.equal([]);
    });
    it("Al agregar un nuevo producto al carrito, debe recibir un status 200 y en products debe contener el id del mismo", async () => {
      const cid = "65739967a54920c2606f5bf8";
      const pid = "65738c45b10e72996f139a00";
      const { statusCode } = await requester.post(`/api/carts/${cid}/products/${pid}`).set("Cookie", [`${cookie.name}=${cookie.value}`]);
      const { _body } = await requester.get(`/api/carts/${cid}`).set("Cookie", [`${cookie.name}=${cookie.value}`]);
      const addedProduct = _body.payload.products.find((p) => p.product._id.toString() === pid);
      expect(statusCode).to.be.equal(200);
      expect(addedProduct).to.be.not.equal(undefined);
    });
    it("Al resetear un carrito, este debe recibir un status 200 y su propiedad products debe ser un array vacio", async () => {
      const cid = "65739967a54920c2606f5bf8";
      const { _body: cartWithProducts } = await requester.get(`/api/carts/${cid}`).set("Cookie", [`${cookie.name}=${cookie.value}`]);
      const { statusCode } = await requester.delete(`/api/carts/${cid}`).set("Cookie", [`${cookie.name}=${cookie.value}`]);
      const { _body: resetedCart } = await requester.get(`/api/carts/${cid}`).set("Cookie", [`${cookie.name}=${cookie.value}`]);
      expect(cartWithProducts.payload.products).to.be.not.deep.equal([]);
      expect(statusCode).to.be.equal(200);
      expect(resetedCart.payload.products).to.be.deep.equal([]);
    });
  });
  describe("Test de Router de Sessions", async () => {
    before(async function () {
      this.timeout(20000);
      await mongoose.connection.collections.users.drop();
    });
    it("Al realizar un registro de usuario debe devolver un status 200 y debe tener id de mongo", async () => {
      const user = {
        first_name: "Pepe",
        last_name: "Grillo",
        email: "pgrillo@example.com",
        password: "123",
        age: 25,
      };
      const { statusCode, ok, _body } = await requester.post("/api/sessions/register").send(user);
      const userDB = await userModel.findOne({ email: user.email });

      expect(statusCode).to.be.equal(200);
      expect(userDB).to.have.property("_id");
    });
    it("Al realizar un login debo obtener un token y al verificarlo debe tratarse de un email y password valido", async () => {
      const user = {
        email: "pgrillo@example.com",
        password: "123",
      };
      const result = await requester.post("/api/sessions/login").send(user);
      const cookie = result.headers["set-cookie"][0];
      const token = cookie.split("=")[1].split(";")[0];
      const jwt_payload = jwt.verify(token, process.env.JWT_SECRET_KEY);
      expect(jwt_payload.email).to.be.equal(user.email);
    });
    it("Al llamar a la ruta current debo obtener un status 200 y el mismo email de usuario guardado en la cookie inicial", async () => {
      const { statusCode, ok, _body } = await requester.get("/api/sessions/current").set("Cookie", [`${cookie.name}=${cookie.value}`]);
      expect(statusCode).to.be.equal(200);
      expect(ok).to.be.ok;
      expect(_body.email).to.be.equal("pgrillo@example.com");
    });
  });
});
