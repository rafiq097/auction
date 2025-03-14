import React, { useEffect } from "react";
import { NavigateFunction, useNavigate } from "react-router-dom";
import { userTeamAtom } from "../atoms/userTeamAtom.ts";
import { useRecoilState } from "recoil";
import axios from "axios";
import userAtom from "../atoms/userAtom.ts";
import { toast } from "react-hot-toast";

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
      navigate("/auction");
    } else {
      toast.error("Please select a team");
      navigate("/");
    }
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen bg-cover bg-center" style={{ backgroundImage: "url('bg.jpeg')", filter: "brightness(1.1) contrast(1.2)", }}>
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold text-center text-gray-700 mb-6">
          Select Your Team
        </h1>
        <h4 className="font-bold text-center text-gray-800 mb-6">
          Current Team: {team.name?.toLocaleUpperCase()}
        </h4>
        <form onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor="team"
              className="block text-sm font-medium text-gray-600"
            >
              Choose a Team
            </label>
            <select
              id="team"
              name="team"
              title="name"
              className="mt-1 block w-full px-4 py-2 text-gray-700 bg-gray-50 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 mb-6"
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
          </div>
          <button
            type="submit"
            className="w-full mb-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-md shadow-md transition"
          >
            Enter
          </button>
        </form>
        <button
          type="submit"
          onClick={() => navigate("/rooms")}
          className="w-1/2 bg-orange-400 hover:bg-orange-500 text-white font-semibold py-1 px-2 rounded-md shadow-md transition"
        >
          Compete with Friemds!
        </button>
      </div>
    </div>
  );
};

export default StartPage;
