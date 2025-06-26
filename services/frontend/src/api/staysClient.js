import axios from 'axios';

// Create a client that doesn't require authentication
const staysClient = axios.create({
  baseURL: `${import.meta.env.VITE_STAYS_API_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default staysClient;