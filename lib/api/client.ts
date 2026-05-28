/**
 * Folkie API client — .NET backend ile iletişim için typed fetch wrapper.
 *
 * Backend swagger.json üretildikten sonra `npm run api:generate` ile
 * lib/api/schema.ts otomatik üretilir ve buradaki tipler ona bağlanır.
 *
 * Şimdilik manuel tip tanımlarıyla iskelet kuruluyor.
 */

import { auth } from "@clerk/nextjs/server";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5050";
// Server-side (Server Components, Server Actions, Route Handlers) use the
// internal container URL so requests never leave the Docker network.
const SERVER_API_URL = process.env.BACKEND_INTERNAL_URL ?? API_URL;

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public details?: unknown,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

interface FetchOptions extends Omit<RequestInit, "body"> {
  body?: unknown;
  /** Sunucu komponentinde bile public olması gerekiyorsa false */
  authenticated?: boolean;
}

/**
 * Server Component / Server Action / Route Handler içinden çağırılır.
 * Clerk JWT'sini otomatik ekler.
 */
export async function apiFetch<T>(
  path: string,
  options: FetchOptions = {},
): Promise<T> {
  const { body, authenticated = true, headers, ...rest } = options;

  const headersInit: HeadersInit = {
    "Content-Type": "application/json",
    ...headers,
  };

  if (authenticated) {
    const { getToken } = await auth();
    const token = await getToken();
    if (!token) throw new ApiError("Unauthorized — please sign in", 401);
    (headersInit as Record<string, string>)["Authorization"] =
      `Bearer ${token}`;
  }

  const res = await fetch(`${SERVER_API_URL}${path}`, {
    ...rest,
    headers: headersInit,
    body: body !== undefined ? JSON.stringify(body) : undefined,
    cache: rest.cache ?? "no-store",
  });

  if (!res.ok) {
    // Read body as text first — once consumed by .json(), .text() fails with
    // "Body is unusable". Parse JSON from the text so we never double-read.
    const text = await res.text();
    let details: unknown = text;
    try {
      details = JSON.parse(text);
    } catch {
      /* leave as plain text */
    }
    throw new ApiError(
      `Request failed (${res.status})`,
      res.status,
      details,
    );
  }

  if (res.status === 204) return undefined as T;
  const okText = await res.text();
  return okText ? (JSON.parse(okText) as T) : (undefined as T);
}

/**
 * Browser tarafında (Client Component / use client) çağrılır.
 * Clerk JWT'si ön taraftan getToken() ile alınır.
 */
export async function apiFetchBrowser<T>(
  path: string,
  token: string | null,
  options: Omit<FetchOptions, "authenticated"> = {},
): Promise<T> {
  const { body, headers, ...rest } = options;

  const headersInit: HeadersInit = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...headers,
  };

  const res = await fetch(`${API_URL}${path}`, {
    ...rest,
    headers: headersInit,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    const text = await res.text();
    let details: unknown = text;
    try {
      details = JSON.parse(text);
    } catch {
      /* leave as plain text */
    }
    throw new ApiError(`API hatası (${res.status})`, res.status, details);
  }

  if (res.status === 204) return undefined as T;
  const okText = await res.text();
  return okText ? (JSON.parse(okText) as T) : (undefined as T);
}
