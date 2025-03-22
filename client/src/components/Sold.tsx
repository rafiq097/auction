import React from "react";
import { CR } from "../utils/getCR";

interface SoldProps {
  player: string;
  team: string;
  price: number;
}

const teamBros: Record<
  string,
  { primary: string; secondary: string; bg: string }
> = {
  MI: { primary: "bg-blue-600", secondary: "text-blue-100", bg: "MI.jpg" },
  CSK: {
    primary: "bg-yellow-500",
    secondary: "text-yellow-100",
    bg: "CSK.jpg",
  },
  RCB: { primary: "bg-red-600", secondary: "text-red-100", bg: "RCB.jpg" },
  KKR: {
    primary: "bg-purple-600",
    secondary: "text-purple-100",
    bg: "KKR.jpg",
  },
  DC: { primary: "bg-blue-500", secondary: "text-blue-100", bg: "DC.jpg" },
  RR: { primary: "bg-pink-500", secondary: "text-pink-100", bg: "RR.jpg" },
  PBKS: { primary: "bg-red-500", secondary: "text-red-100", bg: "PBKS.jpg" },
  SRH: {
    primary: "bg-orange-500",
    secondary: "text-orange-100",
    bg: "SRH.jpg",
  },
  GT: { primary: "bg-blue-700", secondary: "text-blue-100", bg: "GT.jpg" },
  LSG: { primary: "bg-teal-500", secondary: "text-teal-100", bg: "LSG.jpg" },
  default: {
    primary: "bg-gray-700",
    secondary: "text-gray-100",
    bg: "RCB.jpg",
  },
};

const Sold: React.FC<SoldProps> = ({ player, team, price }) => {
  console.log(player, team, price);
  const teamBro = teamBros[team] || teamBros["default"];

  const bgColor = teamBro.secondary.replace("text-", "bg-");

  return (
    <div className="relative inline-flex flex-col items-center z-10">
      <div className="relative w-40 h-40 rounded-full shadow-lg transform transition-transform hover:scale-105 overflow-hidden">
        <div
          className="absolute inset-0 w-full h-full bg-cover bg-center"
          style={{
            backgroundImage: `url(/${teamBro.bg})`,
            backgroundSize: "cover",
            filter: "contrast(1.2) brightness(1.1)",
          }}
        />

        <div
          className={`absolute inset-0 w-full h-full ${teamBro.primary} opacity-20`}
        ></div>

        <div className="absolute inset-0 flex items-center justify-center">
          <div className="rounded-full bg-opacity-30 p-4 flex flex-col items-center justify-center">
            <span
              className="text-xl font-bold uppercase mb-1 text-white drop-shadow-lg"
              style={{ textShadow: "0 0 3px rgba(0,0,0,0.8)" }}
            >
              Sold
            </span>
            <span
              className="text-2xl font-bold text-white drop-shadow-lg"
              style={{ textShadow: "0 0 3px rgba(0,0,0,0.8)" }}
            >
              {CR(price)} CR
            </span>
          </div>
        </div>
      </div>

      <div className="mt-4 text-center">
        <span className="block text-lg text-gray-200">to</span>
        <span
          className={`block font-bold text-2xl ${teamBro.primary.replace(
            "bg-",
            "text-"
          )}`}
        >
          {team}
        </span>
      </div>

      <div
        className={`absolute -top-12 left-1/2 transform -translate-x-1/2 ${bgColor} text-gray-800 px-3 py-2 rounded text-base font-semibold whitespace-nowrap z-50 shadow-md`}
      >
        {player}
      </div>
    </div>
  );
};

export default Sold;
