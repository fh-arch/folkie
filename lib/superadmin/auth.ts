import { cookies } from "next/headers";
import { createHmac } from "crypto";
import { redirect } from "next/navigation";

const SESSION_COOKIE = "sa_session";
const SECRET = process.env.SUPERADMIN_SESSION_SECRET ?? "change-me-in-env";
const MAX_AGE = 60 * 60 * 8; // 8 hours

function sign(payload: string): string {
  return createHmac("sha256", SECRET).update(payload).digest("hex");
}

export async function createSession(email: string): Promise<void> {
  const payload = `${email}:${Date.now()}`;
  const sig = sign(payload);
  const value = `${Buffer.from(payload).toString("base64")}.${sig}`;
  const jar = await cookies();
  jar.set(SESSION_COOKIE, value, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: MAX_AGE,
    path: "/superleo",
  });
}

export async function destroySession(): Promise<void> {
  const jar = await cookies();
  jar.delete(SESSION_COOKIE);
}

export async function getSession(): Promise<{ email: string } | null> {
  const jar = await cookies();
  const raw = jar.get(SESSION_COOKIE)?.value;
  if (!raw) return null;
  const [b64, sig] = raw.split(".");
  if (!b64 || !sig) return null;
  const payload = Buffer.from(b64, "base64").toString("utf-8");
  if (sign(payload) !== sig) return null;
  const [email] = payload.split(":");
  return email ? { email } : null;
}

export async function requireSession(): Promise<{ email: string }> {
  const session = await getSession();
  if (!session) redirect("/superleo/login");
  return session;
}

export function checkCredentials(email: string, password: string): boolean {
  const validEmail = process.env.SUPERADMIN_EMAIL;
  const validPass = process.env.SUPERADMIN_PASSWORD;
  if (!validEmail || !validPass) return false;
  return email === validEmail && password === validPass;
}

export function getSuperAdminKey(): string {
  return process.env.SUPERADMIN_API_KEY ?? "";
}
