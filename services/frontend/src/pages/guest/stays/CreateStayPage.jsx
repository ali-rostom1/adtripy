"use client"

import { useState, useEffect } from "react"
import { useNavigate, Link } from "react-router-dom"
import { createStay } from "../../../api/stays"
import ClassicNavbar from "../../../components/guest/Nav"
import {
  ChevronLeft,
  ChevronRight,
  Check,
  Home,
  MapPin,
  Star,
  ImageIcon,
  CreditCard,
  Upload,
  X,
  Building,
  Castle,
  Crown,
  Waves,
  Gem,
  Wifi,
  Car,
  Dumbbell,
  Wind,
  Utensils,
  Shield,
  Bell,
  Plane,
  Wine,
  Anchor,
} from "lucide-react"

export default function CreateStayPage() {
  const navigate = useNavigate()
  const [currentStep, setCurrentStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [categories, setCategories] = useState([])
  const [amenities, setAmenities] = useState([])
  const [isAnimating, setIsAnimating] = useState(false)

  const totalSteps = 5

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price_per_night: "",
    max_guests: "",
    bedrooms: "",
    bathrooms: "",
    category_id: "1",
    host_id: "1",
    location_id: "1",
    address: "",
    city: "",
    state: "",
    country: "",
    postal_code: "",
    latitude: "",
    longitude: "",
    amenities: [],
    mediaFiles: [], // For storing the actual file objects
    media: [], // For storing URLs or references after upload
  })

  // Mock data - replace with actual API calls
  useEffect(() => {
    setCategories([
      { id: 1, name: "Luxury Hotel", description: "High-end hotel accommodations", icon: Building },
      { id: 2, name: "Private Villa", description: "Exclusive villa properties", icon: Home },
      { id: 3, name: "Penthouse", description: "Premium penthouse suites", icon: Crown },
      { id: 4, name: "Resort", description: "Resort and spa properties", icon: Waves },
      { id: 5, name: "Boutique", description: "Unique boutique accommodations", icon: Gem },
      { id: 6, name: "Historic Estate", description: "Heritage and historic properties", icon: Castle },
    ])

    setAmenities([
      { id: 1, name: "High-Speed WiFi", category: "connectivity", icon: Wifi },
      { id: 2, name: "Air Conditioning", category: "comfort", icon: Wind },
      { id: 3, name: "Gourmet Kitchen", category: "dining", icon: Utensils },
      { id: 4, name: "Infinity Pool", category: "recreation", icon: Waves },
      { id: 5, name: "Private Spa", category: "wellness", icon: Wind },
      { id: 6, name: "Fitness Center", category: "wellness", icon: Dumbbell },
      { id: 7, name: "Concierge Service", category: "service", icon: Bell },
      { id: 8, name: "Valet Parking", category: "transport", icon: Car },
      { id: 9, name: "Wine Cellar", category: "dining", icon: Wine },
      { id: 10, name: "Private Beach", category: "recreation", icon: Anchor },
      { id: 11, name: "Helipad", category: "transport", icon: Plane },
      { id: 12, name: "Butler Service", category: "service", icon: Shield },
    ])
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleAmenityChange = (amenityId) => {
    const isSelected = formData.amenities.includes(amenityId)
    if (isSelected) {
      setFormData({
        ...formData,
        amenities: formData.amenities.filter((id) => id !== amenityId),
      })
    } else {
      setFormData({
        ...formData,
        amenities: [...formData.amenities, amenityId],
      })
    }
  }

  const handleFileChange = (e) => {
    const files = e.target.files
    if (files && files.length > 0) {
      setFormData((prev) => ({
        ...prev,
        mediaFiles: [...prev.mediaFiles, ...files],
      }))
    }
  }

  const removeFile = (indexToRemove) => {
    setFormData((prev) => ({
      ...prev,
      mediaFiles: prev.mediaFiles.filter((_, index) => index !== indexToRemove),
    }))
  }

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setIsAnimating(true)
      setTimeout(() => {
        setCurrentStep(currentStep + 1)
        setIsAnimating(false)
      }, 150)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setIsAnimating(true)
      setTimeout(() => {
        setCurrentStep(currentStep - 1)
        setIsAnimating(false)
      }, 150)
    }
  }

  // Modify your handleSubmit function to explicitly set host_id and location_id
  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      // Create a FormData object to handle file uploads
      const formDataToSubmit = new FormData()

      // Add regular form fields
      formDataToSubmit.append("title", formData.title)
      formDataToSubmit.append("description", formData.description)
      formDataToSubmit.append("price_per_night", formData.price_per_night || 0)
      formDataToSubmit.append("max_guests", formData.max_guests || 1)
      formDataToSubmit.append("bedrooms", formData.bedrooms || 1)
      formDataToSubmit.append("bathrooms", formData.bathrooms || 1)
      formDataToSubmit.append("category_id", 1)
      
      // Use host_id=2 since 1 isn't working
      formDataToSubmit.append("host_id",  "2") // Use a fixed host_id of 2
      formDataToSubmit.append("location_id", "1")

      // Location fields - these are still needed for creating the location
      formDataToSubmit.append("address", formData.address || "")
      formDataToSubmit.append("city", formData.city || "")
      formDataToSubmit.append("state", formData.state || "")
      formDataToSubmit.append("country", formData.country || "")
      formDataToSubmit.append("postal_code", formData.postal_code || "")
      formDataToSubmit.append("latitude", formData.latitude || "")
      formDataToSubmit.append("longitude", formData.longitude || "")

      // Add a single valid amenity
      formDataToSubmit.append("amenities[0]", "1") // Add this line

      // Add media files
      if (formData.mediaFiles && formData.mediaFiles.length > 0) {
        Array.from(formData.mediaFiles).forEach((file, index) => {
          formDataToSubmit.append(`media[${index}]`, file)
        })
      }

      console.log("Submitting stay data with fixed IDs")

      // Use the updated API call that handles default host_id and amenities
      const response = await createStay(formDataToSubmit)
      console.log("Stay created:", response.data)
      navigate(`/stays/${response.data.id}`)
    } catch (err) {
      console.error("Error creating stay:", err)

      if (err.response?.data?.errors) {
        const errorMessages = Object.entries(err.response.data.errors)
          .map(([field, messages]) => `${field}: ${messages.join(", ")}`)
          .join("\n")
        setError(errorMessages)
      } else {
        setError(err.response?.data?.message || err.message || "Failed to create stay.")
      }
    } finally {
      setLoading(false)
    }
  }

  const steps = [
    { number: 1, title: "Type", icon: Home },
    { number: 2, title: "Details", icon: Star },
    { number: 3, title: "Location", icon: MapPin },
    { number: 4, title: "Amenities", icon: CreditCard },
    { number: 5, title: "Review", icon: ImageIcon },
  ]

  const getStepIcon = (step, index) => {
    const Icon = step.icon
    if (index + 1 < currentStep) {
      return <Check className="w-3 h-3 text-white" />
    }
    return <Icon className="w-3 h-3" />
  }

  const renderStepContent = () => {
    const contentClass = `transition-all duration-300 ${isAnimating ? "opacity-0 translate-y-4" : "opacity-100 translate-y-0"}`

    switch (currentStep) {
      case 1:
        return (
          <div className={`space-y-8 ${contentClass}`}>
            <div className="text-center mb-8">
              <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                Select the category that best describes your luxury accommodation
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {categories.map((category, index) => {
                const IconComponent = category.icon
                return (
                  <button
                    key={category.id}
                    type="button"
                    onClick={() => setFormData({ ...formData, category_id: category.id.toString() })}
                    className={`group relative p-6 border-2 rounded-lg text-left transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${
                      formData.category_id === category.id.toString()
                        ? "border-green-500 bg-green-50 shadow-md"
                        : "border-gray-200 hover:border-green-300 bg-white"
                    }`}
                  >
                    <div className="flex flex-col items-center text-center space-y-3">
                      <div
                        className={`w-12 h-12 flex items-center justify-center rounded-lg transition-all duration-300 ${
                          formData.category_id === category.id.toString()
                            ? "bg-green-500 text-white"
                            : "bg-gray-100 text-gray-600 group-hover:bg-green-100 group-hover:text-green-600"
                        }`}
                      >
                        <IconComponent className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">{category.name}</h3>
                        <p className="text-sm text-gray-600">{category.description}</p>
                      </div>
                    </div>
                    {formData.category_id === category.id.toString() && (
                      <div className="absolute top-3 right-3 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                        <Check className="w-3 h-3 text-white" />
                      </div>
                    )}
                  </button>
                )
              })}
            </div>
          </div>
        )

      case 2:
        return (
          <div className={`space-y-8 ${contentClass}`}>
            <div className="text-center mb-8">
              <p className="text-gray-600 text-lg max-w-2xl mx-auto">Tell us about your exceptional property</p>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Property Title</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="e.g., Luxury Penthouse with Ocean Views"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-green-500 focus:ring-2 focus:ring-green-200 focus:outline-none text-lg transition-all duration-200"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Describe the unique features and luxury amenities of your property..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-green-500 focus:ring-2 focus:ring-green-200 focus:outline-none resize-none transition-all duration-200"
                  rows="4"
                  required
                />
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Price per Night</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                    <input
                      type="number"
                      name="price_per_night"
                      value={formData.price_per_night}
                      onChange={handleChange}
                      min="0"
                      step="0.01"
                      className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:border-green-500 focus:ring-2 focus:ring-green-200 focus:outline-none transition-all duration-200"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Max Guests</label>
                  <input
                    type="number"
                    name="max_guests"
                    value={formData.max_guests}
                    onChange={handleChange}
                    min="1"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-green-500 focus:ring-2 focus:ring-green-200 focus:outline-none transition-all duration-200"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Bedrooms</label>
                  <input
                    type="number"
                    name="bedrooms"
                    value={formData.bedrooms}
                    onChange={handleChange}
                    min="0"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-green-500 focus:ring-2 focus:ring-green-200 focus:outline-none transition-all duration-200"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Bathrooms</label>
                  <input
                    type="number"
                    name="bathrooms"
                    value={formData.bathrooms}
                    onChange={handleChange}
                    min="0"
                    step="0.5"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-green-500 focus:ring-2 focus:ring-green-200 focus:outline-none transition-all duration-200"
                    required
                  />
                </div>
              </div>
            </div>
          </div>
        )

      case 3:
        return (
          <div className={`space-y-8 ${contentClass}`}>
            <div className="text-center mb-8">
              <p className="text-gray-600 text-lg max-w-2xl mx-auto">Where is your luxury property located?</p>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Street Address</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="123 Luxury Avenue"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-green-500 focus:ring-2 focus:ring-green-200 focus:outline-none transition-all duration-200"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="Miami"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-green-500 focus:ring-2 focus:ring-green-200 focus:outline-none transition-all duration-200"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">State/Province</label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    placeholder="Florida"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-green-500 focus:ring-2 focus:ring-green-200 focus:outline-none transition-all duration-200"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Country</label>
                  <input
                    type="text"
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    placeholder="United States"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-green-500 focus:ring-2 focus:ring-green-200 focus:outline-none transition-all duration-200"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Postal Code</label>
                  <input
                    type="text"
                    name="postal_code"
                    value={formData.postal_code}
                    onChange={handleChange}
                    placeholder="33139"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-green-500 focus:ring-2 focus:ring-green-200 focus:outline-none transition-all duration-200"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Latitude <span className="text-gray-500">(optional)</span>
                  </label>
                  <input
                    type="text"
                    name="latitude"
                    value={formData.latitude}
                    onChange={handleChange}
                    placeholder="25.7617"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-green-500 focus:ring-2 focus:ring-green-200 focus:outline-none transition-all duration-200"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Longitude <span className="text-gray-500">(optional)</span>
                  </label>
                  <input
                    type="text"
                    name="longitude"
                    value={formData.longitude}
                    onChange={handleChange}
                    placeholder="-80.1918"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-green-500 focus:ring-2 focus:ring-green-200 focus:outline-none transition-all duration-200"
                  />
                </div>
              </div>
            </div>
          </div>
        )

      case 4:
        const amenityCategories = amenities.reduce((acc, amenity) => {
          if (!acc[amenity.category]) {
            acc[amenity.category] = []
          }
          acc[amenity.category].push(amenity)
          return acc
        }, {})

        return (
          <div className={`space-y-8 ${contentClass}`}>
            <div className="text-center mb-8">
              <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                Select the premium amenities your property offers
              </p>
            </div>

            <div className="space-y-8">
              {Object.entries(amenityCategories).map(([category, categoryAmenities]) => (
                <div key={category} className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 capitalize border-b border-gray-200 pb-2">
                    {category}
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {categoryAmenities.map((amenity) => {
                      const IconComponent = amenity.icon
                      return (
                        <label
                          key={amenity.id}
                          className={`group flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 ${
                            formData.amenities.includes(amenity.id)
                              ? "border-green-500 bg-green-50 shadow-sm"
                              : "border-gray-200 hover:border-green-300 bg-white"
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={formData.amenities.includes(amenity.id)}
                            onChange={() => handleAmenityChange(amenity.id)}
                            className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500 mr-3 transition-all duration-200"
                          />
                          <div className="flex items-center space-x-3">
                            <IconComponent
                              className={`w-5 h-5 transition-colors duration-200 ${
                                formData.amenities.includes(amenity.id)
                                  ? "text-green-600"
                                  : "text-gray-500 group-hover:text-green-600"
                              }`}
                            />
                            <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900 transition-colors">
                              {amenity.name}
                            </span>
                          </div>
                        </label>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )

      case 5:
        return (
          <div className={`space-y-8 ${contentClass}`}>
            <div className="text-center mb-8">
              <p className="text-gray-600 text-lg max-w-2xl mx-auto">Upload stunning photos and review your listing</p>
            </div>

            <div className="space-y-8">
              {/* Photo Upload Area */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Property Photos</label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center bg-gray-50 hover:border-green-400 transition-all duration-300 group">
                  <div className="flex flex-col items-center space-y-4">
                    <div className="w-16 h-16 bg-green-100 rounded-lg flex items-center justify-center group-hover:bg-green-200 transition-colors duration-300">
                      <Upload className="w-8 h-8 text-green-600" />
                    </div>
                    <div>
                      <p className="text-gray-700 font-medium mb-2">Drag and drop photos here, or click to browse</p>
                      <p className="text-sm text-gray-500">Upload high-quality images that showcase your property</p>
                    </div>
                    
                    {/* File input */}
                    <input
                      type="file"
                      id="media-upload"
                      multiple
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    <label 
                      htmlFor="media-upload"
                      className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 cursor-pointer"
                    >
                      Choose Photos
                    </label>
                  </div>
                </div>
                
                {/* Preview uploaded images */}
                {formData.mediaFiles && formData.mediaFiles.length > 0 && (
                  <div className="mt-6">
                    <h4 className="text-sm font-medium text-gray-700 mb-3">Selected Images ({formData.mediaFiles.length})</h4>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                      {Array.from(formData.mediaFiles).map((file, index) => (
                        <div key={index} className="relative group">
                          <img 
                            src={URL.createObjectURL(file)} 
                            alt={`Upload preview ${index + 1}`}
                            className="w-full h-32 object-cover rounded-lg shadow-sm" 
                          />
                          <button
                            type="button"
                            onClick={() => removeFile(index)}
                            className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Review Summary */}
              <div className="bg-gray-50 p-6 border border-gray-200 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-6 border-b border-gray-200 pb-3">
                  Listing Summary
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center py-2 border-b border-gray-200">
                      <span className="text-gray-600">Property Type:</span>
                      <span className="font-medium text-gray-900">
                        {categories.find((c) => c.id.toString() === formData.category_id)?.name || "Not selected"}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-gray-200">
                      <span className="text-gray-600">Title:</span>
                      <span className="font-medium text-gray-900 truncate ml-4">{formData.title || "Not entered"}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-gray-200">
                      <span className="text-gray-600">Price per Night:</span>
                      <span className="font-medium text-green-600">${formData.price_per_night || "0"}</span>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center py-2 border-b border-gray-200">
                      <span className="text-gray-600">Max Guests:</span>
                      <span className="font-medium text-gray-900">{formData.max_guests || "0"}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-gray-200">
                      <span className="text-gray-600">Location:</span>
                      <span className="font-medium text-gray-900 truncate ml-4">{formData.city || "Not entered"}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-gray-200">
                      <span className="text-gray-600">Amenities:</span>
                      <span className="font-medium text-green-600">{formData.amenities.length} selected</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <>
      <ClassicNavbar />
      <div className="min-h-screen bg-white pt-16 sm:pt-20">
        {/* Compact Progress Header */}
        <div className="bg-white border-b border-gray-200 sticky top-16 sm:top-20 z-40">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 py-3">
            <div className="flex items-center justify-between mb-3">
              <Link
                to="/stays"
                className="flex items-center text-green-600 hover:text-green-700 font-medium transition-colors duration-200 group text-sm"
              >
                <ChevronLeft className="w-4 h-4 mr-1 group-hover:-translate-x-1 transition-transform duration-200" />
                Back to Properties
              </Link>
              <div className="text-sm text-gray-600">
                Step {currentStep} of {totalSteps}
              </div>
            </div>

            {/* Compact Progress Steps */}
            <div className="flex items-center justify-between">
              {steps.map((step, index) => (
                <div key={step.number} className="flex items-center">
                  <div className="flex items-center space-x-2">
                    <div
                      className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                        index + 1 < currentStep
                          ? "bg-green-600 border-green-600 text-white"
                          : index + 1 === currentStep
                            ? "border-green-600 text-green-600 bg-white ring-2 ring-green-200"
                            : "border-gray-300 text-gray-400 bg-white"
                      }`}
                    >
                      {getStepIcon(step, index)}
                    </div>
                    <div className="hidden sm:block">
                      <div
                        className={`text-sm font-medium transition-colors duration-300 ${
                          index + 1 <= currentStep ? "text-gray-900" : "text-gray-500"
                        }`}
                      >
                        {step.title}
                      </div>
                    </div>
                  </div>
                  {index < steps.length - 1 && (
                    <div
                      className={`hidden md:block w-16 h-0.5 mx-4 transition-all duration-500 ${
                        index + 1 < currentStep ? "bg-green-600" : "bg-gray-300"
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 p-4 mb-8 rounded-lg whitespace-pre-line">
              <div className="flex items-start space-x-3">
                <X className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                <p className="text-sm">{error}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="min-h-[500px]">{renderStepContent()}</div>

            {/* Navigation Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-between mt-12 pt-6 border-t border-gray-200 space-y-4 sm:space-y-0">
              <button
                type="button"
                onClick={prevStep}
                disabled={currentStep === 1}
                className={`w-full sm:w-auto flex items-center justify-center px-6 py-3 border border-gray-300 rounded-lg font-medium transition-all duration-200 ${
                  currentStep === 1
                    ? "text-gray-400 cursor-not-allowed bg-gray-50"
                    : "text-gray-700 hover:bg-gray-50 hover:border-gray-400 hover:-translate-y-0.5 hover:shadow-md"
                }`}
              >
                <ChevronLeft className="w-4 h-4 mr-2" />
                Previous
              </button>

              {currentStep < totalSteps ? (
                <button
                  type="button"
                  onClick={nextStep}
                  className="w-full sm:w-auto flex items-center justify-center bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-medium transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
                >
                  Continue
                  <ChevronRight className="w-4 h-4 ml-2" />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full sm:w-auto flex items-center justify-center px-8 py-3 rounded-lg font-medium transition-all duration-300 ${
                    loading
                      ? "bg-gray-400 cursor-not-allowed text-white"
                      : "bg-green-600 hover:bg-green-700 text-white hover:shadow-lg hover:-translate-y-0.5"
                  }`}
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Creating...
                    </>
                  ) : (
                    <>
                      Create Property
                      <Check className="w-4 h-4 ml-2" />
                    </>
                  )}
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </>
  )
}


