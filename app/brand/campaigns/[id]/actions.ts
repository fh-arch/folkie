"use server";

import { revalidatePath } from "next/cache";
import { apiFetch, ApiError } from "@/lib/api/client";
import { ENDPOINTS } from "@/lib/api/endpoints";

export async function approveApplication(
  campaignId: string,
  applicationId: string,
) {
  try {
    await apiFetch(ENDPOINTS.brand.approveApplication(applicationId), {
      method: "POST",
    });
    revalidatePath(`/brand/campaigns/${campaignId}`);
    return { ok: true as const };
  } catch (e) {
    return errorResult(e);
  }
}

export async function rejectApplication(
  campaignId: string,
  applicationId: string,
  reason: string,
) {
  try {
    await apiFetch(ENDPOINTS.brand.rejectApplication(applicationId), {
      method: "POST",
      body: { reason },
    });
    revalidatePath(`/brand/campaigns/${campaignId}`);
    return { ok: true as const };
  } catch (e) {
    return errorResult(e);
  }
}

export async function submitCampaign(campaignId: string) {
  try {
    await apiFetch(ENDPOINTS.brand.submitCampaign(campaignId), {
      method: "POST",
    });
    revalidatePath(`/brand/campaigns/${campaignId}`);
    return { ok: true as const };
  } catch (e) {
    return errorResult(e);
  }
}

function errorResult(e: unknown) {
  if (e instanceof ApiError) {
    const details = e.details as { title?: string } | undefined;
    return { ok: false as const, error: details?.title || e.message };
  }
  return {
    ok: false as const,
    error: e instanceof Error ? e.message : "Bilinmeyen hata",
  };
}
