-- Datos de prueba para Vivero Da Vinci

-- Tabla de Empleados
-- Password para todos los empleados: "1234" (hashed con bcrypt)
INSERT INTO empleado (nombre, email, password, rol) VALUES
('Administrador', 'admin@dv.com', '$2b$10$Oxl25fe8mURZxpZHKpKaKuWenrovlFnppBLMGtiPh7yD/iUlk3QL6', 'admin'),
('Charly Garcia', 'charly@dv.com', '$2b$10$Oxl25fe8mURZxpZHKpKaKuWenrovlFnppBLMGtiPh7yD/iUlk3QL6', 'encargado'),
('Fito Paez', 'fito@dv.com', '$2b$10$Oxl25fe8mURZxpZHKpKaKuWenrovlFnppBLMGtiPh7yD/iUlk3QL6', 'empleado'),
('Gustavo Cerati', 'gustavo@dv.com', '$2b$10$Oxl25fe8mURZxpZHKpKaKuWenrovlFnppBLMGtiPh7yD/iUlk3QL6', 'empleado'),
('Andres Calamaro', 'andres@dv.com', '$2b$10$Oxl25fe8mURZxpZHKpKaKuWenrovlFnppBLMGtiPh7yD/iUlk3QL6', 'empleado');

-- Tabla de Clientes
INSERT INTO cliente (nombre, email) VALUES
('Juan Pérez', 'juan@example.com'),
('María Gómez', 'maria@example.com'),
('Carlos López', 'carlos@example.com'),
('Ana Torres', 'ana@example.com'),
('Luis Ramírez', 'luis@example.com'),
('Sofía Martínez', 'sofia@example.com'),
('Pablo González', 'pablo@example.com'),
('Lucía Fernández', 'lucia@example.com'),
('Diego Castro', 'diego@example.com'),
('Laura Ibáñez', 'laura@example.com');

-- Tabla de Categorías
INSERT INTO categoria (nombre, descripcion) VALUES
('Plantas de Interior', 'Plantas aptas para interiores'),
('Plantas de Exterior', 'Plantas resistentes para exterior'),
('Herramientas', 'Herramientas de jardinería'),
('Fertilizantes', 'Fertilizantes y sustratos'),
('Pesticidas', 'Control de plagas y pesticidas');

-- Tabla de Productos
-- Categoría 1: Plantas de Interior
INSERT INTO producto (nombre, descripcion, precio, stock, categoria_id) VALUES
('Pothos', 'Planta colgante resistente', 3500, 20, 1),
('Ficus', 'Planta decorativa de interior', 7200, 15, 1),
('Calathea', 'Planta de hojas anchas', 5400, 18, 1),
('Monstera', 'Planta con hojas perforadas', 8500, 10, 1),
('Helecho Boston', 'Helecho clásico de interior', 3000, 25, 1);
-- Categoría 2: Plantas de Exterior
INSERT INTO producto (nombre, descripcion, precio, stock, categoria_id) VALUES
('Lavanda', 'Aromática para exterior', 2500, 30, 2),
('Rosa', 'Rosal clásico', 4000, 20, 2),
('Cactus', 'Variedades resistentes al sol', 2800, 40, 2),
('Jazmín', 'Planta trepadora aromática', 4500, 12, 2),
('Suculenta', 'Pequeña suculenta', 1800, 50, 2);
-- Categoría 3: Herramientas
INSERT INTO producto (nombre, descripcion, precio, stock, categoria_id) VALUES
('Pala Chica', 'Pala metálica para macetas', 1500, 35, 3),
('Tijera de Podar', 'Tijeras de acero inoxidable', 4200, 20, 3),
('Rastrillo', 'Rastrillo pequeño', 2200, 18, 3),
('Regadera 5L', 'Regadera resistente', 3800, 12, 3),
('Guantes Jardín', 'Guantes reforzados', 1600, 40, 3);
-- Categoría 4: Fertilizantes
INSERT INTO producto (nombre, descripcion, precio, stock, categoria_id) VALUES
('Fertilizante Universal', 'Fertilizante líquido multipropósito', 3200, 25, 4),
('Humus de Lombriz', 'Sustrato natural', 2800, 30, 4),
('Abono Granulado', 'Abono lento liberación', 3500, 15, 4),
('Sustrato Premium', 'Sustrato profesional', 4500, 20, 4),
('Fertilizante Orgánico', 'Fertilizante ecológico', 3000, 22, 4);
-- Categoría 5: Pesticidas
INSERT INTO producto (nombre, descripcion, precio, stock, categoria_id) VALUES
('Insecticida Natural', 'A base de aceite de neem', 2700, 18, 5),
('Fungicida', 'Control de hongos', 3800, 12, 5),
('Antiplagas Total', 'Control total de insectos', 4200, 10, 5),
('Acaricida', 'Control de ácaros', 3100, 16, 5),
('Control Hormigas', 'Granulado para hormigas', 2900, 20, 5);

