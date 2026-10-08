function TaskStats({ tasks }) {
  const totalTasks = tasks.length;

  return (
    <div>
      <p>Total Tasks: {totalTasks}</p>
    </div>
  );
}

export default TaskStats;