USE employees_db;

INSERT INTO department (name)
VALUES ('Engineering'),
        ('Finance'),
        ('Legal'),
        ('Sales');

INSERT INTO role (title, salary, department_id)
VALUES ('Sales Lead', 250000, 4),
       ('Salesperson', 80000, 4),
       ('Lead Engineer', 100000, 1),
       ('Software Engineer', 115000, 1),
       ('Account Manager', 90000, 2),
       ('Accountant', 160000, 2),
       ('Legal Team Lead', 300000, 3),
       ('Lawyer', 200000, 3);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ('Kevin', 'Gagonza', 1, 2),
       ('Maxwell', 'Phillip', 1, NULL),
       ('Jackson', 'Ford', 2, NULL),
       ('Reed', 'Racongaloid', 4, NULL),
       ('Marc', 'Capuchin', 3, NULL),
       ('Emily', 'Griffon', 3, 2),
       ('Tyler', 'Sheckler', 4, 4),
       ('Eric', 'Woodchip', 2, 3);
