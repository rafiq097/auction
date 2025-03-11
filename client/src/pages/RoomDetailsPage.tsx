/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom"; // Import useNavigate
import axios from "axios";
import { io, Socket } from "socket.io-client";
import { useRecoilState } from "recoil";
import userAtom from "../atoms/userAtom";
import toast from "react-hot-toast";
// import { players as bros } from "../utils/list.ts";
// import { CR } from "../utils/getCR.ts";

const RoomDetailsPage = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const [room, setRoom] = useState<any>({});
  const [participants, setParticipants] = useState<any[]>([]);
  const [userData, setUserData] = useRecoilState(userAtom);
  const [, setSocket] = useState<Socket | null>(null);
  // const [players, setPlayers] = useState<any>(bros);
  const [loading, setLoading] = useState(true);

  const verify = async () => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const res = await axios.get("/verify", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUserData(res.data.user);
      } catch (err: any) {
        console.log(err.message);
        localStorage.removeItem("token");
        setUserData(null);
        toast.error("Session expired. Please login again.");
        navigate("/login");
      }
    } else {
      toast.error("Please login to continue");
      navigate("/login");
    }
  };

  useEffect(() => {
    verify();
  }, [setUserData, navigate]);

  useEffect(() => {
    const fetchRoomDetails = async () => {
      try {
        const response = await axios.get(`/rooms/get/single/${roomId}`);
        setRoom(response.data);
        setParticipants(response.data.participants);
        setLoading(false);
      } catch (err: any) {
        console.error(err?.message);
        toast.error("Please refresh page");
        setLoading(false);
      }
    };
    
    fetchRoomDetails();
    
    // const newSocket = io("https://iplauction.onrender.com");
    const newSocket = io("http://localhost:5000");
    setSocket(newSocket);

    newSocket.emit("join-room", { roomId, user: userData });

    return () => {
      newSocket.emit("leave-room", { roomId, user: userData });
      newSocket.disconnect();
      setSocket(null);
    };
  }, [roomId]);

  if (loading) return <p>Loading...</p>;
  console.log(room);

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Room Details</h1>
      <h2 className="text-lg font-semibold">Participants:</h2>
      <ul className="list-disc pl-5">
        {participants.map((participant) => (
          <li key={participant._id} className="py-1 flex items-center">
            <span
              className={`h-3 w-3 rounded-full mr-2 ${
                participant.online ? "bg-green-500" : "bg-gray-400"
              }`}
            ></span>
            {participant.name} ({participant.email})
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RoomDetailsPage;
