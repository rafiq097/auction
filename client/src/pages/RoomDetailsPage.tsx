/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom"; // Import useNavigate
import axios from "axios";
import { io, Socket } from "socket.io-client";
import { useRecoilState } from "recoil";
import userAtom from "../atoms/userAtom";
import toast from "react-hot-toast";
import { players as bros } from "../utils/list.ts";
import Card from "../components/Card.tsx";
import { CR } from "../utils/getCR.ts";

const RoomDetailsPage = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const [room, setRoom] = useState<any>({});
  // const [participants, setParticipants] = useState<any[]>([]);
  const [userData, setUserData] = useRecoilState(userAtom);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [players, ] = useState<any>(bros);
  const [curr, setCurr] = useState<number>(0);
  const [showModal, setShowModal] = useState(false);
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
        setCurr(response.data.curr);
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
    newSocket.on("room-updated", (data: any) => {
      setRoom(data);
    });
    socket?.on("room-message", (data: any) => {
      console.log(data);
      toast.success(data);
    });

    return () => {
      newSocket.emit("leave-room", { roomId, user: userData });
      newSocket.disconnect();
      setSocket(null);
    };
  }, [roomId]);

  useEffect(() => {
    const handleRoomMessage = (data: any) => {
      console.log(data);
      toast.success(data);
    };
  
    const handleRoomUpdated = (data: any) => {
      setRoom(data);
    };
  
    socket?.on("room-message", handleRoomMessage);
    socket?.on("room-updated", handleRoomUpdated);
  
    return () => {
      socket?.off("room-message", handleRoomMessage);
      socket?.off("room-updated", handleRoomUpdated);
    };
  }, [socket]);
  

  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  const handleBid = () => {
    socket?.emit("bid", { roomId, user: userData, player: players[curr] });
  };
  const handleSkip = () => {
    socket?.emit("skip", { roomId, user: userData, player: players[curr] });
  };

  if (loading) return <p>Loading...</p>;
  console.log(room);

  return (
    <div className="p-4 h-screen bg-gray-50">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-full">
        {/* Teams Purse */}
        <div className="p-4 bg-white rounded-lg shadow-md overflow-auto">
          <h2 className="text-xl font-semibold mb-3 text-gray-800">
            Teams Purse
          </h2>
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="border px-3 py-2">Team</th>
                <th className="border px-3 py-2">Owner</th>
                <th className="border px-3 py-2">Spent</th>
                <th className="border px-3 py-2">Remaining</th>
              </tr>
            </thead>
            <tbody>
              {room?.teams?.map((team: any) => {
                const owner =
                  room?.participants?.find(
                    (user: any) => user.team === team.name
                  )?.name || "N/A";
                return (
                  <tr key={team.name} className="hover:bg-gray-50">
                    <td className="border px-3 py-2 font-medium">
                      {team.name}
                    </td>
                    <td className="border px-3 py-2">{owner}</td>
                    <td className="border px-3 py-2">{team.spent} cr</td>
                    <td className="border px-3 py-2">{team.remaining} cr</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Bro */}
        <div className="p-4 bg-white rounded-lg shadow-md flex flex-col items-center justify-center space-y-2">
          <h2 className="text-xl font-semibold text-gray-800">
            {players[curr].First_Name + " " + players[curr].Surname + " "}
            <button
              className="text-blue-500 text-sm underline hover:text-blue-700 ml-2"
              onClick={handleShowModal}
            >
              Full Info
            </button>
          </h2>

          <div className="text-gray-600">
            <p>
              <span className="font-medium">Role: </span>
              {players[curr].Role === "BATTER"
                ? `${players[curr].Role} - ${players[curr].Bat_type}`
                : players[curr].Role === "BOWLER"
                ? `${players[curr].Role} - ${players[curr].Bowl_type}`
                : players[curr].Role}
            </p>
          </div>

          <div className="text-gray-600">
            <p>
              <span className="font-medium">Base Price: </span>
              {CR(players[curr].Base)} CR
            </p>
          </div>

          <div className="text-gray-600">
            <p>
              <span className="font-medium">Country: </span>
              {players[curr].Country}
            </p>
          </div>

          <div className="text-gray-600">
            <p>{players[curr].Runs}</p>
          </div>

          {showModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <Card player={players[curr]} onClose={handleCloseModal} />
            </div>
          )}
        </div>

        {/* Bid */}
        <div className="p-4 bg-white rounded-lg shadow-md flex flex-col items-center justify-center space-y-2">
          <h2 className="text-xl font-semibold mb-3 text-gray-800">Bidding</h2>
          <div className="space-x-4">
            <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
            onClick={handleBid}
            >
              Bid
            </button>
            <button className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
            onClick={handleSkip}
            >
              Skip
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomDetailsPage;
