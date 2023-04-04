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

// function to check roles
// SELECT will return a promise that we can use to get the data, JOIN will join the tables together
const checkRole = `SELECT role_id, employee.first_name, employee.last_name, title, salary, department.role, managers.manager
FROM employee
JOIN role ON employee.role_id = role.role_id
JOIN department ON role.department_id = department.department_id
LEFT JOIN managers ON employee.manager_id = managers.manager_id`;

// function to prompt user to choose an action
const init = () => {
    getEmployees();
    getRoles();
    getManagers();
    inquirer.prompt({
        name: 'action',
        type: 'rawlist',
        message: 'What would you like to do?',
        choices: [
            'View All Employees',
            'View All Employees By Department',
            'View All Employees By Manager',
            'Add Employee',
            'Remove Employee',
            'Update Employee Role',
            'Update Employee Manager',
            'View All Roles',
            'View All Managers',
        ],
    })
    // switch statement to call the function based on the user's choice
    .then((answer) => {
        switch (answer.action) {
            case 'View All Employees':
                viewAllEmployees();
                break;
            case 'View All Employees By Department':
                viewAllEmployeesByDepartment();
                break;
            case 'View All Employees By Manager':
                viewAllEmployeesByManager();
                break;
            case 'Add Employee':
                addEmployee();
                break;
            case 'Remove Employee':
                removeEmployee();
                break;
            case 'Update Employee Role':
                updateEmployeeRole();
                break;
            case 'Update Employee Manager':
                updateEmployeeManager();
                break;
            case 'View All Roles':
                viewAllRoles();
                break;
            case 'View All Managers':
                viewAllManagers();
                break;
            case 'Exit':
                connection.end();
                break;
        }
    });
};

// function to view employees by manager
const viewAllEmployeesByManager = () => {
    inquirer.prompt({
        name: 'manager',
        type: 'list',
        message: 'Choose a manager?',
        choices: managers,
    }).then((answer) => {
        connection.query('SELECT first_name, last_name, FROM employee WHERE manager_id = ${answer.manager}', (err, res) => {
            if (err) throw err;
            console.table(res);
            init();
        })
    })
};

// function to update employee manager
const updateEmployeeManager = () => {
    inquirer.prompt([{
        type: 'list',
        name: 'employee',
        message: 'Which employee would you like to add a new manager to?',
        choices: employees
    },
    {
        type: 'list',
        name: 'manager',
        message: 'Which manager would you like to assign to this employee?',
        choices: managers
    },
    ]).then((answer) => {
        connection.query('UPDATE employee SET manager_id = ${answer.manager} WHERE employee_id = ${answer.employee}', (err, res) => {
            if (err) throw err;
            console.log('Employee Manager Updated!');
            init();
        })
    })
};

// function to update employee role
const updateEmployeeRole = () => {
    inquirer.prompt([{
        type: 'list',
        name: 'employee',
        message: 'Which employee would you like to update?',
        choices: employees
    },
    {
        type: 'list',
        name: 'role',
        message: 'What is the new role for this employee?',
        choices: roles
    },
    ]).then((answer) => {
        connection.query('UPDATE employee SET role_id = ${answer.role} WHERE employee_id = ${answer.employee}', (err, res) => {
            if (err) throw err;
            console.log('Employee Role Updated!');
            init();
        })
    })
};

// function to view all managers
const viewAllManagers = () => {
    connection.query('SELECT manager FROM managers', (err, res) => {
        if (err) throw err;
        // console.table will display the data in a table format
        console.table(res);
        init();
    })
};

// function to view all employees
const viewAllEmployees = () => {
    connection.query(checkRole, (err, res) => {
        if (err) throw err;
        console.table(res);
        init();
    })
};

// function to view all roles
const viewAllRoles = () => {
    connection.query('SELECT title FROM role', (err, res) => {
        if (err) throw err;
        console.table(res);
        init();
    })
};

// function to view employees by department
const viewAllEmployeesByDepartment = () => {
    inquirer.prompt({
        name: 'department',
        type: 'list',
        message: 'Choose a department to view.',
        choices: departments,
    }).then((answer) => {
        connection.query('SELECT first_name, last_name, title FROM employee JOIN role ON employee.role_id = role.role_id WHERE department_id = ${answer.department}', (err, res) => {
            if (err) throw err;
            console.table(res);
            init();
        })
    })
};

// function to add employee
const addEmployee = () => {
    inquirer.prompt([{
        name: 'first_name',
        type: 'input',
        message: 'What is the employee\'s first name?',
    },
    {
        name: 'last_name',
        type: 'input',
        message: 'What is the employee\'s last name?',
    },
    {
        name: 'role',
        type: 'list',
        message: 'What is the employee\'s role?',
        choices: roles,
    },
    {
        name: 'manager',
        type: 'list',
        message: 'Who is the employee\'s manager?',
        choices: managers,
    },
    ]).then((answer) => {
        connection.query('INSERT INTO employee SET ?', {
            first_name: answer.first_name,
            last_name: answer.last_name,
            role_id: answer.role,
            manager_id: answer.manager,
        }, (err) => {
            if (err) throw err;
            console.log('New Employee Added!');
            init();
        })
    })
};

// function to remove employee
const removeEmployee = () => {
    inquirer.prompt({
        name: 'employee',
        type: 'list',
        message: 'Which employee would you like to remove?',
        choices: employees,
    }).then((answer) => {
        connection.query('DELETE FROM employee WHERE employee_id = ${answer.employee}', (err, res) => {
            if (err) throw err;
            console.log('Employee Removed!');
            init();
        })
    })
}

// init function to start the application
init()














