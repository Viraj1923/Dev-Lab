import Header from "./Header";
import Card from "./Card";
import ProfileCard from "./ProfileCard";
import Footer from "./Footer";

const user = {
  name: "Viraj",
  role: "Frontend Developer",
  isAvailable: true,
  skills: ["JavaScript", "React", "Node.js"]
};

function App() {
  return (
    <div>
      <Header title="User Profile" />
      <Card>
        <ProfileCard user={user} />
      </Card>
      <Footer />
    </div>
  );
}

export default App;