"use server";

import { redirect } from "next/navigation";
import { checkCredentials, createSession } from "@/lib/superadmin/auth";

export async function loginAction(fd: FormData): Promise<{ error: string } | never> {
  const email    = (fd.get("email")    as string ?? "").trim().toLowerCase();
  const password = (fd.get("password") as string ?? "").trim();

  if (!checkCredentials(email, password)) {
    return { error: "Invalid credentials." };
  }

  await createSession(email);
  redirect("/superleo");
}
