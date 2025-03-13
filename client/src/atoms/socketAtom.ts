import { atom } from "recoil";
import { io, Socket } from "socket.io-client";

const socket = io("http://localhost:5000");

export const socketState = atom<Socket | null>({
  key: "socketState",
  default: socket,
});