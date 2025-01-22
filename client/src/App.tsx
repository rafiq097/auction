import { useEffect } from "react";
import { NavigateFunction, useNavigate, Routes, Route } from "react-router-dom";
import "./App.css";
import StartPage from "./pages/StartPage";
import AuctionPage from "./pages/AuctionPage";
import TeamsPage from "./pages/TeamsPage";
import toast, { Toaster } from "react-hot-toast";
import { userTeamAtom } from "./atoms/userTeamAtom.ts";
import { useRecoilState } from "recoil";
import userAtom from "./atoms/userAtom.ts";
import LoginPage from "./pages/LoginPage.tsx";
import axios from "axios";

function App(): JSX.Element {
  const navigate: NavigateFunction = useNavigate();
  const [, setTeam] = useRecoilState(userTeamAtom);
  const [userData, setUserData] = useRecoilState(userAtom);

  useEffect(() => {
    const curr = localStorage.getItem("team");
    if (curr) {
      setTeam(JSON.parse(curr));
      navigate("/auction");
    } else {
      // navigate("/select");
      toast.error("Please select a team");
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      axios
        .get("/verify", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          setUserData(res.data.user);
          navigate("/");
        })
        .catch((err) => {
          console.log(err.message);
          localStorage.removeItem("token");
          setUserData(null);
        });
    }
  }, [setUserData, navigate]);

  return (
    <>
      <Toaster />
      <Routes>
        <Route path="/" element={!userData ? <LoginPage /> : <StartPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/auction"
          element={!userData ? <LoginPage /> : <AuctionPage />}
        />
        <Route
          path="/teams"
          element={!userData ? <LoginPage /> : <TeamsPage />}
        />
      </Routes>
    </>
  );
}

export default App;
