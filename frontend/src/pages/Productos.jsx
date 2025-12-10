/**
 * Página de gestión de productos
 */

import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../services/api";
import Table from "../components/Table";
import Form from "../components/Form";
import Button from "../components/Button";
import Card from "../components/Card";

const Productos = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [message, setMessage] = useState(null);
  const [busqueda, setBusqueda] = useState("");
  // Cargar productos y categorías al montar el componente
  useEffect(() => {
    fetchProductos();
    fetchCategorias();

    // Si se recibe un producto para editar desde ProductoDetalle
    if (location.state?.editProduct) {
      setEditingItem(location.state.editProduct);
      setShowForm(true);
      // Limpiar el estado de navegación
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, []);

  // Obtiene todos los productos desde la API
  const fetchProductos = async () => {
    try {
      const response = await api.get("/api/productos");
      setProductos(response.data);
    } catch (error) {
      console.error("Error fetching productos", error);
    }
  };

  //Obtiene todas las categorías para el selector del formulario
  const fetchCategorias = async () => {
    try {
      const response = await api.get("/api/categorias");
      setCategorias(response.data);
    } catch (error) {
      console.error("Error fetching categorias", error);
    }
  };

  // Elimina un producto (soft delete)
  const handleDelete = async (id) => {
    if (!window.confirm("¿Estás seguro de eliminar este producto?")) return;
    try {
      await api.delete(`/api/productos/${id}`);
      setProductos(productos.filter((p) => p.id !== id));
      setMessage({ type: "success", text: "Producto eliminado con éxito" });
    } catch (error) {
      setMessage({ type: "error", text: "Error al eliminar producto" });
    }
  };

  // Crea un nuevo producto o actualiza uno existente
  const handleCreate = async (data, files) => {
    try {
      // Crear FormData para enviar archivos (multipart/form-data)
      const formData = new FormData();
      // Agregar todos los campos del formulario
      Object.keys(data).forEach((key) => {
        if (data[key] !== undefined && data[key] !== null && data[key] !== "") {
          formData.append(key, data[key]);
        }
      });
      // Agregar archivo de imagen si existe
      if (files && files.imagen) {
        formData.append("imagen", files.imagen);
      }
      // Evaluar si es creación o edición
      if (editingItem) {
        // Modo edición: actualizar producto existente
        const response = await api.put(
          `/api/productos/${editingItem.id}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        setProductos(
          productos.map((p) => (p.id === editingItem.id ? response.data : p))
        );
        setMessage({ type: "success", text: "Producto actualizado con éxito" });
      } else {
        // Modo creación: agregar nuevo producto
        const response = await api.post("/api/productos", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        setProductos([...productos, response.data]);
        setMessage({ type: "success", text: "Producto agregado con éxito" });
      }
      setShowForm(false);
      setEditingItem(null);
    } catch (error) {
      setMessage({
        type: "error",
        text: editingItem
          ? "Error al actualizar producto"
          : "Error al agregar producto",
      });
    }
  };

  // Prepara el formulario para editar un producto
  const handleEdit = (item) => {
    setEditingItem(item);
    setShowForm(true);
  };

  // Navega a la página de detalle del producto
  const handleView = (item) => {
    navigate(`/productos/${item.id}`);
  };

  // Títulos de columnas para la tabla
  const headers = [
    { key: "id", label: "ID" },
    { key: "nombre", label: "Nombre" },
    { key: "precio", label: "Precio ($)" },
    { key: "stock", label: "Stock" },
  ];
  // Campos para el formulario de producto
  const formFields = [
    { name: "nombre", label: "Nombre", required: true },
    { name: "descripcion", label: "Descripción", type: "textarea" },
    {
      name: "precio",
      label: "Precio",
      type: "number",
      required: true,
      step: "0.01",
    },
    { name: "stock", label: "Stock", type: "number", required: true },
    {
      name: "imagen",
      label: "Imagen del Producto",
      type: "file",
      accept: "image/*",
    },
    {
      name: "categoria_id",
      label: "Categoría",
      type: "select",
      options: categorias.map((cat) => ({
        value: cat.id,
        label: cat.nombre,
      })),
    },
  ];

  // Filtrar productos por búsqueda
  const productosFiltrados = productos.filter((producto) =>
    producto.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center my-6">
        <h1 className="text-2xl font-bold text-emerald-800">
          Gestión de Productos
        </h1>
        <Button
          onClick={() => {
            setShowForm(!showForm);
            setEditingItem(null);
          }}
          variant="primary"
        >
          {showForm ? "Cancelar" : "Agregar Producto"}
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
        <div className="grow flex items-center justify-center p-6">
          <Card className="text-center py-10 bg-white rounded-lg shadow-lg max-w-md w-full">
            <h1 className="text-3xl font-bold text-emerald-800 mb-4">
              {editingItem ? "Editar Producto" : "Nuevo Producto"}
            </h1>

            <Form
              fields={formFields}
              initialValues={editingItem || {}}
              onSubmit={handleCreate}
              buttonLabel={editingItem ? "Actualizar" : "Guardar"}
            />
          </Card>
        </div>
      ) : (
        <div>
          <Card className="bg-white rounded-lg shadow-lg mx-6">
            <div className="relative">
              <input
                type="text"
                placeholder="Buscar producto por nombre..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 pl-10 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                />
              </svg>
            </div>
          </Card>

          <Card>
            <Table
              headers={headers}
              data={productosFiltrados}
              onView={handleView}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          </Card>
        </div>
      )}
    </div>
  );
};

export default Productos;
