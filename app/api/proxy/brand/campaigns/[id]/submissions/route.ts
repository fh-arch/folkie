import { NextRequest, NextResponse } from "next/server";
import { apiFetch, ApiError } from "@/lib/api/client";
import { ENDPOINTS } from "@/lib/api/endpoints";

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const result = await apiFetch<unknown>(ENDPOINTS.brand.campaignSubmissions(params.id));
    return NextResponse.json(result);
  } catch (e) {
    if (e instanceof ApiError) {
      return NextResponse.json({ error: e.message }, { status: e.status });
    }
    return NextResponse.json({ error: "Unknown error" }, { status: 500 });
  }
}
