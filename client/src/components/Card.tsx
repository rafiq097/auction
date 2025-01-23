import React from "react";

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
  return (
    <div className="bg-white rounded-lg p-6 w-96 shadow-lg">
      <h2 className="text-2xl font-bold mb-4">
        {player.First_Name} {player.Surname}
      </h2>
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
      <div className="flex justify-end">
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
