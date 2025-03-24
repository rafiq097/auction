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
import { getPlusPrice } from "./utils/getPlusPrice";
import { CR } from "./utils/getCR";

dotenv.config();
const app: Application = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
  },
});

const map = new Map();

io.on("connection", (socket) => {
  console.log("New connection established:", socket.id);

  socket.on("join-room", async ({ roomId, user, team }) => {
    try {
      console.log(`User ${user.email} attempting to join room ${roomId}`);

      const room = await Room.findById(roomId);
      if (!room) {
        socket.emit("room-error", "Room not found");
        return;
      }

      const existingParticipant = room.participants.find(
        (p) => p.email === user.email
      );

      const taken = room.participants.some(
        (participant) =>
          participant.team === user.team && participant.email !== user.email
      );

      if (taken) {
        socket.emit(
          "room-error",
          `Team ${user.team} is already taken! Please choose another team.`
        );
        return;
      }

      if (existingParticipant) {
        room.participants = room.participants.map((p) =>
          p.email === user.email
            ? { ...p, online: true, socketId: socket.id, team }
            : p
        );
      } else {
        room.participants.push({
          ...user,
          online: true,
          socketId: socket.id,
          team,
        });
      }

      await room.save();

      socket.join(roomId);

      map.set(socket.id, {
        email: user.email,
        roomId: roomId,
      });

      io.to(roomId).emit("user-joined", {
        message: `${user.name || user.email} has joined the room`,
        participants: room.participants,
      });

      socket.emit("room-state", {
        name: room.name,
        owner: room.owner,
        participants: room.participants,
        curr: room.curr,
        teams: room.teams,
      });

      console.log(`User ${user.email} joined Room ${roomId} successfully`);
    } catch (error) {
      console.error("Error joining room:", error);
      socket.emit("room-error", "Failed to join room");
    }
  });

  socket.on("disconnect", async () => {
    try {
      const userData = map.get(socket.id);

      if (userData) {
        const { email, roomId } = userData;
        console.log(`User ${email} disconnected from socket ${socket.id}`);

        const room = await Room.findById(roomId);
        if (room) {
          room.participants = room.participants.filter(
            (p) => p.email !== email
          );
          await room.save();

          io.to(roomId).emit("user-left", {
            message: `${email} has left the room`,
            participants: room.participants,
          });

          console.log(`User ${email} marked offline in Room ${roomId}`);
        }

        map.delete(socket.id);
      }
    } catch (error) {
      console.error("Error handling disconnect:", error);
    }
  });

  socket.on("bid", async ({ roomId, user, player }) => {
    try {
      console.log(
        `User ${user.email} bidding for player ${player.First_Name} ${player.Surname}`
      );

      const room = await Room.findById(roomId);
      if (!room) {
        socket.emit("room-error", "Room not found");
        return;
      }

      player.Base += getPlusPrice(player.Base);

      io.to(roomId).emit("player-bid", {
        message: `${user.team || user.name} bid for ${player.First_Name} ${
          player.Surname
        } at ${CR(player.Base)}`,
        user: user,
        player: player,
        timestamp: new Date(),
      });

      console.log(`Bid notification sent to room ${roomId}`);
    } catch (error) {
      console.error("Error handling bid:", error);
      socket.emit("room-error", "Failed to process bid");
    }
  });

  socket.on("skip", async ({ roomId, user, player }) => {
    try {
      console.log(
        `User ${user.name || user.email} skipped player ${player.First_Name} ${
          player.Surname
        }`
      );

      const room = await Room.findById(roomId);
      if (!room) {
        socket.emit("room-error", "Room not found");
        return;
      }

      const ind = room.participants.findIndex((p) => p.email === user.email);

      if (ind === -1) {
        socket.emit("room-error", "User not found in room participants");
        return;
      }

      room.participants[ind].skip = true;
      room.curr += 1;
      await room.save();

      const updatedUser = room.participants[ind];

      io.to(roomId).emit("player-skip", {
        message: `${user.name || user.email} skipped ${player.First_Name} ${
          player.Surname
        }`,
        user: updatedUser,
        player: player,
        timestamp: new Date(),
        participants: room.participants,
        curr: room.curr,
      });

      console.log(`Skip notification sent to room ${roomId}`);
    } catch (error) {
      console.error("Error handling skip:", error);
      socket.emit("room-error", "Failed to process skip");
    }
  });


  socket.on("player-sold", async ({ roomId, player, team, amount }) => {
    try {
      console.log("---Player-Sold---");
      console.log(`Player ${player.First_Name} ${player.Surname} sold to ${team} for ${amount}`);
      
      const room = await Room.findById(roomId);
      if (!room) {
        socket.emit("room-error", "Room not found");
        return;
      }
      
    const sold = room.teams.some((t) =>
      t.players.some((p: any) => p.First_Name === player.First_Name && p.Surname === player.Surname)
    );

    if (sold) {
      console.log(`Player ${player.First_Name} ${player.Surname} is already sold.`);
      socket.emit("room-error", "Player already sold");
      return;
    }
  
      const teamIndex = room.teams.findIndex((t) => t.name === team);
      if (teamIndex !== -1) {
        room.teams[teamIndex].spent += amount;
        room.teams[teamIndex].remaining -= amount;
          
        switch (player.Role) {
          case "BATTER":
            room.teams[teamIndex].batters = (room.teams[teamIndex].batters || 0) + 1;
            break;
          case "BOWLER":
            room.teams[teamIndex].bowlers = (room.teams[teamIndex].bowlers || 0) + 1;
            break;
          case "ALL-ROUNDER":
            room.teams[teamIndex].allr = (room.teams[teamIndex].allr || 0) + 1;
            break;
          case "WICKETKEEPER":
            room.teams[teamIndex].wks = (room.teams[teamIndex].wks || 0) + 1;
            break;
          default:
            break;
        }
  
        if (player.Country !== "India") {
          room.teams[teamIndex].overseas = (room.teams[teamIndex].overseas || 0) + 1;
        }

        room.teams[teamIndex].players.push({
          ...player,
          price: amount,
        });
      }
  
      const newIndex = room.curr + 1;
      room.curr = newIndex;
  
      room.participants.forEach((p) => {
        p.skip = false;
      });
      
      await room.save();
      console.log(room);
  
      io.to(roomId).emit("player-sold", {
        message: `${player.First_Name} ${player.Surname} SOLD to ${team} for ${CR(amount)} CR!`,
        player,
        team,
        amount,
        newIndex,
        teams: room.teams,
        participants: room.participants,
      });
      
      console.log(`Player sold notification sent to room ${roomId}`);
    } catch (error) {
      console.error("Error handling player sold:", error);
      socket.emit("room-error", "Failed to process player sold");
    }
  });

  socket.on("player-sold-noti", ({ roomId, data }) => {
    io.to(roomId).emit('player-sold-noti', data);
  });
  
  socket.on("player-unsold", async ({ roomId, player }) => {
    try {
      console.log(`Player ${player.First_Name} ${player.Surname} unsold`);
      
      const room = await Room.findById(roomId);
      if (!room) {
        socket.emit("room-error", "Room not found");
        return;
      }
  
      const newIndex = room.curr + 1;
      room.curr = newIndex;
  
      room.participants.forEach((p) => {
        p.skip = false;
      });
      
      await room.save();
  
      io.to(roomId).emit("player-unsold", {
        message: `${player.First_Name} ${player.Surname} UNSOLD!`,
        player,
        newIndex,
        participants: room.participants,
      });
      
      console.log(`Player unsold notification sent to room ${roomId}`);
    } catch (error) {
      console.error("Error handling player unsold:", error);
      socket.emit("room-error", "Failed to process player unsold");
    }
  });

  socket.on("player-unsold-noti", ({ roomId, data }) => {
    io.to(roomId).emit('player-unsold-noti', data);
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
