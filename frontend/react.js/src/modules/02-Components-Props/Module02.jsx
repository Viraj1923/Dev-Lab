import Header from "../../Header";
import ProfileCard from "../../ProfileCard";
import Card from "../../Card";

const user = {
  name: "Viraj",
  role: "Frontend Developer",
  isAvailable: true,
  skills: ["JavaScript", "React", "Node.js"]
};

function Module02() {
  return (
    <div>
      <h2>Module 02 — Components & Props</h2>

      <Header title="Viraj's React App" />

      <Card>
        <ProfileCard user={user} />
      </Card>
    </div>
  );
}

export default Module02;
