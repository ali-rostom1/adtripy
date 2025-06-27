import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { createStay } from '../../../api/stays';

export default function CreateStayPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState([]);
  const [amenities, setAmenities] = useState([]);
  
  // Initialize with all required fields including location_id
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price_per_night: '',
    max_guests: '',
    bedrooms: '',
    bathrooms: '',
    category_id: '1',
    host_id: '1', // Default host ID since we're not requiring auth
    location_id: '1',// Add this field (will be created or linked)
    address: '',    // Address fields at top level (not nested)
    city: '',
    state: '',
    country: '',
    postal_code: '',
    latitude: '',
    longitude: '',
    amenities: [], // Array of amenity IDs
    media: []
  });

  // Fetch categories and amenities
  useEffect(() => {
    // Mock fetch for now - replace with actual API calls
    setCategories([
      { id: 1, name: 'Apartment' },
      { id: 2, name: 'House' },
      { id: 3, name: 'Villa' }
    ]);
    
    setAmenities([
      { id: 1, name: 'WiFi' },
      { id: 2, name: 'Air Conditioning' },
      { id: 3, name: 'Kitchen' }
    ]);
  }, []);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Handle amenity checkbox changes
  const handleAmenityChange = (e) => {
    const amenityId = parseInt(e.target.value);
    const isChecked = e.target.checked;
    
    if (isChecked) {
      setFormData({
        ...formData,
        amenities: [...formData.amenities, amenityId]
      });
    } else {
      setFormData({
        ...formData,
        amenities: formData.amenities.filter(id => id !== amenityId)
      });
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      // Format the data for API with fixed location_id and category_id
      const dataToSubmit = {
        title: formData.title,
        description: formData.description,
        price_per_night: parseFloat(formData.price_per_night || 0),
        max_guests: parseInt(formData.max_guests || 1),
        bedrooms: parseInt(formData.bedrooms || 1),
        bathrooms: parseFloat(formData.bathrooms || 1),
        // Use default IDs
        category_id: 1, // Default category ID
        host_id: 1,     // Default host ID
        location_id: 1, // Default location ID
        
        // Remove the location object since we're using a fixed location_id
        // location: { ... },
        
        // Fix the amenities format - send as array, not 'amenity_ids'
        amenities: formData.amenities.length > 0 ? formData.amenities : [1]
      };
      
      console.log('Submitting stay data with default IDs:', dataToSubmit);
      
      const response = await createStay(dataToSubmit);
      console.log('Stay created:', response.data);
      
      // Redirect to the stay detail page
      navigate(`/stays/${response.data.id}`);
    } catch (err) {
      console.error('Error creating stay:', err);
      
      // Format validation errors for display
      if (err.response?.data?.errors) {
        const errorMessages = Object.entries(err.response.data.errors)
          .map(([field, messages]) => `${field}: ${messages.join(', ')}`)
          .join('\n');
        setError(errorMessages);
      } else {
        setError(err.response?.data?.message || err.message || 'Failed to create stay.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center mb-8">
        <Link to="/stays" className="text-green-600 hover:text-green-800 mr-4">
          ← Back to Stays
        </Link>
        <h1 className="text-3xl font-semibold text-gray-800">Create New Stay</h1>
      </div>
      
      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 whitespace-pre-line">
          <p>{error}</p>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
        {/* Basic Information */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-4">Basic Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 mb-2">Title</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            
            <div>
              <label className="block text-gray-700 mb-2">Category</label>
              <select
                name="category_id"
                value={formData.category_id}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              >
                <option value="">Select a category</option>
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-gray-700 mb-2">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                rows="4"
                required
              ></textarea>
            </div>
          </div>
        </div>
        
        {/* Details */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-4">Property Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-gray-700 mb-2">Price per Night ($)</label>
              <input
                type="number"
                name="price_per_night"
                value={formData.price_per_night}
                onChange={handleChange}
                min="0"
                step="0.01"
                className="w-full p-2 border rounded"
                required
              />
            </div>
            
            <div>
              <label className="block text-gray-700 mb-2">Max Guests</label>
              <input
                type="number"
                name="max_guests"
                value={formData.max_guests}
                onChange={handleChange}
                min="1"
                className="w-full p-2 border rounded"
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
                className="w-full p-2 border rounded"
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
                className="w-full p-2 border rounded"
                required
              />
            </div>
          </div>
        </div>
        
        {/* Location */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-4">Location</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-gray-700 mb-2">Address</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="w-full p-2 border rounded"
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
                className="w-full p-2 border rounded"
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
                className="w-full p-2 border rounded"
                required
              />
            </div>
            
            <div>
              <label className="block text-gray-700 mb-2">Country</label>
              <input
                type="text"
                name="country"
                value={formData.country}
                onChange={handleChange}
                className="w-full p-2 border rounded"
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
                className="w-full p-2 border rounded"
                required
              />
            </div>
            
            <div>
              <label className="block text-gray-700 mb-2">Latitude (optional)</label>
              <input
                type="text"
                name="latitude"
                value={formData.latitude}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
            </div>
            
            <div>
              <label className="block text-gray-700 mb-2">Longitude (optional)</label>
              <input
                type="text"
                name="longitude"
                value={formData.longitude}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
            </div>
          </div>
        </div>
        
        {/* Amenities */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-4">Amenities</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {amenities.map(amenity => (
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
        
        {/* Submit Button */}
        <div className="mt-8">
          <button
            type="submit"
            disabled={loading}
            className={`px-6 py-3 bg-green-600 text-white rounded-lg ${
              loading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-green-700'
            }`}
          >
            {loading ? 'Creating...' : 'Create Stay'}
          </button>
        </div>
      </form>
    </div>
  );
}