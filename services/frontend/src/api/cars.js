import carsClient from './carsClient';

// Get all vehicles with pagination
export const getVehicles = (page = 1) => 
  carsClient.get('/vehicles', { params: { page } });

// Get a specific vehicle
export const getVehicleById = (id) => 
  carsClient.get(`/vehicles/${id}`);

// Create a new vehicle with proper content type for file uploads if needed
export const createVehicle = (vehicleData) => {
  // Check if vehicleData is already a FormData object
  const isFormData = vehicleData instanceof FormData;
  
  if (isFormData) {
    // ALWAYS add host_id
    for (let pair of vehicleData.entries()) {
      if (pair[0] === 'host_id') {
        vehicleData.delete('host_id');
      }
    }
    vehicleData.append('host_id', '2'); // Using ID 2 like in stays
    
    // Make sure location_id is set
    for (let pair of vehicleData.entries()) {
      if (pair[0] === 'location_id') {
        vehicleData.delete('location_id');
      }
    }
    vehicleData.append('location_id', '1');
    
    // Clean up any features and use reasonable defaults
    for (let pair of vehicleData.entries()) {
      if (pair[0].startsWith('features')) {
        vehicleData.delete(pair[0]);
      }
    }
    vehicleData.append('features[0]', '1');
    
    // Log what we're sending
    console.log('FormData entries after fixing:');
    for (let pair of vehicleData.entries()) {
      console.log(pair[0], pair[1]);
    }
    
    return carsClient.post('/vehicles', vehicleData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  } else {
    // For JSON data, ensure host_id is included
    const modifiedData = { ...vehicleData };
    
    // ALWAYS set host_id
    modifiedData.host_id = 2;
    
    // Set default location_id and features
    modifiedData.location_id = modifiedData.location_id || 1;
    modifiedData.features = modifiedData.features || [1];
    
    console.log('Sending vehicle data with host_id=2:', modifiedData);
    
    return carsClient.post('/vehicles', modifiedData, {
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

// Update a vehicle
export const updateVehicle = (id, vehicleData) => {
  const isFormData = vehicleData instanceof FormData;
  
  if (isFormData) {
    // Set host_id
    for (let pair of vehicleData.entries()) {
      if (pair[0] === 'host_id') {
        vehicleData.delete('host_id');
      }
    }
    vehicleData.append('host_id', '2');
    
    // Clean up features
    for (let pair of vehicleData.entries()) {
      if (pair[0].startsWith('features')) {
        vehicleData.delete(pair[0]);
      }
    }
    vehicleData.append('features[0]', '1');
    
    return carsClient.post(`/vehicles/${id}`, vehicleData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      params: { _method: 'PUT' }
    });
  } else {
    // For JSON data
    const modifiedData = { ...vehicleData };
    
    // Set host_id if updating the whole object
    if (!modifiedData.host_id) {
      modifiedData.host_id = 2;
    }
    
    return carsClient.put(`/vehicles/${id}`, modifiedData);
  }
};

// Delete a vehicle
export const deleteVehicle = (id) => 
  carsClient.delete(`/vehicles/${id}`);