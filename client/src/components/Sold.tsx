/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from "react";
import { CR } from "../utils/getCR";

interface SoldProps {
  player: string;
  team: string;
  price: number;
}

const teamBros: Record<
  string,
  { primary: string; secondary: string; bg: string }
> = {
  MI: { primary: "bg-blue-600", secondary: "text-blue-100", bg: "MI.jpg" },
  CSK: {
    primary: "bg-yellow-500",
    secondary: "text-yellow-100",
    bg: "CSK.jpg",
  },
  RCB: { primary: "bg-red-600", secondary: "text-red-100", bg: "RCB.jpg" },
  KKR: {
    primary: "bg-purple-600",
    secondary: "text-purple-100",
    bg: "KKR.jpg",
  },
  DC: { primary: "bg-blue-500", secondary: "text-blue-100", bg: "DC.jpg" },
  RR: { primary: "bg-pink-500", secondary: "text-pink-100", bg: "RR.jpg" },
  PBKS: { primary: "bg-red-500", secondary: "text-red-100", bg: "PBKS.jpg" },
  SRH: {
    primary: "bg-orange-500",
    secondary: "text-orange-100",
    bg: "SRH.jpg",
  },
  GT: { primary: "bg-blue-700", secondary: "text-blue-100", bg: "GT.jpg" },
  LSG: { primary: "bg-green-500", secondary: "text-green-100", bg: "LSG.jpg" },
  default: {
    primary: "bg-gray-700",
    secondary: "text-gray-100",
    bg: "RCB.jpg",
  },
};

const Sold: React.FC<SoldProps> = ({ player, team, price }) => {
  const [animate, setAnimate] = useState(false);
  const [showBadge, setShowBadge] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [hammerState, setHammerState] = useState(0); // 0: hidden, 1: raised, 2: hitting, 3: dropping
  const [showImpact, setShowImpact] = useState(false);

  const teamBro = teamBros[team] || teamBros["default"];
  const bgColor = teamBro.secondary.replace("text-", "bg-");
  const textColor = teamBro.primary.replace("bg-", "text-");

  useEffect(() => {
    setTimeout(() => setAnimate(true), 200);
    
    setTimeout(() => setHammerState(1), 500);
    
    setTimeout(() => {
      setHammerState(2);
      setTimeout(() => setShowImpact(true), 20);
    }, 1100);
    
    setTimeout(() => setHammerState(3), 1300);
    
    setTimeout(() => setShowBadge(true), 1500);
    
    setTimeout(() => setShowDetails(true), 1700);
  }, []);

  return (
    <div className="relative inline-flex flex-col items-center z-10 py-6 px-4">
      <div
        className={`relative w-40 h-40 rounded-full shadow-lg overflow-hidden 
          ${animate ? "animate-bounce-once" : "scale-0"}
          transition-all duration-500 ease-out`}
      >
        <div
          className="absolute inset-0 w-full h-full bg-cover bg-center"
          style={{
            backgroundImage: `url(/${teamBro.bg})`,
            backgroundSize: "cover",
            filter: "contrast(1.3) brightness(1.1)",
          }}
        />

        <div
          className={`absolute inset-0 w-full h-full ${teamBro.primary} opacity-20`}
        ></div>

        {animate && (
          <>
            <div
              className={`absolute inset-0 w-full h-full rounded-full ${teamBro.primary} opacity-30 animate-ping-slow`}
            ></div>
            <div
              className={`absolute inset-0 w-full h-full rounded-full ${teamBro.primary} opacity-20 animate-ping-slower`}
            ></div>
          </>
        )}

        <div className="absolute inset-0 flex items-center justify-center">
          <div className="rounded-full bg-opacity-30 p-4 flex flex-col items-center justify-center">
            <span
              className={`text-xl font-bold uppercase mb-1 text-white drop-shadow-lg ${
                animate ? "animate-pulse" : ""
              }`}
              style={{ textShadow: "0 0 3px rgba(0,0,0,0.8)" }}
            >
              Sold
            </span>
            <span
              className="text-2xl font-bold text-white drop-shadow-lg"
              style={{ textShadow: "0 0 3px rgba(0,0,0,0.8)" }}
            >
              {CR(price)} CR
            </span>
          </div>
        </div>
        
        {showImpact && (
          <div className="absolute inset-0 pointer-events-none">
            {/* <div className={`absolute inset-0 ${bgColor} opacity-30 animate-flash`}></div> */}
            <div className="absolute inset-0 rounded-full animate-ping-impact"></div>
          </div>
        )}
      </div>

      <div
        className={`mt-4 text-center transform transition-all duration-500 ${
          showDetails ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}
      >
        <span className="block text-lg text-gray-200">to</span>
        <span className={`block font-bold text-2xl ${textColor}`}>{team}</span>

        <div className="mt-4">
          <div
            className={`inline-block ${bgColor} px-4 py-2 rounded-lg shadow-lg`}
          >
            <span className="text-lg font-bold">{player} at {CR(price)} CR</span>
          </div>
        </div>
      </div>

      <div
        className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
          pointer-events-none transition-all duration-300 
          ${showBadge ? "opacity-0 scale-150" : "opacity-0 scale-50"}`}
      >
        <svg className="w-64 h-64" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r="48"
            fill="none"
            stroke="#ff0000"
            strokeWidth="4"
          />
          <text
            x="50"
            y="55"
            textAnchor="middle"
            fill="#ff0000"
            fontWeight="bold"
            fontSize="20"
          >
            SOLD
          </text>
        </svg>
      </div>
      
      {hammerState > 0 && (
        <div 
          className={`absolute transform transition-all duration-500 ease-in-out ${
            hammerState === 1 ? "top-0 right-4 -rotate-45" : 
            hammerState === 2 ? "top-1/4 right-8 rotate-15" : 
            "top-full right-4 rotate-90"
          }`}
          style={{ 
            transformOrigin: "80% 20%",
            zIndex: hammerState === 3 ? 0 : 20
          }}
        >
          <svg width="100" height="160" viewBox="0 0 50 120">
            {/* Handle */}
            <rect x="22" y="10" width="6" height="70" fill="#8B4513" />
            {/* Head */}
            <rect x="10" y="0" width="30" height="15" fill="#A0522D" rx="2" />
          </svg>
        </div>
      )}
    </div>
  );
};

