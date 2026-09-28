function Card({ children }) {
  return <div className="card">{children}</div>;
}

function StatusBadge({ status }) {
  return <span>Status: {status}</span>;
}

function TeamMemberCard({ name, role, status }) {
  return (
    <div className="team-member-info">
      <h3>{name}</h3>
      <p>Role: {role}</p>
      <StatusBadge status={status} />
    </div>
  );
}

const teamMembers = [
  { id: 1, name: "Viraj", role: "Frontend Developer", status: "Active" },
  { id: 2, name: "Rahul", role: "Backend Developer", status: "Away" },
  { id: 3, name: "Amit", role: "Full Stack Developer", status: "Active" },
  { id: 4, name: "Sneha", role: "UI/UX Designer", status: "Offline" }
];

function Module07() {
  return (
    <div>
      <h2>Team Dashboard</h2>

      {teamMembers.map((member) => (
        <Card key={member.id}>
          <TeamMemberCard
            name={member.name}
            role={member.role}
            status={member.status}
          />
        </Card>
      ))}
    </div>
  );
}

export default Module07;