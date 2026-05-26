// src/pages/ManagerDashboard.jsx

import React, {
  useEffect,
  useState,
} from "react";

import axios from "axios";

import {
  useNavigate,
} from "react-router-dom";

import {

  Bell,
  Search,

  Package,
  Truck,
  Route,
  Wallet,
  AlertTriangle,
  CheckCircle2,
  Clock3,
  UserCheck,
  MapPin,
  Eye,
  ArrowRight,

} from "lucide-react";

export default function ManagerDashboard() {

  const navigate =
    useNavigate();

  // =====================================
  // LOGGED IN USER
  // =====================================
  const user =
    JSON.parse(
      localStorage.getItem(
        "user"
      )
    );

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
  // STATS
  // =====================================
  const totalBookings =
    bookings.length;

  const activeDeliveries =
    bookings.filter(
      (item) =>
        item.status ===
          "Accepted" ||
        item.status ===
          "In Transit"
    ).length;

  const delivered =
    bookings.filter(
      (item) =>
        item.status ===
        "Delivered"
    ).length;

  const cancelled =
    bookings.filter(
      (item) =>
        item.status ===
        "Cancelled"
    ).length;

  const pendingAssignments =
    bookings.filter(
      (item) =>
        !item.driver
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

    <div className="min-h-screen bg-[#f6f8fc] flex overflow-hidden">

      {/* =====================================
          MAIN
      ===================================== */}
      <div className="flex-1 p-8 overflow-y-auto">

        {/* =====================================
            TOPBAR
        ===================================== */}
        <div className="flex items-center justify-between gap-6 mb-10">

          {/* SEARCH */}
          <div className="flex-1 relative">

            <Search
              className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500"
              size={22}
            />

            <input
              placeholder="Search bookings, drivers or customers"
              className="w-full bg-white border border-gray-200 rounded-2xl py-4 pl-14 pr-5 outline-none focus:border-orange-400"
            />
          </div>

          {/* NOTIFICATION */}
          <button className="p-4 rounded-2xl bg-white border border-gray-200 hover:bg-gray-100 transition">

            <Bell size={22} />
          </button>

          {/* USER INFO */}
          <div className="bg-white border border-gray-200 rounded-2xl px-5 py-3 flex items-center gap-4 shadow-sm">

            {/* AVATAR */}
            <div className="w-12 h-12 rounded-2xl bg-orange-500 text-white flex items-center justify-center text-xl font-bold">

              {user?.name?.charAt(0)}
            </div>

            {/* INFO */}
            <div>

              <p className="text-sm text-gray-400">
                Logged in as
              </p>

              <h2 className="font-bold text-gray-900">
                {user?.name || "Manager"}
              </h2>
            </div>
          </div>

          {/* ADD DRIVER */}
          <button

            onClick={() =>
              navigate(
                "/manager/register-driver"
              )
            }

            className="bg-[#ff7b00] hover:bg-[#ff8d1f] transition px-6 py-4 rounded-2xl font-semibold flex items-center gap-3 text-white shadow-lg"
          >

            <Truck size={22} />

            Add Driver
          </button>
          <button

  onClick={() =>
    navigate(
      "/manager/reports"
    )
  }

  className="bg-black hover:bg-gray-900 transition px-6 py-4 rounded-2xl text-white font-semibold"
>

  View Reports
</button>
        </div>

        {/* =====================================
            PAGE TITLE
        ===================================== */}
        <div className="mb-10">

          <h1 className="text-6xl font-black text-gray-900 mb-3">
            Operations Dashboard
          </h1>

          <p className="text-xl text-gray-500">
            Monitor bookings, drivers and logistics operations in real-time.
          </p>
        </div>

        {/* =====================================
            STATS
        ===================================== */}
        <div className="grid grid-cols-3 gap-6 mb-10">

          {[
            {
              title: "TOTAL BOOKINGS",
              value: totalBookings,
              icon: Package,
            },

            {
              title: "ACTIVE DELIVERIES",
              value: activeDeliveries,
              icon: Truck,
            },

            {
              title: "DELIVERED",
              value: delivered,
              icon: CheckCircle2,
            },

            {
              title: "CANCELLED",
              value: cancelled,
              icon: AlertTriangle,
            },

            {
              title: "PENDING ASSIGNMENTS",
              value: pendingAssignments,
              icon: Clock3,
            },

            {
              title: "TOTAL REVENUE",
              value: `₹${revenue}`,
              icon: Wallet,
            },
          ].map((item) => {

            const Icon =
              item.icon;

            return (

              <div
                key={item.title}
                className="bg-white border border-gray-200 rounded-3xl p-7 shadow-sm"
              >

                <div className="flex items-center justify-between mb-6">

                  <div className="w-14 h-14 rounded-2xl bg-orange-50 text-orange-500 flex items-center justify-center">

                    <Icon size={28} />
                  </div>

                  <ArrowRight
                    size={22}
                    className="text-gray-300"
                  />
                </div>

                <p className="text-gray-500 text-sm tracking-[0.2em] mb-3">
                  {item.title}
                </p>

                <h1 className="text-5xl font-black text-gray-900">
                  {item.value}
                </h1>
              </div>
            );
          })}
        </div>

        {/* =====================================
            QUICK ACTIONS
        ===================================== */}
        <div className="grid grid-cols-4 gap-6 mb-10">

          {[
            {
              title: "Assign Drivers",
              icon: UserCheck,
            },

          ].map((item) => {

            const Icon =
              item.icon;

            return (

              <button
                key={item.title}
                className="bg-white border border-gray-200 rounded-3xl p-7 hover:shadow-lg hover:border-orange-300 transition text-left"
              >

                <div className="w-14 h-14 rounded-2xl bg-orange-50 text-orange-500 flex items-center justify-center mb-5">

                  <Icon size={28} />
                </div>

                <h2 className="text-2xl font-bold text-gray-900">
                  {item.title}
                </h2>
              </button>
            );
          })}
        </div>

        {/* =====================================
            RECENT BOOKINGS
        ===================================== */}
        <div>

          <div className="flex items-center justify-between mb-8">

            <h1 className="text-5xl font-bold text-gray-900">
              Recent Shipments
            </h1>

            <button className="bg-white border border-gray-200 px-6 py-4 rounded-2xl hover:bg-gray-50 transition">

              View All
            </button>
          </div>

          {/* BOOKINGS */}
          <div className="space-y-6">

            {loading ? (

              <div className="text-gray-500">
                Loading...
              </div>

            ) : (

              bookings.slice(0, 6).map((booking) => (

                <div
                  key={booking._id}
                  className="bg-white border border-gray-200 rounded-3xl p-7 hover:shadow-lg transition"
                >

                  <div className="flex items-center justify-between">

                    {/* LEFT */}
                    <div className="flex items-center gap-8">

                      <div>

                        <p className="text-orange-500 font-semibold mb-2">
                          {booking.trackingId}
                        </p>

                        <h2 className="text-2xl font-bold text-gray-900">
                          {booking.goodsType}
                        </h2>
                      </div>

                      {/* PICKUP */}
                      <div className="flex items-center gap-3">

                        <MapPin
                          size={18}
                          className="text-orange-500"
                        />

                        <div>

                          <p className="text-sm text-gray-400">
                            PICKUP
                          </p>

                          <h3 className="font-medium text-gray-900">
                            {booking.pickupAddress}
                          </h3>
                        </div>
                      </div>

                      {/* DROP */}
                      <div className="flex items-center gap-3">

                        <Route
                          size={18}
                          className="text-orange-500"
                        />

                        <div>

                          <p className="text-sm text-gray-400">
                            DROP
                          </p>

                          <h3 className="font-medium text-gray-900">
                            {booking.dropAddress}
                          </h3>
                        </div>
                      </div>
                    </div>

                    {/* RIGHT */}
                    <div className="flex items-center gap-6">

                      <div className="text-right">

                        <p className="text-gray-400 text-sm mb-1">
                          STATUS
                        </p>

                        <h2 className="font-bold text-orange-500">
                          {booking.status}
                        </h2>
                      </div>

                      <div className="text-right">

                        <p className="text-gray-400 text-sm mb-1">
                          FARE
                        </p>

                        <h2 className="font-bold text-gray-900">
                          ₹
                          {booking.finalFare ||
                            booking.estimatedFare}
                        </h2>
                      </div>

                      <button

                        onClick={() =>
                          navigate(
                            `/manager/booking/${booking._id}`
                          )
                        }

                        className="w-14 h-14 rounded-2xl bg-orange-50 hover:bg-orange-100 text-orange-500 flex items-center justify-center transition"
                      >

                        <Eye size={24} />
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