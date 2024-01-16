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

