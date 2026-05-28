import { NextRequest, NextResponse } from "next/server";
import { apiFetch, ApiError } from "@/lib/api/client";
import { ENDPOINTS } from "@/lib/api/endpoints";

export async function POST(
  _req: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    await apiFetch(ENDPOINTS.brand.approveSubmission(params.id), { method: "POST" });
    return new NextResponse(null, { status: 204 });
  } catch (e) {
    if (e instanceof ApiError) {
      return NextResponse.json({ error: e.message }, { status: e.status });
    }
    return NextResponse.json({ error: "Unknown error" }, { status: 500 });
  }
}
