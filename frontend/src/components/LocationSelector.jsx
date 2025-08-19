import React, { useState, useEffect } from "react";

const LocationSelector = ({ selectedLocation, setSelectedLocation, assets }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [manualInput, setManualInput] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [noResults, setNoResults] = useState(false);
  const [deliveryTime, setDeliveryTime] = useState(() => {
    return Number(sessionStorage.getItem("deliveryTime")) || 30;
  });

  // Debounce user input for manual location
  useEffect(() => {
    const delay = setTimeout(() => {
      if (manualInput.trim().length > 2) {
        fetchSuggestions(manualInput.trim());
      } else {
        setSuggestions([]);
        setNoResults(false);
      }
    }, 400);
    return () => clearTimeout(delay);
  }, [manualInput]);

  // Save delivery time to sessionStorage
  useEffect(() => {
    sessionStorage.setItem("deliveryTime", deliveryTime);
  }, [deliveryTime]);


  const fetchSuggestions = async (query) => {
    setSearchLoading(true);
    setNoResults(false);
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&countrycodes=in&q=${encodeURIComponent(query)}&limit=5`
      );
      const data = await res.json();
      setSuggestions(data);
      setNoResults(data.length === 0);
    } catch (err) {
      console.error("Error fetching suggestions:", err);
    } finally {
      setSearchLoading(false);
    }
  };

  const handleSuggestionClick = (place) => {
    setSelectedLocation(place.display_name);
    setManualInput(place.display_name);
    setSuggestions([]);
    setIsModalOpen(false);
    setDeliveryTime(generateRandomTime());
  };

  const detectLocation = () => {
    setLoading(true);
    setError("");

    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        const { latitude, longitude } = coords;
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&accept-language=en&zoom=18&addressdetails=1`
          );
          const data = await res.json();
          const locationName = data.display_name || "Your Location";
          setSelectedLocation(locationName);
          setManualInput(locationName);
          setIsModalOpen(false);
          setDeliveryTime(generateRandomTime());
        } catch (err) {
          console.error("Location detection error:", err);
          setError("Failed to detect location.");
        } finally {
          setLoading(false);
        }
      },
      () => {
        setError("Permission denied or unable to fetch location.");
        setLoading(false);
      }
    );
  };

  const handleManualSubmit = () => {
    if (manualInput.trim()) {
      setSelectedLocation(manualInput.trim());
      setIsModalOpen(false);
      setSuggestions([]);
      setDeliveryTime(generateRandomTime());
    }
  };

  const generateRandomTime = () => Math.floor(Math.random() * 16) + 15;

  return (
    <div className="relative text-left mt-1">
      <p className="text-base font-semibold text-black leading-5">
        Delivery in {deliveryTime} minutes
      </p>

      {/* Location Selector Button */}
      <button
        type="button"
        onClick={() => setIsModalOpen(true)}
        className="bg-white text-gray-500 active:scale-95 transition flex items-center gap-0.5 rounded w-max pt-1 text-xs"
      >
        <span
          title={selectedLocation}
          className="truncate max-w-[160px] text-gray-700 font-medium"
        >
          {selectedLocation}
        </span>
        <img src={assets.down_arrow} alt="down-arrow" className="w-3.5 pt-0.5 opacity-80" />
      </button>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/30 flex items-center justify-center">
          <div className="bg-white rounded-lg p-4 sm:p-6 w-[95%] max-w-xs sm:max-w-md shadow-xl relative">
            {/* Close */}
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-2 right-3 text-gray-500 hover:text-black text-lg"
            >
              <img src={assets.close_icon} alt="close-icon" className="pt-0.5 w-4 opacity-80 cursor-pointer" />
            </button>

            <h2 className="text-base sm:text-lg font-semibold mb-4 sm:mb-6">
              Select your location
            </h2>
            {error && <p className="text-red-500 mb-2">{error}</p>}

            {/* Detect and Search */}
            <div className="flex items-center gap-3 mb-4">
              <button
                onClick={detectLocation}
                className="bg-primary hover:bg-primary-dull text-white px-4 py-1.5 rounded text-sm min-w-[150px] whitespace-nowrap"
                disabled={loading}
              >
                {loading ? "Detecting..." : "Detect my location"}
              </button>

              <div className="text-gray-600 font-medium text-xs">OR</div>

              <div className="relative w-full">
                <input
                  type="text"
                  placeholder="Search my location"
                  value={manualInput}
                  onChange={(e) => setManualInput(e.target.value)}
                  className="w-full border border-gray-300 px-3 py-2 rounded text-sm outline-none focus:ring-1 focus:ring-gray-500"
                />

                {searchLoading && (
                  <div className="absolute top-full left-0 mt-1 text-xs text-gray-500 bg-white px-4 py-2 rounded shadow">
                    Loading suggestions...
                  </div>
                )}
                {noResults && !searchLoading && (
                  <div className="absolute top-full left-0 mt-1 text-xs text-red-500 bg-white px-4 py-2 rounded shadow">
                    Location not found!
                  </div>
                )}
                {suggestions.length > 0 && (
                  <ul className="absolute top-full mt-1 w-full bg-white border border-gray-300 rounded shadow-md z-50 max-h-52 overflow-auto">
                    {suggestions.map((place) => (
                      <li
                        key={place.place_id}
                        onClick={() => handleSuggestionClick(place)}
                        className="px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer"
                      >
                        {place.display_name}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            {/* Submit */}
            <div className="text-right">
              <button
                onClick={handleManualSubmit}
                className="bg-primary text-white px-5 py-2 rounded hover:bg-primary-dull text-sm"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LocationSelector;
