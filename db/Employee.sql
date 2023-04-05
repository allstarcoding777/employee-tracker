DROP DATABASE IF EXISTS employees_db;

CREATE DATABASE employees_db;

USE employees_db;

CREATE TABLE department (
    department_id INT AUTO_INCREMENT,
    role VARCHAR(40),
    PRIMARY KEY (department_id)
);

INSERT INTO department(role) 
VALUES ('Sales'), ('Engineering'), ('Finance'), ('Legal');

CREATE TABLE role (
    role_id INT NOT NULL AUTO_INCREMENT,
    title VARCHAR(40),
    salary DECIMAL(10,2),
    department_id INT,
    PRIMARY KEY (role_id)
);

INSERT INTO role (title, salary, department_id)
VALUES ('Sales Manager', 120000, 1),
('Salesperson', 75000, 1),
('Lead Engineer', 125000, 2),
('Software Engineer', 110000, 2),
('Accountant', 80000, 3),
('Bookkeeper', 60000, 3),
('Lawyer', 110000, 4),
('Legal Assistant', 75000, 4);

CREATE TABLE employee (
    id INT AUTO_INCREMENT,
    first_name VARCHAR(40),
    last_name VARCHAR(40),
    role_id INT NULL,
    manager_id INT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE managers (
    manager_id INT AUTO_INCREMENT,
    manager VARCHAR(40),
    PRIMARY KEY (manager_id)
);