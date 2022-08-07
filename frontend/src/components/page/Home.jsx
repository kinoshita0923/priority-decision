import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";

import Task from "../common/Task";
import AddButton from "../common/AddButton";
import css from "../../css/Home.module.css";

const Home = () => {

    const [list, setList] = useState({});
    const [genres, setGenre] = useState({});
    const [addGenreText, setAddGenre] = useState("");
    const [taskName, setTaskName] = useState("");
    const [genreName, setGenreName] = useState("");
    const [deadline, setDeadline] = useState("");
    const [importantTask, setImportantTask] = useState({});
    const [initialNetwork, setInitialNetwork] = useState(0);

    const params = new FormData();

    const changeAddGenreText = (event) => {
        setAddGenre(event.target.value);
    }

    const changeTaskName = (event) => {
        setTaskName(event.target.value);
    }

    const changeGenreName = (event) => {
        setGenreName(event.target.value);
    }

    const changeDeadline = (event) => {
        setDeadline(event.target.value);
    }

    const changeListDeadline = (listDeadline) => {
        let date = new Date(listDeadline);
        const yyyy = `${date.getFullYear()}`;
        const MM = `0${date.getMonth() + 1}`.slice(-2);
        const dd = `0${date.getDate()}`.slice(-2);
        const HH = `0${date.getHours()}`.slice(-2);
        const mm = `0${date.getMinutes()}`.slice(-2);
      
        return `${yyyy}/${MM}/${dd} ${HH}:${mm}`;
    }

    const loadMore = () => {
        axios
        .get(
            '/api/task/get/',
            {
                withCredentials: true
            }
        ).then((res) => {
            setList(res.data);
            setInitialNetwork(initialNetwork+1);
        }).catch((error) => {
            console.log(error);
        })
    }

    const getGenre = () => {
        axios
        .get(
            '/api/genre/get/',
            {
                withCredentials: true
            }
        ).then((res) => {
            setGenre(res.data);
            setInitialNetwork(initialNetwork+1);
        }).catch((error) => {
            console.log(error);
        });
    }

    const addGenre = () => {
        params.append("genre_name", addGenreText);
        axios
        .post(
            '/api/genre/add/',
            params,
            {
                withCredentials: true
            }
        ).then((res) => {
            getGenre()
        }).catch((error) => {
            console.log(error);
        });
    }

    const addTask = () => {
        params.append("task_name", taskName);
        params.append("genre_id", genreName);
        params.append("deadline", deadline);

        if (genreName === "" && taskName === "") {
            alert("ジャンルを選択もしくはタスク名を記入してください");
        } else {
            axios
            .post(
                '/api/task/add/',
                params,
                {
                    withCredentials: true
                }
            ).then((res) => {
                loadMore();
                getPriority();
            }).catch((error) => {
                console.log(error);
            });
        }
    }

    const updateTaskStatus = (data, status) => {
        params.append("task_id", Number(data));
        params.append("status", Number(status));

        axios
        .post(
            '/api/task/edit_status/',
            params,
            {
                withCredentials: true
            }
        ).then((res) => {
            loadMore();
            getPriority();
        }).catch((error) => {
            console.log(error);
        });
    }

    const deleteTask = (task_id) => {
        params.append("task_id", task_id);

        axios
        .post(
            '/api/task/delete/',
            params,
            {
                withCredentials: true
            }
        ).then((res) => {
            loadMore();
            getPriority();
        }).catch((error) => {
            console.log(error);
        });
    }

    const startTask = (task_id) => {
        params.append("task_id", task_id);

        axios
        .post(
            '/api/task/start_date',
            params,
            {
                withCredentials: true
            }
        ).then((res) => {
            loadMore();
            getPriority()
            params.delete("task_id");
        }).catch((error) => {
            params.delete("task_id");
            console.log(error);
        });
    }

    const getPriority = () => {
        axios
        .get(
            '/api/task/get/priority/',
            {
                withCredentials: true
            }
        ).then((res) => {
            setImportantTask(res.data);
            setInitialNetwork(initialNetwork+1);
        }).catch((error) => {
            alert("優先度の高いタスクを識別できませんでした。");
            console.log(error);
        })
    }

    useEffect(() => {
        axios
        .get(
            '/api/user/check/',
            {
                withCredentials: true
            }
        ).then((res) => {
            if (res.data === "Check failed") {
                window.location.href="/login";
            }
        }).catch((error) => {
            console.log(error);
        })
    }, []);

    useEffect(getPriority, []);
    useEffect(loadMore, []);
    useEffect(getGenre, []);

    return(
        <React.StrictMode>
            <div className={css.task_list}>
                {(initialNetwork<1 || importantTask.length===0)?null:(<div className={css.tasks_title}>優先順位の高いタスク</div>)}
                {(initialNetwork<1 || importantTask.length==0)?null:(<Task key={importantTask.task_id} name={importantTask.task_name} deadline={changeListDeadline(importantTask.deadline)} status={importantTask.status} task_id={importantTask.task_id} start_date={importantTask.start_date} updateTaskStatus={updateTaskStatus} deleteTask={deleteTask} startTask={startTask} ></Task>)}
                
                {(initialNetwork<1 || list.length==0)?null:(<div className={css.tasks_title}>タスク</div>)}
                <ul>
                    { (initialNetwork<1 || list.length==0)?null:Object.keys(list).map(key => { return (<li key={list[key].task_id} ><Task name={list[key].task_name} deadline={changeListDeadline(list[key].deadline)} status={list[key].status} task_id={list[key].task_id} start_date={list[key].start_date} updateTaskStatus={updateTaskStatus} deleteTask={deleteTask} startTask={startTask} /></li>)}) }
                </ul>
            </div>
            <AddButton genres={genres} addGenre={addGenre} changeAddGenre={changeAddGenreText} changeTaskName={changeTaskName} changeGenreName={changeGenreName} changeDeadline={changeDeadline} addTask={addTask} ></AddButton>
        </React.StrictMode>
    );
}

export default Home;
