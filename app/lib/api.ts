export class ApiError extends Error {
  constructor(public status: number, public data: Record<string, unknown>) {
    super((data?.message as string) || "Something went wrong");
  }
}

export async function apiRequest<T = unknown>(
  path: string,
  options?: RequestInit
): Promise<{ status: number; data: T }> {
  const res = await fetch(path, {
    credentials: "include",
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options?.headers ?? {}),
    },
  });

  const data = await res.json();

  if (!res.ok) {
    throw new ApiError(res.status, data);
  }

  return { status: res.status, data };
}