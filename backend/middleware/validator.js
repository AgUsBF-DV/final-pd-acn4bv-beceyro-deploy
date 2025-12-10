/**
 * Middleware de validación
 * Comprueba los datos recibidos antes de pasarlo al controlador
 */

import AppError from "../utils/AppError.js";

/**
 * Valida campos de producto
 */
const validateProducto = (req, res, next) => {
  const { nombre, precio, stock } = req.body;
  console.log("Validando producto:", { nombre, precio, stock });
  // Verificar que existan nombre y precio
  if (!nombre || precio === undefined || precio === null) {
    console.log("Validación fallida: campos requeridos faltantes");
    return next(new AppError("El producto debe tener nombre y precio", 400));
  }
  // Validar que el precio sea mayor o igual a 0
  if (precio < 0) {
    console.log("Validación fallida: precio negativo");
    return next(new AppError("El precio debe ser mayor o igual a 0", 400));
  }
  // Validar que el stock sea mayor o igual a 0 si se proporciona
  if (stock !== undefined && stock !== null && stock < 0) {
    console.log("Validación fallida: stock negativo");
    return next(new AppError("El stock debe ser mayor o igual a 0", 400));
  }
  next();
};

/**
 * Valida campos de empleado
 */
const validateEmpleado = (req, res, next) => {
  const { nombre, email, rol } = req.body;
  console.log("Validando empleado:", { nombre, email, rol });
  // Verificar que existan nombre, email y rol
  if (!nombre || !email || !rol) {
    return next(new AppError("El empleado debe tener nombre, email y rol", 400));
  }
  next();
};

/**
 * Valida campos de categoría
 */
const validateCategoria = (req, res, next) => {
  const { nombre } = req.body;
  console.log("Validando categoría:", { nombre });
  // Verificar que exista el nombre
  if (!nombre) {
    console.log("Validación fallida: nombre requerido");
    return next(new AppError("La categoría debe tener un nombre", 400));
  }
  next();
};

/**
 * Valida campos de cliente
 */
const validateCliente = (req, res, next) => {
  const { nombre, email } = req.body;
  console.log("Validando cliente:", { nombre, email });
  // Verificar que existan nombre y email
  if (!nombre || !email) {
    console.log("Validación fallida: campos requeridos faltantes");
    return next(new AppError("El cliente debe tener nombre y email", 400));
  }
  next();
};

/**
 * Valida campos de venta
 */
const validateVenta = (req, res, next) => {
  const { cliente_id, productos } = req.body;
  console.log("Validando venta:", { cliente_id, productos });
  // Verificar que exista cliente_id
  if (!cliente_id) {
    console.log("Validación fallida: cliente_id requerido");
    return next(new AppError("La venta debe tener un cliente asociado", 400));
  }
  // Verificar que existan productos
  if (!productos || !Array.isArray(productos) || productos.length === 0) {
    console.log("Validación fallida: productos requeridos");
    return next(new AppError("La venta debe tener al menos un producto", 400));
  }
  // Validar estructura de cada producto
  for (const producto of productos) {
    // Verificar que tenga producto_id, cantidad y precio_unitario
    if (!producto.producto_id || !producto.cantidad || !producto.precio_unitario) {
      console.log("Validación fallida: producto incompleto");
      return next(new AppError("Cada producto debe tener producto_id, cantidad y precio_unitario", 400));
    }
    // Validar cantidad
    if (producto.cantidad <= 0) {
      console.log("Validación fallida: cantidad inválida");
      return next(new AppError("La cantidad debe ser mayor a 0", 400));
    }
    // Validar precio_unitario
    if (producto.precio_unitario < 0) {
      console.log("Validación fallida: precio_unitario inválido");
      return next(new AppError("El precio unitario debe ser mayor o igual a 0", 400));
    }
  }
  next();
};

export { validateProducto, validateEmpleado, validateCategoria, validateCliente, validateVenta };
