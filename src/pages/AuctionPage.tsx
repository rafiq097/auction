import React, { useEffect, useState } from "react";
import { NavigateFunction, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const AuctionPage: React.FC = () => {
  const navigate: NavigateFunction = useNavigate();
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

  return <div>Current Team: {team.toLocaleUpperCase()}</div>;
};

export default AuctionPage;
