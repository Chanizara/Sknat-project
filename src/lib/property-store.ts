import type { ResultSetHeader, RowDataPacket } from "mysql2/promise";

import { dbPool } from "@/lib/db";
import { LISTING_TYPES, type ListingType, type Property, type PropertyInput } from "@/types/property";

const DEFAULT_IMAGE = "/hero_1.jpg";
const DEFAULT_CATEGORY = "ที่อยู่อาศัย";
const DEFAULT_PROPERTY_TYPE = "บ้านเดี่ยว";

type PropertyRow = RowDataPacket & {
  id: number;
  type: ListingType;
  title: string;
  location: string;
  price: number | string;
  image: string;
  category: string | null;
  property_type: string | null;
  size: number | string | null;
  bedrooms: number | string | null;
  bathrooms: number | string | null;
  price_per_sqm: number | string | null;
  description: string | null;
  features: string | null;
  lat: number | string | null;
  lng: number | string | null;
  agent_name: string | null;
  agent_phone: string | null;
  agent_email: string | null;
  images: string | null;
  created_at: Date | string;
  updated_at: Date | string;
};

export class PropertyStoreError extends Error {
  status: number;

  constructor(message: string, status = 400) {
    super(message);
    this.name = "PropertyStoreError";
    this.status = status;
  }
}

function isListingType(value: string): value is ListingType {
  return (LISTING_TYPES as readonly string[]).includes(value);
}

function normalizeString(value: unknown): string | undefined {
  if (typeof value !== "string") {
    return undefined;
  }

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

function normalizeNumber(value: unknown, fieldName: string): number | undefined {
  if (value === undefined || value === null || value === "") {
    return undefined;
  }

  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed < 0) {
    throw new PropertyStoreError(`ค่า ${fieldName} ไม่ถูกต้อง`);
  }

  return parsed;
}

function normalizeStringArray(value: unknown): string[] | undefined {
  if (value === undefined || value === null || value === "") {
    return undefined;
  }

  if (Array.isArray(value)) {
    const cleaned = value
      .map((item) => (typeof item === "string" ? item.trim() : ""))
      .filter(Boolean);
    return cleaned.length > 0 ? cleaned : undefined;
  }

  if (typeof value === "string") {
    const cleaned = value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
    return cleaned.length > 0 ? cleaned : undefined;
  }

  throw new PropertyStoreError("รูปแบบข้อมูล list ไม่ถูกต้อง");
}

function normalizeAgent(value: unknown): PropertyInput["agent"] {
  if (value === undefined || value === null) {
    return undefined;
  }

  if (typeof value !== "object" || Array.isArray(value)) {
    throw new PropertyStoreError("ข้อมูลผู้ติดต่อไม่ถูกต้อง");
  }

  const payload = value as Record<string, unknown>;
  const name = normalizeString(payload.name);
  const phone = normalizeString(payload.phone);
  const email = normalizeString(payload.email);

  if (!name && !phone && !email) {
    return undefined;
  }

  return {
    name: name ?? "-",
    phone: phone ?? "-",
    email: email ?? "-",
  };
}

function parseJsonArray(input: string | null): string[] | undefined {
  if (!input) {
    return undefined;
  }

  try {
    const parsed = JSON.parse(input) as unknown;
    if (!Array.isArray(parsed)) {
      return undefined;
    }

    const cleaned = parsed
      .map((item) => (typeof item === "string" ? item.trim() : ""))
      .filter(Boolean);

    return cleaned.length > 0 ? cleaned : undefined;
  } catch {
    return undefined;
  }
}

function toIsoString(dateValue: Date | string): string {
  return dateValue instanceof Date ? dateValue.toISOString() : new Date(dateValue).toISOString();
}

function toNumberOrUndefined(value: unknown): number | undefined {
  if (value === null || value === undefined) {
    return undefined;
  }

  const numberValue = Number(value);
  return Number.isFinite(numberValue) ? numberValue : undefined;
}

function mapRowToProperty(row: PropertyRow): Property {
  const features = parseJsonArray(row.features);
  const images = parseJsonArray(row.images);

  const hasAgent = row.agent_name || row.agent_phone || row.agent_email;

  return {
    id: row.id,
    type: row.type,
    title: row.title,
    location: row.location,
    price: toNumberOrUndefined(row.price) ?? 0,
    image: row.image,
    category: row.category ?? undefined,
    propertyType: row.property_type ?? undefined,
    size: toNumberOrUndefined(row.size),
    bedrooms: toNumberOrUndefined(row.bedrooms),
    bathrooms: toNumberOrUndefined(row.bathrooms),
    pricePerSqm: toNumberOrUndefined(row.price_per_sqm),
    description: row.description ?? undefined,
    features,
    lat: toNumberOrUndefined(row.lat),
    lng: toNumberOrUndefined(row.lng),
    agent: hasAgent
      ? {
          name: row.agent_name ?? "-",
          phone: row.agent_phone ?? "-",
          email: row.agent_email ?? "-",
        }
      : undefined,
    images,
    createdAt: toIsoString(row.created_at),
    updatedAt: toIsoString(row.updated_at),
  };
}

