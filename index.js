const inquirer = require("inquirer");
const cTable = require("console.table");
const mysql = require('mysql2');
const db = require('./db/connection');

function getEmployees() {
    const sql = `SELECT * FROM employee`;
    db.query(sql, (err, rows) => {
        if (err) {
            console.log(err);
        }
        console.table(rows);
    })
}

function mainMenu() {
    inquirer
        .prompt({
            type: 'list',
            name: 'main',
            message: 'Choose an action',
            choices: ['Show employees', 'Quit']
        })
        .then(function(action) {
            switch (action.main) {
                case 'Show employees':
                    menuEmployees();                    
                    break;
            }
        })
}

function menuEmployees() {
    console.log("Show Employees Chosen!")
}

mainMenu();