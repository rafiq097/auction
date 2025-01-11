import { useState, useEffect } from "react";
import { NavigateFunction, useNavigate, Routes, Route } from "react-router-dom";
import "./App.css";
import StartPage from "./pages/StartPage";
import AuctionPage from "./pages/AuctionPage";
import TeamsPage from "./pages/TeamsPage";

function App(): JSX.Element {
  const navigate: NavigateFunction = useNavigate();
  

  return (
    <Routes>
      <Route path="/" element={<StartPage />} />
      <Route path="/auction" element={<AuctionPage />} />
      <Route path="/teams" element={<TeamsPage />} />
    </Routes>
  );
}

export default App;
