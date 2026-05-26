// src/pages/BookingPage.jsx

import React, {
  useState,
} from "react";

import BookingSidebar from "../components/booking/BookingSidebar";

import MapView from "../components/booking/MapView";

export default function BookingPage() {

  const [pickup,
    setPickup] =
    useState("");

  const [drop,
    setDrop] =
    useState("");

  // =====================================
  // PICKUP COORDINATES
  // =====================================
  const [pickupCoords,
    setPickupCoords] =
    useState(null);

  // =====================================
  // DROP COORDINATES
  // =====================================
  const [dropCoords,
    setDropCoords] =
    useState(null);

  // =====================================
  // ROUTE LINE COORDINATES
  // =====================================
  const [routeCoords,
    setRouteCoords] =
    useState([]);

  // =====================================
  // DISTANCE
  // =====================================
  const [distance,
    setDistance] =
    useState("");

  // =====================================
  // DURATION
  // =====================================
  const [duration,
    setDuration] =
    useState("");

  // =====================================
  // VEHICLE
  // =====================================
  const [selectedVehicle,
    setSelectedVehicle] =
    useState("Truck");


  return (

    <div className="min-h-screen bg-[#f7f7f7] flex flex-col lg:flex-row">

      {/* SIDEBAR */}
      <div className="w-full lg:w-[450px] bg-white min-h-screen px-6 py-6 flex flex-col shadow-sm z-[1000]">

        <BookingSidebar

          pickup={pickup}
          setPickup={setPickup}

          drop={drop}
          setDrop={setDrop}

          // =====================================
          // PICKUP COORDS
          // =====================================
          pickupCoords={pickupCoords}
          setPickupCoords={setPickupCoords}

          // =====================================
          // DROP COORDS
          // =====================================
          dropCoords={dropCoords}
          setDropCoords={setDropCoords}

          // =====================================
          // ROUTE COORDS
          // =====================================
          routeCoords={routeCoords}
          setRouteCoords={setRouteCoords}

          // =====================================
          // DISTANCE
          // =====================================
          distance={distance}
          setDistance={setDistance}

          // =====================================
          // DURATION
          // =====================================
          duration={duration}
          setDuration={setDuration}

          // =====================================
          // VEHICLE
          // =====================================
          selectedVehicle={selectedVehicle}
          setSelectedVehicle={setSelectedVehicle}
        />
      </div>


      {/* MAP */}
      <MapView

        pickup={pickup}

        drop={drop}

        // =====================================
        // PICKUP PIN
        // =====================================
        pickupCoords={pickupCoords}

        // =====================================
        // DROP PIN
        // =====================================
        dropCoords={dropCoords}

        // =====================================
        // ROUTE LINE
        // =====================================
        routeCoords={routeCoords}

        distance={distance}

        duration={duration}

        selectedVehicle={selectedVehicle}
      />
    </div>
  );
}