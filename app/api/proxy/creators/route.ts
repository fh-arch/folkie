import { NextRequest, NextResponse } from "next/server";
import { apiFetch, ApiError } from "@/lib/api/client";
import { ENDPOINTS } from "@/lib/api/endpoints";

/**
 * Server-side proxy that forwards `/api/proxy/creators?...` to backend
 * `/api/v1/brand/creators?...` with Clerk JWT attached.
 * Used by CreatorSearchClient for live search-as-you-type.
 */
export async function GET(req: NextRequest) {
  const qs = req.nextUrl.search;
  try {
    const result = await apiFetch<unknown>(
      `${ENDPOINTS.brand.creators()}${qs}`,
    );
    return NextResponse.json(result);
  } catch (e) {
    if (e instanceof ApiError) {
      return NextResponse.json(
        { error: e.message, details: e.details },
        { status: e.status },
      );
    }
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Bilinmeyen hata" },
      { status: 500 },
    );
  }
}
