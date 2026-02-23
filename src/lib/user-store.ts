import crypto from "node:crypto";

import type { ResultSetHeader, RowDataPacket } from "mysql2/promise";

import { dbPool } from "@/lib/db";
import { USER_ROLES, type User, type UserRole } from "@/types/user";

type UserRow = RowDataPacket & {
  id: number;
  username: string;
  role: UserRole;
  full_name: string | null;
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
      `SELECT id, username, role, full_name, created_at, updated_at
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
      `INSERT INTO users (username, password_hash, role, full_name)
       VALUES (?, ?, ?, ?)`,
      [username, hashPassword(password), roleValue, fullName ?? null],
    );

    const [rows] = await dbPool.query<UserRow[]>(
      `SELECT id, username, role, full_name, created_at, updated_at
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
      `SELECT id, username, role, full_name, created_at, updated_at
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
