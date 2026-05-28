"use server";

import { revalidatePath } from "next/cache";
import { apiFetch, ApiError } from "@/lib/api/client";
import { ENDPOINTS } from "@/lib/api/endpoints";

export async function publishSubmission(submissionId: string, tiktokUrl: string) {
  try {
    await apiFetch(ENDPOINTS.creator.publishSubmission(submissionId), {
      method: "POST",
      body: { tiktokUrl },
    });
    revalidatePath("/creator/drafts");
    return { ok: true as const };
  } catch (e) {
    if (e instanceof ApiError) {
      const d = e.details as { title?: string } | undefined;
      return { ok: false as const, error: d?.title || e.message };
    }
    return { ok: false as const, error: e instanceof Error ? e.message : "Hata" };
  }
}
