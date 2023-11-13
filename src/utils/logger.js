import winston from "winston";
import config from "../config/config.js";
const customLoggerConfig = {
  levels: {
    fatal: 0,
    error: 1,
    warning: 2,
    info: 3,
    http: 4,
    debug: 5,
  },
  colors: {
    fatal: "redBG white",
    error: "red",
    warning: "yellow",
    info: "blue",
    http: "green",
    debug: "magenta",
  },
};

const devLogger = winston.createLogger({
  levels: customLoggerConfig.levels,
  transports: [new winston.transports.Console({ level: "debug", format: winston.format.combine(winston.format.colorize({ colors: customLoggerConfig.colors }), winston.format.simple()) })],
});

const prodLogger = winston.createLogger({
  levels: customLoggerConfig.levels,
  transports: [new winston.transports.Console({ level: "info", format: winston.format.combine(winston.format.colorize({ colors: customLoggerConfig.colors }), winston.format.simple()) }), new winston.transports.File({ level: "error", filename: "errors.log", format: winston.format.simple() })],
});

export const addLogger = (req, res, next) => {
  if (config.enviroment === "PROD") {
    req.logger = prodLogger;
  } else {
    req.logger = devLogger;
  }
  next();
};

export const optsLogger = (opts) => {
  const log = `Se levanto el server con mode: ${opts.mode} y env: ${opts.env}`;
  if (opts.env === "prod") {
    prodLogger.info(log);
  } else {
    devLogger.info(log);
  }
};
