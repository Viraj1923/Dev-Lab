import { useCallback, useEffect, useMemo, useState } from "react";
import { createTask, deleteTask, getProjectTasks, updateTask } from "../api/tasks";
import { getProjects } from "../api/projects";

const STATUS_OPTIONS = [
    { value: "todo", label: "To Do" },
    { value: "in_progress", label: "In Progress" },
    { value: "completed", label: "Completed" },
];

const STATUS_STYLES = {
    todo: "bg-slate-100 text-slate-600",
    in_progress: "bg-indigo-50 text-indigo-700",
    completed: "bg-emerald-50 text-emerald-700",
};

const EMPTY_FORM = {
    title: "",
    description: "",
    project_id: "",
    status: "todo",
};

function Tasks() {
    const [tasks, setTasks] = useState([]);
    const [projects, setProjects] = useState([]);
    const [search, setSearch] = useState("");
    const [activeFilter, setActiveFilter] = useState("all");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [form, setForm] = useState(EMPTY_FORM);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [updatingId, setUpdatingId] = useState(null);
    const [deletingId, setDeletingId] = useState(null);
    const [error, setError] = useState("");
    const [modalError, setModalError] = useState("");
    const [success, setSuccess] = useState("");

    const loadTasks = useCallback(async () => {
        setIsLoading(true);
        setError("");
        try {
            const projectData = await getProjects();
            if (!Array.isArray(projectData)) {
                throw new Error("The server returned an unexpected projects response.");
            }

            setProjects(projectData);
            const taskGroups = await Promise.all(
                projectData.map(async (project) => {
                    const projectTasks = await getProjectTasks(project.id);
                    if (!Array.isArray(projectTasks)) {
                        throw new Error(`Could not load tasks for ${project.name}.`);
                    }
                    return projectTasks.map((task) => ({
                        ...task,
                        projectName: project.name,
                    }));
                }),
            );
            setTasks(taskGroups.flat());
        } catch (err) {
            setError(err.message || "Could not load tasks. Please try again.");
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        loadTasks();
    }, [loadTasks]);

    const counts = useMemo(() => ({
        all: tasks.length,
        todo: tasks.filter((task) => task.status === "todo").length,
        in_progress: tasks.filter((task) => task.status === "in_progress").length,
        completed: tasks.filter((task) => task.status === "completed").length,
    }), [tasks]);

    const filteredTasks = useMemo(() => {
        const query = search.trim().toLowerCase();
        return tasks.filter((task) => {
            const matchesSearch =
                task.title.toLowerCase().includes(query) ||
                (task.description || "").toLowerCase().includes(query) ||
                (task.projectName || "").toLowerCase().includes(query);
            return matchesSearch &&
                (activeFilter === "all" || task.status === activeFilter);
        });
    }, [tasks, search, activeFilter]);

    function openModal() {
        setForm({
            ...EMPTY_FORM,
            project_id: projects.length ? String(projects[0].id) : "",
        });
        setModalError("");
        setError("");
        setSuccess("");
        setIsModalOpen(true);
    }

    function closeModal() {
        if (isSaving) return;
        setIsModalOpen(false);
        setModalError("");
    }

    async function handleSubmit(event) {
        event.preventDefault();
        setModalError("");
        setError("");
        setSuccess("");

        const title = form.title.trim();
        if (!title) {
            setModalError("Please enter a task title.");
            return;
        }
        if (!form.project_id) {
            setModalError("Create a project before adding a task.");
            return;
        }

        setIsSaving(true);
        try {
            const created = await createTask({
                title,
                description: form.description.trim(),
                project_id: Number(form.project_id),
                status: form.status,
            });
            const project = projects.find(
                (item) => item.id === Number(form.project_id),
            );
            setTasks((current) => [
                { ...created, projectName: project?.name || "Project" },
                ...current,
            ]);
            setIsModalOpen(false);
            setForm(EMPTY_FORM);
            setSuccess("Task created successfully.");
        } catch (err) {
            setModalError(err.message || "Could not create the task.");
        } finally {
            setIsSaving(false);
        }
    }

    async function handleStatusChange(task, newStatus) {
        if (newStatus === task.status) return;
        setUpdatingId(task.id);
        setError("");
        setSuccess("");
        try {
            const updated = await updateTask(task.id, {
                title: task.title,
                description: task.description || "",
                status: newStatus,
            });
            setTasks((current) => current.map((item) =>
                item.id === task.id
                    ? { ...item, ...updated, projectName: task.projectName }
                    : item,
            ));
            setSuccess("Task status updated.");
        } catch (err) {
            setError(err.message || "Could not update task status.");
        } finally {
            setUpdatingId(null);
        }
    }

    async function handleDelete(task) {
        if (!window.confirm(`Delete "${task.title}"? This cannot be undone.`)) return;
        setDeletingId(task.id);
        setError("");
        setSuccess("");
        try {
            await deleteTask(task.id);
            setTasks((current) => current.filter((item) => item.id !== task.id));
            setSuccess("Task deleted successfully.");
        } catch (err) {
            setError(err.message || "Could not delete the task.");
        } finally {
            setDeletingId(null);
        }
    }

    const filters = [
        { value: "all", label: "All Tasks" },
        { value: "todo", label: "To Do" },
        { value: "in_progress", label: "In Progress" },
        { value: "completed", label: "Completed" },
    ];

    return (
        <div className="mx-auto max-w-7xl space-y-8">
            <section className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
                <div>
                    <p className="text-sm font-medium text-indigo-600">WORKSPACE / TASKS</p>
                    <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">Tasks</h1>
                    <p className="mt-2 text-slate-500">Stay organized and keep your projects moving forward.</p>
                </div>
                <button
                    type="button"
                    onClick={openModal}
                    disabled={!projects.length}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-200 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    <span className="text-lg leading-none">+</span> Create Task
                </button>
            </section>

            {error && (
                <div role="alert" className="flex flex-col gap-3 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700 sm:flex-row sm:items-center sm:justify-between">
                    <span>{error}</span>
                    <button type="button" onClick={loadTasks} className="shrink-0 font-semibold underline">Try again</button>
                </div>
            )}
            {success && (
                <p role="status" className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{success}</p>
            )}

            <section className="grid grid-cols-2 gap-4 xl:grid-cols-4">
                {[
                    { label: "Total Tasks", value: counts.all, icon: "▤", color: "bg-indigo-50 text-indigo-600" },
                    { label: "To Do", value: counts.todo, icon: "○", color: "bg-slate-100 text-slate-600" },
                    { label: "In Progress", value: counts.in_progress, icon: "◷", color: "bg-amber-50 text-amber-600" },
                    { label: "Completed", value: counts.completed, icon: "✓", color: "bg-emerald-50 text-emerald-600" },
                ].map((item) => (
                    <div key={item.label} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                        <div className="flex items-center justify-between gap-3">
                            <p className="text-sm font-medium text-slate-500">{item.label}</p>
                            <span className={`flex size-10 items-center justify-center rounded-xl text-lg ${item.color}`}>{item.icon}</span>
                        </div>
                        <p className="mt-4 text-3xl font-bold text-slate-900">{isLoading ? "—" : item.value}</p>
                    </div>
                ))}
            </section>

            <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="border-b border-slate-200 p-5 sm:p-6">
                    <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
                        <div>
                            <h2 className="text-lg font-bold text-slate-900">Your tasks</h2>
                            <p className="mt-1 text-sm text-slate-500">Manage your work and track progress.</p>
                        </div>
                        <div className="relative w-full lg:max-w-sm">
                            <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">⌕</span>
                            <input
                                type="search"
                                value={search}
                                onChange={(event) => setSearch(event.target.value)}
                                placeholder="Search tasks or projects..."
                                aria-label="Search tasks or projects"
                                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm outline-none transition placeholder:text-slate-400 focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-50"
                            />
                        </div>
                    </div>
                    <div className="mt-6 flex gap-2 overflow-x-auto pb-1">
                        {filters.map((filter) => {
                            const active = activeFilter === filter.value;
                            const count = filter.value === "all" ? counts.all : counts[filter.value];
                            return (
                                <button
                                    key={filter.value}
                                    type="button"
                                    onClick={() => setActiveFilter(filter.value)}
                                    className={`inline-flex shrink-0 items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition ${active ? "bg-indigo-600 text-white shadow-sm" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}
                                >
                                    {filter.label}
                                    <span className={`rounded-md px-1.5 py-0.5 text-xs ${active ? "bg-white/20 text-white" : "bg-white text-slate-600"}`}>{count}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                <div className="divide-y divide-slate-100">
                    {isLoading ? (
                        <div className="px-6 py-16 text-center text-sm text-slate-500">Loading tasks...</div>
                    ) : filteredTasks.map((task) => (
                        <article key={task.id} className="p-5 transition hover:bg-slate-50/70 sm:p-6">
                            <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                                <div className={`mt-1 flex size-10 shrink-0 items-center justify-center rounded-xl text-lg ${task.status === "completed" ? "bg-emerald-50 text-emerald-600" : task.status === "in_progress" ? "bg-indigo-50 text-indigo-600" : "bg-slate-100 text-slate-500"}`}>
                                    {task.status === "completed" ? "✓" : task.status === "in_progress" ? "◷" : "○"}
                                </div>
                                <div className="min-w-0 flex-1">
                                    <div className="flex flex-wrap items-center gap-2">
                                        <h3 className={`font-semibold ${task.status === "completed" ? "text-slate-400 line-through" : "text-slate-900"}`}>{task.title}</h3>
                                        <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${STATUS_STYLES[task.status] || STATUS_STYLES.todo}`}>
                                            {STATUS_OPTIONS.find((option) => option.value === task.status)?.label || task.status}
                                        </span>
                                    </div>
                                    <p className="mt-2 text-sm leading-6 text-slate-500">{task.description || "No description provided."}</p>
                                    <div className="mt-4 flex flex-wrap items-center gap-3">
                                        <span className="inline-flex items-center gap-1.5 rounded-lg bg-slate-100 px-2.5 py-1.5 text-xs font-medium text-slate-600">▦ {task.projectName}</span>
                                    </div>
                                </div>
                                <div className="flex shrink-0 items-center gap-2 sm:ml-4">
                                    <label className="sr-only" htmlFor={`status-${task.id}`}>Status for {task.title}</label>
                                    <select
                                        id={`status-${task.id}`}
                                        value={task.status}
                                        disabled={updatingId === task.id || deletingId === task.id}
                                        onChange={(event) => handleStatusChange(task, event.target.value)}
                                        className="min-w-0 flex-1 rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-xs font-medium text-slate-700 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 disabled:opacity-50 sm:flex-none"
                                    >
                                        {STATUS_OPTIONS.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
                                    </select>
                                    <button
                                        type="button"
                                        disabled={deletingId === task.id || updatingId === task.id}
                                        onClick={() => handleDelete(task)}
                                        aria-label={`Delete ${task.title}`}
                                        title="Delete task"
                                        className="flex size-10 shrink-0 items-center justify-center rounded-lg text-slate-400 transition hover:bg-rose-50 hover:text-rose-600 focus:outline-none focus:ring-2 focus:ring-rose-200 disabled:opacity-50"
                                    >
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="size-5" aria-hidden="true">
                                            <path d="M4 7h16M10 11v6m4-6v6M5.5 7l1 13h11l1-13M9 7V4h6v3" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </article>
                    ))}
                    {!isLoading && filteredTasks.length === 0 && (
                        <div className="px-6 py-16 text-center">
                            <div className="mx-auto flex size-16 items-center justify-center rounded-2xl bg-indigo-50 text-3xl text-indigo-500">✓</div>
                            <h3 className="mt-5 text-lg font-semibold text-slate-900">No tasks found</h3>
                            <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-500">
                                {search ? "Try another search term or change your filters." : tasks.length ? "There are no tasks in this category yet." : "Create a task to get started with your projects."}
                            </p>
                            {!search && projects.length > 0 && (
                                <button type="button" onClick={openModal} className="mt-5 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700">Create your first task</button>
                            )}
                            {!projects.length && !error && <p className="mt-3 text-sm text-slate-500">Create a project first, then you can add tasks to it.</p>}
                        </div>
                    )}
                </div>
                <div className="border-t border-slate-200 bg-slate-50/70 px-5 py-4 text-sm text-slate-500 sm:px-6">
                    Showing <span className="font-semibold text-slate-700">{filteredTasks.length}</span> of <span className="font-semibold text-slate-700">{tasks.length}</span> tasks
                </div>
            </section>

            {isModalOpen && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/50 p-4 backdrop-blur-sm"
                    onMouseDown={(event) => { if (event.target === event.currentTarget) closeModal(); }}
                >
                    <div role="dialog" aria-modal="true" aria-labelledby="create-task-title" className="my-auto w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl sm:p-8">
                        <div className="flex items-start justify-between gap-4">
                            <div>
                                <p className="text-sm font-medium text-indigo-600">TASK MANAGEMENT</p>
                                <h2 id="create-task-title" className="mt-2 text-2xl font-bold text-slate-900">Create a task</h2>
                                <p className="mt-2 text-sm text-slate-500">Add a task and decide what needs to get done.</p>
                            </div>
                            <button type="button" onClick={closeModal} disabled={isSaving} aria-label="Close dialog" className="flex size-9 shrink-0 items-center justify-center rounded-lg text-xl text-slate-400 hover:bg-slate-100 hover:text-slate-700 disabled:opacity-50">×</button>
                        </div>

                        <form onSubmit={handleSubmit} className="mt-7 space-y-5">
                            <div>
                                <label htmlFor="task-title" className="mb-2 block text-sm font-medium text-slate-700">Task title <span className="text-rose-500">*</span></label>
                                <input id="task-title" type="text" required maxLength={120} autoFocus value={form.title} onChange={(event) => { setForm({ ...form, title: event.target.value }); setModalError(""); }} placeholder="e.g. Build the login page" className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50" />
                            </div>
                            <div>
                                <label htmlFor="task-description" className="mb-2 block text-sm font-medium text-slate-700">Description</label>
                                <textarea id="task-description" rows={3} maxLength={500} value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} placeholder="What needs to be done?" className="w-full resize-y rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50" />
                            </div>
                            <div>
                                <label htmlFor="task-project" className="mb-2 block text-sm font-medium text-slate-700">Project</label>
                                <select id="task-project" required value={form.project_id} onChange={(event) => setForm({ ...form, project_id: event.target.value })} className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50">
                                    {projects.map((project) => <option key={project.id} value={project.id}>{project.name}</option>)}
                                </select>
                            </div>
                            <div>
                                <label htmlFor="task-status" className="mb-2 block text-sm font-medium text-slate-700">Initial status</label>
                                <select id="task-status" value={form.status} onChange={(event) => setForm({ ...form, status: event.target.value })} className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50">
                                    {STATUS_OPTIONS.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
                                </select>
                            </div>

                            {modalError && <p role="alert" className="text-sm font-medium text-rose-600">{modalError}</p>}

                            <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end">
                                <button type="button" onClick={closeModal} disabled={isSaving} className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50">Cancel</button>
                                <button type="submit" disabled={isSaving || !projects.length} className="rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-200 disabled:cursor-not-allowed disabled:opacity-60">
                                    {isSaving ? "Creating task..." : "Create Task"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Tasks;
