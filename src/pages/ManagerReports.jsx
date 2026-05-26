// src/pages/ManagerReports.jsx

import React, {
  useEffect,
  useState,
} from "react";

import axios from "axios";

import {
  useNavigate,
} from "react-router-dom";

import {

  ArrowLeft,
  Download,

  Package,
  Truck,
  Wallet,

  CheckCircle2,
  AlertTriangle,
  Clock3,

  Route,
  TrendingUp,
  Users,

} from "lucide-react";

export default function ManagerReports() {

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

    fetchReports();

  }, []);

  const fetchReports =
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
  // REPORT DATA
  // =====================================
  const totalBookings =
    bookings.length;

  const totalRevenue =
    bookings.reduce(
      (acc, item) =>
        acc +
        (item.finalFare ||
          item.estimatedFare ||
          0),
      0
    );

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

  const active =
    bookings.filter(
      (item) =>
        item.status ===
          "Accepted" ||
        item.status ===
          "In Transit"
    ).length;

  const pending =
    bookings.filter(
      (item) =>
        item.status ===
        "Pending"
    ).length;

  // =====================================
  // EXPORT REPORT
  // =====================================
  const exportReport =
    () => {

      const data =
        JSON.stringify(
          bookings,
          null,
          2
        );

      const blob =
        new Blob(
          [data],
          {
            type:
              "application/json",
          }
        );

      const url =
        URL.createObjectURL(
          blob
        );

      const a =
        document.createElement(
          "a"
        );

      a.href = url;

      a.download =
        "shipease-report.json";

      a.click();
    };

  return (

    <div className="min-h-screen bg-[#f6f8fc] p-8">

      {/* =====================================
          TOPBAR
      ===================================== */}
      <div className="flex items-center justify-between mb-10">

        {/* LEFT */}
        <div className="flex items-center gap-5">

          <button

            onClick={() =>
              navigate(
                "/mangerdashboard"
              )
            }

            className="w-14 h-14 rounded-2xl bg-white border border-gray-200 hover:bg-gray-100 transition flex items-center justify-center"
          >

            <ArrowLeft size={24} />
          </button>

          <div>

            <h1 className="text-6xl font-black text-gray-900 mb-2">
              Analytics & Reports
            </h1>

            <p className="text-xl text-gray-500">
              Monitor logistics operations, fleet activity and delivery performance.
            </p>
          </div>
        </div>

        {/* EXPORT */}
        <button

          onClick={exportReport}

          className="bg-[#ff7b00] hover:bg-[#ff8d1f] transition px-7 py-5 rounded-2xl text-white font-semibold flex items-center gap-3 shadow-lg"
        >

          <Download size={22} />

          Export Report
        </button>
      </div>

      {/* =====================================
          STATS
      ===================================== */}
      <div className="grid grid-cols-3 gap-6 mb-10">

        {[
          {
            title:
              "TOTAL BOOKINGS",

            value:
              totalBookings,

            icon:
              Package,
          },

          {
            title:
              "TOTAL REVENUE",

            value:
              `₹${totalRevenue}`,

            icon:
              Wallet,
          },

          {
            title:
              "ACTIVE SHIPMENTS",

            value:
              active,

            icon:
              Truck,
          },

          {
            title:
              "DELIVERED",

            value:
              delivered,

            icon:
              CheckCircle2,
          },

          {
            title:
              "CANCELLED",

            value:
              cancelled,

            icon:
              AlertTriangle,
          },

          {
            title:
              "PENDING",

            value:
              pending,

            icon:
              Clock3,
          },
        ].map((item) => {

          const Icon =
            item.icon;

          return (

            <div
              key={item.title}
              className="bg-white rounded-3xl border border-gray-200 p-7 shadow-sm"
            >

              <div className="flex items-center justify-between mb-6">

                <div className="w-14 h-14 rounded-2xl bg-orange-50 text-orange-500 flex items-center justify-center">

                  <Icon size={28} />
                </div>

                <TrendingUp
                  size={22}
                  className="text-gray-300"
                />
              </div>

              <p className="text-gray-500 tracking-[0.2em] text-sm mb-3">
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
          SHIPMENT ANALYTICS
      ===================================== */}
      <div className="grid lg:grid-cols-3 gap-8 mb-10">

        {/* VEHICLE ANALYTICS */}
        <div className="bg-white rounded-3xl border border-gray-200 p-8 shadow-sm">

          <div className="flex items-center gap-4 mb-8">

            <div className="w-14 h-14 rounded-2xl bg-orange-50 text-orange-500 flex items-center justify-center">

              <Truck size={28} />
            </div>

            <div>

              <h1 className="text-3xl font-bold text-gray-900">
                Vehicle Usage
              </h1>

              <p className="text-gray-500">
                Fleet allocation overview
              </p>
            </div>
          </div>

          <div className="space-y-5">

            {[
              "Two Wheeler",
              "Mini Truck",
              "Truck",
              "Packers & Movers",
            ].map((vehicle) => {

              const count =
                bookings.filter(
                  (item) =>
                    item.vehicleType === vehicle
                ).length;

              return (

                <div
                  key={vehicle}
                  className="flex items-center justify-between bg-gray-50 rounded-2xl p-5"
                >

                  <h2 className="font-semibold text-gray-800">
                    {vehicle}
                  </h2>

                  <div className="bg-orange-500 text-white px-4 py-2 rounded-xl font-bold">

                    {count}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* GOODS ANALYTICS */}
        <div className="bg-white rounded-3xl border border-gray-200 p-8 shadow-sm">

          <div className="flex items-center gap-4 mb-8">

            <div className="w-14 h-14 rounded-2xl bg-orange-50 text-orange-500 flex items-center justify-center">

              <Package size={28} />
            </div>

            <div>

              <h1 className="text-3xl font-bold text-gray-900">
                Goods Insights
              </h1>

              <p className="text-gray-500">
                Shipment categories
              </p>
            </div>
          </div>

          <div className="space-y-5">

            {[
              "Electronics",
              "Furniture",
              "Groceries",
              "Industrial",
            ].map((goods) => {

              const count =
                bookings.filter(
                  (item) =>
                    item.goodsType === goods
                ).length;

              return (

                <div
                  key={goods}
                  className="flex items-center justify-between bg-gray-50 rounded-2xl p-5"
                >

                  <h2 className="font-semibold text-gray-800">
                    {goods}
                  </h2>

                  <div className="bg-orange-500 text-white px-4 py-2 rounded-xl font-bold">

                    {count}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* DRIVER ANALYTICS */}
        <div className="bg-white rounded-3xl border border-gray-200 p-8 shadow-sm">

          <div className="flex items-center gap-4 mb-8">

            <div className="w-14 h-14 rounded-2xl bg-orange-50 text-orange-500 flex items-center justify-center">

              <Users size={28} />
            </div>

            <div>

              <h1 className="text-3xl font-bold text-gray-900">
                Driver Activity
              </h1>

              <p className="text-gray-500">
                Driver allocation metrics
              </p>
            </div>
          </div>

          <div className="space-y-5">

            <div className="flex items-center justify-between bg-gray-50 rounded-2xl p-5">

              <h2 className="font-semibold text-gray-800">
                Assigned Deliveries
              </h2>

              <div className="bg-green-500 text-white px-4 py-2 rounded-xl font-bold">

                {
                  bookings.filter(
                    (item) => item.driver
                  ).length
                }
              </div>
            </div>

            <div className="flex items-center justify-between bg-gray-50 rounded-2xl p-5">

              <h2 className="font-semibold text-gray-800">
                Unassigned Orders
              </h2>

              <div className="bg-red-500 text-white px-4 py-2 rounded-xl font-bold">

                {
                  bookings.filter(
                    (item) =>
                      !item.driver
                  ).length
                }
              </div>
            </div>

            <div className="flex items-center justify-between bg-gray-50 rounded-2xl p-5">

              <h2 className="font-semibold text-gray-800">
                Active Drivers
              </h2>

              <div className="bg-orange-500 text-white px-4 py-2 rounded-xl font-bold">

                {
                  bookings.filter(
                    (item) =>
                      item.status === "Accepted" ||
                      item.status === "In Transit"
                  ).length
                }
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* =====================================
          DELIVERY PERFORMANCE
      ===================================== */}
      <div className="bg-white rounded-3xl border border-gray-200 p-8 shadow-sm mb-10">

        <div className="flex items-center gap-4 mb-10">

          <div className="w-14 h-14 rounded-2xl bg-orange-50 text-orange-500 flex items-center justify-center">

            <TrendingUp size={28} />
          </div>

          <div>

            <h1 className="text-4xl font-black text-gray-900">
              Delivery Performance
            </h1>

            <p className="text-gray-500">
              Shipment completion overview
            </p>
          </div>
        </div>

        <div className="space-y-8">

          {/* DELIVERED */}
          <div>

            <div className="flex items-center justify-between mb-3">

              <h2 className="font-bold text-gray-900">
                Delivered Orders
              </h2>

              <p className="font-black text-green-500 text-xl">
                {delivered}
              </p>
            </div>

            <div className="w-full h-5 rounded-full bg-gray-100 overflow-hidden">

              <div
                className="h-full bg-green-500 rounded-full"
                style={{
                  width:
                    `${(delivered / totalBookings) * 100 || 0}%`,
                }}
              />
            </div>
          </div>

          {/* ACTIVE */}
          <div>

            <div className="flex items-center justify-between mb-3">

              <h2 className="font-bold text-gray-900">
                Active Shipments
              </h2>

              <p className="font-black text-orange-500 text-xl">
                {active}
              </p>
            </div>

            <div className="w-full h-5 rounded-full bg-gray-100 overflow-hidden">

              <div
                className="h-full bg-orange-500 rounded-full"
                style={{
                  width:
                    `${(active / totalBookings) * 100 || 0}%`,
                }}
              />
            </div>
          </div>

          {/* CANCELLED */}
          <div>

            <div className="flex items-center justify-between mb-3">

              <h2 className="font-bold text-gray-900">
                Cancelled Orders
              </h2>

              <p className="font-black text-red-500 text-xl">
                {cancelled}
              </p>
            </div>

            <div className="w-full h-5 rounded-full bg-gray-100 overflow-hidden">

              <div
                className="h-full bg-red-500 rounded-full"
                style={{
                  width:
                    `${(cancelled / totalBookings) * 100 || 0}%`,
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* =====================================
          RECENT REPORTS
      ===================================== */}
      <div className="bg-white rounded-3xl border border-gray-200 p-8 shadow-sm">

        <h1 className="text-4xl font-black text-gray-900 mb-8">
          Recent Shipment Reports
        </h1>

        <div className="space-y-5">

          {loading ? (

            <div className="text-gray-500">
              Loading reports...
            </div>

          ) : (

            bookings.slice(0, 10).map((booking) => (

              <div
                key={booking._id}
                className="flex items-center justify-between border border-gray-100 rounded-2xl p-5 hover:bg-gray-50 transition"
              >

                <div>

                  <p className="text-orange-500 font-semibold mb-2">
                    {booking.trackingId}
                  </p>

                  <h2 className="text-xl font-bold text-gray-900">
                    {booking.goodsType}
                  </h2>

                  <p className="text-gray-500 mt-1">
                    {booking.pickupAddress}
                    {" → "}
                    {booking.dropAddress}
                  </p>
                </div>

                <div className="text-right">

                  <h2 className="text-2xl font-black text-gray-900 mb-2">
                    ₹
                    {booking.finalFare ||
                      booking.estimatedFare}
                  </h2>

                  <p className="text-orange-500 font-semibold">
                    {booking.status}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}