import { useEffect, useState } from "react";

function Module09() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
  });

  const [formErrors, setFormErrors] = useState({});
  const [editingUser, setEditingUser] = useState(null);

  const [actionMessage, setActionMessage] = useState("");
  const [actionError, setActionError] = useState("");

  // 1. State for submit loading status
  const [submitting, setSubmitting] = useState(false);

  function clearActionFeedback() {
    setActionMessage("");
    setActionError("");
  }

  function validateForm() {
    const errors = {};

    if (!formData.name.trim()) {
      errors.name = "Name is required";
    }

    if (!formData.email.trim()) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Invalid email format";
    }

    return errors;
  }

  function handleChange(e) {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (formErrors[name]) {
      setFormErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  }

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("https://jsonplaceholder.typicode.com/users");

        if (!res.ok) {
          throw new Error("Failed to fetch users");
        }

        const data = await res.json();
        setUsers(data);
      } catch (err) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  function handleEditClick(user) {
    clearActionFeedback();
    setEditingUser(user);
    setFormData({
      name: user.name,
      email: user.email,
    });
    setFormErrors({});
  }

  // 2. Add User with submitting toggle
  async function addUser() {
    clearActionFeedback();
    setSubmitting(true);
    try {
      const res = await fetch("https://jsonplaceholder.typicode.com/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        throw new Error("Failed to add user");
      }

      const newUser = await res.json();
      setUsers((prevUsers) => [...prevUsers, newUser]);
      setFormData({ name: "", email: "" });
      setFormErrors({});
      setActionMessage("User added successfully!");
    } catch (err) {
      setActionError(err.message || "Failed to add user");
    } finally {
      setSubmitting(false);
    }
  }

  // 3. Update User with submitting toggle
  async function updateUser() {
    if (!editingUser) return;
    clearActionFeedback();
    setSubmitting(true);

    try {
      const res = await fetch(
        `https://jsonplaceholder.typicode.com/users/${editingUser.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      if (!res.ok) {
        throw new Error("Failed to update user");
      }

      const updatedUser = await res.json();

      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === editingUser.id ? { ...user, ...updatedUser } : user
        )
      );

      setFormData({ name: "", email: "" });
      setEditingUser(null);
      setFormErrors({});
      setActionMessage("User updated successfully!");
    } catch (err) {
      setActionError(err.message || "Failed to update user");
    } finally {
      setSubmitting(false);
    }
  }

  async function deleteUser(id) {
    clearActionFeedback();
    try {
      const res = await fetch(
        `https://jsonplaceholder.typicode.com/users/${id}`,
        {
          method: "DELETE",
        }
      );

      if (!res.ok) {
        throw new Error("Failed to delete user");
      }

      setUsers((prevUsers) => prevUsers.filter((user) => user.id !== id));
      setActionMessage("User deleted successfully!");
    } catch (err) {
      setActionError(err.message || "Failed to delete user");
    }
  }

  function handleSubmit(e) {
    e.preventDefault();

    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    if (editingUser) {
      updateUser();
    } else {
      addUser();
    }
  }

  if (loading) {
    return <p>Loading users...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <h1>User Management</h1>

      {actionMessage && (
        <p style={{ color: "green", fontWeight: "bold" }}>{actionMessage}</p>
      )}
      {actionError && (
        <p style={{ color: "red", fontWeight: "bold" }}>{actionError}</p>
      )}

      <form onSubmit={handleSubmit}>
        <div>
          <label>
            Name:
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter name"
            />
          </label>
          {formErrors.name && (
            <span style={{ color: "red", marginLeft: "8px" }}>
              {formErrors.name}
            </span>
          )}
        </div>

        <div style={{ marginTop: "8px" }}>
          <label>
            Email:
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter email"
            />
          </label>
          {formErrors.email && (
            <span style={{ color: "red", marginLeft: "8px" }}>
              {formErrors.email}
            </span>
          )}
        </div>

        <br />

        {/* 4. Disable button and update text while request is pending */}
        <button type="submit" disabled={submitting}>
          {submitting
            ? "Saving..."
            : editingUser
            ? "Update User"
            : "Add User"}
        </button>

        {editingUser && (
          <button
            type="button"
            disabled={submitting}
            onClick={() => {
              setEditingUser(null);
              setFormData({ name: "", email: "" });
              setFormErrors({});
              clearActionFeedback();
            }}
            style={{ marginLeft: "8px" }}
          >
            Cancel
          </button>
        )}
      </form>

      <hr />

      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search users..."
      />

      <h2>Users List</h2>
      {filteredUsers.map((user) => (
        <div key={user.id}>
          <h3>{user.name}</h3>
          <p>{user.email}</p>

          <button
            onClick={() => handleEditClick(user)}
            disabled={submitting}
          >
            Edit
          </button>
          <button
            onClick={() => deleteUser(user.id)}
            disabled={submitting}
            style={{ marginLeft: "8px" }}
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}

export default Module09;