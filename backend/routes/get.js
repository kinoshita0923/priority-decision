const express = require('express');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const pool = require('../pool');
const router = express.Router();

router.get('/', async (req, res) => {
    const connection = await new Promise((resolve, reject) => {
        pool.getConnection((error, connection) => {
          if (error) reject(error);
          resolve(connection);
        });
    });

    // ユーザのタスクを取得
    let sql = 'SELECT * FROM tasks inner join relations on tasks.task_id = relations.task_id join genres on genres.genre_id = relations.genre_id where relations.user_id = ? and relations.deleted != 1 ORDER BY relations.deadline ASC;';
    let user_id = jwt.verify(req.cookies.token, process.env.jwt_password).user_id;
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

router.get('/priority/', async (req,res) => {
    const connection = await new Promise((resolve, reject) => {
        pool.getConnection((error, connection) => {
          if (error) reject(error);
          resolve(connection);
        });
    });

    let user_id = jwt.verify(req.cookies.token, process.env.jwt_password).user_id;
    connection.beginTransaction((err) => {
        if (err) {
            res.send(err);
            throw err;
        }

        // ユーザが追加したジャンルの数を取得
        let sql = 'SELECT DISTINCT genre_id from genres where user_id = ?;';
        let values = [user_id];
        let genres_list;
        connection.query(sql, values, (err, results) => {
            if (err) {
                return connection.rollback(() => {
                    res.send(err);
                    throw err;
                });
            }
            genres_list = results;

            // それぞれのジャンルのタスクにかかった平均を導出
            let averages = {};
            for (let genre in genres_list) {
                sql = 'SELECT start_date, end_date, genre_id from relations where user_id = ? and end_date IS NOT NULL and start_date IS NOT NULL and genre_id = ?;';
                values = [user_id, genres_list[genre]];
                connection.query(sql, values, (err, results) => {
                    if (err) {
                        return connection.rollback(() => {
                            res.send(err);
                            throw err;
                        });
                    }
                    let sum = 0;
                    let denominator = results.length;
                    for (let j = 0; j < results.length; j++) {
                        let start_date = new Date(results[j].start_date);
                        let end_date = new Date(results[j].end_date);
                        if (start_date > end_date) {
                            denominator--;
                        } else {
                            let difference = end_date.getTime() - start_date.getTime();
                            sum += difference;
                        }
                    }
                    let average = sum / denominator;
                    averages[genres_list[genre]["genre_id"]] = average;
                });
            }
    
            // それぞれのジャンルのタスクにかかった時間の平均から優先順位の高いタスクを導出
            let importantTask;
            let importantTaskId;
            sql = 'SELECT * FROM tasks natural join relations WHERE user_id = ? and deleted = ?;';
            values = [user_id, 0];
            connection.query(sql, values, (err, results) => {
                if (err) {
                    return connection.rollback(() => {
                        res.send(err);
                        throw err;
                    });
                } else {
                    connection.commit((err) => {
                        if (err) {
                            return connection.rollback(() => {
                            throw err;
                            });
                        }
                    });
                }
        
                for (let j = 0; j < results.length; j++) {
                    let deadline = new Date(results[j].deadline);
                    let now = new Date();
                    let remain = deadline.getTime() - now.getTime();
                    let priority;
                    if (averages[results[j].genre_id] === NaN)
                        priority = remain - averages[results[j].genre_id];
                    else
                        priority = remain - 0;
                    if (j === 0) {
                        importantTask = priority;
                        importantTaskId = j;
                    }else if (priority < importantTask) {
                        importantTask = priority;
                        importantTaskId = j;
                    }
                }
                res.send(results[importantTaskId]);
            })
        });
    });

    connection.end();
});

module.exports = router;