import { Router } from "express";
import { deleteInactiveUsers, getAllUsers, shiftUserRole, uploadDocuments } from "../controllers/users.js";
import { passportCall, uploader } from "../utils.js";
import { applyPolicy } from "../middlewares/policies/policies.js";

const multerCategories = [{ name: "document" }, { name: "id" }, { name: "address" }, { name: "accountStatement" }, { name: "profile" }];

const router = Router();
router.use(passportCall("jwt"), applyPolicy(["ADMIN"]));

router.put("/premium/:uid", shiftUserRole);

router.post("/:uid/documents", uploader.fields(multerCategories), uploadDocuments);

router.get("/", getAllUsers);

router.delete('/',deleteInactiveUsers)

export default router;
