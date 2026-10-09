
import { useMemo, useState } from "react";

const initialProjects = [
    {
        id: 1,
        name: "Website Redesign",
        description: "Refresh the website experience with a modern, responsive interface.",
        status: "In Progress",
        color: "bg-indigo-500",
        initials: "WR",
    },
    {
        id: 2,
        name: "Mobile App",
        description: "Build a simple and intuitive mobile experience for our users.",
        status: "Planning",
        color: "bg-sky-500",
        initials: "MA",
    },
    {
        id: 3,
        name: "API Integration",
        description: "Connect application services and streamline data exchange.",
        status: "Completed",
        color: "bg-emerald-500",
        initials: "API",
    },
];

const statusStyles = {
    Planning: "bg-slate-100 text-slate-600",
    "In Progress": "bg-amber-50 text-amber-700",
    Completed: "bg-emerald-50 text-emerald-700",
};

function Projects() {
    const [projects, setProjects] = useState(initialProjects);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [form, setForm] = useState({
        name: "",
        description: "",
        status: "Planning",
    });

    const filteredProjects = useMemo(() => {
        return projects.filter((project) => {
            const matchesSearch =
                project.name.toLowerCase().includes(search.toLowerCase()) ||
                project.description.toLowerCase().includes(search.toLowerCase());

            const matchesStatus =
                statusFilter === "All" || project.status === statusFilter;

            return matchesSearch && matchesStatus;
        });
    }, [projects, search, statusFilter]);

    function handleCreateProject(event) {
        event.preventDefault();

        const name = form.name.trim();
        if (!name) return;

        const newProject = {
            id: Date.now(),
            name,
            description: form.description.trim() || "No description added yet.",
            status: form.status,
            color: "bg-violet-500",
            initials: name
                .split(/\s+/)
                .slice(0, 2)
                .map((word) => word[0].toUpperCase())
                .join(""),
        };

        setProjects((current) => [newProject, ...current]);
        setForm({ name: "", description: "", status: "Planning" });
        setIsModalOpen(false);
    }

    function handleDeleteProject(id) {
        const confirmed = window.confirm(
            "Are you sure you want to delete this project?"
        );

        if (confirmed) {
            setProjects((current) =>
                current.filter((project) => project.id !== id)
            );
        }
    }

    return (
        <div className="space-y-8">
            {/* Page heading */}
            <section className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-indigo-600">
                        Workspace
                    </p>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                        Projects
                    </h1>
                    <p className="mt-2 text-sm leading-6 text-slate-500">
                        Plan, organize, and keep all your work moving forward.
                    </p>
                </div>

                <button
                    onClick={() => setIsModalOpen(true)}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                    <span className="text-lg leading-none">+</span>
                    New Project
                </button>
            </section>

            {/* Summary */}
            <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                {[
                    {
                        label: "Total Projects",
                        count: projects.length,
                        color: "text-indigo-600",
                    },
                    {
                        label: "In Progress",
                        count: projects.filter((p) => p.status === "In Progress").length,
                        color: "text-amber-600",
                    },
                    {
                        label: "Completed",
                        count: projects.filter((p) => p.status === "Completed").length,
                        color: "text-emerald-600",
                    },
                ].map((item) => (
                    <article
                        key={item.label}
                        className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
                    >
                        <p className="text-sm font-medium text-slate-500">
                            {item.label}
                        </p>
                        <p className={`mt-3 text-3xl font-bold ${item.color}`}>
                            {item.count}
                        </p>
                    </article>
                ))}
            </section>

            {/* Search and filters */}
            <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div className="relative w-full lg:max-w-md">
                        <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-lg text-slate-400">
                            ⌕
                        </span>
                        <input
                            type="search"
                            value={search}
                            onChange={(event) => setSearch(event.target.value)}
                            placeholder="Search projects..."
                            aria-label="Search projects"
                            className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm outline-none transition placeholder:text-slate-400 focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-50"
                        />
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                        {["All", "Planning", "In Progress", "Completed"].map((status) => (
                            <button
                                key={status}
                                onClick={() => setStatusFilter(status)}
                                aria-pressed={statusFilter === status}
                                className={`rounded-lg px-3 py-2 text-sm font-medium transition ${statusFilter === status
                                        ? "bg-indigo-600 text-white"
                                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                                    }`}
                            >
                                {status}
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            {/* Project cards */}
            <section>
                <div className="mb-5 flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-slate-900">
                        All Projects
                    </h2>
                    <span className="text-sm text-slate-500">
                        {filteredProjects.length}{" "}
                        {filteredProjects.length === 1 ? "project" : "projects"}
                    </span>
                </div>

                {filteredProjects.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center">
                        <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-indigo-50 text-2xl text-indigo-600">
                            ▦
                        </div>
                        <h3 className="mt-4 font-semibold text-slate-900">
                            No projects found
                        </h3>
                        <p className="mt-2 text-sm text-slate-500">
                            Try another search or create a new project.
                        </p>
                        <button
                            onClick={() => {
                                setSearch("");
                                setStatusFilter("All");
                            }}
                            className="mt-4 text-sm font-semibold text-indigo-600 hover:text-indigo-700"
                        >
                            Clear filters
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-5 lg:grid-cols-2 2xl:grid-cols-3">
                        {filteredProjects.map((project) => (
                            <article
                                key={project.id}
                                className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-1 hover:border-indigo-200 hover:shadow-lg sm:p-6"
                            >
                                <div className="flex items-start justify-between gap-3">
                                    <div
                                        className={`flex size-12 shrink-0 items-center justify-center rounded-xl ${project.color} text-sm font-bold text-white shadow-sm`}
                                    >
                                        {project.initials}
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <span
                                            className={`rounded-full px-3 py-1.5 text-xs font-semibold ${statusStyles[project.status]}`}
                                        >
                                            {project.status}
                                        </span>
                                        <button
                                            onClick={() => handleDeleteProject(project.id)}
                                            aria-label={`Delete ${project.name}`}
                                            title="Delete project"
                                            className="rounded-lg px-2 py-1 text-slate-400 transition hover:bg-red-50 hover:text-red-600"
                                        >
                                            ×
                                        </button>
                                    </div>
                                </div>

                                <h3 className="mt-5 text-lg font-semibold text-slate-900 transition group-hover:text-indigo-700">
                                    {project.name}
                                </h3>
                                <p className="mt-2 min-h-12 text-sm leading-6 text-slate-500">
                                    {project.description}
                                </p>

                                <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4">
                                    <span className="text-xs text-slate-400">
                                        Project workspace
                                    </span>
                                    <span className="text-sm font-semibold text-indigo-600">
                                        Manage project <span aria-hidden="true">→</span>
                                    </span>
                                </div>
                            </article>
                        ))}
                    </div>
                )}
            </section>

            {/* Create project modal */}
            {isModalOpen && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/50 p-4 backdrop-blur-sm"
                    onMouseDown={(event) => {
                        if (event.target === event.currentTarget) {
                            setIsModalOpen(false);
                        }
                    }}
                >
                    <section
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="create-project-title"
                        className="my-auto w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl sm:p-8"
                    >
                        <div className="flex items-start justify-between gap-4">
                            <div>
                                <h2
                                    id="create-project-title"
                                    className="text-xl font-bold text-slate-900"
                                >
                                    Create a project
                                </h2>
                                <p className="mt-2 text-sm text-slate-500">
                                    Give your next idea a place to grow.
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={() => setIsModalOpen(false)}
                                aria-label="Close dialog"
                                className="rounded-lg px-3 py-1 text-xl text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                            >
                                ×
                            </button>
                        </div>

                        <form onSubmit={handleCreateProject} className="mt-6 space-y-5">
                            <div>
                                <label
                                    htmlFor="project-name"
                                    className="mb-2 block text-sm font-medium text-slate-700"
                                >
                                    Project name <span className="text-red-500">*</span>
                                </label>
                                <input
                                    id="project-name"
                                    autoFocus
                                    required
                                    maxLength={100}
                                    value={form.name}
                                    onChange={(event) =>
                                        setForm({ ...form, name: event.target.value })
                                    }
                                    placeholder="e.g. Website Redesign"
                                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50"
                                />
                            </div>

                            <div>
                                <label
                                    htmlFor="project-description"
                                    className="mb-2 block text-sm font-medium text-slate-700"
                                >
                                    Description
                                </label>
                                <textarea
                                    id="project-description"
                                    rows={3}
                                    maxLength={500}
                                    value={form.description}
                                    onChange={(event) =>
                                        setForm({ ...form, description: event.target.value })
                                    }
                                    placeholder="What is this project about?"
                                    className="w-full resize-y rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50"
                                />
                            </div>

                            <div>
                                <label
                                    htmlFor="project-status"
                                    className="mb-2 block text-sm font-medium text-slate-700"
                                >
                                    Initial status
                                </label>
                                <select
                                    id="project-status"
                                    value={form.status}
                                    onChange={(event) =>
                                        setForm({ ...form, status: event.target.value })
                                    }
                                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50"
                                >
                                    <option>Planning</option>
                                    <option>In Progress</option>
                                    <option>Completed</option>
                                </select>
                            </div>

                            <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                                >
                                    Create Project
                                </button>
                            </div>
                        </form>
                    </section>
                </div>
            )}
        </div>
    );
}

export default Projects;
