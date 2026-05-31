"use client";

import { useState, useTransition } from "react";
import { loginAction } from "./actions";
import { Shield, Loader2 } from "lucide-react";

export default function SuperAdminLoginPage() {
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const fd = new FormData(e.currentTarget);
    startTransition(async () => {
      const result = await loginAction(fd);
      if (result?.error) setError(result.error);
    });
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0D1226] px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
            <Shield className="h-7 w-7" />
          </div>
          <h1 className="mt-4 text-2xl font-bold text-white">folkie</h1>
          <p className="mt-1 text-sm text-white/50">Super Admin Access</p>
        </div>

        <form onSubmit={handleSubmit} className="rounded-2xl bg-white/5 p-6 backdrop-blur">
          <div className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-white/80">Email</label>
              <input
                name="email"
                type="email"
                required
                autoComplete="off"
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-white/30 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                placeholder="admin@domain.com"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-white/80">Password</label>
              <input
                name="password"
                type="password"
                required
                autoComplete="off"
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-white/30 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                placeholder="••••••••"
              />
            </div>
          </div>

          {error && (
            <p className="mt-3 text-center text-sm text-red-400">{error}</p>
          )}

          <button
            type="submit"
            disabled={pending}
            className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3 text-sm font-semibold text-white hover:bg-primary/90 disabled:opacity-60"
          >
            {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Shield className="h-4 w-4" />}
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
}
