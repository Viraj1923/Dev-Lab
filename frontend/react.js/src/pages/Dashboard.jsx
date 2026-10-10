import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { getProjects } from "../api/projects";
import { getProjectTasks } from "../api/tasks";

const statStyles = [
    {
        label: "Total Projects",
        note: "Your workspace projects",
        icon: "▦",
        color: "bg-indigo-50 text-indigo-600",
    },
    {
        label: "Total Tasks",
        note: "Across all projects",
        icon: "☷",
        color: "bg-sky-50 text-sky-600",
    },
    {
        label: "In Progress",
        note: "Tasks currently underway",
        icon: "◷",
        color: "bg-amber-50 text-amber-600",
    },
    {
        label: "Completed",
        note: "Tasks finished",
        icon: "✓",
        color: "bg-emerald-50 text-emerald-600",
    },
];

const taskStatuses = [
    { value: "todo", label: "To do", color: "bg-slate-400" },
    { value: "in_progress", label: "In progress", color: "bg-amber-500" },
    { value: "completed", label: "Completed", color: "bg-emerald-500" },
];

function Dashboard() {
    const [projects, setProjects] = useState([]);
    const [tasks, setTasks] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");

    const loadDashboard = useCallback(async () => {
        setIsLoading(true);
        setError("");

        try {
            const projectData = await getProjects();
            const safeProjects = Array.isArray(projectData) ? projectData : [];

            const taskGroups = await Promise.all(
                safeProjects.map(async (project) => {
                    const projectTasks = await getProjectTasks(project.id);
                    const safeTasks = Array.isArray(projectTasks) ? projectTasks : [];

                    return safeTasks.map((task) => ({
                        ...task,
                        projectName: project.name,
                    }));
                })
            );

            setProjects(safeProjects);
            setTasks(taskGroups.flat());
        } catch (err) {
            setError(err.message || "Could not load dashboard data. Please try again.");
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        loadDashboard();
    }, [loadDashboard]);

    const counts = useMemo(() => {
        return {
            projects: projects.length,
            tasks: tasks.length,
            inProgress: tasks.filter((task) => task.status === "in_progress").length,
            completed: tasks.filter((task) => task.status === "completed").length,
        };
    }, [projects, tasks]);

    const stats = [
        { ...statStyles[0], value: counts.projects },
        { ...statStyles[1], value: counts.tasks },
        { ...statStyles[2], value: counts.inProgress },
        { ...statStyles[3], value: counts.completed },
    ];

    const statusCounts = useMemo(
        () =>
            taskStatuses.map((status) => ({
                ...status,
                count: tasks.filter((task) => task.status === status.value).length,
            })),
        [tasks]
    );

    const recentTasks = tasks.slice(0, 5);
    const recentProjects = projects.slice(0, 4);

    return (
        <div className="space-y-8">
            <section className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <p className="mb-2 text-sm font-semibold text-indigo-600">
                        OVERVIEW
                    </p>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                        Dashboard
                    </h1>
                    <p className="mt-2 text-sm leading-6 text-slate-500">
                        Here's an overview of your projects and team's progress.
                    </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                    <span className="inline-flex w-fit items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-600">
                        <span className="size-2 rounded-full bg-emerald-500" />
                        Live workspace data
                    </span>
                    <button
                        type="button"
                        onClick={loadDashboard}
                        disabled={isLoading}
                        className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {isLoading ? "Refreshing..." : "↻ Refresh"}
                    </button>
                </div>
            </section>

            {error && (
                <div
                    role="alert"
                    className="flex flex-col gap-3 rounded-xl border border-rose-200 bg-rose-50 p-4 sm:flex-row sm:items-center sm:justify-between"
                >
                    <p className="text-sm text-rose-700">{error}</p>
                    <button
                        type="button"
                        onClick={loadDashboard}
                        className="shrink-0 rounded-lg bg-rose-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-rose-700"
                    >
                        Try again
                    </button>
                </div>
            )}

            <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {stats.map((stat) => (
                    <article
                        key={stat.label}
                        className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                    >
                        <div className="flex items-start justify-between">
                            <p className="text-sm font-medium text-slate-500">
                                {stat.label}
                            </p>
                            <span
                                className={`flex size-10 items-center justify-center rounded-xl text-xl ${stat.color}`}
                            >
                                {stat.icon}
                            </span>
                        </div>
                        <p className="mt-5 text-3xl font-bold tracking-tight text-slate-900">
                            {isLoading ? "…" : stat.value}
                        </p>
                        <p className="mt-2 text-xs text-slate-500">{stat.note}</p>
                    </article>
                ))}
            </section>

            <section className="grid grid-cols-1 gap-6 xl:grid-cols-3">
                <article className="rounded-2xl border border-slate-200 bg-white p-6 xl:col-span-2">
                    <div className="flex items-center justify-between gap-4">
                        <div>
                            <h2 className="text-lg font-semibold text-slate-900">
                                Projects
                            </h2>
                            <p className="mt-1 text-sm text-slate-500">
                                Your workspace projects.
                            </p>
                        </div>
                        <Link
                            to="/projects"
                            className="shrink-0 rounded-lg px-3 py-2 text-sm font-semibold text-indigo-600 transition hover:bg-indigo-50"
                        >
                            View projects →
                        </Link>
                    </div>

                    {isLoading ? (
                        <div className="mt-6 space-y-3" aria-label="Loading projects">
                            {[1, 2, 3].map((item) => (
                                <div
                                    key={item}
                                    className="h-16 animate-pulse rounded-xl bg-slate-100"
                                />
                            ))}
                        </div>
                    ) : recentProjects.length === 0 ? (
                        <div className="mt-6 rounded-xl border border-dashed border-slate-200 px-5 py-10 text-center">
                            <div className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-indigo-50 text-2xl text-indigo-600">
                                ▦
                            </div>
                            <h3 className="mt-4 font-semibold text-slate-800">
                                No projects yet
                            </h3>
                            <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-500">
                                Create your first project to organize tasks and track your progress.
                            </p>
                            <Link
                                to="/projects"
                                className="mt-5 inline-flex items-center justify-center rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700"
                            >
                                Create a project
                            </Link>
                        </div>
                    ) : (
                        <div className="mt-6 divide-y divide-slate-100">
                            {recentProjects.map((project) => {
                                const projectTaskCount = tasks.filter(
                                    (task) => task.project_id === project.id
                                ).length;

                                return (
                                    <div
                                        key={project.id}
                                        className="flex items-center gap-3 py-4 first:pt-0 last:pb-0"
                                    >
                                        <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-indigo-50 font-semibold text-indigo-600">
                                            {(project.name || "P").trim().charAt(0).toUpperCase()}
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <h3 className="truncate text-sm font-semibold text-slate-800">
                                                {project.name}
                                            </h3>
                                            <p className="mt-1 truncate text-xs text-slate-500">
                                                {project.description || "No description provided"}
                                            </p>
                                        </div>
                                        <span className="shrink-0 rounded-full bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-600">
                                            {projectTaskCount} {projectTaskCount === 1 ? "task" : "tasks"}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </article>

                <article className="rounded-2xl border border-slate-200 bg-white p-6">
                    <div>
                        <h2 className="text-lg font-semibold text-slate-900">
                            Task Overview
                        </h2>
                        <p className="mt-1 text-sm text-slate-500">
                            Track work across your workspace.
                        </p>
                    </div>

                    <div className="mt-6 space-y-5">
                        {statusCounts.map((status) => {
                            const percentage =
                                counts.tasks === 0
                                    ? 0
                                    : Math.round((status.count / counts.tasks) * 100);

                            return (
                                <div key={status.value}>
                                    <div className="flex items-center justify-between gap-3 text-sm">
                                        <span className="flex items-center gap-2 text-slate-600">
                                            <span className={`size-2.5 rounded-full ${status.color}`} />
                                            {status.label}
                                        </span>
                                        <span className="font-semibold text-slate-800">
                                            {isLoading ? "…" : status.count}
                                        </span>
                                    </div>
                                    <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100">
                                        <div
                                            className={`h-full rounded-full transition-all duration-500 ${status.color}`}
                                            style={{ width: `${isLoading ? 0 : percentage}%` }}
                                        />
                                    </div>
                                    <p className="mt-1 text-right text-xs text-slate-400">
                                        {isLoading ? "" : `${percentage}%`}
                                    </p>
                                </div>
                            );
                        })}
                    </div>

                    <Link
                        to="/tasks"
                        className="mt-8 flex w-full items-center justify-center rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                    >
                        View all tasks →
                    </Link>
                </article>
            </section>

            <section className="rounded-2xl border border-slate-200 bg-white p-6">
                <div className="flex items-center justify-between gap-4">
                    <div>
                        <h2 className="text-lg font-semibold text-slate-900">
                            Recent Tasks
                        </h2>
                        <p className="mt-1 text-sm text-slate-500">
                            A quick look at tasks across your projects.
                        </p>
                    </div>
                    <Link
                        to="/tasks"
                        className="shrink-0 rounded-lg px-3 py-2 text-sm font-semibold text-indigo-600 transition hover:bg-indigo-50"
                    >
                        All tasks →
                    </Link>
                </div>

                {isLoading ? (
                    <div className="mt-6 space-y-3" aria-label="Loading tasks">
                        {[1, 2, 3].map((item) => (
                            <div
                                key={item}
                                className="h-14 animate-pulse rounded-xl bg-slate-100"
                            />
                        ))}
                    </div>
                ) : recentTasks.length === 0 ? (
                    <div className="mt-6 rounded-xl border border-dashed border-slate-200 px-5 py-8 text-center">
                        <p className="font-medium text-slate-700">No tasks yet</p>
                        <p className="mt-1 text-sm text-slate-500">
                            Add a task to one of your projects and it will appear here.
                        </p>
                    </div>
                ) : (
                    <div className="mt-5 divide-y divide-slate-100">
                        {recentTasks.map((task) => {
                            const status = taskStatuses.find(
                                (item) => item.value === task.status
                            );

                            return (
                                <div
                                    key={task.id}
                                    className="flex flex-col gap-2 py-4 sm:flex-row sm:items-center sm:justify-between"
                                >
                                    <div className="min-w-0">
                                        <h3 className="truncate text-sm font-semibold text-slate-800">
                                            {task.title}
                                        </h3>
                                        <p className="mt-1 truncate text-xs text-slate-500">
                                            {task.projectName || "Project"}
                                        </p>
                                    </div>
                                    <span
                                        className={`inline-flex w-fit shrink-0 items-center rounded-full px-3 py-1.5 text-xs font-semibold ${
                                            task.status === "completed"
                                                ? "bg-emerald-50 text-emerald-700"
                                                : task.status === "in_progress"
                                                  ? "bg-amber-50 text-amber-700"
                                                  : "bg-slate-100 text-slate-600"
                                        }`}
                                    >
                                        {status?.label || task.status}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                )}
            </section>

            <p className="text-center text-xs text-slate-400">
                DevBoard · Your work, organized.
            </p>
        </div>
    );
}

export default Dashboard;
