/* eslint-disable @typescript-eslint/no-explicit-any */
import { FaPlane } from "react-icons/fa";
import { CR } from "../utils/getCR";

const UserTeam = ({ team }: any) => {
  const getPlayersByRole = (players: any, role: any) =>
    players.filter((player: any) => player.Role === role);

  return (
    <div
      key={team.id}
      className={`bg-white rounded-lg shadow-md overflow-hidden border border-gray-200`}
    >
      <div className="bg-gradient-to-r from-blue-400 to-blue-500 text-white py-3 px-4 font-semibold">
        {team.name}
        <span className="ml-2 text-sm bg-white text-blue-600 px-2 py-1 rounded-full">
          {team.players.length} players
        </span>
      </div>

      <div className="p-4">
        {["BATTER", "WICKETKEEPER", "ALL-ROUNDER", "BOWLER"].map((role) => {
          const rolePlayers = getPlayersByRole(team.players, role);
          if (rolePlayers.length === 0) return null;

          return (
            <div key={role} className="mb-4 last:mb-0">
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">
                {role}
                <span className="ml-2 text-sm bg-blue-400 text-white px-2 py-1 rounded-full">
                  {role === "BATTER"
                    ? team.batters
                    : role === "WICKETKEEPER"
                    ? team.wks
                    : role === "ALL-ROUNDER"
                    ? team.allr
                    : team.bowlers}{" "}
                  players
                </span>
              </h3>

              <div className="space-y-2">
                {rolePlayers.map((player: any) => (
                  <div
                    key={player.id}
                    className="flex justify-between items-center bg-gray-50 rounded-md p-3 hover:bg-gray-100 transition"
                  >
                    <div className="flex items-center">
                      <div className="font-medium">
                        {player.First_Name} {player.Surname}
                      </div>
                      {player.Country !== "India" && (
                        <div className="ml-2 text-xs">
                          <FaPlane className="text-blue-500 inline mb-1" />
                        </div>
                      )}
                    </div>
                    <div className="text-green-600 font-semibold">
                      ₹{CR(player.price)} CR
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default UserTeam;
