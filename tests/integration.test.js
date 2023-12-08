import chai from "chai";
import supertest from "supertest";
import config from "../src/config/config.js";
import { generateMockedProduct } from "../src/mocks/products.js";

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
    before(async () => await cookieSetter(config.passport.admin_user, config.passport.admin_password));
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
    before(async () => await cookieSetter(config.passport.test_user_email, config.passport.test_user_password));
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
});
