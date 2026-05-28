import { NextRequest, NextResponse } from "next/server";
import { apiFetch, ApiError } from "@/lib/api/client";
import { ENDPOINTS } from "@/lib/api/endpoints";

export async function GET(req: NextRequest) {
  const qs = req.nextUrl.search;
  try {
    return NextResponse.json(
      await apiFetch<unknown>(`${ENDPOINTS.notifications.list()}${qs}`),
    );
  } catch (e) {
    return errorResponse(e);
  }
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  try {
    if (body.action === "read-all") {
      await apiFetch<void>(ENDPOINTS.notifications.markAllRead(), { method: "POST" });
    } else if (body.id) {
      await apiFetch<void>(ENDPOINTS.notifications.markRead(body.id), { method: "POST" });
    }
    return NextResponse.json({ ok: true });
  } catch (e) {
    return errorResponse(e);
  }
}

function errorResponse(e: unknown) {
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
