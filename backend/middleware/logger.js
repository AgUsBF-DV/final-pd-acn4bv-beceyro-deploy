/**
 * Middleware de logging
 * Imprime en consola los request que llegan al backend
 */

const logger = (req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
};

export { logger };
