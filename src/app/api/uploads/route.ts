import { NextResponse } from "next/server";

const MIME_TYPES: Record<string, string> = {
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
  gif: "image/gif",
  avif: "image/avif",
};

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!file || typeof file === "string") {
      return NextResponse.json({ ok: false, error: "ไม่พบไฟล์รูปภาพ" }, { status: 400 });
    }

    const imageFile = file as File;
    const ext = imageFile.name.split(".").pop()?.toLowerCase() ?? "jpg";
    if (!Object.keys(MIME_TYPES).includes(ext)) {
      return NextResponse.json({ ok: false, error: "ประเภทไฟล์ไม่รองรับ" }, { status: 400 });
    }

    const mimeType = MIME_TYPES[ext];
    const buffer = Buffer.from(await imageFile.arrayBuffer());
    const base64 = buffer.toString("base64");
    const dataUrl = `data:${mimeType};base64,${base64}`;

    return NextResponse.json({ ok: true, data: { url: dataUrl } });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : "อัปโหลดรูปไม่สำเร็จ" },
      { status: 500 },
    );
  }
}
