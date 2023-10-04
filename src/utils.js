import multer from "multer";
import { fileURLToPath } from "url";
import { dirname } from "path";
import bcrypt from "bcrypt";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const createHash = (password) =>
  bcrypt.hashSync(password, bcrypt.genSaltSync(10));

export const isValidPassword = (password, user) =>
  bcrypt.compareSync(password, user.password);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, __dirname + "/public/images");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

export const passportCall = (strategy, redirect) => {
  return async (req, res, next) => {
    passport.authenticate(
      strategy,
      { session: false, failureRedirect: redirect },
      (err, user, info) => {
        if (err) return next(err);
        if (!user)
          return res.status(401).send({
            status: "error",
            error: info.message ? info.message : info.toString(),
          });
        req.user = user;
        next();
      }
    )(req, res, next);
  };
};

export const uploader = multer({ storage });

export default __dirname;
