const inquirer = require("inquirer");
const mysql = require('mysql2');

const db = mysql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: '3sq`XYQ*ES',
        database: 'employees_db'
    },
    console.log(`Connected to the employees_db database.`)
);

function start {
    inquirer
        .prompt({
            type: 'list',
            name: 'task',
            message: 'What would you like to do?',
            choices: [
                'View All Employees',
                'Update Employee Role',
                'View All Roles',
                'Add Roles',
                'View All Departments',
                'Add Deparment',
                'Add An Employee',
                'Update An Employee Role',
                'Quit'
            ]
        })
};

