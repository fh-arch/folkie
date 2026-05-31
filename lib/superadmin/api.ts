import { getSuperAdminKey } from "./auth";

const API_URL = process.env.BACKEND_INTERNAL_URL ?? process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5050";

export class SuperAdminApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}

export async function saFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const key = getSuperAdminKey();
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      "X-Super-Admin-Key": key,
      // super admin bypass — no Clerk JWT needed
      "Authorization": `Bearer __superadmin_bypass__`,
      ...options.headers,
    },
    cache: "no-store",
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new SuperAdminApiError(res.status, text || `Error ${res.status}`);
  }
  if (res.status === 204) return undefined as unknown as T;
  const text = await res.text();
  return (text ? JSON.parse(text) : undefined) as T;
}
