function TaskList({ tasks, onRemoveTask }) {
  return (
    <div>
      <h3>Tasks:</h3>

      {tasks.length === 0 ? (
        <p>No tasks yet. Add one above!</p>
      ) : (
        <ul>
          {tasks.map((task, index) => (
            <li key={index}>
              ☐ {task}

              <button onClick={() => onRemoveTask(index)}>
                Remove
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default TaskList;