import type { RowDataPacket } from "mysql2/promise";

import { dbPool } from "@/lib/db";

type DashboardActivity = {
  type: string;
  title: string;
  description: string;
  time: string;
};

export type DashboardStats = {
  totalUsers: number;
  totalMembers: number;
  totalProperties: number;
  pendingOrders: number;
  todaySales: number;
  newListings: number;
  recentActivity: DashboardActivity[];
};

export class DashboardStoreError extends Error {
  status: number;

  constructor(message: string, status = 400) {
    super(message);
    this.name = "DashboardStoreError";
    this.status = status;
  }
}

function normalizeId(value: unknown): number | undefined {
  if (value === undefined || value === null || value === "") return undefined;
  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed <= 0) return undefined;
  return parsed;
}

function wrapDbError(error: unknown): never {
  if (error instanceof DashboardStoreError) throw error;
  throw new DashboardStoreError("ไม่สามารถเชื่อมต่อฐานข้อมูล MySQL ได้", 500);
}

export async function getDashboardStats(input?: { sellerId?: unknown }): Promise<DashboardStats> {
  try {
    const sellerId = normalizeId(input?.sellerId);

    if (sellerId) {
      const [[{ propCount }]] = await dbPool.query<RowDataPacket[]>(
        `SELECT COUNT(*) AS propCount FROM properties WHERE seller_id = ?`,
        [sellerId],
      );
      const [[{ orderCount }]] = await dbPool.query<RowDataPacket[]>(
        `SELECT COUNT(*) AS orderCount
         FROM orders o
         JOIN properties p ON p.id = o.property_id
         WHERE p.seller_id = ? AND o.status = 'pending'`,
        [sellerId],
      );
      const [[{ totalSales }]] = await dbPool.query<RowDataPacket[]>(
        `SELECT IFNULL(SUM(price), 0) AS totalSales FROM transactions WHERE seller_id = ?`,
        [sellerId],
      );
      const [[{ newListings }]] = await dbPool.query<RowDataPacket[]>(
        `SELECT COUNT(*) AS newListings
         FROM properties
         WHERE seller_id = ? AND MONTH(created_at) = MONTH(NOW()) AND YEAR(created_at) = YEAR(NOW())`,
        [sellerId],
      );
      const [recentProps] = await dbPool.query<RowDataPacket[]>(
        `SELECT id, title, created_at FROM properties WHERE seller_id = ? ORDER BY created_at DESC LIMIT 4`,
        [sellerId],
      );

      return {
        totalUsers: 0,
        totalMembers: 0,
        totalProperties: Number(propCount),
        pendingOrders: Number(orderCount),
        todaySales: Number(totalSales),
        newListings: Number(newListings),
        recentActivity: recentProps.map((row) => ({
          type: "property",
          title: "อสังหาฯ ใหม่",
          description: String(row.title ?? ""),
          time: new Date(row.created_at as string | Date).toISOString(),
        })),
      };
    }

    const [[{ userCount }]] = await dbPool.query<RowDataPacket[]>(`SELECT COUNT(*) AS userCount FROM users`);
    const [[{ memberCount }]] = await dbPool.query<RowDataPacket[]>(`SELECT COUNT(*) AS memberCount FROM members`);
    const [[{ propCount }]] = await dbPool.query<RowDataPacket[]>(`SELECT COUNT(*) AS propCount FROM properties`);
    const [[{ pendingOrders }]] = await dbPool.query<RowDataPacket[]>(`SELECT COUNT(*) AS pendingOrders FROM orders WHERE status = 'pending'`);
    const [[{ todaySales }]] = await dbPool.query<RowDataPacket[]>(
      `SELECT IFNULL(SUM(price), 0) AS todaySales FROM transactions WHERE DATE(transaction_date) = CURDATE()`,
    );
    const [[{ newListings }]] = await dbPool.query<RowDataPacket[]>(
      `SELECT COUNT(*) AS newListings FROM properties WHERE MONTH(created_at) = MONTH(NOW()) AND YEAR(created_at) = YEAR(NOW())`,
    );

    const [recentOrders] = await dbPool.query<RowDataPacket[]>(
      `SELECT 'order' AS atype, customer_name AS description, property_title AS title, created_at FROM orders ORDER BY created_at DESC LIMIT 3`,
    );
    const [recentProps] = await dbPool.query<RowDataPacket[]>(
      `SELECT 'property' AS atype, title AS description, 'อสังหาฯ ใหม่' AS title, created_at FROM properties ORDER BY created_at DESC LIMIT 3`,
    );
    const [recentMembers] = await dbPool.query<RowDataPacket[]>(
      `SELECT 'member' AS atype, full_name AS description, 'สมาชิกใหม่' AS title, created_at FROM members ORDER BY created_at DESC LIMIT 2`,
    );

    const recentActivity = [...recentOrders, ...recentProps, ...recentMembers]
      .sort((a, b) => new Date(b.created_at as string | Date).getTime() - new Date(a.created_at as string | Date).getTime())
      .slice(0, 5)
      .map((row) => ({
        type: String(row.atype ?? ""),
        title: String(row.title ?? ""),
        description: String(row.description ?? ""),
        time: new Date(row.created_at as string | Date).toISOString(),
      }));

    return {
      totalUsers: Number(userCount),
      totalMembers: Number(memberCount),
      totalProperties: Number(propCount),
      pendingOrders: Number(pendingOrders),
      todaySales: Number(todaySales),
      newListings: Number(newListings),
      recentActivity,
    };
  } catch (error) {
    wrapDbError(error);
  }
}
