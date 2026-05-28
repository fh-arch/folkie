// Bu dosya `supabase gen types typescript --local > types/database.ts` ile
// otomatik üretilecek. Şimdilik manuel olarak yazılmıştır.

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type UserRole = "influencer" | "brand" | "admin";
export type InfluencerTier = "nano" | "micro" | "mid_tier";
export type ContentType = "video" | "live" | "stitch" | "duet";
export type ProductDelivery = "physical" | "digital" | "none";
export type ApprovalMode = "auto" | "manual";

export type CampaignStatus =
  | "draft"
  | "pending_payment"
  | "active"
  | "applications_closed"
  | "in_progress"
  | "completed"
  | "cancelled";

export type ApplicationStatus = "pending" | "approved" | "rejected" | "withdrawn";

export type SubmissionStatus =
  | "submitted"
  | "revision_requested"
  | "approved"
  | "published";

export type PaymentType = "base" | "performance_bonus" | "viral_bonus" | "refund";
export type PaymentStatus = "pending" | "approved" | "transferred" | "failed";
export type BrandPaymentStatus = "pending" | "received" | "partial" | "failed";

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          role: UserRole;
          full_name: string | null;
          avatar_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          role: UserRole;
          full_name?: string | null;
          avatar_url?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["users"]["Insert"]>;
      };
      influencer_profiles: {
        Row: {
          id: string;
          user_id: string;
          tiktok_handle: string | null;
          tiktok_user_id: string | null;
          follower_count: number;
          engagement_rate: number;
          tier: InfluencerTier;
          city: string | null;
          country: string;
          content_language: string[];
          categories: string[] | null;
          subcategories: string[] | null;
          bio: string | null;
          iban_encrypted: string | null;
          iban_name: string | null;
          is_verified: boolean;
          is_active: boolean;
          fake_follower_score: number | null;
          last_tiktok_sync: string | null;
          created_at: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["influencer_profiles"]["Row"],
          "id" | "tier" | "created_at"
        > & { id?: string };
        Update: Partial<
          Database["public"]["Tables"]["influencer_profiles"]["Insert"]
        >;
      };
      brand_profiles: {
        Row: {
          id: string;
          user_id: string;
          brand_name: string;
          tax_id: string | null;
          industry: string | null;
          website: string | null;
          logo_url: string | null;
          contact_name: string | null;
          contact_phone: string | null;
          billing_address: string | null;
          is_verified: boolean;
          is_active: boolean;
          created_at: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["brand_profiles"]["Row"],
          "id" | "created_at"
        > & { id?: string };
        Update: Partial<
          Database["public"]["Tables"]["brand_profiles"]["Insert"]
        >;
      };
      campaigns: {
        Row: {
          id: string;
          brand_id: string;
          title: string;
          product_name: string;
          product_category: string;
          brief: string;
          required_hashtags: string[] | null;
          content_type: ContentType[];
          tone: string | null;
          target_categories: string[] | null;
          target_cities: string[] | null;
          content_language: string[];
          min_followers: number;
          max_followers: number;
          influencer_count: number;
          budget_per_influencer: number;
          platform_fee_rate: number;
          total_budget: number;
          product_delivery: ProductDelivery;
          approval_mode: ApprovalMode;
          application_deadline: string;
          publish_start_date: string;
          publish_end_date: string;
          is_flash_campaign: boolean;
          flash_publish_time: string | null;
          status: CampaignStatus;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["campaigns"]["Row"],
          "id" | "total_budget" | "created_at" | "updated_at"
        > & { id?: string };
        Update: Partial<Database["public"]["Tables"]["campaigns"]["Insert"]>;
      };
      campaign_applications: {
        Row: {
          id: string;
          campaign_id: string;
          influencer_id: string;
          status: ApplicationStatus;
          rejection_reason: string | null;
          applied_at: string;
          reviewed_at: string | null;
        };
        Insert: Omit<
          Database["public"]["Tables"]["campaign_applications"]["Row"],
          "id" | "applied_at"
        > & { id?: string };
        Update: Partial<
          Database["public"]["Tables"]["campaign_applications"]["Insert"]
        >;
      };
      content_submissions: {
        Row: {
          id: string;
          application_id: string;
          video_url: string | null;
          external_video_url: string | null;
          script: string | null;
          hashtags: string[] | null;
          status: SubmissionStatus;
          revision_note: string | null;
          submitted_at: string;
          reviewed_at: string | null;
          published_at: string | null;
        };
        Insert: Omit<
          Database["public"]["Tables"]["content_submissions"]["Row"],
          "id" | "submitted_at"
        > & { id?: string };
        Update: Partial<
          Database["public"]["Tables"]["content_submissions"]["Insert"]
        >;
      };
      payments: {
        Row: {
          id: string;
          campaign_id: string;
          influencer_id: string;
          amount: number;
          payment_type: PaymentType;
          status: PaymentStatus;
          iban_encrypted: string;
          iban_name: string;
          admin_note: string | null;
          transfer_reference: string | null;
          approved_by: string | null;
          approved_at: string | null;
          transferred_at: string | null;
          created_at: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["payments"]["Row"],
          "id" | "created_at"
        > & { id?: string };
        Update: Partial<Database["public"]["Tables"]["payments"]["Insert"]>;
      };
      brand_payments: {
        Row: {
          id: string;
          campaign_id: string;
          brand_id: string;
          amount: number;
          status: BrandPaymentStatus;
          payment_method: string;
          transfer_reference: string | null;
          receipt_url: string | null;
          admin_note: string | null;
          confirmed_by: string | null;
          confirmed_at: string | null;
          created_at: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["brand_payments"]["Row"],
          "id" | "created_at"
        > & { id?: string };
        Update: Partial<
          Database["public"]["Tables"]["brand_payments"]["Insert"]
        >;
      };
      reviews: {
        Row: {
          id: string;
          campaign_id: string;
          reviewer_id: string;
          reviewee_id: string;
          reviewer_role: "influencer" | "brand";
          score: number;
          comment: string | null;
          created_at: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["reviews"]["Row"],
          "id" | "created_at"
        > & { id?: string };
        Update: Partial<Database["public"]["Tables"]["reviews"]["Insert"]>;
      };
      notifications: {
        Row: {
          id: string;
          user_id: string;
          type: string;
          title: string;
          body: string | null;
          data: Json | null;
          is_read: boolean;
          created_at: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["notifications"]["Row"],
          "id" | "created_at"
        > & { id?: string };
        Update: Partial<
          Database["public"]["Tables"]["notifications"]["Insert"]
        >;
      };
    };
    Views: Record<string, never>;
    Functions: {
      decrypt_iban: { Args: { encrypted: string }; Returns: string };
      encrypt_iban: { Args: { plain: string }; Returns: string };
    };
    Enums: Record<string, never>;
  };
}
