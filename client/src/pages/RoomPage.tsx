import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";

const RoomPage: React.FC = () => {
  const [rooms, setRooms] = useState<any[]>([]);
  const [roomName, setRoomName] = useState<string>("");
  const [owner, setOwner] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await axios.get("/rooms/get");
        console.log("Fetched rooms:", response.data);
        setRooms(response.data);
        setLoading(false);
      } catch (error: any) {
        console.error("Error fetching rooms:", error);
        toast.error(error?.response?.data?.message || "Failed to fetch rooms");
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
        owner,
      });
      toast.success("Room created successfully!");
      setRooms((prevRooms) =>
        Array.isArray(prevRooms)
          ? [...prevRooms, response.data]
          : [response.data]
      );
      setRoomName("");
      setOwner("");
    } catch (error: any) {
      console.error("Error creating room:", error);
      toast.error(error?.response?.data?.message || "Failed to create room");
    }
  };

  return (
    <div className="room-page">
      <h1>Rooms</h1>

      <form onSubmit={handleCreateRoom} className="create-room-form">
        <input
          type="text"
          placeholder="Room Name"
          value={roomName}
          onChange={(e) => setRoomName(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Owner Name"
          value={owner}
          onChange={(e) => setOwner(e.target.value)}
          required
        />
        <button type="submit">Create Room</button>
      </form>

      {console.log(rooms.length)}
      {loading ? (
        <p>Loading rooms...</p>
      ) : (
        <div className="room-list">
          {rooms.length > 0 ? (
            <ul style={{ listStyleType: "none", padding: "0" }}>
              {rooms.map((room: any) => (
                <li key={room._id}>
                  <strong>{room.name || "Unnamed Room"}</strong> - Owned by{" "}
                  {room.owner || "Unknown Owner"}
                  {console.log(room)}
                </li>
              ))}
            </ul>
          ) : (
            <p>No rooms available</p>
          )}
        </div>
      )}
    </div>
  );
};

export default RoomPage;
