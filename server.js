const inquirer = require('inquirer');
const mysql = require('mysql2');

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '3sq`XYQ*ES',
    database: 'employees_db'
});
if (db) start();

async function start() {
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
                'Quit'
            ]
        })
        .then(async (answer) => {
            switch (answer.task) {
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
                    await addEmployee();
                    break;
                case 'Update An Employee Role':
                    updateEmployeeRole();
                    break;
                case 'Quit':
                    console.log('Goodbye!');
                    process.exit();
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

function viewAllRoles(showJson) {
    const query = `SELECT role.id, role.title, role.salary, department.name AS department FROM role JOIN department ON role.department_id = department.id`;

    return new Promise((resolve, reject) => {
        db.query(query, (err, res) => {
            if (err) {
                reject(err);
                return;
            }

            if (showJson) {
                resolve(res);
            } else {
                console.table(res);
                start();
                resolve();
            }
        });
    });
}

function viewAllDepartments(showJson) {
    const query = `SELECT id, name AS "department" FROM department`;
    return new Promise((resolve, reject) => {
        db.query(query, (err, res) => {
            if (err) {
                reject(err);
                return;
            }

            if (showJson) {
                resolve(res);
            } else {
                console.table(res);
                start();
                resolve();
            }
        });
    });
}

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
            db.query(query, values, function (err, res) {
                if (err) throw err;
                console.log(`Department '${answers.departmentName}' added successfully!`);
                start();
            });
        });
}

async function addRole() {
    try {
        const [roleData, departmentData] = await Promise.all([
            viewAllRoles(true),
            viewAllDepartments(true)
        ]);

        inquirer
            .prompt([
                {
                    type: 'input',
                    name: 'role',
                    message: 'What role would you like to add?',
                    validate: function (input) {
                        if (input && input.trim() !== '') {
                            if (roleData.some(role => input === role.title)) {
                                return `Role ${input} already exists. Please try again.`;
                            } else {
                                return true;
                            }
                        }
                        return 'Role cannot be empty';
                    },
                },
                {
                    type: 'number',
                    name: 'salary',
                    message: 'Please enter the salary for the new role:'
                },
                {
                    type: 'list',
                    name: 'department',
                    message: 'What department does this role belong to?',
                    choices: departmentData.map(department => department.department)
                }
            ])
            .then((answers) => {
                // Use the answers and departmentData to construct and execute your query
                const selectedDepartment = departmentData.find(department => department.department === answers.department);
                const query = `INSERT INTO role (title, salary, department_id)
                        VALUES (?, ?, ?)`;
                const values = [answers.role, answers.salary, selectedDepartment.id];

                db.query(query, values, function (err, res) {
                    if (err) {
                        console.error('Error adding role:', err);
                    } else {
                        console.log('Role added successfully!');
                    }
                    start();
                });
            });
    } catch (error) {
        console.error(error);
    }

}

function getManagers() {
    const query = `SELECT manager_id, CONCAT(first_name, ' ', last_name) AS manager_name
    FROM employee
    WHERE manager_id IS NULL;`;

    return new Promise((resolve, reject) => {
        db.query(query, (err, res) => {
            if (err) {
                reject(err);
                return;
            }

            resolve(res);

        });
    });
}

async function addEmployee() {
    try {
        const [roleData, managerData] = await Promise.all([
            viewAllRoles(true),
            getManagers()
        ]);

        inquirer
            .prompt([
                {
                    type: 'input',
                    name: 'firstName',
                    message: 'Enter the new employee\'s first name:'
                },
                {
                    type: 'input',
                    name: 'lastName',
                    message: 'Enter the new employee\'s last name:'
                },
                {
                    type: 'list',
                    name: 'role',
                    message: 'Select the employee\'s role:',
                    choices: roleData.map(role => role.title)
                },
                {
                    type: 'list',
                    name: 'manager',
                    message: 'Select the employee\'s manager:',
                    choices: managerData.map(manager => manager.manager_name),
                },
            ])
            .then((answers) => {

                const query = `INSERT INTO employee (first_name, last_name, role_id, manager_id)
                        VALUES (?, ?, ?, ?)`;
                // Find manager id based on chosen manager name
                const selectedManager = managerData.filter(manager => answers.manager === manager.manager_name);
                console.log("managerID: ", selectedManager)
                // Find role id based on chosen role name
                const selectedRole = roleData.filter(role => answers.role === role.title);
                console.log("roleID: ", selectedRole)
                // Add matched data with selected data to make a new query
                const values = [answers.firstName, answers.lastName, selectedRole.id, selectedManager.id];

                db.query(query, values, function (err, res) {
                    if (err) {
                        console.error('Error adding employee:', err);
                    } else {
                        console.log('Employee added successfully!');
                    }
                    start();
                });
            });
    } catch (error) {
        console.error(error);
    }
}

function updateEmployeeRole() {
    
}