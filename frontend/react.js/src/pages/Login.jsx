import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Login() {
    const [form, setForm] = useState({
        email: "",
        password: "",
    });

    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const { login } = useAuth();

    async function handleSubmit(event) {
        event.preventDefault();
        setError("");

        if (!form.email.trim() || !form.password) {
            setError("Please enter your email and password.");
            return;
        }

        try {
            setIsLoading(true);

            await login({
                email: form.email.trim(),
                password: form.password,
            });

            navigate("/", { replace: true });
        } catch (error) {
            setError(error.message || "Login failed. Please try again.");
        } finally {
            setIsLoading(false);
        }
    }

    return (
    <main className="flex min-h-screen bg-white">
        {/* Left branding panel */}
        <section className="relative hidden w-1/2 flex-col justify-between overflow-hidden bg-slate-950 p-12 text-white lg:flex xl:p-16">
            <div className="absolute -right-24 -top-24 size-96 rounded-full bg-indigo-600/20 blur-3xl" />
            <div className="absolute -bottom-32 -left-20 size-96 rounded-full bg-violet-600/20 blur-3xl" />

            <Link to="/login" className="relative z-10 inline-flex items-center gap-3">
                <span className="flex size-11 items-center justify-center rounded-xl bg-indigo-600 text-xl font-bold">
                    D
                </span>
                <span className="text-2xl font-bold tracking-tight">
                    Dev<span className="text-indigo-400">Board</span>
                </span>
            </Link>

            <div className="relative z-10 max-w-xl">
                <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-300">
                    <span className="size-2 rounded-full bg-emerald-400" />
                    Your workspace, simplified
                </div>

                <h1 className="text-5xl font-bold leading-tight tracking-tight xl:text-6xl">
                    Great work starts with
                    <span className="mt-2 block text-indigo-400">
                        great organization.
                    </span>
                </h1>

                <p className="mt-6 max-w-md text-lg leading-8 text-slate-400">
                    Bring your projects and tasks together. Stay focused, track
                    progress, and keep moving forward.
                </p>

                <div className="mt-10 grid grid-cols-2 gap-4">
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                        <p className="text-2xl font-bold">Projects</p>
                        <p className="mt-1 text-sm text-slate-400">
                            Everything in one place
                        </p>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                        <p className="text-2xl font-bold">Progress</p>
                        <p className="mt-1 text-sm text-slate-400">
                            Every step counts
                        </p>
                    </div>
                </div>
            </div>

            <p className="relative z-10 text-sm text-slate-500">
                Built for focused work. Designed for your next big thing.
            </p>
        </section>

        {/* Login form */}
        <section className="flex min-h-screen w-full items-center justify-center px-5 py-12 sm:px-10 lg:w-1/2">
            <div className="w-full max-w-md">
                <Link
                    to="/login"
                    className="mb-12 inline-flex items-center gap-2 lg:hidden"
                >
                    <span className="flex size-10 items-center justify-center rounded-xl bg-indigo-600 text-lg font-bold text-white">
                        D
                    </span>
                    <span className="text-xl font-bold tracking-tight text-slate-900">
                        Dev<span className="text-indigo-600">Board</span>
                    </span>
                </Link>

                <div className="mb-8">
                    <p className="text-sm font-semibold uppercase tracking-widest text-indigo-600">
                        Welcome back
                    </p>
                    <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                        Sign in to DevBoard
                    </h2>
                    <p className="mt-3 leading-6 text-slate-500">
                        Enter your details to access your workspace.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label
                            htmlFor="email"
                            className="mb-2 block text-sm font-semibold text-slate-700"
                        >
                            Email address
                        </label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            autoComplete="email"
                            required
                            value={form.email}
                            onChange={(event) =>
                                setForm({ ...form, email: event.target.value })
                            }
                            placeholder="you@example.com"
                            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50"
                        />
                    </div>

                    <div>
                        <div className="mb-2 flex items-center justify-between gap-3">
                            <label
                                htmlFor="password"
                                className="block text-sm font-semibold text-slate-700"
                            >
                                Password
                            </label>
                            <button
                                type="button"
                                disabled
                                title="Password recovery will be added later"
                                className="text-xs font-medium text-slate-400"
                            >
                                Forgot password?
                            </button>
                        </div>

                        <div className="relative">
                            <input
                                id="password"
                                name="password"
                                type={showPassword ? "text" : "password"}
                                autoComplete="current-password"
                                required
                                value={form.password}
                                onChange={(event) =>
                                    setForm({ ...form, password: event.target.value })
                                }
                                placeholder="Enter your password"
                                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3.5 pr-20 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50"
                            />

                            <button
                                type="button"
                                onClick={() => setShowPassword((visible) => !visible)}
                                aria-label={showPassword ? "Hide password" : "Show password"}
                                className="absolute inset-y-0 right-3 rounded-lg px-2 text-sm font-semibold text-slate-500 hover:text-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                            >
                                {showPassword ? "Hide" : "Show"}
                            </button>
                        </div>
                    </div>

                    {error && (
                        <p
                            role="alert"
                            className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-5 text-amber-800"
                        >
                            {error}
                        </p>
                    )}

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-200 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {isLoading ? "Signing in..." : "Sign in"}
                        {!isLoading && <span aria-hidden="true">→</span>}
                    </button>
                </form>

                <div className="my-8 flex items-center gap-4">
                    <div className="h-px flex-1 bg-slate-200" />
                    <span className="text-xs font-medium uppercase tracking-wider text-slate-400">
                        New to DevBoard?
                    </span>
                    <div className="h-px flex-1 bg-slate-200" />
                </div>

                <Link
                    to="/register"
                    className="flex w-full items-center justify-center rounded-xl border border-slate-200 px-5 py-3.5 text-sm font-semibold text-slate-700 transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700"
                >
                    Create an account
                </Link>

                <p className="mt-10 text-center text-xs leading-5 text-slate-400">
                    By continuing, you agree to use DevBoard responsibly.
                </p>
            </div>
        </section>
    </main>
);
}

export default Login;
