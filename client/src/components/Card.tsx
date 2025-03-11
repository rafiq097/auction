/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useRef } from "react";
import teamsData from "../utils/squads.json";

interface Player {
  Set: string;
  First_Name: string;
  Surname?: string;
  Country: string;
  State?: string;
  DOB: string;
  Age: number;
  Role?: string;
  Bat_type?: string;
  Bowl_type?: string;
  Test_caps?: number;
  ODI_caps?: number;
  T20_caps?: number;
  IPL_caps?: number;
  prev?: string;
  Last_Team?: string;
  Last_IPL_played?: number;
  Capped?: string;
  Base: number;
  RTM?: string;
}

const Card: React.FC<{ player: Player; onClose: any }> = ({
  player,
  onClose,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const squadPlayer = teamsData
    .flatMap((team) => team.players)
    .find(
      (p) =>
        p.name.toLowerCase() ===
        `${player.First_Name} ${player.Surname || ""}`.toLowerCase()
    );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (cardRef.current && !cardRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  return (
    <div
      ref={cardRef}
      className="bg-white border border-gray-300 rounded-lg p-4 shadow-lg w-full max-w-xs sm:max-w-md md:max-w-2xl lg:max-w-4xl mx-auto max-h-[90vh] overflow-y-auto"
    >
      <h2 className="text-2xl font-bold text-center mb-2">
        {player.First_Name} {player.Surname}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white-100 p-4 rounded-lg">
          <h3 className="text-xl font-bold mb-2">Player Details</h3>
          <p className="mb-2">
            <strong>Set:</strong> {player.Set}
          </p>
          <p className="mb-2">
            <strong>Country:</strong> {player.Country}
          </p>
          <p className="mb-2">
            <strong>State:</strong> {player.State || "N/A"}
          </p>
          <p className="mb-2">
            <strong>Date of Birth:</strong> {player.DOB}
          </p>
          <p className="mb-2">
            <strong>Age:</strong> {player.Age}
          </p>
          <p className="mb-2">
            <strong>Role:</strong>{" "}
            {player.Role === "BATTER"
              ? `${player.Role} - ${player.Bat_type}`
              : player.Role === "BOWLER"
              ? `${player.Role} - ${player.Bowl_type}`
              : player.Role}
          </p>
          <p className="mb-2">
            <strong>Test Caps:</strong> {player.Test_caps || "N/A"}
          </p>
          <p className="mb-2">
            <strong>ODI Caps:</strong> {player.ODI_caps || "N/A"}
          </p>
          <p className="mb-2">
            <strong>T20 Caps:</strong> {player.T20_caps || "N/A"}
          </p>
          <p className="mb-2">
            <strong>IPL Caps:</strong> {player.IPL_caps || "N/A"}
          </p>
          <p className="mb-2">
            <strong>Last Team:</strong> {player.Last_Team || "N/A"}
          </p>
          <p className="mb-2">
            <strong>Previous Teams:</strong> {player.prev || "N/A"}
          </p>
          <p className="mb-2">
            <strong>RTM Team:</strong> {player.RTM || "N/A"}
          </p>
          <p className="mb-2">
            <strong>Capped:</strong> {player.Capped || "N/A"}
          </p>
        </div>

        {squadPlayer?.stats?.batting && (
          <div className="bg-white-100 p-4 rounded-lg">
            <h3 className="text-xl font-bold mb-2">Batting Stats</h3>
            <table className="table-auto w-full text-left border-collapse">
              <thead>
                <tr>
                  <th className="border px-2 py-1">Label</th>
                  <th className="border px-2 py-1">Value</th>
                </tr>
              </thead>
              <tbody>
                {squadPlayer.stats.batting.map((stat, index) => (
                  <tr key={index}>
                    <td className="border px-2 py-1">{stat.label}</td>
                    <td className="border px-2 py-1">{stat.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {squadPlayer?.stats?.bowling && (
          <div className="bg-white-100 p-4 rounded-lg">
            <h3 className="text-xl font-bold mb-2">Bowling Stats</h3>
            <table className="table-auto w-full text-left border-collapse">
              <thead>
                <tr>
                  <th className="border px-2 py-1">Label</th>
                  <th className="border px-2 py-1">Value</th>
                </tr>
              </thead>
              <tbody>
                {squadPlayer.stats.bowling.map((stat, index) => (
                  <tr key={index}>
                    <td className="border px-2 py-1">{stat.label}</td>
                    <td className="border px-2 py-1">{stat.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="flex justify-end mt-4">
        <button
          className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition duration-300"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default Card;
