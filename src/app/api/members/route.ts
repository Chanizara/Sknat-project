import { NextResponse } from "next/server";

import { MemberStoreError, createMember } from "@/lib/member-store";

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const member = await createMember(payload);
    return NextResponse.json(member, { status: 201 });
  } catch (error) {
    if (error instanceof MemberStoreError) {
      return NextResponse.json({ message: error.message }, { status: error.status });
    }
    return NextResponse.json({ message: "เกิดข้อผิดพลาดภายในระบบ" }, { status: 500 });
  }
}
