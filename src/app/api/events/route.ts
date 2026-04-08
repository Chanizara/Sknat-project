import { NextResponse } from "next/server";

const WEB_API_BASE_URLS = [
  process.env.WEB_API_BASE_URL,
  "http://web:3000",
  "http://host.docker.internal:3000",
  "http://127.0.0.1:3000",
].filter(Boolean) as string[];

export async function POST(request: Request) {
  const body = await request.text();
  let lastError = "cannot reach web api";

  for (const baseUrl of WEB_API_BASE_URLS) {
    try {
      const response = await fetch(`${baseUrl}/api/events`, {
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
          "X-Web-Api-Base-Url": baseUrl,
        },
      });
    } catch (error) {
      lastError = error instanceof Error ? error.message : "cannot reach web api";
    }
  }

  try {
    return NextResponse.json({ ok: false, error: `cannot reach web api: ${lastError}` }, { status: 502 });
  } catch {
    return NextResponse.json({ ok: false, error: "cannot reach web api" }, { status: 502 });
  }
}
