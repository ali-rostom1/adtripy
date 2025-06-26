import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

export default function StaysPage() {
  const [stays, setStays] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0
  });

  useEffect(() => {
    fetchStays();
  }, []);

  // Update the fetchStays function with better error handling
  const fetchStays = async (page = 1) => {
    setLoading(true);
    try {
      console.log(`Fetching stays from: ${import.meta.env.VITE_STAYS_API_URL}/api/stays`);
      
      const response = await axios.get(`${import.meta.env.VITE_STAYS_API_URL}/api/stays`, {
        params: { page },
      });
      
      console.log('Stays API response:', response.data);
      
      // Handle different response formats
      if (response.data.data) {
        setStays(response.data.data);
        console.log('Parsed stays from response.data.data:', response.data.data);
      } else if (Array.isArray(response.data)) {
        setStays(response.data);
        console.log('Parsed stays from array:', response.data);
      } else {
        setStays([response.data]);
        console.log('Parsed single stay:', response.data);
      }
      
      // Set pagination if available
      if (response.data.current_page) {
        setPagination({
          currentPage: response.data.current_page,
          totalPages: response.data.last_page,
          totalItems: response.data.total
        });
      }
      
      setLoading(false);
    } catch (err) {
      console.error('Error fetching stays:', err);
      console.error('Error details:', {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status
      });
      
      setError(`Failed to load stays: ${err.response?.data?.message || err.message || 'Unknown error'}`);
      setLoading(false);
    }
  };

  const handlePageChange = (page) => {
    fetchStays(page);
  };

  if (loading && stays.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  if (error && stays.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-semibold text-gray-800">Explore Stays</h1>
        <Link
          to="/stays/create"
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition duration-300"
        >
          Add New Stay
        </Link>
      </div>

      {stays.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 text-lg">No stays found. Add your first stay!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stays.map((stay) => (
            <div 
              key={stay.id} 
              className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition duration-300"
            >
              {stay.media && stay.media.length > 0 ? (
                <img 
                  src={stay.media[0].url} 
                  alt={stay.title} 
                  className="w-full h-56 object-cover"
                />
              ) : (
                <div className="w-full h-56 bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-400">No image available</span>
                </div>
              )}
              <div className="p-5">
                <h2 className="text-xl font-semibold text-gray-800 mb-2">{stay.title}</h2>
                <p className="text-gray-600 mb-4 line-clamp-2">{stay.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-green-600 font-bold">${stay.price_per_night}/night</span>
                  <Link 
                    to={`/stays/${stay.id}`}
                    className="text-green-600 hover:text-green-800 font-medium"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex justify-center mt-8">
          <nav className="flex space-x-2">
            {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`px-4 py-2 rounded ${
                  pagination.currentPage === page
                    ? 'bg-green-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                {page}
              </button>
            ))}
          </nav>
        </div>
      )}
    </div>
  );
}