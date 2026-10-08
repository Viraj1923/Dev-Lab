function TaskList({ tasks, onDeleteTask }) {
    return (
        <div>
            <ul>
                {tasks.map((task) => (
                    <li key={task.id}>
                        {task.text}{" "}
                        <button
                            type="button"
                            onClick={() => onDeleteTask(task.id)}
                        >
                            Delete
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default TaskList;
