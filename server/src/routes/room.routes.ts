import { createRoom, deleteRoom, getRoom, getRooms, updateRoom } from "../controllers/room.controller";
import { Router } from "express";

const router: Router = Router();

router.get("/get", getRooms as any);
router.get("/get/single/:id", getRoom as any);
router.post("/create", createRoom as any);
router.delete("/delete/:id", deleteRoom as any);
router.put("/update/:id", updateRoom as any);

export default router;