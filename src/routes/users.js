import { Router } from "express";
import { shiftUserRole } from "../controllers/users.js";

const router = Router();

router.put("/premium/:uid", shiftUserRole);

export default router;
