// src/components/booking/RouteInfoCard.jsx

import React from "react";

import {
  Route,
  Clock3,
  ArrowRight,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

export default function RouteInfoCard({
  distance,
  duration,
  pickup,
  drop,
  selectedVehicle,
}) {

  const navigate = useNavigate();

  if (!distance) return null;


  const handleBookNow = () => {

    navigate("/booking-details", {
      state: {
        pickup,
        drop,
        distance,
        duration,
        selectedVehicle,
      },
    });
  };


  return (
    <div className="mt-6 bg-black text-white rounded-3xl p-6">

      {/* TOP INFO */}
      <div className="flex justify-between">

        {/* DISTANCE */}
        <div className="flex items-center gap-3">

          <Route size={24} />

          <div>

            <p className="text-sm text-gray-300">
              Distance
            </p>

            <h2 className="text-2xl font-bold">
              {distance}
            </h2>
          </div>
        </div>


        {/* ETA */}
        <div className="flex items-center gap-3">

          <Clock3 size={24} />

          <div>

            <p className="text-sm text-gray-300">
              ETA
            </p>

            <h2 className="text-2xl font-bold">
              {duration}
            </h2>
          </div>
        </div>
      </div>


      {/* BUTTON */}
      <button
        onClick={handleBookNow}
        className="w-full mt-6 bg-white text-black py-4 rounded-2xl flex items-center justify-center gap-3 font-semibold hover:scale-[1.01] transition"
      >
        Book Now

        <ArrowRight size={20} />
      </button>
    </div>
  );
}