"use server";

import { revalidatePath } from "next/cache";
import { saFetch } from "@/lib/superadmin/api";
import { requireSession } from "@/lib/superadmin/auth";

export async function blockUser(fd: FormData) {
  await requireSession();
  const userId = fd.get("userId") as string;
  const reason = fd.get("reason") as string;
  await saFetch(`/api/v1/superadmin/users/${userId}/block`, {
    method: "POST",
    body: JSON.stringify({ reason }),
  });
  revalidatePath("/superleo/users");
}

export async function unblockUser(fd: FormData) {
  await requireSession();
  const userId = fd.get("userId") as string;
  await saFetch(`/api/v1/superadmin/users/${userId}/unblock`, {
    method: "POST",
    body: JSON.stringify({}),
  });
  revalidatePath("/superleo/users");
}
