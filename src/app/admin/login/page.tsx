"use client";

import { useState, type FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Suspense } from "react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setLoading(true);

    const supabase = createClient();

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError("Invalid email or password. Please try again.");
      setLoading(false);
      return;
    }

    router.replace("/admin");
    router.refresh();
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f8f5ef] px-6 py-12">
      <div className="w-full max-w-md rounded-2xl border border-[#e8dfd2] bg-white p-8 shadow-sm">
        <div className="mb-8 text-center">
          <p className="text-sm font-semibold tracking-[0.3em] text-[#a65d3f]">
            SPICES BETO
          </p>

          <h1 className="mt-5 text-3xl font-semibold text-[#38271f]">
            Admin Login
          </h1>

          <p className="mt-3 text-sm text-[#78685e]">
            Sign in to manage your store.
          </p>
        </div>

        {searchParams.get("error") === "auth" && (
  <p className="mb-5 rounded-lg bg-red-50 p-3 text-sm text-red-700">
    Your invitation link could not be verified. Please try again or
    request a new invitation.
  </p>
)}

{searchParams.get("error") === "unauthorized" && (
  <p className="mb-5 rounded-lg bg-red-50 p-3 text-sm text-red-700">
    You do not have administrator permissions.
  </p>
)}

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-medium text-[#38271f]"
            >
              Email address
            </label>

            <input
              id="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="admin@example.com"
              className="w-full rounded-lg border border-[#e3d8cb] px-4 py-3 text-sm text-[#38271f] outline-none transition focus:border-[#a65d3f] focus:ring-2 focus:ring-[#a65d3f]/20"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-2 block text-sm font-medium text-[#38271f]"
            >
              Password
            </label>

            <input
              id="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Enter your password"
              className="w-full rounded-lg border border-[#e3d8cb] px-4 py-3 text-sm text-[#38271f] outline-none transition focus:border-[#a65d3f] focus:ring-2 focus:ring-[#a65d3f]/20"
            />
          </div>

          {error && (
            <p
              role="alert"
              className="rounded-lg bg-red-50 p-3 text-sm text-red-700"
            >
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-[#8f4d35] px-4 py-3 font-medium text-white transition hover:bg-[#713b29] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <p className="mt-8 text-center text-xs text-[#94877e]">
          Authorized SPICES BETO administrators only.
        </p>
      </div>
    </main>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}