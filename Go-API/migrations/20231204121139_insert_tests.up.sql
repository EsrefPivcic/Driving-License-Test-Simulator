INSERT INTO public.test (title, "description", questions, category, duration, "image") VALUES
('A Category', 'A and A1 category (motorcycle and moped)', 
ARRAY[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40], 
'A', 50, ARRAY[pg_read_binary_file('/path/in/container/images/motor.png')]);