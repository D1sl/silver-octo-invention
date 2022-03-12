const inquirer = require("inquirer");
const cTable = require("console.table");
const mysql = require('mysql2');
const db = require('./db/connection');
let currentAction = "mainmenu";

function init() {
    console.clear();
    console.log(`
    ==========================
    EMPLOYEE TRACKER v.0.1
    ==========================`)
    menu();
}


function getEmployees() {
    console.clear();
    const sql = `SELECT * FROM employee`;
    db.query(sql, (err, rows) => {
        if (err) {
            console.log(err);
        }
        console.table(rows);
        currentAction = "viewEmployees";
    })
}

function menu() {
    switch (currentAction) {
        case currentAction = "mainmenu":
            inquirer
                .prompt({
                    type: 'list',
                    name: 'main',
                    message: 'Choose an action',
                    choices: ['Show employees', 'Quit']
                })
                .then(function (action) {
                    switch (action.main) {
                        case 'Show employees':
                            currentAction = "showEmployees";
                            menu();
                            break;
                    }

                })
            break;

            case currentAction = "showEmployees":
            getEmployees();
            inquirer
            .prompt({
                type: 'list',
                name: 'employeeActions',
                message: 'Choose an action',
                choices: ['Edit', 'Back to Main Menu']
            })
            .then(function (action) {
                switch (action.employeeActions) {
                    case 'Back to Main Menu':
                        init();
                }
            })
            break;


        default:
            break;
    }

}

init();