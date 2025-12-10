/**
 * Configuración de Axios para agregar token JWT automáticamente
 */

import axios from "axios";

// Crear instancia de axios con configuración base
const api = axios.create({
  baseURL: import.meta.env.VITE_URL || "http://localhost:3000",
});

// Interceptor: agrega token JWT a todas las peticiones automáticamente
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    // Agregar header Authorization con formato Bearer TOKEN
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor de response para logout automático cuando el token expira
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Si el token expiró o es inválido (401/403)
    if (error.response?.status === 401 || error.response?.status === 403) {
      // Limpiar localStorage
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      // Mostrar mensaje antes de redirigir
      alert("Tu sesión ha expirado. Por favor, inicia sesión nuevamente.");
      // Redirigir al login
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;
