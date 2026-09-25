import { useState } from "react";
import TaskInput from "../../TaskInput";
import TaskList from "../../TaskList";

function Module03() {
  const [tasks, setTasks] = useState([]);

  function addTask(task) {
    if (task.trim() === "") return;
    setTasks((prevTasks) => [...prevTasks, task]);
  }

  function removeTask(indexToDelete) {
    setTasks((prevTasks) =>
      prevTasks.filter((_, index) => index !== indexToDelete)
    );
  }

  return (
    <div>
      <h2>Module 03 — State & Events</h2>

      <TaskInput onAddTask={addTask} />

      <TaskList
        tasks={tasks}
        onRemoveTask={removeTask}
      />
    </div>
  );
}

export default Module03;
