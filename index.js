const inquirer = require("inquirer");
const cTable = require("console.table");
const mysql = require('mysql2');
const db = require('./db/connection');



// Update everything
function updateServer() {
    db.query("SELECT * from roles", function (error, res) {
        allroles = res.map(role => ({ name: role.title, value: role.id }));
    });

    db.query("SELECT * from departments", function (error, res) {
        alldepartments = res.map(dept => ({ name: dept.name, value: dept.id }));
    });

    db.query("SELECT * from employees", function (error, res) {
        allemployees = res.map(employee => ({
            name: `${employee.first_name} ${employee.last_name}`,
            value: employee.id
        }));
    });
}

db.connect(function(err) {
    if (err) throw err;
    updateServer();
});


// console.clear();

function getEmployees() {
    // console.clear();
    const sql = `SELECT employees.first_name AS "First Name", employees.last_name AS "Last Name", roles.title AS "Title", roles.salary AS "Salary" FROM employees LEFT JOIN roles ON employees.role_id = roles.id;`;
    db.query(sql, (err, rows) => {
        if (err) {
            console.log(err);
        }
        console.table(rows);
        console.log(`Employees: ${rows.length} \n`);
        app();
    })
}

function getDepartments() {
    // console.clear();
    const sql = `SELECT id, department_name FROM departments`;
    db.query(sql, (err, rows) => {
        if (err) {
            console.log(err);
        }
        console.table(rows);
        console.log(`Departments: ${rows.length} \n`);
        app();
    })
}

function getRoles() {
    // console.clear();
    const sql = `SELECT roles.title, roles.salary FROM roles`;


    // let query = "SELECT roles.title, roles.salary, department.dept_name AS department FROM roles INNER JOIN department ON department.id = roles.department_id;";


    db.query(sql, (err, rows) => {
        if (err) {
            console.log(err);
        }
        console.table(rows);
        console.log(`Roles: ${rows.length} \n`);
        app();
    })
}

function addEmployee() {

    updateServer();
    inquirer.prompt([
        {
            type: 'input',
            name: 'firstname',
            message: 'Enter the employees first name',
            validate: nameInput => {
                if (nameInput) {
                    return true;
                } else {
                    console.log('Please enter the first name!');
                    return false;
                }
            }
        },
        {
            type: 'input',
            name: 'lastname',
            message: 'Enter the employees last name',
            validate: nameInput => {
                if (nameInput) {
                    return true;
                } else {
                    console.log('Please enter the last name!');
                    return false;
                }
            }
        },
        {
            type: 'list',
            name: 'employeeRole',
            message: 'Enter the employees role',
            choices: allroles
        }
    ])
        .then(function (answer) {

            console.log(answer);

        })
}

function app() {
    inquirer
        .prompt({
            type: 'list',
            name: 'main',
            message: 'Choose an action',
            choices: ['List employees', 'List departments', 'List roles', 'Add an Employee', 'Quit']
        })
        .then(function (action) {
            switch (action.main) {
                case 'List employees':
                    getEmployees();
                    break;
                case 'List departments':
                    getDepartments();
                    break;
                case 'List roles':
                    getRoles();
                    break;
                case 'Add an Employee':
                    addEmployee();
                // case 'Quit':
                //     console.clear();
                //     process.exit(1);
            }

        })
}

app();