/**
 * Página de inicio de sesión
 * Al autenticarse, redirige al home
 */

import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import api from "../services/api";
import Form from "../components/Form";
import Card from "../components/Card";

const Login = () => {
  const [error, setError] = useState("");
  const { login } = useContext(UserContext);
  const navigate = useNavigate();

  // Manejar el proceso de autenticación
  const handleLogin = async (formData) => {
    try {
      const response = await api.post("/auth/login", formData);
      // Guardar usuario y token en contexto y localStorage
      login(response.data.user, response.data.token);
      // Redirigir a la página principal
      navigate("/");
    } catch (err) {
      setError("Credenciales inválidas.");
    }
  };

  // Definición de campos del formulario de login
  const fields = [
    {
      name: "email",
      label: "Email",
      type: "email",
      required: true,
      placeholder: "admin@dv.com",
    },
    {
      name: "password",
      label: "Contraseña",
      type: "password",
      required: true,
      placeholder: "******",
    },
  ];

  return (
    <div className="grow flex items-center justify-center p-6">
      <Card className="text-center py-10 bg-white rounded-lg shadow-lg max-w-md w-full">
        <h1 className="text-3xl font-bold text-emerald-800 mb-4">
          Iniciar Sesión
        </h1>

        {/* Mostrar mensaje de error si las credenciales son inválidas */}
        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded mb-4 flex items-center justify-between">
            <span>{error}</span>
            <button
              onClick={() => setError("")}
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
        )}

        <Form fields={fields} onSubmit={handleLogin} buttonLabel="Ingresar" />
      </Card>
    </div>
  );
};

export default Login;
