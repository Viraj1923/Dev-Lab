import { useState } from "react";

function TaskInput({ onAddTask }) {
    const [task, setTask] = useState("");

    function handleChange(e) {
        setTask(e.target.value);
    }

    function handleSubmit() {
        const trimmedTask = task.trim();

        if (!trimmedTask) return;

        onAddTask({
            id: crypto.randomUUID(),
            text: trimmedTask,
        });

        setTask("");
    }

    return (
        <div>
            <label>
                Enter Task Here:&nbsp;
                <input
                    type="text"
                    name="task"
                    value={task}
                    onChange={handleChange}
                />
            </label>

            <button type="button" onClick={handleSubmit}>
                Add Task
            </button>
        </div>
    );
}

export default TaskInput;
