import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  marqueeAllRounder as mar,
  marqueeBatter as mbat,
  marqueeBowler as mbowl,
  marqueePlayers as mp,
  marqueeWkBatter as mwk,
  batters as bat,
  bowlers as bowl,
  allRounders as ar,
  wkBatters as wk,
} from "../utils/players.ts";
import { CR } from "../utils/getCR.ts";
import { useRecoilState } from "recoil";
import { teamsAtom } from "../atoms/teamsAtom.ts";
import { userTeamAtom } from "../atoms/userTeamAtom.ts";
import { currAtom } from "../atoms/currAtom.ts";

const AuctionPage: React.FC = () => {
  const navigate = useNavigate();
  const [team, setTeam] = useRecoilState(userTeamAtom);
  const [teams, setTeams] = useRecoilState(teamsAtom);
  const [curr, setCurr] = useRecoilState(currAtom);
  const [players, setPlayers] = useState<
    {
      name: string;
      role: string;
      base: number;
      country: string;
      type: string;
    }[]
  >([...mp, ...mbat, ...mbowl, ...mwk, ...mar, ...bat, ...bowl, ...ar, ...wk]);
  const [tempPlayers, setTempPlayers] = useState<
    {
      name: string;
      role: string;
      base: number;
      country: string;
      type: string;
    }[]
  >(
    [...mp, ...mbat, ...mbowl, ...mwk, ...mar, ...bat, ...bowl, ...ar, ...wk].map((player) => ({ ...player }))
  );
  const [soldBro, setSoldBro] = useState<{
    name: string;
    role: string;
    base: number;
    country: string;
    type: string;
    price: number;
    team: string;
  }>();
  const [biddingBros, setBiddingBros] = useState<
    {
      name: string;
      bid: number;
      round: number;
    }[]
  >([
    { name: "RCB", bid: 0, round: 0 },
    { name: "MI", bid: 0, round: 0 },
    { name: "CSK", bid: 0, round: 0 },
    { name: "DC", bid: 0, round: 0 },
    { name: "KKR", bid: 0, round: 0 },
    { name: "SRH", bid: 0, round: 0 },
    { name: "RR", bid: 0, round: 0 },
    { name: "PBKS", bid: 0, round: 0 },
    { name: "GT", bid: 0, round: 0 },
    { name: "LSG", bid: 0, round: 0 },
  ]);
  const [currentBid, setCurrentBid] = useState<{
    name: string;
    bid: number;
  }>();

  useEffect(() => {
    const curr = localStorage.getItem("team");
    if (curr) {
      setTeam(JSON.parse(curr));
    } else {
      navigate("/");
      toast.error("Please select a team");
    }
  }, []);

  const handleContinue = (): void => {
    if (curr >= players.length || soldBro?.name === players[curr].name) {
      toast.error("No more players bro.");
      return;
    }

    const player = tempPlayers[curr];
    let randomPrice = parseFloat(
      CR(player.base + Math.floor(Math.random() * 15) * player.base).toFixed(1)
    );
    if(currentBid?.bid)
      randomPrice = CR(currentBid.bid + 20000000);

    let num = Math.floor(Math.random() * teams.length);
    while (
      teams[num].name === team.name ||
      teams[num].remaining < randomPrice
    ) {
      num = Math.floor(Math.random() * teams.length);
    }

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

    const soldPlayer = { ...player, price: randomPrice, team: teams[num].name };
    // setCurrentBid({ name: teams[num].name, bid: soldPlayer.price });
    if (team.name == teams[num].name) {
      if (player.country != "India") {
        setTeam({ ...team, overseas: team.overseas + 1 });
      }
      if (player.role == "batter") {
        setTeam({ ...team, batters: team.batters + 1 });
      } else if (player.role == "bowler") {
        setTeam({ ...team, bowlers: team.bowlers + 1 });
      } else if (player.role == "wk-batter") {
        setTeam({ ...team, wks: team.wks + 1 });
      } else if (player.role == "all-rounder") {
        setTeam({ ...team, allr: team.allr + 1 });
      }
    }

    setSoldBro(soldPlayer);
    setTeams(updatedTeams);
    setCurrentBid({ name: "", bid: 0 });
    setBiddingBros([
      { name: "RCB", bid: 0, round: 0 },
      { name: "MI", bid: 0, round: 0 },
      { name: "CSK", bid: 0, round: 0 },
      { name: "DC", bid: 0, round: 0 },
      { name: "KKR", bid: 0, round: 0 },
      { name: "SRH", bid: 0, round: 0 },
      { name: "RR", bid: 0, round: 0 },
      { name: "PBKS", bid: 0, round: 0 },
      { name: "GT", bid: 0, round: 0 },
      { name: "LSG", bid: 0, round: 0 },
    ]);

    if (curr >= players.length - 1) {
      toast("No more players bro.");
      return;
    }
    setCurr(curr + 1);
  };

  const handleBid = (): void => {
    let price = players[curr].base;
    if (team.remaining < CR(price)) {
      toast.error("No Purse to Bid Bro");
      return;
    }
    price += 2000000;

    setBiddingBros((prevBros) =>
      prevBros.map((bro) =>
        bro.name === team.name ? { ...bro, bid: price } : bro
      )
    );

    setPlayers((prevPlayers) => {
      const updatedPlayers = [...prevPlayers];
      updatedPlayers[curr].base = price;
      return updatedPlayers;
    });
    setCurrentBid({ name: team.name, bid: price });

    let num = Math.floor(Math.random() * teams.length);
    while (teams[num].name === team.name && teams[num].remaining < price) {
      num = Math.floor(Math.random() * teams.length);
    }

    // price = players[curr].base;
    let otherPrice = price + 2000000;

    const index = biddingBros.findIndex(
      (team) => team.name === teams[num].name
    );
    if (biddingBros[index].round == 4) {
      toast.success("Congratulations You Won the Bid");

      const soldPlayer = {
        ...players[curr],
        base: tempPlayers[curr].base,
        price: CR(price),
        team: team.name,
      };
      if (players[curr].country != "India") {
        setTeam({ ...team, overseas: team.overseas + 1 });
      }
      if (players[curr].role == "batter") {
        setTeam({ ...team, batters: team.batters + 1 });
      } else if (players[curr].role == "bowler") {
        setTeam({ ...team, bowlers: team.bowlers + 1 });
      } else if (players[curr].role == "wk-batter") {
        setTeam({ ...team, wks: team.wks + 1 });
      } else if (players[curr].role == "all-rounder") {
        setTeam({ ...team, allr: team.allr + 1 });
      }
      setSoldBro(soldPlayer);
      setCurr(curr + 1);
      setCurrentBid({ name: "", bid: 0 });
      setBiddingBros([
        { name: "RCB", bid: 0, round: 0 },
        { name: "MI", bid: 0, round: 0 },
        { name: "CSK", bid: 0, round: 0 },
        { name: "DC", bid: 0, round: 0 },
        { name: "KKR", bid: 0, round: 0 },
        { name: "SRH", bid: 0, round: 0 },
        { name: "RR", bid: 0, round: 0 },
        { name: "PBKS", bid: 0, round: 0 },
        { name: "GT", bid: 0, round: 0 },
        { name: "LSG", bid: 0, round: 0 },
      ]);

      const updatedTeams = teams.map((x) => {
        if (x.name === team.name) {
          const newSpent = x.spent + CR(price);
          const newRemaining = x.remaining - CR(price);

          return {
            ...x,
            spent: newSpent,
            remaining: newRemaining,
            players: [...x.players, { ...players[curr], price }],
          };
        }
        return x;
      });

      setTeams(updatedTeams);
    } else {
      setTimeout(() => {
        setCurrentBid({ name: teams[num].name, bid: otherPrice });

        setBiddingBros((prevBros) =>
          prevBros.map((bro) =>
            bro.name === teams[num].name
              ? { ...bro, bid: otherPrice, round: bro.round + 1 }
              : bro
          )
        );

        setPlayers((prevPlayers) => {
          const updatedPlayers = [...prevPlayers];
          updatedPlayers[curr].base = otherPrice;
          return updatedPlayers;
        });
        toast.error(`Team ${teams[num].name} bid at ${CR(otherPrice)}CR`);
      }, 700);
    }
  };

  const handleReset = (): void => {
    localStorage.removeItem("team");
    localStorage.removeItem("teams");
    window.location.href = "/";
  };

  return (
    <>
      {/* <div className="text-center text-lg font-bold mb-4">
        Current Team: {team.toLocaleUpperCase()}
      </div> */}
      {/* {console.log(teams)} */}
      <div className="grid grid-rows-2 h-screen">
        <div className="grid grid-cols-3">
          {/* // Purse bros */}
          <div className="bg-gray-100 h-full overflow-y-auto p-1">
            <ul className="list-none space-y-1">
              <li className="bg-gray-200 flex justify-between items-center border-b border-gray-300">
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

          {/* // Player bros Bid */}
          <div className="bg-gray-300 h-full flex items-center justify-center">
            <div className="p-6 bg-gray-50 rounded-lg shadow-lg max-w-lg">
              <div className="flex justify-center">
                <button
                  className="px-6 py-2 bg-red-500 text-white font-semibold rounded-md hover:bg-red-600 transition duration-300 mb-2"
                  onClick={handleReset}
                >
                  Reset Auction
                </button>
              </div>
              <h1 className="text-2xl font-bold mb-2">{players[curr].type}</h1>
              <h2 className="text-xl font-semibold mb-2">
                {players[curr].name}
              </h2>
              <p className="text-gray-600 mb-2">Role: {players[curr].role}</p>
              <p className="text-gray-600 mb-2">
                Base Price: {CR(tempPlayers[curr].base)} CR
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

          {/* // Teams bros Bid Status */}
          <div className="bg-gray-100 h-full">
            <ul className="list-none space-y-1 ml-2 mr-4">
              <li className="bg-gray-200 flex justify-between items-center border-b border-gray-300">
                <span>Team</span>
                <span>Last Bid Price</span>
              </li>
              {biddingBros.map((team) => (
                <li
                  key={team.name}
                  className="flex justify-between items-center border-b border-gray-300"
                >
                  <span>{team.name}</span>
                  <span>{CR(team.bid).toFixed(1)}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="grid grid-cols-3">
          {/* // Last Bid */}
          <div className="bg-gray-300 h-full flex items-center justify-center">
            {soldBro ? (
              <div className="p-5 bg-gray-100 rounded-lg shadow-lg max-w-lg">
                Last Sold Bro
                <h1 className="text-2xl font-bold mb-4">{soldBro.type}</h1>
                <h2 className="text-xl font-semibold mb-2">{soldBro.name}</h2>
                <p className="text-gray-600 mb-2">Role: {soldBro.role}</p>
                <p className="text-gray-600 mb-2">
                  Base Price: {CR(soldBro.base)} CR
                </p>
                <p className="text-gray-600 mb-2">Country: {soldBro.country}</p>
                <p className="text-gray-600 mb-2">
                  Selling Price: {soldBro.price} CR
                </p>
                <p className="text-gray-600 mb-2">Sold to : {soldBro.team}</p>
              </div>
            ) : null}
          </div>

          {/* // Bid war */}
          <div className="bg-gray-100 h-full flex flex-col items-center justify-center p-4 rounded-lg shadow-md max-w-sm mx-auto">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Current Bid
            </h2>
            <div className="text-center">
              {currentBid ? (
                <>
                  {currentBid.bid > 20000 ? (
                    <p className="text-4xl text-green-600 font-extrabold">
                      ₹{CR(currentBid.bid).toFixed(1)}
                    </p>
                  ) : (
                    <p className="text-4xl text-green-600 font-extrabold">
                      ₹{currentBid.bid}
                    </p>
                  )}
                  <p className="text-lg text-red-700 font-medium mt-2">
                    Bidder: <span className="font-bold">{currentBid.name}</span>
                  </p>
                </>
              ) : (
                <p className="text-xl text-gray-600 italic">Start Bidding!</p>
              )}
            </div>
          </div>

          {/* // User Team Information */}
          <div className="bg-gray-300 h-full">
            <h1 className="text-xl font-bold mb-4">Your Team: {team.name}</h1>
            <ul className="rounded">
              <li className="mb-2 text-gray-700 font-medium">
                Batters: {team.batters}
              </li>
              <li className="mb-2 text-gray-700 font-medium">
                Bowlers: {team.bowlers}
              </li>
              <li className="mb-2 text-gray-700 font-medium">
                All-Rounders: {team.allr}
              </li>
              <li className="mb-2 text-gray-700 font-medium">
                Wicketkeepers: {team.wks}
              </li>
              <li className="mb-2 text-gray-700 font-medium">
                Overseas Players: {team.overseas}
              </li>
              <li className="mt-4 text-lg font-bold text-gray-900">
                Total:{" "}
                {team.batters +
                  team.bowlers +
                  team.allr +
                  team.wks +
                  team.overseas}{" "}
                / 25
              </li>
            </ul>

            <button
              className="rounded-md bg-blue-400"
              onClick={() => navigate("/teams")}
            >
              Other Teams
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default AuctionPage;
