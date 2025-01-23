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
        })
    }
  }, [setUserData, navigate]);

  const handleLogin = async (x: { email: any; name: any; }) => {
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
      <div className="h-screen flex">
        <div className="w-full bg-blue-400 flex items-center justify-center p-8">
          <div className="text-center">
            {(
              <>
                <GoogleLogin
                  onSuccess={(res: any) => {
                    let x: any = jwtDecode(res?.credential);
                    handleLogin(x);
                  }}
                  onError={() => {
                    console.log("login failed");
                  }}
                />
                <p className="text-white mt-4">Sign in with Google</p>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default LoginPage;