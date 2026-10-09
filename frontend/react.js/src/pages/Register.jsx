import { useState } from "react";
import { Link } from "react-router-dom";

function Register() {
    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [error, setError] = useState("");

    function handleSubmit(event) {
        event.preventDefault();
        setError("");

        if (
            !form.name.trim() ||
            !form.email.trim() ||
            !form.password ||
            !form.confirmPassword
        ) {
            setError("Please fill in all the required fields.");
            return;
        }

        if (form.password.length < 8) {
            setError("Your password must contain at least 8 characters.");
            return;
        }

        if (form.password !== form.confirmPassword) {
            setError("Your passwords do not match. Please try again.");
            return;
        }

        // Registration API integration comes next.
        setError("Registration isn't connected yet. We'll enable it next.");
    }

    return (
        <main className="flex min-h-screen bg-white">
            {/* Left branding panel */}
            <section className="relative hidden w-1/2 flex-col justify-between overflow-hidden bg-slate-950 p-12 text-white lg:flex xl:p-16">
                <div className="absolute -right-24 -top-24 size-96 rounded-full bg-indigo-600/20 blur-3xl" />
                <div className="absolute -bottom-32 -left-20 size-96 rounded-full bg-violet-600/20 blur-3xl" />

                <Link
                    to="/register"
                    className="relative z-10 inline-flex items-center gap-3"
                >
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
                        Your next chapter starts here
                    </div>

                    <h1 className="text-5xl font-bold leading-tight tracking-tight xl:text-6xl">
                        Turn your ideas into
                        <span className="mt-2 block text-indigo-400">
                            meaningful progress.
                        </span>
                    </h1>

                    <p className="mt-6 max-w-md text-lg leading-8 text-slate-400">
                        Create your workspace, organize your projects, and make every
                        task count. Your productivity journey starts with one step.
                    </p>

                    <div className="mt-10 space-y-4">
                        {[
                            "Keep your projects organized",
                            "Track tasks from start to finish",
                            "See your progress in one place",
                        ].map((item) => (
                            <div key={item} className="flex items-center gap-3">
                                <span className="flex size-6 items-center justify-center rounded-full bg-indigo-500/20 text-sm text-indigo-300">
                                    ✓
                                </span>
                                <span className="text-sm text-slate-300">{item}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <p className="relative z-10 text-sm text-slate-500">
                    Built for focused work. Designed for your next big thing.
                </p>
            </section>

            {/* Registration form */}
            <section className="flex min-h-screen w-full items-center justify-center px-5 py-10 sm:px-10 lg:w-1/2">
                <div className="w-full max-w-md">
                    <Link
                        to="/register"
                        className="mb-8 inline-flex items-center gap-2 lg:hidden"
                    >
                        <span className="flex size-10 items-center justify-center rounded-xl bg-indigo-600 text-lg font-bold text-white">
                            D
                        </span>
                        <span className="text-xl font-bold tracking-tight text-slate-900">
                            Dev<span className="text-indigo-600">Board</span>
                        </span>
                    </Link>

                    <div className="mb-7">
                        <p className="text-sm font-semibold uppercase tracking-widest text-indigo-600">
                            Get started for free
                        </p>
                        <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                            Create your account
                        </h2>
                        <p className="mt-3 leading-6 text-slate-500">
                            Enter your details to set up your DevBoard workspace.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label
                                htmlFor="register-name"
                                className="mb-2 block text-sm font-semibold text-slate-700"
                            >
                                Full name
                            </label>
                            <input
                                id="register-name"
                                name="name"
                                type="text"
                                autoComplete="name"
                                required
                                maxLength={100}
                                value={form.name}
                                onChange={(event) =>
                                    setForm({ ...form, name: event.target.value })
                                }
                                placeholder="Your full name"
                                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50"
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="register-email"
                                className="mb-2 block text-sm font-semibold text-slate-700"
                            >
                                Email address
                            </label>
                            <input
                                id="register-email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                value={form.email}
                                onChange={(event) =>
                                    setForm({ ...form, email: event.target.value })
                                }
                                placeholder="you@example.com"
                                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50"
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="register-password"
                                className="mb-2 block text-sm font-semibold text-slate-700"
                            >
                                Password
                            </label>

                            <div className="relative">
                                <input
                                    id="register-password"
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    autoComplete="new-password"
                                    required
                                    minLength={8}
                                    value={form.password}
                                    onChange={(event) =>
                                        setForm({ ...form, password: event.target.value })
                                    }
                                    placeholder="At least 8 characters"
                                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 pr-20 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50"
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

                        <div>
                            <label
                                htmlFor="register-confirm-password"
                                className="mb-2 block text-sm font-semibold text-slate-700"
                            >
                                Confirm password
                            </label>

                            <div className="relative">
                                <input
                                    id="register-confirm-password"
                                    name="confirmPassword"
                                    type={showConfirmPassword ? "text" : "password"}
                                    autoComplete="new-password"
                                    required
                                    value={form.confirmPassword}
                                    onChange={(event) =>
                                        setForm({
                                            ...form,
                                            confirmPassword: event.target.value,
                                        })
                                    }
                                    placeholder="Re-enter your password"
                                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 pr-20 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50"
                                />

                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowConfirmPassword((visible) => !visible)
                                    }
                                    aria-label={
                                        showConfirmPassword
                                            ? "Hide confirm password"
                                            : "Show confirm password"
                                    }
                                    className="absolute inset-y-0 right-3 rounded-lg px-2 text-sm font-semibold text-slate-500 hover:text-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                                >
                                    {showConfirmPassword ? "Hide" : "Show"}
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
                            className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-200"
                        >
                            Create account
                            <span aria-hidden="true">→</span>
                        </button>
                    </form>

                    <div className="my-7 flex items-center gap-4">
                        <div className="h-px flex-1 bg-slate-200" />
                        <span className="text-xs font-medium uppercase tracking-wider text-slate-400">
                            Already registered?
                        </span>
                        <div className="h-px flex-1 bg-slate-200" />
                    </div>

                    <Link
                        to="/login"
                        className="flex w-full items-center justify-center rounded-xl border border-slate-200 px-5 py-3.5 text-sm font-semibold text-slate-700 transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700"
                    >
                        Sign in to your account
                    </Link>

                    <p className="mt-8 text-center text-xs leading-5 text-slate-400">
                        Your workspace starts here. Let's build something great.
                    </p>
                </div>
            </section>
        </main>
    );
}

export default Register;
