import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useRecoilState } from "recoil";
import { teamsAtom } from "../atoms/teamsAtom.ts";
import { userTeamAtom } from "../atoms/userTeamAtom.ts";
import { FaPlane } from "react-icons/fa";

const TeamsPage: React.FC = () => {
  const navigate = useNavigate();
  const [team, setTeam] = useRecoilState(userTeamAtom);
  const [teams, setTeams] = useRecoilState(teamsAtom);

  useEffect(() => {
    const curr = localStorage.getItem("team");
    if (curr) {
      setTeam(JSON.parse(curr));
    } else {
      navigate("/");
      toast.error("Please select a team");
    }
  }, []);

  const getPlayersByRole = (
    players: {
      name: string;
      role: string;
      country: string;
      price: number;
      base: number;
      type: string;
    }[],
    role: string
  ) => players.filter((player) => player.role === role);

  return (
    <div className="p-6 bg-gradient-to-br from-gray-100 to-gray-200 min-h-screen">
      <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
        Teams Overview
      </h1>
      {teams.map((team) => (
        <div
          key={team.name}
          className="bg-white shadow-lg rounded-xl p-6 mb-8 border border-gray-200 hover:shadow-xl transition duration-300"
        >
          <h2 className="text-2xl font-bold mb-6 text-center text-gray-700 border-b pb-4">
            {team.name}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Player Role Sections */}
            {["batter", "wk-batter", "all-rounder", "bowler"].map((role, idx) => (
              <div
                key={idx}
                className="bg-gray-50 border border-gray-300 rounded-lg p-5 hover:bg-gray-100"
              >
                <h3 className="text-lg font-semibold mb-4 text-center text-gray-600">
                  {role
                    .replace("-", " ")
                    .replace(/\b\w/g, (char) => char.toUpperCase())}
                </h3>
                <ul className="list-none space-y-3">
                  {getPlayersByRole(team.players, role).map((player) => (
                    <li
                      key={player.name}
                      className="flex items-center justify-between gap-2 bg-white p-3 rounded-lg shadow-sm border border-gray-200"
                    >
                      <span className="flex items-center">
                        {player.name}
                        {player.country !== "India" && (
                          <FaPlane className="ml-2 text-blue-500" />
                        )}
                      </span>
                      <span className="text-gray-500 font-medium text-sm">
                        ₹{player.price} CR
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

export default TeamsPage;
