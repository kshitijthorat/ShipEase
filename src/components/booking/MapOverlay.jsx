// src/components/booking/MapOverlay.jsx

import React from "react";

export default function MapOverlay({
  pickup,
  drop,
  distance,
  duration,
  selectedVehicle,
}) {

  return (
    <div className="absolute top-6 right-6 bg-white px-6 py-5 rounded-3xl shadow-xl w-[320px] z-[1000]">

      <p className="text-sm text-gray-500">
        Current Vehicle
      </p>

      <h2 className="text-2xl font-bold mt-1">
        {selectedVehicle}
      </h2>

      <div className="mt-6 space-y-4">

        <div className="flex justify-between">
          <span>Pickup</span>
          <span>{pickup}</span>
        </div>

        <div className="flex justify-between">
          <span>Drop</span>
          <span>{drop}</span>
        </div>

        <div className="flex justify-between">
          <span>Distance</span>
          <span>{distance}</span>
        </div>

        <div className="flex justify-between">
          <span>ETA</span>
          <span>{duration}</span>
        </div>
      </div>
    </div>
  );
}