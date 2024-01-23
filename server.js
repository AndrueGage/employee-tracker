// Require in node dependencies
const inquirer = require('inquirer');
const mysql = require('mysql2');
// mysql2 connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '3sq`XYQ*ES',
    database: 'employees_db'
});
db.connect(err => {
    if (err) throw err;
    console.log("MySQL Connected");
    console.log('\x1b[33m%s\x1b[0m', `
    
    ███████╗███╗░░░███╗██████╗░██╗░░░░░░█████╗░██╗░░░██╗███████╗███████╗
    ██╔════╝████╗░████║██╔══██╗██║░░░░░██╔══██╗╚██╗░██╔╝██╔════╝██╔════╝
    █████╗░░██╔████╔██║██████╔╝██║░░░░░██║░░██║░╚████╔╝░█████╗░░█████╗░░
    ██╔══╝░░██║╚██╔╝██║██╔═══╝░██║░░░░░██║░░██║░░╚██╔╝░░██╔══╝░░██╔══╝░░
    ███████╗██║░╚═╝░██║██║░░░░░███████╗╚█████╔╝░░░██║░░░███████╗███████╗
    ╚══════╝╚═╝░░░░░╚═╝╚═╝░░░░░╚══════╝░╚════╝░░░░╚═╝░░░╚══════╝╚══════╝
    
    ███╗░░░███╗░█████╗░███╗░░██╗░█████╗░░██████╗░███████╗██████╗░
    ████╗░████║██╔══██╗████╗░██║██╔══██╗██╔════╝░██╔════╝██╔══██╗
    ██╔████╔██║███████║██╔██╗██║███████║██║░░██╗░█████╗░░██████╔╝
    ██║╚██╔╝██║██╔══██║██║╚████║██╔══██║██║░░╚██╗██╔══╝░░██╔══██╗
    ██║░╚═╝░██║██║░░██║██║░╚███║██║░░██║╚██████╔╝███████╗██║░░██║
    ╚═╝░░░░░╚═╝╚═╝░░╚═╝╚═╝░░╚══╝╚═╝░░╚═╝░╚═════╝░╚══════╝╚═╝░░╚═╝
`);
    start();
});
// The start function to start the program and also be the homepage for the application after answering a question. Includes inquirer prompts and switch cases so the functions run when you select them in the terminal.
async function start() {
    inquirer
        .prompt({
            type: 'list',
            name: 'task',
            message: 'What would you like to do?',
            choices: [
                'View All Employees',
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
                    console.log('See you later!');
                    process.exit();
                default:
                    start();
            }
        })
}
// Function to view all employees in the employees DB. The SQL query gets data from all tables and joins them so you can see Employees, their role, their salary, their id and their managers. 
function viewAllEmployees(showJson) {
    const query = `SELECT 
    e.id AS employee_id,
    e.first_name AS employee_first_name,
    e.last_name AS employee_last_name,
    e.role_id AS employee_role_id,
    r.title AS employee_role,
    r.salary AS employee_salary,
    d.name AS department_name,
    e.manager_id,
    m.first_name AS manager_first_name,
    m.last_name AS manager_last_name
FROM employee e
LEFT JOIN role r ON e.role_id = r.id
LEFT JOIN department d ON r.department_id = d.id
LEFT JOIN employee m ON e.manager_id = m.id;
  `;
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
};
// Function to view all the current roles in the DB and display the id, salary, and title. 
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
// Function to view all departments using showJson as an argument be display the data. The query selects the id and gives it the alias department from the department table
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
// This function is to add a new department to the department table. 
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
// An asynchronous function to add a new role. This validates that the role is new before adding it so that there are not two of the same objects returned in the query.
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
// A function to get the managers and display them. Using a query to get the manager id, concatinate their first and last name, and change the alias to manager_name from the employee table. It ensures that it only gets the manager by making sure their manager id is null. 
function getManagers() {
    const query = `SELECT id, manager_id, CONCAT(first_name, ' ', last_name) AS manager_name
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
// Asynchronous function to run when you select add employee. It will then call the viewAllRoles function and getManagers function so that its easier to get that data without repeating your code. 
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
                // Find role id based on chosen role name
                const selectedRole = roleData.filter(role => answers.role === role.title);
                // Add matched data with selected data to make a new query
                const values = [answers.firstName, answers.lastName, selectedRole[0].id, selectedManager[0].id];

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
// Asynchronous function to update an employee's role. When you call this function it wil get data from the viewAllRoles function and viewAllEmployees function so you have an up to date list to update the employee with. 
async function updateEmployeeRole() {
    try {
        const [roleData, employeeData] = await Promise.all([
            viewAllRoles(true),
            viewAllEmployees(true)
        ]);

        let concatedEmployeeNames = employeeData.map(employee => {
            return {
                id: employee.employee_id,
                full_name: `${employee.employee_first_name} ${employee.employee_last_name}`
            }
        });
        console.log(concatedEmployeeNames)

        inquirer
            .prompt([
                {
                    type: 'list',
                    name: 'employeeName',
                    message: 'Select which employee you would like to update:',
                    choices: concatedEmployeeNames.map(employee => employee.full_name)
                },
                {
                    type: 'list',
                    name: 'newRole',
                    message: 'Select the new role for the employee:',
                    choices: roleData.map(role => role.title)
                },
            ])
            .then((answers) => {
                const query = `UPDATE employee SET role_id = ? WHERE id= ?`;

                const selectedRole = roleData.filter(role => answers.newRole === role.title)

                const selectedEmployee = concatedEmployeeNames.filter(employee => answers.employeeName === employee.full_name)

                const values = [selectedRole.id, selectedEmployee.id];

                db.query(query, values, function (err, res) {
                    if (err) {
                        console.error('Error updating employee:', err);
                    } else {
                        console.log('Employee updated successfully!');
                    }
                    start();
                })
            });
    } catch (error) {
        console.error('Error updating employee role', error);
        start()
    }
};