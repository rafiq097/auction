/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { io } from "socket.io-client";

const socket = io("http://localhost:5000");

const RoomDetailsPage = () => {
  const { roomId } = useParams();
  const [participants, setParticipants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const userEmail = localStorage.getItem("userEmail");

  useEffect(() => {
    const fetchRoomDetails = async () => {
      try {
        const response = await axios.get(`/rooms/get/single/${roomId}`);
        setParticipants(response.data.participants);
        setLoading(false);
      } catch (err: any) {
        console.error(err?.message);
        setLoading(false);
      }
    };

    fetchRoomDetails();

    socket.emit("user-connected", { roomId, email: userEmail });

    socket.on("online-users", (updatedParticipants) => {
      setParticipants(updatedParticipants);
    });

    return () => {
      socket.emit("disconnect");
      socket.off("online-users");
    };
  }, [roomId, userEmail]);

  if (loading) return <p>Loading...</p>;

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
