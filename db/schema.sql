DROP TABLE IF EXISTS employee;
DROP TABLE IF EXISTS role;
DROP TABLE IF EXISTS department;

CREATE TABLE department (
  `id` INTEGER PRIMARY KEY AUTO_INCREMENT,
  `name` VARCHAR(30) NOT NULL
);

CREATE TABLE `role` (
  `id` INTEGER PRIMARY KEY AUTO_INCREMENT,
  `title` VARCHAR(30) NOT NULL,
  `salary` DECIMAL NOT NULL,
  `department_id` INTEGER
);

CREATE TABLE `employee` (
  `id` INTEGER PRIMARY KEY AUTO_INCREMENT,
  `first_name` VARCHAR(30) NOT NULL,
  `last_name` VARCHAR(30) NOT NULL,
  `role_id` INTEGER,
  `manager_id` INTEGER
);

ALTER TABLE `role` ADD FOREIGN KEY (`department_id`) REFERENCES `department` (`id`);

ALTER TABLE `employee` ADD FOREIGN KEY (`role_id`) REFERENCES `role` (`id`);

ALTER TABLE `employee` ADD FOREIGN KEY (`manager_id`) REFERENCES `employee` (`id`);
