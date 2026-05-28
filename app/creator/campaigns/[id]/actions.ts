"use server";

import { revalidatePath } from "next/cache";
import { apiFetch, ApiError } from "@/lib/api/client";
import { ENDPOINTS } from "@/lib/api/endpoints";

export interface ApplyResult {
  ok: boolean;
  applicationId?: string;
  error?: string;
}

export async function applyToCampaign(campaignId: string): Promise<ApplyResult> {
  try {
    const result = await apiFetch<{ id: string }>(ENDPOINTS.creator.apply(campaignId), {
      method: "POST",
    });
    revalidatePath(`/creator/campaigns/${campaignId}`);
    revalidatePath("/creator/collaborations");
    return { ok: true, applicationId: result.id };
  } catch (e) {
    if (e instanceof ApiError) {
      const details = e.details as { title?: string } | undefined;
      return { ok: false, error: details?.title || e.message };
    }
    return { ok: false, error: e instanceof Error ? e.message : "Bilinmeyen hata" };
  }
}
