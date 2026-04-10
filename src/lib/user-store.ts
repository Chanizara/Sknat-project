import crypto from "node:crypto";

import type { ResultSetHeader, RowDataPacket } from "mysql2/promise";

import { dbPool } from "@/lib/db";
import { USER_ROLES, type User, type UserRole } from "@/types/user";

type UserRow = RowDataPacket & {
  id: number;
  username: string;
  role: UserRole;
  full_name: string | null;
  phone: string | null;
  email: string | null;
  line_id: string | null;
  created_at: Date | string;
  updated_at: Date | string;
};

export class UserStoreError extends Error {
  status: number;

  constructor(message: string, status = 400) {
    super(message);
    this.name = "UserStoreError";
    this.status = status;
  }
}

function isUserRole(value: string): value is UserRole {
  return (USER_ROLES as readonly string[]).includes(value);
}

function normalizeString(value: unknown): string | undefined {
  if (typeof value !== "string") {
    return undefined;
  }
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

function hashPassword(password: string) {
  return crypto.createHash("sha256").update(password).digest("hex");
}

function toIsoString(dateValue: Date | string) {
  return dateValue instanceof Date ? dateValue.toISOString() : new Date(dateValue).toISOString();
}

function mapRowToUser(row: UserRow): User {
  return {
    id: row.id,
    username: row.username,
    role: row.role,
    fullName: row.full_name ?? undefined,
    phone: row.phone ?? undefined,
    email: row.email ?? undefined,
    lineId: row.line_id ?? undefined,
    createdAt: toIsoString(row.created_at),
    updatedAt: toIsoString(row.updated_at),
  };
}

function wrapDbError(error: unknown): never {
  if (error instanceof UserStoreError) {
    throw error;
  }

  if (typeof error === "object" && error && "code" in error && (error as { code?: string }).code === "ER_DUP_ENTRY") {
    throw new UserStoreError("username นี้มีอยู่แล้ว", 409);
  }

  throw new UserStoreError("ไม่สามารถเชื่อมต่อฐานข้อมูล MySQL ได้", 500);
}

export async function listUsers(): Promise<User[]> {
  try {
    const [rows] = await dbPool.query<UserRow[]>(
      `SELECT id, username, role, full_name, phone, email, line_id, created_at, updated_at
       FROM users
       ORDER BY id ASC`,
    );

    return rows.map(mapRowToUser);
  } catch (error) {
    wrapDbError(error);
  }
}

export async function createUser(input: unknown): Promise<User> {
  if (!input || typeof input !== "object" || Array.isArray(input)) {
    throw new UserStoreError("payload ไม่ถูกต้อง");
  }

  const payload = input as Record<string, unknown>;
  const username = normalizeString(payload.username);
  const password = normalizeString(payload.password);
  const roleValue = normalizeString(payload.role);
  const fullName = normalizeString(payload.fullName);
  const phone = normalizeString(payload.phone);
  const email = normalizeString(payload.email);
  const lineId = normalizeString(payload.lineId);

  if (!username) {
    throw new UserStoreError("username จำเป็นต้องระบุ");
  }

  if (!password || password.length < 8) {
    throw new UserStoreError("password ต้องมีความยาวอย่างน้อย 8 ตัวอักษร");
  }

  if (!roleValue || !isUserRole(roleValue)) {
    throw new UserStoreError("role ต้องเป็น admin หรือ seller");
  }

  try {
    const [result] = await dbPool.execute<ResultSetHeader>(
      `INSERT INTO users (username, password_hash, role, full_name, phone, email, line_id)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [username, hashPassword(password), roleValue, fullName ?? null, phone ?? null, email ?? null, lineId ?? null],
    );

    const [rows] = await dbPool.query<UserRow[]>(
      `SELECT id, username, role, full_name, phone, email, line_id, created_at, updated_at
       FROM users WHERE id = ? LIMIT 1`,
      [result.insertId],
    );

    if (rows.length === 0) {
      throw new UserStoreError("สร้างผู้ใช้ไม่สำเร็จ", 500);
    }

    return mapRowToUser(rows[0]);
  } catch (error) {
    wrapDbError(error);
  }
}

export async function updateUser(id: number, input: unknown): Promise<User> {
  if (!Number.isInteger(id) || id <= 0) {
    throw new UserStoreError("id ผู้ใช้ไม่ถูกต้อง");
  }

  if (!input || typeof input !== "object" || Array.isArray(input)) {
    throw new UserStoreError("payload ไม่ถูกต้อง");
  }

  const payload = input as Record<string, unknown>;
  const fields: string[] = [];
  const values: Array<string | null> = [];

  if ("username" in payload) {
    const usernameValue = normalizeString(payload.username);
    if (!usernameValue) {
      throw new UserStoreError("username ต้องไม่ว่าง");
    }
    fields.push("username = ?");
    values.push(usernameValue);
  }

  if ("fullName" in payload) {
    fields.push("full_name = ?");
    values.push(normalizeString(payload.fullName) ?? null);
  }

  if ("phone" in payload) {
    fields.push("phone = ?");
    values.push(normalizeString(payload.phone) ?? null);
  }

  if ("email" in payload) {
    fields.push("email = ?");
    values.push(normalizeString(payload.email) ?? null);
  }

  if ("lineId" in payload) {
    fields.push("line_id = ?");
    values.push(normalizeString(payload.lineId) ?? null);
  }

  if ("role" in payload) {
    const roleValue = normalizeString(payload.role);
    if (!roleValue || !isUserRole(roleValue)) {
      throw new UserStoreError("role ต้องเป็น admin หรือ seller");
    }
    fields.push("role = ?");
    values.push(roleValue);
  }

  if ("password" in payload) {
    const password = normalizeString(payload.password);
    if (!password || password.length < 6) {
      throw new UserStoreError("password ต้องมีความยาวอย่างน้อย 6 ตัวอักษร");
    }
    fields.push("password_hash = ?");
    values.push(hashPassword(password));
  }

  if (fields.length === 0) {
    throw new UserStoreError("ไม่มีข้อมูลสำหรับอัปเดต");
  }

  try {
    await dbPool.execute(
      `UPDATE users SET ${fields.join(", ")} WHERE id = ?`,
      [...values, String(id)],
    );

    const [rows] = await dbPool.query<UserRow[]>(
      `SELECT id, username, role, full_name, phone, email, line_id, created_at, updated_at
       FROM users WHERE id = ? LIMIT 1`,
      [id],
    );

    if (rows.length === 0) {
      throw new UserStoreError("ไม่พบผู้ใช้", 404);
    }

    return mapRowToUser(rows[0]);
  } catch (error) {
    wrapDbError(error);
  }
}

export async function deleteUser(id: number): Promise<void> {
  if (!Number.isInteger(id) || id <= 0) {
    throw new UserStoreError("id ผู้ใช้ไม่ถูกต้อง");
  }

  try {
    const [result] = await dbPool.execute<ResultSetHeader>(
      `DELETE FROM users WHERE id = ?`,
      [id],
    );

    if (result.affectedRows === 0) {
      throw new UserStoreError("ไม่พบผู้ใช้", 404);
    }
  } catch (error) {
    wrapDbError(error);
  }
}

export async function authenticateUser(input: unknown): Promise<User | null> {
  if (!input || typeof input !== "object" || Array.isArray(input)) {
    throw new UserStoreError("payload ไม่ถูกต้อง");
  }

  const payload = input as Record<string, unknown>;
  const username = normalizeString(payload.username);
  const password = normalizeString(payload.password);

  if (!username || !password) {
    throw new UserStoreError("username และ password จำเป็นต้องระบุ");
  }

  try {
    const [rows] = await dbPool.query<UserRow[]>(
      `SELECT id, username, role, full_name, phone, email, line_id, created_at, updated_at
       FROM users
       WHERE username = ? AND password_hash = ?
       LIMIT 1`,
      [username, hashPassword(password)],
    );

    if (rows.length === 0) {
      return null;
    }

    return mapRowToUser(rows[0]);
  } catch (error) {
    wrapDbError(error);
  }
}

export async function likeProperty(userId: number, propertyId: number): Promise<void> {
  try {
    await dbPool.execute(
      `INSERT INTO user_favorites (user_id, property_id) VALUES (?, ?)
       ON DUPLICATE KEY UPDATE created_at = CURRENT_TIMESTAMP`,
      [userId, propertyId],
    );
  } catch (error) {
    wrapDbError(error);
  }
}

export async function unlikeProperty(userId: number, propertyId: number): Promise<void> {
  try {
    await dbPool.execute(
      `DELETE FROM user_favorites WHERE user_id = ? AND property_id = ?`,
      [userId, propertyId],
    );
  } catch (error) {
    wrapDbError(error);
  }
}
