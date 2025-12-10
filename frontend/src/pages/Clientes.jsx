/**
 * Página de gestión de clientes
 */

import { useState, useEffect } from "react";
import api from "../services/api";
import Table from "../components/Table";
import Form from "../components/Form";
import Button from "../components/Button";
import Card from "../components/Card";

const Clientes = () => {
  const [clientes, setClientes] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [message, setMessage] = useState(null);
  const [busqueda, setBusqueda] = useState("");
  // Cargar clientes al montar el componente
  useEffect(() => {
    fetchClientes();
  }, []);

  // Obtener todos los clientes desde la API
  const fetchClientes = async () => {
    try {
      const response = await api.get("/api/clientes");
      setClientes(response.data);
    } catch (error) {
      console.error("Error fetching clientes", error);
    }
  };

  // Elimina un cliente (soft delete)
  const handleDelete = async (id) => {
    if (!window.confirm("¿Estás seguro de eliminar este cliente?")) return;
    try {
      await api.delete(`/api/clientes/${id}`);
      setClientes(clientes.filter((c) => c.id !== id));
      setMessage({ type: "success", text: "Cliente eliminado con éxito" });
    } catch (error) {
      setMessage({ type: "error", text: "Error al eliminar cliente" });
    }
  };

  //Crea un nuevo cliente o actualiza uno existente
  const handleCreate = async (data) => {
    try {
      if (editingItem) {
        // Modo edición: actualizar cliente existente
        const response = await api.put(`/api/clientes/${editingItem.id}`, data);
        setClientes(
          clientes.map((c) => (c.id === editingItem.id ? response.data : c))
        );
        setMessage({ type: "success", text: "Cliente actualizado con éxito" });
      } else {
        // Modo creación: agregar nuevo cliente
        const response = await api.post("/api/clientes", data);
        setClientes([...clientes, response.data]);
        setMessage({ type: "success", text: "Cliente agregado con éxito" });
      }
      setShowForm(false);
      setEditingItem(null);
    } catch (error) {
      setMessage({
        type: "error",
        text: editingItem
          ? "Error al actualizar cliente"
          : "Error al agregar cliente",
      });
    }
  };

  // Prepara el formulario para editar un cliente
  const handleEdit = (item) => {
    setEditingItem(item);
    setShowForm(true);
  };

  // Titulos de columnas para la tabla
  const headers = [
    { key: "id", label: "ID" },
    { key: "nombre", label: "Nombre" },
    { key: "email", label: "Email" },
  ];
  // Campos para el formulario
  const formFields = [
    { name: "nombre", label: "Nombre", required: true },
    { name: "email", label: "Email", type: "email", required: true },
  ];

  // Filtrar clientes por búsqueda
  const clientesFiltrados = clientes.filter((cliente) =>
    cliente.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center my-6">
        <h1 className="text-2xl font-bold text-emerald-800">
          Gestión de Clientes
        </h1>
        <Button
          onClick={() => {
            setShowForm(!showForm);
            setEditingItem(null);
          }}
          variant="primary"
        >
          {showForm ? "Cancelar" : "Agregar Cliente"}
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
              {editingItem ? "Editar Cliente" : "Nuevo Cliente"}
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
                placeholder="Buscar cliente por nombre..."
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
              data={clientesFiltrados}
              onDelete={handleDelete}
              onEdit={handleEdit}
            />
          </Card>
        </div>
      )}
    </div>
  );
};

export default Clientes;
