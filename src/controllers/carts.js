import { cartsService } from "../dao/repositories/index.js";
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

const addProductToCart = async (req, res) => {
  try {
    const { cid } = req.params;
    const { pid } = req.params;
    const { status, description, payload } = await cartsService.addProductToCart(cid, pid);
    if (status === "success") {
      res.send({ status, payload });
    } else {
      res.status(400).send({ status, description });
    }
  } catch (error) {
    res.status(500).send({ status: "error", description: error.toString() });
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

export default {
  createCart,
  getCartById,
  addProductToCart,
  deleteProductFromCart,
  updateProductsOfCart,
  updateProductQuantityFromCart,
  resetCart,
};
