import dotenv from "dotenv";
import options from "./commander.js";

dotenv.config();
if (options.mode === "file") {
  process.env.PERSISTENCE = "FILE";
}
if (options.env === "dev") {
  process.env.ENVIROMENT = "DEV";
} else {
  process.env.ENVIROMENT = "PROD";
}

export default {
  mongo_url: process.env.MONGO_URL,
  jwt_secret_key: process.env.JWT_SECRET_KEY,
  admin_user: process.env.ADMIN_USER,
  admin_password: process.env.ADMIN_PASSWORD,
  clientId: process.env.clientId,
  clientSecret: process.env.clientSecret,
  callbackURL: process.env.callbackURL,
  persistence: process.env.PERSISTENCE,
  enviroment: process.env.ENVIROMENT,
};
