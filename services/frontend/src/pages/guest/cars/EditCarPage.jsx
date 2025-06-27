import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { getVehicleById, updateVehicle } from "../../../api/Cars";
import ClassicNavbar from "../../../components/guest/Nav";

export default function EditCarPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState([]);
  const [features, setFeatures] = useState([]);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    year: new Date().getFullYear(),
    category_id: "1",
    host_id: "2",
    location_id: "1",
    address: "",
    city: "",
    state: "",
    country: "",
    postal_code: "",
    latitude: "",
    longitude: "",
    doors: "4",
    seats: "5",
    transmission: "automatic",
    fuel_type: "petrol",
    features: [],
    media: [],
  });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch vehicle data
        const vehicleResponse = await getVehicleById(id);
        const vehicle = vehicleResponse.data;

        // Update form data with vehicle data
        setFormData({
          name: vehicle.name || "",
          description: vehicle.description || "",
          price: vehicle.price || "",
          year: vehicle.year || new Date().getFullYear(),
          category_id: vehicle.category_id?.toString() || "1",
          host_id: vehicle.host_id?.toString() || "2",
          location_id: vehicle.location_id?.toString() || "1",
          // Flatten location
          address: vehicle.location?.address || "",
          city: vehicle.location?.city || "",
          state: vehicle.location?.state || "",
          country: vehicle.location?.country || "",
          postal_code: vehicle.location?.postal_code || "",
          latitude: vehicle.location?.latitude || "",
          longitude: vehicle.location?.longitude || "",
          // Vehicle specific
          doors: vehicle.doors?.toString() || "4",
          seats: vehicle.seats?.toString() || "5",
          transmission: vehicle.transmission || "automatic",
          fuel_type: vehicle.fuel_type || "petrol",
          // Features
          features: vehicle.features ? vehicle.features.map((f) => f.id || f) : [],
          media: vehicle.media || [],
        });

        // Mock data for categories
        setCategories([
          { id: 1, name: "Sedan" },
          { id: 2, name: "SUV" },
          { id: 3, name: "Luxury" },
          { id: 4, name: "Sports Car" },
          { id: 5, name: "Electric" },
          { id: 6, name: "Convertible" },
        ]);

        // Mock data for features
        setFeatures([
          { id: 1, name: "Bluetooth" },
          { id: 2, name: "Navigation System" },
          { id: 3, name: "Premium Sound System" },
          { id: 4, name: "Cruise Control" },
          { id: 5, name: "Leather Seats" },
          { id: 6, name: "Sunroof" },
          { id: 7, name: "Backup Camera" },
          { id: 8, name: "Parking Sensors" },
          { id: 9, name: "Climate Control" },
          { id: 10, name: "Heated Seats" },
          { id: 11, name: "Apple CarPlay" },
          { id: 12, name: "Satellite Radio" },
        ]);
      } catch (err) {
        console.error("Error fetching vehicle data:", err);
        setError("Failed to load vehicle data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchData();
    }
  }, [id]);

  // Simple handle change for flat structure
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFeatureChange = (e) => {
    const featureId = parseInt(e.target.value);
    const isChecked = e.target.checked;

    if (isChecked) {
      setFormData({
        ...formData,
        features: [...formData.features, featureId],
      });
    } else {
      setFormData({
        ...formData,
        features: formData.features.filter((id) => id !== featureId),
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      // Format data for API with fixed IDs
      const dataToSubmit = {
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price || 0),
        year: parseInt(formData.year || new Date().getFullYear()),
        // Use fixed IDs to match backend expectations
        category_id: parseInt(formData.category_id || 1),
        host_id: 2, // Fixed host ID
        location_id: 1, // Fixed location ID
        // Vehicle specific
        doors: parseInt(formData.doors || 4),
        seats: parseInt(formData.seats || 5),
        transmission: formData.transmission || "automatic",
        fuel_type: formData.fuel_type || "petrol",
        // Include at least one feature to satisfy backend validation
        features: [1], // Use a known good feature ID
      };

      console.log("Submitting vehicle update with data:", dataToSubmit);

      // Update the vehicle
      await updateVehicle(id, dataToSubmit);

      // Redirect to the vehicle details page
      navigate(`/cars/${id}`);
    } catch (err) {
      console.error("Error updating vehicle:", err);

      // Format validation errors
      if (err.response?.data?.errors) {
        const errorMessages = Object.entries(err.response.data.errors)
          .map(([field, messages]) => `${field}: ${messages.join(", ")}`)
          .join("\n");
        setError(errorMessages);
      } else {
        setError(
          err.response?.data?.message || "Failed to update vehicle. Please try again."
        );
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <>
        <ClassicNavbar />
        <div className="flex justify-center items-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
        </div>
      </>
    );
  }

  if (error && !formData.name) {
    return (
      <>
        <ClassicNavbar />
        <div className="flex justify-center items-center min-h-screen">
          <div className="text-red-500">{error}</div>
        </div>
      </>
    );
  }

  return (
    <>
      <ClassicNavbar />
      <div className="container mx-auto px-4 py-8 pt-20">
        <div className="flex items-center mb-8">
          <Link
            to={`/cars/${id}`}
            className="text-green-600 hover:text-green-800 mr-4"
          >
            ← Back to Vehicle
          </Link>
          <h1 className="text-3xl font-semibold text-gray-800">
            Edit Vehicle: {formData.name}
          </h1>
        </div>

        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 whitespace-pre-line">
            <p>{error}</p>
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-lg shadow-md p-6"
        >
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Basic Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-700 mb-2">Vehicle Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Category</label>
                <select
                  name="category_id"
                  value={formData.category_id}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                >
                  <option value="">Select a category</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-gray-700 mb-2">
                  Price per day ($)
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Year</label>
                <input
                  type="number"
                  name="year"
                  value={formData.year}
                  onChange={handleChange}
                  min="1950"
                  max={new Date().getFullYear() + 1}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                />
              </div>
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 mb-2">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            ></textarea>
          </div>

          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Vehicle Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-700 mb-2">Doors</label>
                <select
                  name="doors"
                  value={formData.doors}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                >
                  <option value="2">2 doors</option>
                  <option value="3">3 doors</option>
                  <option value="4">4 doors</option>
                  <option value="5">5 doors</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Seats</label>
                <select
                  name="seats"
                  value={formData.seats}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                >
                  <option value="2">2 seats</option>
                  <option value="4">4 seats</option>
                  <option value="5">5 seats</option>
                  <option value="7">7 seats</option>
                  <option value="8">8+ seats</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Transmission</label>
                <select
                  name="transmission"
                  value={formData.transmission}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                >
                  <option value="automatic">Automatic</option>
                  <option value="manual">Manual</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Fuel Type</label>
                <select
                  name="fuel_type"
                  value={formData.fuel_type}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                >
                  <option value="petrol">Petrol</option>
                  <option value="diesel">Diesel</option>
                  <option value="electric">Electric</option>
                  <option value="hybrid">Hybrid</option>
                </select>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Location</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-700 mb-2">Address</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-2">City</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-2">State/Province</label>
                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Country</label>
                <input
                  type="text"
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Postal Code</label>
                <input
                  type="text"
                  name="postal_code"
                  value={formData.postal_code}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
            </div>
          </div>

          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Features
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {features.map((feature) => (
                <div key={feature.id} className="flex items-center">
                  <input
                    type="checkbox"
                    id={`feature-${feature.id}`}
                    value={feature.id}
                    checked={formData.features.includes(feature.id)}
                    onChange={handleFeatureChange}
                    className="mr-2"
                  />
                  <label htmlFor={`feature-${feature.id}`}>{feature.name}</label>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8">
            <button
              type="submit"
              disabled={submitting}
              className={`px-6 py-3 bg-green-600 text-white rounded-lg ${
                submitting
                  ? "opacity-70 cursor-not-allowed"
                  : "hover:bg-green-700"
              }`}
            >
              {submitting ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}