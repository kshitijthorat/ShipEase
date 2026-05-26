// src/pages/DriverDashboard.jsx

import React, {
  useEffect,
  useState,
} from "react";

import axios from "axios";

import {
  useLocation,
  useNavigate,
} from "react-router-dom";

import {
  MapPin,
  Route,
  Truck,
  Clock3,
  Package,
  Wallet,
  X,
} from "lucide-react";

// SAME MAP COMPONENT AS BOOKING PAGE
import MapView from "../components/booking/MapView";

export default function DriverDashboard() {

  const navigate =
    useNavigate();

  const location =
    useLocation();

  const booking =
    location.state?.booking;

  // =====================================
  // ROUTE COORDS
  // =====================================
  const [routeCoords,
    setRouteCoords] =
    useState([]);


  // =====================================
  // CALCULATE ROUTE
  // =====================================
  useEffect(() => {

    const calculateRoute =
      async () => {

        try {

          if (
            !booking?.pickupCoordinates ||
            !booking?.dropCoordinates
          ) {
            return;
          }

          console.log(
            "PICKUP:",
            booking.pickupCoordinates
          );

          console.log(
            "DROP:",
            booking.dropCoordinates
          );

          const response =
            await axios.post(

              "https://api.openrouteservice.org/v2/directions/driving-car/geojson",

              {
                coordinates: [

                  [
                    booking.pickupCoordinates.lng,
                    booking.pickupCoordinates.lat,
                  ],

                  [
                    booking.dropCoordinates.lng,
                    booking.dropCoordinates.lat,
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

          const coords =
            response.data.features[0]
            .geometry.coordinates.map(
              (coord) => [

                coord[1],
                coord[0],
              ]
            );

          setRouteCoords(
            coords
          );

        } catch (error) {

          console.log(
            "ROUTE ERROR:",
            error
          );
        }
      };

    calculateRoute();

  }, [booking]);


  // =====================================
  // NO BOOKING
  // =====================================
  if (!booking) {

    return (

      <div className="min-h-screen flex items-center justify-center text-3xl font-bold">
        No Active Trip
      </div>
    );
  }


  return (

    <div className="min-h-screen bg-[#f6f8fc] p-8">

      <div className="grid lg:grid-cols-[420px_1fr] gap-8">

        {/* LEFT PANEL */}
        <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm overflow-y-auto">

          {/* HEADER */}
          <div className="flex items-start justify-between mb-10">

            <div>

              <p className="text-orange-500 font-medium mb-3">
                {booking.trackingId}
              </p>

              <h1 className="text-5xl font-bold text-gray-900">
                Active Trip
              </h1>
            </div>


            {/* CANCEL BUTTON */}
            <button

              onClick={() =>
                navigate(
                  "/driverhome"
                )
              }

              className="w-14 h-14 rounded-2xl border border-gray-200 hover:bg-red-50 hover:border-red-200 transition flex items-center justify-center"
            >

              <X
                size={24}
                className="text-red-500"
              />
            </button>
          </div>


          {/* DETAILS */}
          <div className="space-y-7">

            {/* PICKUP */}
            <div className="flex gap-4">

              <div className="w-14 h-14 rounded-2xl bg-orange-50 flex items-center justify-center text-orange-500">

                <MapPin size={24} />
              </div>

              <div>

                <p className="text-gray-400 mb-2">
                  Pickup
                </p>

                <h2 className="font-bold text-xl text-gray-900">
                  {booking.pickupAddress}
                </h2>
              </div>
            </div>


            {/* DROP */}
            <div className="flex gap-4">

              <div className="w-14 h-14 rounded-2xl bg-orange-50 flex items-center justify-center text-orange-500">

                <Route size={24} />
              </div>

              <div>

                <p className="text-gray-400 mb-2">
                  Drop
                </p>

                <h2 className="font-bold text-xl text-gray-900">
                  {booking.dropAddress}
                </h2>
              </div>
            </div>


            {/* VEHICLE */}
            <div className="flex gap-4">

              <div className="w-14 h-14 rounded-2xl bg-orange-50 flex items-center justify-center text-orange-500">

                <Truck size={24} />
              </div>

              <div>

                <p className="text-gray-400 mb-2">
                  Vehicle
                </p>

                <h2 className="font-bold text-xl text-gray-900">
                  {booking.vehicleType}
                </h2>
              </div>
            </div>


            {/* GOODS */}
            <div className="flex gap-4">

              <div className="w-14 h-14 rounded-2xl bg-orange-50 flex items-center justify-center text-orange-500">

                <Package size={24} />
              </div>

              <div>

                <p className="text-gray-400 mb-2">
                  Goods
                </p>

                <h2 className="font-bold text-xl text-gray-900">
                  {booking.goodsType}
                </h2>
              </div>
            </div>


            {/* WEIGHT */}
            <div className="flex gap-4">

              <div className="w-14 h-14 rounded-2xl bg-orange-50 flex items-center justify-center text-orange-500">

                <Package size={24} />
              </div>

              <div>

                <p className="text-gray-400 mb-2">
                  Weight
                </p>

                <h2 className="font-bold text-xl text-gray-900">
                  {booking.goodsWeight}
                </h2>
              </div>
            </div>


            {/* FARE */}
            <div className="flex gap-4">

              <div className="w-14 h-14 rounded-2xl bg-orange-50 flex items-center justify-center text-orange-500">

                <Wallet size={24} />
              </div>

              <div>

                <p className="text-gray-400 mb-2">
                  Fare
                </p>

                <h2 className="font-bold text-2xl text-orange-500">
                  ₹{booking.estimatedFare}
                </h2>
              </div>
            </div>


            {/* ETA */}
            <div className="flex gap-4">

              <div className="w-14 h-14 rounded-2xl bg-orange-50 flex items-center justify-center text-orange-500">

                <Clock3 size={24} />
              </div>

              <div>

                <p className="text-gray-400 mb-2">
                  ETA
                </p>

                <h2 className="font-bold text-xl text-gray-900">
                  {booking.duration || 0} mins
                </h2>
              </div>
            </div>


            {/* NOTES */}
            <div className="bg-gray-50 rounded-3xl p-5 mt-8">

              <p className="text-gray-400 mb-3">
                Special Instructions
              </p>

              <h2 className="text-lg font-semibold text-gray-900">
                {booking.notes || "No instructions"}
              </h2>
            </div>
            <button

  onClick={async () => {

    try {

      // =====================================
      // RESET BOOKING
      // =====================================
      await axios.put(

        `http://localhost:5000/api/bookings/assign/${booking._id}`,

        {
          driverId: null,
        }
      );

      // =====================================
      // SET STATUS BACK
      // =====================================
      await axios.put(

        `http://localhost:5000/api/bookings/update-status/${booking._id}`,

        {
          status: "Pending",
        }
      );

      alert(
        "Booking cancelled successfully"
      );

      navigate(
        "/driverhome"
      );

    } catch (error) {

      console.log(error);

      alert(
        "Failed to cancel booking"
      );
    }
  }}

  className="w-full mt-8 bg-red-500 hover:bg-red-600 transition text-white py-5 rounded-2xl font-semibold text-lg shadow-lg"
>

  Cancel Booking
</button>
          </div>
        </div>


        {/* LIVE MAP */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden relative min-h-[800px]">

          {/* MAP */}
          <MapView

            pickup={
              booking.pickupAddress
            }

            drop={
              booking.dropAddress
            }

            pickupCoords={
              booking.pickupCoordinates
                ? [
                    booking.pickupCoordinates.lat,
                    booking.pickupCoordinates.lng,
                  ]
                : null
            }

            dropCoords={
              booking.dropCoordinates
                ? [
                    booking.dropCoordinates.lat,
                    booking.dropCoordinates.lng,
                  ]
                : null
            }

            // =====================================
            // LIVE ROUTE
            // =====================================
            routeCoords={
              routeCoords
            }

            distance={
              booking.distance
            }

            duration={
              booking.duration
            }

            selectedVehicle={
              booking.vehicleType
            }
          />


          {/* OVERLAY */}
          <div className="absolute bottom-10 left-10 bg-white/90 backdrop-blur-xl rounded-3xl p-6 shadow-xl z-[999]">

            <h2 className="text-3xl font-bold text-gray-900 mb-3">
              Live Shipment Route
            </h2>

            <p className="text-gray-600 text-lg">
              Pickup to destination tracking
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}