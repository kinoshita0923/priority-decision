const express = require('express');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const pool = require('../pool');
const router = express.Router();
const get = require('./get');

router.post('/add/', async (req, res) => {
    const connection = await new Promise((resolve, reject) => {
        pool.getConnection((error, connection) => {
            if (error) reject(error);
            resolve(connection);
        });
    });

    // トランザクション処理を開始
    connection.beginTransaction((err) => {
        if (err) {
            res.send(err);
            throw err;
        }

        // タスクの名前をtasksテーブルに保存
        let sql = 'INSERT INTO tasks(task_id, task_name) VALUES(NULL, ?);';
        let values = [req.body.task_name];
        connection.query(sql, values, (err, results) => {
            if (err) {
                return connection.rollback(() => {
                    res.send(err);
                    throw err;
                });
            }

            // relationsテーブルにタスクの情報を保存
            let user_id = jwt.verify(
                req.cookies.token,
                process.env.jwt_password
            ).user_id;
            sql =
                'INSERT INTO relations(user_id, task_id, start_date, end_date, deadline, status, genre_id, deleted) VALUES(?, NULL, NULL, NULL, ?, ?, ?, ?);';
            values = [
                user_id,
                req.body.deadline,
                false,
                req.body.genre_id,
                false,
            ];
            connection.query(sql, values, (err, results) => {
                if (err) {
                    return connection.rollback(() => {
                        res.send(err);
                        throw err;
                    });
                }
                connection.commit((err) => {
                    if (err) {
                        return connection.rollback(() => {
                            res.send(err);
                            throw err;
                        });
                    } else {
                        res.send('Add Success');
                    }
                });
            });
        });
    });

    connection.end();
});

router.post('/edit_status/', async (req, res) => {
    const connection = await new Promise((resolve, reject) => {
        pool.getConnection((error, connection) => {
            if (error) reject(error);
            resolve(connection);
        });
    });

    let user_id = jwt.verify(
        req.cookies.token,
        process.env.jwt_password
    ).user_id;
    let status = req.body.status;
    let sql, values;

    // タスクが完了しているかによって更新する情報を変更
    if (status == 1) {
        sql =
            'UPDATE relations SET status = ?, end_date = ? WHERE task_id = ? and user_id = ?;';
        let currentDate = new Date();
        values = [req.body.status, currentDate, req.body.task_id, user_id];
    } else {
        sql =
            'UPDATE relations SET status = ? WHERE task_id = ? and user_id = ?;';
        values = [req.body.status, req.body.task_id, user_id];
    }

    connection.query(sql, values, (err, results) => {
        if (err) {
            res.send(err);
        } else {
            res.send('Edit success');
        }
    });

    connection.end();
});

router.post('/start_date/', async (req, res) => {
    const connection = await new Promise((resolve, reject) => {
        pool.getConnection((error, connection) => {
            if (error) reject(error);
            resolve(connection);
        });
    });

    // ユーザがタスクを開始した時間をrelationsテーブルに保存
    let user_id = jwt.verify(
        req.cookies.token,
        process.env.jwt_password
    ).user_id;
    let sql =
        'UPDATE relations SET start_date = ? WHERE task_id =? and user_id = ?;';
    let currentDate = new Date();
    let values = [currentDate, req.body.task_id, user_id];
    connection.query(sql, values, (err, results) => {
        if (err) {
            res.send(err);
        } else {
            res.send('Edit success');
        }
    });

    connection.end();
});

router.post('/delete/', async (req, res) => {
    const connection = await new Promise((resolve, reject) => {
        pool.getConnection((error, connection) => {
            if (error) reject(error);
            resolve(connection);
        });
    });

    // 削除したタスクはdeletedを1に
    let sql =
        'UPDATE relations SET deleted = ? WHERE task_id = ? and user_id = ?;';
    let user_id = jwt.verify(
        req.cookies.token,
        process.env.jwt_password
    ).user_id;
    let values = [1, req.body.task_id, user_id];
    connection.query(sql, values, (err, results) => {
        if (err) {
            res.send(err);
        } else {
            res.send('Delete success');
        }
    });

    connection.end();
});

router.use('/get/', get);

module.exports = router;
