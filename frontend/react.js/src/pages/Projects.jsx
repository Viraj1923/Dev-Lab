import { useCallback, useEffect, useMemo, useState } from "react";
import {
    createProject,
    deleteProject,
    getProjects,
    updateProject,
} from "../api/projects";

const EMPTY_FORM = { name: "", description: "" };
const CARD_COLORS = ["bg-indigo-500", "bg-sky-500", "bg-emerald-500", "bg-violet-500"];

function getInitials(name = "") {
    return name
        .trim()
        .split(/\s+/)
        .slice(0, 2)
        .map((word) => word[0]?.toUpperCase() || "")
        .join("") || "P";
}

function Projects() {
    const [projects, setProjects] = useState([]);
    const [search, setSearch] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProject, setEditingProject] = useState(null);
    const [form, setForm] = useState(EMPTY_FORM);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [deletingId, setDeletingId] = useState(null);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const loadProjects = useCallback(async () => {
        setIsLoading(true);
        setError("");
        try {
            const data = await getProjects();
            if (!Array.isArray(data)) {
                throw new Error("The server returned an unexpected projects response.");
            }
            setProjects(data);
        } catch (err) {
            setError(err.message || "Could not load projects. Please try again.");
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        loadProjects();
    }, [loadProjects]);

    const filteredProjects = useMemo(() => {
        const query = search.trim().toLowerCase();
        if (!query) return projects;
        return projects.filter((project) =>
            `${project.name || ""} ${project.description || ""}`.toLowerCase().includes(query),
        );
    }, [projects, search]);

    function openCreateModal() {
        setEditingProject(null);
        setForm(EMPTY_FORM);
        setError("");
        setSuccess("");
        setIsModalOpen(true);
    }

    function openEditModal(project) {
        setEditingProject(project);
        setForm({
            name: project.name || "",
            description: project.description || "",
        });
        setError("");
        setSuccess("");
        setIsModalOpen(true);
    }

    function closeModal() {
        if (isSaving) return;
        setIsModalOpen(false);
        setEditingProject(null);
        setForm(EMPTY_FORM);
        setError("");
    }

    async function handleSubmit(event) {
        event.preventDefault();
        const name = form.name.trim();
        const description = form.description.trim();
        if (!name) {
            setError("Project name is required.");
            return;
        }

        setIsSaving(true);
        setError("");
        setSuccess("");
        try {
            const projectData = { name, description };
            if (editingProject) {
                await updateProject(editingProject.id, projectData);
                setSuccess("Project updated successfully.");
            } else {
                await createProject(projectData);
                setSuccess("Project created successfully.");
            }
            setIsModalOpen(false);
            setEditingProject(null);
            setForm(EMPTY_FORM);
            await loadProjects();
        } catch (err) {
            setError(err.message || "Could not save the project. Please try again.");
        } finally {
            setIsSaving(false);
        }
    }

    async function handleDeleteProject(project) {
        const confirmed = window.confirm(
            `Are you sure you want to delete “${project.name}”? This action cannot be undone.`,
        );
        if (!confirmed) return;

        setDeletingId(project.id);
        setError("");
        setSuccess("");
        try {
            await deleteProject(project.id);
            setProjects((current) => current.filter((item) => item.id !== project.id));
            setSuccess("Project deleted successfully.");
        } catch (err) {
            setError(err.message || "Could not delete the project. Please try again.");
        } finally {
            setDeletingId(null);
        }
    }

    return (
        <div className="space-y-8">
            <section className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-indigo-600">
                        Workspace
                    </p>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">Projects</h1>
                    <p className="mt-2 text-sm leading-6 text-slate-500">
                        Plan, organize, and keep all your work moving forward.
                    </p>
                </div>
                <button
                    type="button"
                    onClick={openCreateModal}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                    <span className="text-lg leading-none">+</span> New Project
                </button>
            </section>

            {error && !isModalOpen && (
                <div role="alert" className="flex flex-col gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 sm:flex-row sm:items-center sm:justify-between">
                    <span>{error}</span>
                    <button type="button" onClick={loadProjects} className="shrink-0 font-semibold underline underline-offset-2">
                        Try again
                    </button>
                </div>
            )}
            {success && !isModalOpen && (
                <div role="status" className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                    {success}
                </div>
            )}

            <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                {[
                    { label: "Total Projects", count: projects.length, color: "text-indigo-600" },
                    { label: "Matching Search", count: filteredProjects.length, color: "text-sky-600" },
                    { label: "Your Workspace", count: "Personal", color: "text-emerald-600" },
                ].map((item) => (
                    <article key={item.label} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                        <p className="text-sm font-medium text-slate-500">{item.label}</p>
                        <p className={`mt-3 text-3xl font-bold ${item.color}`}>{item.count}</p>
                    </article>
                ))}
            </section>

            <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
                <div className="relative w-full lg:max-w-md">
                    <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-lg text-slate-400">⌕</span>
                    <input
                        type="search"
                        value={search}
                        onChange={(event) => setSearch(event.target.value)}
                        placeholder="Search projects..."
                        aria-label="Search projects"
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm outline-none transition placeholder:text-slate-400 focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-50"
                    />
                </div>
            </section>

            <section>
                <div className="mb-5 flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-slate-900">All Projects</h2>
                    <span className="text-sm text-slate-500">
                        {filteredProjects.length} {filteredProjects.length === 1 ? "project" : "projects"}
                    </span>
                </div>

                {isLoading ? (
                    <div className="flex items-center justify-center rounded-2xl border border-slate-200 bg-white px-6 py-14">
                        <div className="text-center">
                            <div className="mx-auto size-9 animate-spin rounded-full border-4 border-slate-200 border-t-indigo-600" />
                            <p className="mt-4 text-sm font-medium text-slate-500">Loading your projects...</p>
                        </div>
                    </div>
                ) : filteredProjects.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center">
                        <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-indigo-50 text-2xl text-indigo-600">▦</div>
                        <h3 className="mt-4 font-semibold text-slate-900">
                            {projects.length === 0 ? "No projects yet" : "No projects found"}
                        </h3>
                        <p className="mt-2 text-sm text-slate-500">
                            {projects.length === 0
                                ? "Create your first project to get started."
                                : "Try a different search or clear your search."}
                        </p>
                        {projects.length === 0 ? (
                            <button type="button" onClick={openCreateModal} className="mt-4 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700">
                                Create your first project
                            </button>
                        ) : (
                            <button type="button" onClick={() => setSearch("")} className="mt-4 text-sm font-semibold text-indigo-600 hover:text-indigo-700">
                                Clear search
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-5 lg:grid-cols-2 2xl:grid-cols-3">
                        {filteredProjects.map((project, index) => (
                            <article key={project.id} className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-1 hover:border-indigo-200 hover:shadow-lg sm:p-6">
                                <div className="flex items-start justify-between gap-3">
                                    <div className={`flex size-12 shrink-0 items-center justify-center rounded-xl ${CARD_COLORS[index % CARD_COLORS.length]} text-sm font-bold text-white shadow-sm`}>
                                        {getInitials(project.name)}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button type="button" onClick={() => openEditModal(project)} aria-label={`Edit ${project.name}`} title="Edit project" className="rounded-lg px-3 py-2 text-sm font-medium text-slate-500 transition hover:bg-indigo-50 hover:text-indigo-700">
                                            Edit
                                        </button>
                                        <button type="button" onClick={() => handleDeleteProject(project)} disabled={deletingId === project.id} aria-label={`Delete ${project.name}`} title="Delete project" className="rounded-lg px-2 py-1 text-xl text-slate-400 transition hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-50">
                                            {deletingId === project.id ? "…" : "×"}
                                        </button>
                                    </div>
                                </div>
                                <h3 className="mt-5 break-words text-lg font-semibold text-slate-900 transition group-hover:text-indigo-700">{project.name}</h3>
                                <p className="mt-2 min-h-12 whitespace-pre-wrap break-words text-sm leading-6 text-slate-500">
                                    {project.description || "No description added yet."}
                                </p>
                                <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4">
                                    <span className="text-xs text-slate-400">Project #{project.id}</span>
                                    <span className="text-sm font-semibold text-indigo-600">Project workspace <span aria-hidden="true">→</span></span>
                                </div>
                            </article>
                        ))}
                    </div>
                )}
            </section>

            {isModalOpen && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/50 p-4 backdrop-blur-sm"
                    onMouseDown={(event) => {
                        if (event.target === event.currentTarget) closeModal();
                    }}
                >
                    <section role="dialog" aria-modal="true" aria-labelledby="project-modal-title" className="my-auto w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl sm:p-8">
                        <div className="flex items-start justify-between gap-4">
                            <div>
                                <h2 id="project-modal-title" className="text-xl font-bold text-slate-900">
                                    {editingProject ? "Edit project" : "Create a project"}
                                </h2>
                                <p className="mt-2 text-sm text-slate-500">
                                    {editingProject ? "Update your project details." : "Give your next idea a place to grow."}
                                </p>
                            </div>
                            <button type="button" onClick={closeModal} disabled={isSaving} aria-label="Close dialog" className="rounded-lg px-3 py-1 text-xl text-slate-400 hover:bg-slate-100 hover:text-slate-700 disabled:opacity-50">×</button>
                        </div>

                        {error && <p role="alert" className="mt-5 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}

                        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
                            <div>
                                <label htmlFor="project-name" className="mb-2 block text-sm font-medium text-slate-700">Project name <span className="text-red-500">*</span></label>
                                <input id="project-name" autoFocus required maxLength={100} value={form.name} onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))} placeholder="e.g. Website Redesign" className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50" />
                            </div>
                            <div>
                                <label htmlFor="project-description" className="mb-2 block text-sm font-medium text-slate-700">Description</label>
                                <textarea id="project-description" rows={3} maxLength={500} value={form.description} onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))} placeholder="What is this project about?" className="w-full resize-y rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50" />
                            </div>
                            <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
                                <button type="button" onClick={closeModal} disabled={isSaving} className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50">Cancel</button>
                                <button type="submit" disabled={isSaving} className="rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60">
                                    {isSaving ? "Saving..." : editingProject ? "Save Changes" : "Create Project"}
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
