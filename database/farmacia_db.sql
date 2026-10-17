-- ============================================================
-- Sistema de Gestión para Farmacia
-- Crea la base de datos, las tablas y carga los datos iniciales.
-- Uso:  mysql -u root -p < database/farmacia_db.sql
-- ============================================================

DROP DATABASE IF EXISTS farmacia_db;
CREATE DATABASE farmacia_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE farmacia_db;

-- ------------------------------------------------------------
-- Tablas (mismas columnas que los modelos de SQLAlchemy)
-- ------------------------------------------------------------
CREATE TABLE categorias (
  id     INT          NOT NULL AUTO_INCREMENT,
  nombre VARCHAR(100) NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uq_categorias_nombre (nombre)
) ENGINE=InnoDB;

CREATE TABLE medicamentos (
  id                INT          NOT NULL AUTO_INCREMENT,
  nombre            VARCHAR(100) NOT NULL,
  precio            FLOAT        NOT NULL,
  stock             INT          NOT NULL,
  fecha_vencimiento DATE         NOT NULL,
  categoria_id      INT          NOT NULL,
  PRIMARY KEY (id),
  CONSTRAINT fk_medicamentos_categoria
    FOREIGN KEY (categoria_id) REFERENCES categorias (id)
) ENGINE=InnoDB;

CREATE TABLE empleados (
  id       INT          NOT NULL AUTO_INCREMENT,
  nombre   VARCHAR(100) NOT NULL,
  apellido VARCHAR(100) NOT NULL,
  dni      VARCHAR(20)  NOT NULL,
  email    VARCHAR(120) NOT NULL,
  cargo    VARCHAR(100) NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uq_empleados_dni (dni),
  UNIQUE KEY uq_empleados_email (email)
) ENGINE=InnoDB;

-- ------------------------------------------------------------
-- Datos iniciales
-- ------------------------------------------------------------
INSERT INTO categorias (nombre) VALUES
  ('Analgésicos'),
  ('Antibióticos'),
  ('Antiinflamatorios'),
  ('Antialérgicos'),
  ('Vitaminas y suplementos');

INSERT INTO medicamentos (nombre, precio, stock, fecha_vencimiento, categoria_id) VALUES
  ('Paracetamol 500 mg',        2500.00, 120, '2027-08-15', 1),
  ('Ibuprofeno 400 mg',         3800.50,  80, '2027-11-30', 3),
  ('Amoxicilina 500 mg',        6200.00,  45, '2027-05-20', 2),
  ('Azitromicina 500 mg',       8900.00,  30, '2027-09-10', 2),
  ('Diclofenac 50 mg',          3100.75,  60, '2028-01-25', 3),
  ('Loratadina 10 mg',          4200.00,  55, '2027-12-05', 4),
  ('Cetirizina 10 mg',          3900.00,   4, '2027-07-18', 4),
  ('Vitamina C 1000 mg',        5400.00,  90, '2028-03-12', 5),
  ('Complejo B',                6700.00,   3, '2027-10-22', 5),
  ('Aspirina 100 mg',           2900.00,  75, '2028-02-14', 1);

INSERT INTO empleados (nombre, apellido, dni, email, cargo) VALUES
  ('María',   'González', '30123456', 'maria.gonzalez@farmacia.com', 'Farmacéutica'),
  ('Lucas',   'Fernández','32456789', 'lucas.fernandez@farmacia.com','Farmacéutico'),
  ('Sofía',   'Ramírez',  '35789012', 'sofia.ramirez@farmacia.com',  'Cajera'),
  ('Martín',  'Acosta',   '28901234', 'martin.acosta@farmacia.com',  'Encargado de depósito'),
  ('Valentina','Torres',  '38234567', 'valentina.torres@farmacia.com','Auxiliar de farmacia');
