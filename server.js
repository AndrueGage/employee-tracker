const inquirer = require('inquirer');
const mysql = require('mysql2');

const db = mysql.createConnection({
   host: 'localhost',
   user: 'root',
   password: process.env.DB_PASSWORD,
   database: 'employees_db'
});
if (db) start();

function start() {
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
                'Add Department',
                'Add An Employee',
                'Update An Employee Role',
                // 'Quit'
            ]
        })
        .then((answer) => {
            switch(answer.task) {
                case 'View All Employees':
                    viewAllEmployees();
                    break;
                case 'Update Employee Role':
                    updateEmployeeRole();
                    break;
                case 'View All Roles':
                    viewAllRoles();
                    break;
                case 'Add Roles':
                    addRole();
                    break;
                case 'View All Departments':
                    viewAllDepartments();
                    break;
                case 'Add Department':
                    addDepartment();
                    break;
                case 'Add An Employee':
                    addEmployee();
                    break;
                case 'Update An Employee Role':
                    updateEmployeeRole();
                    break;
                // case 'Quit':
                //     console.log('Goodbye!');
                //     process.exit();
                default: 
                    start();
            }
        })
}

function viewAllEmployees() {
    const query = `SELECT 
      e.first_name AS employee_first_name,
      e.last_name AS employee_last_name,
      e.role_id AS employee_role_id,
      e.manager_id,
      m.first_name AS manager_first_name,
      m.last_name AS manager_last_name
    FROM employee e
    LEFT JOIN employee m ON e.manager_id = m.id;
  `;
    db.query(query, function (err, res) {
        if (err) throw err;
        console.table(res);
        start();
    });
};

function viewAllRoles() {
    const query = `SELECT role.id, role.title, role.salary, department.name AS department FROM role JOIN department ON role.department_id = department.id`;
    db.query(query, function (err, res){
        if (err) throw err;
        console.table(res);
        start();
    });
}

function viewAllDepartments(showJson) {
    const query = `SELECT id, name AS "department" FROM department`;
    db.query(query, function (err, res) {
        if (err) throw err;
        if (showJson) {
            return res.json()
        } else {
          console.table(res);
          start();  
        }
    });
};

function addDepartment() {
    inquirer
        .prompt([
            {
                type: 'input',
                name: 'departmentName',
                message: 'Enter the name of the new department:',
            },
        ])
        .then((answers) => {
            const query = 'INSERT INTO department (name) VALUES (?)';
            const values = [answers.departmentName];
            db.query(query, values, function (err,res){
                if (err) throw err;
                console.log(`Department '${answers.departmentName}' added successfully!`);
                start();
            });
        });   
}

function addRole() {
    // available before prompt 
    // const departmentData = viewAllDepartments(true)
    // console.log(departmentData)
    // inquirer
    //     .prompt([
    //         {
    //             type: 'list',
    //             name: 'role',
    //             message: 'What role would you like to add?',
    //             choices: [
    //                 'Sales Lead',
    //                 'SalesPerson',
    //                 'Lead Engineer',
    //                 'Software Engineer',
    //                 'Account Manager',
    //                 'Accountant',
    //                 'Legal Team Lead',
    //                 'Lawyer'
    //             ]
    //         },
    //         {
    //             type: 'number',
    //             name: 'salary',
    //             message: 'Please enter the salary for the new role:'
    //         },
    //         {
    //             type: 'list',
    //             name: 'department',
    //             message: 'What department does this role belong to?',
    //             choices: [
    //                 'Engineering',
    //                 'Finance',
    //                 'Legal',
    //                 'Sales'
    //             ]
    //         }
    //     ])
    //     .then((answers) => {
    //         const query = `INSERT INTO role (title, salary, department_id)
    //         VALUES (${answers.role}, ${answers.salary}, ${answers.department})`
    //     }
    //     )
}
