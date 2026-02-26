import { NextResponse } from "next/server";

import { likeProperty, unlikeProperty, UserStoreError } from "@/lib/user-store";

type RouteContext = {
  params: {
    id: string;
  };
};

export async function POST(request: Request, { params }: RouteContext) {
  const userId = Number(params.id);
  if (isNaN(userId)) {
    return NextResponse.json({ message: "ID ผู้ใช้ไม่ถูกต้อง" }, { status: 400 });
  }

  try {
    const { propertyId } = await request.json();
    if (typeof propertyId !== "number") {
      return NextResponse.json({ message: "ID บ้านไม่ถูกต้อง" }, { status: 400 });
    }

    await likeProperty(userId, propertyId);
    return NextResponse.json({ message: "Liked successfully" }, { status: 200 });
  } catch (error) {
    if (error instanceof UserStoreError) {
      return NextResponse.json({ message: error.message }, { status: error.status });
    }
    return NextResponse.json({ message: "เกิดข้อผิดพลาดภายในระบบ" }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: RouteContext) {
  const userId = Number(params.id);
  if (isNaN(userId)) {
    return NextResponse.json({ message: "ID ผู้ใช้ไม่ถูกต้อง" }, { status: 400 });
  }

  try {
    const { propertyId } = await request.json();
    if (typeof propertyId !== "number") {
      return NextResponse.json({ message: "ID บ้านไม่ถูกต้อง" }, { status: 400 });
    }

    await unlikeProperty(userId, propertyId);
    return NextResponse.json({ message: "Unliked successfully" }, { status: 200 });
  } catch (error) {
    if (error instanceof UserStoreError) {
      return NextResponse.json({ message: error.message }, { status: error.status });
    }
    return NextResponse.json({ message: "เกิดข้อผิดพลาดภายในระบบ" }, { status: 500 });
  }
}
