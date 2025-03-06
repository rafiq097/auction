/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect } from "react";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import toast from "react-hot-toast";
import { useRecoilState } from "recoil";
import { useNavigate } from "react-router-dom";
import userAtom from "../atoms/userAtom";

function LoginPage(): JSX.Element {
  const [, setUserData] = useRecoilState(userAtom);
  const navigate = useNavigate();

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

  const handleLogin = async (x: { email: any; name: any }) => {
    try {
      console.log("login called");

      const res = await axios.post("/users/login", {
        email: x.email,
        name: x.name,
      });

      console.log(res);
      localStorage.setItem("token", res.data.token);
      setUserData(res.data.user);

      toast.success("Login Success");
      navigate("/");
    } catch (err: any) {
      console.log(err.message);
      console.log(err);
      toast.error("Please try again...");
    }
  };

  // const handleError = (err: any) => {
  //   console.log(err);
  // }

  return (
    <>
      <div className="min-h-screen flex flex-col md:flex-row bg-gray-200">
        <div className="w-full h-1/2 md:w-1/2 md:h-screen">
          <img
            src="/ipl.png"
            alt="IPL"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="w-full h-1/2 md:w-1/2 md:h-screen flex items-center justify-center p-6 md:p-8">
          <div className="text-center">
            <GoogleLogin
              onSuccess={(res: any) => {
                let x: any = jwtDecode(res?.credential);
                handleLogin(x);
              }}
              onError={() => {
                console.log("Login failed");
              }}
            />
            <p className="text-xl font-extrabold text-blue-600 mt-4">Sign in with Google</p>
          </div>
        </div>
      </div>
    </>
  );
}

export default LoginPage;
