import { Request, Response } from "express";
import Room from "../models/room.model";

export const getRooms = async (req: Request, res: Response) => {
  try {
    const rooms = await Room.find({});
    if (!rooms) {
      return res.status(404).json({ message: "Room not found" });
    }
    res.status(200).json({ rooms });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching room" });
  }
};

export const createRoom = async (req: Request, res: Response) => {
  const { name, owner } = req.body;

  if (!name || !owner) {
    return res
      .status(400)
      .json({ message: "Room name and creator are required" });
  }

  try {
    const newRoom = new Room({
      name,
      owner,
    });

    await newRoom.save();
    res
      .status(201)
      .json({ message: "Room created successfully", room: newRoom });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error creating room" });
  }
};

export const deleteRoom = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const deletedRoom = await Room.findByIdAndDelete(id);
    if (!deletedRoom) {
      return res.status(404).json({ message: "Room not found" });
    }
    res
      .status(200)
      .json({ message: "Room deleted successfully", room: deletedRoom });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error deleting room" });
  }
};
