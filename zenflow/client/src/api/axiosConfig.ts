import axios, { AxiosError } from 'axios';
import { useAuthStore } from '../store/authStore';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

// -----------------------------------------------------------------

api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;

    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    
    return config; 
  },
  (error) => {
    return Promise.reject(error);
  }
);
// -----------------------------------------------------------------

api.interceptors.response.use(
  (response) => response,

  (error: AxiosError) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().logout(); 
  
      window.location.href = '/auth';
    }

    let errorMessage = 'Bir ağ hatası oluştu.';
    if (error.response) {
      const serverData = error.response.data as { message?: string };
      if (serverData && serverData.message) {
        errorMessage = serverData.message;
      } else {}
    } else if (error.request) {
      errorMessage = 'Sunucuya ulaşılamadı. Lütfen internet bağlantınızı kontrol edin.';
    } else {
      errorMessage = error.message;
    }
    
    return Promise.reject(new Error(errorMessage));
  }
);

export default api;