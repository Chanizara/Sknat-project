import { NextResponse } from "next/server";

import { UserStoreError, createUser, listUsers } from "@/lib/user-store";

export async function GET() {
  try {
    const users = await listUsers();
    return NextResponse.json(users, { status: 200 });
  } catch (error) {
    return handleError(error);
  }
}

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const createdUser = await createUser(payload);
    return NextResponse.json(createdUser, { status: 201 });
  } catch (error) {
    return handleError(error);
  }
}

function handleError(error: unknown) {
  if (error instanceof UserStoreError) {
    return NextResponse.json({ message: error.message }, { status: error.status });
  }

  return NextResponse.json({ message: "เกิดข้อผิดพลาดภายในระบบ" }, { status: 500 });
}
