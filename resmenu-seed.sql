-- both test users have the password "password"

INSERT INTO businesses (username, password, email)
VALUES ('testuser',
        '$2b$12$AZH7virni5jlTTiGgEg4zu3lSvAw68qVEfSIOjJ3RqtbJbdW/Oi5q',
        'joel@joelburton.com'),
       ('testadmin',
        '$2b$12$AZH7virni5jlTTiGgEg4zu3lSvAw68qVEfSIOjJ3RqtbJbdW/Oi5q',
        'joel@joelburton.com');

INSERT INTO dishes (type, name, description, price, businesses_id)
VALUES ('Main', 'Double-double', 'Ground meat, usually beef, placed inside a sliced bread roll or bun.', 9.99,'testuser'),
       ('Main', 'Hamburger', 'Ground meat, usually beef, placed inside a sliced bread roll or bun.', 7.99,'testuser'),
       ('Main', 'Cheeseburger', 'Ground meat, usually beef, placed inside a sliced bread roll or bun.', 6.99,'testuser'),
       ('Side', 'Fries', 'fried potatos', 3.99,'testuser'),
       ('Side', 'Rice', 'fried potatos', 1.99,'testuser'),
       ('Drink','Coke', '',1.29,'testuser');
       