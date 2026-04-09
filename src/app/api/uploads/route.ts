import { writeFile } from "fs/promises";
import { existsSync, mkdirSync } from "fs";
import path from "path";
import { NextResponse } from "next/server";

const UPLOADS_DIR = path.join(process.cwd(), "public", "uploads");

function ensureUploadsDir() {
  if (!existsSync(UPLOADS_DIR)) {
    mkdirSync(UPLOADS_DIR, { recursive: true });
  }
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!file || typeof file === "string") {
      return NextResponse.json({ ok: false, error: "ไม่พบไฟล์รูปภาพ" }, { status: 400 });
    }

    const imageFile = file as File;
    const ext = imageFile.name.split(".").pop()?.toLowerCase() ?? "jpg";
    const allowedExts = ["jpg", "jpeg", "png", "webp", "gif", "avif"];
    if (!allowedExts.includes(ext)) {
      return NextResponse.json({ ok: false, error: "ประเภทไฟล์ไม่รองรับ" }, { status: 400 });
    }

    const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

    ensureUploadsDir();

    const buffer = Buffer.from(await imageFile.arrayBuffer());
    await writeFile(path.join(UPLOADS_DIR, fileName), buffer);

    return NextResponse.json({ ok: true, data: { url: `/uploads/${fileName}` } });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : "อัปโหลดรูปไม่สำเร็จ" },
      { status: 500 },
    );
  }
}
