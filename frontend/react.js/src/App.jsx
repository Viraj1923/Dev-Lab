const user = {
  name: "Viraj",
  role: "Frontend Developer",
  isAvailable: true,
  skills: ["JavaScript", "React", "Node.js"]
};

function App() {
  return (
    <div className="profileCard">
      <h2>{user.name}</h2>
      <p>{user.role}</p>

      <h3>Skills</h3>
      <ul>
        {user.skills.map((skill) => (
          <li key={skill}>{skill}</li>
        ))}
      </ul>

      <p>
        {user.isAvailable
          ? "Available for work"
          : "Currently unavailable"}
      </p>

      {user.isAvailable && <p>Open to opportunities</p>}
    </div>
  );
}

export default App;