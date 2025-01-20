import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { players as bros } from "../utils/list.ts";
import { CR } from "../utils/getCR.ts";
import { useRecoilState } from "recoil";
import { teamsAtom } from "../atoms/teamsAtom.ts";
import { userTeamAtom } from "../atoms/userTeamAtom.ts";
import { currAtom } from "../atoms/currAtom.ts";
import { getPlusPrice } from "../utils/getPlusPrice.ts";
import { getRounds } from "../utils/getRounds.ts";

const AuctionPage: React.FC = () => {
  const navigate = useNavigate();
  const [team, setTeam] = useRecoilState(userTeamAtom);
  const [teams, setTeams] = useRecoilState(teamsAtom);
  const [curr, setCurr] = useRecoilState(currAtom);
  const [players, setPlayers] = useState<
    {
      Sno: number;
      Set_No: number;
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
    }[]
  >(bros);
  const [tempPlayers] = useState<
    {
      Sno: number;
      Set_No: number;
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
    }[]
  >(JSON.parse(JSON.stringify(bros)));
  const [soldBro, setSoldBro] = useState<{
    Sno: number;
    Set_No: number;
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
    team: string;
    base: number;
    price: number;
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

  useEffect(() => {
    const simulate = (): void => {
      let price = players[curr].Base;

      setPlayers((prevPlayers) => {
        const updatedPlayers = [...prevPlayers];
        updatedPlayers[curr].Base = price;
        return updatedPlayers;
      });

      let num = Math.floor(Math.random() * teams.length);
      while (teams[num].name === team.name && teams[num].remaining < price) {
        num = Math.floor(Math.random() * teams.length);
      }

      let otherPrice = price + getPlusPrice(price);

      const index = biddingBros.findIndex(
        (team) => team.name === teams[num].name
      );

      let validBros = 0;
      for (let i = 0; i < teams.length; i++) {
        if (teams[i].name != team.name && teams[i].remaining >= CR(price))
          validBros++;
      }
    };

    const timer = setTimeout(() => {
      if (!currentBid?.bid) {
        simulate();
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, [curr]);

  const handleContinue = (): void => {
    const player = tempPlayers[curr];
    let randomPrice = CR(player.Base);

    let totalCaps = player.IPL_caps || 0;
    randomPrice += totalCaps * 0.1;

    let last = player.Last_IPL_played || 0;
    if (last >= 7) {
      randomPrice *= 1.2;
    }

    randomPrice *= Math.random() * (1.7 - 1.2) + 1.2;
    if (player.Age >= 35) randomPrice *= 0.6;
    if (randomPrice > 40) randomPrice *= 0.5;
    if (randomPrice > 30) randomPrice *= 0.7;
    if (randomPrice > 20) randomPrice *= 0.9;
    if (randomPrice > 20) randomPrice *= 0.9;

    randomPrice = Math.round(randomPrice * 4) / 4;
    randomPrice = parseFloat(randomPrice.toFixed(2));

    if (currentBid?.bid)
      randomPrice = Math.max(randomPrice, CR(currentBid.bid) + 2);

    let validBros = 0;
    for (let i = 0; i < teams.length; i++) {
      if (teams[i].name != team.name && teams[i].remaining >= randomPrice)
        validBros++;
    }

    if (validBros == 0) {
      setCurrentBid({ name: "", bid: 0 });
      toast.error("No team is Eligible to Buy");
      setCurr(curr + 1);
      return;
    }

    let num = Math.floor(Math.random() * teams.length);
    while (
      teams[num].name === team.name ||
      teams[num].remaining < randomPrice
    ) {
      num = Math.floor(Math.random() * teams.length);
    }
    console.log(teams[num], randomPrice);

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

    const soldPlayer = {
      ...player,
      base: player.Base,
      price: randomPrice,
      team: teams[num].name,
    };

    // setCurrentBid({ name: teams[num].name, bid: soldPlayer.price });
    if (team.name == teams[num].name) {
      if (player.Country != "India") {
        setTeam({ ...team, overseas: team.overseas + 1 });
      }
      if (player.Role == "BATTER") {
        setTeam({ ...team, batters: team.batters + 1 });
      } else if (player.Role == "BOWLER") {
        setTeam({ ...team, bowlers: team.bowlers + 1 });
      } else if (player.Role == "WICKETKEEPER") {
        setTeam({ ...team, wks: team.wks + 1 });
      } else if (player.Role == "ALL-ROUNDER") {
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

    // if (curr >= players.length - 1) {
    //   toast("No more players bro.");
    //   return;
    // }
    setCurr(curr + 1);
  };

  const handleBid = (): void => {
    console.log(getRounds(players[curr]));

    let price = players[curr].Base;
    if (team.remaining < CR(price)) {
      toast.error("No Purse to Bid Bro");
      return;
    }
    if (team.batters + team.bowlers + team.allr + team.wks >= 25) {
      toast.error("Max Team Size reached");
      return;
    }

    price += getPlusPrice(price);

    setBiddingBros((prevBros) =>
      prevBros.map((bro) =>
        bro.name === team.name ? { ...bro, bid: price } : bro
      )
    );

    setPlayers((prevPlayers) => {
      const updatedPlayers = [...prevPlayers];
      updatedPlayers[curr].Base = price;
      return updatedPlayers;
    });
    setCurrentBid({ name: team.name, bid: price });

    let num = Math.floor(Math.random() * teams.length);
    while (teams[num].name === team.name && teams[num].remaining < price) {
      num = Math.floor(Math.random() * teams.length);
    }

    let otherPrice = price + getPlusPrice(price);

    const index = biddingBros.findIndex(
      (team) => team.name === teams[num].name
    );

    let validBros = 0;
    for (let i = 0; i < teams.length; i++) {
      if (teams[i].name != team.name && teams[i].remaining >= CR(price))
        validBros++;
    }

    if (
      biddingBros[index].round == getRounds(players[curr]) ||
      validBros == 0
    ) {
      toast.success("Congratulations You Won the Bid");

      const soldPlayer = {
        ...players[curr],
        base: tempPlayers[curr].Base,
        price: CR(price),
        team: team.name,
      };

      let updatedTeam = { ...team };

      if (players[curr].Country !== "India") {
        updatedTeam.overseas += 1;
      }
      if (players[curr].Role === "BATTER") {
        updatedTeam.batters += 1;
      } else if (players[curr].Role === "BOWLER") {
        updatedTeam.bowlers += 1;
      } else if (players[curr].Role === "WICKETKEEPER") {
        updatedTeam.wks += 1;
      } else if (players[curr].Role === "ALL-ROUNDER") {
        updatedTeam.allr += 1;
      }
      setTeam(updatedTeam);

      setSoldBro(soldPlayer);
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
            players: [...x.players, { ...players[curr], price: CR(price) }],
          };
        }
        return x;
      });

      setTeams(updatedTeams);

      setCurr(curr + 1);
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
          updatedPlayers[curr].Base = otherPrice;
          return updatedPlayers;
        });
        toast.error(
          `Team ${teams[num].name} bid at ${CR(otherPrice).toFixed(2)}CR`
        );
      }, 1000);
    }
  };

  const handleReset = (): void => {
    localStorage.removeItem("team");
    localStorage.removeItem("teams");
    localStorage.removeItem("curr");
    window.location.href = "/";
  };

  return (
    <>
      {/* <div className="text-center text-lg font-bold mb-4">
        Current Team: {team.toLocaleUpperCase()}
      </div> */}
      {/* {console.log(teams)} */}
      <div className="grid grid-rows-2 h-screen bg-gray-100">
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
                  <span>{team.spent.toFixed(2)}</span>
                  <span>{team.remaining.toFixed(2)}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* // Player bros Bid */}
          <div className="bg-gray-300 h-full flex items-center justify-center">
            {curr < players.length ? (
              <div className="p-6 bg-gray-50 rounded-lg shadow-lg max-w-lg">
                <div className="flex justify-center">
                  <button
                    className="px-6 py-2 bg-red-500 text-white font-semibold rounded-md hover:bg-red-600 transition duration-300 mb-2"
                    onClick={handleReset}
                  >
                    Reset Auction
                  </button>
                </div>
                <h1 className="text-2xl font-bold mb-2">
                  Set: {players[curr].Set}
                </h1>
                <h2 className="text-xl font-semibold mb-2">
                  {players[curr].First_Name + " " + players[curr].Surname}
                </h2>
                <p className="text-gray-600 mb-2">Role: {players[curr].Role}</p>
                <p className="text-gray-600 mb-2">
                  Base Price: {CR(tempPlayers[curr].Base)} CR
                </p>
                <p className="text-gray-600 mb-4">
                  Country: {players[curr].Country}
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
            ) : (
              <div>
                <h2 className="text-xl text-red-500 font-semibold mb-2">
                  Auction Completed
                </h2>
                <div className="flex justify-center">
                  <button
                    className="px-6 py-2 bg-red-500 text-white font-semibold rounded-md hover:bg-red-600 transition duration-300 mb-2"
                    onClick={handleReset}
                  >
                    Reset Auction
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* // Teams bros Bid Status */}
          <div className="bg-gray-100 h-full">
            <ul className="list-none space-y-1 ml-2 mr-4">
              <li className="bg-gray-200 flex justify-between items-center border-b border-gray-300">
                <span>Team</span>
                <span>Last Bid Price</span>
                <span>Times</span>
              </li>
              {biddingBros.map((team) => (
                <li
                  key={team.name}
                  className="flex justify-between items-center border-b border-gray-300"
                >
                  <span>{team.name}</span>
                  <span>{CR(team.bid).toFixed(2)}</span>
                  <span>{team.round}</span>
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
                <h1 className="text-2xl font-bold mb-2">Set: {soldBro.Set}</h1>
                <h2 className="text-xl font-semibold mb-2">
                  {soldBro.First_Name + " " + soldBro.Surname}
                </h2>
                <p className="text-gray-600 mb-2">Role: {soldBro.Role}</p>
                <p className="text-gray-600 mb-2">
                  Base Price: {CR(soldBro.base)} CR
                </p>
                <p className="text-gray-600 mb-2">Country: {soldBro.Country}</p>
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
                  <p className="text-4xl text-green-600 font-extrabold">
                    ₹{CR(currentBid.bid).toFixed(2)} CR
                  </p>
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
          <div className="bg-gray-300 shadow-lg rounded-lg p-4">
            <h1 className="flex justify-center text-xl font-bold text-gray-800 mb-4">
              Your Team: {team.name}
            </h1>
            <ul className="text-gray-600 space-y-2">
              <li className="flex justify-center ">Batters: {team.batters}</li>
              <li className="flex justify-center ">Bowlers: {team.bowlers}</li>
              <li className="flex justify-center ">
                All-Rounders: {team.allr}
              </li>
              <li className="flex justify-center ">
                Wicketkeepers: {team.wks}
              </li>
              <li className="flex justify-center ">
                Overseas Players: {team.overseas}
              </li>
              <li className="flex justify-center font-bold text-lg">
                Total: {team.batters + team.bowlers + team.allr + team.wks} / 25
              </li>
            </ul>
            <button
              className="mt-4 w-full px-4 py-2 bg-blue-500 text-white font-semibold rounded hover:bg-blue-600 transition"
              onClick={() => navigate("/teams")}
            >
              View Other Teams
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default AuctionPage;
