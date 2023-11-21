import multer from "multer";
import { fileURLToPath } from "url";
import { dirname } from "path";
import bcrypt from "bcrypt";
import passport from "passport";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const createHash = (password) => bcrypt.hashSync(password, bcrypt.genSaltSync(10));

export const isValidPassword = (password, user) => bcrypt.compareSync(password, user.password);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, __dirname + "/public/images");
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
  const auth = req.headers;
  console.log(auth);
  if (req && req.headers) {
    token = req.params.token;
  }
  return token;
};

export const adminAuthorizations = async (req, res, next) => {
  if (!req.user) return res.status(401).send({ status: "error", error: "Unauthorized" });
  if (req.user.role === "admin") {
    return next();
  } else {
    return res.status(403).send({ status: "error", error: "No permissions" });
  }
};

export const userAuthorizations = async (req, res, next) => {
  if (!req.user) return res.status(401).send({ status: "error", error: "Unauthorized" });
  if (req.user.role === "usuario") {
    return next();
  } else {
    return res.status(403).send({ status: "error", error: "No permissions" });
  }
};

export const uploader = multer({ storage });

export default __dirname;
