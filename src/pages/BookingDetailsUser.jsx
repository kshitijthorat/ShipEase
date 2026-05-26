// src/pages/BookingDetailsUser.jsx

import React, {
  useEffect,
  useState,
} from "react";

import axios from "axios";

import {
  useNavigate,
  useParams,
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

import DashboardMap from "../components/booking/MapView";

export default function BookingDetailsUser() {

  const navigate =
    useNavigate();

  const { id } =
    useParams();

  // =====================================
  // STATES
  // =====================================
  const [booking,
    setBooking] =
    useState(null);

  const [routeCoords,
    setRouteCoords] =
    useState([]);

  const [distance,
    setDistance] =
    useState("");

  const [duration,
    setDuration] =
    useState("");

  // =====================================
  // FETCH BOOKING
  // =====================================
  useEffect(() => {

    const fetchBooking =
      async () => {

        try {

          const response =
            await axios.get(
              `http://localhost:5000/api/bookings/${id}`
            );

          const bookingData =
            response.data.booking;

          console.log(
            "BOOKING:",
            bookingData
          );

          setBooking(
            bookingData
          );

        } catch (error) {

          console.log(
            "FETCH ERROR:",
            error
          );
        }
      };

    fetchBooking();

  }, [id]);

  // =====================================
  // CALCULATE ROUTE
  // =====================================
  useEffect(() => {

    const calculateRoute =
      async () => {

        try {

          if (
            !booking?.pickupCoordinates?.lat ||
            !booking?.dropCoordinates?.lat
          ) {

            console.log(
              "NO COORDINATES FOUND"
            );

            return;
          }

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

                  // IMPORTANT
                  Authorization:
                    "eyJvcmciOiI1YjNjZTM1OTc4NTExMTAwMDFjZjYyNDgiLCJpZCI6ImZlZGI2M2I2NjYzOTQzYzQ5YmY5NTA0MmJmMmQ2NzAyIiwiaCI6Im11cm11cjY0In0=",

                  "Content-Type":
                    "application/json",
                },
              }
            );

          console.log(
            "ROUTE RESPONSE:",
            response.data
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

          setRouteCoords(
            coords
          );

          setDistance(
            (
              route.properties.summary.distance /
              1000
            ).toFixed(2) + " KM"
          );

          setDuration(
            Math.round(
              route.properties.summary.duration /
              60
            ) + " mins"
          );

        } catch (error) {

          console.log(
            "ROUTE ERROR:",
            error
          );
        }
      };

    if (booking) {

      calculateRoute();
    }

  }, [booking]);

  // =====================================
  // LOADING
  // =====================================
  if (!booking) {

    return (

      <div className="min-h-screen flex items-center justify-center text-3xl font-bold">
        Loading Booking...
      </div>
    );
  }

  return (

    <div className="min-h-screen bg-[#f6f8fc] p-8">

      <div className="grid lg:grid-cols-[420px_1fr] gap-8">

        {/* =====================================
            LEFT PANEL
        ===================================== */}
        <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm overflow-y-auto">

          {/* HEADER */}
          <div className="flex items-start justify-between mb-10">

            <div>

              <p className="text-orange-500 font-medium mb-3">
                {booking.trackingId}
              </p>

              <h1 className="text-5xl font-bold text-gray-900">
                Booking Details
              </h1>
            </div>

            <button

              onClick={() =>
                navigate(
                  -1
                )
              }

              className="w-14 h-14 rounded-2xl border border-gray-200 hover:bg-red-50 transition flex items-center justify-center"
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

            {/* DISTANCE */}
            <div className="bg-orange-50 rounded-3xl p-5">

              <h2 className="text-3xl font-bold text-orange-500 mb-2">
                {distance}
              </h2>

              <p className="text-gray-600">
                Total Route Distance
              </p>
            </div>

            {/* DURATION */}
            <div className="bg-gray-100 rounded-3xl p-5">

              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                {duration}
              </h2>

              <p className="text-gray-600">
                Estimated Delivery Time
              </p>
            </div>
          </div>
        </div>

        {/* =====================================
            MAP
        ===================================== */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden min-h-[850px]">

          <DashboardMap

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

            routeCoords={
              routeCoords
            }
          />
        </div>
      </div>
    </div>
  );
}