// src/components/booking/DashboardMap.jsx

import React from "react";

import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
} from "react-leaflet";

import FitBounds from "../booking/FitBounds";

import "leaflet/dist/leaflet.css";

import L from "leaflet";

// =====================================
// FIX DEFAULT MARKER ICONS
// =====================================
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({

  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",

  iconUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",

  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

export default function DashboardMap({

  pickupCoords,
  dropCoords,

  routeCoords,
}) {

  console.log(
    "DASHBOARD ROUTE:",
    routeCoords
  );

  return (

    <div className="w-full h-full relative z-[1]">

      <MapContainer

        // IMPORTANT
        key={JSON.stringify(
          routeCoords
        )}

        center={[18.5204, 73.8567]}

        zoom={6}

        scrollWheelZoom={true}

        className="w-full h-full"
      >

        {/* MAP TILE */}
        <TileLayer

          attribution="OpenStreetMap"

          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* AUTO FIT */}
        <FitBounds
          routeCoords={routeCoords}
        />

        {/* PICKUP */}
        {pickupCoords && (

          <Marker
            position={pickupCoords}
          >

            <Popup>
              Pickup Location
            </Popup>
          </Marker>
        )}

        {/* DROP */}
        {dropCoords && (

          <Marker
            position={dropCoords}
          >

            <Popup>
              Drop Location
            </Popup>
          </Marker>
        )}

        {/* ROUTE */}
        {routeCoords &&
          routeCoords.length > 0 && (

          <Polyline

            positions={routeCoords}

            pathOptions={{

              color: "#ff7b00",

              weight: 6,

              opacity: 1,
            }}
          />
        )}
      </MapContainer>
      
    </div>
  );
}