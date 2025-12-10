/**
 * Componente de formulario dinámico reutilizable
 * Soporta inputs de texto, select, textarea y archivos
 */

import { useState } from "react";
import Button from "./Button";

const Form = ({
  fields, // Array de objetos que definen los campos del formulario
  initialValues = {}, // Valores iniciales para edición
  onSubmit,
  buttonLabel = "Guardar",
}) => {
  // Estado local para los datos del formulario
  const [formData, setFormData] = useState(initialValues);
  // Estado separado para imágenes/archivos
  const [files, setFiles] = useState({});
  // Maneja cambios en inputs de texto, select y textarea
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  // Maneja cambios en inputs de tipo file
  const handleFileChange = (e) => {
    const { name, files: fileList } = e.target;
    if (fileList.length > 0) {
      setFiles((prev) => ({ ...prev, [name]: fileList[0] }));
    }
  };
  // Envía el formulario al handler
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData, files);
  };
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Renderizar cada campo según su tipo */}
      {fields.map((field) => (
        <div key={field.name} className="flex flex-col">
          <label className="text-gray-700 font-medium mb-1 text-left">
            {field.label}
          </label>
          {/* Evaluar y configurar tipo de campo */}
          {field.type === "select" ? (
            <select
              name={field.name}
              value={formData[field.name] || ""}
              onChange={handleChange}
              className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              required={field.required}
            >
              <option value="">Seleccionar...</option>
              {field.options?.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          ) : field.type === "textarea" ? (
            <textarea
              name={field.name}
              value={formData[field.name] || ""}
              onChange={handleChange}
              placeholder={field.placeholder}
              rows={4}
              className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 resize-vertical"
              required={field.required}
            />
          ) : field.type === "file" ? (
            <input
              type="file"
              name={field.name}
              onChange={handleFileChange}
              accept={field.accept}
              className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              required={field.required}
            />
          ) : (
            <input
              type={field.type || "text"}
              name={field.name}
              value={formData[field.name] || ""}
              onChange={handleChange}
              placeholder={field.placeholder}
              className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              required={field.required}
            />
          )}
        </div>
      ))}
      <Button type="submit" variant="primary" className="w-full">
        {buttonLabel}
      </Button>
    </form>
  );
};

export default Form;
