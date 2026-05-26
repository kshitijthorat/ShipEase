// src/pages/MyBookingsDashboard.jsx

import React, {
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import { LogOut } from "lucide-react";

import {
  Bell,
  Plus,
  Truck,
  MapPin,
  Package,
  Clock3,
  Search,
  Filter,
  Pencil,
  Trash2,
  LayoutDashboard,
  Route,
  BarChart3,
  Settings,
  Headphones,
} from "lucide-react";

import axios from "axios";

export default function MyBookingsDashboard() {

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
            "http://localhost:5000/api/bookings"
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
  // DELETE BOOKING
  // =====================================
  const deleteBooking =
    async (id) => {

      const confirmDelete =
        window.confirm(
          "Delete this booking?"
        );

      if (!confirmDelete)
        return;

      try {

        await axios.delete(
          `http://localhost:5000/api/bookings/${id}`
        );

        fetchBookings();

      } catch (error) {

        console.log(error);
      }
    };

  // =====================================
  // STATS
  // =====================================
  const totalBookings =
    bookings.length;

  const delivered =
    bookings.filter(
      (item) =>
        item.status ===
        "Delivered"
    ).length;

  const active =
    bookings.filter(
      (item) =>
        item.status !==
          "Delivered" &&
        item.status !==
          "Cancelled"
    ).length;

  const cancelled =
    bookings.filter(
      (item) =>
        item.status ===
        "Cancelled"
    ).length;

  const revenue =
    bookings.reduce(
      (acc, item) =>
        acc +
        (item.finalFare ||
          item.estimatedFare ||
          0),
      0
    );

  return (

    <div className="min-h-screen bg-[#f6f8fc] text-black flex overflow-hidden">

      {/* =====================================
          SIDEBAR
      ===================================== */}
      
      {/* =====================================
          MAIN
      ===================================== */}
      <div className="flex-1 p-8 overflow-y-auto">

        {/* TOPBAR */}
        <div className="flex items-center justify-between gap-6 mb-10">

          {/* SEARCH */}
          <div className="flex-1 relative">

            <Search
              className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500"
              size={22}
            />

            <input
              placeholder="Search shipments, drivers or tracking IDs"
              className="w-full bg-white border border-gray-200 rounded-2xl py-4 pl-14 pr-5 outline-none focus:border-orange-400"
            />
          </div>

          {/* NOTIFICATION */}
          <button className="p-4 rounded-2xl bg-white border border-gray-200 hover:bg-gray-100 transition">

            <Bell size={22} />
          </button>
          <button

  onClick={() => {

    localStorage.removeItem("token");

    localStorage.removeItem("user");

    navigate("/login");
  }}

  className="bg-red-500 hover:bg-red-600 transition px-6 py-4 rounded-2xl font-semibold flex items-center gap-3 text-white shadow-lg"
>

  <LogOut size={22} />

  Logout
</button>

          {/* NEW BOOKING */}
          <button

            onClick={() =>
              navigate("/booking")
            }

            className="bg-[#ff7b00] hover:bg-[#ff8d1f] transition px-6 py-4 rounded-2xl font-semibold flex items-center gap-3 text-white shadow-lg"
          >

            <Plus size={22} />

            New Booking
          </button>
        </div>

        {/* =====================================
            STATS
        ===================================== */}
        <div className="grid grid-cols-5 gap-6 mb-10">

          {[
            {
              title: "TOTAL BOOKINGS",
              value: totalBookings,
            },

            {
              title: "DELIVERED",
              value: delivered,
            },

            {
              title: "ACTIVE",
              value: active,
            },

            {
              title: "CANCELLED",
              value: cancelled,
            },

            {
              title: "REVENUE",
              value: `₹${revenue}`,
            },
          ].map((item) => (

            <div
              key={item.title}
              className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm"
            >

              <p className="text-gray-500 text-sm tracking-[0.2em] mb-4">
                {item.title}
              </p>

              <h1 className="text-5xl font-bold text-gray-900">
                {item.value}
              </h1>
            </div>
          ))}
        </div>

        {/* =====================================
            BOOKINGS
        ===================================== */}
        <div>

          {/* HEADER */}
          <div className="flex items-center justify-between mb-8">

            <h1 className="text-5xl font-bold text-gray-900">
              My Bookings
            </h1>

            <button className="bg-white border border-gray-200 px-5 py-3 rounded-2xl flex items-center gap-3 hover:bg-gray-50 transition">

              <Filter size={18} />

              Filter
            </button>
          </div>

          {/* BOOKING GRID */}
          <div className="grid grid-cols-2 gap-8">

            {loading ? (

              <div className="text-gray-500">
                Loading...
              </div>

            ) : (

              bookings.map((booking) => (

                <div
                  key={booking._id}

                  onClick={() =>
                    navigate(
                      `/bookingdetailsuser/${booking._id}`
                    )
                  }

                  className="bg-white border border-gray-200 rounded-3xl p-7 cursor-pointer hover:border-orange-400 hover:shadow-xl hover:scale-[1.02] transition-all duration-500"
                >

                  {/* TOP */}
                  <div className="flex items-start justify-between mb-6">

                    <div>

                      <p className="text-[#ff7b00] mb-2 font-medium">
                        {booking.trackingId}
                      </p>

                      <h2 className="text-3xl font-bold text-gray-900">
                        {booking.goodsType ||
                          "Shipment"}
                      </h2>
                    </div>

                    <div className="bg-orange-50 text-orange-500 px-4 py-2 rounded-full text-sm font-semibold">
                      {booking.status}
                    </div>
                  </div>

                  {/* PICKUP */}
                  <div className="flex gap-4 mb-5">

                    <MapPin
                      className="text-orange-500"
                      size={20}
                    />

                    <div>

                      <p className="text-gray-500 text-sm mb-1">
                        PICKUP
                      </p>

                      <h3 className="text-lg font-medium text-gray-900">
                        {booking.pickupAddress}
                      </h3>
                    </div>
                  </div>

                  {/* DROP */}
                  <div className="flex gap-4 mb-7">

                    <Route
                      className="text-orange-500"
                      size={20}
                    />

                    <div>

                      <p className="text-gray-500 text-sm mb-1">
                        DESTINATION
                      </p>

                      <h3 className="text-lg font-medium text-gray-900">
                        {booking.dropAddress}
                      </h3>
                    </div>
                  </div>

                  {/* FOOTER */}
                  <div className="border-t border-gray-200 pt-6 flex items-center justify-between">

                    <div className="flex items-center gap-5 text-gray-500">

                      <div className="flex items-center gap-2">

                        <Truck size={18} />

                        {booking.vehicleType}
                      </div>

                      <div className="flex items-center gap-2">

                        <Clock3 size={18} />

                        {booking.duration} mins
                      </div>
                    </div>

                    {/* ACTIONS */}
                    <div className="flex items-center gap-4">

                      <button className="p-3 rounded-xl bg-gray-100 hover:bg-gray-200 transition">

                        <Pencil size={18} />
                      </button>

                      <button

                        onClick={(e) => {

                          e.stopPropagation();

                          deleteBooking(
                            booking._id
                          );
                        }}

                        className="p-3 rounded-xl bg-red-50 hover:bg-red-100 text-red-500 transition"
                      >

                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}