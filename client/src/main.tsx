import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
// import { Toaster } from "react-hot-toast";
import "./index.css";
import App from "./App.tsx";
import { RecoilRoot } from "recoil";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RecoilRoot>
      <BrowserRouter>
        <App />
        {/* <Toaster /> */}
      </BrowserRouter>
    </RecoilRoot>
  </StrictMode>
);
