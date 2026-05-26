// src/components/booking/LocationInput.jsx

import React, {
  useState,
  useMemo,
} from "react";

import axios from "axios";

import debounce from "lodash.debounce";

import {
  MapPin,
} from "lucide-react";

export default function LocationInput({
  label,
  value,
  setValue,
  setCoords,
}) {

  const [suggestions,
    setSuggestions] =
    useState([]);

  const searchLocations =
    async (query) => {

      if (
        !query ||
        query.length < 3
      ) {
        return;
      }

      try {

        const response =
          await axios.get(
            `https://nominatim.openstreetmap.org/search?format=json&q=${query}&limit=5`
          );

        setSuggestions(
          response.data
        );

      } catch (error) {

        console.log(error);
      }
    };

  const debouncedSearch =
    useMemo(
      () =>
        debounce(
          searchLocations,
          500
        ),
      []
    );

  return (
    <div className="mt-5 relative">

      <div className="border border-gray-200 rounded-2xl px-4 py-4 flex items-center gap-3 bg-white">

        <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center">

          <MapPin size={18} />
        </div>

        <div className="flex-1">

          <p className="text-xs text-gray-400 mb-1">
            {label}
          </p>

          <input
            type="text"
            value={value}
            onChange={(e) => {

              setValue(
                e.target.value
              );

              debouncedSearch(
                e.target.value
              );
            }}
            className="w-full outline-none"
          />
        </div>
      </div>

      {suggestions.length > 0 && (

        <div className="absolute top-full left-0 right-0 bg-white border rounded-2xl shadow-lg mt-2 z-[9999]">

          {suggestions.map(
            (
              place,
              index
            ) => (

              <button
                key={index}
                onClick={() => {

                  setValue(
                    place.display_name
                  );

                  setCoords([
                    parseFloat(
                      place.lat
                    ),

                    parseFloat(
                      place.lon
                    ),
                  ]);

                  setSuggestions([]);
                }}
                className="w-full text-left px-4 py-4 hover:bg-gray-100"
              >
                {
                  place.display_name
                }
              </button>
            )
          )}
        </div>
      )}
    </div>
  );
}