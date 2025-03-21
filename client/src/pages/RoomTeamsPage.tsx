/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useParams } from "react-router-dom";
import { FaPlane } from "react-icons/fa";
import { CR } from "../utils/getCR";
import BottomBar from "../components/BottomBar";

const RoomTeamsPage = () => {
  const { roomId } = useParams();
  const [room, setRoom] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

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
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-pulse text-lg font-semibold">Loading...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">
        Teams Overview
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {room?.teams?.map((team: any, idx: any) => (
          <div
            key={team.id || idx}
            className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200"
          >
            <div className="bg-gradient-to-r from-blue-400 to-blue-500 text-white py-3 px-4 font-semibold">
              {team.name}
              <span className="ml-2 text-sm bg-white text-blue-600 px-2 py-1 rounded-full">
                {team.players.length} players
              </span>
            </div>

            <div className="p-4">
              {["BATTER", "WICKETKEEPER", "ALL-ROUNDER", "BOWLER"].map(
                (role) => {
                  const rolePlayers = getPlayersByRole(team.players, role);
                  if (rolePlayers.length === 0) return null;

                  return (
                    <div key={role} className="mb-4 last:mb-0">
                      <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">
                        {role}
                      </h3>

                      <div className="space-y-2">
                        {rolePlayers.map((player: any) => (
                          <div
                            key={player.id}
                            className="flex justify-between items-center bg-gray-50 rounded-md p-3 hover:bg-gray-100 transition"
                          >
                            <div className="flex items-center">
                              <div className="font-medium">
                                {player.First_Name} {player.Surname}
                              </div>
                              {player.Country !== "India" && (
                                <div className="ml-2 text-xs">
                                  <FaPlane className="text-blue-500 inline mb-1" />
                                </div>
                              )}
                            </div>
                            <div className="text-green-600 font-semibold">
                              ₹{CR(player.price)} CR
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                }
              )}
            </div>
          </div>
        ))}
      </div>

      <BottomBar />
    </div>
  );
};

export default RoomTeamsPage;
