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
// import { socketState } from "../atoms/socketAtom.ts";

const RoomDetailsPage = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const [room, setRoom] = useState<any>({});
  // const [participants, setParticipants] = useState<any[]>([]);
  const [userData, setUserData] = useRecoilState(userAtom);
  const [players, setPlayers] = useState<any>(bros);
  const [curr, setCurr] = useState<number>(0);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  // const [socketID, setSocketID] = useState<any>("");
  // const [socket, setSocket] = useState<Socket>(io("http://localhost:5000"));
  // const [socket, setSocket] = useState<Socket>(
  //   io("https://iplauction.onrender.com")
  // );
  const [currentBid, setCurrentBid] = useState<any>({});
  const [auctionTimer, setAuctionTimer] = useState<NodeJS.Timeout | null>(null);
  const [countdown, setCountdown] = useState<number>(15);
  const [timerActive, setTimerActive] = useState<boolean>(false);

  const socketRef = useRef<Socket | null>(null);

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
    if (!socketRef.current) {
      console.log("Creating new socket connection");
      // socketRef.current = io("https://iplauction.onrender.com");
      socketRef.current = io("http://localhost:5000");
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
      toast.success(message);

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

    socket.on("player-sold", ({ message, player, team, amount, newIndex }) => {
      toast.success(message);
      
      setRoom((prev: any) => {
        if (!prev) return null;
        
        const updatedTeams = prev.teams.map((t: any) => {
          if (t.name === team) {
            return {
              ...t,
              spent: t.spent + amount,
              remaining: t.remaining - amount
            };
          }
          return t;
        });
        
        return {
          ...prev,
          teams: updatedTeams,
          curr: newIndex
        };
      });
      
      setCurr(newIndex);
      setCurrentBid(null);
    });
    
    socket.on("player-unsold", ({ message, newIndex }) => {
      toast.error(message);
      setCurr(newIndex);
      setCurrentBid(null);
    });

    socket.on("room-state", onRoomState);
    socket.on("user-joined", onUserJoined);
    socket.on("user-left", onUserLeft);
    socket.on("room-error", onRoomError);
    socket.on("room-msg", onRoomMsg);
    socket.on("player-bid", onPlayerBid);
    socket.on("player-skip", onPlayerSkip);

    return () => {
      socket.off("connect", onConnect);
      socket.off("room-state", onRoomState);
      socket.off("user-joined", onUserJoined);
      socket.off("user-left", onUserLeft);
      socket.off("room-error", onRoomError);
      socket.off("room-msg", onRoomMsg);
      socket.off("player-bid", onPlayerBid);
      socket.off("player-skip", onPlayerSkip);
    };
  }, [roomId, userData, curr]);

  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  const handleBid = () => {
    if (socketRef.current) {
      socketRef.current.emit("bid", {
        roomId,
        user: userData,
        player: players[curr],
      });
    }
  };

  const handleSkip = () => {
    if (socketRef.current) {
      socketRef.current.emit("skip", {
        roomId,
        user: userData,
        player: players[curr],
      });
    }
  };

  const startAuctionTimer = () => {
    if (auctionTimer) {
      clearInterval(auctionTimer);
    }

    setCountdown(15);
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
    const socket = socketRef.current;

    console.log(currentBid);
    if (currentBid?.bid) {
      const soldMessage = `${players[curr].First_Name} ${
        players[curr].Surname
      } SOLD to ${currentBid.team} for ${CR(currentBid.bid)} CR!`;
      toast.dismiss();
      toast.success(soldMessage, { duration: 5000 });

      socket?.emit("player-sold", {
        roomId,
        player: players[curr],
        team: currentBid.team,
        amount: currentBid.bid,
      });
    } else {
      const unsoldMessage = `${players[curr].First_Name} ${players[curr].Surname} UNSOLD!`;
      toast.dismiss();
      toast.error(unsoldMessage, { duration: 3000 });

      socket?.emit("player-unsold", {
        roomId,
        player: players[curr],
      });
    }
  };

  useEffect(() => {
    if (currentBid?.bid && timerActive) {
      setCountdown(15);
    }
  }, [currentBid?.bid]);

  useEffect(() => {
    startAuctionTimer();
    setCurrentBid({});
    
    return () => {
      if (auctionTimer) {
        clearInterval(auctionTimer);
      }
    };
  }, [curr]);

  if (loading) return <p>Loading...</p>;
  console.log(room);

  return (
    <div className="p-4 h-screen bg-gray-50">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-full">
        {/* Teams Purse */}
        <div className="p-4 bg-white rounded-lg shadow-md overflow-auto">
          <h2 className="text-xl font-semibold mb-3 text-gray-800">
            Teams Purse
          </h2>
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="border px-3 py-2">Team</th>
                <th className="border px-3 py-2">Owner</th>
                <th className="border px-3 py-2">Spent</th>
                <th className="border px-3 py-2">Remaining</th>
              </tr>
            </thead>
            <tbody>
              {room?.teams?.map((team: any) => {
                // const bro = room?.participants?.find(
                //   (user: any) => user.team === team.name
                // );
                const owner =
                  room?.participants?.find(
                    (user: any) => user.team === team.name
                  )?.name || "N/A";
                const skipped = room?.participants?.find(
                  (user: any) => user.team === team.name
                )?.skip;
                return (
                  <tr key={team.name} className="hover:bg-gray-50">
                    <td className="border px-3 py-2 font-medium">
                      {team.name}
                    </td>
                    <td className="border px-3 py-2">
                      {owner}
                      {skipped}
                    </td>
                    <td className="border px-3 py-2">{team.spent} cr</td>
                    <td className="border px-3 py-2">{team.remaining} cr</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Bro */}
        <div className="p-4 bg-white rounded-lg shadow-md flex flex-col items-center justify-center space-y-2">
          <h2 className="text-xl font-semibold text-gray-800">
            {players[curr].First_Name + " " + players[curr].Surname + " "}
            <button
              className="text-blue-500 text-sm underline hover:text-blue-700 ml-2"
              onClick={handleShowModal}
            >
              Full Info
            </button>
          </h2>

          <div className="text-gray-600">
            <p>
              <span className="font-medium">Role: </span>
              {players[curr].Role === "BATTER"
                ? `${players[curr].Role} - ${players[curr].Bat_type}`
                : players[curr].Role === "BOWLER"
                ? `${players[curr].Role} - ${players[curr].Bowl_type}`
                : players[curr].Role}
            </p>
          </div>

          <div className="text-gray-600">
            <p>
              <span className="font-medium">Base Price: </span>
              {CR(players[curr].Base)} CR
            </p>
          </div>

          <div className="text-gray-600">
            <p>
              <span className="font-medium">Country: </span>
              {players[curr].Country}
            </p>
          </div>

          <div className="text-gray-600">
            <p>{players[curr].Runs}</p>
          </div>

          {showModal && (
            <div className="fixed inset-0 bg-black text-gray-100 bg-opacity-50 flex items-center justify-center z-50">
              <Card player={players[curr]} onClose={handleCloseModal} />
            </div>
          )}
        </div>

        {/* Bid */}
        <div className="p-4 bg-white rounded-lg shadow-md flex flex-col items-center justify-center space-y-2">
          {currentBid && (
            <div className="text-gray-600">
              <p>
                <span className="font-medium">Current Bid: </span>
                {CR(currentBid.bid)} CR by {currentBid.team}
              </p>
            </div>
          )}

          <div
            className={`text-xl font-bold ${
              countdown <= 5 ? "text-red-500" : "text-gray-800"
            }`}
          >
            {countdown}s
          </div>

          <h2 className="text-xl font-semibold mb-3 text-gray-800">Bidding</h2>
          <div className="space-x-4">
            <button
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
              onClick={handleBid}
            >
              Bid
            </button>
            <button
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
              onClick={handleSkip}
            >
              Skip
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomDetailsPage;
