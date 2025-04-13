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

  const getCountryFlag = (country: string) => {
    const countryMap: Record<string, string> = {
      "India": "🇮🇳",
      "Australia": "🇦🇺",
      "England": "🏴󠁧󠁢󠁥󠁮󠁧󠁿",
      "New Zealand": "🇳🇿",
      "South Africa": "🇿🇦",
      "West Indies": "🏝️",
      "Pakistan": "🇵🇰",
      "Sri Lanka": "🇱🇰",
      "Bangladesh": "🇧🇩",
      "Afghanistan": "🇦🇫",
    };
    return countryMap[country] || "";
  };

  const getIcon = (role?: string) => {
    if (!role) return "";
    if (role.includes("BATTER")) return "🏏";
    if (role.includes("BOWLER")) return "🎯";
    if (role.includes("ALL-ROUNDER")) return "⚡";
    if (role.includes("WICKET")) return "🧤";
    return "";
  };

  const getTheme = () => {
    if (!player.Role) return "from-blue-700 to-blue-900";
    if (player.Role.includes("BATTER")) return "from-red-700 to-red-900";
    if (player.Role.includes("BOWLER")) return "from-green-700 to-green-900";
    if (player.Role.includes("ALL-ROUNDER"))
      return "from-purple-700 to-purple-900";
    if (player.Role.includes("WICKET")) return "from-amber-700 to-amber-900";
    return "from-blue-700 to-blue-900";
  };

  const multiBro = squadPlayer?.stats?.batting && squadPlayer?.stats?.bowling;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-70">
      <div
        ref={cardRef}
        className={`bg-gradient-to-br ${getTheme()} rounded-xl shadow-2xl w-full max-w-4xl overflow-hidden transition-all duration-300 transform max-h-[85vh]`}
      >
        <div className="relative p-5 text-white">
          <div className="absolute top-4 right-4">
            <button
              className="p-2 bg-white bg-opacity-20 rounded-full hover:bg-opacity-30 transition duration-300 text-white"
              onClick={onClose}
              aria-label="Close"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <div className="flex items-center mb-2">
            <span className="text-4xl mr-3">{getIcon(player.Role)}</span>
            <h2 className="text-3xl font-bold tracking-tight">
              {player.First_Name} {player.Surname}
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-sm opacity-90">
            <div className="flex items-center bg-white bg-opacity-20 px-3 py-1 rounded-full">
              <span className="mr-2 text-lg">
                {getCountryFlag(player.Country)}
              </span>
              {player.Country}
            </div>
            {player.Role && (
              <div className="bg-white bg-opacity-20 px-3 py-1 rounded-full">
                {player.Role}
              </div>
            )}
            <div className="flex items-center bg-white bg-opacity-20 px-3 py-1 rounded-full">
              Age: {player.Age}
            </div>
            {/* {player.Base > 0 && (
              <div className="bg-white bg-opacity-20 px-3 py-1 rounded-full">
                Base Price: ₹{(player.Base / 10).toFixed(1)}Cr
              </div>
            )} */}
          </div>
        </div>

        <div
          className="bg-gray-900 p-5 rounded-t-3xl overflow-y-auto"
          style={{ maxHeight: "calc(85vh - 120px)" }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="bg-gray-800 rounded-xl p-4 shadow-md text-gray-200">
              <h3 className="text-xl font-bold mb-3 text-white border-b border-gray-700 pb-2">
                Player Details
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-400">Set:</span>
                  <span>{player.Set}</span>
                </div>
                {player.State && (
                  <div className="flex justify-between">
                    <span className="text-gray-400">State:</span>
                    <span>{player.State}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-400">DOB:</span>
                  <span>{player.DOB}</span>
                </div>
                {player.Bat_type && (
                  <div className="flex justify-between">
                    <span className="text-gray-400">Batting:</span>
                    <span>{player.Bat_type}</span>
                  </div>
                )}
                {player.Bowl_type && (
                  <div className="flex justify-between">
                    <span className="text-gray-400">Bowling:</span>
                    <span>{player.Bowl_type}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-400">Capped:</span>
                  <span>{player.Capped || "No"}</span>
                </div>
              </div>

              <h3 className="text-xl font-bold my-3 text-white border-b border-gray-700 pb-2 mt-6">
                Career Stats
              </h3>
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-gray-700 bg-opacity-30 p-2 rounded-lg text-center">
                  <div className="text-xs text-gray-400">Test</div>
                  <div>{player.Test_caps || "0"}</div>
                </div>
                <div className="bg-gray-700 bg-opacity-30 p-2 rounded-lg text-center">
                  <div className="text-xs text-gray-400">ODI</div>
                  <div>{player.ODI_caps || "0"}</div>
                </div>
                <div className="bg-gray-700 bg-opacity-30 p-2 rounded-lg text-center">
                  <div className="text-xs text-gray-400">T20</div>
                  <div>{player.T20_caps || "0"}</div>
                </div>
                <div className="bg-gray-700 bg-opacity-30 p-2 rounded-lg text-center">
                  <div className="text-xs text-gray-400">IPL</div>
                  <div>{player.IPL_caps || "0"}</div>
                </div>
              </div>

              <h3 className="text-xl font-bold my-3 text-white border-b border-gray-700 pb-2 mt-6">
                Team History
              </h3>
              <div className="space-y-2">
                {player.Last_Team && (
                  <div className="flex justify-between">
                    <span className="text-gray-400">Last Team:</span>
                    <span>{player.Last_Team}</span>
                  </div>
                )}
                {player.prev && (
                  <div className="flex justify-between">
                    <span className="text-gray-400">Previous Teams:</span>
                    <span>{player.prev}</span>
                  </div>
                )}
                {player.RTM && (
                  <div className="flex justify-between">
                    <span className="text-gray-400">RTM Team:</span>
                    <span>{player.RTM}</span>
                  </div>
                )}
              </div>
            </div>

            <div
              className={`${
                multiBro ? "grid lg:grid-cols-2 gap-4" : ""
              } lg:col-span-2`}
            >
              {squadPlayer?.stats?.batting && (
                <div className="bg-gray-800 rounded-xl p-4 shadow-md text-gray-200 h-full">
                  <h3 className="text-xl font-bold mb-3 text-white border-b border-gray-700 pb-2 flex items-center">
                    <span className="mr-2">🏏</span> Batting Stats
                  </h3>
                  <div className="overflow-hidden rounded-lg">
                    <table className="w-full text-left">
                      <thead className="bg-gray-700 text-gray-300 text-sm">
                        <tr>
                          <th className="p-3">Stat</th>
                          <th className="p-3">Value</th>
                        </tr>
                      </thead>
                      <tbody>
                        {squadPlayer.stats.batting.map((stat, index) => (
                          <tr
                            key={index}
                            className={
                              index % 2 === 0 ? "bg-gray-700 bg-opacity-30" : ""
                            }
                          >
                            <td className="p-3 text-gray-400">{stat.label}</td>
                            <td className="p-3 font-medium">{stat.value}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {squadPlayer?.stats?.bowling && (
                <div className="bg-gray-800 rounded-xl p-4 shadow-md text-gray-200 h-full mt-4 lg:mt-0">
                  <h3 className="text-xl font-bold mb-3 text-white border-b border-gray-700 pb-2 flex items-center">
                    <span className="mr-2">🎯</span> Bowling Stats
                  </h3>
                  <div className="overflow-hidden rounded-lg">
                    <table className="w-full text-left">
                      <thead className="bg-gray-700 text-gray-300 text-sm">
                        <tr>
                          <th className="p-3">Stat</th>
                          <th className="p-3">Value</th>
                        </tr>
                      </thead>
                      <tbody>
                        {squadPlayer.stats.bowling.map((stat, index) => (
                          <tr
                            key={index}
                            className={
                              index % 2 === 0 ? "bg-gray-700 bg-opacity-30" : ""
                            }
                          >
                            <td className="p-3 text-gray-400">{stat.label}</td>
                            <td className="p-3 font-medium">{stat.value}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {!squadPlayer?.stats?.batting && !squadPlayer?.stats?.bowling && (
                <div className="bg-gray-800 rounded-xl p-4 shadow-md text-gray-200 flex items-center justify-center">
                  <div className="text-center py-16">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-16 w-16 mx-auto text-gray-500 mb-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                    <h3 className="text-gray-500 text-lg">
                      No detailed statistics available for this player
                    </h3>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end mt-6">
            <button
              className="px-5 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg shadow-md transition duration-300 flex items-center gap-2"
              onClick={onClose}
            >
              Close
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Card;
