"use server";

import { revalidatePath } from "next/cache";
import { saFetch } from "@/lib/superadmin/api";
import { requireSession } from "@/lib/superadmin/auth";

export async function confirmBrandPayment(fd: FormData) {
  await requireSession();
  const paymentId = fd.get("paymentId") as string;
  const reference = (fd.get("reference") as string) || null;
  await saFetch(`/api/v1/superadmin/brand-payments/${paymentId}/confirm`, {
    method: "POST",
    body: JSON.stringify({ reference, note: null }),
  });
  revalidatePath("/superleo/pending");
  revalidatePath("/superleo");
}

export async function transferCreatorPayout(fd: FormData) {
  await requireSession();
  const paymentId = fd.get("paymentId") as string;
  const reference = (fd.get("reference") as string) || "manual";
  await saFetch(`/api/v1/superadmin/payments/${paymentId}/transfer`, {
    method: "POST",
    body: JSON.stringify({ reference }),
  });
  revalidatePath("/superleo/pending");
  revalidatePath("/superleo");
}
