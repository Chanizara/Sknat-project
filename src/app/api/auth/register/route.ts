import { NextResponse } from "next/server";

import { MemberStoreError, createMember } from "@/lib/member-store";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { firstName, lastName, phone, email, username, password } = body as Record<string, string>;

    const fullName = `${(firstName ?? "").trim()} ${(lastName ?? "").trim()}`.trim();

    const member = await createMember({
      fullName: fullName || undefined,
      username,
      password,
      phone,
      email,
    });

    return NextResponse.json(
      {
        id: member.id,
        username: member.username,
        role: "member",
        fullName: member.fullName,
        phone: member.phone,
        email: member.email,
        createdAt: member.createdAt,
        updatedAt: member.updatedAt,
      },
      { status: 201 },
    );
  } catch (error) {
    if (error instanceof MemberStoreError) {
      return NextResponse.json({ message: error.message }, { status: error.status });
    }
    return NextResponse.json({ message: "เกิดข้อผิดพลาดภายในระบบ" }, { status: 500 });
  }
}
