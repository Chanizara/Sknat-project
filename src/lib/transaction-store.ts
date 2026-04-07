import type { ResultSetHeader, RowDataPacket } from "mysql2/promise";

import { dbPool } from "@/lib/db";

export type TransactionStatus = "completed" | "pending-transfer" | "cancelled";

export type Transaction = {
  id: number;
  orderId?: number;
  propertyId?: number;
  propertyTitle: string;
  propertyType?: string;
  propertyLocation?: string;
  buyerName: string;
  buyerPhone?: string;
  sellerId?: number;
  sellerAgent?: string;
  price: number;
  commission: number;
  paymentMethod?: string;
  status: TransactionStatus;
  transactionDate: string;
  createdAt: string;
  updatedAt: string;
};

type TransactionRow = RowDataPacket & {
  id: number;
  order_id: number | null;
  property_id: number | null;
  property_title: string;
  property_type: string | null;
  property_location: string | null;
  buyer_name: string;
  buyer_phone: string | null;
  seller_id: number | null;
  seller_full_name: string | null;
  price: number | string;
  commission: number | string;
  payment_method: string | null;
  status: TransactionStatus;
  transaction_date: string;
  created_at: Date | string;
  updated_at: Date | string;
};

export class TransactionStoreError extends Error {
  status: number;

  constructor(message: string, status = 400) {
    super(message);
    this.name = "TransactionStoreError";
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
    throw new TransactionStoreError("id ไม่ถูกต้อง");
  }
  return parsed;
}

function normalizePositiveNumber(value: unknown, fieldName: string): number | undefined {
  if (value === undefined || value === null || value === "") return undefined;
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed <= 0) {
    throw new TransactionStoreError(`${fieldName} ไม่ถูกต้อง`);
  }
  return parsed;
}

function toIsoString(value: Date | string) {
  return value instanceof Date ? value.toISOString() : new Date(value).toISOString();
}

function mapRowToTransaction(row: TransactionRow): Transaction {
  return {
    id: row.id,
    orderId: row.order_id ?? undefined,
    propertyId: row.property_id ?? undefined,
    propertyTitle: row.property_title,
    propertyType: row.property_type ?? undefined,
    propertyLocation: row.property_location ?? undefined,
    buyerName: row.buyer_name,
    buyerPhone: row.buyer_phone ?? undefined,
    sellerId: row.seller_id ?? undefined,
    sellerAgent: row.seller_full_name ?? undefined,
    price: Number(row.price),
    commission: Number(row.commission),
    paymentMethod: row.payment_method ?? undefined,
    status: row.status,
    transactionDate: row.transaction_date,
    createdAt: toIsoString(row.created_at),
    updatedAt: toIsoString(row.updated_at),
  };
}

function wrapDbError(error: unknown): never {
  if (error instanceof TransactionStoreError) throw error;
  throw new TransactionStoreError("ไม่สามารถเชื่อมต่อฐานข้อมูล MySQL ได้", 500);
}

export async function listTransactions(options?: { sellerId?: number }): Promise<Transaction[]> {
  try {
    const whereClause = options?.sellerId ? "WHERE t.seller_id = ?" : "";
    const params = options?.sellerId ? [options.sellerId] : [];
    const [rows] = await dbPool.query<TransactionRow[]>(
      `SELECT t.*, u.full_name AS seller_full_name
       FROM transactions t
       LEFT JOIN users u ON u.id = t.seller_id
       ${whereClause}
       ORDER BY t.id DESC`,
      params,
    );
    return rows.map(mapRowToTransaction);
  } catch (error) {
    wrapDbError(error);
  }
}

export async function createTransaction(input: unknown): Promise<Transaction> {
  if (!input || typeof input !== "object" || Array.isArray(input)) {
    throw new TransactionStoreError("payload ไม่ถูกต้อง");
  }

  const payload = input as Record<string, unknown>;
  const propertyTitle = normalizeString(payload.propertyTitle);
  const buyerName = normalizeString(payload.buyerName);
  const price = normalizePositiveNumber(payload.price, "price");

  if (!propertyTitle || !buyerName || price === undefined) {
    throw new TransactionStoreError("propertyTitle, buyerName และ price จำเป็นต้องระบุ");
  }

  try {
    const commission = normalizePositiveNumber(payload.commission, "commission") ?? Math.round(price * 0.03);
    const status = payload.status;
    const normalizedStatus: TransactionStatus =
      status === "pending-transfer" || status === "cancelled" ? status : "completed";

    const [result] = await dbPool.execute<ResultSetHeader>(
      `INSERT INTO transactions (
        order_id, property_id, property_title, property_type, property_location,
        buyer_name, buyer_phone, seller_id, price, commission, payment_method, status, transaction_date
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURDATE())`,
      [
        normalizeId(payload.orderId) ?? null,
        normalizeId(payload.propertyId) ?? null,
        propertyTitle,
        normalizeString(payload.propertyType) ?? null,
        normalizeString(payload.propertyLocation) ?? null,
        buyerName,
        normalizeString(payload.buyerPhone) ?? null,
        normalizeId(payload.sellerId) ?? null,
        price,
        commission,
        normalizeString(payload.paymentMethod) ?? null,
        normalizedStatus,
      ],
    );

    const [rows] = await dbPool.query<TransactionRow[]>(
      `SELECT t.*, u.full_name AS seller_full_name
       FROM transactions t
       LEFT JOIN users u ON u.id = t.seller_id
       WHERE t.id = ? LIMIT 1`,
      [result.insertId],
    );
    if (rows.length === 0) throw new TransactionStoreError("สร้างธุรกรรมไม่สำเร็จ", 500);
    return mapRowToTransaction(rows[0]);
  } catch (error) {
    wrapDbError(error);
  }
}
