/**
 * Configuracion principal de la App
 */

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "./context/UserContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Empleados from "./pages/Empleados";
import Productos from "./pages/Productos";
import ProductoDetalle from "./pages/ProductoDetalle";
import Categorias from "./pages/Categorias";
import Clientes from "./pages/Clientes";
import Ventas from "./pages/Ventas";
import VentaDetalle from "./pages/VentaDetalle";
import NotFound from "./pages/NotFound";
import "./App.css";

// Proteccion de rutas privadas
const PrivateRoute = ({ children }) => {
  const { user, loading } = useContext(UserContext);
  // Mostrar loading mientras se verifica autenticación
  if (loading) return <div>Loading...</div>;
  // Renderizar contenido si hay usuario, sino redirigir a login
  return user ? children : <Navigate to="/login" />;
};

// Config de estructura (Navbar y Footer) y rutas de la app
function App() {
  return (
    <Router>
      <div className="min-h-screen bg-green-100 font-sans flex flex-col">
        <Navbar />

        <Routes>
          <Route path="/login" element={<Login />} />

          <Route
            path="/"
            element={
              <PrivateRoute>
                <Home />
              </PrivateRoute>
            }
          />

          <Route
            path="/empleados"
            element={
              <PrivateRoute>
                <Empleados />
              </PrivateRoute>
            }
          />

          <Route
            path="/productos"
            element={
              <PrivateRoute>
                <Productos />
              </PrivateRoute>
            }
          />

          <Route
            path="/productos/:id"
            element={
              <PrivateRoute>
                <ProductoDetalle />
              </PrivateRoute>
            }
          />

          <Route
            path="/categorias"
            element={
              <PrivateRoute>
                <Categorias />
              </PrivateRoute>
            }
          />

          <Route
            path="/clientes"
            element={
              <PrivateRoute>
                <Clientes />
              </PrivateRoute>
            }
          />

          <Route
            path="/ventas"
            element={
              <PrivateRoute>
                <Ventas />
              </PrivateRoute>
            }
          />

          <Route
            path="/ventas/:id"
            element={
              <PrivateRoute>
                <VentaDetalle />
              </PrivateRoute>
            }
          />

          {/* Ruta catch-all para 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>

        <Footer />
      </div>
    </Router>
  );
}

export default App;
