import type { RowDataPacket } from "mysql2/promise";

import { dbPool } from "@/lib/db";

export type GraphMetric = "seller-added" | "member-signup" | "total-sales";
export type GraphRange = "day" | "week" | "month";

export type GraphPoint = {
  label: string;
  value: number;
};

const THAI_DAY = ["อา", "จ", "อ", "พ", "พฤ", "ศ", "ส"];

function buildDaySlots(): { label: string; key: string }[] {
  const slots: { label: string; key: string }[] = [];
  for (let h = 0; h < 24; h++) {
    slots.push({ label: `${String(h).padStart(2, "0")}:00`, key: String(h) });
  }
  return slots;
}

function buildWeekSlots(): { label: string; key: string }[] {
  const slots: { label: string; key: string }[] = [];
  const now = new Date();
  for (let i = 6; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(now.getDate() - i);
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    slots.push({ label: THAI_DAY[d.getDay()], key: `${yyyy}-${mm}-${dd}` });
  }
  return slots;
}

function buildMonthSlots(): { label: string; key: string }[] {
  const slots: { label: string; key: string }[] = [];
  const now = new Date();
  for (let i = 29; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(now.getDate() - i);
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    slots.push({ label: String(d.getDate()), key: `${yyyy}-${mm}-${dd}` });
  }
  return slots;
}

