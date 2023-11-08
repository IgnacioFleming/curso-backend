import EErrors from "../../services/errors/enums.js";

const errorHandler = (err, req, res, next) => {
  console.log("pase por el middleware");
  console.log(err.cause);
  switch (err.code) {
    case EErrors.INVALID_TYPES_ERROR:
      res.status(400).send({ status: "error", error: err.message });

      break;

    default:
      res.status(400).send({ status: "error", error: "Unhandled Error" });
      break;
  }
};

export default errorHandler;
