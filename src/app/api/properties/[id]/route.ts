import { NextResponse } from "next/server";

import { PropertyStoreError, deleteProperty, getPropertyById, updateProperty } from "@/lib/property-store";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(_: Request, context: RouteContext) {
  try {
    const id = await parseId(context);
    const property = await getPropertyById(id);

    if (!property) {
      return NextResponse.json({ message: "ไม่พบรายการอสังหาริมทรัพย์" }, { status: 404 });
    }

    return NextResponse.json(property, { status: 200 });
  } catch (error) {
    return handleError(error);
  }
}

export async function PATCH(request: Request, context: RouteContext) {
  try {
    const id = await parseId(context);
    const payload = await request.json();
    const updatedProperty = await updateProperty(id, payload);

    return NextResponse.json(updatedProperty, { status: 200 });
  } catch (error) {
    return handleError(error);
  }
}

export async function DELETE(_: Request, context: RouteContext) {
  try {
    const id = await parseId(context);
    await deleteProperty(id);
    return new Response(null, { status: 204 });
  } catch (error) {
    return handleError(error);
  }
}

async function parseId(context: RouteContext): Promise<number> {
  const { id } = await context.params;
  const parsed = Number(id);

  if (!Number.isInteger(parsed) || parsed <= 0) {
    throw new PropertyStoreError("id ไม่ถูกต้อง", 400);
  }

  return parsed;
}

function handleError(error: unknown) {
  if (error instanceof PropertyStoreError) {
    return NextResponse.json({ message: error.message }, { status: error.status });
  }

  return NextResponse.json({ message: "เกิดข้อผิดพลาดภายในระบบ" }, { status: 500 });
}
