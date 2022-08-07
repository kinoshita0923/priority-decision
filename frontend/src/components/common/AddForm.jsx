import React from "react";

import css from "../../css/AddForm.module.css";

const AddForm = (props) => {
    return (
        <React.StrictMode>
            <div className={css.form}>
                <div>
                    <label htmlFor="task_name">タスク名:</label>
                    <input type="text" id="task_name" className={css.task_name} onChange={ props.changeTaskName } />
                </div>
                <div>
                    <label htmlFor="genre">ジャンル:</label>
                    <select name="genre" id="genre" className={css.genre} onChange={ props.changeGenreName }>
                        <option value="">--</option>
                        { (props.genres.length === 0)?null:(Object.keys(props.genres).map(key => {return (<option key={props.genres[key].genre_id} value={props.genres[key].genre_id} > {props.genres[key].genre_name} </option> )})) }
                    </select><br></br>
                    <label htmlFor="addGenre" className={css.add_genre}>ジャンルを追加</label>
                    <input type="text" id="addGenre" className={css.add_genre_text} onChange={ props.changeAddGenre } />
                    <input type="submit" className={css.add_genre_button} value="追加" onClick={ props.addGenre } />
                </div>
                <div>
                    <label htmlFor="deadline">〆切:</label>
                    <input type="datetime-local" id="deadline" className={css.deadline} onChange={ props.changeDeadline } />
                </div>
                <div>
                    <label htmlFor="addTaskStatus" className={css.submit} onClick={() => {props.addTask();}} >追加</label>
                </div>
            </div>
            <label className={css.back} htmlFor="addTaskStatus"></label>
        </React.StrictMode>
    );
}

export default AddForm;