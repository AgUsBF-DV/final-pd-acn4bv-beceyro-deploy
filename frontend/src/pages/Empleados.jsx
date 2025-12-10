/**
 * Página de gestión de empleados
 */

import { useState, useEffect } from "react";
import api from "../services/api";
import Table from "../components/Table";
import Form from "../components/Form";
import Button from "../components/Button";
import Card from "../components/Card";

const Empleados = () => {
  const [empleados, setEmpleados] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [message, setMessage] = useState(null);
  // Cargar empleados al montar el componente
  useEffect(() => {
    fetchEmpleados();
  }, []);

  // Obtener todos los empleados desde la API
  const fetchEmpleados = async () => {
    try {
      const response = await api.get("/api/empleados");
      setEmpleados(response.data);
    } catch (error) {
      console.error("Error fetching empleados", error);
    }
  };

  // Elimina un empleado (soft delete)
  const handleDelete = async (id) => {
    if (!window.confirm("¿Estás seguro de eliminar este empleado?")) return;
    try {
      await api.delete(`/api/empleados/${id}`);
      setEmpleados(empleados.filter((e) => e.id !== id));
      setMessage({ type: "success", text: "Empleado eliminado con éxito" });
    } catch (error) {
      setMessage({ type: "error", text: "Error al eliminar empleado" });
    }
  };

  //Crea un nuevo empleado o actualiza uno existente
  const handleCreate = async (data) => {
    try {
      if (editingItem) {
        // Modo edición: actualizar empleado existente
        const response = await api.put(
          `/api/empleados/${editingItem.id}`,
          data
        );
        setEmpleados(
          empleados.map((e) => (e.id === editingItem.id ? response.data : e))
        );
        setMessage({ type: "success", text: "Empleado actualizado con éxito" });
      } else {
        // Modo creación: agregar nuevo empleado
        const response = await api.post("/api/empleados", data);
        setEmpleados([...empleados, response.data]);
        setMessage({ type: "success", text: "Empleado agregado con éxito" });
      }
      setShowForm(false);
      setEditingItem(null);
    } catch (error) {
      setMessage({
        type: "error",
        text: editingItem
          ? "Error al actualizar empleado"
          : "Error al agregar empleado",
      });
    }
  };

  // Prepara el formulario para editar un empleado
  const handleEdit = (item) => {
    setEditingItem(item);
    setShowForm(true);
  };

  // Titulos de columnas para la tabla
  const headers = [
    { key: "id", label: "ID" },
    { key: "nombre", label: "Nombre" },
    { key: "email", label: "Email" },
    { key: "rol", label: "Rol" },
  ];
  // Campos para el formulario
  const formFields = [
    { name: "nombre", label: "Nombre", required: true },
    { name: "email", label: "Email", type: "email", required: true },
    {
      name: "rol",
      label: "Rol",
      type: "select",
      required: true,
      options: [
        { value: "admin", label: "Admin" },
        { value: "encargado", label: "Encargado" },
        { value: "empleado", label: "Empleado" },
      ],
    },
  ];

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center my-6">
        <h1 className="text-2xl font-bold text-emerald-800">
          Gestión de Empleados
        </h1>
        <Button
          onClick={() => {
            setShowForm(!showForm);
            setEditingItem(null);
          }}
          variant="primary"
        >
          {showForm ? "Cancelar" : "Agregar Empleado"}
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
              {editingItem ? "Editar Empleado" : "Nuevo Empleado"}
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
        <Card>
          <Table
            headers={headers}
            data={empleados}
            onDelete={handleDelete}
            onEdit={handleEdit}
          />
        </Card>
      )}
    </div>
  );
};

export default Empleados;
