import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import useAuthStore from '../store/useAuthStore'; // Adjust path as needed

const apiClient = axios.create({
  baseURL: 'http://localhost:8000/api', // Replace with your actual API base URL
  headers: {
    'Content-Type': 'application/json',
  },
});

let isRefreshing = false;
let failedQueue: { resolve: (value?: any) => void; reject: (reason?: any) => void }[] = [];

const processQueue = (error: AxiosError | null, token: string | null = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// Request Interceptor
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const { accessToken } = useAuthStore.getState();
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response Interceptor
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
        .then(token => {
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = 'Bearer ' + token;
          }
          return apiClient(originalRequest);
        })
        .catch(err => {
          return Promise.reject(err);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const { refreshToken, logout, setTokens } = useAuthStore.getState();

      if (!refreshToken) {
        console.log('No refresh token available, logging out.');
        logout();
        isRefreshing = false;
        processQueue(error, null);
        return Promise.reject(error);
      }

      try {
        console.log('Attempting to refresh token...');
        const response = await axios.post(
          'http://localhost:8000/api/auth/refresh', // Your refresh token endpoint
          { token: refreshToken }, // Ensure your backend expects { token: yourRefreshToken }
          {
            headers: {
              'Content-Type': 'application/json',
              // No Authorization header needed for refresh typically, or a specific one if required by your backend
            },
          }
        );

        const newAccessToken = response.data.access_token; // Adjust based on your API response structure
        const newRefreshToken = response.data.refresh_token; // Optional: if your API sends a new refresh token

        setTokens({ accessToken: newAccessToken, refreshToken: newRefreshToken });
        console.log('Token refreshed successfully.');

        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        }
        processQueue(null, newAccessToken);
        return apiClient(originalRequest); // Retry the original request with the new token
      } catch (refreshError) {
        console.error('Failed to refresh token:', refreshError);
        logout(); // Logout if refresh fails
        processQueue(refreshError as AxiosError, null);
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    // For other errors, log them and pass them on
    if (error.response) {
      console.error('API Error Response:', error.response.data);
      console.error('Status:', error.response.status);
    } else if (error.request) {
      console.error('API No Response:', error.request);
    } else {
      console.error('API Error:', error.message);
    }
    return Promise.reject(error);
  }
);

export default apiClient;
