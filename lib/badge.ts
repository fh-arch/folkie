"use server";

import { apiFetch } from "@/lib/api/client";

export interface Badge {
  level: "welcome" | "rising" | "shining" | "super_star";
  levelLabel: string;
  emoji: string;
  completedCampaigns: number;
  avgRating: number;
  nextLevelGap: number;
  nextLevel: string;
  progressPercent: number;
}

export async function getMyBadge(): Promise<Badge | null> {
  try {
    return await apiFetch<Badge>("/api/v1/creator/badge");
  } catch {
    return null;
  }
}
