/**
 * Componente Table reutilizable con paginación
 */

import { useState, useContext } from "react";
import { UserContext } from "../context/UserContext";
import Button from "./Button";

const Table = ({
  headers, // Array de objetos con {key, label} para definir columnas
  data, // Array de objetos con los datos a mostrar
  onDelete, // Función opcional para eliminar un elemento
  onEdit, // Función opcional para editar un elemento
  onView, // Función opcional para ver detalles de un elemento
}) => {
  // Obtener usuario del contexto para verificar permisos
  const { user } = useContext(UserContext);
  const isAdmin = user?.rol === "admin";

  // Estado para controlar la página actual
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  // Si no hay datos, mostrar mensaje
  if (!data || data.length === 0) {
    return (
      <p className="text-gray-500 text-center py-4">
        No hay datos para mostrar.
      </p>
    );
  }
  // Config del paginador
  // Calcular datos paginados
  const totalPages = Math.ceil(data.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = data.slice(startIndex, endIndex);
  // Navegar a una página específica
  const goToPage = (page) => {
    setCurrentPage(page);
  };
  // Ir a la página anterior
  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };
  // Ir a la página siguiente
  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };
  return (
    <div className="space-y-4">
      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="min-w-full bg-white">
          {/* Titulos de columnas */}
          <thead className="bg-emerald-800">
            <tr>
              {headers.map((header) => (
                <th
                  key={header.key}
                  className="py-3 px-4 text-left text-white font-semibold uppercase text-sm border-b"
                >
                  {header.label}
                </th>
              ))}
              {/* Si hay acciones crear columna para botonera */}
              {(onDelete || onEdit || onView) && (
                <th className="py-3 px-4 text-center text-white font-semibold uppercase text-sm border-b">
                  Acciones
                </th>
              )}
            </tr>
          </thead>
          {/* Contenido */}
          <tbody className="divide-y divide-gray-200">
            {paginatedData.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                {headers.map((header) => (
                  <td
                    key={`${item.id}-${header.key}`}
                    className="py-3 px-4 text-emerald-800"
                  >
                    {item[header.key]}
                  </td>
                ))}
                {(onDelete || onEdit || onView) && (
                  <td className="py-3 px-4 text-center space-x-2">
                    {onView && (
                      <Button
                        variant="primary"
                        onClick={() => onView(item)}
                        className="text-sm px-3 py-1"
                      >
                        Ver
                      </Button>
                    )}
                    {onEdit && (
                      <Button
                        variant="secondary"
                        onClick={() => onEdit(item)}
                        className="text-sm px-3 py-1"
                      >
                        Editar
                      </Button>
                    )}
                    {onDelete && isAdmin && (
                      <Button
                        variant="danger"
                        onClick={() => onDelete(item.id)}
                        className="text-sm px-3 py-1"
                      >
                        Eliminar
                      </Button>
                    )}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Controles de paginación (solo si hay más de una página) */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-4 py-3 bg-white rounded-lg border border-gray-200">
          <div className="text-sm text-gray-700">
            Mostrando <span className="font-medium">{startIndex + 1}</span> a{" "}
            <span className="font-medium">
              {Math.min(endIndex, data.length)}
            </span>{" "}
            de <span className="font-medium">{data.length}</span> resultados
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={goToPreviousPage}
              disabled={currentPage === 1}
              className="px-3 py-1 rounded-md bg-emerald-800 text-white disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-emerald-700 transition-colors"
            >
              &lt;
            </button>
            <div className="flex gap-1">
              {[...Array(totalPages)].map((_, index) => {
                const page = index + 1;
                return (
                  <button
                    key={page}
                    onClick={() => goToPage(page)}
                    className={`px-3 py-1 rounded-md transition-colors ${
                      currentPage === page
                        ? "bg-emerald-800 text-white"
                        : "bg-gray-100 text-emerald-800 hover:bg-gray-200"
                    }`}
                  >
                    {page}
                  </button>
                );
              })}
            </div>
            <button
              onClick={goToNextPage}
              disabled={currentPage === totalPages}
              className="px-3 py-1 rounded-md bg-emerald-800 text-white disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-emerald-700 transition-colors"
            >
              &gt;
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Table;
