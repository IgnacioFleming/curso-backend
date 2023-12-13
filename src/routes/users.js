import { Router } from "express";
import { shiftUserRole, uploadDocuments } from "../controllers/users.js";
import { passportCall, uploader } from "../utils.js";

const multerCategories = [{ name: "document" }, { name: "id" }, { name: "address" }, { name: "accountStatement" }, { name: "profile" }];

const router = Router();

router.put("/premium/:uid", shiftUserRole);

router.post("/:uid/documents", passportCall("jwt"), uploader.fields(multerCategories), uploadDocuments);

export default router;
