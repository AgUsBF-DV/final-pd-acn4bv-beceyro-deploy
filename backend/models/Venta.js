/**
 * Modelo de Venta
 */

import { db } from "../utils/database.js";

class Venta {
    /**
     * Obtiene todas las ventas activas con información de cliente y empleado
     * Usa left join para incluir datos relacionados
     */
    static async findAll() {
        return await db('venta')
            .select(
                'venta.id',
                'venta.cliente_id',
                'venta.empleado_id',
                'venta.total',
                'venta.creado_en',
                'venta.actualizado_en',
                // Incluir nombre y email del cliente
                'cliente.nombre as cliente_nombre',
                'cliente.email as cliente_email',
                // Incluir nombre y email del empleado que hizo la venta
                'empleado.nombre as empleado_nombre',
                'empleado.email as empleado_email'
            )
            .leftJoin('cliente', 'venta.cliente_id', 'cliente.id')
            .leftJoin('empleado', 'venta.empleado_id', 'empleado.id')
            .whereNull('venta.eliminado_en')
            .orderBy('venta.id', 'desc'); // Más recientes primero
    }

    /**
     * Obtiene una venta específica por ID con todos sus productos
     * Realiza dos queries: una para la venta y otra para sus productos
     */
    static async findById(id) {
        // Obtener datos principales de la venta
        const venta = await db('venta')
            .select(
                'venta.id',
                'venta.cliente_id',
                'venta.empleado_id',
                'venta.total',
                'venta.creado_en',
                'venta.actualizado_en',
                'cliente.nombre as cliente_nombre',
                'cliente.email as cliente_email',
                'empleado.nombre as empleado_nombre',
                'empleado.email as empleado_email'
            )
            .leftJoin('cliente', 'venta.cliente_id', 'cliente.id')
            .leftJoin('empleado', 'venta.empleado_id', 'empleado.id')
            .where('venta.id', id)
            .whereNull('venta.eliminado_en')
            .first();
        // Si no se encuentra la venta, retornar null
        if (!venta) {
            return null;
        }
        // Obtener productos asociados a esta venta
        const productos = await db('venta_producto')
            .select(
                'venta_producto.id',
                'venta_producto.producto_id',
                'venta_producto.cantidad',
                'venta_producto.precio_unitario',
                'producto.nombre as producto_nombre',
                'producto.descripcion as producto_descripcion'
            )
            .leftJoin('producto', 'venta_producto.producto_id', 'producto.id')
            .where('venta_producto.venta_id', id)
            .whereNull('venta_producto.eliminado_en');
        // Combinar venta con sus productos
        return {
            ...venta,
            productos
        };
    }

    /**
     * Crea una nueva venta con sus productos
     * Usa transacción para garantizar consistencia:
     * - Si algo falla, se revierte todo (rollback automático)
     * - Actualiza stock de productos automáticamente
     */
    static async create(ventaData, productos) {
        return await db.transaction(async (trx) => {
            // Insertar registro de venta
            const [ventaId] = await trx('venta').insert({
                cliente_id: ventaData.cliente_id,
                empleado_id: ventaData.empleado_id,
                total: ventaData.total
            });
            // Detalles de productos para inserción masiva
            const detalles = productos.map(p => ({
                venta_id: ventaId,
                producto_id: p.producto_id,
                cantidad: p.cantidad,
                precio_unitario: p.precio_unitario
            }));
            // Insertar relación venta-productos
            await trx('venta_producto').insert(detalles);
            // Actualizar stock de cada producto vendido
            for (const p of productos) {
                await trx('producto')
                    .where('id', p.producto_id)
                    .decrement('stock', p.cantidad); // Restar cantidad vendida
            }
            // Retornar venta completa con productos
            return this.findById(ventaId);
        });
    }

    /**
     * Elimina una venta (soft delete)
     * NOTA: No restaura el stock de productos
     */
    static async softDelete(id) {
        return await db.transaction(async (trx) => {
            // Marcar venta como eliminada
            const affectedRows = await trx('venta')
                .where('id', id)
                .whereNull('eliminado_en')
                .update({ eliminado_en: db.fn.now() });
            // Eliminar también sus productos
            if (affectedRows > 0) {
                await trx('venta_producto')
                    .where('venta_id', id)
                    .whereNull('eliminado_en')
                    .update({ eliminado_en: db.fn.now() });
            }
            return affectedRows;
        });
    }
}

export default Venta;
