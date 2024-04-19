import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

axiosInstance.interceptors.response.use(
    response => response,
    error => {
      if (error.response && error.response.data) {
        console.error("API error:", error.response.data);
        throw new Error(error.response.data.message || "An API error occurred.");
      }
      throw error;
    }
  );

export default axiosInstance;
