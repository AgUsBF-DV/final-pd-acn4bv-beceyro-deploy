/**
 * Punto de entrada principal de la aplicación React
 */

import App from "./App.jsx";
import React from "react";
import ReactDOM from "react-dom/client";
import { UserProvider } from "./context/UserContext";
import "./index.css";

// Renderizar la aplicación en el elemento root del HTML
ReactDOM.createRoot(document.getElementById("root")).render(
  // StrictMode activa verificaciones adicionales en desarrollo
  <React.StrictMode>
    {/* UserProvider envuelve la app para compartir el estado de autenticación */}
    <UserProvider>
      <App />
    </UserProvider>
  </React.StrictMode>
);
