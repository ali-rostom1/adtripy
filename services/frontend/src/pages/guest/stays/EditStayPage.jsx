import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { getStayById, updateStay } from "../../../api/stays"; // Import the updated functions

export default function EditStayPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState([]);
  const [amenities, setAmenities] = useState([]);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price_per_night: "",
    max_guests: "",
    bedrooms: "",
    bathrooms: "",
    category_id: "1",
    host_id: "1", // Default host ID since we're not requiring auth
    location_id: "1", // Add this field (will be created or linked)
    address: "", // Address fields at top level (not nested)
    city: "",
    state: "",
    country: "",
    postal_code: "",
    latitude: "",
    longitude: "",
    amenities: [], // Array of amenity IDs
    media: [],
  });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Use the new API function without authentication
        const stayResponse = await getStayById(id);

        // Format the data for the form
        const stay = stayResponse.data;
        setFormData({
          title: stay.title || "",
          description: stay.description || "",
          price_per_night: stay.price_per_night || "",
          max_guests: stay.max_guests || "",
          bedrooms: stay.bedrooms || "",
          bathrooms: stay.bathrooms || "",
          category_id: stay.category_id || "",
          host_id: stay.host_id || "1", // Default to 1 since we're not requiring authentication
          location: stay.location || {
            address: "",
            city: "",
            state: "",
            country: "",
            postal_code: "",
            latitude: "",
            longitude: "",
          },
          amenities: stay.amenities ? stay.amenities.map((a) => a.id) : [],
          media: stay.media || [],
        });

        // In a real implementation, you would fetch categories and amenities from your API
        // For now, we'll use placeholder data
        setCategories([
          { id: 1, name: "Apartment" },
          { id: 2, name: "House" },
          { id: 3, name: "Villa" },
        ]);

        setAmenities([
          { id: 1, name: "WiFi" },
          { id: 2, name: "Air Conditioning" },
          { id: 3, name: "Kitchen" },
          { id: 4, name: "Pool" },
          { id: 5, name: "Parking" },
        ]);
      } catch (err) {
        console.error("Error fetching stay data:", err);
        setError("Failed to load stay data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchData();
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name.startsWith("location.")) {
      const locationField = name.split(".")[1];
      setFormData({
        ...formData,
        location: {
          ...formData.location,
          [locationField]: value,
        },
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleAmenityChange = (e) => {
    const amenityId = parseInt(e.target.value);
    const isChecked = e.target.checked;

    if (isChecked) {
      setFormData({
        ...formData,
        amenities: [...formData.amenities, amenityId],
      });
    } else {
      setFormData({
        ...formData,
        amenities: formData.amenities.filter((id) => id !== amenityId),
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      // Format the data for API
      const dataToSubmit = {
        ...formData,
        price_per_night: parseFloat(formData.price_per_night),
        max_guests: parseInt(formData.max_guests),
        bedrooms: parseInt(formData.bedrooms),
        bathrooms: parseInt(formData.bathrooms),
        category_id: parseInt(formData.category_id),
        host_id: parseInt(formData.host_id),
      };

      // Use the new API function without authentication
      await updateStay(id, dataToSubmit);

      // Redirect to the stay details page
      navigate(`/stays/${id}`);
    } catch (err) {
      console.error("Error updating stay:", err);
      setError(
        err.response?.data?.message ||
          "Failed to update stay. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  if (error && !formData.title) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center mb-8">
        <Link
          to={`/stays/${id}`}
          className="text-green-600 hover:text-green-800 mr-4"
        >
          ← Back to Stay
        </Link>
        <h1 className="text-3xl font-semibold text-gray-800">
          Edit Stay: {formData.title}
        </h1>
      </div>

      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6">
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
              <label className="block text-gray-700 mb-2">Title</label>
              <input
                type="text"
                name="title"
                value={formData.title}
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
                Price per night ($)
              </label>
              <input
                type="number"
                name="price_per_night"
                value={formData.price_per_night}
                onChange={handleChange}
                min="0"
                step="0.01"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-2">Maximum guests</label>
              <input
                type="number"
                name="max_guests"
                value={formData.max_guests}
                onChange={handleChange}
                min="1"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-2">Bedrooms</label>
              <input
                type="number"
                name="bedrooms"
                value={formData.bedrooms}
                onChange={handleChange}
                min="0"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-2">Bathrooms</label>
              <input
                type="number"
                name="bathrooms"
                value={formData.bathrooms}
                onChange={handleChange}
                min="0"
                step="0.5"
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
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Location</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-700 mb-2">Address</label>
              <input
                type="text"
                name="location.address"
                value={formData.location.address}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-2">City</label>
              <input
                type="text"
                name="location.city"
                value={formData.location.city}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-2">State/Province</label>
              <input
                type="text"
                name="location.state"
                value={formData.location.state}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-2">Country</label>
              <input
                type="text"
                name="location.country"
                value={formData.location.country}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-2">Postal Code</label>
              <input
                type="text"
                name="location.postal_code"
                value={formData.location.postal_code}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
          </div>
        </div>

        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Amenities
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {amenities.map((amenity) => (
              <div key={amenity.id} className="flex items-center">
                <input
                  type="checkbox"
                  id={`amenity-${amenity.id}`}
                  value={amenity.id}
                  checked={formData.amenities.includes(amenity.id)}
                  onChange={handleAmenityChange}
                  className="mr-2"
                />
                <label htmlFor={`amenity-${amenity.id}`}>{amenity.name}</label>
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
  );
}
