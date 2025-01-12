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

const AuctionPage: React.FC = () => {
  const navigate = useNavigate();
  const [team, setTeam] = useState<string>("");
  const [marqueePlayers, setMarqueePlayers] = useState<
    {
      name: string;
      role: string;
      base: number;
      country: string;
    }[]
  >(mp);
  const [marqueeBatter, setMarqueeBatter] = useState<
    {
      name: string;
      role: string;
      base: number;
      country: string;
    }[]
  >(mbat);
  const [marqueeBowler, setMarqueeBowler] = useState<
    {
      name: string;
      role: string;
      base: number;
      country: string;
    }[]
  >(mbowl);
  const [marqueeAllRounder, setMarqueeAllRounder] = useState<
    {
      name: string;
      role: string;
      base: number;
      country: string;
    }[]
  >(mar);
  const [marqueeWkBatter, setMarqueeWkBatter] = useState<
    {
      name: string;
      role: string;
      base: number;
      country: string;
    }[]
  >(mwk);

  useEffect(() => {
    const curr = localStorage.getItem("team");
    if (curr) {
      setTeam(curr);
    } else {
      navigate("/");
      toast.error("Please select a team");
    }
  }, []);

  return (
    <>
      {/* <div className="text-center text-lg font-bold mb-4">
        Current Team: {team.toLocaleUpperCase()}
      </div> */}
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
              <li className="flex justify-between items-center border-b border-gray-300">
                <span>RCB</span>
                <span>00CR</span>
                <span>120CR</span>
              </li>
              <li className="flex justify-between items-center border-b border-gray-300">
                <span>MI</span>
                <span>00CR</span>
                <span>120CR</span>
              </li>
              <li className="flex justify-between items-center border-b border-gray-300">
                <span>CSK</span>
                <span>00CR</span>
                <span>120CR</span>
              </li>
              <li className="flex justify-between items-center border-b border-gray-300">
                <span>DC</span>
                <span>00CR</span>
                <span>120CR</span>
              </li>
              <li className="flex justify-between items-center border-b border-gray-300">
                <span>KKR</span>
                <span>00CR</span>
                <span>120CR</span>
              </li>
              <li className="flex justify-between items-center border-b border-gray-300">
                <span>SRH</span>
                <span>00CR</span>
                <span>120CR</span>
              </li>
              <li className="flex justify-between items-center border-b border-gray-300">
                <span>RR</span>
                <span>00CR</span>
                <span>120CR</span>
              </li>
              <li className="flex justify-between items-center border-b border-gray-300">
                <span>PBKS</span>
                <span>00CR</span>
                <span>120CR</span>
              </li>
              <li className="flex justify-between items-center border-b border-gray-300">
                <span>LSG</span>
                <span>00CR</span>
                <span>120CR</span>
              </li>
              <li className="flex justify-between items-center border-b border-gray-300">
                <span>GT</span>
                <span>00CR</span>
                <span>120CR</span>
              </li>
            </ul>
          </div>

          {/* // Player Info for Bid */}
          <div className="bg-gray-200 h-full flex items-center justify-center">
            2
          </div>

          {/* // User Team Information */}
          <div className="bg-gray-300 h-full flex items-center justify-center">
            3
          </div>
        </div>

        <div className="grid grid-cols-3">
          {/* // Teams Bid Status */}
          <div className="bg-gray-100 h-full flex items-center justify-center">
            4
          </div>

          {/* // Current Bid */}
          <div className="bg-gray-200 h-full flex items-center justify-center">
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
