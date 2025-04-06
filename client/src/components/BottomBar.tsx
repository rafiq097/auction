import {
  FaHome,
  // FaUsers,
  FaTrophy,
  FaSignOutAlt,
  FaPeopleArrows,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import userAtom from "../atoms/userAtom";
import { useRecoilState } from "recoil";

const BottomBar = () => {
  const navigate = useNavigate();
  const [userData, ] = useRecoilState(userAtom);

  return (
    <nav className="fixed bottom-0 inset-x-0 mx-auto w-full max-w-xl bg-transparent backdrop-blur-xl shadow-md p-2 flex justify-evenly rounded-t-lg">
      <button
        className="text-black flex flex-col items-center hover:scale-110 transition-transform duration-200"
        onClick={() => {
          navigate("/");
        }}
      >
        <FaHome size={22} />
        <span className="mt-1 text-sm">Home</span>
      </button>

      <button
        className="text-black flex flex-col items-center hover:scale-110 transition-transform duration-200"
        onClick={() => {
          navigate("/auction");
        }}
      >
        <FaTrophy size={22} />
        <span className="mt-1 text-sm">Computer</span>
      </button>

      <button
        className="text-black flex flex-col items-center hover:scale-110 transition-transform duration-200"
        onClick={() => {
          navigate("/rooms");
        }}
      >
        <FaPeopleArrows size={22} />
        <span className="mt-1 text-sm">Online</span>
      </button>

      {/* <button
        className="text-black flex flex-col items-center hover:scale-110 transition-transform duration-200"
        onClick={() => {
          navigate("/teams");
        }}
      >
        <FaUsers size={22} />
        <span className="mt-1 text-sm">Teams</span>
      </button> */}

      {userData && <button
        className="text-black flex flex-col items-center hover:scale-110 transition-transform duration-200"
        onClick={() => {
          localStorage.removeItem("token");
          localStorage.removeItem("team");
          localStorage.removeItem("teams");
          localStorage.removeItem("curr");
          localStorage.removeItem("aucTeam");
          window.location.href = "/login";
        }}
      >
        <FaSignOutAlt size={22} />
        <span className="mt-1 text-sm">LogOut</span>
      </button>}
    </nav>
  );
};

export default BottomBar;
