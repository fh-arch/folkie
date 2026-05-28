"use server";

import { revalidatePath } from "next/cache";
import { apiFetch, ApiError } from "@/lib/api/client";
import { ENDPOINTS } from "@/lib/api/endpoints";

export async function addFavorite(influencerProfileId: string, note: string | null) {
  try {
    await apiFetch(ENDPOINTS.brand.favorites(), {
      method: "POST",
      body: { influencerProfileId, note },
    });
    revalidatePath("/brand/favorites");
    revalidatePath("/brand/discover");
    return { ok: true as const };
  } catch (e) {
    return errorResult(e);
  }
}

export async function removeFavorite(influencerProfileId: string) {
  try {
    await apiFetch(ENDPOINTS.brand.favorite(influencerProfileId), {
      method: "DELETE",
    });
    revalidatePath("/brand/favorites");
    revalidatePath("/brand/discover");
    return { ok: true as const };
  } catch (e) {
    return errorResult(e);
  }
}

function errorResult(e: unknown) {
  if (e instanceof ApiError) {
    const d = e.details as { title?: string } | undefined;
    return { ok: false as const, error: d?.title || e.message };
  }
  return { ok: false as const, error: e instanceof Error ? e.message : "Hata" };
}
