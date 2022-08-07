const express = require('express');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const pool = require('../pool');
const router = express.Router();

router.post('/add/', async (req, res) => {
    const connection = await new Promise((resolve, reject) => {
        pool.getConnection((error, connection) => {
            if (error) reject(error);
            resolve(connection);
        });
    });

    // genreを追加
    let sql =
        'INSERT INTO genres(genre_id, genre_name, user_id) VALUES(NULL, ?, ?);';
    let user_id = jwt.verify(
        req.cookies.token,
        process.env.jwt_password
    ).user_id;
    let values = [req.body.genre_name, user_id];
    connection.query(sql, values, (err, results) => {
        if (err) {
            res.send(err);
        } else {
            res.send('Add success');
        }
    });

    connection.end();
});

router.get('/get/', async (req, res) => {
    const connection = await new Promise((resolve, reject) => {
        pool.getConnection((error, connection) => {
            if (error) reject(error);
            resolve(connection);
        });
    });

    // genreの種類を取得
    let sql = 'SELECT * FROM genres where user_id = ? ORDER BY genre_id ASC';
    let user_id = jwt.verify(
        req.cookies.token,
        process.env.jwt_password
    ).user_id;
    let values = [user_id];
    connection.query(sql, values, (err, results) => {
        if (err) {
            res.send(err);
        } else {
            res.send(results);
        }
    });

    connection.end();
});

module.exports = router;
