import axios from 'axios';

const authClient = axios.create({
  baseURL: `${import.meta.env.VITE_AUTH_API_URL}/api/v1`, // Add /v1 to the base URL
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

export default authClient;