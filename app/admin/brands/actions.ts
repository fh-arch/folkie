"use server";

import { revalidatePath } from "next/cache";
import { apiFetch, ApiError } from "@/lib/api/client";
import { ENDPOINTS } from "@/lib/api/endpoints";

async function moderate(url: string) {
  try {
    await apiFetch(url, { method: "POST" });
    revalidatePath("/admin/brandlar");
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

export const verifyBrand = (id: string) => moderate(ENDPOINTS.admin.verifyBrand(id));
export const suspendBrand = (id: string) => moderate(ENDPOINTS.admin.suspendBrand(id));
export const reactivateBrand = (id: string) => moderate(ENDPOINTS.admin.reactivateBrand(id));
