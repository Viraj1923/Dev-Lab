import { NavLink, Outlet } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const navigation = [
    { label: "Dashboard", to: "/" },
    { label: "Projects", to: "/projects" },
    { label: "Tasks", to: "/tasks" },
];

function AppLayout() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    function handleLogout() {
        logout();
        navigate("/login", { replace: true });
    }
    return (
        <div className="flex min-h-screen flex-col bg-slate-50 text-slate-800 md:flex-row">
            <aside className="shrink-0 bg-slate-950 p-5 text-white md:min-h-screen md:w-60 md:p-6">
                <div className="flex items-center justify-between md:block">
                    <h2 className="text-2xl font-bold tracking-tight">
                        Dev<span className="text-indigo-400">Board</span>
                    </h2>

                    <span className="rounded-full bg-slate-800 px-3 py-1 text-xs text-slate-300">
                        WORKSPACE
                    </span>
                </div>

                <p className="mb-4 mt-2 hidden text-sm text-slate-400 md:block">
                    Manage your work, simply.
                </p>

                <nav className="mt-5 flex gap-2 overflow-x-auto md:mt-9 md:flex-col">
                    {navigation.map((item) => (
                        <NavLink
                            key={item.to}
                            to={item.to}
                            end={item.to === "/"}
                            className={({ isActive }) =>
                                `shrink-0 rounded-lg px-4 py-3 text-sm font-medium transition-colors ${isActive
                                    ? "bg-indigo-600 text-white shadow-sm"
                                    : "text-slate-300 hover:bg-slate-800 hover:text-white"
                                }`
                            }
                        >
                            {item.label}
                        </NavLink>
                    ))}
                </nav>
            </aside>

            <main className="min-w-0 flex-1 p-5 sm:p-8 lg:p-10">
            
                <header className="mb-8 flex items-center justify-between border-b border-slate-200 pb-5">
                    <div>
                        <p className="text-sm text-slate-500">
                            Workspace / DevBoard
                        </p>
                        <p className="mt-1 text-sm font-medium text-slate-700">
                            Your productivity hub
                        </p>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="hidden text-right sm:block">
                            <p className="text-sm font-semibold text-slate-800">
                                {user?.name || "User"}
                            </p>
                            <p className="text-xs text-slate-500">
                                {user?.email || ""}
                            </p>
                        </div>

                        <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-indigo-100 font-semibold text-indigo-700">
                            {user?.name?.charAt(0).toUpperCase() || "U"}
                        </div>

                        <button
                            type="button"
                            onClick={handleLogout}
                            className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:border-red-200 hover:bg-red-50 hover:text-red-600"
                        >
                            Logout
                        </button>
                    </div>
                </header>
                

                <Outlet />
            </main>
        </div>
    );
}

export default AppLayout;