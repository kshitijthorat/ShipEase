// src/components/booking/BookingSidebar.jsx

import React from "react";

import {
  Menu,
  ArrowRight,
} from "lucide-react";

import axios from "axios";

import {
  useNavigate,
} from "react-router-dom";

import LocationInput from "./LocationInput";

import VehicleSelector from "./VehicleSelector";

import RouteInfoCard from "./RouteInfoCard";

export default function BookingSidebar({
  pickup,
  setPickup,
  drop,
  setDrop,
  pickupCoords,
  setPickupCoords,
  dropCoords,
  setDropCoords,
  routeCoords,
  setRouteCoords,
  distance,
  setDistance,
  duration,
  setDuration,
  selectedVehicle,
  setSelectedVehicle,
}) {

  const navigate =
    useNavigate();

  // =====================================
  // CALCULATE ROUTE
  // =====================================
  const calculateRoute =
    async () => {

      if (
        !pickupCoords ||
        !dropCoords
      ) {

        alert(
          "Please select locations"
        );

        return;
      }

      try {

        console.log(
          "PICKUP:",
          pickupCoords
        );

        console.log(
          "DROP:",
          dropCoords
        );

        const response =
          await axios.post(

            "https://api.openrouteservice.org/v2/directions/driving-car/geojson",

            {
              coordinates: [

                [
                  pickupCoords[1],
                  pickupCoords[0],
                ],

                [
                  dropCoords[1],
                  dropCoords[0],
                ],
              ],
            },

            {
              headers: {

                Authorization:
                  "eyJvcmciOiI1YjNjZTM1OTc4NTExMTAwMDFjZjYyNDgiLCJpZCI6ImZlZGI2M2I2NjYzOTQzYzQ5YmY5NTA0MmJmMmQ2NzAyIiwiaCI6Im11cm11cjY0In0=",

                "Content-Type":
                  "application/json",
              },
            }
          );

        const route =
          response.data.features[0];

        const coords =
          route.geometry.coordinates.map(
            (coord) => [

              coord[1],
              coord[0],
            ]
          );

        // =====================================
        // SAVE ROUTE COORDS
        // =====================================
        setRouteCoords(coords);

        // =====================================
        // DISTANCE
        // =====================================
        const totalDistance =
          (
            route.properties.summary.distance /
            1000
          ).toFixed(2);

        setDistance(
          totalDistance
        );

        // =====================================
        // DURATION
        // =====================================
        const totalDuration =
          Math.round(

            route.properties.summary.duration /
            60
          );

        setDuration(
          totalDuration
        );
      

      } catch (error) {

        console.log(error);

        alert(
          "Failed to calculate route"
        );
      }
    };

  return (

    <div className="w-full lg:w-[450px] bg-white min-h-screen px-6 py-6 flex flex-col shadow-sm z-[1000]">

      {/* HEADER */}
      <div className="flex items-center justify-between mb-14">

        <h1 className="text-2xl font-bold">
          ShipEase
        </h1>

      <button

  onClick={() =>
    navigate(
      "/mybookingsdashboard"
    )
  }

  className="p-2 rounded-lg hover:bg-gray-100"
>

  <Menu size={24} />
</button>
      </div>

      {/* HERO */}
      <div>

        <h1 className="text-5xl font-bold leading-tight">

          Delivering
          <br />
          Made Easy
        </h1>

        <p className="mt-5 text-gray-500 text-lg">

          Fast, reliable and affordable
          delivery.
        </p>
      </div>

      {/* PICKUP */}
      <LocationInput

        label="Pickup Location"

        value={pickup}

        setValue={setPickup}

        setCoords={setPickupCoords}
      />

      {/* DROP */}
      <LocationInput

        label="Drop Location"

        value={drop}

        setValue={setDrop}

        setCoords={setDropCoords}
      />

      {/* ROUTE INFO */}
      <RouteInfoCard

        distance={distance}

        duration={duration}

        pickup={pickup}

        drop={drop}

        selectedVehicle={selectedVehicle}
      />

      {/* VEHICLE */}
      <VehicleSelector

        selectedVehicle={selectedVehicle}

        setSelectedVehicle={setSelectedVehicle}
      />

      {/* BUTTON */}
      <div className="mt-auto pt-10 space-y-4">

        <button

          onClick={calculateRoute}

          className="w-full bg-black text-white py-5 rounded-2xl flex items-center justify-center gap-3 text-lg font-medium hover:bg-gray-900 transition"
        >

          Get Estimate

          <ArrowRight size={22} />
        </button>
        {distance && duration && (

  <button

    onClick={() =>

      navigate(

        "/booking-details",

        {
          state: {

            pickup,
            drop,

            pickupCoords,
            dropCoords,

            routeCoords,

            distance,

            duration,

            selectedVehicle,
          },
        }
      )
    }

    className="w-full bg-[#ff7b00] hover:bg-[#ff8d1f] transition text-white py-5 rounded-2xl text-lg font-semibold"
  >

    Continue Booking
  </button>
)}
      </div>
    </div>
  );
}