const Styles: any = (): any => (
  <style>{`
    @keyframes bounce-once {
      0%,
      20%,
      50%,
      80%,
      100% {
        transform: translateY(0);
      }
      40% {
        transform: translateY(-30px);
      }
      60% {
        transform: translateY(-15px);
      }
    }

    @keyframes ping-slow {
      0% {
        transform: scale(1);
        opacity: 0.3;
      }
      100% {
        transform: scale(1.5);
        opacity: 0;
      }
    }

    @keyframes ping-slower {
      0% {
        transform: scale(1);
        opacity: 0.2;
      }
      100% {
        transform: scale(2);
        opacity: 0;
      }
    }
    
    @keyframes ping-impact {
      0% {
        box-shadow: 0 0 0 0 rgba(255, 0, 0, 0.7);
        opacity: 1;
      }
      70% {
        box-shadow: 0 0 0 20px rgba(255, 0, 0, 0);
        opacity: 0.5;
      }
      100% {
        box-shadow: 0 0 0 0 rgba(255, 0, 0, 0);
        opacity: 0;
      }
    }

    @keyframes flash {
      0% { opacity: 0.7; }
      100% { opacity: 0; }
    }

    .animate-bounce-once {
      animation: bounce-once 1s ease-out;
    }

    .animate-ping-slow {
      animation: ping-slow 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;
    }

    .animate-ping-slower {
      animation: ping-slower 2s cubic-bezier(0, 0, 0.2, 1) infinite;
    }
    
    .animate-ping-impact {
      animation: ping-impact 0.8s cubic-bezier(0, 0, 0.2, 1);
    }
    
    .animate-flash {
      animation: flash 0.4s ease-out;
    }
  `}</style>
);

const SoldWithAnimations = (props: SoldProps) => (
  <>
    <Styles />
    <Sold {...props} />
  </>
);

export default SoldWithAnimations;