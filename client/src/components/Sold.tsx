import React from "react";
import { CR } from "../utils/getCR";

interface SoldProps {
  player: string;
  team: string;
  price: number;
}

const teamColors: Record<string, { primary: string; secondary: string }> = {
  MI: { primary: "bg-blue-600", secondary: "text-blue-100" },
  CSK: { primary: "bg-yellow-500", secondary: "text-yellow-100" },
  RCB: { primary: "bg-red-600", secondary: "text-red-100" },
  KKR: { primary: "bg-purple-600", secondary: "text-purple-100" },
  DC: { primary: "bg-blue-500", secondary: "text-blue-100" },
  RR: { primary: "bg-pink-500", secondary: "text-pink-100" },
  PBKS: { primary: "bg-red-500", secondary: "text-red-100" },
  SRH: { primary: "bg-orange-500", secondary: "text-orange-100" },
  GT: { primary: "bg-blue-700", secondary: "text-blue-100" },
  LSG: { primary: "bg-teal-500", secondary: "text-teal-100" },
  default: { primary: "bg-gray-700", secondary: "text-gray-100" },
};

const Sold: React.FC<SoldProps> = ({ player, team, price }) => {
    console.log(player, team, price);
  const teamColor = teamColors[team] || teamColors["default"];

  return (
    <div className="relative inline-flex flex-col items-center z-50">
      <div
        className={`${teamColor.primary} ${teamColor.secondary} rounded-full w-40 h-40 flex flex-col items-center justify-center shadow-lg transform transition-transform hover:scale-105`}
      >
        <span className="text-xl font-bold uppercase mb-1">Sold</span>
        <span className="text-2xl font-bold">{CR(price)} CR</span>
      </div>

      <div className="mt-4 text-center">
        <span className="block text-lg text-gray-200">to</span>
        <span
          className={`block font-bold text-2xl ${teamColor.primary.replace(
            "bg-",
            "text-"
          )}`}
        >
          {team}
        </span>
      </div>

      <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-75 text-white px-3 py-2 rounded text-base whitespace-nowrap z-50">
        {player}
      </div>
    </div>
  );
};

export default Sold;
