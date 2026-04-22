import { NextResponse } from "next/server";

import { updateUser, UserStoreError } from "@/lib/user-store";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const userId = Number(id);
  if (isNaN(userId) || userId <= 0) {
    return NextResponse.json({ message: "ID ผู้ใช้ไม่ถูกต้อง" }, { status: 400 });
  }

  try {
    const payload = await request.json();
    const updated = await updateUser(userId, payload);
    return NextResponse.json(updated, { status: 200 });
  } catch (error) {
    if (error instanceof UserStoreError) {
      return NextResponse.json({ message: error.message }, { status: error.status });
    }
    return NextResponse.json({ message: "เกิดข้อผิดพลาดภายในระบบ" }, { status: 500 });
  }
}
