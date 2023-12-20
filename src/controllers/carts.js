import { cartsService, productsService } from "../services/index.js";
import CustomError from "../services/errors/CustomError.js";
import EErrors from "../services/errors/enums.js";
import { generateCartsError } from "../services/errors/info.js";
import mongoose from "mongoose";
const createCart = async (req, res) => {
  try {
    const { status, payload } = await cartsService.createCart();
    res.send({ status, payload });
  } catch (error) {
    res.status(500).send({ status: "error", description: error.toString() });
  }
};

const getCartById = async (req, res) => {
  try {
    const { cid } = req.params;
    const { status, description, payload } = await cartsService.getCartById(cid);

    if (status === "success") {
      req.logger.http(`Proceso exitoso getCartById con parametro ${cid}`);
      req.logger.info(`getCartById exitoso`);
      res.send({ status, payload });
    } else {
      req.logger.error(`Falló el GET. Revisar parametro ${cid}`);
      res.status(400).send({ status, description });
    }
  } catch (error) {
    req.logger.fatal(`Ocurrió un error fatal en la ejecucion del proceso. 
    message:${error}`);
    res.status(500).send({ status: "error", description: error.toString() });
  }
};

const objectIdValidation = (id) => {
  try {
    const ObjectId = mongoose.Types.ObjectId;
    const objectId = new ObjectId(id);
    return true;
  } catch (error) {
    req.logger.fatal(`Ocurrió un error fatal en la ejecucion del proceso. 
    message:${error}`);
    return false;
  }
};

const addProductToCart = async (req, res, next) => {
  try {
    const { cid } = req.params;
    const { pid } = req.params;

    if (objectIdValidation(cid) === false || objectIdValidation(pid) === false) {
      req.logger.debug("paso por el if de objectIdValidation");
      CustomError.createError({
        name: "Parametro numerico",
        cause: generateCartsError(objectIdValidation(cid), objectIdValidation(pid)),
        message: "Alguno o todos los parametros enviados son un numero, debes enviar string",
        code: EErrors.INVALID_PARAMS_ERROR,
      });
    }
    if (req.user.role === "premium") {
      const product = await productsService.getProductById(pid);
      if (product.payload.owner === req.user.email) return res.status(400).send({ status: "error", error: "Como usuario premium no podés agregar un producto propio" });
    }
    const { status, description, payload } = await cartsService.addProductToCart(cid, pid);
    if (status === "success") {
      req.logger.http(`Proceso exitoso addProductToCart con parametro ${cid} y ${pid}`);
      req.logger.info(`addProductToCart exitoso`);
      res.send({ status, payload });
    } else {
      req.logger.error(`Falló el GET. Revisar parametros ${cid} y ${pid}`);
      res.status(400).send({ status, description });
    }
  } catch (error) {
    req.logger.fatal(`Ocurrió un error fatal en la ejecucion del proceso. 
    message:${error}`);
    next(error);
  }
};

const deleteProductFromCart = async (req, res) => {
  try {
    const { cid } = req.params;
    const { pid } = req.params;
    const { status, description, payload } = await cartsService.deleteProductFromCart(cid, pid);
    if (status === "success") {
      req.logger.http(`Proceso exitoso deleteProductFromCart con parametro ${cid} y ${pid}`);
      req.logger.info(`deleteProductFromCart exitoso`);
      res.send({ status, payload });
    } else {
      req.logger.error(`Falló el GET. Revisar parametros cid:${cid} y pid:${pid}`);
      res.status(400).send({ status, description });
    }
  } catch (error) {
    req.logger.fatal(`Ocurrió un error fatal en la ejecucion del proceso. 
    message:${error}`);
    res.status(500).send({ status: "error", description: error.toString() });
  }
};

const updateProductsOfCart = async (req, res) => {
  try {
    const { cid } = req.params;
    let products = req.body;
    let notPremiumProducts;
    if (req.user.role === "premium") {
      notPremiumProducts = await Promise.all(
        products.map(async (e) => {
          const data = await productsService.getProductById(e.product);
          if (data.payload.owner !== req.user.email) {
            return e;
          }
        })
      );
      products = notPremiumProducts.filter((e) => e != null);
    }

    const { status, payload, description } = await cartsService.updateProductsOfCart(cid, products);
    if (status === "success") {
      req.logger.http(`Proceso exitoso updateProductsOfCart con parametro ${cid}`);
      req.logger.info(`updateProductsOfCart exitoso`);
      res.send({ status, payload });
    } else {
      req.logger.error(`Falló el GET. Revisar parametros cid:${cid}`);
      res.status(400).send({ status, description });
    }
  } catch (error) {
    req.logger.fatal(`Ocurrió un error fatal en la ejecucion del proceso. 
    message:${error}`);
    res.status(500).send({ status: "error", description: error.toString() });
  }
};

const updateProductQuantityFromCart = async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const newQuantity = req.body;
    const { status, payload, description } = await cartsService.updateProductOfCartQuantity(cid, pid, newQuantity);
    if (status === "success") {
      req.logger.http(`Proceso exitoso updateProductQuantityFromCart con parametro ${cid} y ${pid}`);
      req.logger.info(`updateProductQuantityFromCart exitoso`);
      res.send({ status, payload });
    } else {
      req.logger.error(`Falló el GET. Revisar parametros cid:${cid}, pid:${pid} y newQuantity:${newQuantity}`);
      res.status(400).send({ status, description });
    }
  } catch (error) {
    req.logger.fatal(`Ocurrió un error fatal en la ejecucion del proceso. 
    message:${error}`);
    res.status(500).send({ status: "error", description: error.toString() });
  }
};

const resetCart = async (req, res) => {
  try {
    const { cid } = req.params;
    const { status, payload, description } = await cartsService.deleteAllProductsFromCart(cid);
    if (status === "success") {
      req.logger.http(`Proceso exitoso resetCart con parametro ${cid}`);
      req.logger.info(`resetCart exitoso`);
      res.send({ status, payload });
    } else {
      req.logger.error(`Falló el GET. Revisar parametros cid:${cid}`);
      res.status(400).send({ status, description });
    }
  } catch (error) {
    req.logger.fatal(`Ocurrió un error fatal en la ejecucion del proceso. 
    message:${error}`);
    res.status(500).send({ status: "error", description: error.toString() });
  }
};

const confirmPurchase = async (req, res) => {
  const { cid } = req.params;
  const { status, payload, description } = await cartsService.confirmPurchase(cid);
  if (status === "error") return res.status(400).send({ status, description });
  req.logger.http(`Proceso exitoso confirmPurchase con parametro ${cid}`);
  req.logger.info(`confirmPurchase exitoso`);
  res.send({ status, payload });
};

export default {
  createCart,
  getCartById,
  addProductToCart,
  deleteProductFromCart,
  updateProductsOfCart,
  updateProductQuantityFromCart,
  resetCart,
  confirmPurchase,
};
