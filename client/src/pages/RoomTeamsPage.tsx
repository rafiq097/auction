/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const RoomTeamsPage = ({ roomId }: any) => {
  const [room, setRoom] = useState<any>(null);
  const [loading, setLoading] = useState<any>(true);

  useEffect(() => {
    const fetchRoomDetails = async () => {
      try {
        const response = await axios.get(`/rooms/get/single/${roomId}`);
        setRoom(response.data);
        setLoading(false);
      } catch (err: any) {
        console.error(err?.message);
        toast.error("Failed to load room details. Please refresh the page.");
        setLoading(false);
      }
    };

    fetchRoomDetails();
  }, [roomId]);

  if (loading) {
    return <div className="text-center text-xl">Loading...</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-center mb-6">Room Teams</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {room?.teams?.map((team: any, index: any) => (
          <div key={index} className="bg-gray-800 text-white p-4 rounded-2xl shadow-lg transition-transform transform hover:scale-105">
            <h2 className="text-xl font-semibold mb-3">{team.name}</h2>
            <ul className="space-y-2">
              {team.players?.map((player: any, idx: any) => (
                <li key={idx} className="bg-gray-700 p-2 rounded-lg hover:bg-gray-600 transition-colors">
                  {player.name}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RoomTeamsPage;
