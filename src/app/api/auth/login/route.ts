import { NextResponse } from "next/server";

import { UserStoreError, authenticateUser } from "@/lib/user-store";

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const user = await authenticateUser(payload);

    if (!user) {
      return NextResponse.json({ message: "username หรือ password ไม่ถูกต้อง" }, { status: 401 });
    }

    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    if (error instanceof UserStoreError) {
      return NextResponse.json({ message: error.message }, { status: error.status });
    }

    return NextResponse.json({ message: "เกิดข้อผิดพลาดภายในระบบ" }, { status: 500 });
  }
}
