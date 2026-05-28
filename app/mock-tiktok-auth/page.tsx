"use client";

import { Suspense, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";

function MockTiktokAuthContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [denied, setDenied] = useState(false);

  const redirectUri = searchParams.get("redirect_uri") ?? "/creator/tiktok-callback";
  const state = searchParams.get("state") ?? "";

  function handleAuthorize() {
    setLoading(true);
    setTimeout(() => {
      const callbackUrl = `${redirectUri}?code=SANDBOX_CODE_${Date.now()}&state=${state}`;
      router.push(callbackUrl);
    }, 1200);
  }

  function handleDeny() {
    setDenied(true);
    setTimeout(() => {
      router.push(`${redirectUri}?error=access_denied&state=${state}`);
    }, 800);
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#010101] px-4">
      {/* TikTok Header */}
      <div className="mb-8 flex items-center gap-2">
        <svg viewBox="0 0 24 24" className="h-8 w-8 fill-white">
          <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.77 1.52V6.76a4.85 4.85 0 01-1-.07z" />
        </svg>
        <span className="text-xl font-bold text-white">TikTok</span>
      </div>

      <div className="w-full max-w-sm rounded-2xl bg-[#1a1a1a] p-6 shadow-2xl">
        {/* App info */}
        <div className="mb-6 flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-2xl font-bold text-black">
            F
          </div>
          <div>
            <div className="text-base font-semibold text-white">Folkie</div>
            <div className="text-sm text-[#aaa]">folkie.com.tr</div>
          </div>
        </div>

        <h1 className="mb-1 text-lg font-semibold text-white">
          Authorize Folkie
        </h1>
        <p className="mb-5 text-sm text-[#888]">
          Folkie would like access to your TikTok account
        </p>

        {/* Permissions */}
        <div className="mb-6 space-y-3 rounded-xl bg-[#111] p-4">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-[#666]">
            This app will be able to:
          </p>
          <Permission text="View your public profile info (name, avatar)" />
          <Permission text="View your follower & engagement statistics" />
          <Permission text="View your video count and like count" />
        </div>

        <p className="mb-5 text-xs text-[#555]">
          By authorizing, you agree to TikTok's Terms of Service and Privacy Policy.
          You can revoke access anytime in TikTok Settings.
        </p>

        {/* Buttons */}
        <div className="space-y-3">
          <button
            onClick={handleAuthorize}
            disabled={loading || denied}
            className="w-full rounded-full bg-[#FE2C55] py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-60"
          >
            {loading ? "Authorizing..." : "Authorize"}
          </button>
          <button
            onClick={handleDeny}
            disabled={loading || denied}
            className="w-full rounded-full border border-[#333] py-3 text-sm font-semibold text-white transition-colors hover:bg-[#222] disabled:opacity-60"
          >
            {denied ? "Redirecting..." : "Deny"}
          </button>
        </div>
      </div>

      <p className="mt-6 text-xs text-[#444]">
        This is a TikTok Login Kit sandbox simulation
      </p>
    </div>
  );
}

function Permission({ text }: { text: string }) {
  return (
    <div className="flex items-start gap-2">
      <svg className="mt-0.5 h-4 w-4 shrink-0 text-[#FE2C55]" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
      </svg>
      <span className="text-sm text-[#ccc]">{text}</span>
    </div>
  );
}

export default function MockTiktokAuthPage() {
  return (
    <Suspense>
      <MockTiktokAuthContent />
    </Suspense>
  );
}
