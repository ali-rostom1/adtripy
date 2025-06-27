import staysClient from './staysClient';

// Get all stays
export const getStays = (page = 1) => 
  staysClient.get('/stays', { params: { page } });

// Get a specific stay
export const getStayById = (id) => 
  staysClient.get(`/stays/${id}`);

// Create a new stay with proper content type for file uploads if needed
export const createStay = (stayData) => {
  // Check if stayData is already a FormData object
  const isFormData = stayData instanceof FormData;
  
  if (isFormData) {
    // ALWAYS add host_id=2 (try a different ID since 1 isn't working)
    for (let pair of stayData.entries()) {
      if (pair[0] === 'host_id') {
        stayData.delete('host_id');
      }
    }
    stayData.append('host_id', '2'); // Try using ID 2 instead of 1
    
    // Make sure location_id is set
    for (let pair of stayData.entries()) {
      if (pair[0] === 'location_id') {
        stayData.delete('location_id');
      }
    }
    stayData.append('location_id', '1');
    
    // Clean up any amenities and use just ID 1
    for (let pair of stayData.entries()) {
      if (pair[0].startsWith('amenities')) {
        stayData.delete(pair[0]);
      }
    }
    stayData.append('amenities[0]', '1');
    
    // Log what we're sending
    console.log('FormData entries after fixing:');
    for (let pair of stayData.entries()) {
      console.log(pair[0], pair[1]);
    }
    
    return staysClient.post('/stays', stayData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  } else {
    // For JSON data, ensure host_id is included
    const modifiedData = { ...stayData };
    
    // ALWAYS set host_id to 2
    modifiedData.host_id = 2;  // Try using ID 2 instead of 1
    
    // Set default location_id and amenities
    modifiedData.location_id = 1;
    modifiedData.amenities = [1];
    
    console.log('Sending stay data with host_id=2:', modifiedData);
    
    return staysClient.post('/stays', modifiedData, {
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

// Update a stay similarly
export const updateStay = (id, stayData) => {
  const isFormData = stayData instanceof FormData;
  
  if (isFormData) {
    // Set host_id=2
    for (let pair of stayData.entries()) {
      if (pair[0] === 'host_id') {
        stayData.delete('host_id');
      }
    }
    stayData.append('host_id', '2'); // Use ID 2
    
    // Clean up amenities
    for (let pair of stayData.entries()) {
      if (pair[0].startsWith('amenities')) {
        stayData.delete(pair[0]);
      }
    }
    stayData.append('amenities[0]', '1');
    
    return staysClient.post(`/stays/${id}`, stayData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      params: { _method: 'PUT' }
    });
  } else {
    // For JSON data
    const modifiedData = { ...stayData };
    
    // ALWAYS set host_id to 2
    modifiedData.host_id = 2;  // Use ID 2
    modifiedData.amenities = [1];
    
    return staysClient.put(`/stays/${id}`, modifiedData);
  }
};

// Delete a stay
export const deleteStay = (id) => 
  staysClient.delete(`/stays/${id}`);