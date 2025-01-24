import { createRoom, deleteRoom, getRooms } from "../controllers/room.controller";
import { Router } from "express";

const router: Router = Router();

router.get("/get", getRooms as any);
router.post("/create", createRoom as any);
router.delete("/delete/:id", deleteRoom as any);

export default router;