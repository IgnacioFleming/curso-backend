import dotenv from "dotenv";
import options from "./commander.js";

dotenv.config();
if (options.mode === "file") {
  process.env.PERSISTENCE = "FILE";
}
if (options.env === "dev") {
  process.env.ENVIROMENT = "DEV";
  process.env.MONGO_URL = process.env.TEST_MONGO_URL;
} else {
  process.env.ENVIROMENT = "PROD";
}

// export default {
//   mailing: {
//     service: process.env.SERVICE,
//     user: process.env.USER,
//     password: process.env.PASSWORD,
//   },
//   database: {
//     mongo_url: process.env.MONGO_URL,
//     persistence: process.env.PERSISTENCE,
//   },
//   passport: {
//     jwt_secret_key: process.env.JWT_SECRET_KEY,
//     admin_user: process.env.ADMIN_USER,
//     admin_password: process.env.ADMIN_PASSWORD,
//     clientId: process.env.clientId,
//     clientSecret: process.env.clientSecret,
//     callbackURL: process.env.callbackURL,
//     test_user_email: process.env.TEST_USER_EMAIL,
//     test_user_password: process.env.TEST_USER_PASSWORD,
//   },
//   enviroment: process.env.ENVIROMENT,
// };
