import { useState, useEffect } from "react";
import { NavigateFunction, useNavigate, Routes, Route } from "react-router-dom";
import "./App.css";
import StartPage from "./pages/StartPage";
import AuctionPage from "./pages/AuctionPage";
import TeamsPage from "./pages/TeamsPage";
import toast, { Toaster } from "react-hot-toast";

function App(): JSX.Element {
  const navigate: NavigateFunction = useNavigate();
  const [team, setTeam] = useState<string>("");

  useEffect(() => {
    const curr = localStorage.getItem("team");
    if (curr) {
      setTeam(curr);
      navigate("/auction");
    } else {
      // navigate("/select");
      toast.error("Please select a team");
    }
  }, []);

  return (
    <>
      <Toaster />
      <Routes>
        <Route path="/" element={<StartPage />} />
        <Route path="/auction" element={<AuctionPage />} />
        <Route path="/teams" element={<TeamsPage />} />
      </Routes>
    </>
  );
}

export default App;
