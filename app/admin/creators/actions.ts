"use server";

import { revalidatePath } from "next/cache";
import { apiFetch, ApiError } from "@/lib/api/client";
import { ENDPOINTS } from "@/lib/api/endpoints";

async function moderate(url: string) {
  try {
    await apiFetch(url, { method: "POST" });
    revalidatePath("/admin/creators");
    revalidatePath("/admin");
    return { ok: true as const };
  } catch (e) {
    if (e instanceof ApiError) {
      const d = e.details as { title?: string; message?: string } | undefined;
      return {
        ok: false as const,
        error: d?.title || d?.message || e.message,
      };
    }
    return {
      ok: false as const,
      error: e instanceof Error ? e.message : "Hata",
    };
  }
}

export const verifyCreator = (id: string) => moderate(ENDPOINTS.admin.verifyCreator(id));
export const suspendCreator = (id: string) => moderate(ENDPOINTS.admin.suspendCreator(id));
export const reactivateCreator = (id: string) => moderate(ENDPOINTS.admin.reactivateCreator(id));
