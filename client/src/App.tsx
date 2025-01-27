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
import toast, { Toaster } from "react-hot-toast";
import { userTeamAtom } from "./atoms/userTeamAtom.ts";
import { useRecoilState } from "recoil";
import userAtom from "./atoms/userAtom.ts";
import LoginPage from "./pages/LoginPage.tsx";
import RoomsPage from "./pages/RoomsPage.tsx";
import axios from "axios";
import RoomDetailsPage from "./pages/RoomDetailsPage.tsx";

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
    } else {
      // navigate("/select");
      toast.error("Please select a team");
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

  if (loading) return <div>Loading...</div>;

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
        <Route
          path="/login"
          element={!userData ? <LoginPage /> : <Navigate to="/" />}
        />
      </Routes>
    </>
  );
}

export default App;
