const mysql = require('mysql');
require('dotenv').config();

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    timezone: 'jst',
});

pool.query(
    'CREATE TABLE IF NOT EXISTS ??(user_id INT AUTO_INCREMENT PRIMARY KEY NOT NULL, user_name TEXT, user_password TEXT, slack_token TEXT NULL, model BLOB NULL);',
    'users'
);
pool.query(
    'CREATE TABLE IF NOT EXISTS ??(task_id INT AUTO_INCREMENT PRIMARY KEY NOT NULL, task_name TEXT);',
    'tasks'
);
pool.query(
    'CREATE TABLE IF NOT EXISTS ??(genre_id INT AUTO_INCREMENT PRIMARY KEY NOT NULL, genre_name TEXT, user_id INT);',
    'genres'
);
pool.query(
    'CREATE TABLE IF NOT EXISTS ??(user_id INT, task_id int AUTO_INCREMENT PRIMARY KEY NOT NULL, start_date timestamp NULL, end_date timestamp NULL, deadline timestamp NULL, status tinyint(4), genre_id INT, deleted tinyint(4));',
    'relations'
);

module.exports = pool;
