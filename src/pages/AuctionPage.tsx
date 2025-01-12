import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const AuctionPage: React.FC = () => {
  const navigate = useNavigate();
  const [team, setTeam] = useState<string>("");

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
          <div className="bg-red-200 h-full flex items-center justify-center">
            2
          </div>

          {/* // User Team Information */}
          <div className="bg-red-300 h-full flex items-center justify-center">
            3
          </div>
        </div>

        <div className="grid grid-cols-3">

          {/* // Teams Bid Status */}
          <div className="bg-blue-100 h-full flex items-center justify-center">
            4
          </div>

          {/* // Current Bid */}
          <div className="bg-blue-200 h-full flex items-center justify-center">
            5
          </div>

          {/* // Recent */}
          <div className="bg-blue-300 h-full flex items-center justify-center">
            6
          </div>
        </div>
      </div>
    </>
  );
};

export default AuctionPage;
