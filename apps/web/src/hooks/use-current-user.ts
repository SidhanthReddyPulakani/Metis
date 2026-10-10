
"use client";

import { useQuery } from "@tanstack/react-query";
import { ApiError, api, type User } from "@/lib/api";

const CURRENT_USER_QUERY_KEY = ["auth", "current-user"] as const;

async function fetchCurrentUser(): Promise<User | null> {
  try {
    return await api.auth.me();
  } catch (error) {
    // A 401 means there is no valid authenticated session.
    if (error instanceof ApiError && error.status === 401) {
      return null;
    }

    // Network errors and server failures must remain visible.
    throw error;
  }
}

export function useCurrentUser() {
  const query = useQuery({
    queryKey: CURRENT_USER_QUERY_KEY,
    queryFn: fetchCurrentUser,
  });

  return {
    user: query.data ?? null,
    isLoading: query.isPending,
    isAuthenticated: query.data != null,
    error: query.error,
    refetch: query.refetch,
  };
}
