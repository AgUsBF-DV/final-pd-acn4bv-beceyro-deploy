/**
 * Manejo de archivos JSON: leer y escribir
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

// Obtener __dirname en ES6 modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Lee datos desde un archivo JSON
 * Retorna un array con los datos o vacío
 */
const readData = (fileName) => {
  const filePath = path.join(__dirname, "../data", fileName);
  if (!fs.existsSync(filePath)) {
    return [];
  }
  const data = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(data);
};

/**
 * Escribe datos en un archivo JSON
 */
const writeData = (fileName, data) => {
  const filePath = path.join(__dirname, "../data", fileName);
  // Formatear JSON con indentación de 2 espacios
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
};

export { readData, writeData };
