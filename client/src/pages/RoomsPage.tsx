import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";
import { toast } from "react-hot-toast";
import { useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import axios from "axios";

const RoomsPage: React.FC = () => {
  const [rooms, setRooms] = useState<any[]>([]);
  const [roomName, setRoomName] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);

  const user = useRecoilValue(userAtom);
  const [socket, setSocket] = useState<any>(null);

  useEffect(() => {
    const newSocket = io("http://localhost:5000");
    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await axios.get("/rooms/get");
        setRooms(response.data.rooms);
        setLoading(false);
      } catch (error: any) {
        console.error("Error fetching rooms:", error);
        toast.error(error?.message || "Failed to fetch rooms");
        setLoading(false);
      }
    };

    fetchRooms();
  }, []);

  const handleCreateRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post("/rooms/create", {
        name: roomName,
        owner: user.email,
      });
      toast.success("Room created successfully!");
      setRooms((prevRooms) => [...prevRooms, response.data.room]);
      setRoomName("");
    } catch (error: any) {
      console.error("Error creating room:", error);
      toast.error(error?.message || "Failed to create room");
    }
  };

  const handleJoinRoom = async (roomId: string) => {
    if (!socket) {
      toast.error("Socket not connected");
      return;
    }
    console.log(user);

    try {
      const response = await axios.put(`/rooms/update/${roomId}`, { user });

      if (response.status === 200) {
        socket.emit("join-room", roomId);
        toast.success(`Joined room successfully! Room ID: ${roomId}`);

        socket.on("room-message", (message: string) => {
          toast.success(`Room Message: ${message}`);
        });
      } else {
        toast.error("Failed to join the room. Please try again.");
      }
    } catch (error: any) {
      console.error("Error joining room:", error);
      toast.error(error?.response?.data?.message);
    }
  };

  const handleDeleteRoom = async (roomId: string) => {
    try {
      await axios.delete(`/rooms/delete/${roomId}`);
      setRooms((prevRooms) => prevRooms.filter((room) => room._id !== roomId));
      toast.success("Room deleted successfully!");
    } catch (error: any) {
      console.error("Error deleting room:", error);
      toast.error(error?.message || "Failed to delete room");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-center mb-6">Rooms</h1>

      <form
        onSubmit={handleCreateRoom}
        className="max-w-md mx-auto bg-white p-6 rounded-2xl shadow-md mb-8"
      >
        <h2 className="text-xl font-semibold mb-4">Create a Room</h2>
        <div className="mb-4">
          <input
            type="text"
            placeholder="Room Name"
            value={roomName}
            onChange={(e) => setRoomName(e.target.value)}
            required
            className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700"
        >
          Create Room
        </button>
      </form>

      {loading ? (
        <p className="text-center text-gray-500">Loading rooms...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {rooms.length > 0 ? (
            rooms.map((room: any) => (
              <div
                key={room._id}
                className="bg-white p-6 rounded-2xl shadow-md flex flex-col justify-between"
              >
                <div>
                  <h3 className="text-lg font-semibold">{room.name}</h3>
                  <p className="text-gray-500">Owned by: {room.owner}</p>
                </div>
                <div className="mt-4 flex gap-2">
                  <button
                    onClick={() => handleJoinRoom(room._id)}
                    className="bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700"
                  >
                    Join Room
                  </button>
                  {room.owner === user.email && (
                    <button
                      onClick={() => handleDeleteRoom(room._id)}
                      className="bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700"
                    >
                      Delete Room
                    </button>
                  )}
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500">No rooms available</p>
          )}
        </div>
      )}
    </div>
  );
};

export default RoomsPage;
