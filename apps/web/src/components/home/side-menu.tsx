
"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  ChevronRight,
  CreditCard,
  FolderOpen,
  LogOut,
  Plus,
  Settings,
  X,
} from "lucide-react";

import { useCurrentUser } from "@/hooks/use-current-user";
import { api } from "@/lib/api";

const CURRENT_USER_QUERY_KEY = ["auth", "current-user"] as const;

export function SideMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const queryClient = useQueryClient();
  const { user } = useCurrentUser();

  const logoutMutation = useMutation({
    mutationFn: () => api.auth.logout(),
    onSuccess: () => {
      queryClient.setQueryData(CURRENT_USER_QUERY_KEY, null);
      setIsOpen(false);
      router.replace("/");
    },
  });

  useEffect(() => {
    if (!isOpen) return;

    function handlePointerDown(event: PointerEvent) {
      if (
        event.target instanceof Node &&
        !menuRef.current?.contains(event.target)
      ) {
        setIsOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setIsOpen(false);
    }

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  function openLogin() {
    setIsOpen(false);
    router.push("/login");
  }


  function handleProjectAction() {
    setIsOpen(false);

    if (!user) {
      router.push("/login?next=%2Fprojects%2Fnew");
      return;
    }

    router.push("/projects/new");
  }


  function handleExistingProjects() {
    setIsOpen(false);

    if (!user) {
      router.push("/login?next=%2Fprojects");
      return;
    }

    // Existing-projects route will be implemented separately.
  }

  return (
    <div ref={menuRef} className="relative">

        <button
        type="button"
        aria-label="Toggle navigation menu"
        aria-expanded={isOpen}
        aria-controls="metis-side-menu"
        onClick={() => setIsOpen((open) => !open)}
        className="flex h-8 w-8 cursor-pointer items-center justify-center border-0 bg-transparent p-0 text-[#472401] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#472401]"
        >
        <svg
            width="30"
            height="18"
            viewBox="0 0 32 20"
            fill="none"
            aria-hidden="true"
        >
            <rect x="1" y="1" width="30" height="4" rx="2" fill="currentColor" />
            <rect x="1" y="8" width="21" height="4" rx="2" fill="currentColor" />
            <rect x="1" y="15" width="13" height="4" rx="2" fill="currentColor" />
        </svg>
        </button>


      {isOpen && (
        <nav
          id="metis-side-menu"
          aria-label="Main navigation"
          className="absolute left-0 top-0 z-[100] w-[324px] max-w-[calc(100vw-32px)] rounded-xl bg-[#F4CAA0] p-3 text-[#472401] shadow-lg ring-1 ring-[#472401]/10"
        >
          <button
            type="button"
            onClick={handleProjectAction}
            className="flex w-full cursor-pointer items-center justify-between rounded-lg px-3 py-3 text-left text-sm hover:bg-[#472401]/[0.06] focus-visible:outline-2 focus-visible:outline-[#472401]"
          >
            <span className="flex items-center gap-3">
              <Plus size={17} />
              Create New Project
            </span>
            <ChevronRight size={16} />
          </button>

          <button
            type="button"
            onClick={handleExistingProjects}
            className="flex w-full cursor-pointer items-center justify-between rounded-lg px-3 py-3 text-left text-sm hover:bg-[#472401]/[0.06] focus-visible:outline-2 focus-visible:outline-[#472401]"
          >
            <span className="flex items-center gap-3">
              <FolderOpen size={17} />
              Existing Projects
            </span>
            <ChevronRight size={16} />
          </button>

          {user && (
            <>
              <button
                type="button"
                disabled
                title="Billing is not available yet"
                className="flex w-full cursor-not-allowed items-center justify-between rounded-lg px-3 py-3 text-left text-sm opacity-60"
              >
                <span className="flex items-center gap-3">
                  <CreditCard size={17} />
                  Billing
                </span>
                <ChevronRight size={16} />
              </button>

              <button
                type="button"
                disabled
                title="Settings are not available yet"
                className="flex w-full cursor-not-allowed items-center justify-between rounded-lg px-3 py-3 text-left text-sm opacity-60"
              >
                <span className="flex items-center gap-3">
                  <Settings size={17} />
                  Settings
                </span>
                <ChevronRight size={16} />
              </button>
            </>
          )}

          {!user && (
            <>
              <div className="my-2 border-t border-[#472401]/15" />
              <button
                type="button"
                onClick={openLogin}
                className="w-full cursor-pointer rounded-lg px-3 py-3 text-left text-sm hover:bg-[#472401]/[0.06] focus-visible:outline-2 focus-visible:outline-[#472401]"
              >
                Log in / Register
              </button>
            </>
          )}

          {user && (
            <>
              <div className="my-2 border-t border-[#472401]/20" />
              <button
                type="button"
                disabled={logoutMutation.isPending}
                onClick={() => logoutMutation.mutate()}
                className="flex w-full cursor-pointer items-center gap-3 rounded-lg px-3 py-3 text-left text-sm hover:bg-[#472401]/[0.06] focus-visible:outline-2 focus-visible:outline-[#472401] disabled:cursor-wait disabled:opacity-60"
              >
                <LogOut size={17} />
                {logoutMutation.isPending ? "Signing out…" : "Logout"}
              </button>

              {logoutMutation.isError && (
                <p role="alert" className="px-3 py-2 text-xs text-red-800">
                  Logout failed. Please try again.
                </p>
              )}
            </>
          )}
        </nav>
      )}
    </div>
  );
}
