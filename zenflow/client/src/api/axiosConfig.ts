import axios, { AxiosError } from 'axios';

// Create a new axios instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

// -----------------------------------------------------------------
api.interceptors.response.use(
  (response) => response,

  // Failed Response
  (error: AxiosError) => {
    let errorMessage = 'An unexpected network error occurred.';

    if (error.response) {
      const serverData = error.response.data as { message?: string };
      
      if (serverData && serverData.message) {
        errorMessage = serverData.message;
      } else if (error.response.statusText) {
        // Fallback to standard status text (e.g., "Not Found", "Internal Server Error")
        errorMessage = error.response.statusText;
      }
    } else if (error.request) {
      // --- Server Unreachable (Down, CORS, No Network) ---
      errorMessage = 'Server unreachable. Please check your connection.';
    } else {
      // --- Error Setting Up the Request ---
      errorMessage = error.message;
    }
    return Promise.reject(new Error(errorMessage));
  }
);

export default api;