function normalizePayload(input: unknown, mode: "create" | "update"): PropertyInput {
  if (!input || typeof input !== "object" || Array.isArray(input)) {
    throw new PropertyStoreError("payload ไม่ถูกต้อง");
  }

  const payload = input as Record<string, unknown>;
  const normalized: PropertyInput = {};

  if ("type" in payload) {
    const typeValue = normalizeString(payload.type);
    if (!typeValue || !isListingType(typeValue)) {
      throw new PropertyStoreError("type ต้องเป็น ขาย หรือ เช่า");
    }
    normalized.type = typeValue;
  }

  if ("title" in payload) {
    const title = normalizeString(payload.title);
    if (!title) {
      throw new PropertyStoreError("title ต้องไม่ว่าง");
    }
    normalized.title = title;
  }

  if ("location" in payload) {
    const location = normalizeString(payload.location);
    if (!location) {
      throw new PropertyStoreError("location ต้องไม่ว่าง");
    }
    normalized.location = location;
  }

  if ("price" in payload) {
    const price = normalizeNumber(payload.price, "price");
    if (price === undefined) {
      throw new PropertyStoreError("price ต้องไม่ว่าง");
    }
    normalized.price = price;
  }

  if ("image" in payload) {
    normalized.image = normalizeString(payload.image);
  }

  if ("category" in payload) {
    normalized.category = normalizeString(payload.category);
  }

  if ("propertyType" in payload) {
    normalized.propertyType = normalizeString(payload.propertyType);
  }

  if ("description" in payload) {
    normalized.description = normalizeString(payload.description);
  }

  if ("size" in payload) {
    normalized.size = normalizeNumber(payload.size, "size");
  }

  if ("bedrooms" in payload) {
    normalized.bedrooms = normalizeNumber(payload.bedrooms, "bedrooms");
  }

  if ("bathrooms" in payload) {
    normalized.bathrooms = normalizeNumber(payload.bathrooms, "bathrooms");
  }

  if ("pricePerSqm" in payload) {
    normalized.pricePerSqm = normalizeNumber(payload.pricePerSqm, "pricePerSqm");
  }

  if ("lat" in payload) {
    normalized.lat = normalizeNumber(payload.lat, "lat");
  }

  if ("lng" in payload) {
    normalized.lng = normalizeNumber(payload.lng, "lng");
  }

  if ("features" in payload) {
    normalized.features = normalizeStringArray(payload.features);
  }

  if ("images" in payload) {
    normalized.images = normalizeStringArray(payload.images);
  }

  if ("agent" in payload) {
    normalized.agent = normalizeAgent(payload.agent);
  }

  if (mode === "create") {
    if (!normalized.type) {
      throw new PropertyStoreError("type จำเป็นต้องระบุ");
    }
    if (!normalized.title) {
      throw new PropertyStoreError("title จำเป็นต้องระบุ");
    }
    if (!normalized.location) {
      throw new PropertyStoreError("location จำเป็นต้องระบุ");
    }
    if (normalized.price === undefined) {
      throw new PropertyStoreError("price จำเป็นต้องระบุ");
    }

    normalized.image = normalized.image ?? DEFAULT_IMAGE;
    normalized.category = normalized.category ?? DEFAULT_CATEGORY;
    normalized.propertyType = normalized.propertyType ?? DEFAULT_PROPERTY_TYPE;

    if (!normalized.pricePerSqm && normalized.price && normalized.size && normalized.size > 0) {
      normalized.pricePerSqm = Math.round(normalized.price / normalized.size);
    }
  }

  return normalized;
}

function wrapDbError(error: unknown): never {
  if (error instanceof PropertyStoreError) {
    throw error;
  }

  throw new PropertyStoreError("ไม่สามารถเชื่อมต่อฐานข้อมูล MySQL ได้", 500);
}

export async function listProperties(): Promise<Property[]> {
  try {
    const [rows] = await dbPool.query<PropertyRow[]>(
      `SELECT
        id,
        type,
        title,
        location,
        price,
        image,
        category,
        property_type,
        size,
        bedrooms,
        bathrooms,
        price_per_sqm,
        description,
        CAST(features AS CHAR) AS features,
        lat,
        lng,
        agent_name,
        agent_phone,
        agent_email,
        CAST(images AS CHAR) AS images,
        created_at,
        updated_at
      FROM properties
      ORDER BY id DESC`,
    );

    return rows.map(mapRowToProperty);
  } catch (error) {
    wrapDbError(error);
  }
}

