import { useState } from "react";

function TaskInput({ onAddTask }) {
  const [task, setTask] = useState("");

  function handleAdd() {
    if (task.trim() === "") return;

    onAddTask(task);
    setTask("");
  }

  return (
    <div>
      <input
        type="text"
        placeholder="Enter task..."
        value={task}
        onChange={(e) => setTask(e.target.value)}
      />

      <button onClick={handleAdd}>
        Add
      </button>
    </div>
  );
}

export default TaskInput;