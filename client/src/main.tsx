import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
// import { Toaster } from "react-hot-toast";
import "./index.css";
import App from "./App.tsx";
import { RecoilRoot } from "recoil";
import axios from "axios";

axios.interceptors.request.use(
  function (config) {
    // config.baseURL = "http://localhost:5000";
    config.baseURL = "https://ipl25.onrender.com";
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <GoogleOAuthProvider clientId="1036825171555-ijbj7p036rmp9mf0jblnsae3ta4so5tr.apps.googleusercontent.com">
      <RecoilRoot>
        <BrowserRouter>
          <App />
          {/* <Toaster /> */}
        </BrowserRouter>
      </RecoilRoot>
    </GoogleOAuthProvider>
  </StrictMode>
);
