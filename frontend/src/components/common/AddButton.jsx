import React from 'react';
import { createRef } from 'react';

import AddForm from '../common/AddForm';
import buttonCss from '../../css/AddButton.module.css';
import formCss from '../../css/AddForm.module.css';

const AddButton = (props) => {
    const addTaskStatusRef = createRef(null);

    const changeAddTaskStatus = () => {
        let current = addTaskStatusRef.current;
        current.focus();
    };

    return (
        <React.StrictMode>
            <label htmlFor="addTaskStatus" className={buttonCss.add_button}>
                +
            </label>
            <input
                type="checkbox"
                id="addTaskStatus"
                ref={addTaskStatusRef}
                className={formCss.add_checkbox}
            />
            <AddForm
                changeAddTaskStatus={changeAddTaskStatus}
                genres={props.genres}
                addGenre={props.addGenre}
                changeAddGenre={props.changeAddGenre}
                changeTaskName={props.changeTaskName}
                changeGenreName={props.changeGenreName}
                changeDeadline={props.changeDeadline}
                addTask={props.addTask}
            ></AddForm>
        </React.StrictMode>
    );
};

export default AddButton;
