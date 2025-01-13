import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  marqueeAllRounder as mar,
  marqueeBatter as mbat,
  marqueeBowler as mbowl,
  marqueePlayers as mp,
  marqueeWkBatter as mwk,
} from "../utils/players.ts";
import { CR } from "../utils/getCR.ts";
import { teamsAtom } from "../atoms/teamsAtom.ts";
import { useRecoilState } from "recoil";

const AuctionPage: React.FC = () => {
  const navigate = useNavigate();
  const [team, setTeam] = useState<string>("");
  const [teams, setTeams] = useRecoilState(teamsAtom);
  const [players, setPlayers] = useState<
    {
      name: string;
      role: string;
      base: number;
      country: string;
      type: string;
    }[]
  >([...mp, ...mbat, ...mbowl, ...mwk, ...mar]);
  const [curr, setCurr] = useState<number>(0);

  useEffect(() => {
    const curr = localStorage.getItem("team");
    if (curr) {
      setTeam(curr);
    } else {
      navigate("/");
      toast.error("Please select a team");
    }
  }, []);

  const handleContinue = (): void => {
    if (curr >= players.length) {
      console.log("No more players bro.");
      return;
    }

    const num = Math.floor(Math.random() * teams.length);

    const player = players[curr];
    let randomPrice = parseFloat(
      CR(player.base + Math.floor(Math.random() * (10 * player.base))).toFixed(
        1
      )
    );

    const updatedTeams = teams.map((team, index) => {
      if (index === num) {
        const newSpent = team.spent + randomPrice;
        const newRemaining = team.remaining - randomPrice;

        return {
          ...team,
          spent: newSpent,
          remaining: newRemaining,
          players: [...team.players, { ...player, price: randomPrice }],
        };
      }
      return team;
    });

    setTeams(updatedTeams);
    setCurr(curr + 1);
  };

  const handleBid = (): void => {
    let price = players[curr].base;
    price += 2000000;

    setPlayers((prevPlayers) => {
      const updatedPlayers = [...prevPlayers];
      updatedPlayers[curr].base = price;
      return updatedPlayers;
    });
  };

  return (
    <>
      {/* <div className="text-center text-lg font-bold mb-4">
        Current Team: {team.toLocaleUpperCase()}
      </div> */}
      {console.log(teams)}
      <div className="grid grid-rows-2 h-screen">
        <div className="grid grid-cols-3">
          {/* // Purse bros */}
          <div className="bg-gray-100 h-full overflow-y-auto p-1">
            <ul className="list-none space-y-1">
              <li className="flex justify-between items-center border-b border-gray-300">
                <span>Team</span>
                <span>Spent</span>
                <span>Remaining</span>
              </li>
              {teams.map((team) => (
                <li
                  key={team.name}
                  className="flex justify-between items-center border-b border-gray-300"
                >
                  <span>{team.name}</span>
                  <span>{team.spent.toFixed(1)}</span>
                  <span>{team.remaining.toFixed(1)}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* // Player Info for Bid */}
          <div className="bg-gray-200 h-full flex items-center justify-center">
            <div className="p-10 bg-gray-50 rounded-lg shadow-lg max-w-lg">
              <h1 className="text-2xl font-bold mb-4">{players[curr].type}</h1>
              <h2 className="text-xl font-semibold mb-2">
                {players[curr].name}
              </h2>
              <p className="text-gray-600 mb-2">Role: {players[curr].role}</p>
              <p className="text-gray-600 mb-2">
                Base Price: {CR(players[curr].base)} CR
              </p>
              <p className="text-gray-600 mb-4">
                Country: {players[curr].country}
              </p>

              <div className="flex justify-between">
                <button
                  className="px-6 py-2 bg-red-500 text-white font-semibold rounded-md hover:bg-red-600 transition duration-300 mr-4"
                  onClick={handleContinue}
                >
                  Skip
                </button>
                <button
                  className="px-6 py-2 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 transition duration-300"
                  onClick={handleBid}
                >
                  Bid
                </button>
              </div>
            </div>
          </div>

          {/* // Teams Bid Status */}
          <div className="bg-gray-100 h-full">
            Bidding Status
          </div>
        </div>

        <div className="grid grid-cols-3">
          {/* // User Team Information */}
          <div className="bg-gray-300 h-full">
            <h1 className="text-xl font-bold mb-4">
              Your Team: {team.toLocaleUpperCase()}
            </h1>
            <ul className="rounded">
              <li className="mb-2 text-gray-700 font-medium">Batters: {0}</li>
              <li className="mb-2 text-gray-700 font-medium">Bowlers: {0}</li>
              <li className="mb-2 text-gray-700 font-medium">
                All-Rounders: {0}
              </li>
              <li className="mb-2 text-gray-700 font-medium">
                Wicketkeepers: {0}
              </li>
              <li className="mb-2 text-gray-700 font-medium">
                Overseas Players: {0}
              </li>
              <li className="mt-4 text-lg font-bold text-gray-900">
                Total: {0} / 25
              </li>
            </ul>

            <button
              className="rounded-md bg-blue-400"
              onClick={() => navigate("/teams")}
            >
              Other Teams
            </button>
          </div>

          {/* // Current Bid */}
          <div className="bg-gray-100 h-full flex items-center justify-center">
            5
          </div>

          {/* // Recent */}
          <div className="bg-gray-300 h-full flex items-center justify-center">
            6
          </div>
        </div>
      </div>
    </>
  );
};

export default AuctionPage;
