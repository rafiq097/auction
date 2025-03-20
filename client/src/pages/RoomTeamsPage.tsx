/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useParams } from 'react-router-dom';
import { FaPlane } from 'react-icons/fa';
import { CR } from '../utils/getCR';

const RoomTeamsPage = () => {
  const { roomId } = useParams();
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

  const getPlayersByRole = (players: any, role: any) =>
    players.filter((player: any) => player.Role === role);

  if (loading) {
    return <div className="text-center text-xl">Loading...</div>;
  }

  return (
    <div className="p-6 bg-gradient-to-br from-sky-100 to-blue-300 min-h-screen">
      <h1 className="text-2xl font-bold text-center mb-8 text-gray-800">
        Teams Overview
      </h1>
      {room?.teams.map((team: any, idx: any) => (
        <div
          key={team.name}
          className="bg-white shadow-md rounded-xl p-6 mb-8 border border-gray-300 hover:shadow-lg transition duration-300"
        >
          <h2 className="text-2xl font-semibold mb-4 text-center text-blue-800">
            {idx === 0 ? "Your Team: " : ""}
            {team.name} - {team.players.length}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {["BATTER", "WICKETKEEPER", "ALL-ROUNDER", "BOWLER"].map((role) => (
              <div
                key={role}
                className="bg-blue-50 border border-blue-300 rounded-lg p-4 hover:bg-blue-100 transition"
              >
                <h3 className="text-xl font-semibold mb-3 text-center text-blue-600">
                  {role}
                </h3>
                <ul className="space-y-2">
                  {getPlayersByRole(team.players, role).map((player: any) => (
                    <li
                      key={player.First_Name}
                      className="flex justify-between items-center bg-white p-2 rounded-md shadow hover:shadow-md transition"
                    >
                      <span className="flex items-center gap-1 text-gray-700 font-medium">
                        {player.First_Name} {player.Surname}
                        {player.Country !== "India" && (
                          <FaPlane className="ml-1 text-sky-500" />
                        )}
                      </span>
                      <span className="text-blue-700 font-semibold">
                        ₹{CR(player.price)} CR
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default RoomTeamsPage;
