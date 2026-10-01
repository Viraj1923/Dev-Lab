import {
    BrowserRouter,
    Routes,
    Route,
    NavLink,
    Link,
    useParams,
    useNavigate,
    Outlet
} from "react-router-dom";

function Home() {
    const navigate = useNavigate();

    return (
        <div>
            <h2>Home Page</h2>
            <button onClick={() => navigate("/projects")}>Go to Projects</button>
        </div>
    );
}

function About() {
    return <h2>About Page</h2>;
}

function Projects() {
    return <h2>Projects Page</h2>;
}

function User() {
    const { id } = useParams();
    return (
        <div>
            <h2>User Details</h2>
            <p>User ID: {id}</p>
        </div>
    );
}

function NotFound() {
    return <h2>404 - Page Not Found</h2>;
}

function Dashboard() {
    return (
        <div>
            <h2>Dashboard Page</h2>
            <nav>
                <Link to="/dashboard/profile">Profile</Link> |{" "}
                <Link to="/dashboard/settings">Settings</Link>
            </nav>
            <hr />
            <Outlet />
        </div>
    );
}

function Profile() {
    return <h3>Profile Page</h3>;
}

function Settings() {
    return <h3>Settings Page</h3>;
}

function NavBar() {
    return (
        <nav>
            <NavLink
                to="/"
                className={({ isActive }) => (isActive ? "active" : "")}
            >
                Home
            </NavLink>{" "}
            |{" "}
            <NavLink
                to="/about"
                className={({ isActive }) => (isActive ? "active" : "")}
            >
                About
            </NavLink>{" "}
            |{" "}
            <NavLink
                to="/projects"
                className={({ isActive }) => (isActive ? "active" : "")}
            >
                Projects
            </NavLink>{" "}
            |{" "}
            <NavLink
                to="/users/101"
                className={({ isActive }) => (isActive ? "active" : "")}
            >
                User 101
            </NavLink>{" "}
            |{" "}
            <NavLink
                to="/dashboard"
                className={({ isActive }) => (isActive ? "active" : "")}
            >
                Dashboard
            </NavLink>
        </nav>
    );
}

function Module08() {
    return (
        <BrowserRouter>
            <NavBar />
            <hr />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/projects" element={<Projects />} />

                <Route path="/users/:id" element={<User />} />

                <Route path="/dashboard" element={<Dashboard />}>
                    <Route path="profile" element={<Profile />} />
                    <Route path="settings" element={<Settings />} />
                </Route>

                <Route path="*" element={<NotFound />} />
            </Routes>
        </BrowserRouter>
    );
}

export default Module08;