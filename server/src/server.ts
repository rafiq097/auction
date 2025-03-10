import express, { Application, Request, Response } from "express";
import path from "path";
import cors from "cors";
import dotenv from "dotenv";
import http from "http";
import { Server } from "socket.io";

import db from "./db/db";
import verifyToken from "./middlewares/auth";
import userRoutes from "./routes/user.routes";
import roomRoutes from "./routes/room.routes";
import Room from "./models/room.model";

dotenv.config();
const app: Application = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
  },
});

io.on("connection", (socket) => {
  console.log("A User connected: ", socket.id);

  socket.on("send-message", (data) => {
    console.log("Message:", data);
    socket.broadcast.emit("receive-message", data);
  });

  socket.on("join-room", async ({ roomId, user }) => {
    try {
      const room = await Room.findById(roomId);
      if (!room) {
        return socket.emit("room-error", "Room Not Found!");
      }

      if (room.participants.some((participant) => participant.email === user.email)) {
        return socket.emit("room-error", "User already in the room!");
      }

      room.participants.push({ ...user, online: true });
      await room.save();

      socket.join(roomId);
      console.log(`User ${socket.id} joined Room ${roomId}`);

      io.to(roomId).emit("room-message", `User ${socket.id} joined Room: ${roomId}`);
      io.to(roomId).emit("room-updated", room);
    } catch (error) {
      console.error("Error updating room:", error.message);
      socket.emit("room-error", "Error updating room!");
    }
  });

  socket.on("leave-room", async ({ roomId, user }) => {
    try {
      const room = await Room.findById(roomId);
      if (!room) {
        return socket.emit("room-error", "Room Not Found!");
      }

      room.participants = room.participants.filter(
        (participant) => participant.email !== user.email
      );
      await room.save();

      socket.leave(roomId);
      console.log(`User ${socket.id} left Room ${roomId}`);

      io.to(roomId).emit("room-message", `User ${socket.id} left Room: ${roomId}`);
      io.to(roomId).emit("room-updated", room);
    } catch (error) {
      console.error("Error updating room:", error.message);
      socket.emit("room-error", "Error updating room!");
    }
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});


app.use(express.json());
app.use(express.static(path.join(__dirname, "../..", "client", "dist")));
// app.use(cors());
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//DB
db(process.env.MONGO_URI);

//Routes
app.use("/users", userRoutes);
app.use("/rooms", roomRoutes);

//Middlewares
app.get("/verify", verifyToken, (req: any, res: Response) => {
  console.log("Token Verified");

  res.status(200).json({
    message: "Logged In Successfully",
    token: req.token,
    user: req.user,
  });
});

//Server
const PORT = process.env.PORT || 5000;
// app.get("/", (req, res) => {
//     res.send("<h1>SAD</h1>");
// })

app.get("*", (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, "../..", "client", "dist", "index.html"));
});

server.listen(PORT, () => {
  console.log(`Server running on PORT ${PORT}`);
});
