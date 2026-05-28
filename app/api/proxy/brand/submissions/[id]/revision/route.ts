import { NextRequest, NextResponse } from "next/server";
import { apiFetch, ApiError } from "@/lib/api/client";
import { ENDPOINTS } from "@/lib/api/endpoints";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const body = await req.json();
    await apiFetch(ENDPOINTS.brand.requestSubmissionRevision(params.id), {
      method: "POST",
      body,
    });
    return new NextResponse(null, { status: 204 });
  } catch (e) {
    if (e instanceof ApiError) {
      return NextResponse.json({ error: e.message }, { status: e.status });
    }
    return NextResponse.json({ error: "Unknown error" }, { status: 500 });
  }
}
