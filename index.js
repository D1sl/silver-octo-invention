const inquirer = require("inquirer");
const cTable = require("console.table");
const mysql = require('mysql2');
const db = require('./db/connection');

// Update everything
function updateServer() {
    db.query("SELECT * from roles", function (error, res) {
        allroles = res.map(role => ({ name: role.title, value: role.id }));
        allroles.push("CANCEL")
    });

    db.query("SELECT * from departments", function (error, res) {
        alldepartments = res.map(department => ({ name: department.depttitle, value: department.id }));
        alldepartments.push("CANCEL")
    });

    db.query("SELECT * from employees", function (error, res) {
        allemployees = res.map(employee => ({
            name: `${employee.first_name} ${employee.last_name}`,
            value: employee.id
        }));
        allemployees.push("CANCEL")
    });
}

db.connect(function (err) {
    if (err) throw err;
    updateServer();
});


// console.clear();

function getEmployees() {
    console.clear();
    const sql = `SELECT CONCAT(e.first_name,' ',e.last_name) AS Employee, roles.title AS Title, roles.salary as Salary, CONCAT(m.first_name,' ',m.last_name) AS Manager, departments.depttitle AS Department FROM employees e LEFT JOIN roles ON roles.id = e.role_id LEFT JOIN departments ON roles.department_id = departments.id LEFT JOIN employees m ON e.manager_id = m.id;`;
    db.query(sql, (err, rows) => {
        if (err) {
            console.log(err);
        }
        console.table(rows);
        console.log(`Employees: ${rows.length} \n`);
        employeeMenu();
    })
}

function getDepartments() {
    console.clear();
    const sql = `SELECT depttitle as Departments FROM departments`;
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
    console.clear();
    const sql = `SELECT title AS Roles, salary AS Salary, depttitle as Department FROM roles LEFT JOIN departments ON roles.department_id = departments.id`;


    // let query = "SELECT roles.title, roles.salary, department.dept_name AS department FROM roles INNER JOIN department ON department.id = roles.department_id;";


    db.query(sql, (err, rows) => {
        if (err) {
            console.log(err);
        }
        console.table(rows);
        console.log(`Roles: ${rows.length} \n`);
        rolesMenu();
    })
}

function addEmployee() {

    updateServer();
    const newEmployee = inquirer.prompt([
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
            const sql = `INSERT INTO employees SET ?`;
            const params = {
                first_name: answer.firstname,
                last_name: answer.lastname,
                role_id: answer.employeeRole
            };
            db.query(sql, params, function (err, res) {
                if (err) throw err;
                console.table(`\n${answer.firstname} ${answer.lastname} was added!\n`);
                updateServer();
                employeeMenu();
            })
        })
}

function removeEmployee() {
    updateServer();
    inquirer
        .prompt({
            type: 'list',
            name: 'employeelist',
            message: 'Choose an employee to fire or choose CANCEL to cancel',
            choices: allemployees,
        })
        .then(function (answer) {
            if (answer.employeelist === "CANCEL") {
                app();
            } else {

                const sql = `DELETE FROM employees WHERE id = ?`;
                const params = answer.employeelist;
                db.query(sql, params, (err, res) => {
                    if (err) throw err;
                })
                updateServer();
                console.clear();
                message = `The employee was successfully fired! \n`;
                employeeMenu(message);
            }

        })
}

function removeRole() {
    updateServer();
    inquirer
        .prompt({
            type: 'list',
            name: 'rolelist',
            message: 'Choose a role to remove or choose CANCEL to cancel',
            choices: allroles,
        })
        .then(function (answer) {
            if (answer.employeelist === "CANCEL") {
                app();
            } else {

                const sql = `DELETE FROM roles WHERE id = ?`;
                const params = answer.rolelist;
                db.query(sql, params, (err, res) => {
                    if (err) throw err;
                })
                updateServer();

                console.clear();
                message = `Role removed! \n`;
                rolesMenu(message);
            }

        })
}


function changeManager() {
    updateServer();
    inquirer
        .prompt(
            [{
                type: 'list',
                name: 'employeelist',
                message: "Choose an employee who's manager you would like to update",
                choices: allemployees
            },
            {
                type: 'list',
                name: 'managerlist',
                message: 'Choose a manager for the employee',
                choices: allemployees
            }])
        .then(function (answer) {
            
                const sql = `UPDATE employees SET manager_id = ? WHERE id = ?`;
                const params = [answer.managerlist, answer.employeelist]
                db.query(sql, params, (err, res) => {
                    if (err) throw err;
                    updateServer();
                    console.clear();
                    message = "Manager updated!\n"
                    employeeMenu(message);
                })
            
        })
}

function changeRole() {
    updateServer();
    inquirer
        .prompt(
            [{
                type: 'list',
                name: 'employeelist',
                message: "Choose an employee who's role you would like to update",
                choices: allemployees
            },
            {
                type: 'list',
                name: 'rolelist',
                message: 'Choose a new role for the employee',
                choices: allroles
            }])
        .then(function (answer) {
            const sql = `UPDATE employees SET role_id = ? WHERE id = ?`;
            const params = [answer.rolelist, answer.employeelist]
            db.query(sql, params, (err, res) => {
                if (err) throw err;
                updateServer();

                console.clear();
                message = "Role updated!\n"
                employeeMenu(message);
            })
        })
}


