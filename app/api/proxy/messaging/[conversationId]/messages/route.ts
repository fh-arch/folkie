import { NextRequest, NextResponse } from "next/server";
import { apiFetch, ApiError } from "@/lib/api/client";
import { ENDPOINTS } from "@/lib/api/endpoints";

interface Params {
  conversationId: string;
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<Params> },
) {
  const { conversationId } = await params;
  try {
    return NextResponse.json(
      await apiFetch<unknown>(ENDPOINTS.messaging.messages(conversationId)),
    );
  } catch (e) {
    return err(e);
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<Params> },
) {
  const { conversationId } = await params;
  const body = await req.json();
  try {
    return NextResponse.json(
      await apiFetch<unknown>(ENDPOINTS.messaging.messages(conversationId), {
        method: "POST",
        body,
      }),
    );
  } catch (e) {
    return err(e);
  }
}

function err(e: unknown) {
  if (e instanceof ApiError) {
    return NextResponse.json({ error: e.message }, { status: e.status });
  }
  return NextResponse.json(
    { error: e instanceof Error ? e.message : "Error" },
    { status: 500 },
  );
}
