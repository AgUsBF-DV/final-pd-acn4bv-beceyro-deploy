/**
 * Modelo de Empleado
 */

import bcrypt from "bcrypt";
import { db } from "../utils/database.js";

class Empleado {
    /**
     * Obtiene todos los empleados sin eliminar (sin password)
     */
    static async findAll() {
        return await db('empleado')
            .select('id', 'nombre', 'email', 'rol', 'creado_en', 'actualizado_en')
            .whereNull('eliminado_en');
    }

    /**
     * Obtiene un empleado por ID (sin password)
     */
    static async findById(id) {
        return await db('empleado')
            .select('id', 'nombre', 'email', 'rol', 'creado_en', 'actualizado_en')
            .where('id', id)
            .whereNull('eliminado_en')
            .first();
    }

    /**
     * Obtiene un empleado por email (con password para autenticación)
     */
    static async findByEmail(email) {
        return await db('empleado')
            .select('id', 'nombre', 'email', 'password', 'rol', 'creado_en', 'actualizado_en')
            .where('email', email)
            .whereNull('eliminado_en')
            .first();
    }

    /**
     * Crea un nuevo empleado con password hasheado
     */
    static async create(data) {
        const { nombre, email, rol = 'empleado', password = '123456' } = data;
        const hashedPassword = await bcrypt.hash(password, 10);
        const [insertId] = await db('empleado').insert({
            nombre,
            email,
            password: hashedPassword,
            rol
        });
        // Retornar el producto completo recién creado
        return this.findById(insertId);
    }

    /**
     * Elimina un empleado (soft delete)
     */
    static async softDelete(id) {
        return await db('empleado')
            .where('id', id)
            .whereNull('eliminado_en')
            .update({ eliminado_en: db.fn.now() });
    }

    /**
     * Actualiza un empleado existente
     */
    static async update(id, data) {
        const { nombre, email, rol, password } = data;
        const updates = {};
        // Construir objeto solo con los campos proporcionados
        if (nombre) updates.nombre = nombre;
        if (email) updates.email = email;
        if (rol) updates.rol = rol;
        if (password) {
            const hashedPassword = await bcrypt.hash(password, 10);
            updates.password = hashedPassword;
        }
        // Si no hay campos para actualizar, retornar null
        if (Object.keys(updates).length === 0) {
            return null;
        }
        // Actualizar el producto
        await db('empleado')
            .where('id', id)
            .update(updates);
        // Retornar el producto actualizado
        return this.findById(id);
    }

    /**
     * Verifica la contraseña de un empleado
     */
    static async verifyPassword(plainPassword, hashedPassword) {
        return await bcrypt.compare(plainPassword, hashedPassword);
    }
}

export default Empleado;