function updateEmployee() {
    updateServer();
    inquirer
        .prompt({
            type: 'list',
            name: 'updateaction',
            message: 'What would you like to do?',
            choices: ["Change an employee's manager", "Change an employee's role", "CANCEL"]
        })
        .then(function (action) {
            if (action.updateaction === "CANCEL") {
                app();
            }
            switch (action.updateaction) {
                case "Change an employee's manager":
                    updateServer();
                    changeManager();
                    break;
                case "Change an employee's role":
                    updateServer();
                    changeRole();
            }
        })
}

function addDepartment() {

    updateServer();
    const newEmployee = inquirer.prompt([
        {
            type: 'input',
            name: 'departmentName',
            message: 'Enter a name for the department',
            validate: deptInput => {
                if (deptInput) {
                    return true;
                } else {
                    console.log('Please enter a name for the department!');
                    return false;
                }
            }
        }
    ])
        .then(function (answer) {
            const sql = `INSERT INTO departments (depttitle) VALUES ('${answer.departmentName}');`;
            db.query(sql, function (err, res) {
                if (err) throw err;
                console.table(`\n${answer.departmentName} was added!\n`);
                updateServer();
                app();
            })
        })
}

function removeDepartment() {
    updateServer();
    inquirer
        .prompt({
            type: 'list',
            name: 'departmentlist',
            message: 'Choose a department to remove or choose CANCEL to cancel',
            choices: alldepartments
        })
        .then(function (answer) {
            if (answer.departmentlist === "CANCEL") {
                app();
            } else {

                const sql = `DELETE FROM departments WHERE id = ?`;
                const params = answer.departmentlist;
                db.query(sql, params, (err, res) => {
                    if (err) throw err;
                    console.table(`\n${answer.departmentlist} was removed!\n`);

                })
                updateServer();
                app();
            }

        })
}

function updateDepartment() {
    updateServer();
    inquirer
        .prompt([
            {
                type: 'list',
                name: 'choosedept',
                message: 'Which department would you like to rename? Select CANCEL to cancel',
                choices: alldepartments
            },
            {
                type: 'input',
                name: 'newname',
                message: 'Enter a new name for this department'
            }
        ])


        .then(function (action) {
            if (action.updateaction === "CANCEL") {
                app();
            }

            const sql = `UPDATE departments SET depttitle = ? WHERE id = ?`;
            const params = [action.newname, action.choosedept]

            db.query(sql, params, (err, res) => {
                if (err) throw err;
                updateServer();

                console.log(`\nDepartment renamed!\n`)

                app();
            })

        }
        )
}

function employeeMenu(message) {
    updateServer();

    if(message) {
        console.log(message);
    }

    inquirer
        .prompt({
            type: 'list',
            name: 'main',
            message: 'Choose an action',
            choices: ['View', 'Add', 'Edit', 'Fire', 'Main Menu']
        })
        .then(function (action) {
            switch (action.main) {
                case 'View':
                    getEmployees();
                    break;
                case 'Add':
                    addEmployee();
                    break;
                case 'Fire':
                    removeEmployee();
                    break;
                case 'Edit':
                    updateEmployee();
                    break;
                case 'Main Menu':
                    console.clear();
                    init();
            }

        })
}

function rolesMenu(message) {
    updateServer();

    if(message) {
        console.log(message);
    }

    inquirer
        .prompt({
            type: 'list',
            name: 'main',
            message: 'Choose an action',
            choices: ['View', 'Add', 'Edit', 'Remove', 'Main Menu']
        })
        .then(function (action) {
            switch (action.main) {
                case 'View':
                    getRoles();
                    break;
                case 'Add':
                    addRole();
                    break;
                case 'Remove':
                    removeRole();
                    break;
                case 'Edit':
                    editRole();
                    break;
                case 'Main Menu':
                    console.clear();
                    init();
            }

        })
}

function addRole() {

    updateServer();
    const newRole = inquirer.prompt([
        {
            type: 'input',
            name: 'roleName',
            message: 'Enter a name for the role',
            validate: roleinput => {
                if (roleinput) {
                    return true;
                } else {
                    console.log('Please enter a name for the role!');
                    return false;
                }
            }
        },
        {
            type: 'number',
            name: 'salary',
            message: 'Enter salary for the role',
            validate: salaryinput => {
                if (salaryinput) {
                    return true;
                } else {
                    console.log('Please enter a salary for the role!');
                    return false;
                }
            }
        },
        {
            type: 'list',
            name: 'department',
            message: 'Assign a department for this role',
            choices: alldepartments
        }
    ])
        .then(function (answer) {
            // console.log(answer);
            const sql = `INSERT INTO roles (title, salary, department_id) VALUES ('${answer.roleName}', '${answer.salary}', '${answer.department}');`;
            db.query(sql, function (err, res) {
                if (err) throw err;
                console.table(`\n${answer.roleName} was added!\n`);
                updateServer();
                rolesMenu();
            })
        })
}

function init() {
    console.clear();
    console.log(`
    ===============================
    EMPLOYEE TRACKER
    ===============================`);

    app();

    function app() {
        updateServer();
        inquirer
            .prompt({
                type: 'list',
                name: 'main',
                message: 'Choose an action',
                choices: ['EMPLOYEES', 'ROLES', 'DEPARTMENTS', 'Quit']
            })
            .then(function (action) {
                switch (action.main) {
                    case 'EMPLOYEES':
                        employeeMenu();
                        break;
                    case 'DEPARTMENTS':
                        getDepartments();
                        break;
                    case 'ROLES':
                        rolesMenu();
                        break;
                    case 'Quit':
                        console.clear();
                        process.exit(1);
                }
    
            })
    }
}

init();