export async function getPropertyById(id: number): Promise<Property | undefined> {
  try {
    const [rows] = await dbPool.query<PropertyRow[]>(
      `SELECT
        id,
        type,
        title,
        location,
        price,
        image,
        category,
        property_type,
        size,
        bedrooms,
        bathrooms,
        price_per_sqm,
        description,
        CAST(features AS CHAR) AS features,
        lat,
        lng,
        agent_name,
        agent_phone,
        agent_email,
        CAST(images AS CHAR) AS images,
        created_at,
        updated_at
      FROM properties
      WHERE id = ?
      LIMIT 1`,
      [id],
    );

    if (rows.length === 0) {
      return undefined;
    }

    return mapRowToProperty(rows[0]);
  } catch (error) {
    wrapDbError(error);
  }
}

export async function createProperty(input: unknown): Promise<Property> {
  try {
    const normalized = normalizePayload(input, "create");

    const pricePerSqm =
      normalized.pricePerSqm ??
      (normalized.size && normalized.size > 0 && normalized.price ? Math.round(normalized.price / normalized.size) : undefined);

    const sql = `INSERT INTO properties (
        type,
        title,
        location,
        price,
        image,
        category,
        property_type,
        size,
        bedrooms,
        bathrooms,
        price_per_sqm,
        description,
        features,
        lat,
        lng,
        agent_name,
        agent_phone,
        agent_email,
        images
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [result] = await (dbPool.execute as any)(sql,
      [
        normalized.type,
        normalized.title,
        normalized.location,
        normalized.price,
        normalized.image ?? DEFAULT_IMAGE,
        normalized.category ?? DEFAULT_CATEGORY,
        normalized.propertyType ?? DEFAULT_PROPERTY_TYPE,
        normalized.size ?? null,
        normalized.bedrooms ?? null,
        normalized.bathrooms ?? null,
        pricePerSqm ?? null,
        normalized.description ?? null,
        normalized.features ? JSON.stringify(normalized.features) : null,
        normalized.lat ?? null,
        normalized.lng ?? null,
        normalized.agent?.name ?? null,
        normalized.agent?.phone ?? null,
        normalized.agent?.email ?? null,
        normalized.images ? JSON.stringify(normalized.images) : null,
      ],
    );

    const created = await getPropertyById(result.insertId);
    if (!created) {
      throw new PropertyStoreError("สร้างรายการไม่สำเร็จ", 500);
    }

    return created;
  } catch (error) {
    wrapDbError(error);
  }
}

export async function updateProperty(id: number, input: unknown): Promise<Property> {
  try {
    const normalized = normalizePayload(input, "update");
    const existing = await getPropertyById(id);

    if (!existing) {
      throw new PropertyStoreError("ไม่พบรายการอสังหาริมทรัพย์", 404);
    }

    const merged: Property = {
      ...existing,
      ...normalized,
      pricePerSqm:
        normalized.pricePerSqm ??
        ((normalized.price !== undefined || normalized.size !== undefined) && (normalized.size ?? existing.size)
          ? Math.round((normalized.price ?? existing.price) / (normalized.size ?? existing.size ?? 1))
          : existing.pricePerSqm),
      updatedAt: new Date().toISOString(),
    };

    const updateSql = `UPDATE properties
      SET
        type = ?,
        title = ?,
        location = ?,
        price = ?,
        image = ?,
        category = ?,
        property_type = ?,
        size = ?,
        bedrooms = ?,
        bathrooms = ?,
        price_per_sqm = ?,
        description = ?,
        features = ?,
        lat = ?,
        lng = ?,
        agent_name = ?,
        agent_phone = ?,
        agent_email = ?,
        images = ?,
        updated_at = NOW()
      WHERE id = ?`;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (dbPool.execute as any)(updateSql,
      [
        merged.type,
        merged.title,
        merged.location,
        merged.price,
        merged.image,
        merged.category ?? null,
        merged.propertyType ?? null,
        merged.size ?? null,
        merged.bedrooms ?? null,
        merged.bathrooms ?? null,
        merged.pricePerSqm ?? null,
        merged.description ?? null,
        merged.features ? JSON.stringify(merged.features) : null,
        merged.lat ?? null,
        merged.lng ?? null,
        merged.agent?.name ?? null,
        merged.agent?.phone ?? null,
        merged.agent?.email ?? null,
        merged.images ? JSON.stringify(merged.images) : null,
        id,
      ],
    );

    const updated = await getPropertyById(id);
    if (!updated) {
      throw new PropertyStoreError("อัปเดตรายการไม่สำเร็จ", 500);
    }

    return updated;
  } catch (error) {
    wrapDbError(error);
  }
}

export async function deleteProperty(id: number): Promise<void> {
  try {
    const [result] = await dbPool.execute<ResultSetHeader>("DELETE FROM properties WHERE id = ?", [id]);

    if (result.affectedRows === 0) {
      throw new PropertyStoreError("ไม่พบรายการอสังหาริมทรัพย์", 404);
    }
  } catch (error) {
    wrapDbError(error);
  }
}
