import { useState } from "react";

const ClassicFilter = ({ onApplyFilters }) => {
  const [filters, setFilters] = useState({
    location: "",
    checkIn: "",
    checkOut: "",
    guests: 1,
    priceRange: [100, 1000],
    propertyType: [],
    amenities: [],
    rating: 0,
    instantBook: false,
    verified: false,
  });

  const propertyTypes = [
    { id: "hotel", label: "Hotel" },
    { id: "apartment", label: "Apartment" },
    { id: "villa", label: "Villa" },
    { id: "resort", label: "Resort" },
    { id: "cabin", label: "Cabin" },
    { id: "boutique", label: "Boutique" },
  ];

  const amenities = [
    { id: "wifi", label: "WiFi" },
    { id: "parking", label: "Parking" },
    { id: "breakfast", label: "Breakfast" },
    { id: "pool", label: "Pool" },
    { id: "gym", label: "Gym" },
    { id: "spa", label: "Spa" },
    { id: "restaurant", label: "Restaurant" },
    { id: "ac", label: "Air Conditioning" },
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
      checkIn: "",
      checkOut: "",
      guests: 1,
      priceRange: [100, 1000],
      propertyType: [],
      amenities: [],
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
          Search Filters
        </h3>
        <p className="text-sm text-gray-600">
          Refine your search to find the perfect stay
        </p>
      </div>

      <div className="space-y-8">
        {/* Location & Dates */}
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Destination
            </label>
            <input
              type="text"
              placeholder="Where are you going?"
              value={filters.location}
              onChange={(e) => handleFilterChange("location", e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 focus:border-emerald-600 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Check-in
              </label>
              <input
                type="date"
                value={filters.checkIn}
                onChange={(e) => handleFilterChange("checkIn", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 focus:border-emerald-600 focus:outline-none text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Check-out
              </label>
              <input
                type="date"
                value={filters.checkOut}
                onChange={(e) => handleFilterChange("checkOut", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 focus:border-emerald-600 focus:outline-none text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Guests
            </label>
            <select
              value={filters.guests}
              onChange={(e) =>
                handleFilterChange("guests", Number.parseInt(e.target.value))
              }
              className="w-full px-3 py-2 border border-gray-300 focus:border-emerald-600 focus:outline-none"
            >
              {[1, 2, 3, 4, 5, 6, 8, 10].map((num) => (
                <option key={num} value={num}>
                  {num} Guest{num > 1 ? "s" : ""}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Separator */}
        <div className="h-px bg-gray-200"></div>

        {/* Price Range */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3 sm:mb-4">
            Price Range (per night)
          </label>
          <div className="space-y-3 sm:space-y-4">
            <div className="px-2">
              <input
                type="range"
                min="50"
                max="1000"
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

        {/* Property Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-4">
            Property Type
          </label>
          <div className="grid grid-cols-2 gap-3">
            {propertyTypes.map((type) => {
              const isSelected = filters.propertyType.includes(type.id);
              return (
                <button
                  key={type.id}
                  onClick={() =>
                    handleArrayFilterToggle("propertyType", type.id)
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

        {/* Amenities */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-4">
            Amenities
          </label>
          <div className="grid grid-cols-2 gap-2">
            {amenities.map((amenity) => {
              const isSelected = filters.amenities.includes(amenity.id);
              return (
                <button
                  key={amenity.id}
                  onClick={() =>
                    handleArrayFilterToggle("amenities", amenity.id)
                  }
                  className={`p-2 border text-left transition-colors duration-200 ${
                    isSelected
                      ? "border-emerald-600 bg-emerald-50 text-emerald-800"
                      : "border-gray-300 hover:border-gray-400 text-gray-700"
                  }`}
                >
                  <span className="text-xs font-medium">{amenity.label}</span>
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
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
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
              { key: "verified", label: "Verified Properties" },
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

export default ClassicFilter;
