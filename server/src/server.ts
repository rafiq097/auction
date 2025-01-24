import express, { Application, Request, Response } from "express";
import path from "path";
import cors from "cors";
import dotenv from "dotenv";
import http from "http";
import { Server } from "socket.io";

import db from "./db/db";
import verifyToken from "./middlewares/auth";
import userRoutes from "./routes/user.routes";

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

  socket.on("sand-message", (data) => {
    console.log("Message", data);
    socket.broadcast.emit("receive-message", data);
  });

  socket.on("join-room", (room) => {
    socket.join(room);
    console.log(`User ${socket.id} joined Room ${room}`);
    io.to(room).emit("room-message", `User ${socket.id} joined Room: ${room}`);
  });

  socket.on("leave-room", (room) => {
    socket.leave(room);
    console.log(`User ${socket.id} left Room: ${room}`);
    io.to(room).emit("room-message", `User ${socket.id} left Room: ${room}`);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected: ", socket.id);
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

app.listen(PORT, () => {
  console.log(`Server running on PORT ${PORT}`);
});
