function Module01() {
  const name = "Viraj";
  const course = "React";

  const user = {
    name: "Viraj",
    age: 22,
    isStudent: true
  };

  const skills = ["JavaScript", "React", "Node.js"];

  return (
    <div>
      <h2>Module 01 — Fundamentals & JSX</h2>

      <p>Hello {name}, Welcome to {course}</p>

      <h3>User</h3>
      <p>Name: {user.name}</p>
      <p>Age: {user.age}</p>
      <p>Student: {user.isStudent ? "Yes" : "No"}</p>

      <h3>Skills</h3>
      <ul>
        {skills.map((skill) => (
          <li key={skill}>{skill}</li>
        ))}
      </ul>

      {user.isStudent && <p>Currently studying React.</p>}
    </div>
  );
}

export default Module01;
