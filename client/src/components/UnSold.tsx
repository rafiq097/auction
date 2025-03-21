import React from "react";

interface UnsoldProps {
  player: string;
}

const Unsold: React.FC<UnsoldProps> = ({ player }) => {
  return (
    <div className="relative inline-flex flex-col items-center z-50">
      <div
        className="bg-gray-600 text-gray-100 rounded-full w-40 h-40 flex flex-col items-center justify-center shadow-lg transform transition-transform hover:scale-105"
      >
        <span className="text-xl font-bold uppercase mb-1">Unsold</span>
        <span className="text-2xl font-bold">0 CR</span>
      </div>

      <div className="mt-4 text-center">
        <span className="block text-lg text-gray-200">No Bids</span>
      </div>

      <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-75 text-white px-3 py-2 rounded text-base whitespace-nowrap z-50">
        {player}
      </div>
    </div>
  );
};

export default Unsold;
