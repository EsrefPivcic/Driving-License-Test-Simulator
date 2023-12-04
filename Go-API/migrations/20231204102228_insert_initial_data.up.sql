INSERT INTO "user" ("name", surname, username, email, "password", "image", isstudent, isadmin)
VALUES (
    'admin',
    'admin',
    'admin',
    'admin@mail.com',
    'admin',
    ARRAY[pg_read_binary_file('/path/in/container/images/admin.png')],
    false,
    true
);