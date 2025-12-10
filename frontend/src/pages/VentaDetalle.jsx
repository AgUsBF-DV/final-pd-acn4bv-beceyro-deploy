/**
 * Página de detalle de venta
 */

import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";
import Card from "../components/Card";
import Button from "../components/Button";
import Table from "../components/Table";

const VentaDetalle = () => {
  const { id } = useParams(); // Obtener ID de la venta desde la URL
  const navigate = useNavigate();
  const [venta, setVenta] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // Cargar venta al montar el componente o cambiar el ID
  useEffect(() => {
    fetchVenta();
  }, [id]);

  // Obtiene los datos completos de la venta desde la API
  const fetchVenta = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/api/ventas/${id}`);
      setVenta(response.data);
      setError(null);
    } catch (error) {
      console.error("Error fetching venta", error);
      setError("No se pudo cargar la venta");
    } finally {
      setLoading(false);
    }
  };

  // Mostrar indicador de carga mientras se obtiene la venta
  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex justify-center items-center min-h-[400px]">
          <p className="text-gray-500 text-lg">Cargando venta...</p>
        </div>
      </div>
    );
  }
  // Mostrar mensaje de error si no se pudo cargar la venta
  if (error || !venta) {
    return (
      <div className="container mx-auto p-6">
        <Card className="bg-white shadow-lg max-w-2xl mx-auto">
          <div className="text-center py-10">
            <p className="text-red-600 text-lg mb-4">
              {error || "Venta no encontrada"}
            </p>
            <Button onClick={() => navigate("/ventas")} variant="primary">
              Volver a Ventas
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  // Títulos de columnas para la tabla de productos
  const productosHeaders = [
    { key: "producto_nombre", label: "Producto" },
    { key: "cantidad", label: "Cantidad" },
    { key: "precio_unitario", label: "Precio Unitario ($)" },
    { key: "subtotal", label: "Subtotal ($)" },
  ];
  // Preparar datos de productos calculando el subtotal de cada uno
  const productosData = venta.productos
    ? venta.productos.map((producto) => ({
        ...producto,
        subtotal: (producto.cantidad * producto.precio_unitario).toFixed(2),
      }))
    : [];

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center my-6">
        <h1 className="text-2xl font-bold text-emerald-800">
          Detalle de Venta #{venta.id}
        </h1>
        <Button onClick={() => navigate("/ventas")} variant="primary">
          Volver
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Información del Cliente */}
        <Card className="bg-white shadow-lg">
          <h2 className="text-xl font-bold text-emerald-800 mb-4">Cliente</h2>
          <div className="space-y-3">
            <div>
              <p className="text-gray-600 text-sm font-semibold">Nombre</p>
              <p className="text-emerald-800 text-lg">{venta.cliente_nombre}</p>
            </div>
            <div>
              <p className="text-gray-600 text-sm font-semibold">Email</p>
              <p className="text-emerald-800 text-lg">{venta.cliente_email}</p>
            </div>
          </div>
        </Card>

        {/* Información de la Venta */}
        <Card className="bg-white shadow-lg">
          <h2 className="text-xl font-bold text-emerald-800 mb-4">
            Datos Generales
          </h2>
          <div className="space-y-3">
            <div>
              <p className="text-gray-600 text-sm font-semibold">Empleado</p>
              <p className="text-emerald-800 text-lg">
                {venta.empleado_nombre}
              </p>
            </div>
            <div>
              <p className="text-gray-600 text-sm font-semibold">Fecha</p>
              <p className="text-emerald-800 text-lg">
                {new Date(venta.creado_en).toLocaleDateString()} -{" "}
                {new Date(venta.creado_en).toLocaleTimeString()}
              </p>
            </div>
          </div>
        </Card>

        {/* Total de la Venta */}
        <Card className="bg-white shadow-lg">
          <h2 className="text-xl font-bold text-emerald-800 mb-4">Total</h2>
          <div className="flex items-center justify-center pt-8">
            <p className="text-emerald-800 text-3xl font-bold">
              ${venta.total}
            </p>
          </div>
        </Card>
      </div>

      {/* Detalle de Productos */}
      <Card>
        <h2 className="text-xl font-bold text-emerald-800 mb-4">
          Detalle de Productos
        </h2>
        <Table headers={productosHeaders} data={productosData} />
      </Card>
    </div>
  );
};

export default VentaDetalle;
