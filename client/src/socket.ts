import { io, Socket } from "socket.io-client";

let socket: Socket;

export const getSocket = (): Socket => {
  if (!socket) {
    socket = io("http://localhost:5000", {
      transports: ["websocket"], // Use WebSocket explicitly
    });
    console.log("Socket initialized:", socket.id);
  }
  return socket;
};
