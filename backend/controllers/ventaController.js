/**
 * Controlador de ventas
 */

import Venta from "../models/Venta.js";
import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/AppError.js";

/**
 * Obtiene todas las ventas con información de clientes y empleados
 */
const getVentas = catchAsync(async (req, res, next) => {
  const ventas = await Venta.findAll();
  res.status(200).json(ventas);
});

/**
 * Obtiene una venta específica con todos sus productos
 */
const getVentaById = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const venta = await Venta.findById(id);
  if (!venta) {
    return next(new AppError("Venta no encontrada", 404));
  }
  res.status(200).json(venta);
});

/**
 * Crea una nueva venta
 */
const createVenta = catchAsync(async (req, res, next) => {
  const { cliente_id, productos } = req.body;
  // El empleado que hace la venta se obtiene del token JWT
  const empleado_id = req.user.id;
  // Calcular total
  const total = productos.reduce(
    (sum, p) => sum + (p.cantidad * p.precio_unitario),
    0
  );
  // Crear venta con transacción (y actualizacion de stock)
  const venta = await Venta.create(
    { cliente_id, empleado_id, total },
    productos
  );
  res.status(200).json(venta);
});

/**
 * Elimina una venta (soft delete)
 * Marca la venta y sus productos como eliminados
 * TODO: Restaurar stock de productos vendidos
 */
const deleteVenta = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const affectedRows = await Venta.softDelete(id);
  if (affectedRows === 0) {
    return next(new AppError('Venta no encontrada', 404));
  }
  res.status(200).json({ message: "Venta eliminada" });
});

export { getVentas, getVentaById, createVenta, deleteVenta };
