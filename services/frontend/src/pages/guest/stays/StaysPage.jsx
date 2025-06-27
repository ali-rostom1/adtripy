"use client";

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import ClassicNavbar from "../../../components/guest/Nav"; // Added extra "../"
import ClassicFilter from "../../../components/filter/staysFilter"; // Changed path to match actual file location
import {
  MapPin,
  Star,
  Heart,
  Grid3X3,
  List,
  SlidersHorizontal,
  X,
} from "lucide-react";

export default function ClassicStaysPage() {
  const [stays, setStays] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showFilters, setShowFilters] = useState(false); // Start with filters hidden on mobile
  const [viewMode, setViewMode] = useState("list"); // Default view mode
  const [favorites, setFavorites] = useState(new Set());
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
  });

  useEffect(() => {
    fetchStays();
  }, []);

  // Show filters on desktop by default
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setShowFilters(true);
      } else {
        setShowFilters(false);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const fetchStays = async (page = 1, filters = {}) => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_STAYS_API_URL}/api/stays`,
        {
          params: { page, ...filters },
        }
      );

      if (response.data.data) {
        setStays(response.data.data);
      } else if (Array.isArray(response.data)) {
        setStays(response.data);
      } else {
        setStays([response.data]);
      }

      if (response.data.current_page) {
        setPagination({
          currentPage: response.data.current_page,
          totalPages: response.data.last_page,
          totalItems: response.data.total,
        });
      }

      setLoading(false);
    } catch (err) {
      setError(
        `Failed to load stays: ${
          err.response?.data?.message || err.message || "Unknown error"
        }`
      );
      setLoading(false);
    }
  };

  const handlePageChange = (page) => {
    fetchStays(page);
  };

  const handleFilterApply = (filters) => {
    fetchStays(1, filters);
    // Close filters on mobile after applying
    if (window.innerWidth < 1024) {
      setShowFilters(false);
    }
  };

  const toggleFavorite = (stayId) => {
    setFavorites((prev) => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(stayId)) {
        newFavorites.delete(stayId);
      } else {
        newFavorites.add(stayId);
      }
      return newFavorites;
    });
  };

  if (loading && stays.length === 0) {
    return (
      <>
        <ClassicNavbar />
        <div className="min-h-screen bg-white">
          <div className="flex justify-center items-center min-h-screen px-4">
            <div className="text-center">
              <div className="w-8 h-8 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
              <p className="text-gray-600 text-base sm:text-lg">
                Loading properties...
              </p>
            </div>
          </div>
        </div>
      </>
    );
  }

  if (error && stays.length === 0) {
    return (
      <>
        <ClassicNavbar />
        <div className="min-h-screen bg-white">
          <div className="flex justify-center items-center min-h-screen px-4">
            <div className="text-center max-w-md mx-auto">
              <h2 className="text-xl sm:text-2xl font-serif text-gray-900 mb-3">
                Something went wrong
              </h2>
              <p className="text-gray-600 mb-6 text-sm sm:text-base">{error}</p>
              <button
                onClick={() => fetchStays()}
                className="bg-green-600 hover:bg-green-700 text-white px-6 sm:px-8 py-3 font-medium transition-colors duration-200 text-sm sm:text-base"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <ClassicNavbar />
      <div className="min-h-screen bg-white pt-16 sm:pt-20">
        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 lg:py-12">
          <div className="flex flex-col lg:flex-row gap-6 lg:gap-12">
            {/* Mobile Filter Overlay */}
            {showFilters && (
              <div className="fixed inset-0 z-50 lg:hidden">
                <div
                  className="fixed inset-0 bg-black bg-opacity-50"
                  onClick={() => setShowFilters(false)}
                />
                <div className="fixed inset-y-0 left-0 w-full max-w-sm bg-white shadow-xl overflow-y-auto">
                  <div className="flex items-center justify-between p-4 border-b border-gray-200">
                    <h3 className="text-lg font-serif text-gray-900">
                      Filters
                    </h3>
                    <button
                      onClick={() => setShowFilters(false)}
                      className="p-2 text-gray-500 hover:text-gray-700"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="p-4">
                    <ClassicFilter onApplyFilters={handleFilterApply} />
                  </div>
                </div>
              </div>
            )}

            {/* Desktop Filter Sidebar */}
            {showFilters && (
              <aside className="hidden lg:block w-80 flex-shrink-0">
                <div className="sticky top-32">
                  <ClassicFilter onApplyFilters={handleFilterApply} />
                </div>
              </aside>
            )}

            {/* Main Content Area */}
            <main className="flex-1 min-w-0">
              {/* Controls Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 sm:mb-8 lg:mb-12 pb-4 sm:pb-6 border-b border-gray-200 gap-4 sm:gap-0">
                <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-8">
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className={`flex items-center justify-center sm:justify-start px-4 py-2 font-medium transition-colors duration-200 ${
                      showFilters
                        ? "text-emerald-600"
                        : "text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    <SlidersHorizontal className="w-4 h-4 mr-2" />
                    Filters
                  </button>

                  <div className="hidden sm:block h-6 w-px bg-gray-300"></div>

                  <div className="text-gray-600 text-center sm:text-left">
                    <span className="font-medium text-gray-900">
                      {pagination.totalItems}
                    </span>{" "}
                    properties
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-6">
                  <div className="flex items-center border border-gray-300">
                    <button
                      onClick={() => setViewMode("grid")}
                      className={`flex-1 sm:flex-none p-2 sm:p-3 transition-colors duration-200 ${
                        viewMode === "grid"
                          ? "bg-green-600 text-white"
                          : "text-gray-600 hover:text-gray-900"
                      }`}
                    >
                      <Grid3X3 className="w-4 h-4 mx-auto" />
                    </button>
                    <button
                      onClick={() => setViewMode("list")}
                      className={`flex-1 sm:flex-none p-2 sm:p-3 transition-colors duration-200 ${
                        viewMode === "list"
                          ? "bg-green-600 text-white"
                          : "text-gray-600 hover:text-gray-900"
                      }`}
                    >
                      <List className="w-4 h-4 mx-auto" />
                    </button>
                  </div>

                  <Link
                    to="/stays/create"
                    className="bg-green-600 hover:bg-green-600 text-white uppercase font-light px-6 py-3 rounded shadow-md tracking-wide transition duration-300 ease-in-out"
                  >
                    List Your Property 
                  </Link>

            
                </div>
              </div>

              {stays.length === 0 ? (
                <div className="text-center py-16 sm:py-24 px-4">
                  <h3 className="text-xl sm:text-2xl font-serif text-gray-900 mb-4">
                    No properties found
                  </h3>
                  <p className="text-gray-600 mb-6 sm:mb-8 max-w-md mx-auto text-sm sm:text-base">
                    Adjust your search criteria or be the first to list a
                    property in this area.
                  </p>
                  <Link
                    to="/stays/create"
                    className="inline-block bg-green-600 hover:bg-green-700 text-white px-6 sm:px-8 py-3 font-medium transition-colors duration-200 text-sm sm:text-base"
                  >
                    List Your Property
                  </Link>
                </div>
              ) : (
                <>
                  {/* Stays Grid */}
                  <div
                    className={`grid gap-6 sm:gap-8 mb-12 sm:mb-16 ${
                      viewMode === "grid"
                        ? "grid-cols-1 sm:grid-cols-2 xl:grid-cols-3"
                        : "grid-cols-1"
                    }`}
                  >
                    {stays.map((stay) => (
                      <article
                        key={stay.id}
                        className={`group bg-white border border-gray-200 hover:border-gray-300 transition-all duration-300 ${
                          viewMode === "list" ? "sm:flex" : ""
                        }`}
                      >
                        {/* Image Container */}
                        <div
                          className={`relative overflow-hidden ${
                            viewMode === "list"
                              ? "sm:w-80 sm:flex-shrink-0 aspect-square sm:aspect-auto"
                              : "aspect-square"
                          }`}
                        >
                          {stay.media && stay.media.length > 0 ? (
                            <img
                              src={
                                stay.media[0].url ||
                                "/placeholder.svg?height=300&width=400"
                              }
                              alt={stay.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                          ) : (
                            <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                              <span className="text-gray-400 text-sm sm:text-base">
                                No image available
                              </span>
                            </div>
                          )}

                          <div className="absolute top-3 sm:top-4 right-3 sm:right-4">
                            <button
                              onClick={() => toggleFavorite(stay.id)}
                              className="w-8 h-8 sm:w-10 sm:h-10 bg-white hover:bg-gray-50 border border-gray-200 flex items-center justify-center transition-colors duration-200"
                            >
                              <Heart
                                className={`w-3 h-3 sm:w-4 sm:h-4 transition-colors duration-200 ${
                                  favorites.has(stay.id)
                                    ? "text-red-500 fill-red-500"
                                    : "text-gray-600"
                                }`}
                              />
                            </button>
                          </div>

                          <div className="absolute bottom-3 sm:bottom-4 left-3 sm:left-4">
                            <div className="bg-green-600 text-white px-3 sm:px-4 py-1 sm:py-2 font-medium text-sm sm:text-base">
                              ${stay.price_per_night}/night
                            </div>
                          </div>
                        </div>

                        {/* Content */}
                        <div className="p-4 sm:p-6 lg:p-8 flex-1">
                          <div className="flex items-start justify-between mb-3 sm:mb-4">
                            <div className="flex-1 min-w-0">
                              <h3 className="text-lg sm:text-xl font-serif text-gray-900 mb-1 sm:mb-2 group-hover:text-emerald-600 transition-colors duration-300 line-clamp-2">
                                {stay.title}
                              </h3>
                              <div className="flex items-center text-gray-500 text-xs sm:text-sm">
                                <MapPin className="w-3 h-3 sm:w-4 sm:h-4 mr-1 flex-shrink-0" />
                                <span className="truncate">
                                  Premium Location
                                </span>
                              </div>
                            </div>
                            <div className="flex items-center gap-1 ml-3 sm:ml-4 flex-shrink-0">
                              <Star className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-400 fill-yellow-400" />
                              <span className="text-xs sm:text-sm font-medium text-gray-700">
                                4.9
                              </span>
                            </div>
                          </div>

                          <div className="h-px bg-gray-200 my-4 sm:my-6"></div>

                          <p className="text-gray-600 leading-relaxed mb-6 sm:mb-8 line-clamp-3 text-sm sm:text-base">
                            {stay.description ||
                              "An exceptional property featuring refined amenities and impeccable attention to detail, offering guests an unparalleled experience of comfort and luxury."}
                          </p>

                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-0">
                            <div className="flex items-center gap-2 sm:gap-4">
                              <span className="text-xs bg-green-100 text-green-800 px-2 sm:px-3 py-1 font-medium">
                                Available
                              </span>
                              <span className="text-xs bg-gray-100 text-gray-800 px-2 sm:px-3 py-1 font-medium">
                                Verified
                              </span>
                            </div>
                            <Link
                              to={`/stays/${stay.id}`}
                              className="text-emerald-600 hover:text-emerald-700 font-medium transition-colors duration-200 text-xs sm:text-xs text-center sm:text-right"
                            >
                              Details
                            </Link>
                          </div>
                        </div>
                      </article>
                    ))}
                  </div>

                  {/* Pagination */}
                  {pagination.totalPages > 1 && (
                    <div className="flex justify-center pt-8 sm:pt-12 border-t border-gray-200">
                      <nav className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4">
                        <button
                          onClick={() =>
                            handlePageChange(pagination.currentPage - 1)
                          }
                          disabled={pagination.currentPage === 1}
                          className="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3 text-gray-600 border border-gray-300 hover:border-gray-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 text-sm sm:text-base"
                        >
                          Previous
                        </button>

                        <div className="flex space-x-1 sm:space-x-2">
                          {Array.from(
                            { length: Math.min(5, pagination.totalPages) },
                            (_, i) => {
                              const page = i + 1;
                              return (
                                <button
                                  key={page}
                                  onClick={() => handlePageChange(page)}
                                  className={`w-10 h-10 sm:w-12 sm:h-12 font-medium transition-colors duration-200 text-sm sm:text-base ${
                                    pagination.currentPage === page
                                      ? "bg-green-600 text-white"
                                      : "text-gray-600 border border-gray-300 hover:border-gray-400"
                                  }`}
                                >
                                  {page}
                                </button>
                              );
                            }
                          )}
                        </div>

                        <button
                          onClick={() =>
                            handlePageChange(pagination.currentPage + 1)
                          }
                          disabled={
                            pagination.currentPage === pagination.totalPages
                          }
                          className="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3 text-gray-600 border border-gray-300 hover:border-gray-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 text-sm sm:text-base"
                        >
                          Next
                        </button>
                      </nav>
                    </div>
                  )}
                </>
              )}
            </main>
          </div>
        </div>
      </div>
    </>
  );
}
