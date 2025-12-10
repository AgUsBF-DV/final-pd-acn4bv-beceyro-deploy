/**
 * Componente Card reutilizable
 */

const Card = ({ children, className = "" }) => {
  return <div className={`rounded-lg p-6 ${className}`}>{children}</div>;
};

export default Card;
