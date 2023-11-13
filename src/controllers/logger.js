export const loggerTest = (req, res) => {
  req.logger.debug("Prueba de log del nivel debug");
  req.logger.http("Prueba de log del nivel http");
  req.logger.info("Prueba de log del nivel info");
  req.logger.warning("Prueba de log del nivel warning");
  req.logger.error("Prueba de log del nivel error");
  req.logger.fatal("Prueba de log del nivel fatal");
  res.send({ message: "Prueba de Logs finalizada" });
};
