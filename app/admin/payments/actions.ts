"use server";

import { revalidatePath } from "next/cache";
import { apiFetch, ApiError } from "@/lib/api/client";
import { ENDPOINTS } from "@/lib/api/endpoints";

export async function approvePayment(paymentId: string, note: string | null) {
  try {
    await apiFetch(ENDPOINTS.admin.approvePayment(paymentId), {
      method: "POST",
      body: { note },
    });
    revalidatePath("/admin/payments");
    return { ok: true as const };
  } catch (e) {
    return errorResult(e);
  }
}

export async function markTransferred(
  paymentId: string,
  transferReference: string,
  note: string | null,
) {
  try {
    await apiFetch(ENDPOINTS.admin.transferPayment(paymentId), {
      method: "POST",
      body: { transferReference, note },
    });
    revalidatePath("/admin/payments");
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
