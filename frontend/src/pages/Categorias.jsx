/**
 * Página de gestión de categorias
 */

import { useState, useEffect } from "react";
import api from "../services/api";
import Table from "../components/Table";
import Form from "../components/Form";
import Button from "../components/Button";
import Card from "../components/Card";

const Categorias = () => {
  const [categorias, setCategorias] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [message, setMessage] = useState(null);
  // Cargar categorias al montar el componente
  useEffect(() => {
    fetchCategorias();
  }, []);

  // Obtener todas las categorias desde la API
  const fetchCategorias = async () => {
    try {
      const response = await api.get("/api/categorias");
      setCategorias(response.data);
    } catch (error) {
      console.error("Error fetching categorias", error);
    }
  };

  // Elimina una categoría (soft delete)
  const handleDelete = async (id) => {
    if (!window.confirm("¿Estás seguro de eliminar esta categoría?")) return;
    try {
      await api.delete(`/api/categorias/${id}`);
      setCategorias(categorias.filter((c) => c.id !== id));
      setMessage({ type: "success", text: "Categoría eliminada con éxito" });
    } catch (error) {
      setMessage({ type: "error", text: "Error al eliminar categoría" });
    }
  };

  //Crea una nueva categoría o actualiza una existente
  const handleCreate = async (data) => {
    try {
      if (editingItem) {
        // Modo edición: actualizar categoría existente
        const response = await api.put(
          `/api/categorias/${editingItem.id}`,
          data
        );
        setCategorias(
          categorias.map((c) => (c.id === editingItem.id ? response.data : c))
        );
        setMessage({
          type: "success",
          text: "Categoría actualizada con éxito",
        });
      } else {
        // Modo creación: agregar nueva categoría
        const response = await api.post("/api/categorias", data);
        setCategorias([...categorias, response.data]);
        setMessage({ type: "success", text: "Categoría agregada con éxito" });
      }
      setShowForm(false);
      setEditingItem(null);
    } catch (error) {
      setMessage({
        type: "error",
        text: editingItem
          ? "Error al actualizar categoría"
          : "Error al agregar categoría",
      });
    }
  };

  // Prepara el formulario para editar una categoría
  const handleEdit = (item) => {
    setEditingItem(item);
    setShowForm(true);
  };

  // Titulos de columnas para la tabla
  const headers = [
    { key: "id", label: "ID" },
    { key: "nombre", label: "Nombre" },
    { key: "descripcion", label: "Descripción" },
  ];
  // Campos para el formulario
  const formFields = [
    { name: "nombre", label: "Nombre", required: true },
    { name: "descripcion", label: "Descripción", type: "textarea" },
  ];

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center my-6">
        <h1 className="text-2xl font-bold text-emerald-800">
          Gestión de Categorías
        </h1>
        <Button
          onClick={() => {
            setShowForm(!showForm);
            setEditingItem(null);
          }}
          variant="primary"
        >
          {showForm ? "Cancelar" : "Agregar Categoría"}
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
              {editingItem ? "Editar Categoría" : "Nueva Categoría"}
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
            data={categorias}
            onDelete={handleDelete}
            onEdit={handleEdit}
          />
        </Card>
      )}
    </div>
  );
};

export default Categorias;
