import { NextResponse } from "next/server";

const WEB_API_BASE_URL = process.env.WEB_API_BASE_URL || "http://localhost:3000";

export async function POST(request: Request) {
  try {
    const body = await request.text();
    const response = await fetch(`${WEB_API_BASE_URL}/api/events`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body,
      cache: "no-store",
    });

    const text = await response.text();

    return new NextResponse(text, {
      status: response.status,
      headers: {
        "Content-Type": response.headers.get("Content-Type") ?? "application/json",
      },
    });
  } catch {
    return NextResponse.json({ ok: false, error: "cannot reach web api" }, { status: 502 });
  }
}
