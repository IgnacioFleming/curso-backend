import { Router } from "express";
import usersController from "../controllers/users.js";
import { passportCall, uploader } from "../utils.js";
import { applyPolicy } from "../middlewares/policies/policies.js";

const multerCategories = [{ name: "document" }, { name: "id" }, { name: "address" }, { name: "accountStatement" }, { name: "profile" }];

const router = Router();

router.post("/:uid/documents", passportCall("jwt"), applyPolicy(["USUARIO", "PREMIUM"]), uploader.fields(multerCategories), usersController.uploadDocuments);

router.use(passportCall("jwt"), applyPolicy(["ADMIN"]));

router.put("/premium/:uid", usersController.shiftUserRole);

router.get("/", usersController.getAllUsers);

router.delete("/", usersController.deleteInactiveUsers);

router.delete("/:id", usersController.deleteUser);

export default router;
