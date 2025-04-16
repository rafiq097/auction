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
import BottomBar from "../components/BottomBar.tsx";

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
    players?.filter((player: any) => player.Role === role);

  return (
    <div className="mx-auto px-6 py-6">
      <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">Teams Overview</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {teams?.map((team, idx) => (
          <div
            key={team?.name}
            className={`bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 ${idx === 9 ? "mb-8" : "mb-1"}
            `}
          >
            <div className="bg-gradient-to-r from-blue-400 to-blue-500 text-white py-3 px-4 font-semibold">
              {team?.name} - {team?.players?.length} Players
            </div>

            <div className="p-4">
              {["BATTER", "WICKETKEEPER", "ALL-ROUNDER", "BOWLER"].map((role) => {
                const rolePlayers = getPlayersByRole(team?.players, role);
                if (rolePlayers.length === 0) return null;

                return (
                  <div key={role} className="mb-4 last:mb-0">
                    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">{role}</h3>
                    <div className="space-y-2">
                      {rolePlayers?.map((player: any) => (
                        <div
                          key={player.First_Name}
                          className="flex justify-between items-center bg-gra-50 rounded-md p-3 hover:bg-gray-100 transition"
                        >
                          <span className="flex items-center gap-2 text-gray-800 font-medium">
                            {player.First_Name} {player.Surname}
                            {player.Country !== "India" && (
                              <FaPlane className="text-blue-500" />
                            )}
                          </span>
                          <span className="text-green-600 font-semibold">₹{player.price} CR</span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <BottomBar />
    </div>
  );
};

export default TeamsPage;