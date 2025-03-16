import axios from "axios";
import { API_ROUTES } from "./apiRoutes";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true; // Prevent infinite loops

      try {
        const res = await api.post(`${API_ROUTES.users}/refreshToken`);
        localStorage.setItem("accessToken", res.data.accessToken);
        api.defaults.headers.Authorization = `Bearer ${res.data.accessToken}`;

        // Retry original request with new token
        originalRequest.headers.Authorization = `Bearer ${res.data.accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        console.error("Session expired, please login again.");
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
