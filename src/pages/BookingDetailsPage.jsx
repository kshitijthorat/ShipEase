// src/pages/BookingDetailsPage.jsx

import React, {
  useState,
  useEffect,
} from "react";

import {
  useLocation,
  useNavigate,
} from "react-router-dom";

import {
  ArrowLeft,
  Truck,
  Clock3,
  Route,
  Calendar,
  ArrowRight,
} from "lucide-react";

export default function BookingDetailsPage() {

  const navigate = useNavigate();

  const location = useLocation();

  const bookingData = location.state;
  

  // =====================================
  // REDIRECT IF NO DATA
  // =====================================
  useEffect(() => {

    if (!bookingData) {

      navigate("/", {
        replace: true,
      });
    }

  }, [bookingData, navigate]);

  if (!bookingData) {
    return null;
  }

  // =====================================
  // ROUTE DATA
  // =====================================
  const {

    pickup,
    drop,
    distance,
    duration,
    selectedVehicle,

    pickupCoords,
    dropCoords,

  } = bookingData;

  // =====================================
  // STATES
  // =====================================
  const [
    goodsType,
    setGoodsType,
  ] = useState("");

  const [
    goodsWeight,
    setGoodsWeight,
  ] = useState("");

  const [
    notes,
    setNotes,
  ] = useState("");

  const [
    scheduledAt,
    setScheduledAt,
  ] = useState("");

  // =====================================
  // ESTIMATED FARE
  // =====================================
  const estimatedFare = (() => {

    const base =
      selectedVehicle === "Truck"
        ? 250
        : selectedVehicle ===
          "Mini Truck"
        ? 180
        : selectedVehicle ===
          "Two Wheeler"
        ? 80
        : 500;

    const km =
      parseFloat(distance) || 0;

    return Math.round(
      base + km * 15
    );

  })();

  // =====================================
  // CONFIRM BOOKING
  // =====================================
  const handleContinue =
    async () => {

      try {

        // VALIDATION
        if (!goodsType) {

          alert(
            "Please select goods type"
          );

          return;
        }

        if (!goodsWeight) {

          alert(
            "Please select goods weight"
          );

          return;
        }

        // =====================================
        // CREATE BOOKING
        // =====================================
        const response =
          await fetch(
            "http://localhost:5000/api/bookings/create",

            {
              method: "POST",

              headers: {

                "Content-Type":
                  "application/json",
              },

              body: JSON.stringify({

                pickupAddress:
                  pickup,

                // =====================================
                // PICKUP COORDINATES
                // =====================================
                pickupCoordinates: {

                  lat:
                    pickupCoords?.[0] || 0,

                  lng:
                    pickupCoords?.[1] || 0,
                },

                dropAddress:
                  drop,

                // =====================================
                // DROP COORDINATES
                // =====================================
                dropCoordinates: {

                  lat:
                    dropCoords?.[0] || 0,

                  lng:
                    dropCoords?.[1] || 0,
                },

                vehicleType:
                  selectedVehicle,

                goodsType,

                goodsWeight,

                estimatedFare,

                distance:
                  parseFloat(
                    distance
                  ),

                duration:
                  parseFloat(
                    duration
                  ),

                paymentMethod:
                  "Cash",

                notes,

                scheduledAt,
              }),
            }
          );

        // =====================================
        // RESPONSE
        // =====================================
        const data =
          await response.json();

        console.log(
          "SERVER RESPONSE:",
          data
        );

        if (!response.ok) {

          alert(
            JSON.stringify(data)
          );

          throw new Error(

            data.message ||

            "Booking failed"
          );
        }

        console.log(
          "BOOKING CREATED:",
          data
        );

        alert(
          "Booking created successfully!"
        );

        // =====================================
        // SUCCESS
        // =====================================
        navigate(
          "/mybookingsdashboard"
        );

      } catch (error) {

        console.log(error);

        alert(

          error.message ||

          "Failed to create booking"
        );
      }
    };

  return (

    <div className="min-h-screen bg-[#f7f7f7] py-10 px-4">

      <div className="max-w-7xl mx-auto grid lg:grid-cols-[1fr_380px] gap-8">

        {/* LEFT SIDE */}
        <div className="bg-white rounded-3xl p-8 shadow-sm">

          {/* HEADER */}
          <div className="flex items-center gap-4 mb-10">

            <button

              onClick={() =>
                navigate(-1)
              }

              className="w-14 h-14 rounded-2xl border flex items-center justify-center hover:bg-gray-100 transition"
            >

              <ArrowLeft size={24} />
            </button>

            <div>

              <h1 className="text-5xl font-bold">
                Booking Details
              </h1>

              <p className="text-gray-500 mt-2 text-lg">
                Complete your shipment details
              </p>
            </div>
          </div>

          {/* ROUTE INFO */}
          <div className="border rounded-3xl p-8 mb-8">

            <h2 className="text-2xl font-semibold mb-8">
              Route Information
            </h2>

            <div className="space-y-6">

              {/* PICKUP */}
              <div>

                <p className="text-sm text-gray-400 mb-3">
                  Pickup Location
                </p>

                <div className="border rounded-2xl px-5 py-5 bg-gray-50 font-medium text-lg">
                  {pickup}
                </div>
              </div>

              {/* DROP */}
              <div>

                <p className="text-sm text-gray-400 mb-3">
                  Drop Location
                </p>

                <div className="border rounded-2xl px-5 py-5 bg-gray-50 font-medium text-lg">
                  {drop}
                </div>
              </div>
            </div>
          </div>

          {/* GOODS INFO */}
          <div className="border rounded-3xl p-8 mb-8">

            <h2 className="text-3xl font-semibold mb-2">
              What are you shipping?
            </h2>

            <p className="text-gray-500 mb-8">
              Select goods type for better pricing and vehicle matching
            </p>

            {/* GOODS TYPES */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">

              {[
                {
                  title:
                    "Furniture",

                  image:
                    "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=800",
                },

                {
                  title:
                    "Electronics",

                  image:
                    "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=800",
                },

                {
                  title:
                    "Groceries",

                  image:
                    "https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=800",
                },

                {
                  title:
                    "Industrial",

                  image:
                    "https://images.unsplash.com/photo-1565793298595-6a879b1d9492?q=80&w=800",
                },
              ].map((item) => (

                <button

                  key={item.title}

                  onClick={() =>
                    setGoodsType(
                      item.title
                    )
                  }

                  className={`rounded-3xl overflow-hidden border transition-all duration-300 group

                  ${
                    goodsType ===
                    item.title
                      ? "border-black scale-[1.02] shadow-xl"
                      : "border-gray-200 hover:border-black"
                  }
                  `}
                >

                  <div className="h-40 overflow-hidden">

                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                    />
                  </div>

                  <div className="p-5">

                    <h3 className="font-semibold text-lg">
                      {item.title}
                    </h3>
                  </div>
                </button>
              ))}
            </div>

            {/* WEIGHT */}
            <div className="mt-10">

              <p className="text-sm text-gray-400 mb-4">
                Estimated Weight
              </p>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">

                {[
                  "0-10 KG",
                  "10-50 KG",
                  "50-100 KG",
                  "100+ KG",
                ].map((weight) => (

                  <button

                    key={weight}

                    onClick={() =>
                      setGoodsWeight(
                        weight
                      )
                    }

                    className={`py-5 rounded-2xl border font-semibold transition

                    ${
                      goodsWeight ===
                      weight
                        ? "bg-black text-white border-black"
                        : "hover:border-black"
                    }
                    `}
                  >
                    {weight}
                  </button>
                ))}
              </div>
            </div>

            {/* NOTES */}
            <div className="mt-10">

              <p className="text-sm text-gray-400 mb-4">
                Special Instructions
              </p>

              <textarea

                rows={5}

                value={notes}

                onChange={(e) =>
                  setNotes(
                    e.target.value
                  )
                }

                placeholder="Fragile items, floor number, lift availability..."

                className="w-full border rounded-3xl px-5 py-5 outline-none resize-none focus:border-black"
              />
            </div>
          </div>

          {/* SCHEDULE */}
          <div className="border rounded-3xl p-8">

            <h2 className="text-2xl font-semibold mb-6">
              Schedule Delivery
            </h2>

            <div className="relative">

              <Calendar
                size={20}
                className="absolute left-4 top-4 text-gray-400 pointer-events-none"
              />

              <input

                type="datetime-local"

                value={scheduledAt}

                onChange={(e) =>
                  setScheduledAt(
                    e.target.value
                  )
                }

                className="w-full border rounded-2xl pl-12 pr-4 py-4 outline-none focus:border-black"
              />
            </div>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="bg-black text-white rounded-3xl p-8 h-fit sticky top-6">

          <h2 className="text-4xl font-bold">
            Booking Summary
          </h2>

          <div className="mt-10 space-y-7">

            {/* VEHICLE */}
            <div className="flex items-center justify-between">

              <div className="flex items-center gap-3">

                <Truck size={24} />

                <span className="text-gray-300">
                  Vehicle
                </span>
              </div>

              <span className="font-semibold text-lg">
                {selectedVehicle}
              </span>
            </div>

            {/* DISTANCE */}
            <div className="flex items-center justify-between">

              <div className="flex items-center gap-3">

                <Route size={24} />

                <span className="text-gray-300">
                  Distance
                </span>
              </div>

              <span className="font-semibold text-lg">
                {distance}
              </span>
            </div>

            {/* ETA */}
            <div className="flex items-center justify-between">

              <div className="flex items-center gap-3">

                <Clock3 size={24} />

                <span className="text-gray-300">
                  ETA
                </span>
              </div>

              <span className="font-semibold text-lg">
                {duration}
              </span>
            </div>
          </div>

          {/* PRICE */}
          <div className="mt-12 border-t border-gray-800 pt-8">

            <div className="flex items-center justify-between">

              <p className="text-xl text-gray-300">
                Estimated Fare
              </p>

              <h2 className="text-5xl font-bold">
                ₹{estimatedFare}
              </h2>
            </div>
          </div>

          {/* BUTTON */}
          <button

            onClick={handleContinue}

            className="w-full mt-10 bg-white text-black py-5 rounded-2xl flex items-center justify-center gap-3 text-lg font-semibold hover:scale-[1.01] transition"
          >

            Confirm Booking

            <ArrowRight size={22} />
          </button>
        </div>
      </div>
    </div>
  );
}