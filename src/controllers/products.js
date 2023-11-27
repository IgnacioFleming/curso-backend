import { productsService } from "../dao/repositories/index.js";
import { generateMockedProduct } from "../mocks/products.js";
import CustomError from "../services/errors/CustomError.js";
import EErrors from "../services/errors/enums.js";
import { generateProductsError } from "../services/errors/info.js";

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
      req.logger.error(`Falló el GET.`);
      res.status(400).send({ status: result.status, description: result.description });
    }
  } catch (error) {
    req.logger.fatal(`Ocurrió un error fatal en la ejecucion del proceso. 
    message:${error}`);
    res.status(500).send({ status: "error", description: error.toString() });
  }
};

const getProductById = async (req, res) => {
  try {
    const { pid } = req.params;
    const { status, payload, description } = await productsService.getProductById(pid);
    status === "error" ? res.status(400).send({ status, description }) : res.send({ status, payload });
  } catch (error) {
    req.logger.fatal(`Ocurrió un error fatal en la ejecucion del proceso. 
    message:${error}`);
    res.status(500).send({ status: "error", description: error.toString() });
  }
};

const addProduct = async (req, res, next) => {
  try {
    const newProduct = req.body;
    const { title, description: productDescription, price, category, code, stock } = newProduct;
    const statusValidation = Object.keys(newProduct).includes("status");

    if (!title || !productDescription || !price || !category || !code || !stock || !statusValidation) {
      CustomError.createError({
        name: "Error al crear el producto",
        cause: generateProductsError(newProduct),
        message: "Hubo un error al crear el producto, alguno de los campos requeridos no existe o no es valido",
        code: EErrors.INVALID_TYPES_ERROR,
      });
    }
    if (req.file) {
      newProduct.thumbnails = [req.file.path];
    }

    if (req.user.role === "premium") {
      newProduct.owner = req.user.email;
    }

    const { status, description, payload } = await productsService.addProduct(newProduct);
    if (status === "success") {
      res.send({ status, payload });
    } else {
      req.logger.error(`Falló el GET. Revisar el body del request.`);
      res.status(400).send({ status, description });
    }
  } catch (error) {
    req.logger.fatal(`Ocurrió un error fatal en la ejecucion del proceso. 
    message:${error}`);
    next(error);
  }
};

const updateProduct = async (req, res) => {
  try {
    const { pid } = req.params;
    const newProduct = req.body;
    delete newProduct?.id;
    if (req.user.role === "premium") {
      const product = await productsService.getProductById(pid);
      if (product.payload.owner !== req.user.email) return res.status(403).send({ status: "error", error: "No es posible editar un producto que no pertenezca al usuario" });
    }
    const { status, description, payload } = await productsService.updateProduct(pid, newProduct);

    if (status === "success") {
      res.send({ status, payload });
    } else {
      req.logger.error(`Falló el PUT. Revisar parametros pid:${pid}`);
      res.status(400).send({ status, description });
    }
  } catch (error) {
    req.logger.fatal(`Ocurrió un error fatal en la ejecucion del proceso. 
    message:${error}`);
    res.status(500).send({ status: "error", description: error.toString() });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const { pid } = req.params;
    if (req.user.role === "premium") {
      const product = await productsService.getProductById(pid);
      if (product.payload.owner !== req.user.email) return res.status(403).send({ status: "error", error: "No es posible eliminar un producto que no pertenezca al usuario" });
    }
    const { status, payload } = await productsService.deleteProduct(pid);
    if (status === "success") {
      res.send({ status, payload });
    } else {
      req.logger.error(`Falló el GET. Revisar parametros pid:${pid}`);
      res.status(400).send({
        status,
        description: "Error al intentar eliminar el producto",
      });
    }
  } catch (error) {
    req.logger.fatal(`Ocurrió un error fatal en la ejecucion del proceso. 
    message:${error}`);
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
    req.logger.fatal(`Ocurrió un error fatal en la ejecucion del proceso. 
    message:${error}`);
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
