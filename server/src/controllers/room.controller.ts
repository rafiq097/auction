import { Request, Response } from "express";
import Room from "../models/room.model";

export const getRooms = async (req: Request, res: Response) => {
  try {
    const rooms = await Room.find({});
    if (!rooms) {
      return res.status(404).json({ message: "Rooms not found" });
    }
    res.status(200).json({ rooms });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching room" });
  }
};

export const getRoom = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const room = await Room.findById(id);
    if (!room) return res.status(404).json({ message: "Room not found" });

    res.status(200).json(room);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error fetching room details" });
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
    const poorTeams = [
      {
        name: "RCB",
        spent: 0,
        remaining: 120,
        players: [] as any[],
        batters: 0,
        bowlers: 0,
        wks: 0,
        allr: 0,
        overseas: 0,
      },
      {
        name: "MI",
        spent: 0,
        remaining: 120,
        players: [] as any[],
        batters: 0,
        bowlers: 0,
        wks: 0,
        allr: 0,
        overseas: 0,
      },
      {
        name: "CSK",
        spent: 0,
        remaining: 120,
        players: [] as any[],
        batters: 0,
        bowlers: 0,
        wks: 0,
        allr: 0,
        overseas: 0,
      },
      {
        name: "DC",
        spent: 0,
        remaining: 120,
        players: [] as any[],
        batters: 0,
        bowlers: 0,
        wks: 0,
        allr: 0,
        overseas: 0,
      },
      {
        name: "KKR",
        spent: 0,
        remaining: 120,
        players: [] as any[],
        batters: 0,
        bowlers: 0,
        wks: 0,
        allr: 0,
        overseas: 0,
      },
      {
        name: "SRH",
        spent: 0,
        remaining: 120,
        players: [] as any[],
        batters: 0,
        bowlers: 0,
        wks: 0,
        allr: 0,
        overseas: 0,
      },
      {
        name: "RR",
        spent: 0,
        remaining: 120,
        players: [] as any[],
        batters: 0,
        bowlers: 0,
        wks: 0,
        allr: 0,
        overseas: 0,
      },
      {
        name: "PBKS",
        spent: 0,
        remaining: 120,
        players: [] as any[],
        batters: 0,
        bowlers: 0,
        wks: 0,
        allr: 0,
        overseas: 0,
      },
      {
        name: "LSG",
        spent: 0,
        remaining: 120,
        players: [] as any[],
        batters: 0,
        bowlers: 0,
        wks: 0,
        allr: 0,
        overseas: 0,
      },
      {
        name: "GT",
        spent: 0,
        remaining: 120,
        players: [] as any[],
        batters: 0,
        bowlers: 0,
        wks: 0,
        allr: 0,
        overseas: 0,
      },
    ];

    const newRoom = new Room({
      name,
      owner,
      teams: poorTeams,
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

export const updateRoom = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { user } = req.body;

  try {
    const room = await Room.findById(id);
    if (!room) return res.status(404).json({ message: "Room Not Found!" });

    if (
      room.participants.some(
        (participant: any) => participant.email === user.email
      )
    ) {
      return res.status(400).json({ message: "User already in the room!" });
    }

    const taken = room.participants.some(
      (participant) => participant.team === user.team
    );

    if (taken) {
      return res
        .status(400)
        .json({
          message: `Team ${user.team} is already taken! Please choose another team.`,
        });
    }

    room.participants.push({ ...user, online: true, team: user.team });
    await room.save();

    console.log(room);
    res.status(200).json({ message: "Room updated successfully", room });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "Error Updating room" });
  }
};
