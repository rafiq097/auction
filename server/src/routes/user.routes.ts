import { Router } from "express";
import { loginUser, getAllUsers } from "../controllers/user.controller";

const router: Router = Router();

router.get("/get", getAllUsers);
router.post("/login", loginUser as any);

export default router;