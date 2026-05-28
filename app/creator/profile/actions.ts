"use server";

import { revalidatePath } from "next/cache";
import { apiFetch, ApiError } from "@/lib/api/client";
import { ENDPOINTS } from "@/lib/api/endpoints";

export interface CreatorProfileData {
  bio: string | null;
  city: string | null;
  categories: string[];
  subcategories: string[];
  contentLanguage: string[];
  iban: string | null;       // plaintext on input; backend encrypts
  ibanName: string | null;
}

export interface CreatorProfileRead {
  id: string;
  tiktokHandle: string | null;
  followerCount: number;
  engagementRate: number;
  tier: string;
  city: string | null;
  contentLanguage: string[];
  categories: string[];
  subcategories: string[];
  bio: string | null;
  ibanName: string | null;
  hasIban: boolean;
  isVerified: boolean;
  lastTiktokSync: string | null;
}

export async function getCreatorProfile(): Promise<CreatorProfileRead | null> {
  try {
    return await apiFetch<CreatorProfileRead>(ENDPOINTS.creator.profile());
  } catch {
    return null;
  }
}

export async function saveCreatorProfile(input: CreatorProfileData) {
  try {
    await apiFetch(ENDPOINTS.creator.profile(), {
      method: "PUT",
      body: input,
    });
    revalidatePath("/creator/profile");
    revalidatePath("/creator");
    return { ok: true as const };
  } catch (e) {
    if (e instanceof ApiError) {
      const details = e.details as {
        title?: string;
        detail?: Array<{ propertyName: string; errorMessage: string }>;
      } | undefined;
      // Show specific field errors (e.g. IBAN format) — fall back to generic title
      const fieldErrors = details?.detail?.map((d) => d.errorMessage).join(" · ");
      return {
        ok: false as const,
        error: fieldErrors || details?.title || e.message,
      };
    }
    return {
      ok: false as const,
      error: e instanceof Error ? e.message : "Unknown error",
    };
  }
}
