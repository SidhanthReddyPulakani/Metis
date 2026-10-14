"use client";

import { useRouter } from "next/navigation";

import { useCurrentUser } from "@/hooks/use-current-user";

export function HomeHeader() {
  const router = useRouter();
  const { user, isLoading, error, refetch } = useCurrentUser();

  return (
    <header className="relative z-50 flex w-full items-center justify-end gap-5 px-6 py-5 sm:px-10">
      {isLoading ? (
        <span
          className="text-sm text-[#724e2a]"
          aria-live="polite"
        >
          Checking session…
        </span>
      ) : error ? (
        <button
          type="button"
          onClick={() => void refetch()}
          className="relative z-50 cursor-pointer border-0 bg-transparent px-3 py-2 text-[#472401] hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#472401]"
        >
          Retry session check
        </button>
      ) : user ? (
        <span
          className="max-w-48 truncate text-sm text-[#724e2a]"
          title={user.email}
        >
          {user.email}
        </span>
      ) : (
        <button
          type="button"
          onClick={() => router.push("/login")}
          className="relative z-50 cursor-pointer border-0 bg-transparent px-3 py-2 text-[#472401] hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#472401]"
        >
          Login
        </button>
      )}
    </header>
  );
}