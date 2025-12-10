/**
 * Middleware de manejo de errores
 */

const errorHandler = (err, req, res, next) => {
    // Log del error en consola para debugging
    console.error(`[${new Date().toLocaleString()}] Error:`, err.message);
    // Establecer código de estado por defecto
    let statusCode = err.statusCode || 500;
    let message = err.message || 'Error en el servidor';
    // Manejo de errores de base de datos (MySQL/Knex)
    if (err.code && err.code.startsWith('ER_')) {
        statusCode = 400;
        message = 'Error en la base de datos';
    }
    // Manejo de errores de JWT (autenticación)
    if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
        statusCode = 401;
        message = 'Token inválido o expirado. Por favor inicie sesión nuevamente';
    }
    // Enviar respuesta al cliente
    res.status(statusCode).json({
        success: false,
        message: message
    });
};

export default errorHandler;
