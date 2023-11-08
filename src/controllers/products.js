import { productsService } from "../dao/repositories/index.js";
import { generateMockedProduct } from "../mocks/products.js";

const getProducts = async (req, res) => {
  try {
    const { limit, sort, query } = req.query;
    const queryPage = req.query.page;
    const result = await productsService.getProducts(limit, queryPage, sort, query);
    if (result.status === "success") {
      res.send({
        status: result.status,
        payload: result.payload,
        totalPages: result.totalPages,
        prevPage: result.prevPage,
        nextPage: result.nextPage,
        page: result.page,
        hasPrevPage: result.hasPrevPage,
        hasNextPage: result.hasNextPage,
        prevLink: result.prevLink,
        nextLink: result.nextLink,
      });
    } else {
      res.status(400).send({ status: result.status, description: result.description });
    }
  } catch (error) {
    res.status(500).send({ status: "error", description: error.toString() });
  }
};

const getProductById = async (req, res) => {
  try {
    const { pid } = req.params;
    const { status, payload, description } = await productsService.getProductById(pid);
    status === "error" ? res.status(400).send({ status, description }) : res.send({ status, payload });
  } catch (error) {
    res.status(500).send({ status: "error", description: error.toString() });
  }
};

const addProduct = async (req, res) => {
  try {
    const newProduct = req.body;
    if (req.file) {
      newProduct.thumbnails = [req.file.path];
    }
    const { status, description, payload } = await productsService.addProduct(newProduct);
    if (status === "success") {
      res.send({ status, payload });
    } else {
      res.status(400).send({ status, description });
    }
  } catch (error) {
    res.status(500).send({ status: "error", description: error.toString() });
  }
};

const updateProduct = async (req, res) => {
  try {
    const { pid } = req.params;
    const newProduct = req.body;
    delete newProduct?.id;
    const { status, description, payload } = await productsService.updateProduct(pid, newProduct);

    if (status === "success") {
      res.send({ status, payload });
    } else {
      res.status(400).send({ status, description });
    }
  } catch (error) {
    res.status(500).send({ status: "error", description: error.toString() });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const { pid } = req.params;
    const { status, payload } = await productsService.deleteProduct(pid);
    if (status === "success") {
      res.send({ status, payload });
    } else {
      res.status(400).send({
        status,
        description: "Error al intentar eliminar el producto",
      });
    }
  } catch (error) {
    res.status(500).send({ status: "error", description: error.toString() });
  }
};

const mockingProducts = async (req, res) => {
  try {
    const mockedProducts = [];
    for (let i = 0; i < 100; i++) {
      mockedProducts.push(generateMockedProduct());
    }
    res.send({ status: "success", payload: mockedProducts });
  } catch (error) {
    res.status(500).send({ status: "error", description: error.toString() });
  }
};

export default {
  getProducts,
  getProductById,
  addProduct,
  updateProduct,
  deleteProduct,
  mockingProducts,
};