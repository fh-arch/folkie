"use server";

import { auth, clerkClient } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { apiFetch } from "@/lib/api/client";
import { ENDPOINTS } from "@/lib/api/endpoints";

/**
 * Onboarding adım 1: kullanıcı creator mı marka mı seçti.
 * 1. Clerk publicMetadata'ya role yazar
 * 2. Backend'de minimal profil oluşturur (creator için boş, brand için brand name)
 * 3. İlgili panele yönlendirir
 */
export async function selectRole(role: "influencer" | "brand", brandName?: string) {
  const { userId } = await auth();
  if (!userId) throw new Error("Yetkisiz: oturum yok");

  // 1. Clerk metadata güncelle
  const client = await clerkClient();
  await client.users.updateUserMetadata(userId, {
    publicMetadata: {
      role,
      onboardingCompleted: true,
      ...(brandName ? { brandName } : {}),
    },
  });

  // 2. Set the role directly in the DB — don't rely on async webhook timing.
  //    The webhook will fire eventually and sync, but we need the role NOW.
  await apiFetch(ENDPOINTS.meRole(), {
    method: "PUT",
    body: { role },
  });

  // 3. Create the role-specific profile. Role is now correct in DB.
  try {
    if (role === "brand") {
      await apiFetch(ENDPOINTS.brand.profile(), {
        method: "PUT",
        body: {
          brandName: brandName ?? "Yeni Marka",
          taxId: null,
          industry: null,
          website: null,
          logoUrl: null,
          contactName: null,
          contactPhone: null,
          billingAddress: null,
        },
      });
    } else {
      await apiFetch(ENDPOINTS.influencer.profile(), {
        method: "PUT",
        body: {
          bio: null,
          city: null,
          categories: ["lifestyle"],
          subcategories: [],
          contentLanguage: ["tr"],
          iban: null,
          ibanName: null,
        },
      });
    }
  } catch (e) {
    console.warn("Profile init during onboarding failed (non-fatal):", e);
  }

  revalidatePath("/", "layout");
  redirect(role === "influencer" ? "/creator/profile" : "/brand");
}
