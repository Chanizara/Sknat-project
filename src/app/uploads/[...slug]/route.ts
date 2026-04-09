import { readFile, stat } from "fs/promises";
import { join } from "path";
import { NextResponse } from "next/server";

const UPLOADS_DIR = join(process.cwd(), "public", "uploads");

const MIME_TYPES: Record<string, string> = {
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
  gif: "image/gif",
  avif: "image/avif",
};

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string[] }> },
) {
  const { slug } = await params;
  const filename = slug.join("/");

  if (filename.includes("..") || filename.startsWith("/")) {
    return new NextResponse(null, { status: 400 });
  }

  const filePath = join(UPLOADS_DIR, filename);

  try {
    await stat(filePath);
    const buffer = await readFile(filePath);
    const ext = filename.split(".").pop()?.toLowerCase() ?? "";
    const contentType = MIME_TYPES[ext] ?? "application/octet-stream";

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch {
    return new NextResponse(null, { status: 404 });
  }
}
