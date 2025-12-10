# 🌿 Vivero Da Vinci - Sistema de Gestión Web

## 💡 Motivación

Este desarrollo es un proyecto académico dentro de la materia Plataformas de Desarrollo de la carrera Analista de Sistemas de la Escuela Da Vinci.

## 🎯 Objetivo

Desarrollar una aplicación web para gestionar las operaciones de un vivero, incluyendo control de inventario, gestión de ventas, administración de clientes y empleados.

## 📋 Descripción

Esta versión representa una evolución significativa sobre el [primer prototipo](https://github.com/AgUsBF-DV/parcial-1-pd-acn4bv-beceyro) y [segundo prototipo](https://github.com/AgUsBF-DV/parcial-2-pd-acn4bv-beceyro), migrando de Vanilla JavaScript a un stack profesional con React y Node.js, implementando autenticación JWT, base de datos relacional MySQL con Knex.js, y una arquitectura escalable y mantenible.

Para más detalles técnicos, consulta la [documentación](./docs/informe.md).

### Estado del proyecto

- Sistema de login/logout
- Autenticación con JWT
- Persistencia de sesión con localStorage
- Rutas protegidas en frontend
- CRUD de empleados, clientes, categorias, productos y ventas
- Validación de datos en backend con _middleware_
- Uso de _middleware_ para manejo de errores
- BBDD con mySQL
- Log en consola de peticiones HTTP
- Formularios dinámicos con validación
- Componentes reutilizables para la homogeneidad del proyecto
- Otras funcionalidades: filtros, camops de búsqueda, carga de imágenes y paginación

## 🛠️ Tecnologías

### Backend

- **Node.js** (v22.14.0) - Runtime de JavaScript
- **Express** (v5.1.0) - Framework web
- **MySQL2** (v3.15.3) - Cliente MySQL para Node.js
- **Knex.js** (v3.1.0) - Query builder
- **JWT** (v9.0.2) - Autenticación basada en tokens
- **bcrypt** (v5.1.1) - Hashing de contraseñas
- **Multer** (v2.0.2) - Middleware para carga de archivos multipart/form-data
- **CORS** (v2.8.5) - Middleware para permitir peticiones cross-origin
- **dotenv** (v17.2.3) - Gestión de variables de entorno
- **Nodemon** (v3.1.11) - Auto-reinicio en desarrollo
- Sistema de módulos **ES6 Modules**

### Frontend

- **React** (v19.2.0) - Construcción de interfaces
- **React Router DOM** (v7.9.6) - Navegación
- **Tailwind CSS** (v4.1.17) - Framework de utilidades CSS
- **Axios** (v1.13.2) - Cliente HTTP basado en promesas
- **Vite** (v7.2.4) - Build tool y dev server
- **PostCSS** (v8.5.6) - Procesador de CSS
- **ESLint** (v9.39.1) - Linter de JavaScript/React

### Base de Datos

- **MySQL** - Sistema de gestión de base de datos relacional
- Estructura normalizada con 6 tablas
- Foreign keys para integridad referencial
- Timestamps automáticos (created_at, updated_at)
- Soft deletes (deleted_at) en todas las tablas

## 📦 Instalación

Para probar el proyecto ver las secciones _Instalación_ e _Inicialización de la App_ del [informe](./docs/informe.md).

## 📄 Licencia

Este proyecto es parte del trabajo académico de la Escuela Da Vinci y se comparte bajo GNU-GPL V3.
