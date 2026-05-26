// src/pages/RegisterDriver.jsx

import React, {
  useState,
} from "react";

import axios from "axios";

import {
  useNavigate,
} from "react-router-dom";

import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  Truck,
  ShieldCheck,
  Car,
  KeyRound,
  CheckCircle2,
} from "lucide-react";

export default function RegisterDriver() {

  const navigate =
    useNavigate();

  // =====================================
  // STATES
  // =====================================
  const [loading,
    setLoading] =
    useState(false);

  const [formData,
    setFormData] =
    useState({

      name: "",

      email: "",

      password: "",

      phone: "",

      vehicleType: "",

      vehicleNumber: "",

      licenseNumber: "",
    });

  // =====================================
  // HANDLE CHANGE
  // =====================================
  const handleChange =
    (e) => {

      setFormData({

        ...formData,

        [e.target.name]:
          e.target.value,
      });
    };

  // =====================================
  // SUBMIT
  // =====================================
  const handleSubmit =
    async (e) => {

      e.preventDefault();

      try {

        setLoading(true);

        const response =
          await axios.post(

            "http://localhost:5000/api/users/create-driver",

            {

              ...formData,

              role: "driver",
            }
          );

        alert(
          "Driver Registered Successfully"
        );

        console.log(
          response.data
        );

        navigate(
          "/mangerdashboard"
        );

      } catch (error) {

        console.log(error);

        alert(
          error.response?.data?.message ||

          "Failed to register driver"
        );
      }

      setLoading(false);
    };

  return (

    <div className="min-h-screen bg-[#f6f8fc] p-8">

      <div className="max-w-7xl mx-auto grid lg:grid-cols-[450px_1fr] gap-8">

        {/* =====================================
            LEFT PANEL
        ===================================== */}
        <div className="bg-white rounded-3xl p-8 border border-gray-200 shadow-sm">

          {/* BACK */}
          <button

            onClick={() =>
              navigate(-1)
            }

            className="w-14 h-14 rounded-2xl border border-gray-200 hover:bg-gray-100 transition flex items-center justify-center mb-10"
          >

            <ArrowLeft size={24} />
          </button>

          {/* TITLE */}
          <div className="mb-10">

            <p className="text-orange-500 font-semibold mb-3">
              ShipEase Fleet
            </p>

            <h1 className="text-5xl font-black text-gray-900 leading-tight">
              Register
              <br />
              New Driver
            </h1>

            <p className="text-gray-500 mt-5 text-lg">
              Add drivers to the logistics fleet and assign shipments instantly.
            </p>
          </div>

          {/* FEATURES */}
          <div className="space-y-5">

            {[
              "Fleet onboarding",
              "Shipment assignment",
              "Driver verification",
              "Live dispatch system",
              "Operations management",
            ].map((item) => (

              <div
                key={item}
                className="flex items-center gap-4"
              >

                <div className="w-12 h-12 rounded-2xl bg-orange-50 text-orange-500 flex items-center justify-center">

                  <CheckCircle2 size={22} />
                </div>

                <h2 className="text-lg font-semibold text-gray-800">
                  {item}
                </h2>
              </div>
            ))}
          </div>
        </div>

        {/* =====================================
            FORM
        ===================================== */}
        <div className="bg-white rounded-3xl p-10 border border-gray-200 shadow-sm">

          {/* HEADER */}
          <div className="mb-10">

            <h1 className="text-5xl font-black text-gray-900 mb-4">
              Driver Details
            </h1>

            <p className="text-gray-500 text-lg">
              Enter the driver's personal and vehicle information.
            </p>
          </div>

          {/* FORM */}
          <form
            onSubmit={
              handleSubmit
            }
            className="space-y-8"
          >

            {/* NAME */}
            <div>

              <label className="text-sm font-medium text-gray-500 mb-3 block">
                Full Name
              </label>

              <div className="relative">

                <User
                  size={20}
                  className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input

                  type="text"

                  name="name"

                  value={
                    formData.name
                  }

                  onChange={
                    handleChange
                  }

                  placeholder="Enter full name"

                  required

                  className="w-full border border-gray-200 rounded-2xl py-5 pl-14 pr-5 outline-none focus:border-orange-400"
                />
              </div>
            </div>

            {/* EMAIL */}
            <div>

              <label className="text-sm font-medium text-gray-500 mb-3 block">
                Email Address
              </label>

              <div className="relative">

                <Mail
                  size={20}
                  className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input

                  type="email"

                  name="email"

                  value={
                    formData.email
                  }

                  onChange={
                    handleChange
                  }

                  placeholder="Enter email"

                  required

                  className="w-full border border-gray-200 rounded-2xl py-5 pl-14 pr-5 outline-none focus:border-orange-400"
                />
              </div>
            </div>

            {/* PASSWORD */}
            <div>

              <label className="text-sm font-medium text-gray-500 mb-3 block">
                Password
              </label>

              <div className="relative">

                <KeyRound
                  size={20}
                  className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input

                  type="password"

                  name="password"

                  value={
                    formData.password
                  }

                  onChange={
                    handleChange
                  }

                  placeholder="Enter password"

                  required

                  className="w-full border border-gray-200 rounded-2xl py-5 pl-14 pr-5 outline-none focus:border-orange-400"
                />
              </div>
            </div>

            {/* PHONE */}
            <div>

              <label className="text-sm font-medium text-gray-500 mb-3 block">
                Phone Number
              </label>

              <div className="relative">

                <Phone
                  size={20}
                  className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input

                  type="text"

                  name="phone"

                  value={
                    formData.phone
                  }

                  onChange={
                    handleChange
                  }

                  placeholder="Enter phone number"

                  required

                  className="w-full border border-gray-200 rounded-2xl py-5 pl-14 pr-5 outline-none focus:border-orange-400"
                />
              </div>
            </div>

            {/* VEHICLE TYPE */}
            <div>

              <label className="text-sm font-medium text-gray-500 mb-3 block">
                Vehicle Type
              </label>

              <div className="relative">

                <Truck
                  size={20}
                  className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <select

                  name="vehicleType"

                  value={
                    formData.vehicleType
                  }

                  onChange={
                    handleChange
                  }

                  required

                  className="w-full border border-gray-200 rounded-2xl py-5 pl-14 pr-5 outline-none focus:border-orange-400 appearance-none bg-white"
                >

                  <option value="">
                    Select Vehicle
                  </option>

                  <option>
                    Two Wheeler
                  </option>

                  <option>
                    Mini Truck
                  </option>

                  <option>
                    Truck
                  </option>

                  <option>
                    Packers & Movers
                  </option>
                </select>
              </div>
            </div>

            {/* VEHICLE NUMBER */}
            <div>

              <label className="text-sm font-medium text-gray-500 mb-3 block">
                Vehicle Number
              </label>

              <div className="relative">

                <Car
                  size={20}
                  className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input

                  type="text"

                  name="vehicleNumber"

                  value={
                    formData.vehicleNumber
                  }

                  onChange={
                    handleChange
                  }

                  placeholder="MH12AB1234"

                  required

                  className="w-full border border-gray-200 rounded-2xl py-5 pl-14 pr-5 outline-none focus:border-orange-400"
                />
              </div>
            </div>

            {/* LICENSE */}
            <div>

              <label className="text-sm font-medium text-gray-500 mb-3 block">
                License Number
              </label>

              <div className="relative">

                <ShieldCheck
                  size={20}
                  className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input

                  type="text"

                  name="licenseNumber"

                  value={
                    formData.licenseNumber
                  }

                  onChange={
                    handleChange
                  }

                  placeholder="DL-XXXXXXXXXX"

                  required

                  className="w-full border border-gray-200 rounded-2xl py-5 pl-14 pr-5 outline-none focus:border-orange-400"
                />
              </div>
            </div>

            {/* BUTTON */}
            <button

              type="submit"

              disabled={loading}

              className="w-full bg-[#ff7b00] hover:bg-[#ff8d1f] disabled:opacity-50 text-white py-5 rounded-2xl text-lg font-semibold transition"
            >

              {
                loading
                  ? "Registering Driver..."
                  : "Register Driver"
              }
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}