import { useState } from "react";

const users = [
  { id: 1, name: "Viraj", role: "Frontend Developer", active: true },
  { id: 2, name: "Rahul", role: "Backend Developer", active: false },
  { id: 3, name: "Amit", role: "Full Stack Developer", active: true },
  { id: 4, name: "Sneha", role: "UI/UX Designer", active: true }
];

function App() {
  const [search, setSearch] = useState("");
  const [showActiveOnly, setShowActiveOnly] = useState(false);

  const filteredUsers = users.filter((user) => {
    const matchesSearch = user.name
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesActive = showActiveOnly ? user.active : true;

    return matchesSearch && matchesActive;
  });

  return (
    <div>
      <h2>User Directory</h2>

      <div>
        <input
          type="text"
          placeholder="Search by name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div>
        <button onClick={() => setShowActiveOnly((prev) => !prev)}>
          {showActiveOnly ? "Show All Users" : "Show Active Users Only"}
        </button>
      </div>

      {filteredUsers.length === 0 ? (
        <p>No users found.</p>
      ) : (
        <ul>
          {filteredUsers.map((user) => (
            <li key={user.id}>
              <strong>{user.name}</strong>
              <div>{user.role}</div>
              <small>
                Status: {user.active ? "Active" : "Inactive"}
              </small>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default App;