"use server";

import { apiFetch, ApiError } from "@/lib/api/client";
import { ENDPOINTS } from "@/lib/api/endpoints";

const SANDBOX_PREFIX = "SANDBOX_CODE_";

export async function connectTiktok(
  code: string,
  redirectUri: string,
): Promise<{ ok: true } | { ok: false; error: string }> {
  try {
    if (code.startsWith(SANDBOX_PREFIX)) {
      // Sandbox / demo mode — call mock endpoint with realistic test data
      await apiFetch(ENDPOINTS.creator.tiktokSandboxConnect(), {
        method: "POST",
        body: {
          mockHandle: "@folkie_test_creator",
          mockFollowers: 7840,
          mockEngagement: 6.3,
        },
      });
    } else {
      await apiFetch(ENDPOINTS.creator.tiktokConnect(), {
        method: "POST",
        body: { code, redirectUri },
      });
    }
    return { ok: true };
  } catch (e) {
    if (e instanceof ApiError) {
      return { ok: false, error: e.message };
    }
    return {
      ok: false,
      error: e instanceof Error ? e.message : "TikTok bağlantısı başarısız.",
    };
  }
}
