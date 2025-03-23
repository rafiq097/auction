/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom"; // Import useNavigate
import axios from "axios";
import { io, Socket } from "socket.io-client";
import { useRecoilState } from "recoil";
import userAtom from "../atoms/userAtom";
import toast from "react-hot-toast";
import { players as bros } from "../utils/list.ts";
import Card from "../components/Card.tsx";
import { CR } from "../utils/getCR.ts";
import { getPlusPrice } from "../utils/getPlusPrice.ts";
import Sold from "../components/Sold.tsx";
import Unsold from "../components/UnSold.tsx";
import BottomBar from "../components/BottomBar.tsx";
import UserTeam from "../components/UserTeam.tsx";
// import { socketState } from "../atoms/socketAtom.ts";

interface ExtendedSocket extends Socket {
  _hasEndedPlayer?: string;
}

const RoomDetailsPage = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const [room, setRoom] = useState<any>({});
  const [userData, setUserData] = useRecoilState(userAtom);
  const [userTeam, setUserTeam] = useState<any>({});
  const [players, setPlayers] = useState<any>(bros);
  const [tempPlayers] = useState<any>(JSON.parse(JSON.stringify(bros)));
  const [curr, setCurr] = useState<number>(0);
  const [showModal, setShowModal] = useState(false);
  const [showTeam, setShowTeam] = useState(false);
  const [loading, setLoading] = useState(true);
  // const [socketID, setSocketID] = useState<any>("");
  // const [socket, setSocket] = useState<Socket>(io("http://localhost:5000"));
  // const [socket, setSocket] = useState<Socket>(
  //   io("https://iplauction.onrender.com")
  // );
  const [time, ] = useState<number>(10);
  const [currentBid, setCurrentBid] = useState<any>({});
  const [auctionTimer, setAuctionTimer] = useState<any>(null);
  const [countdown, setCountdown] = useState<number>(time);
  const [timerActive, setTimerActive] = useState<boolean>(false);
  const [soldNotification, setSoldNotification] = useState<any>({});
  const [unSoldNotification, setUnSoldNotification] = useState<any>({});

  const socketRef = useRef<ExtendedSocket | null>(null);
  // const socketRef = useRef<Socket | null>(null);
  const currentBidRef = useRef<any>(null);

  const verify = async () => {
    const token = localStorage.getItem("token");
    const aucTeam = localStorage.getItem("aucTeam");
    if (token) {
      try {
        const res = await axios.get("/verify", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUserData(res.data.user);

        const updatedUserData = { ...userData, team: aucTeam };
        setUserData(updatedUserData);
      } catch (err: any) {
        console.log(err.message);
        localStorage.removeItem("token");
        localStorage.removeItem("aucTeam");
        setUserData(null);
        toast.error("Session expired. Please login again.");
        navigate("/login");
      }
    } else {
      toast.error("Please login to continue");
      navigate("/login");
    }
  };

  useEffect(() => {
    verify();
  }, [setUserData, navigate]);

  useEffect(() => {
    const fetchRoomDetails = async () => {
      try {
        const response = await axios.get(`/rooms/get/single/${roomId}`);
        setRoom(response.data);

        const userTeam = response.data.teams.find(
          (team: any) => team.name === userData.team
        );
        console.log(userTeam);
        setUserTeam(userTeam);

        setCurr(response.data.curr);
        setLoading(false);
      } catch (err: any) {
        console.error(err?.message);
        toast.error("Please refresh the page");
        setLoading(false);
      }
    };

    fetchRoomDetails();
  }, [roomId]);

  useEffect(() => {
    const userTeam = room?.teams?.find(
      (team: any) => team.name === userData.team
    );
    console.log(userTeam);
    setUserTeam(userTeam);
  }, [room?.teams, userData.team]);

  useEffect(() => {
    if (!socketRef.current) {
      console.log("Creating new socket connection");
      socketRef.current = io("https://iplauction.onrender.com");
      // socketRef.current = io("http://localhost:5000");
    }

    return () => {
      if (socketRef.current) {
        console.log("Disconnecting socket on unmount");
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!socketRef.current || !userData || !userData.email) return;

    const socket = socketRef.current;

    function onConnect() {
      console.log("Socket connected:", socket.id);

      if (userData && userData.team) {
        socket.emit("join-room", {
          roomId,
          user: userData,
          team: userData.team,
        });
      }
    }

    function onRoomState(state: any) {
      console.log("Received room state:", state);
      setRoom(state);
      setLoading(false);
    }

    function onUserJoined({ message, participants }: any) {
      console.log("User joined:", message);
      // toast.success(message);

      setRoom((prev: any) =>
        prev
          ? {
              ...prev,
              participants,
            }
          : null
      );
    }

    function onUserLeft({ message, participants }: any) {
      console.log("User left:", message);
      toast.error(message);

      setRoom((prev: any) =>
        prev
          ? {
              ...prev,
              participants,
            }
          : null
      );
    }

    function onRoomError(err: string) {
      console.error("Room error:", err);
      toast.error(err);
      setLoading(false);
    }

    function onRoomMsg(msg: string) {
      console.error("Room Message:", msg);
      toast.error(msg);
    }

    function onPlayerBid({ message, user, player }: any) {
      console.log("Bid notification:", message, user, player);

      setPlayers((prevPlayers: any) => {
        const updatedPlayers = [...prevPlayers];
        updatedPlayers[curr] = player;
        return updatedPlayers;
      });

      setCurrentBid({ bid: player.Base, team: user.team });
      currentBidRef.current = { bid: player.Base, team: user.team };

      if (timerActive) {
        setCountdown(time);
      }

      toast.dismiss();
      toast.success(message, {
        icon: "🔨",
        duration: 3000,
      });
    }

    function onPlayerSkip({
      message,
      user,
      player,
      participants,
      curr: newCurr,
    }: any) {
      console.log(
        "Skip notification:",
        message,
        user,
        player,
        participants,
        newCurr
      );
      setCurr(newCurr);
      setCurrentBid({});

      toast.dismiss();
      toast(message, {
        icon: "⏭️",
        duration: 3000,
      });

      if (participants) {
        setRoom((prevState: any) => {
          if (!prevState) return null;
          return {
            ...prevState,
            participants,
          };
        });

        const ind = participants.findIndex(
          (p: any) => p.email === userData.email
        );
        if (ind !== -1) {
          setUserData(participants[ind]);
        }
      }
    }

    // socket.on("connect", onConnect);
    if (socket.connected) {
      onConnect();
    } else {
      socket.on("connect", onConnect);
    }

    function onPlayerSold({
      message,
      player,
      team,
      amount,
      newIndex,
      teams,
    }: any) {
      console.log("Player sold:", message, player, team, amount, newIndex);

      toast.dismiss();
      toast.success(message, { duration: 3000 });

      socket.emit("player-sold-noti", {
        player: `${player.First_Name} ${player.Surname}`,
        team,
        amount,
        timestamp: new Date().toISOString(),
      });

      setRoom((prev: any) => {
        if (!prev) return null;

        return {
          ...prev,
          teams: teams || prev.teams,
          curr: newIndex,
        };
      });

      setCurr(newIndex);
      setCurrentBid({});
      currentBidRef.current = null;

      if (room?.participants) {
        setRoom((prevState: any) => {
          if (!prevState) return null;
          const updatedParticipants = prevState.participants.map((p: any) => ({
            ...p,
            skip: false,
          }));

          return {
            ...prevState,
            participants: updatedParticipants,
          };
        });
      }
    }

    function onPlayerUnsold({ message, player, newIndex, participants }: any) {
      console.log(
        "Player unsold:",
        message,
        player.First_Name,
        newIndex,
        participants
      );

      toast.dismiss();
      toast.error(message, { duration: 3000 });

      socket.emit("player-unsold-noti", {
        player: `${player.First_Name} ${player.Surname}`,
        timestamp: new Date().toISOString(),
      });

      setCurr(newIndex);
      setCurrentBid({});
      currentBidRef.current = null;

      if (room?.participants) {
        setRoom((prevState: any) => {
          if (!prevState) return null;
          const updatedParticipants = prevState.participants.map((p: any) => ({
            ...p,
            skip: false,
          }));

          return {
            ...prevState,
            participants: updatedParticipants,
          };
        });
      }
    }

    socket.on("room-state", onRoomState);
    socket.on("user-joined", onUserJoined);
    socket.on("user-left", onUserLeft);
    socket.on("room-error", onRoomError);
    socket.on("room-msg", onRoomMsg);
    socket.on("player-bid", onPlayerBid);
    socket.on("player-skip", onPlayerSkip);
    socket.on("player-sold", onPlayerSold);
    socket.on("player-unsold", onPlayerUnsold);
    socket.on("player-sold-noti", (data: any) => {
      setSoldNotification({
        show: true,
        player: data.player,
        team: data.team,
        price: data.amount,
      });

      setTimeout(() => {
        setSoldNotification((prev: any) => ({ ...prev, show: false }));
      }, 3000);
    });

    socket.on("player-unsold-noti", (data: any) => {
      setUnSoldNotification({
        show: true,
        player: data.player,
      });

      setTimeout(() => {
        setUnSoldNotification((prev: any) => ({ ...prev, show: false }));
      }, 2000);
    });

    return () => {
      socket.off("connect", onConnect);
      socket.off("room-state", onRoomState);
      socket.off("user-joined", onUserJoined);
      socket.off("user-left", onUserLeft);
      socket.off("room-error", onRoomError);
      socket.off("room-msg", onRoomMsg);
      socket.off("player-bid", onPlayerBid);
      socket.off("player-skip", onPlayerSkip);
      socket.off("player-sold", onPlayerSold);
      socket.off("player-unsold", onPlayerUnsold);
      socket.off("player-sold-noti");
      socket.off("player-unsold-noti");
    };
  }, [roomId, userData, curr]);

  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  const handleTeamShow = () => setShowTeam(true);

  const handleBid = () => {
    const newBid = currentBid.bid + getPlusPrice(players[curr]);
    const remainingPurse =
      room.teams[room.teams.indexOf(userData.team)]?.remaining;

    if (newBid > remainingPurse) {
      toast.error("Not enough purse to bid, bro!");
      return;
    }
    if (currentBid.team == userData.team) {
      toast.error("You are the current bidder for this player!");
      return;
    }

    if (socketRef.current) {
      currentBidRef.current = {
        bid: players[curr].Base,
        team: userData.team,
      };

      setCurrentBid({
        bid: players[curr].Base,
        team: userData.team,
      });

      socketRef.current.emit("bid", {
        roomId,
        user: userData,
        player: { ...players[curr], Base: players[curr].Base },
      });

      if (timerActive) {
        setCountdown(time);
      }
    }
  };

  const startAuctionTimer = () => {
    if (auctionTimer) {
      clearInterval(auctionTimer);
      setAuctionTimer(null);
    }

    setCountdown(time);
    setTimerActive(true);

    const timer = setInterval(() => {
      setCountdown((prevCount) => {
        if (prevCount <= 1) {
          clearInterval(timer);
          handlePlayerEnd();
          return 0;
        }
        return prevCount - 1;
      });
    }, 1000);

    setAuctionTimer(timer);
  };

  const handlePlayerEnd = () => {
    setTimerActive(false);

    if (!socketRef.current) return;
    if (auctionTimer) {
      clearInterval(auctionTimer);
      setAuctionTimer(null);
    }

    const socket = socketRef.current;
    const currentBidInfo = currentBidRef.current;
    const bid = currentBidInfo?.bid;
    const team = currentBidInfo?.team;

    console.log("Handling player end with bid info:", bid, team);

    currentBidRef.current = null;
    setCurrentBid({});

    if (
      socket._hasEndedPlayer ===
      players[curr].First_Name + players[curr].Surname
    ) {
      console.log("Already handled end for this player, skipping");
      return;
    }

    socket._hasEndedPlayer = players[curr].First_Name + players[curr].Surname;

    setTimeout(() => {
      if (bid && team) {
        const soldMessage = `${players[curr].First_Name} ${
          players[curr].Surname
        } SOLD to ${team} for ${CR(bid)} CR!`;
        toast.dismiss();
        toast.success(soldMessage, { duration: 5000 });

        socket.emit("player-sold", {
          roomId,
          player: players[curr],
          team: team,
          amount: bid,
        });
      } else {
        const unsoldMessage = `${players[curr].First_Name} ${players[curr].Surname} UNSOLD!`;
        toast.dismiss();
        toast.error(unsoldMessage, { duration: 3000 });

        socket.emit("player-unsold", {
          roomId,
          player: players[curr],
        });
      }

      setTimeout(() => {
        delete socket._hasEndedPlayer;
      }, 1000);
    }, 0);
  };

  useEffect(() => {
    setCurrentBid(currentBidRef.current);
    if (currentBidRef.current && timerActive) {
      setCountdown(time);
    }
  }, [currentBidRef.current]);

  useEffect(() => {
    startAuctionTimer();
    setCurrentBid({});
    currentBidRef.current = null;

    return () => {
      if (auctionTimer) {
        clearInterval(auctionTimer);
      }
    };
  }, [curr]);

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-pulse text-lg font-semibold">Loading...</div>
      </div>
    );
  // console.log(room);

  return (
    <div className="p-4 h-screen bg-gray-50">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-full">
        {/* Teams Purse */}
        <div className="p-6 bg-gradient-to-br from-white to-blue-50 rounded-xl shadow-lg border border-blue-100 flex flex-col items-center justify-center">
          <h2 className="text-2xl font-bold text-blue-800 text-center mb-4 pb-2 border-b border-blue-200">
            Teams Purse
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr>
                  <th className="bg-blue-600 text-white px-4 py-3 text-left rounded-tl-lg">
                    Team
                  </th>
                  <th className="bg-blue-600 text-white px-4 py-3 text-left">
                    Owner
                  </th>
                  <th className="bg-blue-600 text-white px-4 py-3 text-right">
                    Spent
                  </th>
                  <th className="bg-blue-600 text-white px-4 py-3 text-right rounded-tr-lg">
                    Remaining
                  </th>
                </tr>
              </thead>
              <tbody>
                {room?.teams?.map((team: any, index: any) => {
                  const owner =
                    room?.participants?.find(
                      (user: any) => user.team === team.name
                    )?.name || "N/A";

                  const isLast = index === room?.teams?.length - 1;

                  return (
                    <tr
                      key={team.name}
                      className="border-b border-blue-100 hover:bg-white transition-colors"
                    >
                      <td
                        className={`px-4 py-3 font-medium text-blue-800 ${
                          isLast ? "rounded-bl-lg" : ""
                        }`}
                      >
                        {team.name}
                      </td>
                      <td className="px-4 py-3 text-black">{owner}</td>
                      <td className="px-4 py-3 text-right text-red-600 font-medium">
                        {CR(team.spent)} CR
                      </td>
                      <td
                        className={`px-4 py-3 text-right text-green-600 font-medium ${
                          isLast ? "rounded-br-lg" : ""
                        }`}
                      >
                        {CR(team.remaining)} CR
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Bro */}
        <div className="p-6 bg-gradient-to-br from-white to-blue-50 rounded-xl shadow-lg border border-blue-100 flex flex-col items-center justify-center">
          <div className="text-center mb-1 pb-3 border-b border-blue-200">
            <div className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium mb-2">
              Set: {players[curr].Set}
            </div>
            <h2 className="text-2xl font-bold text-blue-800">
              {players[curr].First_Name + " " + players[curr].Surname}
              <button
                className="ml-2 text-sm bg-blue-600 text-white px-3 py-1 rounded-full hover:bg-blue-700 transition-colors shadow-sm"
                onClick={handleShowModal}
              >
                Full Info
              </button>
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-3">
            <div className="flex items-center bg-white p-3 rounded-lg shadow-sm">
              <div className="w-32 font-semibold text-gray-700">
                Base Price:
              </div>
              <div className="text-green-600 font-bold">
                {CR(tempPlayers[curr].Base)} CR
              </div>
            </div>

            <div className="flex items-center bg-white p-3 rounded-lg shadow-sm">
              <div className="w-32 font-semibold text-gray-700">Role:</div>
              <div className="text-gray-800">
                {players[curr].Role === "BATTER"
                  ? `${players[curr].Role} - ${players[curr].Bat_type}`
                  : players[curr].Role === "BOWLER"
                  ? `${players[curr].Role} - ${players[curr].Bowl_type}`
                  : players[curr].Role}
              </div>
            </div>

            <div className="flex items-center bg-white p-3 rounded-lg shadow-sm">
              <div className="w-32 font-semibold text-gray-700">Country:</div>
              <div className="text-gray-800">{players[curr].Country}</div>
            </div>

            <div className="flex items-center bg-white p-3 rounded-lg shadow-sm">
              <div className="w-32 font-semibold text-gray-700">Age:</div>
              <div className="text-gray-800">{players[curr].Age}</div>
            </div>

            <div className="flex flex-col bg-white p-3 rounded-lg shadow-sm">
              <div className="font-semibold text-gray-700 mb-1">Caps:</div>
              <div className="flex flex-wrap gap-2">
                <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-md text-sm">
                  {players[curr].Test_caps || 0} Tests
                </span>
                <span className="px-2 py-1 bg-green-100 text-green-800 rounded-md text-sm">
                  {players[curr].ODI_caps || 0} ODIs
                </span>
                <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-md text-sm">
                  {players[curr].T20_caps || 0} T20s
                </span>
              </div>
            </div>

            <div className="flex items-center bg-white p-3 rounded-lg shadow-sm">
              <div className="w-32 font-semibold text-gray-700">
                IPL Matches:
              </div>
              <div className="text-gray-800">{players[curr].IPL_caps}</div>
            </div>

            <div className="flex items-center bg-white p-3 rounded-lg shadow-sm">
              <div className="w-32 font-semibold text-gray-700">
                Last IPL Team:
              </div>
              <div className="text-gray-800">
                {players[curr].Last_Team || "None"}
              </div>
            </div>
          </div>

          {showModal && (
            <div className="fixed inset-0 bg-black text-gray-100 bg-opacity-50 flex items-center justify-center z-50">
              <Card player={players[curr]} onClose={handleCloseModal} />
            </div>
          )}

          {soldNotification.show && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
              <Sold
                player={soldNotification.player}
                team={soldNotification.team}
                price={soldNotification.price}
              />
            </div>
          )}

          {unSoldNotification.show && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
              <Unsold player={unSoldNotification.player} />
            </div>
          )}
        </div>

        {/* Bid */}
        <div className="p-6 bg-gradient-to-br from-white to-blue-50 rounded-xl shadow-lg border border-blue-100">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col items-center justify-center bg-white p-4 rounded-lg shadow-sm">
              <div className="flex justify-center mb-2">
                <div
                  className={`text-xl font-bold px-6 py-3 rounded-full ${
                    countdown <= time
                      ? "bg-red-100 text-red-600 animate-pulse"
                      : "bg-blue-100 text-blue-800"
                  }`}
                >
                  {countdown}s
                </div>
              </div>

              {currentBid && (
                <div className="bg-white p-4 rounded-lg shadow-sm mb-2 text-center">
                  <div className="text-gray-600 mb-1 text-sm">Current Bid</div>
                  <div className="text-4xl font-bold text-green-600">
                    {CR(currentBid.bid || 0)} CR
                  </div>
                  <div className="text-red-800 text-3xl font-bold">
                    by {currentBid.team || "None"}
                  </div>
                </div>
              )}

              <div className="text-center mt-2">
                <button
                  className="px-6 py-3 bg-blue-500 text-white text-lg font-medium rounded-lg hover:bg-blue-600 transition shadow-sm"
                  onClick={handleBid}
                >
                  Bid
                </button>
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg shadow-sm text-center text-lg font-bold text-gray-500">
              <h2 className="text-xl font-bold mb-2">
                Your Team: {userTeam?.name}
                <button
                  className="ml-2 text-sm bg-blue-600 text-white px-2 py-1 rounded-full hover:bg-blue-700 transition-colors shadow-sm"
                  onClick={handleTeamShow}
                >
                  View Full Team
                </button>
              </h2>
              <div className="grid grid-cols-2 gap-4 mb-2">
                <div className="p-2 bg-orange-100 rounded">
                  Batters: {userTeam?.batters || 0}
                </div>
                <div className="p-2 bg-green-100 rounded">
                  Bowlers: {userTeam?.bowlers || 0}
                </div>
                <div className="p-2 bg-yellow-100 rounded">
                  All-Rounders: {userTeam?.allr || 0}
                </div>
                <div className="p-2 bg-red-100 rounded">
                  WKs: {userTeam?.wks || 0}
                </div>
                <div className="p-2 bg-purple-100 rounded">
                  Overseas: {userTeam?.overseas || 0}
                </div>
                <div className="p-2 bg-blue-100 rounded">
                  Total:{" "}
                  {userTeam?.batters +
                    userTeam?.bowlers +
                    userTeam?.allr +
                    userTeam?.wks || 0}
                </div>
              </div>
              <button
                className="px-4 py-2 bg-blue-500 text-white text-lg font-medium rounded-lg hover:bg-blue-600 transition shadow-sm"
                onClick={() => navigate(`/teams-details/${roomId}/`)}
              >
                View Other Teams
              </button>

              {showTeam && (
                <div
                  className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
                  onClick={() => setShowTeam(false)}
                >
                  <div
                    className="relative bg-white w-full max-w-lg sm:max-w-md md:max-w-xl lg:max-w-2xl h-3/4 p-4 md:p-6 rounded-xl shadow-lg overflow-y-auto"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      className="absolute top-2 right-2 text-gray-700 hover:text-gray-700"
                      onClick={() => setShowTeam(false)}
                    >
                      ✖️
                    </button>
                    <h2 className="text-xl md:text-2xl font-bold mb-4 text-center">
                      Your Team
                    </h2>
                    <UserTeam team={userTeam} />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <BottomBar />
    </div>
  );
};

export default RoomDetailsPage;
