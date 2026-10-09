const stats = [
    {
        label: "Total Projects",
        value: "—",
        note: "Your workspace projects",
        icon: "▦",
        color: "bg-indigo-50 text-indigo-600",
    },
    {
        label: "Total Tasks",
        value: "—",
        note: "Across all projects",
        icon: "☷",
        color: "bg-sky-50 text-sky-600",
    },
    {
        label: "In Progress",
        value: "—",
        note: "Tasks currently underway",
        icon: "◷",
        color: "bg-amber-50 text-amber-600",
    },
    {
        label: "Completed",
        value: "—",
        note: "Tasks finished",
        icon: "✓",
        color: "bg-emerald-50 text-emerald-600",
    },
];

function Dashboard() {
    return (
        <div className="space-y-8">
            {/* Page heading */}
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

                <span className="inline-flex w-fit items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-600">
                    <span className="size-2 rounded-full bg-emerald-500" />
                    Workspace overview
                </span>
            </section>

            {/* Summary cards */}
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
                            {stat.value}
                        </p>

                        <p className="mt-2 text-xs text-slate-500">
                            {stat.note}
                        </p>
                    </article>
                ))}
            </section>

            {/* Main dashboard panels */}
            <section className="grid grid-cols-1 gap-6 xl:grid-cols-3">
                {/* Recent projects */}
                <article className="rounded-2xl border border-slate-200 bg-white p-6 xl:col-span-2">
                    <div className="flex items-center justify-between gap-4">
                        <div>
                            <h2 className="text-lg font-semibold text-slate-900">
                                Recent Projects
                            </h2>
                            <p className="mt-1 text-sm text-slate-500">
                                Pick up where you left off.
                            </p>
                        </div>

                        <a
                            href="/projects"
                            className="shrink-0 rounded-lg px-3 py-2 text-sm font-semibold text-indigo-600 transition hover:bg-indigo-50"
                        >
                            View projects →
                        </a>
                    </div>

                    <div className="mt-6 rounded-xl border border-dashed border-slate-200 px-5 py-10 text-center">
                        <div className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-indigo-50 text-2xl text-indigo-600">
                            ▦
                        </div>

                        <h3 className="mt-4 font-semibold text-slate-800">
                            Your projects will appear here
                        </h3>

                        <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-500">
                            Once we connect your backend, you'll see your latest projects
                            and their progress here.
                        </p>

                        <a
                            href="/projects"
                            className="mt-5 inline-flex items-center justify-center rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700"
                        >
                            Explore Projects
                        </a>
                    </div>
                </article>

                {/* Task overview */}
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
                        {[
                            {
                                label: "To do",
                                color: "bg-slate-400",
                            },
                            {
                                label: "In progress",
                                color: "bg-amber-500",
                            },
                            {
                                label: "Completed",
                                color: "bg-emerald-500",
                            },
                        ].map((task) => (
                            <div key={task.label}>
                                <div className="flex items-center justify-between gap-3 text-sm">
                                    <span className="flex items-center gap-2 text-slate-600">
                                        <span
                                            className={`size-2.5 rounded-full ${task.color}`}
                                        />
                                        {task.label}
                                    </span>

                                    <span className="font-semibold text-slate-800">—</span>
                                </div>

                                <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100">
                                    <div className={`h-full w-0 ${task.color}`} />
                                </div>
                            </div>
                        ))}
                    </div>

                    <a
                        href="/tasks"
                        className="mt-8 flex w-full items-center justify-center rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                    >
                        View all tasks →
                    </a>
                </article>
            </section>

            <p className="text-center text-xs text-slate-400">
                DevBoard · Your work, organized.
            </p>
        </div>
    );
}

export default Dashboard;
