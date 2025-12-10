/**
 * Página principal
 */

import { Link } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "../context/UserContext";
import Card from "../components/Card";

const Home = () => {
  const { user } = useContext(UserContext);

  return (
    <div className="grow flex items-center justify-center p-6">
      <Card className="text-center py-10 bg-white rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-emerald-800 mb-4">
          ¡Bienvenido {user ? user.nombre : ""}!
        </h1>

        <h2 className="text-xl font-semibold text-gray-600 mb-8">
          Sistema de gestión del Vivero Da Vinci
        </h2>

        {/* Grid de cards de los modulos de la app */}
        <div className="grid grid-cols-2 gap-6 max-w-3xl mx-auto">
          <Link to="/productos" className="block w-64 text-left">
            <Card className="bg-green-100 border border-green-200 transition h-full hover:shadow-lg">
              <h2 className="text-xl font-semibold text-emerald-800 mb-2">
                Productos
              </h2>
              <p className="text-gray-600">Gestionar inventario</p>
            </Card>
          </Link>

          <Link to="/categorias" className="block w-64 text-left">
            <Card className="bg-green-100 border border-green-200 transition h-full hover:shadow-lg">
              <h2 className="text-xl font-semibold text-emerald-800 mb-2">
                Categorías
              </h2>
              <p className="text-gray-600">Gestionar categorías</p>
            </Card>
          </Link>

          <Link to="/clientes" className="block w-64 text-left">
            <Card className="bg-green-100 border border-green-200 transition h-full hover:shadow-lg">
              <h2 className="text-xl font-semibold text-emerald-800 mb-2">
                Clientes
              </h2>
              <p className="text-gray-600">Gestionar clientes</p>
            </Card>
          </Link>

          <Link to="/empleados" className="block w-64 text-left">
            <Card className="bg-green-100 border border-green-200 transition h-full hover:shadow-lg">
              <h2 className="text-xl font-semibold text-emerald-800 mb-2">
                Empleados
              </h2>
              <p className="text-gray-600">Gestionar personal</p>
            </Card>
          </Link>

          <Link to="/ventas" className="block w-64 text-left col-span-2 mx-auto">
            <Card className="bg-green-100 border border-green-200 transition h-full hover:shadow-lg">
              <h2 className="text-xl font-semibold text-emerald-800 mb-2">
                Ventas
              </h2>
              <p className="text-gray-600">Gestionar ventas</p>
            </Card>
          </Link>
        </div>
      </Card>
    </div>
  );
};

export default Home;
