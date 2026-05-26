// src/components/booking/VehicleSelector.jsx

import React from "react";

import {
  Truck,
  Bike,
  Package,
} from "lucide-react";

export default function VehicleSelector({
  selectedVehicle,
  setSelectedVehicle,
}) {

  const vehicleOptions = [
    {
      name: "Truck",
      icon: <Truck size={40} />,
    },

    {
      name: "Two Wheeler",
      icon: <Bike size={40} />,
    },

    {
      name: "Packers & Movers",
      icon: <Package size={40} />,
    },
  ];

  return (
    <div className="mt-12">

      <h2 className="text-lg font-semibold mb-6">
        Select Vehicle
      </h2>

      <div className="grid grid-cols-3 gap-4">

        {vehicleOptions.map(
          (vehicle) => (

            <button
              key={vehicle.name}
              onClick={() =>
                setSelectedVehicle(
                  vehicle.name
                )
              }
              className={`border rounded-2xl p-5 flex flex-col items-center gap-4

              ${
                selectedVehicle ===
                vehicle.name
                  ? "bg-black text-white"
                  : "bg-white"
              }
              `}
            >
              {vehicle.icon}

              <p className="text-sm font-medium">
                {vehicle.name}
              </p>
            </button>
          )
        )}
      </div>
    </div>
  );
}