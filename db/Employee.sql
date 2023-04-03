DROP DATABASE IF EXISTS employeesDB;

CREATE DATABASE employeesDB;

USE employeesDB;

CREATE TABLE department (
    department_id INT NOT NULL AUTO_INCREMENT,
    role VARCHAR(40) NOT NULL,
    PRIMARY KEY (department_id)
);

INSERT INTO department (role) 
VALUES ('Sales'), ('Engineering'), ('Finance'), ('Legal');

CREATE TABLE role (
    role_id INT NOT NULL AUTO_INCREMENT,
    title VARCHAR(40) NOT NULL,
    salary DECIMAL(10,2) NOT NULL,
    department_id INT NOT NULL,
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
    employee_id INT NOT NULL AUTO_INCREMENT,
    first_name VARCHAR(40) NOT NULL,
    last_name VARCHAR(40) NOT NULL,
    role_id INT NULL,
    manager_id INT NULL,
    PRIMARY KEY (employee_id)
);

CREATE TABLE managers (
    manager_id INT AUTO_INCREMENT,
    manager VARCHAR(40),
    PRIMARY KEY (manager_id)
);