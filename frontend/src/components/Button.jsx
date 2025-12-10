/**
 * Componente Button reutilizable
 */

const Button = ({
  children, // Contenido del botón (texto o elementos)
  onClick,
  type = "button",
  variant = "primary",
  className = "",
}) => {
  // Estilos base compartidos por todas las variantes
  const baseStyles =
    "px-4 py-2 rounded font-semibold transition-colors duration-200";
  // Definición de variantes de color
  const variants = {
    primary: "bg-green-600 text-white hover:bg-green-700",
    danger: "bg-red-500 text-white hover:bg-red-600",
    secondary: "bg-blue-500 text-white hover:bg-blue-600",
  };
  return (
    <button
      type={type}
      onClick={onClick}
      className={`${baseStyles} ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;
