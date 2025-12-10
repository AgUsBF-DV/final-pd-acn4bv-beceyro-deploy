/**
 * Manejo del estado del usuario autenticado
 * Maneja la persistencia en localStorage, login y logout
 */

import { createContext, useState, useEffect } from "react";

// Crear contexto para compartir estado del usuarioen la app
export const UserContext = createContext();

// Provider del contexto de usuario, da acceso al estado de autenticación
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  // Al montar el componente, recuperar usuario y token del localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const token = localStorage.getItem("token");
    if (storedUser && token) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);
  // Guardar usuario y token en estado y localStorage
  const login = (userData, token) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("token", token);
  };
  // Limpiar estado y remover datos del localStorage
  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };
  return (
    <UserContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </UserContext.Provider>
  );
};