-- Tabla de Ventas y Productos en la venta
-- Venta 1
INSERT INTO venta (cliente_id, empleado_id, total) VALUES (1, 3, 12100);
INSERT INTO venta_producto (venta_id, producto_id, cantidad, precio_unitario) VALUES
(1, 1, 2, 3500),
(1, 6, 1, 2500),
(1, 15, 1, 1600);
-- Venta 2
INSERT INTO venta (cliente_id, empleado_id, total) VALUES (2, 2, 9900);
INSERT INTO venta_producto (venta_id, producto_id, cantidad, precio_unitario) VALUES
(2, 11, 1, 1500),
(2, 12, 1, 4200),
(2, 23, 1, 4200);
-- Venta 3
INSERT INTO venta (cliente_id, empleado_id, total) VALUES (3, 1, 19400);
INSERT INTO venta_producto (venta_id, producto_id, cantidad, precio_unitario) VALUES
(3, 4, 1, 8500),
(3, 7, 2, 4000),
(3, 25, 1, 2900);
-- Venta 4
INSERT INTO venta (cliente_id, empleado_id, total) VALUES (4, 4, 13800);
INSERT INTO venta_producto (venta_id, producto_id, cantidad, precio_unitario)VALUES
(4, 8, 1, 2800),
(4, 14, 1, 3800),
(4, 2, 1, 7200);
-- Venta 5
INSERT INTO venta (cliente_id, empleado_id, total) VALUES (5, 5, 14400);
INSERT INTO venta_producto (venta_id, producto_id, cantidad, precio_unitario) VALUES
(5, 3, 1, 5400),
(5, 9, 2, 4500);
-- Venta 6
INSERT INTO venta (cliente_id, empleado_id, total) VALUES (6, 3, 8900);
INSERT INTO venta_producto (venta_id, producto_id, cantidad, precio_unitario) VALUES
(6, 10, 3, 1800),
(6, 18, 1, 3500);
-- Venta 7
INSERT INTO venta (cliente_id, empleado_id, total) VALUES (7, 2, 9100);
INSERT INTO venta_producto (venta_id, producto_id, cantidad, precio_unitario) VALUES
(7, 16, 2, 3200),
(7, 21, 1, 2700);
-- Venta 8
INSERT INTO venta (cliente_id, empleado_id, total) VALUES (8, 4, 11300);
INSERT INTO venta_producto (venta_id, producto_id, cantidad, precio_unitario) VALUES
(8, 5, 2, 3000),
(8, 13, 1, 2200),
(8, 24, 1, 3100);
-- Venta 9
INSERT INTO venta (cliente_id, empleado_id, total) VALUES (9, 5, 11300);
INSERT INTO venta_producto (venta_id, producto_id, cantidad, precio_unitario) VALUES
(9, 19, 1, 4500),
(9, 20, 1, 3000),
(9, 22, 1, 3800);
-- Venta 10
INSERT INTO venta (cliente_id, empleado_id, total) VALUES (10, 1, 8600);
INSERT INTO venta_producto (venta_id, producto_id, cantidad, precio_unitario) VALUES
(10, 17, 1, 2800),
(10, 25, 2, 2900);
