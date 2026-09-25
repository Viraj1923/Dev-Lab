function ProfileCard({ user }) {
  return (
    <div className="profile-card">
      <h2>{user.name}</h2>
      <p>{user.role}</p>
      <h3>Skills</h3>
      <ul>
        {user.skills.map((skill) => (
          <li key={skill}>{skill}</li>
        ))}
      </ul>
    </div>
  );
}

export default ProfileCard;