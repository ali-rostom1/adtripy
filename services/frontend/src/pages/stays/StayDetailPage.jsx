import React, { useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useStaysStore } from '../../store/StaysStore';

export default function StayDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const { 
    currentStay, 
    isLoading, 
    error, 
    fetchStayById,
    deleteStay,
    clearCurrentStay
  } = useStaysStore();

  useEffect(() => {
    if (id) {
      fetchStayById(id);
    }
    
    return () => clearCurrentStay();
  }, [id, fetchStayById, clearCurrentStay]);

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this stay?')) {
      try {
        await deleteStay(id);
        navigate('/stays');
      } catch (err) {
        console.error('Failed to delete stay:', err);
      }
    }
  };

  if (isLoading && !currentStay) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  if (error && !currentStay) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  if (!currentStay) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-gray-600">Stay not found</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <Link to="/stays" className="text-green-600 hover:text-green-800 mb-2 inline-block">
            ← Back to All Stays
          </Link>
          <h1 className="text-3xl font-semibold text-gray-800">{currentStay.title}</h1>
        </div>
        <div className="flex space-x-4">
          <Link
            to={`/stays/edit/${currentStay.id}`}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition duration-300"
          >
            Edit Stay
          </Link>
          <button
            onClick={handleDelete}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition duration-300"
          >
            Delete Stay
          </button>
        </div>
      </div>

      {/* Media Gallery */}
      <div className="mb-8">
        {currentStay.media && currentStay.media.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {currentStay.media.map((item, index) => (
              <img
                key={index}
                src={item.url}
                alt={`${currentStay.title} - Image ${index + 1}`}
                className="w-full h-64 object-cover rounded-lg shadow-md"
              />
            ))}
          </div>
        ) : (
          <div className="w-full h-64 bg-gray-200 flex items-center justify-center rounded-lg">
            <span className="text-gray-400">No images available</span>
          </div>
        )}
      </div>

      {/* Stay Details */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <div className="bg-white p-6 rounded-lg shadow-md mb-6">
            <h2 className="text-2xl font-semibold mb-4">About this place</h2>
            <p className="text-gray-700 whitespace-pre-line">{currentStay.description}</p>
          </div>

          {/* Amenities */}
          {currentStay.amenities && currentStay.amenities.length > 0 && (
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-2xl font-semibold mb-4">Amenities</h2>
              <div className="grid grid-cols-2 gap-4">
                {currentStay.amenities.map((amenity) => (
                  <div key={amenity.id} className="flex items-center">
                    <span className="text-green-500 mr-2">✓</span>
                    <span>{amenity.name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div>
          <div className="bg-white p-6 rounded-lg shadow-md sticky top-6">
            <h2 className="text-2xl font-semibold mb-4">Details</h2>
            <div className="space-y-4">
              <div>
                <p className="text-gray-600">Price</p>
                <p className="text-2xl font-bold text-green-600">${currentStay.price_per_night} <span className="text-sm font-normal">night</span></p>
              </div>
              
              <div>
                <p className="text-gray-600">Category</p>
                <p className="font-medium">{currentStay.category?.name || 'Not categorized'}</p>
              </div>
              
              <div>
                <p className="text-gray-600">Location</p>
                <p className="font-medium">
                  {currentStay.location ? 
                    `${currentStay.location.city}, ${currentStay.location.country}` : 
                    'Location not specified'}
                </p>
              </div>
              
              <div>
                <p className="text-gray-600">Capacity</p>
                <p className="font-medium">{currentStay.max_guests} guests</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}