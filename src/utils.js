import multer from "multer";
import { fileURLToPath } from "url";
import { dirname } from "path";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
dotenv.config();

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
      case "accountStatement":
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
