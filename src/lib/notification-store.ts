import type { ResultSetHeader, RowDataPacket } from "mysql2/promise";

import { dbPool } from "@/lib/db";

export type Notification = {
  id: number;
  type: string;
  title: string;
  message?: string;
  propertyId?: number;
  orderId?: number;
  recipientUserId?: number;
  isRead: boolean;
  createdAt: string;
};

type NotificationRow = RowDataPacket & {
  id: number;
  type: string;
  title: string;
  message: string | null;
  property_id: number | null;
  order_id: number | null;
  recipient_user_id: number | null;
  is_read: number;
  created_at: Date | string;
};

export class NotificationStoreError extends Error {
  status: number;
  constructor(message: string, status = 400) {
    super(message);
    this.name = "NotificationStoreError";
    this.status = status;
  }
}

function mapRow(row: NotificationRow): Notification {
  const ca = row.created_at;
  return {
    id: row.id,
    type: row.type,
    title: row.title,
    message: row.message ?? undefined,
    propertyId: row.property_id ?? undefined,
    orderId: row.order_id ?? undefined,
    recipientUserId: row.recipient_user_id ?? undefined,
    isRead: Boolean(row.is_read),
    createdAt: ca instanceof Date ? ca.toISOString() : new Date(ca).toISOString(),
  };
}

export async function listNotifications(recipientUserId?: number): Promise<Notification[]> {
  const [rows] = recipientUserId
    ? await dbPool.query<NotificationRow[]>(
        `SELECT * FROM notifications WHERE recipient_user_id = ? ORDER BY created_at DESC`,
        [recipientUserId],
      )
    : await dbPool.query<NotificationRow[]>(`SELECT * FROM notifications ORDER BY created_at DESC`);
  return rows.map(mapRow);
}

export async function countUnread(recipientUserId?: number): Promise<number> {
  const [rows] = recipientUserId
    ? await dbPool.query<(RowDataPacket & { cnt: number })[]>(
        `SELECT COUNT(*) AS cnt FROM notifications WHERE recipient_user_id = ? AND is_read = 0`,
        [recipientUserId],
      )
    : await dbPool.query<(RowDataPacket & { cnt: number })[]>(
        `SELECT COUNT(*) AS cnt FROM notifications WHERE is_read = 0`,
      );
  return Number(rows[0]?.cnt ?? 0);
}

export async function createNotification(input: {
  type?: string;
  title: string;
  message?: string;
  propertyId?: number;
  orderId?: number;
  recipientUserId?: number;
}): Promise<Notification> {
  const [result] = await dbPool.execute<ResultSetHeader>(
    `INSERT INTO notifications (type, title, message, property_id, order_id, recipient_user_id)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [
      input.type ?? "inquiry",
      input.title,
      input.message ?? null,
      input.propertyId ?? null,
      input.orderId ?? null,
      input.recipientUserId ?? null,
    ],
  );
  const [rows] = await dbPool.query<NotificationRow[]>(
    `SELECT * FROM notifications WHERE id = ? LIMIT 1`,
    [result.insertId],
  );
  return mapRow(rows[0]);
}

export async function markNotificationRead(id: number): Promise<void> {
  await dbPool.execute(`UPDATE notifications SET is_read = 1 WHERE id = ?`, [id]);
}

export async function markAllRead(recipientUserId?: number): Promise<void> {
  if (recipientUserId) {
    await dbPool.execute(
      `UPDATE notifications SET is_read = 1 WHERE recipient_user_id = ?`,
      [recipientUserId],
    );
  } else {
    await dbPool.execute(`UPDATE notifications SET is_read = 1`);
  }
}
