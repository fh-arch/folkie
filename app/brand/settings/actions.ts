"use server";

import { revalidatePath } from "next/cache";
import { apiFetch, ApiError } from "@/lib/api/client";
import { ENDPOINTS } from "@/lib/api/endpoints";

export interface BrandProfileData {
  brandName: string;
  taxId: string | null;
  industry: string | null;
  website: string | null;
  logoUrl: string | null;
  contactName: string | null;
  contactPhone: string | null;
  billingAddress: string | null;
}

export async function getBrandProfile(): Promise<BrandProfileData | null> {
  try {
    const profile = await apiFetch<BrandProfileData & { id: string }>(
      ENDPOINTS.brand.profile(),
    );
    return profile;
  } catch {
    return null;
  }
}

export async function saveBrandProfile(input: BrandProfileData) {
  try {
    await apiFetch(ENDPOINTS.brand.profile(), {
      method: "PUT",
      body: input,
    });
    revalidatePath("/brand/settings");
    revalidatePath("/brand");
    return { ok: true as const };
  } catch (e) {
    if (e instanceof ApiError) {
      const details = e.details as
        | { title?: string; detail?: Array<{ propertyName: string; errorMessage: string }> }
        | undefined;
      return {
        ok: false as const,
        error: details?.title || e.message,
        fieldErrors: details?.detail,
      };
    }
    return {
      ok: false as const,
      error: e instanceof Error ? e.message : "Bilinmeyen hata",
    };
  }
}
