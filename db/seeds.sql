INSERT INTO departments (depttitle)
VALUES
    ('Web Development'),
    ('Human Resources'),
    ('Research and Development'),
    ('Administration');

INSERT INTO roles (title, salary, department_id)
VALUES
  ('Developer', '40000.00', 1),
  ('HR Admin', '60000.00', 2),
  ('Chief Financial Officer', '100000.00', 4),
  ('Head of Marketing', '80000.00', 4),
  ('Management', '80000.00', 4);

INSERT INTO employees (first_name, last_name, role_id, manager_id)
VALUES
  ('Benjamin', 'Molini', 1, 1),
  ('Veera', 'Vimpari', 2, 1),
  ('Sissy', 'Drayton', 1, 1),
  ('Hildegarde', 'Riolfo', 5, 1),
  ('Megen', 'Bohling', 1, 1),
  ('Caroljean', 'Ballintime', 5, 1),
  ('Tanhya', 'Humbatch', 2, 1),
  ('Tan', 'Greve', 1, 1),
  ('Jorry', 'Gheorghe', 4, 1),
  ('Tony', 'Wistance', 2, 1);