export async function getGraphData(
  metric: GraphMetric,
  range: GraphRange,
  sellerId?: number,
): Promise<GraphPoint[]> {
  if (range === "day") {
    const slots = buildDaySlots();
    const valueMap: Record<string, number> = {};

    if (metric === "seller-added") {
      if (sellerId) {
        const [rows] = await dbPool.query<RowDataPacket[]>(
          `SELECT HOUR(created_at) AS h, COUNT(*) AS cnt
           FROM properties
           WHERE seller_id = ? AND DATE(created_at) = CURDATE()
           GROUP BY HOUR(created_at)`,
          [sellerId],
        );
        rows.forEach((r) => { valueMap[String(r.h)] = Number(r.cnt); });
      } else {
        const [rows] = await dbPool.query<RowDataPacket[]>(
          `SELECT HOUR(created_at) AS h, COUNT(*) AS cnt
           FROM users
           WHERE role = 'seller' AND DATE(created_at) = CURDATE()
           GROUP BY HOUR(created_at)`,
        );
        rows.forEach((r) => { valueMap[String(r.h)] = Number(r.cnt); });
      }
    }

    if (metric === "member-signup") {
      const [rows] = await dbPool.query<RowDataPacket[]>(
        `SELECT HOUR(created_at) AS h, COUNT(*) AS cnt
         FROM members
         WHERE DATE(created_at) = CURDATE()
         GROUP BY HOUR(created_at)`,
      );
      rows.forEach((r) => { valueMap[String(r.h)] = Number(r.cnt); });
    }

    if (metric === "total-sales") {
      const whereSeller = sellerId ? "AND seller_id = ?" : "";
      const params: unknown[] = sellerId ? [sellerId] : [];
      const [rows] = await dbPool.query<RowDataPacket[]>(
        `SELECT HOUR(created_at) AS h, SUM(price) AS total
         FROM transactions
         WHERE DATE(transaction_date) = CURDATE() AND status = 'completed' ${whereSeller}
         GROUP BY HOUR(created_at)`,
        params,
      );
      rows.forEach((r) => { valueMap[String(r.h)] = Number(r.total ?? 0); });
    }

    return slots.map((s) => ({ label: s.label, value: valueMap[s.key] ?? 0 }));
  }

  if (range === "week") {
    const slots = buildWeekSlots();
    const valueMap: Record<string, number> = {};

    if (metric === "seller-added") {
      if (sellerId) {
        const [rows] = await dbPool.query<RowDataPacket[]>(
          `SELECT DATE_FORMAT(created_at, '%Y-%m-%d') AS d, COUNT(*) AS cnt
           FROM properties
           WHERE seller_id = ? AND created_at >= CURDATE() - INTERVAL 6 DAY
           GROUP BY DATE_FORMAT(created_at, '%Y-%m-%d')`,
          [sellerId],
        );
        rows.forEach((r) => { valueMap[String(r.d)] = Number(r.cnt); });
      } else {
        const [rows] = await dbPool.query<RowDataPacket[]>(
          `SELECT DATE_FORMAT(created_at, '%Y-%m-%d') AS d, COUNT(*) AS cnt
           FROM users
           WHERE role = 'seller' AND created_at >= CURDATE() - INTERVAL 6 DAY
           GROUP BY DATE_FORMAT(created_at, '%Y-%m-%d')`,
        );
        rows.forEach((r) => { valueMap[String(r.d)] = Number(r.cnt); });
      }
    }

    if (metric === "member-signup") {
      const [rows] = await dbPool.query<RowDataPacket[]>(
        `SELECT DATE_FORMAT(created_at, '%Y-%m-%d') AS d, COUNT(*) AS cnt
         FROM members
         WHERE created_at >= CURDATE() - INTERVAL 6 DAY
         GROUP BY DATE_FORMAT(created_at, '%Y-%m-%d')`,
      );
      rows.forEach((r) => { valueMap[String(r.d)] = Number(r.cnt); });
    }

    if (metric === "total-sales") {
      const whereSeller = sellerId ? "AND seller_id = ?" : "";
      const params: unknown[] = sellerId ? [sellerId] : [];
      const [rows] = await dbPool.query<RowDataPacket[]>(
        `SELECT DATE_FORMAT(transaction_date, '%Y-%m-%d') AS d, SUM(price) AS total
         FROM transactions
         WHERE transaction_date >= CURDATE() - INTERVAL 6 DAY AND status = 'completed' ${whereSeller}
         GROUP BY DATE_FORMAT(transaction_date, '%Y-%m-%d')`,
        params,
      );
      rows.forEach((r) => { valueMap[String(r.d)] = Number(r.total ?? 0); });
    }

    return slots.map((s) => ({ label: s.label, value: valueMap[s.key] ?? 0 }));
  }

  // month — last 30 days
  const slots = buildMonthSlots();
  const valueMap: Record<string, number> = {};

  if (metric === "seller-added") {
    if (sellerId) {
      const [rows] = await dbPool.query<RowDataPacket[]>(
        `SELECT DATE_FORMAT(created_at, '%Y-%m-%d') AS d, COUNT(*) AS cnt
         FROM properties
         WHERE seller_id = ? AND created_at >= CURDATE() - INTERVAL 29 DAY
         GROUP BY DATE_FORMAT(created_at, '%Y-%m-%d')`,
        [sellerId],
      );
      rows.forEach((r) => { valueMap[String(r.d)] = Number(r.cnt); });
    } else {
      const [rows] = await dbPool.query<RowDataPacket[]>(
        `SELECT DATE_FORMAT(created_at, '%Y-%m-%d') AS d, COUNT(*) AS cnt
         FROM users
         WHERE role = 'seller' AND created_at >= CURDATE() - INTERVAL 29 DAY
         GROUP BY DATE_FORMAT(created_at, '%Y-%m-%d')`,
      );
      rows.forEach((r) => { valueMap[String(r.d)] = Number(r.cnt); });
    }
  }

  if (metric === "member-signup") {
    const [rows] = await dbPool.query<RowDataPacket[]>(
      `SELECT DATE_FORMAT(created_at, '%Y-%m-%d') AS d, COUNT(*) AS cnt
       FROM members
       WHERE created_at >= CURDATE() - INTERVAL 29 DAY
       GROUP BY DATE_FORMAT(created_at, '%Y-%m-%d')`,
    );
    rows.forEach((r) => { valueMap[String(r.d)] = Number(r.cnt); });
  }

  if (metric === "total-sales") {
    const whereSeller = sellerId ? "AND seller_id = ?" : "";
    const params: unknown[] = sellerId ? [sellerId] : [];
    const [rows] = await dbPool.query<RowDataPacket[]>(
      `SELECT DATE_FORMAT(transaction_date, '%Y-%m-%d') AS d, SUM(price) AS total
       FROM transactions
       WHERE transaction_date >= CURDATE() - INTERVAL 29 DAY AND status = 'completed' ${whereSeller}
       GROUP BY DATE_FORMAT(transaction_date, '%Y-%m-%d')`,
      params,
    );
    rows.forEach((r) => { valueMap[String(r.d)] = Number(r.total ?? 0); });
  }

  return slots.map((s) => ({ label: s.label, value: valueMap[s.key] ?? 0 }));
}
