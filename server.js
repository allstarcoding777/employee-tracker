// require dependencies
const mysql = require('mysql');
const inquirer = require('inquirer');
const cTable = require('console.table');

// variables with empty arrays to hold data
let managers = [];
let roles = [];
let employees = [];

// create connection to database
const connection = mysql.createConnection({
    host: 'localhost',
    port: 3001,
    user: 'root',
    password: 'password',
    database: 'employeesDB',
});

// function to get managers from database
const getManagers = () => {
    // connection.query will return a promise that we can use to get the data
    connection.query('SELECT manager, manager_id FROM managers', (err, res) => {
        // if there is an error, throw it
        if (err) throw err;
        managers = [];
        // loop through the data and push it into the managers array, res is the data from the database, i is the index
        for (let i = 0; i < res.length; i++) {
            const manager = res[i].manager;
            const manager_id = res[i].manager_id;
            let newManager = { name: manager, value: manager_id }
            managers.push(newManager);
        }
        return managers;
    });
};

// function to get roles from database
const getRoles = () => {
    connection.query('SELECT title, role_id FROM role', (err, res) => {
        if (err) throw err;
        roles = [];
        for (let i = 0; i < res.length; i++) {
            const title = res[i].title;
            const role_id = res[i].role_id;
            let newRole = { name: title, value: role_id }
            roles.push(newRole);
        }
        return roles;
    })
};

// function to get employees from database
const getEmployees = () => {
    connection.query('SELECT first_name, last_name, employee_id FROM employee', (err, res) => {
        if (err) throw err;
        employees = [];
        for (let i = 0; i < res.length; i++) {
            const first_name = res[i].first_name;
            const last_name = res[i].last_name;
            const employee_id = res[i].employee_id;
            let newEmployee = { name: first_name + ' ' + last_name, value: employee_id }
            employees.push(newEmployee);
        }
        return employees;
    })
};




