import { NextResponse } from "next/server";
import type { RowDataPacket } from "mysql2/promise";
import { dbPool } from "@/lib/db";

type ImageRow = RowDataPacket & {
  data: Buffer;
  mime_type: string;
};

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const imageId = Number(id);

  if (!Number.isInteger(imageId) || imageId <= 0) {
    return new NextResponse(null, { status: 400 });
  }

  const [rows] = await dbPool.query<ImageRow[]>(
    "SELECT data, mime_type FROM property_images WHERE id = ? LIMIT 1",
    [imageId],
  );

  if (rows.length === 0) {
    return new NextResponse(null, { status: 404 });
  }

  const { data, mime_type } = rows[0];
  const body = data.buffer.slice(data.byteOffset, data.byteOffset + data.byteLength) as ArrayBuffer;

  return new NextResponse(body, {
    status: 200,
    headers: {
      "Content-Type": mime_type,
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
