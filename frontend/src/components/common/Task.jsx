import React from "react";

import css from "../../css/Task.module.css";

const Task = (props) => {

    const changeStatus = (event) => {
        props.updateTaskStatus(props.task_id, (event.currentTarget.checked)?1:0);
    }

    const startDate = () => {
        props.startTask(props.task_id)
    }

    return (
        <React.StrictMode>
            <label htmlFor={props.task_id} className={css.task}>
                {(<input type="checkbox" className={css.status} id={props.task_id} checked={Boolean(props.status)} onChange={changeStatus} />)}
                <div className={css.task_name}>{props.name}</div>
                <div className={css.deadline}>{props.deadline}</div>

                { (props.start_date == null)?( <button className={css.start_button} onClick={startDate} >開始</button> ):null}
                {
                    (props.start_date == null)?
                        (
                            <button className={css.delete_button1} onClick={ () => props.deleteTask(props.task_id) } >
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" className={css.trash} ><path d="M135.2 17.69C140.6 6.848 151.7 0 163.8 0H284.2C296.3 0 307.4 6.848 312.8 17.69L320 32H416C433.7 32 448 46.33 448 64C448 81.67 433.7 96 416 96H32C14.33 96 0 81.67 0 64C0 46.33 14.33 32 32 32H128L135.2 17.69zM394.8 466.1C393.2 492.3 372.3 512 346.9 512H101.1C75.75 512 54.77 492.3 53.19 466.1L31.1 128H416L394.8 466.1z"/></svg>
                            </button>
                        ):(
                            <button className={css.delete_button2} onClick={ () => props.deleteTask(props.task_id) } >
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" className={css.trash} ><path d="M135.2 17.69C140.6 6.848 151.7 0 163.8 0H284.2C296.3 0 307.4 6.848 312.8 17.69L320 32H416C433.7 32 448 46.33 448 64C448 81.67 433.7 96 416 96H32C14.33 96 0 81.67 0 64C0 46.33 14.33 32 32 32H128L135.2 17.69zM394.8 466.1C393.2 492.3 372.3 512 346.9 512H101.1C75.75 512 54.77 492.3 53.19 466.1L31.1 128H416L394.8 466.1z"/></svg>
                            </button>
                        )
                }
            </label>
        </React.StrictMode>
    )
}

export default Task;