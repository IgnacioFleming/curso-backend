import multer from "multer";
import { fileURLToPath } from "url";
import { dirname } from "path";
import bcrypt from "bcrypt";
import passport from "passport";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const createHash = async (password) => bcrypt.hash(password, bcrypt.genSaltSync(10));

export const isValidPassword = async (password, user) => bcrypt.compare(password, user.password);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let dest;
    switch (file.fieldname) {
      case "document":
      case "id":
      case "address":
      case "account-statement":
        dest = "/public/documents";
        break;
      case "profile":
        dest = "/public/profiles";
        break;
      case "thumbnail":
        dest = "/public/products";
    }
    cb(null, __dirname + dest);
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

export const passportCall = (strategy) => {
  return async (req, res, next) => {
    passport.authenticate(strategy, { session: false }, (err, user, info) => {
      if (err) {
        req.logger.error("Error fatal al autenticarse");
        return next(err);
      }
      if (strategy === "restorePass" && !user) {
        req.logger.warning(`{
          status: "error",
          error: ${info.message ? info.message : info.toString()},
        }`);
        return res.redirect("/forgottenPass");
      }
      if (!user) {
        req.logger.warning(`{
          status: "error",
          error: ${info.message ? info.message : info.toString()},
        }`);
        return res.redirect("/login");
      }
      req.user = user;
      next();
    })(req, res, next);
  };
};

export const cookieExtractor = (req) => {
  let token = null;
  if (req && req.cookies) {
    token = req.cookies["sessionCookie"];
  }
  return token;
};

export const tokenExtractor = (req) => {
  let token = null;
  if (req && req.params.token) {
    token = req.params.token;
  }
  return token;
};

export const uploader = multer({ storage });

export default __dirname;
