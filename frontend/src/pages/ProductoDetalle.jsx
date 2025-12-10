/**
 * Página de detalle de producto
 */

import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";
import Card from "../components/Card";
import Button from "../components/Button";

const ProductoDetalle = () => {
  const { id } = useParams(); // Obtener ID del producto desde la URL
  const navigate = useNavigate();
  const [producto, setProducto] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // Cargar producto al montar el componente o cambiar el ID
  useEffect(() => {
    fetchProducto();
  }, [id]);

  // Obtiene los datos del producto desde la API
  const fetchProducto = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/api/productos/${id}`);
      setProducto(response.data);
      setError(null);
    } catch (error) {
      console.error("Error fetching producto", error);
      setError("No se pudo cargar el producto");
    } finally {
      setLoading(false);
    }
  };

  // Mostrar indicador de carga mientras se obtiene el producto
  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex justify-center items-center min-h-[400px]">
          <p className="text-gray-500 text-lg">Cargando producto...</p>
        </div>
      </div>
    );
  }

  // Mostrar mensaje de error si no se pudo cargar el producto
  if (error || !producto) {
    return (
      <div className="container mx-auto p-6">
        <Card className="bg-white shadow-lg max-w-2xl mx-auto">
          <div className="text-center py-10">
            <p className="text-red-600 text-lg mb-4">
              {error || "Producto no encontrado"}
            </p>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center my-6">
        <h1 className="text-2xl font-bold text-emerald-800">
          Detalle del Producto
        </h1>
        <Button onClick={() => navigate("/productos")} variant="primary">
          Volver
        </Button>
      </div>

      <Card className="bg-white shadow-lg max-w-4xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Imagen */}
          <div className="flex items-center justify-center bg-green-100 rounded-lg p-6">
            {producto.imagen ? (
              <img
                src={`${producto.imagen}`}
                alt={producto.nombre}
                className="max-w-full h-auto rounded-lg shadow-md object-contain max-h-96"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "/img/placeholder.png";
                }}
              />
            ) : (
              <div className="flex items-center justify-center h-64 bg-gray-200 rounded-lg w-full">
                <span className="text-gray-400 text-lg">Sin imagen</span>
              </div>
            )}
          </div>

          {/* Columna Derecha: Información */}
          <div className="flex flex-col justify-between">
            <div>
              <h1 className="text-3xl font-bold text-emerald-800 mb-2">
                {producto.nombre}
              </h1>

              <div className="mb-6">
                <span
                  className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                    producto.stock > 0
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {producto.stock > 0 ? "En Stock" : "Sin Stock"}
                </span>
              </div>

              <div className="space-y-4">
                <div className="border-b border-gray-200 pb-4">
                  <p className="text-gray-600 text-sm uppercase font-semibold mb-1">
                    Precio
                  </p>
                  <p className="text-2xl font-bold text-emerald-800">
                    ${producto.precio}
                  </p>
                </div>

                <div className="border-b border-gray-200 pb-4">
                  <p className="text-gray-600 text-sm uppercase font-semibold mb-1">
                    Stock Disponible
                  </p>
                  <p className="text-2xl font-semibold text-emerald-800">
                    {producto.stock} unidades
                  </p>
                </div>

                {producto.categoria_nombre && (
                  <div className="border-b border-gray-200 pb-4">
                    <p className="text-gray-600 text-sm uppercase font-semibold mb-1">
                      Categoría
                    </p>
                    <p className="text-lg text-emerald-800">
                      {producto.categoria_nombre}
                    </p>
                  </div>
                )}

                {producto.descripcion && (
                  <div>
                    <p className="text-gray-600 text-sm uppercase font-semibold mb-2">
                      Descripción
                    </p>
                    <p className="text-gray-700 leading-relaxed">
                      {producto.descripcion}
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <Button
                onClick={() =>
                  navigate(`/productos`, { state: { editProduct: producto } })
                }
                variant="primary"
              >
                Editar Producto
              </Button>
            </div>
          </div>
        </div>

        {/* Información adicional */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <div className="grid grid-cols-5 gap-4 text-sm text-gray-600">
            <div>
              <span className="font-semibold">ID:</span> {producto.id}
            </div>
            <div className="col-span-2">
              <span className="font-semibold">Fecha de creación:</span>{" "}
              {new Date(producto.creado_en).toLocaleDateString()}
            </div>
            {producto.actualizado_en && (
              <div className="col-span-2">
                <span className="font-semibold">Última actualización:</span>{" "}
                {new Date(producto.actualizado_en).toLocaleDateString()}
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ProductoDetalle;
