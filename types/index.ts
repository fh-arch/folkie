import type { Database } from "./database";

export type Tables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Row"];

export type InsertDto<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Insert"];

export type UpdateDto<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Update"];

export type User = Tables<"users">;
export type InfluencerProfile = Tables<"influencer_profiles">;
export type BrandProfile = Tables<"brand_profiles">;
export type Campaign = Tables<"campaigns">;
export type CampaignApplication = Tables<"campaign_applications">;
export type ContentSubmission = Tables<"content_submissions">;
export type Payment = Tables<"payments">;
export type BrandPayment = Tables<"brand_payments">;
export type Review = Tables<"reviews">;
export type Notification = Tables<"notifications">;

export type {
  UserRole,
  InfluencerTier,
  ContentType,
  ProductDelivery,
  ApprovalMode,
  CampaignStatus,
  ApplicationStatus,
  SubmissionStatus,
  PaymentType,
  PaymentStatus,
  BrandPaymentStatus,
} from "./database";
