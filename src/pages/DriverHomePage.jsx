// src/pages/DriverHomePage.jsx

import React, {
  useEffect,
  useState,
} from "react";

import {
  Bell,
  Truck,
  MapPin,
  Route,
  Clock3,
  Wallet,
  Package,
  ArrowRight,
  Search,
  Filter,
  Navigation,
  Star,
} from "lucide-react";

import axios from "axios";
import { LogOut } from "lucide-react";
import {
  useNavigate,
} from "react-router-dom";

export default function DriverHomePage() {

  const navigate =
    useNavigate();

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

        setLoading(true);

        // =====================================
        // FETCH ALL BOOKINGS
        // =====================================
        const response =
          await axios.get(
            "http://localhost:5000/api/bookings"
          );

        console.log(
          "API RESPONSE:",
          response.data
        );

        if (
          response.data &&
          response.data.bookings
        ) {

          setBookings(
            response.data.bookings
          );

        } else {

          setBookings([]);
        }

      } catch (error) {

        console.log(
          "FETCH ERROR:",
          error
        );

        setBookings([]);
      }

      setLoading(false);
    };


  // =====================================
  // ACCEPT BOOKING
  // =====================================
  const acceptBooking =
    async (booking) => {

      try {

        const response =
          await axios.put(

            `http://localhost:5000/api/bookings/accept/${booking._id}`
          );

        navigate(

          "/driverdashboard",

          {
            state: {

              booking:
                response.data.booking,
            },
          }
        );

      } catch (error) {

        console.log(error);

        alert(
          "Failed to accept booking"
        );
      }
    };


  return (

    <div className="min-h-screen bg-[#f6f8fc] flex">

      {/* MAIN */}
      <div className="flex-1 p-8 overflow-y-auto">

        {/* TOPBAR */}
        <div className="flex items-center justify-between mb-10">

          <div>

            <h1 className="text-5xl font-bold text-gray-900">
              Available Shipments
            </h1>

            <p className="text-gray-500 mt-2 text-lg">
              Browse and accept deliveries near you
            </p>
          </div>


          <div className="flex items-center gap-4">

            <div className="relative">

              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                size={20}
              />

              <input
                placeholder="Search deliveries"
                className="bg-white border border-gray-200 rounded-2xl py-4 pl-12 pr-5 outline-none w-[320px] focus:border-orange-400"
              />
            </div>


            <button className="bg-white border border-gray-200 p-4 rounded-2xl hover:bg-gray-50 transition">

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
          </div>
        </div>


        {/* TOTAL BOOKINGS */}
        <div className="mb-6">

          <h2 className="text-2xl font-bold text-gray-900">

            Total Bookings:
            {bookings.length}

          </h2>
        </div>


        {/* STATS */}
        <div className="grid grid-cols-4 gap-6 mb-10">

          {[
            {
              title: "AVAILABLE",
              value: bookings.length,
              icon: Package,
            },

            {
              title: "EST. EARNINGS",
              value: "₹12.5K",
              icon: Wallet,
            },

            {
              title: "DELIVERIES",
              value: "148",
              icon: Truck,
            },

            {
              title: "RATING",
              value: "4.9",
              icon: Star,
            },
          ].map((item) => {

            const Icon =
              item.icon;

            return (

              <div
                key={item.title}
                className="bg-white rounded-3xl p-7 shadow-sm border border-gray-100"
              >

                <div className="flex items-center justify-between mb-6">

                  <div className="w-14 h-14 rounded-2xl bg-orange-50 flex items-center justify-center text-orange-500">

                    <Icon size={26} />
                  </div>


                  <Filter
                    className="text-gray-300"
                    size={18}
                  />
                </div>


                <p className="text-sm text-gray-400 tracking-[0.2em] mb-3">
                  {item.title}
                </p>

                <h1 className="text-5xl font-bold text-gray-900">
                  {item.value}
                </h1>
              </div>
            );
          })}
        </div>


        {/* BOOKINGS */}
        <div className="grid lg:grid-cols-2 gap-8">

          {loading ? (

            <div className="text-2xl font-semibold">
              Loading...
            </div>

          ) : (

            bookings?.map((booking) => (

              <div
                key={booking._id}
                className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300"
              >

                {/* HEADER */}
                <div className="flex items-start justify-between mb-8">

                  <div>

                    <p className="text-orange-500 font-medium mb-2">
                      {booking.trackingId}
                    </p>

                    <h2 className="text-3xl font-bold text-gray-900">
                      {booking.goodsType || "General Shipment"}
                    </h2>
                  </div>


                  <div className="bg-orange-50 text-orange-600 px-4 py-2 rounded-full font-semibold text-sm">
                    {booking.status}
                  </div>
                </div>


                {/* LOCATIONS */}
                <div className="space-y-6 mb-8">

                  {/* PICKUP */}
                  <div className="flex gap-4">

                    <div className="w-12 h-12 rounded-2xl bg-orange-50 flex items-center justify-center text-orange-500">

                      <MapPin size={22} />
                    </div>

                    <div>

                      <p className="text-sm text-gray-400 mb-1">
                        PICKUP
                      </p>

                      <h3 className="text-lg font-semibold text-gray-900">
                        {booking.pickupAddress}
                      </h3>
                    </div>
                  </div>


                  {/* DROP */}
                  <div className="flex gap-4">

                    <div className="w-12 h-12 rounded-2xl bg-orange-50 flex items-center justify-center text-orange-500">

                      <Route size={22} />
                    </div>

                    <div>

                      <p className="text-sm text-gray-400 mb-1">
                        DROP LOCATION
                      </p>

                      <h3 className="text-lg font-semibold text-gray-900">
                        {booking.dropAddress}
                      </h3>
                    </div>
                  </div>
                </div>


                {/* STATS */}
                <div className="grid grid-cols-3 gap-4 mb-8">

                  <div className="bg-gray-50 rounded-2xl p-4">

                    <p className="text-gray-400 text-sm mb-2">
                      Vehicle
                    </p>

                    <h3 className="font-bold text-gray-900">
                      {booking.vehicleType}
                    </h3>
                  </div>


                  <div className="bg-gray-50 rounded-2xl p-4">

                    <p className="text-gray-400 text-sm mb-2">
                      Distance
                    </p>

                    <h3 className="font-bold text-gray-900">
                      {booking.distance || 0} KM
                    </h3>
                  </div>


                  <div className="bg-gray-50 rounded-2xl p-4">

                    <p className="text-gray-400 text-sm mb-2">
                      Fare
                    </p>

                    <h3 className="font-bold text-orange-500">
                      ₹{booking.estimatedFare}
                    </h3>
                  </div>
                </div>


                {/* ACTIONS */}
                <div className="flex items-center justify-between">

                  <div className="flex items-center gap-3 text-gray-500">

                    <Clock3 size={18} />

                    <span>
                      {booking.duration || 0} mins
                    </span>
                  </div>


                  <div className="flex items-center gap-4">

                    <button className="px-5 py-3 rounded-2xl border border-gray-200 hover:bg-gray-50 transition flex items-center gap-2">

                      <Navigation size={18} />

                      Route
                    </button>


                    <button

                      onClick={() =>
                        acceptBooking(
                          booking
                        )
                      }

                      className="bg-orange-500 hover:bg-orange-600 transition text-white px-6 py-3 rounded-2xl font-semibold flex items-center gap-3"
                    >

                      Accept

                      <ArrowRight size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}