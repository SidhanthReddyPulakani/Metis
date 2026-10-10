
"use client";

import { useState, type FormEvent } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import { ApiError, api, type AuthCredentials, type User } from "@/lib/api";
import { Button } from "@/components/ui/button";

type AuthMode = "login" | "register";

const CURRENT_USER_QUERY_KEY = ["auth", "current-user"] as const;

export function AuthPanel() {
  const [mode, setMode] = useState<AuthMode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const queryClient = useQueryClient();
  const router = useRouter();

  const authMutation = useMutation({
    mutationFn: (credentials: AuthCredentials) =>
      mode === "login"
        ? api.auth.login(credentials)
        : api.auth.register(credentials),

    onSuccess: (user: User) => {
      queryClient.setQueryData(CURRENT_USER_QUERY_KEY, user);
      setPassword("");
      setErrorMessage("");
      router.replace("/");
    },

    onError: (error: Error) => {
      if (error instanceof ApiError) {
        if (error.status === 401) {
          setErrorMessage("Invalid email or password.");
          return;
        }

        if (error.status === 409) {
          setErrorMessage(
            mode === "register"
              ? "An account with this email already exists."
              : error.message,
          );
          return;
        }

        if (error.status === 422) {
          setErrorMessage(
            "Check your email and password requirements.",
          );
          return;
        }
      }

      setErrorMessage(
        "Unable to reach Metis. Please try again.",
      );
    },
  });

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage("");

    authMutation.mutate({
      email: email.trim(),
      password,
    });
  }

  function changeMode(nextMode: AuthMode) {
    if (nextMode === mode) return;

    setMode(nextMode);
    setErrorMessage("");
    authMutation.reset();
  }

  return (
    <section className="mx-auto w-full max-w-md">
      <header className="mb-9">
        <a
          href="/"
          className="text-4xl font-medium text-[#472401]"
          style={{ fontFamily: "var(--font-josefin-slab)" }}
        >
          Metis
        </a>

        <p className="mt-2 text-sm text-[#724e2a]">
          Intelligence, Forged from Data.
        </p>
      </header>

      <div className="mb-7">
        <h1 className="text-3xl font-semibold tracking-tight text-[#472401]">
          {mode === "login" ? "Welcome back" : "Create your account"}
        </h1>

        <p className="mt-2 text-sm text-[#724e2a]">
          {mode === "login"
            ? "Sign in to continue to your workspace."
            : "Start building intelligence from your data."}
        </p>
      </div>

      <div
        className="mb-7 grid grid-cols-2 rounded-xl bg-[#724e2a]/10 p-1"
        aria-label="Authentication mode"
      >
        <Button
          type="button"
          variant={mode === "login" ? "default" : "ghost"}
          className={
            mode === "login"
              ? "w-full bg-[#472401] text-[#F7E1CB] hover:bg-[#724e2a]"
              : "w-full text-[#472401]"
          }
          onClick={() => changeMode("login")}
          disabled={authMutation.isPending}
          aria-pressed={mode === "login"}
        >
          Login
        </Button>

        <Button
          type="button"
          variant={mode === "register" ? "default" : "ghost"}
          className={
            mode === "register"
              ? "w-full bg-[#472401] text-[#F7E1CB] hover:bg-[#724e2a]"
              : "w-full text-[#472401]"
          }
          onClick={() => changeMode("register")}
          disabled={authMutation.isPending}
          aria-pressed={mode === "register"}
        >
          Register
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-2">
          <label
            htmlFor="auth-email"
            className="block text-sm font-medium text-[#472401]"
          >
            Email address
          </label>

          <input
            id="auth-email"
            name="email"
            type="email"
            autoComplete="email"
            required
            maxLength={320}
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@example.com"
            className="w-full rounded-lg border border-[#724e2a]/30 bg-white/60 px-4 py-3 text-[#472401] outline-none transition placeholder:text-[#724e2a]/60 focus:border-[#724e2a] focus:ring-2 focus:ring-[#724e2a]/15"
          />
        </div>

        <div className="space-y-2">
          <label
            htmlFor="auth-password"
            className="block text-sm font-medium text-[#472401]"
          >
            Password
          </label>

          <input
            id="auth-password"
            name="password"
            type="password"
            autoComplete={
              mode === "login" ? "current-password" : "new-password"
            }
            required
            minLength={8}
            maxLength={128}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Enter your password"
            className="w-full rounded-lg border border-[#724e2a]/30 bg-white/60 px-4 py-3 text-[#472401] outline-none transition placeholder:text-[#724e2a]/60 focus:border-[#724e2a] focus:ring-2 focus:ring-[#724e2a]/15"
          />

          {mode === "register" && (
            <p className="text-xs text-[#724e2a]">
              Use 8–128 characters.
            </p>
          )}
        </div>

        {errorMessage && (
          <p
            role="alert"
            className="rounded-lg border border-red-800/20 bg-red-50 px-3 py-2 text-sm text-red-800"
          >
            {errorMessage}
          </p>
        )}

        <Button
          type="submit"
          className="h-12 w-full bg-[#472401] text-[#F7E1CB] hover:bg-[#724e2a]"
          disabled={authMutation.isPending}
        >
          {authMutation.isPending
            ? "Please wait…"
            : mode === "login"
              ? "Sign in"
              : "Create account"}
        </Button>
      </form>

      <p className="mt-7 text-center text-xs leading-relaxed text-[#724e2a]">
        Your session is managed securely by Metis.
      </p>
    </section>
  );
}
