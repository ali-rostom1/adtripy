import axios from 'axios';

// Create a client that doesn't require authentication
const carsClient = axios.create({
  baseURL: `${import.meta.env.VITE_CARS_API_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default carsClient;