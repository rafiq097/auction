/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect } from "react";
import { NavigateFunction, useNavigate } from "react-router-dom";
import { userTeamAtom } from "../atoms/userTeamAtom.ts";
import { useRecoilState } from "recoil";
import axios from "axios";
import userAtom from "../atoms/userAtom.ts";
import { toast } from "react-hot-toast";
import BottomBar from "../components/BottomBar.tsx";

const StartPage: React.FC = () => {
  const navigate: NavigateFunction = useNavigate();
  const [team, setTeam] = useRecoilState(userTeamAtom);
  const [, setUserData] = useRecoilState(userAtom);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const selectedTeam = (
      e.currentTarget.elements.namedItem("team") as HTMLSelectElement
    ).value;

    localStorage.setItem(
      "team",
      JSON.stringify({
        name: selectedTeam,
        spent: 0,
        remaining: 120,
        players: [],
        batters: 0,
        bowlers: 0,
        wks: 0,
        allr: 0,
        overseas: 0,
      })
    );
    setTeam({
      name: selectedTeam,
      spent: 0,
      remaining: 120,
      players: [],
      batters: 0,
      bowlers: 0,
      wks: 0,
      allr: 0,
      overseas: 0,
    });
    navigate("/auction");
  };

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
  }, [setUserData]);

  useEffect(() => {
    const temp = localStorage.getItem("team");
    if (temp) {
      setTeam(JSON.parse(temp));
    } else {
      toast.error("Please select a team");
      navigate("/");
    }
  }, []);

  return (
    <div
      className="flex items-center justify-center min-h-screen bg-cover bg-center bg-gradient-to-br from-blue-800 via-purple-900 to-gray-900 text-white"
      style={{
        backgroundImage: "url('bg.jpeg')",
        filter: "brightness(1.1) contrast(1.2)",
      }}
    >
      <div className="bg-white/10 backdrop-blur-md shadow-xl rounded-2xl p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-6 text-black">
          Select Your Team
        </h1>
        <h4 className="text-lg font-semibold text-center mb-4 text-black">
          Current Team: {team.name?.toLocaleUpperCase()}
        </h4>
        <form onSubmit={handleSubmit}>
          <label htmlFor="team" className="block text-sm font-medium mb-2">
            Choose a Team
          </label>
          <select
            id="team"
            name="team"
            title="name"
            className="block w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 mb-6 text-black"
          >
            <option value="RCB">RCB</option>
            <option value="CSK">CSK</option>
            <option value="MI">MI</option>
            <option value="SRH">SRH</option>
            <option value="KKR">KKR</option>
            <option value="RR">RR</option>
            <option value="DC">DC</option>
            <option value="LSG">LSG</option>
            <option value="GT">GT</option>
            <option value="PBKS">PBKS</option>
          </select>
          <button
            type="submit"
            className="w-full bg-green-700 hover:bg-green-800 text-white font-semibold py-2 px-4 rounded-md shadow-md transition duration-300 ease-in-out"
          >
            Play Against Computer
          </button>
        </form>
        <button
          onClick={() => navigate("/rooms")}
          className="mt-4 w-full bg-blue-700 hover:bg-blue-800 text-white font-semibold py-2 px-4 rounded-md shadow-md transition duration-300 ease-in-out"
        >
          Compete with Friemds!
        </button>
      </div>

      <BottomBar />
    </div>
  );
};

export default StartPage;
