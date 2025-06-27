import { useState } from "react";

const CarsFilter = ({ onApplyFilters }) => {
  const [filters, setFilters] = useState({
    location: "",
    pickupDate: "",
    returnDate: "",
    priceRange: [50, 500],
    vehicleType: [],
    features: [],
    transmission: "",
    seats: 0,
    rating: 0,
    instantBook: false,
    verified: false,
  });

  const vehicleTypes = [
    { id: "sedan", label: "Sedan" },
    { id: "suv", label: "SUV" },
    { id: "convertible", label: "Convertible" },
    { id: "luxury", label: "Luxury" },
    { id: "electric", label: "Electric" },
    { id: "hybrid", label: "Hybrid" },
  ];

  const carFeatures = [
    { id: "bluetooth", label: "Bluetooth" },
    { id: "gps", label: "GPS" },
    { id: "leather", label: "Leather Seats" },
    { id: "sunroof", label: "Sunroof" },
    { id: "backup_camera", label: "Backup Camera" },
    { id: "cruise_control", label: "Cruise Control" },
    { id: "climate_control", label: "Climate Control" },
    { id: "apple_carplay", label: "Apple CarPlay" },
  ];

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleArrayFilterToggle = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: prev[key].includes(value)
        ? prev[key].filter((item) => item !== value)
        : [...prev[key], value],
    }));
  };

  const handlePriceRangeChange = (index, value) => {
    const newRange = [...filters.priceRange];
    newRange[index] = Number.parseInt(value);
    handleFilterChange("priceRange", newRange);
  };

  const resetFilters = () => {
    setFilters({
      location: "",
      pickupDate: "",
      returnDate: "",
      priceRange: [50, 500],
      vehicleType: [],
      features: [],
      transmission: "",
      seats: 0,
      rating: 0,
      instantBook: false,
      verified: false,
    });
  };

  const applyFilters = () => {
    onApplyFilters(filters);
  };

  return (
    <div className="bg-white border border-gray-200 p-8">
      {/* Header */}
      <div className="mb-8">
        <h3 className="text-xl font-serif text-gray-900 mb-2">
          Vehicle Filters
        </h3>
        <p className="text-sm text-gray-600">
          Find the perfect vehicle for your journey
        </p>
      </div>

      <div className="space-y-8">
        {/* Location & Dates */}
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Pickup Location
            </label>
            <input
              type="text"
              placeholder="Where do you need a car?"
              value={filters.location}
              onChange={(e) => handleFilterChange("location", e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 focus:border-emerald-600 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Pickup Date
              </label>
              <input
                type="date"
                value={filters.pickupDate}
                onChange={(e) => handleFilterChange("pickupDate", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 focus:border-emerald-600 focus:outline-none text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Return Date
              </label>
              <input
                type="date"
                value={filters.returnDate}
                onChange={(e) => handleFilterChange("returnDate", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 focus:border-emerald-600 focus:outline-none text-sm"
              />
            </div>
          </div>
        </div>

        {/* Separator */}
        <div className="h-px bg-gray-200"></div>

        {/* Price Range */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3 sm:mb-4">
            Price Range (per day)
          </label>
          <div className="space-y-3 sm:space-y-4">
            <div className="px-2">
              <input
                type="range"
                min="25"
                max="500"
                value={filters.priceRange[0]}
                onChange={(e) => handlePriceRangeChange(0, e.target.value)}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
              />
            </div>
            <div className="flex justify-between text-xs sm:text-sm text-gray-600 px-2">
              <span className="bg-gray-100 px-2 py-1 rounded">
                ${filters.priceRange[0]}
              </span>
              <span className="bg-gray-100 px-2 py-1 rounded">
                ${filters.priceRange[1]}+
              </span>
            </div>
          </div>
        </div>

        {/* Vehicle Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-4">
            Vehicle Type
          </label>
          <div className="grid grid-cols-2 gap-3">
            {vehicleTypes.map((type) => {
              const isSelected = filters.vehicleType.includes(type.id);
              return (
                <button
                  key={type.id}
                  onClick={() =>
                    handleArrayFilterToggle("vehicleType", type.id)
                  }
                  className={`p-3 border text-left transition-colors duration-200 ${
                    isSelected
                      ? "border-emerald-600 bg-emerald-50 text-emerald-800"
                      : "border-gray-300 hover:border-gray-400 text-gray-700"
                  }`}
                >
                  <span className="text-sm font-medium">{type.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Transmission */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Transmission
          </label>
          <div className="grid grid-cols-2 gap-3">
            {["automatic", "manual"].map((type) => (
              <button
                key={type}
                onClick={() => handleFilterChange("transmission", 
                  filters.transmission === type ? "" : type)}
                className={`p-2 border text-center transition-colors duration-200 ${
                  filters.transmission === type
                    ? "border-emerald-600 bg-emerald-50 text-emerald-800"
                    : "border-gray-300 hover:border-gray-400 text-gray-700"
                }`}
              >
                <span className="text-sm font-medium capitalize">{type}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Seats */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Minimum Seats
          </label>
          <div className="grid grid-cols-4 gap-2">
            {[0, 2, 4, 5, 7, 8, 9, 12].map((seatCount) => (
              <button
                key={seatCount}
                onClick={() => handleFilterChange("seats", seatCount)}
                className={`px-2 py-2 border text-sm font-medium transition-colors duration-200 ${
                  filters.seats === seatCount
                    ? "border-emerald-600 bg-emerald-50 text-emerald-800"
                    : "border-gray-300 hover:border-gray-400 text-gray-700"
                }`}
              >
                {seatCount === 0 ? "Any" : seatCount}
              </button>
            ))}
          </div>
        </div>

        {/* Features */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-4">
            Features
          </label>
          <div className="grid grid-cols-2 gap-2">
            {carFeatures.map((feature) => {
              const isSelected = filters.features.includes(feature.id);
              return (
                <button
                  key={feature.id}
                  onClick={() =>
                    handleArrayFilterToggle("features", feature.id)
                  }
                  className={`p-2 border text-left transition-colors duration-200 ${
                    isSelected
                      ? "border-emerald-600 bg-emerald-50 text-emerald-800"
                      : "border-gray-300 hover:border-gray-400 text-gray-700"
                  }`}
                >
                  <span className="text-xs font-medium">{feature.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Rating */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3 sm:mb-4">
            Minimum Rating
          </label>
          <div className="grid grid-cols-5 gap-2">
            {[0, 3, 4, 4.5, 5].map((rating) => (
              <button
                key={rating}
                onClick={() => handleFilterChange("rating", rating)}
                className={`px-2 sm:px-3 py-2 border text-xs sm:text-sm font-medium transition-colors duration-200 text-center ${
                  filters.rating === rating
                    ? "border-emerald-600 bg-emerald-50 text-emerald-800"
                    : "border-gray-300 hover:border-gray-400 text-gray-700"
                }`}
              >
                {rating === 0 ? "Any" : `${rating}+`}
              </button>
            ))}
          </div>
        </div>

        {/* Quick Options */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-4">
            Quick Options
          </label>
          <div className="space-y-3">
            {[
              { key: "instantBook", label: "Instant Book" },
              { key: "verified", label: "Verified Vehicles" },
            ].map((option) => (
              <label
                key={option.key}
                className="flex items-center space-x-3 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={filters[option.key]}
                  onChange={(e) =>
                    handleFilterChange(option.key, e.target.checked)
                  }
                  className="w-4 h-4 text-emerald-600 border-gray-300 focus:ring-emerald-500"
                />
                <span className="text-sm text-gray-700">{option.label}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-8 pt-6 border-t border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={resetFilters}
            className="text-gray-600 hover:text-gray-800 transition-colors duration-200 text-sm font-medium"
          >
            Reset All
          </button>
        </div>

        <button
          onClick={applyFilters}
          className="w-full bg-green-600 hover:bg-green-700 text-white py-3 font-medium transition-colors duration-200"
        >
          Apply Filters
        </button>
      </div>
    </div>
  );
};

export default CarsFilter;