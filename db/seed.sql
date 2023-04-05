INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Kevin", "Johnson", 1, 1),
("Robert", "Flores", 2, 1),
("Sarah", "Stewart", 3, 2),
("Lisa", "Guzman", 4, 2),
("Mary", "Smith", 5, 3),
("Sally", "Brown", 6, 4),
("Mike", "Becker", 7, null);

INSERT INTO managers(manager)
VALUES ("Kevin Johnson"),
("Robert Flores"),
("Sarah Stewart");

SELECT * FROM employee;
SELECT * FROM managers;