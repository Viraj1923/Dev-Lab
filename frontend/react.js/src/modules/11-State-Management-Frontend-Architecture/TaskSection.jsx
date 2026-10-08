import { useReducer } from "react";
import TaskInput from "./TaskInput";
import TaskList from "./TaskList";
import TaskStats from "./TaskStats";
import taskReducer from "./taskReducer";


function TaskSection() {
    const [tasks, dispatch] = useReducer(taskReducer, []);

    function addTask(newTask) {
        dispatch({
            type: "ADD_TASK",
            payload: newTask,
        });
    }
    function deleteTask(taskID) {
        dispatch({
            type: "DELETE_TASK",
            payload: taskID,
        })
    }

    return (
        <div>
            <TaskInput onAddTask={addTask} />
            <TaskStats tasks={tasks} />
            <TaskList
                tasks={tasks}
                onDeleteTask={deleteTask}
            />

        </div>
    );
}

export default TaskSection;