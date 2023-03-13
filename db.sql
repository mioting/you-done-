DROP TABLE IF EXISTS admin;
DROP TABLE IF EXISTS files;
DROP TABLE IF EXISTS user_project;
DROP TABLE IF EXISTS user_task;
DROP TABLE IF EXISTS comments;
DROP TABLE IF EXISTS subtasks;
DROP TABLE IF EXISTS tasks;
DROP TABLE IF EXISTS projects;
DROP TABLE IF EXISTS users;


CREATE TABLE users(
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    username VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    title VARCHAR(255) NOT NULL,
    is_manager BOOLEAN NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    is_deleted BOOLEAN
);

CREATE TABLE projects(
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    start_date DATE NOT NULL,
    deadline DATE NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    user_id INTEGER,
    FOREIGN KEY (user_id) REFERENCES users(id),
    is_completed BOOLEAN,
    is_deleted BOOLEAN
);

CREATE TABLE tasks(
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    status VARCHAR(255),
    start_date DATE,
    deadline DATE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    project_id INTEGER,
    FOREIGN KEY (project_id) REFERENCES projects(id),
    is_deleted BOOLEAN
);

CREATE TABLE subtasks(
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    status VARCHAR(255),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    task_id INTEGER,
    FOREIGN KEY (task_id) REFERENCES tasks(id),
    user_id INTEGER,
    FOREIGN KEY (user_id) REFERENCES users(id),
    is_deleted BOOLEAN
);


CREATE TABLE comments(
    id SERIAL PRIMARY KEY,
    content TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    user_id INTEGER,
    FOREIGN KEY (user_id) REFERENCES users(id),
    task_id INTEGER,
    FOREIGN KEY (task_id) REFERENCES tasks(id),
    is_deleted BOOLEAN
);


CREATE TABLE user_task(
    id SERIAL PRIMARY KEY,
    task_id INTEGER,
    FOREIGN KEY (task_id) REFERENCES tasks(id),
    user_id INTEGER,
    FOREIGN KEY (user_id) REFERENCES users(id),
    is_deleted BOOLEAN
);

CREATE TABLE user_project(
    id SERIAL PRIMARY KEY,
    project_id INTEGER,
    FOREIGN KEY (project_id) REFERENCES projects(id),
    user_id INTEGER,
    FOREIGN KEY (user_id) REFERENCES users(id),
    is_deleted BOOLEAN
);

CREATE TABLE files(
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    comment_id INT,
    FOREIGN KEY (comment_id) REFERENCES comments(id),
    is_deleted BOOLEAN
);

CREATE TABLE admin(
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL
);



-- select * from users;
-- select * from projects;
-- select * from tasks;
-- select * from subtasks;
-- select * from comments;
-- select * from subtask_comments;
-- select * from user_project;
-- select * from user_task;
-- select * from files;
-- select * from admin;

-- INSERT INTO user_task (user_id, task_id) VALUES (6, 1), (6, 2);

-- SELECT 
--     tasks.id, tasks.name, 
--     COALESCE(json_agg(json_build_object('id', users.id, 'username', users.username)) FILTER (WHERE users.id IS NOT NULL), '[]') AS users
-- FROM tasks 
-- LEFT JOIN user_task ON tasks.id = user_task.task_id
-- LEFT JOIN users ON user_task.user_id = users.id
-- GROUP BY tasks.id
-- ORDER BY tasks.id;