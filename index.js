const inquirer = require("inquirer");
const cTable = require("console.table");
const mysql = require('mysql2');
const db = require('./db/connection');

console.clear();

function getEmployees() {
    console.clear();
    const sql = `SELECT id, first_name, last_name FROM employees`;
    db.query(sql, (err, rows) => {
        if (err) {
            console.log(err);
        }
        console.table(rows);
        console.log(`Employees: ${rows.length} \n`);
        app();
    })
}

const addEmployee = () => {

    
    console.log("add employee");


    return inquirer.prompt([
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
    ])
    .then(function(answer) {
        console.log(answer);
    })
}

function app() {
    inquirer
        .prompt({
            type: 'list',
            name: 'main',
            message: 'Choose an action',
            choices: ['List employees', 'Add an Employee', 'Quit']
        })
        .then(function (action) {
            switch (action.main) {
                case 'Show employees':
                    getEmployees();
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