import { loginAction } from "@/app/admin/actions";

export default function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-ink-950 px-4">
      <form
        action={loginAction}
        className="w-full max-w-sm border border-ink-800 bg-ink-900 p-8 text-white"
      >
        <p className="eyebrow mb-2">Admin</p>
        <h1 className="mb-6 font-display text-xl font-600">Sign in</h1>
        <label className="mb-3 block text-sm">
          Email
          <input
            name="email"
            type="email"
            required
            className="mt-1 w-full border border-ink-700 bg-ink-950 px-3 py-2 text-sm"
          />
        </label>
        <label className="mb-6 block text-sm">
          Password
          <input
            name="password"
            type="password"
            required
            className="mt-1 w-full border border-ink-700 bg-ink-950 px-3 py-2 text-sm"
          />
        </label>
        <button
          type="submit"
          className="w-full bg-signal py-2 text-sm font-medium text-ink-950 hover:bg-signal-dim"
        >
          Sign in
        </button>
        <p className="mt-4 text-xs text-ink-500">
          Seed an admin user via <code className="font-mono">prisma/seed-admin.ts</code> (see README) before first login.
        </p>
      </form>
    </div>
  );
}
