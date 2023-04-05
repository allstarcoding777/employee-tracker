// require dependencies
const mysql = require('mysql');
const inquirer = require('inquirer');
const cTable = require('console.table');
require ('dotenv').config();

// variables with empty arrays to hold data
let managers = [];
let roles = [];
let departments = [];
let employees = [];

// create connection to database
const connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password:process.env.PASSWORD,
    database: 'employees_db'
});

// function to get managers from database
const getManagers = () => {
    // connection.query will return a promise that we can use to get the data, err, res are the parameters
    connection.query(`SELECT manager, manager_id FROM managers`, (err, res) => {
        // if there is an error, throw it
        if (err) throw err;
        // empty the managers array
        managers = [];
        // loop through the data and push it into the managers array, res is the data from the database, i is the index
        for (let i = 0; i < res.length; i++) {
            const manager = res[i].manager;
            const manager_id = res[i].manager_id;
            // create a new object with the data from the database
            let newManager = {
                name: manager,
                value: manager_id,
            };
            managers.push(newManager);
        };
        return managers;
    });
};

// function to get employees from database
const getEmployees = () => {
    connection.query(`SELECT first_name, last_name, id FROM employee`, (err, res) => {
        if (err) throw err;
        employees = [];
        for (let i = 0; i < res.length; i++) {
            const id = res[i].id;
            const firstName = res[i].first_name;
            const lastName = res[i].last_name;
            let newEmployees = {
                name: firstName.concat(" ", lastName),
                value: id,
            };
            employees.push(newEmployees);
        }
        return employees;
    }
    );
};

// function to get departments from database
const getDepartments = () => {
    connection.query(`SELECT role, department_id FROM department`, (err, res) => {
        if (err) throw err;
        departments = [];
        for (let i = 0; i < res.length; i++) {
            const id = res[i].department_id;
            const title = res[i].role;
            var newDepartment = {
                name: title,
                value: id,
            };
            departments.push(newDepartment);
        };
        return departments;
    });
};

// function to get roles from database
const getRoles = () => {
    connection.query(`SELECT title, role_id FROM role`, (err, res) => {
        if (err) throw err;
        roles = [];
        for (let i = 0; i < res.length; i++) {
            const id = res[i].role_id;
            const title = res[i].title;
            let newRole = {
                name: title,
                value: id,
            };
            roles.push(newRole);
        };
        return roles;
    });
};

// function to prompt user to choose an action
async function init(){
    getEmployees();
    getManagers();
    getDepartments();
    getRoles();
    await inquirer.prompt({
        name: 'init',
        type: 'list',
        message: 'What would you like to do?',
        choices: [
            'View All Employees',
            'View All Employees By Department',
            'View All Employees By Manager',
            'Add Employee',
            'Add Department',
            'Add Role',
            'Remove Employee',
            'Update Employee Role',
            'Update Employee Manager',
            'View All Roles',
            'View All Departments',
            'View All Managers',
        ],
    })
    // switch statement to call the function based on the user's choice
    .then((answer) => {
        //answer.init is the user's choice
        switch (answer.init) {
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
            case 'Add Department':
                addDepartment();
                break;
            case 'Add Role':
                addRole();
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
            case 'View All Departments':
                viewAllDepartments();
                break;
            case 'Exit':
                connection.end();
                break;
        }
    });
};

// function to view all departments
const viewAllDepartments = () => {
    connection.query(`SELECT role FROM department`, (err, res) => {
        console.log("\nALL DEPARTMENTS\n");
        if (err) throw err;
        console.table(res);
        // call the init function to prompt the user to choose an action again
        init();
      });
    };

// function to add a new department
const addDepartment = () => {
    inquirer
    .prompt({
      type: "input",
      name: "department",
      message: "What new department would you like to add?"
    })
    .then((answer) => {
        // insert the new department into the database
      connection.query(`INSERT INTO department(role)
      VALUES("${answer.department}")`, (err, res) => {
        if (err) throw err;
        init();
      })
    })
};

// function to add a new role to the database
const addRole = () => {
    inquirer
      .prompt([
        {
        type: "input",
        name: "role",
        message: "What role would you like to add?"
      },
      {
        type: "input",
        name: "salary",
        value: "What is their salary?"
      },
      {
        type: "list",
        name: "department",
        value: "What department does this role belong to?",
        choices: departments
      }
      ])
      .then((answer) => {
        connection.query(`INSERT INTO role(title, salary, department_id)
        VALUES("${answer.role}", ${answer.salary}, ${answer.department})`, (err, res) => {
          if (err) throw err;
          init();
        })
      })
  };

// function to view employees by manager
const viewAllEmployeesByManager = () => {
    inquirer.prompt({
        type: 'list',
        name: 'manager',
        message: 'Choose a manager.',
        choices: managers,
    }).then((answer) => {
        connection.query(`SELECT first_name, last_name FROM employee 
        WHERE manager_id = ${answer.manager};`, (err, res) => {
            if (err) throw err;
            console.table(res);
            init()
        }
        );
    });
};

