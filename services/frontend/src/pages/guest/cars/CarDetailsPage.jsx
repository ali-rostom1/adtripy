import { useEffect, useState } from "react"
import { useParams, useNavigate, Link } from "react-router-dom"
import { useCarsStore } from "../../../store/CarsStore"
import ClassicNavbar from "../../../components/guest/Nav"
import {
  ChevronLeft,
  MapPin,
  Star,
  Users,
  Car,
  Fuel,
  Gauge,
  Calendar,
  Sliders,
  Key,
  Edit3,
  Trash2,
  Heart,
  Share2,
  Check,
  X,
} from "lucide-react"

export default function CarDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { currentVehicle, fetchVehicleById, deleteVehicle, isLoading, error } = useCarsStore()
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [isFavorite, setIsFavorite] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)

  useEffect(() => {
    if (id) {
      fetchVehicleById(id)
    }
  }, [id])

  const handleDelete = async () => {
    try {
      await deleteVehicle(id)
      navigate("/cars")
    } catch (err) {
      console.error("Error deleting vehicle:", err)
      alert("Failed to delete vehicle. Please try again.")
    }
  }

  const getFeatureIcon = (featureName) => {
    const iconMap = {
      "Automatic": Sliders,
      "Manual": Gauge,
      "GPS": MapPin,
      "Bluetooth": Car,
      "Heated Seats": Users,
      "Cruise Control": Gauge,
      "Backup Camera": Car,
    }

    const IconComponent = iconMap[featureName] || Check
    return IconComponent
  }

  if (isLoading) {
    return (
      <>
        <ClassicNavbar />
        <div className="min-h-screen bg-white pt-20">
          <div className="flex justify-center items-center min-h-[60vh]">
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
              <p className="text-gray-600 text-lg">Loading vehicle details...</p>
            </div>
          </div>
        </div>
      </>
    )
  }

  if (error) {
    return (
      <>
        <ClassicNavbar />
        <div className="min-h-screen bg-white pt-20">
          <div className="flex justify-center items-center min-h-[60vh]">
            <div className="text-center max-w-md mx-auto px-4">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <X className="w-8 h-8 text-red-500" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Something went wrong</h2>
              <p className="text-gray-600 mb-8">{error}</p>
              <Link
                to="/cars"
                className="inline-block bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
              >
                Back to Vehicles
              </Link>
            </div>
          </div>
        </div>
      </>
    )
  }

  if (!currentVehicle) {
    return (
      <>
        <ClassicNavbar />
        <div className="min-h-screen bg-white pt-20">
          <div className="flex justify-center items-center min-h-[60vh]">
            <div className="text-center max-w-md mx-auto px-4">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Car className="w-8 h-8 text-gray-400" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Vehicle not found</h2>
              <p className="text-gray-600 mb-8">The vehicle you're looking for doesn't exist or has been removed.</p>
              <Link
                to="/cars"
                className="inline-block bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
              >
                Browse Vehicles
              </Link>
            </div>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <ClassicNavbar />
      <div className="min-h-screen bg-white pt-20">
        {/* Hero Section */}
        <div className="relative">
          {/* Back Navigation */}
          <div className="absolute top-6 left-6 z-10">
            <Link
              to="/cars"
              className="flex items-center bg-white/90 backdrop-blur-sm hover:bg-white text-gray-700 hover:text-green-600 px-4 py-2 rounded-lg font-medium transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 group"
            >
              <ChevronLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform duration-200" />
              Back to Vehicles
            </Link>
          </div>

          {/* Action Buttons */}
          <div className="absolute top-6 right-6 z-10 flex space-x-3">
            <button
              onClick={() => setIsFavorite(!isFavorite)}
              className={`p-3 rounded-lg backdrop-blur-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 ${
                isFavorite
                  ? "bg-red-500 text-white hover:bg-red-600"
                  : "bg-white/90 text-gray-700 hover:bg-white hover:text-red-500"
              }`}
            >
              <Heart className={`w-5 h-5 ${isFavorite ? "fill-current" : ""}`} />
            </button>
            <button className="p-3 bg-white/90 backdrop-blur-sm hover:bg-white text-gray-700 hover:text-green-600 rounded-lg transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5">
              <Share2 className="w-5 h-5" />
            </button>
          </div>

          {/* Image Gallery */}
          <div className="relative h-[60vh] overflow-hidden">
            {currentVehicle.media && currentVehicle.media.length > 0 ? (
              <>
                <img
                  src={currentVehicle.media[selectedImageIndex]?.url || "/placeholder.svg?height=600&width=1200"}
                  alt={currentVehicle.name}
                  className="w-full h-full object-cover transition-all duration-700 hover:scale-105"
                />
                {currentVehicle.media.length > 1 && (
                  <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2">
                    {currentVehicle.media.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedImageIndex(index)}
                        className={`w-3 h-3 rounded-full transition-all duration-300 ${
                          index === selectedImageIndex ? "bg-white scale-125" : "bg-white/60 hover:bg-white/80"
                        }`}
                      />
                    ))}
                  </div>
                )}
              </>
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gray-300 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Car className="w-8 h-8 text-gray-500" />
                  </div>
                  <span className="text-gray-500 text-lg">No images available</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Vehicle Header */}
              <div className="animate-in slide-in-from-bottom duration-500">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex-1">
                    <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4 leading-tight">
                      {currentVehicle.name}
                    </h1>
                    <div className="flex items-center space-x-4 text-gray-600">
                      <div className="flex items-center">
                        <Star className="w-5 h-5 text-yellow-400 fill-yellow-400 mr-1" />
                        <span className="font-medium">4.9</span>
                        <span className="ml-1">(42 reviews)</span>
                      </div>
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 mr-1" />
                        <span>{currentVehicle.location?.city || "Premium Location"}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-3 ml-6">
                    <Link
                      to={`/cars/edit/${currentVehicle.id}`}
                      className="flex items-center bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 group"
                    >
                      <Edit3 className="w-4 h-4 mr-2 group-hover:rotate-12 transition-transform duration-200" />
                      Edit
                    </Link>
                    <button
                      onClick={() => setShowDeleteModal(true)}
                      className="flex items-center bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 group"
                    >
                      <Trash2 className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform duration-200" />
                      Delete
                    </button>
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-6 bg-gray-50 rounded-lg">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                      <Calendar className="w-6 h-6 text-green-600" />
                    </div>
                    <div className="text-2xl font-bold text-gray-900">{currentVehicle.year || 2023}</div>
                    <div className="text-sm text-gray-600">Year</div>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                      <Users className="w-6 h-6 text-green-600" />
                    </div>
                    <div className="text-2xl font-bold text-gray-900">{currentVehicle.seats || 5}</div>
                    <div className="text-sm text-gray-600">Seats</div>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                      <Sliders className="w-6 h-6 text-green-600" />
                    </div>
                    <div className="text-2xl font-bold text-gray-900 capitalize">
                      {currentVehicle.transmission || "Auto"}
                    </div>
                    <div className="text-sm text-gray-600">Transmission</div>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                      <Fuel className="w-6 h-6 text-green-600" />
                    </div>
                    <div className="text-2xl font-bold text-gray-900 capitalize">
                      {currentVehicle.fuel_type || "Petrol"}
                    </div>
                    <div className="text-sm text-gray-600">Fuel Type</div>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="animate-in slide-in-from-bottom duration-700 delay-200">
                <div className="bg-white border border-gray-200 rounded-lg p-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">About this vehicle</h2>
                  <p className="text-gray-700 leading-relaxed text-lg whitespace-pre-line">
                    {currentVehicle.description ||
                      "An exceptional vehicle featuring refined amenities and impeccable performance, offering drivers an unparalleled experience of comfort and luxury. This stunning automobile combines modern sophistication with timeless elegance, creating the perfect vehicle for discerning travelers."}
                  </p>
                </div>
              </div>

              {/* Features */}
              {currentVehicle.features && currentVehicle.features.length > 0 && (
                <div className="animate-in slide-in-from-bottom duration-700 delay-300">
                  <div className="bg-white border border-gray-200 rounded-lg p-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Features</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {currentVehicle.features.map((feature, index) => {
                        const IconComponent = getFeatureIcon(feature.name)
                        return (
                          <div
                            key={feature.id || index}
                            className="flex items-center p-4 bg-gray-50 rounded-lg hover:bg-green-50 hover:border-green-200 border border-transparent transition-all duration-300 group"
                            style={{ animationDelay: `${index * 100}ms` }}
                          >
                            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-4 group-hover:bg-green-200 transition-colors duration-300">
                              <IconComponent className="w-5 h-5 text-green-600" />
                            </div>
                            <span className="font-medium text-gray-900 group-hover:text-green-700 transition-colors duration-300">
                              {feature.name}
                            </span>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Right Column - Booking Card */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 animate-in slide-in-from-right duration-700 delay-100">
                <div className="bg-white border border-gray-200 rounded-lg p-8 shadow-lg">
                  <div className="text-center mb-8">
                    <div className="text-4xl font-bold text-green-600 mb-2">
                      ${currentVehicle.price || 75}
                      <span className="text-lg font-normal text-gray-600 ml-2">/ day</span>
                    </div>
                    <div className="flex items-center justify-center text-sm text-gray-600">
                      <Star className="w-4 h-4 text-yellow-400 fill-yellow-400 mr-1" />
                      <span className="font-medium">4.9</span>
                      <span className="mx-1">•</span>
                      <span>42 reviews</span>
                    </div>
                  </div>

                  {/* Booking Form */}
                  <div className="space-y-4 mb-6">
                    <div className="grid grid-cols-2 gap-2">
                      <div className="border border-gray-300 rounded-lg p-3 hover:border-green-500 transition-colors duration-200">
                        <label className="block text-xs font-medium text-gray-600 mb-1">PICK-UP</label>
                        <input
                          type="date"
                          className="w-full text-sm font-medium text-gray-900 bg-transparent border-none outline-none"
                        />
                      </div>
                      <div className="border border-gray-300 rounded-lg p-3 hover:border-green-500 transition-colors duration-200">
                        <label className="block text-xs font-medium text-gray-600 mb-1">DROP-OFF</label>
                        <input
                          type="date"
                          className="w-full text-sm font-medium text-gray-900 bg-transparent border-none outline-none"
                        />
                      </div>
                    </div>
                    <div className="border border-gray-300 rounded-lg p-3 hover:border-green-500 transition-colors duration-200">
                      <label className="block text-xs font-medium text-gray-600 mb-1">DRIVER AGE</label>
                      <select className="w-full text-sm font-medium text-gray-900 bg-transparent border-none outline-none">
                        <option>25+ years</option>
                        <option>21-24 years</option>
                        <option>18-20 years</option>
                      </select>
                    </div>
                  </div>

                  <button className="w-full bg-green-600 hover:bg-green-700 text-white py-4 rounded-lg font-semibold text-lg transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 mb-4">
                    Reserve Now
                  </button>

                  <p className="text-center text-sm text-gray-600 mb-6">You won't be charged yet</p>

                  {/* Vehicle Details */}
                  <div className="space-y-4 pt-6 border-t border-gray-200">
                    <h3 className="font-semibold text-gray-900 mb-4">Vehicle Details</h3>

                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Category</span>
                      <span className="font-medium text-gray-900">{currentVehicle.category?.name || "Luxury Vehicle"}</span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Location</span>
                      <span className="font-medium text-gray-900">
                        {currentVehicle.location ? `${currentVehicle.location.city}, ${currentVehicle.location.country}` : "Premium Location"}
                      </span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Vehicle ID</span>
                      <span className="font-medium text-gray-900">#{currentVehicle.id}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Delete Confirmation Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div
              className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
              onClick={() => setShowDeleteModal(false)}
            />
            <div className="relative bg-white rounded-lg p-8 max-w-md mx-4 animate-in zoom-in duration-300">
              <div className="text-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Trash2 className="w-8 h-8 text-red-500" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Delete Vehicle</h3>
                <p className="text-gray-600 mb-8">
                  Are you sure you want to delete "{currentVehicle.name}"? This action cannot be undone.
                </p>
                <div className="flex space-x-4">
                  <button
                    onClick={() => setShowDeleteModal(false)}
                    className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 rounded-lg font-medium transition-all duration-300"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDelete}
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg font-medium transition-all duration-300 hover:shadow-lg"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  )
}