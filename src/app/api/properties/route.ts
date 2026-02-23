import { NextResponse } from "next/server";

import { PropertyStoreError, createProperty, listProperties } from "@/lib/property-store";

export async function GET() {
  try {
    const properties = await listProperties();
    return NextResponse.json(properties, { status: 200 });
  } catch (error) {
    return handleError(error);
  }
}

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const createdProperty = await createProperty(payload);
    return NextResponse.json(createdProperty, { status: 201 });
  } catch (error) {
    return handleError(error);
  }
}

function handleError(error: unknown) {
  if (error instanceof PropertyStoreError) {
    return NextResponse.json({ message: error.message }, { status: error.status });
  }

  return NextResponse.json({ message: "เกิดข้อผิดพลาดภายในระบบ" }, { status: 500 });
}