// function to update employee manager
const updateEmployeeManager = () => {
    inquirer.prompt([{
        type: 'list',
        name: 'employee',
        message: 'Which employee would you like to add a new manager to?',
        choices: employees,
    },
    {
        type: 'list',
        name: 'manager',
        message: 'Which manager would you like to assign to this employee?',
        choices: managers,
    },
    ]).then((answer) => {
        connection.query(`UPDATE employee SET manager_id = ${answer.manager} 
        WHERE employee_id = ${answer.employee}`, (err, res) => {
            if (err) throw err;
            console.log('Employee Manager Updated!');
            init();
        }
        );
    });
};

// function to update employee role
const updateEmployeeRole = () => {
    inquirer.prompt([{
        type: 'list',
        name: 'employee',
        message: 'Which employee would you like to update?',
        choices: employees,
    },
    {
        type: 'list',
        name: 'role',
        message: 'What is the new role for this employee?',
        choices: roles,
    },
    ]).then((answer) => {
        connection.query(`UPDATE employee 
        SET role_id = ${answer.role} 
        WHERE employee_id = ${answer.employee};`, (err, res) => {
            if (err) throw err;
            console.log('Employee Role Updated!');
            init();
        }
        );
    });
};

// function to view all managers
const viewAllManagers = () => {
    connection.query(`SELECT manager FROM managers`, (err, res) => {
        if (err) throw err;
        console.log('\nALL MANAGERS\n')
        // console.table will display the data in a table format
        console.table(res);
        init();
    });
};

// function to view all employees
const viewAllEmployees = () => {
    connection.query(`SELECT id, employee.first_name, employee.last_name, title, salary, department.role, managers.manager
  FROM employee
  JOIN role ON employee.role_id = role.role_id 
  JOIN department ON role.department_id = department.department_id
  LEFT JOIN managers on employee.manager_id = managers.manager_id`, (err, res) => {
    console.log("\nALL EMPLOYEES\n");
    if (err) throw err;
    console.table(res);
    init();
  });
};

// function to view all roles
const viewAllRoles = () => {
    connection.query(`SELECT title FROM role`, (err, res) => {
        console.log("\nALL ROLES\n");
        if (err) throw err;
        console.table(res);
        init();
      });
    };

// function to view employees by department
const viewAllEmployeesByDepartment = () => {
    inquirer.prompt({
        type: 'rawlist',
        name: 'departments',
        message: 'Which department would you like to view?',
        choices: ['Engineering', 'Finance', 'Legal', 'Sales'],
    }).then((answer) => {
        if (answer.departments === 'Engineering') {
            connection.query(`SELECT employee.first_name, employee.last_name FROM employee
            JOIN role ON employee.role_id = role.role_id
            JOIN department ON role.department_id = department.department_id and department.role = 'Engineering'`, (err, res) => {
                console.log('\nEngineers\n');
                if (err) throw err;
                console.table(res);
                init();
            });
        } else if (answer.departments === 'Finance') {
            connection.query(`SELECT employee.first_name, employee.last_name FROM employee
            JOIN role ON employee.role_id = role.role_id
            JOIN department ON role.department_id = department.department_id and department.role = 'Finance'`, (err, res) => {
                console.log('\nFinance\n');
                if (err) throw err;
                console.table(res);
                init();
            });
        } else if (answer.departments === 'Legal') {
            connection.query(`SELECT employee.first_name, employee.last_name FROM employee
            JOIN role ON employee.role_id = role.role_id
            JOIN department ON role.department_id = department.department_id and department.role = 'Legal'`, (err, res) => {
                console.log('\nLegal\n');
                if (err) throw err;
                console.table(res);
                init();
            });
        } else if (answer.departments === 'Sales') {
            connection.query(`SELECT employee.first_name, employee.last_name FROM employee
            JOIN role ON employee.role_id = role.role_id
            JOIN department ON role.department_id = department.department_id and department.role = 'Sales'`, (err, res) => {
                console.log('\nSales\n');
                if (err) throw err;
                console.table(res);
                init();
            });
        }
    });
};

// function to add employee
const addEmployee = () => {
    managers.push('none');
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
        if (answer.manager === 'none') {
            connection.query(`INSERT INTO employee (first_name, last_name, role_id, manager_id) 
            VALUES ('${answer.first_name}', '${answer.last_name}', ${answer.role})`, (err, res) => {
                if (err) throw err;
                init();
            });
        } 
        else {
            connection.query(`INSERT INTO employee (first_name, last_name, role_id, manager_id)
            VALUES ('${answer.first_name}', '${answer.last_name}', ${answer.role}, ${answer.manager})`, (err, res) => {
                if (err) throw err;
                init();
            });
        }
    });
};

// function to remove employee
const removeEmployee = () => {
    inquirer.prompt({
        name: 'employee',
        type: 'list',
        message: 'Which employee would you like to remove?',
        choices: employees,
    }).then((answer) => {
        connection.query(`DELETE FROM employee WHERE id = ${answer.employee}`, (err, res) => {
            if (err) throw err;
            console.log('Employee Removed!');
            init();
        });
        console.log(answer)
    });
};

// waits for the connection to be made before starting the application
connection.connect((err) => {
    if (err) throw err;
    
// init function to start the application
init();
});














