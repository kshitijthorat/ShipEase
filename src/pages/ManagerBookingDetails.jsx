// src/pages/ManagerBookingDetails.jsx

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
  User,
  UserCheck,
  X,
  Phone,
  Star,
} from "lucide-react";

// MAP
import DashboardMap from "../components/booking/DashboardMap";

export default function ManagerBookingDetails() {

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

  const [drivers,
    setDrivers] =
    useState([]);

  const [loading,
    setLoading] =
    useState(true);

  const [routeCoords,
    setRouteCoords] =
    useState([]);

  const [assigning,
    setAssigning] =
    useState(false);

  // =====================================
  // FETCH BOOKING
  // =====================================
  useEffect(() => {

    fetchBooking();

    fetchDrivers();

  }, []);

  // =====================================
  // FETCH BOOKING
  // =====================================
  const fetchBooking =
    async () => {

      try {

        const response =
          await axios.get(
            `http://localhost:5000/api/bookings/${id}`
          );

        const bookingData =
          response.data.booking;

        setBooking(
          bookingData
        );

        calculateRoute(
          bookingData
        );

      } catch (error) {

        console.log(error);
      }

      setLoading(false);
    };

  // =====================================
  // FETCH DRIVERS
  // =====================================
  const fetchDrivers =
    async () => {

      try {

        const response =
          await axios.get(
            "http://localhost:5000/api/users/drivers"
          );

        setDrivers(
          response.data.drivers || []
        );

      } catch (error) {

        console.log(error);
      }
    };

  // =====================================
  // CALCULATE ROUTE
  // =====================================
  const calculateRoute =
    async (bookingData) => {

      try {

        if (
          !bookingData?.pickupCoordinates ||
          !bookingData?.dropCoordinates
        ) {
          return;
        }

        const response =
          await axios.post(

            "https://api.openrouteservice.org/v2/directions/driving-car/geojson",

            {
              coordinates: [

                [
                  bookingData.pickupCoordinates.lng,
                  bookingData.pickupCoordinates.lat,
                ],

                [
                  bookingData.dropCoordinates.lng,
                  bookingData.dropCoordinates.lat,
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

  // =====================================
  // ASSIGN DRIVER
  // =====================================
  const assignDriver =
    async (driverId) => {

      try {

        setAssigning(true);

        await axios.put(

          `http://localhost:5000/api/bookings/assign/${id}`,

          {
            driverId,
          }
        );

        alert(
          "Driver Assigned Successfully"
        );

        fetchBooking();

      } catch (error) {

        console.log(error);

        alert(
          "Failed to assign driver"
        );
      }

      setAssigning(false);
    };

  // =====================================
  // LOADING
  // =====================================
  if (loading || !booking) {

    return (

      <div className="min-h-screen flex items-center justify-center text-3xl font-bold">
        Loading Booking...
      </div>
    );
  }

  return (

    <div className="min-h-screen bg-[#f6f8fc] p-8">

      <div className="grid lg:grid-cols-[420px_1fr_420px] gap-8">

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
                Shipment
              </h1>
            </div>

            {/* BACK */}
            <button

              onClick={() =>
                navigate(-1)
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
                  {booking.duration} mins
                </h2>
              </div>
            </div>

            {/* STATUS */}
            <div className="bg-orange-50 rounded-3xl p-5 mt-5">

              <p className="text-gray-500 mb-2">
                Shipment Status
              </p>

              <h2 className="text-3xl font-bold text-orange-500">
                {booking.status}
              </h2>
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

        {/* =====================================
            DRIVERS PANEL
        ===================================== */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 overflow-y-auto">

          {/* HEADER */}
          <div className="mb-8">

            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Available Drivers
            </h1>

            <p className="text-gray-500">
              Assign a driver to this shipment
            </p>
          </div>

          {/* DRIVERS */}
          <div className="space-y-5">

            {drivers.map((driver) => (

              <div
                key={driver._id}
                className="border border-gray-200 rounded-3xl p-5 hover:border-orange-300 transition"
              >

                {/* TOP */}
                <div className="flex items-center gap-4 mb-5">

                  <img
                    src={`https://ui-avatars.com/api/?name=${driver.name}`}
                    alt="driver"
                    className="w-16 h-16 rounded-2xl"
                  />

                  <div className="flex-1">

                    <h2 className="text-xl font-bold text-gray-900">
                      {driver.name}
                    </h2>

                    <p className="text-gray-500">
                      {driver.email}
                    </p>
                  </div>

                  <div className="w-4 h-4 rounded-full bg-green-500"></div>
                </div>

                {/* INFO */}
                <div className="space-y-3 mb-6">

                  <div className="flex items-center gap-3 text-gray-600">

                    <Truck size={18} />

                    <span>
                      Driver Account
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-gray-600">

                    <Phone size={18} />

                    <span>
                      Available
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-gray-600">

                    <Star size={18} />

                    <span>
                      4.8 Rating
                    </span>
                  </div>
                </div>

                {/* BUTTON */}
                <button

                  disabled={assigning}

                  onClick={() =>
                    assignDriver(
                      driver._id
                    )
                  }

                  className="w-full bg-[#ff7b00] hover:bg-[#ff8d1f] disabled:opacity-50 text-white py-4 rounded-2xl font-semibold transition flex items-center justify-center gap-3"
                >

                  <UserCheck size={20} />

                  Assign Driver
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}