import { createHash } from "crypto";
import type { ResultSetHeader, RowDataPacket } from "mysql2/promise";

import { dbPool } from "@/lib/db";

type MemberStatus = "active" | "suspended";

export type Member = {
  id: number;
  fullName: string;
  username?: string;
  phone?: string;
  email?: string;
  status: MemberStatus;
  favoriteCount: number;
  lastActiveAt?: string;
  memberSince: string;
  createdAt: string;
  updatedAt: string;
};

type MemberRow = RowDataPacket & {
  id: number;
  full_name: string;
  username: string | null;
  phone: string | null;
  email: string | null;
  status: MemberStatus;
  favorite_count: number | string | null;
  last_active_at: Date | string | null;
  member_since: Date | string;
  created_at: Date | string;
  updated_at: Date | string;
};

export class MemberStoreError extends Error {
  status: number;

  constructor(message: string, status = 400) {
    super(message);
    this.name = "MemberStoreError";
    this.status = status;
  }
}

function normalizeString(value: unknown): string | undefined {
  if (typeof value !== "string") return undefined;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

function toIsoString(value: Date | string) {
  return value instanceof Date ? value.toISOString() : new Date(value).toISOString();
}

function hashPassword(password: string): string {
  return createHash("sha256").update(password).digest("hex");
}

function mapRowToMember(row: MemberRow): Member {
  return {
    id: row.id,
    fullName: row.full_name,
    username: row.username ?? undefined,
    phone: row.phone ?? undefined,
    email: row.email ?? undefined,
    status: row.status,
    favoriteCount: Number(row.favorite_count ?? 0),
    lastActiveAt: row.last_active_at ? toIsoString(row.last_active_at) : undefined,
    memberSince: toIsoString(row.member_since),
    createdAt: toIsoString(row.created_at),
    updatedAt: toIsoString(row.updated_at),
  };
}

function wrapDbError(error: unknown): never {
  if (error instanceof MemberStoreError) throw error;
  throw new MemberStoreError("ไม่สามารถเชื่อมต่อฐานข้อมูล MySQL ได้", 500);
}

export async function listMembers(): Promise<Member[]> {
  try {
    const [rows] = await dbPool.query<MemberRow[]>(
      `SELECT * FROM members ORDER BY id ASC`,
    );
    return rows.map(mapRowToMember);
  } catch (error) {
    wrapDbError(error);
  }
}

export async function createMember(input: unknown): Promise<Member> {
  if (!input || typeof input !== "object" || Array.isArray(input)) {
    throw new MemberStoreError("payload ไม่ถูกต้อง");
  }

  const payload = input as Record<string, unknown>;
  const fullName = normalizeString(payload.fullName);
  const username = normalizeString(payload.username);
  const password = typeof payload.password === "string" ? payload.password : undefined;
  const status = payload.status === "suspended" ? "suspended" : "active";

  if (!fullName) {
    throw new MemberStoreError("fullName จำเป็นต้องระบุ");
  }

  if (username && (!password || password.length < 8)) {
    throw new MemberStoreError("password ต้องมีอย่างน้อย 8 ตัวอักษร");
  }

  try {
    const [result] = await dbPool.execute<ResultSetHeader>(
      `INSERT INTO members (full_name, phone, email, status, username, password_hash) VALUES (?, ?, ?, ?, ?, ?)`,
      [
        fullName,
        normalizeString(payload.phone) ?? null,
        normalizeString(payload.email) ?? null,
        status,
        username ?? null,
        username && password ? hashPassword(password) : null,
      ],
    );

    const [rows] = await dbPool.query<MemberRow[]>(
      `SELECT * FROM members WHERE id = ? LIMIT 1`,
      [result.insertId],
    );

    if (rows.length === 0) {
      throw new MemberStoreError("สร้างสมาชิกไม่สำเร็จ", 500);
    }

    return mapRowToMember(rows[0]);
  } catch (error) {
    if ((error as { code?: string }).code === "ER_DUP_ENTRY") {
      throw new MemberStoreError("username นี้ถูกใช้งานแล้ว");
    }
    wrapDbError(error);
  }
}

export async function authenticateMember(username: string, password: string): Promise<Member | null> {
  if (!username || !password) return null;
  try {
    const [rows] = await dbPool.query<MemberRow[]>(
      `SELECT * FROM members WHERE username = ? AND password_hash = ? AND status = 'active' LIMIT 1`,
      [username.trim(), hashPassword(password)],
    );
    if (rows.length === 0) return null;
    await dbPool.execute(`UPDATE members SET last_active_at = NOW() WHERE id = ?`, [rows[0].id]);
    return mapRowToMember(rows[0]);
  } catch (error) {
    wrapDbError(error);
  }
}

export async function updateMember(id: number, input: unknown): Promise<Member> {
  if (!Number.isInteger(id) || id <= 0) {
    throw new MemberStoreError("id สมาชิกไม่ถูกต้อง");
  }

  if (!input || typeof input !== "object" || Array.isArray(input)) {
    throw new MemberStoreError("payload ไม่ถูกต้อง");
  }

  const payload = input as Record<string, unknown>;
  const fields: string[] = [];
  const values: Array<string | null> = [];

  if ("fullName" in payload) {
    const fullName = normalizeString(payload.fullName);
    if (!fullName) throw new MemberStoreError("fullName จำเป็นต้องระบุ");
    fields.push("full_name = ?");
    values.push(fullName);
  }

  if ("phone" in payload) {
    fields.push("phone = ?");
    values.push(normalizeString(payload.phone) ?? null);
  }

  if ("email" in payload) {
    fields.push("email = ?");
    values.push(normalizeString(payload.email) ?? null);
  }

  if ("status" in payload) {
    const status = payload.status;
    if (status !== "active" && status !== "suspended") {
      throw new MemberStoreError("status ไม่ถูกต้อง");
    }
    fields.push("status = ?");
    values.push(status);
  }

  if ("username" in payload) {
    fields.push("username = ?");
    values.push(normalizeString(payload.username) ?? null);
  }

  if ("password" in payload) {
    const pw = typeof payload.password === "string" ? payload.password.trim() : "";
    if (pw.length > 0) {
      if (pw.length < 8) throw new MemberStoreError("password ต้องมีอย่างน้อย 8 ตัวอักษร");
      fields.push("password_hash = ?");
      values.push(hashPassword(pw));
    }
  }

  if (fields.length === 0) {
    throw new MemberStoreError("ไม่มีข้อมูลสำหรับอัปเดต");
  }

  try {
    await dbPool.execute(`UPDATE members SET ${fields.join(", ")} WHERE id = ?`, [...values, String(id)]);

    const [rows] = await dbPool.query<MemberRow[]>(
      `SELECT * FROM members WHERE id = ? LIMIT 1`,
      [id],
    );

    if (rows.length === 0) {
      throw new MemberStoreError("ไม่พบสมาชิก", 404);
    }

    return mapRowToMember(rows[0]);
  } catch (error) {
    if ((error as { code?: string }).code === "ER_DUP_ENTRY") {
      throw new MemberStoreError("username นี้ถูกใช้งานแล้ว");
    }
    wrapDbError(error);
  }
}

export async function deleteMember(id: number): Promise<void> {
  if (!Number.isInteger(id) || id <= 0) {
    throw new MemberStoreError("id สมาชิกไม่ถูกต้อง");
  }

  try {
    const [result] = await dbPool.execute<ResultSetHeader>(
      `DELETE FROM members WHERE id = ?`,
      [id],
    );
    if (result.affectedRows === 0) {
      throw new MemberStoreError("ไม่พบสมาชิก", 404);
    }
  } catch (error) {
    wrapDbError(error);
  }
}
