import React, { useEffect, useState } from "react";
import { NavigateFunction, useNavigate } from "react-router-dom";

const StartPage: React.FC = () => {
  const navigate: NavigateFunction = useNavigate();
  const [team, setTeam] = useState<string>();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const selectedTeam = (
      e.currentTarget.elements.namedItem("team") as HTMLSelectElement
    ).value;
    localStorage.setItem("team", selectedTeam);
    setTeam(selectedTeam);
    navigate("/auction");
  };

  useEffect(() => {
    const selectedTeam = localStorage.getItem("team");
    if (selectedTeam) {
      setTeam(selectedTeam);
    }
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen bg-blue-300">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold text-center text-gray-700 mb-6">
          Select Your Team
        </h1>
        <h4 className="font-bold text-center text-gray-800 mb-6">
          Current Team: {team?.toLocaleUpperCase()}
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
              <option value="rcb">RCB</option>
              <option value="csk">CSK</option>
              <option value="mi">MI</option>
            </select>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-md shadow-md transition"
          >
            Enter
          </button>
        </form>
      </div>
    </div>
  );
};

export default StartPage;
