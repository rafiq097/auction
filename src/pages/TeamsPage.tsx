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
    <div className="p-4 bg-gray-100 min-h-screen">
      {teams.map((team) => (
        <div
          key={team.name}
          className="bg-white shadow-md rounded-lg p-4 mb-6 border border-gray-300"
        >
          <h2 className="text-xl font-bold mb-4 flex justify-center border-b pb-2">
            {team.name}
          </h2>
          <div className="grid grid-cols-4 gap-6">
            <div className="border border-gray-300 rounded p-3">
              <h3 className="text-lg font-semibold mb-2 text-center">
                Batters
              </h3>
              <ul className="list-none">
                {getPlayersByRole(team.players, "batter").map((player) => (
                  <li
                    key={player.name}
                    className="flex items-center justify-between gap-2 border-b pb-1"
                  >
                    <span>
                      {player.name}
                      {player.country !== "India" && (
                        <FaPlane className="inline text-blue-500 ml-2" />
                      )}
                    </span>
                    <span className="text-gray-600 text-sm">
                      ₹{player.price} CR
                    </span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="border border-gray-300 rounded p-3">
              <h3 className="text-lg font-semibold mb-2 text-center">
                Wicket-Keepers
              </h3>
              <ul className="list-none">
                {getPlayersByRole(team.players, "wk-batter").map((player) => (
                  <li
                    key={player.name}
                    className="flex items-center justify-between gap-2 border-b pb-1"
                  >
                    <span>
                      {player.name}
                      {player.country !== "India" && (
                        <FaPlane className="inline text-blue-500 ml-2" />
                      )}
                    </span>
                    <span className="text-gray-600 text-sm">
                      ₹{player.price} CR
                    </span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="border border-gray-300 rounded p-3">
              <h3 className="text-lg font-semibold mb-2 text-center">
                Allrounders
              </h3>
              <ul className="list-none">
                {getPlayersByRole(team.players, "all-rounder").map((player) => (
                  <li
                    key={player.name}
                    className="flex items-center justify-between gap-2 border-b pb-1"
                  >
                    <span>
                      {player.name}
                      {player.country !== "India" && (
                        <FaPlane className="inline text-blue-500 ml-2" />
                      )}
                    </span>
                    <span className="text-gray-600 text-sm">
                      ₹{player.price} CR
                    </span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="border border-gray-300 rounded p-3">
              <h3 className="text-lg font-semibold mb-2 text-center">
                Bowlers
              </h3>
              <ul className="list-none">
                {getPlayersByRole(team.players, "bowler").map((player) => (
                  <li
                    key={player.name}
                    className="flex items-center justify-between gap-2 border-b pb-1"
                  >
                    <span>
                      {player.name}
                      {player.country !== "India" && (
                        <FaPlane className="inline text-blue-500 ml-2" />
                      )}
                    </span>
                    <span className="text-gray-600 text-sm">
                      ₹{player.price} CR
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TeamsPage;
