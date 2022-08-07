import { Link } from 'react-router-dom';
import React from 'react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import css from '../../css/Signup.module.css';

const Signup = () => {
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const params = new FormData();

    useEffect(() => {
        axios
            .get('/api/user/check/', {
                withCredentials: true,
            })
            .then((res) => {
                if (res.data === 'Check success') {
                    window.location.href = '/home';
                }
            })
            .catch((error) => {});
    }, []);

    const changeName = (event) => {
        setName(event.target.value);
    };

    const changePassword = (event) => {
        setPassword(event.target.value);
    };

    const login = () => {
        if (name !== '' && password !== '') {
            axios
                .post('/api/user/login/', params, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                })
                .then((res) => {
                    if (res.data === 'Login success') {
                        window.location.href = '/home';
                    } else {
                        alert('パスワードを間違えています');
                    }
                })
                .catch(() => {
                    params.delete('user_name');
                    params.delete('user_password');
                    alert('通信エラー');
                });
        }
    };

    const submit = (event) => {
        event.preventDefault();
        if (name !== '' && password !== '') {
            params.append('user_name', name);
            params.append('user_password', password);

            axios
                .post('/api/user/signup/', params, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                })
                .then((res) => {
                    if (res.data == 'Signup success') {
                        login();
                    }
                })
                .catch((error) => {
                    alert('すでに同じユーザ名が存在しています');
                });
        } else if (name === '' && password === '') {
            alert('ユーザー名とパスワードを入力してください');
        } else if (name === '') {
            alert('ユーザー名が入力されていません');
        } else {
            alert('パスワードが入力されていません');
        }
    };

    return (
        <React.StrictMode>
            <div className={css.background}>
                <div className={css.box}>
                    <h2>Sign Up</h2>
                    <div className={css.input_box}>
                        <label htmlFor="name">ユーザー名</label>
                        <input type="text" id="name" onChange={changeName} />
                    </div>
                    <div className={css.input_box}>
                        <label htmlFor="password">パスワード</label>
                        <input
                            type="password"
                            id="password"
                            onChange={changePassword}
                        />
                    </div>
                    <Link className={css.link} to="/login">
                        ログインへ
                    </Link>
                    <input
                        type="submit"
                        value="Sign Up"
                        className={css.submit}
                        onClick={submit}
                    />
                </div>
            </div>
        </React.StrictMode>
    );
};

export default Signup;
