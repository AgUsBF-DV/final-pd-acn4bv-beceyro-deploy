/**
 * Página de gestión de ventas
 */

import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { UserContext } from "../context/UserContext";
import Button from "../components/Button";
import Card from "../components/Card";
import Table from "../components/Table";

const Ventas = () => {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const [clientes, setClientes] = useState([]);
  const [empleados, setEmpleados] = useState([]);
  const [productos, setProductos] = useState([]);
  const [clienteSeleccionado, setClienteSeleccionado] = useState("");
  const [carrito, setCarrito] = useState([]); // Productos seleccionados para la venta
  const [productoSeleccionado, setProductoSeleccionado] = useState("");
  const [cantidadProducto, setCantidadProducto] = useState(1);
  const [ventas, setVentas] = useState([]);
  const [showForm, setShowForm] = useState(false); // Alterna entre vista de tabla y formulario
  const [message, setMessage] = useState(null);
  // Filtros
  const [filtroCliente, setFiltroCliente] = useState("");
  const [filtroEmpleado, setFiltroEmpleado] = useState("");
  // Cargar clientes, productos, empleados y ventas al montar el componente
  useEffect(() => {
    fetchClientes();
    fetchEmpleados();
    fetchProductos();
    fetchVentas();
  }, []);

  // Obtiene todos los clientes desde la API
  const fetchClientes = async () => {
    try {
      const response = await api.get("/api/clientes");
      setClientes(response.data);
    } catch (error) {
      console.error("Error fetching clientes", error);
    }
  };

  // Obtiene todos los empleados desde la API
  const fetchEmpleados = async () => {
    try {
      const response = await api.get("/api/empleados");
      setEmpleados(response.data);
    } catch (error) {
      console.error("Error fetching empleados", error);
    }
  };

  // Obtiene todos los productos con su stock actual
  const fetchProductos = async () => {
    try {
      const response = await api.get("/api/productos");
      setProductos(response.data);
    } catch (error) {
      console.error("Error fetching productos", error);
    }
  };

  // Obtiene todas las ventas realizadas
  const fetchVentas = async () => {
    try {
      const response = await api.get("/api/ventas");
      setVentas(response.data);
    } catch (error) {
      console.error("Error fetching ventas", error);
    }
  };

  // Agrega un producto al carrito de compra
  const agregarAlCarrito = () => {
    // Validar selección y cantidad
    if (!productoSeleccionado || cantidadProducto <= 0) {
      setMessage({
        type: "error",
        text: "Selecciona un producto y cantidad válida",
      });
      return;
    }
    // Verificar existencia de producto y stock disponible
    const producto = productos.find(
      (p) => p.id === parseInt(productoSeleccionado)
    );
    if (!producto) return;
    if (producto.stock < cantidadProducto) {
      setMessage({
        type: "error",
        text: `Stock insuficiente. Disponible: ${producto.stock}`,
      });
      return;
    }
    // Agregar o actualizar producto en el carrito
    const itemExistente = carrito.find(
      (item) => item.producto.id === producto.id
    );
    if (itemExistente) {
      setCarrito(
        carrito.map((item) =>
          item.producto.id === producto.id
            ? { ...item, cantidad: item.cantidad + cantidadProducto }
            : item
        )
      );
    } else {
      setCarrito([...carrito, { producto, cantidad: cantidadProducto }]);
    }
    setProductoSeleccionado("");
    setCantidadProducto(1);
    setMessage(null);
  };

  // Actualiza la cantidad de un producto en el carrito
  const actualizarCantidad = (productoId, nuevaCantidad) => {
    // Validar cantidad
    const cantidad = parseInt(nuevaCantidad);
    if (cantidad <= 0) {
      eliminarDelCarrito(productoId);
      return;
    }
    // Verificar stock disponible
    const producto = productos.find((p) => p.id === productoId);
    if (producto && cantidad > producto.stock) {
      setMessage({
        type: "error",
        text: `Stock insuficiente. Disponible: ${producto.stock}`,
      });
      return;
    }
    // Actualizar cantidad en el carrito
    setCarrito(
      carrito.map((item) =>
        item.producto.id === productoId ? { ...item, cantidad } : item
      )
    );
    setMessage(null);
  };

  // Elimina un producto del carrito
  const eliminarDelCarrito = (productoId) => {
    setCarrito(carrito.filter((item) => item.producto.id !== productoId));
  };

  // Calcula el total de la venta sumando los subtotales de todos los productos en el carrito
  const calcularTotal = () => {
    return carrito
      .reduce((total, item) => total + item.producto.precio * item.cantidad, 0)
      .toFixed(2);
  };

  // Confirma y registra la venta en la base de datos
  const confirmarVenta = async () => {
    // Validar selección de cliente
    if (!clienteSeleccionado) {
      setMessage({ type: "error", text: "Debes seleccionar un cliente" });
      return;
    }
    // Validar que el carrito no esté vacío
    if (carrito.length === 0) {
      setMessage({ type: "error", text: "El carrito está vacío" });
      return;
    }
    // Registrar la venta
    try {
      const ventaData = {
        cliente_id: parseInt(clienteSeleccionado),
        productos: carrito.map((item) => ({
          producto_id: item.producto.id,
          cantidad: item.cantidad,
          precio_unitario: item.producto.precio,
        })),
      };
      await api.post("/api/ventas", ventaData);
      setMessage({ type: "success", text: "Venta registrada con éxito" });
      setCarrito([]);
      setClienteSeleccionado("");
      setShowForm(false);
      fetchVentas();
      fetchProductos(); // Actualizar stock después de la venta
    } catch (error) {
      setMessage({ type: "error", text: "Error al registrar la venta" });
    }
  };

  // Navega a la página de detalle de la venta seleccionada
  const handleView = (venta) => {
    navigate(`/ventas/${venta.id}`);
  };

  // Elimina una venta (soft delete)
  const handleDelete = async (id) => {
    if (!window.confirm("¿Estás seguro de eliminar esta venta?")) return;
    try {
      await api.delete(`/api/ventas/${id}`);
      setVentas(ventas.filter((v) => v.id !== id));
      setMessage({ type: "success", text: "Venta eliminada con éxito" });
    } catch (error) {
      setMessage({ type: "error", text: "Error al eliminar venta" });
    }
  };

  // Títulos de columnas para la tabla de ventas
  const ventasHeaders = [
    { key: "id", label: "ID" },
    { key: "cliente_nombre", label: "Cliente" },
    { key: "empleado_nombre", label: "Empleado" },
    { key: "total", label: "Total ($)" },
    { key: "fecha", label: "Fecha" },
  ];

  // Filtrar y formatear ventas según los filtros seleccionados
  const ventasFiltradas = ventas.filter((venta) => {
    const cumpleFiltroCliente = !filtroCliente || venta.cliente_id === parseInt(filtroCliente);
    const cumpleFiltroEmpleado = !filtroEmpleado || venta.empleado_id === parseInt(filtroEmpleado);
    return cumpleFiltroCliente && cumpleFiltroEmpleado;
  });

  const ventasData = ventasFiltradas.map((venta) => ({
    ...venta,
    fecha: new Date(venta.creado_en).toLocaleDateString(),
  }));

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center my-6">
        <h1 className="text-2xl font-bold text-emerald-800">
          Gestión de Ventas
        </h1>
        <Button
          onClick={() => {
            setShowForm(!showForm);
            setCarrito([]);
            setClienteSeleccionado("");
            setMessage(null);
          }}
          variant="primary"
        >
          {showForm ? "Cancelar" : "Nueva Venta"}
        </Button>
      </div>

      {message && (
        <div className="px-6">
          <div
            className={`p-4 rounded-2xl my-6 border-2 flex items-center justify-between ${
              message.type === "success"
                ? "bg-emerald-200 text-emerald-800 border-emerald-500"
                : "bg-red-200 text-red-800 border-red-500"
            }`}
          >
            <span>{message.text}</span>
            <button
              onClick={() => setMessage(null)}
              className="ml-4 hover:opacity-70 transition-opacity"
              aria-label="Cerrar mensaje"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="2"
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      )}

      {showForm ? (
        <div className="grid grid-cols-1 gap-6">
          <Card className="bg-white shadow-lg">
            <h2 className="text-xl font-bold text-emerald-800 mb-4">
              Seleccionar Cliente
            </h2>
            <select
              value={clienteSeleccionado}
              onChange={(e) => setClienteSeleccionado(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="">Seleccionar cliente...</option>
              {clientes.map((cliente) => (
                <option key={cliente.id} value={cliente.id}>
                  {cliente.nombre} - {cliente.email}
                </option>
              ))}
            </select>
          </Card>

          <Card className="bg-white shadow-lg">
            <h2 className="text-xl font-bold text-emerald-800 mb-4">
              Agregar Productos
            </h2>
            <div className="grid grid-cols-6 gap-6">
              <select
                value={productoSeleccionado}
                onChange={(e) => setProductoSeleccionado(e.target.value)}
                className="col-span-3 w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="">Seleccionar producto...</option>
                {productos.map((producto) => (
                  <option key={producto.id} value={producto.id}>
                    {producto.nombre} - ${producto.precio} (Stock:{" "}
                    {producto.stock})
                  </option>
                ))}
              </select>

              <input
                type="number"
                min="1"
                value={cantidadProducto}
                onChange={(e) => setCantidadProducto(parseInt(e.target.value))}
                placeholder="Cantidad"
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              />

              <Button
                onClick={agregarAlCarrito}
                variant="secondary"
                className="col-span-2 w-full"
              >
                Agregar al Carrito
              </Button>
            </div>

            {/* Carrito */}
            <div className="mt-6">
              <h3 className="font-semibold text-emerald-800 mb-3">Carrito:</h3>
              {carrito.length === 0 ? (
                <p className="text-gray-500 text-sm">El carrito está vacío</p>
              ) : (
                <div className="space-y-2">
                  {carrito.map((item) => (
                    <div
                      key={item.producto.id}
                      className="flex items-center justify-between gap-2 p-2 bg-green-100 rounded"
                    >
                      <span className="text-sm flex-1">
                        {item.producto.nombre}
                      </span>
                      <input
                        type="number"
                        min="1"
                        value={item.cantidad}
                        onChange={(e) =>
                          actualizarCantidad(item.producto.id, e.target.value)
                        }
                        className="w-16 border border-gray-300 rounded px-2 py-1 text-sm"
                      />
                      <span className="text-sm font-semibold w-20 text-right">
                        ${(item.producto.precio * item.cantidad).toFixed(2)}
                      </span>
                      <button
                        onClick={() => eliminarDelCarrito(item.producto.id)}
                        className="text-red-600 hover:text-red-800 font-bold"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke-width="1.5"
                          stroke="currentColor"
                          class="size-6"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            d="M6 18 18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </Card>

          <Card className="bg-white shadow-lg">
            <div className="flex justify-end text-lg font-bold text-emerald-800 pb-4">
              <span class="mr-2">Total:</span>
              <span>${calcularTotal()}</span>
            </div>

            <Button
              onClick={confirmarVenta}
              variant="primary"
              className="w-full"
              disabled={!clienteSeleccionado || carrito.length === 0}
            >
              Confirmar Venta
            </Button>
          </Card>
        </div>
      ) : (
        <div>
          {/* Filtros */}
          <Card className="bg-white rounded-lg shadow-lg mx-6">
            <h2 className="text-xl font-bold text-emerald-800 mb-4">
              Filtros
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Filtrar por Cliente
                </label>
                <select
                  value={filtroCliente}
                  onChange={(e) => setFiltroCliente(e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="">Todos los clientes</option>
                  {clientes.map((cliente) => (
                    <option key={cliente.id} value={cliente.id}>
                      {cliente.nombre}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Filtrar por Vendedor
                </label>
                <select
                  value={filtroEmpleado}
                  onChange={(e) => setFiltroEmpleado(e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="">Todos los vendedores</option>
                  {empleados.map((empleado) => (
                    <option key={empleado.id} value={empleado.id}>
                      {empleado.nombre}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {(filtroCliente || filtroEmpleado) && (
              <div className="mt-4">
                <Button
                  onClick={() => {
                    setFiltroCliente("");
                    setFiltroEmpleado("");
                  }}
                  variant="secondary"
                >
                  Limpiar Filtros
                </Button>
              </div>
            )}
          </Card>

          {/* Tabla de ventas */}
          <Card>
            <Table
              headers={ventasHeaders}
              data={ventasData}
              onView={handleView}
              onDelete={handleDelete}
            />
          </Card>
        </div>
      )}
    </div>
  );
};

export default Ventas;
