/**
 * Página 404 - No encontrado
 */

import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <main className="flex-1 p-8">
      <div className="max-w-2xl mx-auto text-center">
        <h1 className="text-6xl font-bold text-green-800 mb-4">404</h1>
        <h2 className="text-3xl font-semibold text-gray-700 mb-4">
          No se encontró la página
        </h2>
        <Link
          to="/"
          className="inline-block bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
        >
          Volver al inicio
        </Link>
      </div>
    </main>
  );
}
