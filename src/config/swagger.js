import swaggerJSDoc from "swagger-jsdoc";
import __dirname from "../utils.js";
import swaggerUiExpress from "swagger-ui-express";

const swaggerOptions = {
  definition: {
    openapi: "3.0.1",
    info: {
      title: "Documentación del BackEnd de un Ecommerce",
      description: "API creada para funcionar como backoffice de un proyecto de Tienda Ecommerce basado en Express y NodeJs",
    },
  },
  apis: [`${__dirname}/docs/**/*.yaml`],
};
export const specs = swaggerJSDoc(swaggerOptions);
