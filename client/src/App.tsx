/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useState } from "react";
import {
  NavigateFunction,
  useNavigate,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import "./App.css";
import StartPage from "./pages/StartPage";
import AuctionPage from "./pages/AuctionPage";
import TeamsPage from "./pages/TeamsPage";
import { Toaster } from "react-hot-toast";
import { userTeamAtom } from "./atoms/userTeamAtom.ts";
import { useRecoilState } from "recoil";
import userAtom from "./atoms/userAtom.ts";
import LoginPage from "./pages/LoginPage.tsx";
import axios from "axios";
import RoomsPage from "./pages/RoomsPage.tsx";
import RoomDetailsPage from "./pages/RoomDetailsPage.tsx";
import RoomTeamsPage from "./pages/RoomTeamsPage.tsx";

function App(): JSX.Element {
  const navigate: NavigateFunction = useNavigate();
  const [, setTeam] = useRecoilState(userTeamAtom);
  const [userData, setUserData] = useRecoilState(userAtom);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const curr = localStorage.getItem("team");
    const token = localStorage.getItem("token");

    if (curr && token) {
      setTeam(JSON.parse(curr));
      // navigate("/auction");
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setLoading(true);
    if (token) {
      axios
        .get("/verify", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          setUserData(res.data.user);
          setLoading(false);
          // navigate("/");
        })
        .catch((err) => {
          console.log(err.message);
          localStorage.removeItem("token");
          setLoading(false);
          setUserData(null);
          navigate("/login");
        });
    } else {
      setLoading(false);
      navigate("/login");
    }
    setLoading(false);
  }, [setUserData]);

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-pulse text-lg font-semibold">Loading...</div>
      </div>
    );

  return (
    <>
      <Toaster />
      <Routes>
        <Route path="/" element={!userData ? <LoginPage /> : <StartPage />} />
        <Route
          path="/auction"
          element={!userData ? <LoginPage /> : <AuctionPage />}
        />
        <Route
          path="/teams"
          element={!userData ? <LoginPage /> : <TeamsPage />}
        />
        <Route
          path="/rooms"
          element={!userData ? <LoginPage /> : <RoomsPage />}
        />
        <Route
          path="/rooms/:roomId"
          element={!userData ? <LoginPage /> : <RoomDetailsPage />}
        />
        <Route path="/teams-details/:roomId" element={<RoomTeamsPage />} />
        <Route
          path="/login"
          element={!userData ? <LoginPage /> : <Navigate to="/" />}
        />
      </Routes>
    </>
  );
}

export default App;
