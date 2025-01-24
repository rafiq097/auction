import { useEffect } from "react";
import {
  NavigateFunction,
  useNavigate,
  Routes,
  Route,
  useLocation,
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
import RoomPage from "./pages/RoomPage.tsx";
import axios from "axios";

function App(): JSX.Element {
  const navigate: NavigateFunction = useNavigate();
  const [, setTeam] = useRecoilState(userTeamAtom);
  const [userData, setUserData] = useRecoilState(userAtom);
  const location = useLocation();

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
          // navigate("/");
        })
        .catch((err) => {
          console.log(err.message);
          localStorage.removeItem("token");
          setUserData(null);
          navigate("/login");
        });
    }
  }, [setUserData, navigate]);

  return (
    <>
      <Toaster />
      {/* <Routes> */}
      {location.pathname === "/" ||
      location.pathname === "/auction" ||
      location.pathname === "/teams" ||
      location.pathname === "/rooms" ? (
        <Routes>
          <Route path="/" element={<StartPage />} />
          <Route path="/auction" element={<AuctionPage />} />
          <Route path="/teams" element={<TeamsPage />} />
          <Route path="/roms" element={<RoomPage />} />
        </Routes>
      ) : (
        <Routes>
          <Route
            path="/login"
            element={!userData ? <LoginPage /> : <Navigate to="/" />}
          />
        </Routes>
      )}
      {/* </Routes> */}
    </>
  );
}

export default App;
