
const API_BASE_URL = (
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000"
).replace(/\/+$/, "");

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly details?: unknown,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

async function request<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    credentials: "include",
    headers: {
      Accept: "application/json",
      ...options.headers,
    },
  });

  if (response.status === 204) {
    if (!response.ok) {
      throw new ApiError("Request failed.", response.status);
    }
    return undefined as T;
  }

  const contentType = response.headers.get("content-type");
  let body: unknown;

  if (contentType?.includes("application/json")) {
    body = await response.json();
  } else {
    body = await response.text();
  }

  if (!response.ok) {
    const detail =
      typeof body === "object" && body !== null && "detail" in body
        ? body.detail
        : undefined;

    const message =
      typeof detail === "string"
        ? detail
        : `Request failed with status ${response.status}.`;

    throw new ApiError(message, response.status, body);
  }

  return body as T;
}

export interface User {
  id: string;
  email: string;
  is_active: boolean;
}

export interface AuthCredentials {
  email: string;
  password: string;
}

export const api = {
  auth: {
    register: (credentials: AuthCredentials) =>
      request<User>("/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      }),

    login: (credentials: AuthCredentials) =>
      request<User>("/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      }),

    me: () => request<User>("/auth/me"),

    logout: () =>
      request<void>("/auth/logout", {
        method: "POST",
      }),
  },
  projects: {
  create: (input: CreateProjectInput) =>
    request<Project>("/projects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
      }),
  },
};

export interface Project {
  id: string;
  name: string;
  description: string | null;
  status: "active" | "archived";
  default_task_type: "classification" | "regression" | null;
  created_at: string;
  updated_at: string;
}

export interface CreateProjectInput {
  name: string;
  description?: string | null;
}