/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useRecoilState } from "recoil";
import { teamsAtom } from "../atoms/teamsAtom.ts";
import { userTeamAtom } from "../atoms/userTeamAtom.ts";
import { FaPlane } from "react-icons/fa";
import axios from "axios";
import userAtom from "../atoms/userAtom.ts";

const TeamsPage: React.FC = () => {
  const navigate = useNavigate();
  const [team, setTeam] = useRecoilState(userTeamAtom);
  const [teams, setTeams] = useRecoilState(teamsAtom);
  const [, setUserData] = useRecoilState(userAtom);

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
  }, []);

  useEffect(() => {
    const swap = () => {
      const index = teams.findIndex((t) => t.name === team.name);
      const tempTeams = [...teams];
      const zero = tempTeams[0];

      tempTeams[0] = tempTeams[index];
      tempTeams[index] = zero;
      setTeams(tempTeams);
    };

    swap();

    const curr = localStorage.getItem("team");
    if (curr) {
      setTeam(JSON.parse(curr));
    } else {
      navigate("/");
      toast.error("Please select a team");
    }
  }, []);

  const getPlayersByRole = (players: any, role: any) =>
    players.filter((player: any) => player.Role === role);

  return (
    <div className="p-6 bg-gradient-to-br from-sky-100 to-blue-300 min-h-screen">
      <h1 className="text-2xl font-bold text-center mb-8 text-gray-800">
        Teams Overview
      </h1>
      {teams.map((team, idx) => (
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
