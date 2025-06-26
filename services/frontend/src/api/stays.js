import staysClient from './staysClient';

// Get all stays
export const getStays = (page = 1) => 
  staysClient.get('/stays', { params: { page } });

// Get a specific stay
export const getStayById = (id) => 
  staysClient.get(`/stays/${id}`);

// Create a new stay with proper content type for file uploads if needed
export const createStay = (stayData) => {
  // If stayData contains files, use FormData
  if (stayData.media && stayData.media.length > 0) {
    const formData = new FormData();
    
    // Add all text fields
    Object.keys(stayData).forEach(key => {
      if (key !== 'media' && key !== 'location' && key !== 'amenity_ids') {
        formData.append(key, stayData[key]);
      }
    });
    
    // Add location fields
    Object.keys(stayData.location).forEach(key => {
      formData.append(`location[${key}]`, stayData.location[key]);
    });
    
    // Add amenities
    stayData.amenity_ids.forEach((id, index) => {
      formData.append(`amenity_ids[${index}]`, id);
    });
    
    // Add media files
    stayData.media.forEach((file, index) => {
      formData.append(`media[${index}]`, file);
    });
    
    return staysClient.post('/stays', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  }
  
  // If no files, send as JSON
  return staysClient.post('/stays', stayData);
};

// Update a stay
export const updateStay = (id, stayData) => {
  // Clone the data to avoid modifying the original
  const formattedData = { ...stayData };
  
  // If using 'amenities' but backend expects 'amenity_ids'
  if (formattedData.amenities) {
    formattedData.amenity_ids = formattedData.amenities;
    delete formattedData.amenities;
  }
  
  console.log('Formatted data for API:', formattedData);
  return staysClient.put(`/stays/${id}`, formattedData);
};

// Delete a stay
export const deleteStay = (id) => 
  staysClient.delete(`/stays/${id}`);