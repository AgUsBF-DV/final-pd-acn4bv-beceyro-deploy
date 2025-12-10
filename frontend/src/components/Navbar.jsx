/**
 * Componente de navbar principal
 */

import { Link } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "../context/UserContext";
import Button from "./Button";

const Navbar = () => {
  // Obtener el estado del usuario y función de logout del contexto
  const { user, logout } = useContext(UserContext);
  // Diseño basico: logo, Nombre y botón de logout
  return (
    <nav className="flex justify-between items-center p-5 bg-emerald-800 shadow-md text-white">
      {/* Logo y título del sitio */}
      <div className="flex items-baseline gap-2">
        <Link to="/" className="px-4">
          <img src="/img/flower-pot.png" alt="Logo" className="h-12 w-auto" />
        </Link>

        <span className="self-center text-3xl font-bold whitespace-nowrap px-4">
          Vivero Da Vinci
        </span>
      </div>

      {/* Botón de cerrar sesión */}
      <div className="flex items-baseline text-lg">
        <Button onClick={logout} variant="danger" className="px-3 py-1">
          Cerrar Sesión
        </Button>
      </div>
    </nav>
  );
};

export default Navbar;
