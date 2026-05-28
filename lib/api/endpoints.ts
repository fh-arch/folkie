/**
 * Folkie API endpoint sabitleri.
 * Backend route'larıyla 1:1 eşleşir.
 */

export const ENDPOINTS = {
  me: () => "/api/v1/me",
  meRole: () => "/api/v1/me/role",

  creator: {
    profile: () => "/api/v1/creator/profile",
    campaigns: () => "/api/v1/creator/campaigns",
    campaign: (id: string) => `/api/v1/creator/campaigns/${id}`,
    apply: (campaignId: string) => `/api/v1/creator/campaigns/${campaignId}/apply`,
    applications: () => "/api/v1/creator/applications",
    application: (id: string) => `/api/v1/creator/applications/${id}`,
    submissions: () => "/api/v1/creator/submissions",
    publishSubmission: (id: string) => `/api/v1/creator/submissions/${id}/publish`,
    tiktokConnect: () => "/api/v1/creator/tiktok/connect",
    tiktokSandboxConnect: () => "/api/v1/creator/tiktok/sandbox-connect",
  },

  influencer: { profile: () => "/api/v1/creator/profile" },

  brand: {
    profile: () => "/api/v1/brand/profile",
    campaigns: () => "/api/v1/brand/campaigns",
    campaign: (id: string) => `/api/v1/brand/campaigns/${id}`,
    submitCampaign: (id: string) => `/api/v1/brand/campaigns/${id}/submit`,
    campaignApplications: (id: string) => `/api/v1/brand/campaigns/${id}/applications`,
    approveApplication: (id: string) => `/api/v1/brand/applications/${id}/approve`,
    rejectApplication: (id: string) => `/api/v1/brand/applications/${id}/reject`,
    campaignSubmissions: (id: string) => `/api/v1/brand/campaigns/${id}/submissions`,
    approveSubmission: (id: string) => `/api/v1/brand/submissions/${id}/approve`,
    requestSubmissionRevision: (id: string) =>
      `/api/v1/brand/submissions/${id}/request-revision`,
    creators: () => "/api/v1/brand/creators",
    creator: (id: string) => `/api/v1/brand/creators/${id}`,
    favorites: () => "/api/v1/brand/favorites",
    favorite: (influencerId: string) => `/api/v1/brand/favorites/${influencerId}`,
  },

  admin: {
    stats: () => "/api/v1/admin/stats",
    users: () => "/api/v1/admin/users",
    userDetail: (id: string) => `/api/v1/admin/users/${id}`,
    campaigns: () => "/api/v1/admin/campaigns",
    applications: () => "/api/v1/admin/applications",
    submissions: () => "/api/v1/admin/submissions",
    payments: () => "/api/v1/admin/payments",
    approvePayment: (id: string) => `/api/v1/admin/payments/${id}/approve`,
    transferPayment: (id: string) => `/api/v1/admin/payments/${id}/transfer`,
    // Moderation queues
    brands: () => "/api/v1/admin/brands",
    verifyBrand: (id: string) => `/api/v1/admin/brands/${id}/verify`,
    suspendBrand: (id: string) => `/api/v1/admin/brands/${id}/suspend`,
    reactivateBrand: (id: string) => `/api/v1/admin/brands/${id}/reactivate`,
    creators: () => "/api/v1/admin/creators",
    verifyCreator: (id: string) => `/api/v1/admin/creators/${id}/verify`,
    suspendCreator: (id: string) => `/api/v1/admin/creators/${id}/suspend`,
    reactivateCreator: (id: string) => `/api/v1/admin/creators/${id}/reactivate`,
  },

  messaging: {
    conversations: () => "/api/v1/messaging/conversations",
    messages: (conversationId: string) =>
      `/api/v1/messaging/conversations/${conversationId}/messages`,
  },

  notifications: {
    list: () => "/api/v1/notifications",
    markRead: (id: string) => `/api/v1/notifications/${id}/read`,
    markAllRead: () => "/api/v1/notifications/read-all",
  },

  webhooks: {
    clerk: () => "/api/v1/webhooks/clerk",
  },
} as const;
