import EErrors from "../../services/errors/enums.js";

const errorHandler = (err, req, res, next) => {
  switch (err.code) {
    case EErrors.INVALID_TYPES_ERROR:
      res.status(400).send({ status: "error", error: `Error de tipos inválidos: ${err.message}` });
      break;

    case EErrors.INVALID_PARAMS_ERROR:
      res.status(400).send({ status: "error", error: `Error de parámetros: ${err.message}` });
      break;

    default:
      res.status(400).send({ status: "error", error: `Unhandled error: ${err}` });
      break;
  }
};

export default errorHandler;
