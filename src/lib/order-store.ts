import type { ResultSetHeader, RowDataPacket } from "mysql2/promise";

import { dbPool } from "@/lib/db";

export type OrderStatus = "pending" | "contacted" | "negotiating" | "completed" | "cancelled";

export type Order = {
  id: number;
  propertyId?: number;
  propertyTitle: string;
  memberId?: number;
  customerName: string;
  customerPhone?: string;
  customerEmail?: string;
  status: OrderStatus;
  orderDate: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
};

type OrderRow = RowDataPacket & {
  id: number;
  property_id: number | null;
  property_title: string;
  member_id: number | null;
  customer_name: string;
  customer_phone: string | null;
  customer_email: string | null;
  status: OrderStatus;
  order_date: string;
  notes: string | null;
  created_at: Date | string;
  updated_at: Date | string;
};

export class OrderStoreError extends Error {
  status: number;

  constructor(message: string, status = 400) {
    super(message);
    this.name = "OrderStoreError";
    this.status = status;
  }
}

function normalizeString(value: unknown): string | undefined {
  if (typeof value !== "string") return undefined;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

function normalizeId(value: unknown): number | undefined {
  if (value === undefined || value === null || value === "") return undefined;
  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed <= 0) {
    throw new OrderStoreError("id ไม่ถูกต้อง");
  }
  return parsed;
}

function toIsoString(value: Date | string) {
  return value instanceof Date ? value.toISOString() : new Date(value).toISOString();
}

function mapRowToOrder(row: OrderRow): Order {
  return {
    id: row.id,
    propertyId: row.property_id ?? undefined,
    propertyTitle: row.property_title || "",
    memberId: row.member_id ?? undefined,
    customerName: row.customer_name,
    customerPhone: row.customer_phone ?? undefined,
    customerEmail: row.customer_email ?? undefined,
    status: row.status,
    orderDate: row.order_date,
    notes: row.notes ?? undefined,
    createdAt: toIsoString(row.created_at),
    updatedAt: toIsoString(row.updated_at),
  };
}

function wrapDbError(error: unknown): never {
  if (error instanceof OrderStoreError) throw error;
  throw new OrderStoreError("ไม่สามารถเชื่อมต่อฐานข้อมูล MySQL ได้", 500);
}

export async function listOrders(options?: { sellerId?: number }): Promise<Order[]> {
  try {
    const whereClause = options?.sellerId ? "WHERE (p.seller_id = ? OR o.property_id IS NULL)" : "";
    const params = options?.sellerId ? [options.sellerId] : [];
    const [rows] = await dbPool.query<OrderRow[]>(
      `SELECT o.* FROM orders o
       LEFT JOIN properties p ON p.id = o.property_id
       ${whereClause}
       ORDER BY o.id DESC`,
      params,
    );
    return rows.map(mapRowToOrder);
  } catch (error) {
    wrapDbError(error);
  }
}

export async function createOrder(input: unknown): Promise<Order> {
  if (!input || typeof input !== "object" || Array.isArray(input)) {
    throw new OrderStoreError("payload ไม่ถูกต้อง");
  }

  const payload = input as Record<string, unknown>;
  const customerName = normalizeString(payload.customerName);
  if (!customerName) {
    throw new OrderStoreError("customerName จำเป็นต้องระบุ");
  }

  const propertyId = normalizeId(payload.propertyId);
  let propertyTitle = normalizeString(payload.propertyTitle) ?? "";

  try {
    if (!propertyTitle && propertyId) {
      const [rows] = await dbPool.query<RowDataPacket[]>(
        `SELECT title FROM properties WHERE id = ? LIMIT 1`,
        [propertyId],
      );
      propertyTitle = typeof rows[0]?.title === "string" ? rows[0].title : "";
    }

    const status = payload.status;
    const normalizedStatus: OrderStatus =
      status === "contacted" || status === "negotiating" || status === "completed" || status === "cancelled"
        ? status
        : "pending";

    const [result] = await dbPool.execute<ResultSetHeader>(
      `INSERT INTO orders (
        property_id, property_title, member_id, customer_name, customer_phone, customer_email, status, notes, order_date
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, CURDATE())`,
      [
        propertyId ?? null,
        propertyTitle,
        normalizeId(payload.memberId) ?? null,
        customerName,
        normalizeString(payload.customerPhone) ?? null,
        normalizeString(payload.customerEmail) ?? null,
        normalizedStatus,
        normalizeString(payload.notes) ?? null,
      ],
    );

    const [rows] = await dbPool.query<OrderRow[]>(
      `SELECT * FROM orders WHERE id = ? LIMIT 1`,
      [result.insertId],
    );
    if (rows.length === 0) throw new OrderStoreError("สร้างออร์เดอร์ไม่สำเร็จ", 500);
    return mapRowToOrder(rows[0]);
  } catch (error) {
    wrapDbError(error);
  }
}

export async function updateOrder(id: number, input: unknown): Promise<Order> {
  if (!Number.isInteger(id) || id <= 0) {
    throw new OrderStoreError("id ออร์เดอร์ไม่ถูกต้อง");
  }
  if (!input || typeof input !== "object" || Array.isArray(input)) {
    throw new OrderStoreError("payload ไม่ถูกต้อง");
  }

  const payload = input as Record<string, unknown>;
  const fields: string[] = [];
  const values: Array<string | null> = [];

  if ("status" in payload) {
    const status = payload.status;
    if (!["pending", "contacted", "negotiating", "completed", "cancelled"].includes(String(status))) {
      throw new OrderStoreError("status ไม่ถูกต้อง");
    }
    fields.push("status = ?");
    values.push(String(status));
  }

  if ("notes" in payload) {
    fields.push("notes = ?");
    values.push(normalizeString(payload.notes) ?? null);
  }

  if ("customerName" in payload) {
    const customerName = normalizeString(payload.customerName);
    if (!customerName) throw new OrderStoreError("customerName จำเป็นต้องระบุ");
    fields.push("customer_name = ?");
    values.push(customerName);
  }

  if ("customerPhone" in payload) {
    fields.push("customer_phone = ?");
    values.push(normalizeString(payload.customerPhone) ?? null);
  }

  if ("customerEmail" in payload) {
    fields.push("customer_email = ?");
    values.push(normalizeString(payload.customerEmail) ?? null);
  }

  if (fields.length === 0) {
    throw new OrderStoreError("ไม่มีข้อมูลสำหรับอัปเดต");
  }

  try {
    await dbPool.execute(`UPDATE orders SET ${fields.join(", ")} WHERE id = ?`, [...values, String(id)]);
    const [rows] = await dbPool.query<OrderRow[]>(
      `SELECT * FROM orders WHERE id = ? LIMIT 1`,
      [id],
    );
    if (rows.length === 0) throw new OrderStoreError("ไม่พบออร์เดอร์", 404);
    return mapRowToOrder(rows[0]);
  } catch (error) {
    wrapDbError(error);
  }
}

export async function deleteOrder(id: number): Promise<void> {
  if (!Number.isInteger(id) || id <= 0) {
    throw new OrderStoreError("id ออร์เดอร์ไม่ถูกต้อง");
  }

  try {
    const [result] = await dbPool.execute<ResultSetHeader>(
      `DELETE FROM orders WHERE id = ?`,
      [id],
    );
    if (result.affectedRows === 0) throw new OrderStoreError("ไม่พบออร์เดอร์", 404);
  } catch (error) {
    wrapDbError(error);
  }
}
