"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { apiFetch, ApiError } from "@/lib/api/client";
import { ENDPOINTS } from "@/lib/api/endpoints";

export interface CreateCampaignInput {
  title: string;
  productName: string;
  productCategory: string;
  brief: string;
  contentTypes: string[];
  tone: string | null;
  requiredHashtags: string[];
  targetCategories: string[];
  targetCities: string[];
  contentLanguage: string[];
  minFollowers: number;
  maxFollowers: number;
  influencerCount: number;
  budgetPerInfluencer: number;
  productDelivery: string;
  applicationDeadline: string;  // YYYY-MM-DD
  publishStartDate: string;
  publishEndDate: string;
  isFlashCampaign: boolean;
  flashPublishTime: string | null;  // HH:MM
  submitForPayment: boolean;  // true = submit, false = save draft
}

export interface CreateCampaignResult {
  ok: boolean;
  campaignId?: string;
  error?: string;
  validationErrors?: Array<{ propertyName: string; errorMessage: string }>;
}

export async function createCampaign(input: CreateCampaignInput): Promise<CreateCampaignResult> {
  // Guard: date fields must be non-empty — DateOnly binding fails silently on ""
  if (!input.applicationDeadline || !input.publishStartDate || !input.publishEndDate) {
    return { ok: false, error: "Lütfen son başvuru, yayın başlangıç ve bitiş tarihlerini doldurun." };
  }

  // TimeOnly on backend requires HH:mm:ss — pad seconds if flash time is HH:mm
  const flashTime = input.flashPublishTime
    ? input.flashPublishTime.length === 5
      ? `${input.flashPublishTime}:00`
      : input.flashPublishTime
    : null;

  let createdId: string;
  try {
    const created = await apiFetch<{ id: string }>(ENDPOINTS.brand.campaigns(), {
      method: "POST",
      body: {
        title: input.title,
        productName: input.productName,
        productCategory: input.productCategory,
        brief: input.brief,
        requiredHashtags: input.requiredHashtags,
        contentTypes: input.contentTypes,
        tone: input.tone,
        targetCategories: input.targetCategories,
        targetCities: input.targetCities,
        contentLanguage: input.contentLanguage,
        minFollowers: input.minFollowers,
        maxFollowers: input.maxFollowers,
        influencerCount: input.influencerCount,
        budgetPerInfluencer: input.budgetPerInfluencer,
        productDelivery: input.productDelivery,
        applicationDeadline: input.applicationDeadline,
        publishStartDate: input.publishStartDate,
        publishEndDate: input.publishEndDate,
        isFlashCampaign: input.isFlashCampaign,
        flashPublishTime: flashTime,
      },
    });

    if (input.submitForPayment) {
      await apiFetch(ENDPOINTS.brand.submitCampaign(created.id), { method: "POST" });
    }

    revalidatePath("/brand/campaigns");
    createdId = created.id;
  } catch (e) {
    if (e instanceof ApiError) {
      const details = e.details as { detail?: Array<{ propertyName: string; errorMessage: string }> } | undefined;
      return {
        ok: false,
        error: e.message,
        validationErrors: details?.detail,
      };
    }
    return { ok: false, error: e instanceof Error ? e.message : "Bilinmeyen hata" };
  }
  // redirect() must be OUTSIDE try-catch — Next.js uses exceptions internally for redirects
  redirect(`/brand/campaigns/${createdId}`);
}
