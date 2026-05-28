import { auth, currentUser } from "@clerk/nextjs/server";
import type { UserRole } from "@/types";
import { apiFetch } from "@/lib/api/client";
import { ENDPOINTS } from "@/lib/api/endpoints";

/**
 * Source of truth for user role: the Folkie backend `/api/v1/me` endpoint.
 * Clerk publicMetadata can drift; the Folkie users table is canonical.
 */

interface MeResponse {
  id: string;
  clerkUserId: string;
  email: string;
  role: string;
  fullName: string | null;
  avatarUrl: string | null;
  createdAt: string;
}

export async function getCurrentUserRole(): Promise<UserRole | null> {
  const { userId } = await auth();
  if (!userId) return null;
  try {
    const me = await apiFetch<MeResponse>(ENDPOINTS.me());
    if (me.role === "influencer" || me.role === "brand" || me.role === "admin") {
      return me.role as UserRole;
    }
  } catch {
    // Fallback to Clerk metadata if backend is unreachable
    const user = await currentUser();
    const role = user?.publicMetadata?.role;
    if (role === "influencer" || role === "brand" || role === "admin") {
      return role;
    }
  }
  return null;
}

export async function requireRole(...allowed: UserRole[]): Promise<UserRole> {
  const { userId } = await auth();
  if (!userId) throw new Error("Yetkisiz");
  const role = await getCurrentUserRole();
  if (!role || !allowed.includes(role)) {
    throw new Error("Bu sayfaya erişim yetkin yok");
  }
  return role;
}

/**
 * Onboarding tamamlanmış mı?
 * publicMetadata.onboardingCompleted backend tarafından set edilir.
 */
export async function isOnboardingCompleted(): Promise<boolean> {
  const user = await currentUser();
  return user?.publicMetadata?.onboardingCompleted === true;
}
