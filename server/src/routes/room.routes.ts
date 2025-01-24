import { createRoom, deleteRoom, getRoom } from "controllers/room.controller";
import { Router } from "express";

const router: Router = Router();

router.get("/get/:id", getRoom as any);
router.post("/create", createRoom as any);
router.delete("/delete/:id", deleteRoom as any);

export default router;