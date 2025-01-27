import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";


const RoomDetailsPage = () => {
  const { roomId } = useParams();
  const [participants, setParticipants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRoomDetails = async () => {
      try {
        const response = await axios.get(`/rooms/get/single/${roomId}`);
        setParticipants(response.data.participants);
        setLoading(false);
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to fetch room details");
        setLoading(false);
      }
    };

    fetchRoomDetails();
  }, [roomId]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Room Details</h1>
      <h2 className="text-lg font-semibold">Participants:</h2>
      <ul className="list-disc pl-5">
        {participants.map((participant) => (
          <li key={participant._id} className="py-1">
            {participant.name} ({participant.email})
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RoomDetailsPage;
