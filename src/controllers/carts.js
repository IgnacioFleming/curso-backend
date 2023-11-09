import { cartsService } from "../dao/repositories/index.js";
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
      res.send({ status, payload });
    } else {
      res.status(400).send({ status, description });
    }
  } catch (error) {
    res.status(500).send({ status: "error", description: error.toString() });
  }
};

const objectIdValidation = (id) => {
  try {
    const ObjectId = mongoose.Types.ObjectId;
    const objectId = new ObjectId(id);
    return true;
  } catch (error) {
    return false;
  }
};

const addProductToCart = async (req, res, next) => {
  try {
    const { cid } = req.params;
    const { pid } = req.params;

    if (objectIdValidation(cid) === false || objectIdValidation(pid) === false) {
      console.log("paso por el if");
      CustomError.createError({
        name: "Parametro numerico",
        cause: generateCartsError(objectIdValidation(cid), objectIdValidation(pid)),
        message: "Alguno o todos los parametros enviados son un numero, debes enviar string",
        code: EErrors.INVALID_PARAMS_ERROR,
      });
    }
    const { status, description, payload } = await cartsService.addProductToCart(cid, pid);
    if (status === "success") {
      res.send({ status, payload });
    } else {
      res.status(400).send({ status, description });
    }
  } catch (error) {
    next(error);
  }
};

const deleteProductFromCart = async (req, res) => {
  try {
    const { cid } = req.params;
    const { pid } = req.params;
    const { status, description, payload } = await cartsService.deleteProductFromCart(cid, pid);
    if (status === "success") {
      res.send({ status, payload });
    } else {
      res.status(400).send({ status, description });
    }
  } catch (error) {
    res.status(500).send({ status: "error", description: error.toString() });
  }
};

const updateProductsOfCart = async (req, res) => {
  try {
    const { cid } = req.params;
    const products = req.body;
    const { status, payload, description } = await cartsService.updateProductsOfCart(cid, products);
    if (status === "success") {
      res.send({ status, payload });
    } else {
      res.status(400).send({ status, description });
    }
  } catch (error) {
    res.status(500).send({ status: "error", description: error.toString() });
  }
};

const updateProductQuantityFromCart = async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const newQuantity = req.body;
    const { status, payload, description } = await cartsService.updateProductOfCartQuantity(cid, pid, newQuantity);
    if (status === "success") {
      res.send({ status, payload });
    } else {
      res.status(400).send({ status, description });
    }
  } catch (error) {
    res.status(500).send({ status: "error", description: error.toString() });
  }
};

const resetCart = async (req, res) => {
  try {
    const { cid } = req.params;
    const { status, payload, description } = await cartsService.deleteAllProductsFromCart(cid);
    if (status === "success") {
      res.send({ status, payload });
    } else {
      res.status(400).send({ status, description });
    }
  } catch (error) {
    res.status(500).send({ status: "error", description: error.toString() });
  }
};

const confirmPurchase = async (req, res) => {
  const { cid } = req.params;
  const { status, payload } = await cartsService.confirmPurchase(cid);
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
