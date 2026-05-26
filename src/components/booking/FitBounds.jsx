// src/components/booking/FitBounds.jsx

import { useEffect } from "react";

import { useMap } from "react-leaflet";

import L from "leaflet";

export default function FitBounds({
  routeCoords,
}) {

  const map = useMap();

  useEffect(() => {

    if (routeCoords.length > 0) {

      const bounds =
        L.latLngBounds(routeCoords);

      map.fitBounds(bounds, {
        padding: [50, 50],
      });
    }

  }, [routeCoords, map]);

  return null;
}