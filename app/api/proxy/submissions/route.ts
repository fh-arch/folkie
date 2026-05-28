import { NextRequest, NextResponse } from "next/server";
import { apiFetch, ApiError } from "@/lib/api/client";
import { ENDPOINTS } from "@/lib/api/endpoints";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const result = await apiFetch<{ id: string }>(ENDPOINTS.creator.submissions(), {
      method: "POST",
      body,
    });
    return NextResponse.json(result, { status: 201 });
  } catch (e) {
    if (e instanceof ApiError) {
      return NextResponse.json({ error: e.message, details: e.details }, { status: e.status });
    }
    return NextResponse.json({ error: e instanceof Error ? e.message : "Unknown error" }, { status: 500 });
  }
}
