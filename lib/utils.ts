import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatTRY(amount: number): string {
  return new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency: "TRY",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatNumber(num: number): string {
  return new Intl.NumberFormat("tr-TR").format(num);
}

export function getInfluencerTier(followers: number): "nano" | "micro" | "mid_tier" {
  if (followers < 10_000) return "nano";
  if (followers < 100_000) return "micro";
  return "mid_tier";
}

export const TIER_LABELS: Record<"nano" | "micro" | "mid_tier", string> = {
  nano: "Nano (1K-10K)",
  micro: "Mikro (10K-100K)",
  mid_tier: "Mid-tier (100K+)",
};
