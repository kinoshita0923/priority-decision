const bcrypt = require('bcrypt');
const express = require('express');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const pool = require('../pool');
const router = express.Router();
const JWT_PASSWORD = process.env.jwt_password;

router.post('/signup/', async (req, res) => {
    const connection = await new Promise((resolve, reject) => {
        pool.getConnection((error, connection) => {
          if (error) reject(error);
          resolve(connection);
        });
    });

    // 新規ユーザの情報をusersテーブルに保存
    let sql = 'INSERT INTO Users (user_id, user_name, user_password, slack_token, model) VALUES (NULL, ?, ?, NULL, NULL)';
    let values = [req.body.user_name, bcrypt.hashSync(req.body.user_password, 10)];
    connection.query(sql, values, (err, results) => {
        if (err) {
            res.send(err);
        } else {
            res.send('Signup success');
        }
    });

    connection.end();
});

router.post('/login/', async (req, res) => {
    const connection = await new Promise((resolve, reject) => {
        pool.getConnection((error, connection) => {
          if (error) reject(error);
          resolve(connection);
        });
    });

    // ログインするユーザの情報を取得
    let sql = 'SELECT user_id, user_password FROM Users WHERE user_name = ?';
    let values = [req.body.user_name];
    let input_password = req.body.user_password;
    connection.query(sql, values, (err, results) => {
        if (err) {
            res.send(err);
        } else {
            // もしユーザがいなかった場合
            if (results.length === 0) {
                res.send('No such user');
            } else {
                let user_password = results[0].user_password;
                // パスワードがあっている場合
                if (bcrypt.compareSync(input_password, user_password)) {
                    let token = jwt.sign(
                        {
                            user_id: results[0].user_id
                        },
                        JWT_PASSWORD
                    );
                    
                    // ログインの期限を1週間に
                    res.cookie(
                        'token',
                        token,
                        {
                            httpOnly: true,
                            maxAge: 1000 * 60 * 60 * 24 * 7,
                            path: '/'
                        }
                    ).send('Login success');
                } else {
                    res.send('Wrong password');
                }
            }
        }
    });

    connection.end();
});

router.get('/check/', async (req, res) => {
    const connection = await new Promise((resolve, reject) => {
        pool.getConnection((error, connection) => {
          if (error) reject(error);
          resolve(connection);
        });
    });

    // tokenに記載されているユーザが存在するか確認
    let sql = 'SELECT * FROM Users WHERE user_id = ?';
    if (req.cookies.token != null) {
        let user_id = jwt.verify(req.cookies.token, JWT_PASSWORD).user_id;
        let values = [user_id];
        connection.query(sql, values, (err, results) => {
            if (err) {
                res.send('Error');
            } else {
                // もしtokenに記載されているユーザが存在しなかったら
                if (results.length === 0) {
                    res.send('No such user');
                } else {
                    // もしtokenに記載されているユーザが存在したらログインの期限を更新
                    let token = jwt.sign(
                        {
                            user_id: user_id
                        },
                        JWT_PASSWORD
                    );
                    res.clearCookie('token').cookie(
                        'token',
                        token,
                        {
                            httpOnly: true,
                            maxAge: 1000 * 60 * 60 * 24 * 7,
                            path: '/'
                        }
                    ).send('Check success');
                }
            }
        });
    } else {
        res.send('Check failed');
    }

    connection.end();
});

router.get('/logout/', (req, res) => {
    // ログインのtokenを削除
    res.clearCookie('token').send('Logout success');
});

module.exports = router;