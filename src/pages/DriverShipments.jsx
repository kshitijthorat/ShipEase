// src/pages/DriverShipments.jsx

import React, {
  useEffect,
  useState,
} from "react";

import axios from "axios";

import {
  useNavigate,
} from "react-router-dom";

import {

  Truck,
  MapPin,
  Route,
  Clock3,
  Package,
  Wallet,
  CheckCircle2,
  XCircle,
  RefreshCcw,
  Eye,
  LogOut,

} from "lucide-react";

export default function DriverShipments() {

  const navigate =
    useNavigate();

  // =====================================
  // STATES
  // =====================================
  const [bookings,
    setBookings] =
    useState([]);

  const [loading,
    setLoading] =
    useState(true);

  // =====================================
  // GET DRIVER
  // =====================================
  const user =
    JSON.parse(
      localStorage.getItem(
        "user"
      )
    );

  // =====================================
  // FETCH BOOKINGS
  // =====================================
  useEffect(() => {

    fetchBookings();

  }, []);

  const fetchBookings =
    async () => {

      try {

        const response =
          await axios.get(
            `http://localhost:5000/api/bookings/driver/${user._id}`
          );

        setBookings(
          response.data.bookings || []
        );

      } catch (error) {

        console.log(error);
      }

      setLoading(false);
    };

  // =====================================
  // UPDATE STATUS
  // =====================================
  const updateStatus =
    async (
      bookingId,
      status
    ) => {

      try {

        await axios.put(

          `http://localhost:5000/api/bookings/update-status/${bookingId}`,

          {
            status,
          }
        );

        fetchBookings();

      } catch (error) {

        console.log(error);

        alert(
          "Failed to update booking"
        );
      }
    };

  // =====================================
  // CANCEL BOOKING
  // =====================================
  const cancelBooking =
    async (bookingId) => {

      try {

        await axios.put(

          `http://localhost:5000/api/bookings/update-status/${bookingId}`,

          {
            status:
              "Cancelled",
          }
        );

        fetchBookings();

      } catch (error) {

        console.log(error);

        alert(
          "Failed to cancel booking"
        );
      }
    };

  return (

    <div className="min-h-screen bg-[#f6f8fc] flex">

      {/* =====================================
          SIDEBAR
      ===================================== */}
      <div className="w-[280px] bg-white border-r border-gray-200 p-6 flex flex-col justify-between">

        <div>

          {/* LOGO */}
          <div className="mb-14">

            <h1 className="text-5xl font-black text-[#ff7b00]">
              ShipEase
            </h1>

            <p className="text-gray-500 mt-2">
              Driver Console
            </p>
          </div>

          {/* MENU */}
          <div className="space-y-4">

            <button
              className="w-full bg-orange-50 border border-orange-200 text-orange-500 px-5 py-4 rounded-2xl flex items-center gap-4"
            >

              <Truck size={22} />

              <span className="font-semibold">
                Assigned Shipments
              </span>
            </button>
          </div>
        </div>

        {/* LOGOUT */}
        <button

          onClick={() => {

            localStorage.clear();

            navigate("/login");
          }}

          className="w-full bg-red-500 hover:bg-red-600 text-white py-4 rounded-2xl flex items-center justify-center gap-3 font-semibold transition"
        >

          <LogOut size={20} />

          Logout
        </button>
      </div>

      {/* =====================================
          MAIN
      ===================================== */}
      <div className="flex-1 p-8 overflow-y-auto">

        {/* HEADER */}
        <div className="flex items-center justify-between mb-10">

          <div>

            <h1 className="text-6xl font-black text-gray-900 mb-3">
              Assigned Shipments
            </h1>

            <p className="text-xl text-gray-500">
              Manage your assigned deliveries and update shipment status.
            </p>
          </div>

          <button

            onClick={fetchBookings}

            className="bg-white border border-gray-200 hover:bg-gray-100 transition px-6 py-4 rounded-2xl flex items-center gap-3 font-semibold"
          >

            <RefreshCcw size={20} />

            Refresh
          </button>
        </div>

        {/* =====================================
            BOOKINGS
        ===================================== */}
        <div className="space-y-6">

          {loading ? (

            <div className="text-2xl font-bold">
              Loading Shipments...
            </div>

          ) : bookings.length === 0 ? (

            <div className="bg-white rounded-3xl p-10 border border-gray-200 text-center">

              <Truck
                size={70}
                className="mx-auto text-orange-400 mb-5"
              />

              <h1 className="text-3xl font-bold text-gray-900 mb-3">
                No Assigned Shipments
              </h1>

              <p className="text-gray-500">
                You currently have no assigned deliveries.
              </p>
            </div>

          ) : (

            bookings.map((booking) => (

              <div
                key={booking._id}
                className="bg-white rounded-3xl border border-gray-200 p-8 shadow-sm"
              >

                {/* TOP */}
                <div className="flex items-start justify-between mb-8">

                  <div>

                    <p className="text-orange-500 font-semibold mb-2">
                      {booking.trackingId}
                    </p>

                    <h1 className="text-3xl font-bold text-gray-900">
                      {booking.goodsType}
                    </h1>
                  </div>

                  <div className="bg-orange-50 text-orange-500 px-5 py-3 rounded-2xl font-semibold">

                    {booking.status}
                  </div>
                </div>

                {/* DETAILS */}
                <div className="grid grid-cols-2 gap-6 mb-8">

                  {/* PICKUP */}
                  <div className="flex gap-4">

                    <div className="w-14 h-14 rounded-2xl bg-orange-50 text-orange-500 flex items-center justify-center">

                      <MapPin size={24} />
                    </div>

                    <div>

                      <p className="text-gray-400 mb-2">
                        Pickup
                      </p>

                      <h2 className="font-semibold text-gray-900">
                        {booking.pickupAddress}
                      </h2>
                    </div>
                  </div>

                  {/* DROP */}
                  <div className="flex gap-4">

                    <div className="w-14 h-14 rounded-2xl bg-orange-50 text-orange-500 flex items-center justify-center">

                      <Route size={24} />
                    </div>

                    <div>

                      <p className="text-gray-400 mb-2">
                        Drop
                      </p>

                      <h2 className="font-semibold text-gray-900">
                        {booking.dropAddress}
                      </h2>
                    </div>
                  </div>

                  {/* DISTANCE */}
                  <div className="flex gap-4">

                    <div className="w-14 h-14 rounded-2xl bg-orange-50 text-orange-500 flex items-center justify-center">

                      <Clock3 size={24} />
                    </div>

                    <div>

                      <p className="text-gray-400 mb-2">
                        Distance
                      </p>

                      <h2 className="font-semibold text-gray-900">
                        {booking.distance} KM
                      </h2>
                    </div>
                  </div>

                  {/* FARE */}
                  <div className="flex gap-4">

                    <div className="w-14 h-14 rounded-2xl bg-orange-50 text-orange-500 flex items-center justify-center">

                      <Wallet size={24} />
                    </div>

                    <div>

                      <p className="text-gray-400 mb-2">
                        Fare
                      </p>

                      <h2 className="font-semibold text-orange-500">
                        ₹{booking.estimatedFare}
                      </h2>
                    </div>
                  </div>
                </div>

                {/* ACTIONS */}
                <div className="flex flex-wrap gap-4">

                  {/* VIEW */}
                  <button

                    onClick={() =>
                      navigate(
                        `/bookingdetailsuser/${booking._id}`
                      )
                    }

                    className="bg-gray-100 hover:bg-gray-200 transition px-5 py-4 rounded-2xl flex items-center gap-3 font-semibold"
                  >

                    <Eye size={20} />

                    View
                  </button>

                  {/* ACCEPT */}
                  <button

                    onClick={() =>
                      updateStatus(
                        booking._id,
                        "Accepted"
                      )
                    }

                    className="bg-green-500 hover:bg-green-600 transition px-5 py-4 rounded-2xl text-white flex items-center gap-3 font-semibold"
                  >

                    <CheckCircle2 size={20} />

                    Accept
                  </button>

                  {/* IN TRANSIT */}
                  <button

                    onClick={() =>
                      updateStatus(
                        booking._id,
                        "In Transit"
                      )
                    }

                    className="bg-blue-500 hover:bg-blue-600 transition px-5 py-4 rounded-2xl text-white flex items-center gap-3 font-semibold"
                  >

                    <Truck size={20} />

                    In Transit
                  </button>

                  {/* DELIVERED */}
                  <button

                    onClick={() =>
                      updateStatus(
                        booking._id,
                        "Delivered"
                      )
                    }

                    className="bg-orange-500 hover:bg-orange-600 transition px-5 py-4 rounded-2xl text-white flex items-center gap-3 font-semibold"
                  >

                    <Package size={20} />

                    Delivered
                  </button>

                  {/* CANCEL */}
                  <button

                    onClick={() =>
                      cancelBooking(
                        booking._id
                      )
                    }

                    className="bg-red-500 hover:bg-red-600 transition px-5 py-4 rounded-2xl text-white flex items-center gap-3 font-semibold"
                  >

                    <XCircle size={20} />

                    Cancel
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}