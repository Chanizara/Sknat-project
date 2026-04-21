import type { ResultSetHeader, RowDataPacket } from "mysql2/promise";

import { dbPool } from "@/lib/db";

export type BookingStatus = "pending" | "confirmed" | "cancelled";

export type Booking = {
  id: number;
  propertyId?: number;
  propertyTitle: string;
  memberId?: number;
  customerName: string;
  customerPhone?: string;
  customerEmail?: string;
  bookingDate: string;
  notes?: string;
  status: BookingStatus;
  isManual: boolean;
  createdAt: string;
  updatedAt: string;
};

type BookingRow = RowDataPacket & {
  id: number;
  property_id: number | null;
  property_title: string;
  member_id: number | null;
  customer_name: string;
  customer_phone: string | null;
  customer_email: string | null;
  booking_date: Date | string;
  notes: string | null;
  status: BookingStatus;
  is_manual: number;
  created_at: Date | string;
  updated_at: Date | string;
};

export class BookingStoreError extends Error {
  status: number;
  constructor(message: string, status = 400) {
    super(message);
    this.name = "BookingStoreError";
    this.status = status;
  }
}

function toIsoString(value: Date | string) {
  return value instanceof Date ? value.toISOString() : new Date(value).toISOString();
}

function mapRow(row: BookingRow): Booking {
  return {
    id: row.id,
    propertyId: row.property_id ?? undefined,
    propertyTitle: row.property_title || "",
    memberId: row.member_id ?? undefined,
    customerName: row.customer_name,
    customerPhone: row.customer_phone ?? undefined,
    customerEmail: row.customer_email ?? undefined,
    bookingDate: toIsoString(row.booking_date),
    notes: row.notes ?? undefined,
    status: row.status,
    isManual: Boolean(row.is_manual),
    createdAt: toIsoString(row.created_at),
    updatedAt: toIsoString(row.updated_at),
  };
}

export async function listBookingsByProperty(propertyId: number): Promise<Booking[]> {
  const [rows] = await dbPool.execute<BookingRow[]>(
    `SELECT b.* FROM bookings b WHERE b.property_id = ? ORDER BY b.booking_date ASC`,
    [propertyId],
  );
  return rows.map(mapRow);
}

export async function listAllBookings(): Promise<Booking[]> {
  const [rows] = await dbPool.execute<BookingRow[]>(
    `SELECT b.* FROM bookings b ORDER BY b.booking_date ASC`,
  );
  return rows.map(mapRow);
}

export async function createBooking(payload: unknown): Promise<Booking> {
  const p = payload as {
    propertyId?: unknown;
    propertyTitle?: unknown;
    memberId?: unknown;
    customerName?: unknown;
    customerPhone?: unknown;
    customerEmail?: unknown;
    bookingDate?: unknown;
    notes?: unknown;
    status?: unknown;
    isManual?: unknown;
  } | undefined;

  const propertyId = p?.propertyId ? Number(p.propertyId) : null;
  const propertyTitle = typeof p?.propertyTitle === "string" ? p.propertyTitle.trim() : "";
  const memberId = p?.memberId ? Number(p.memberId) : null;
  const customerName = typeof p?.customerName === "string" ? p.customerName.trim() : "ไม่ระบุ";
  const customerPhone = typeof p?.customerPhone === "string" && p.customerPhone.trim() ? p.customerPhone.trim() : null;
  const customerEmail = typeof p?.customerEmail === "string" && p.customerEmail.trim() ? p.customerEmail.trim() : null;
  const notes = typeof p?.notes === "string" && p.notes.trim() ? p.notes.trim() : null;
  const status: BookingStatus = (p?.status === "confirmed" || p?.status === "cancelled") ? p.status : "pending";
  const isManual = p?.isManual ? 1 : 0;

  if (!p?.bookingDate) throw new BookingStoreError("กรุณาระบุวันและเวลาที่ต้องการจอง");
  const bookingDate = new Date(p.bookingDate as string);
  if (isNaN(bookingDate.getTime())) throw new BookingStoreError("วันที่จองไม่ถูกต้อง");

  const [result] = await dbPool.execute<ResultSetHeader>(
    `INSERT INTO bookings (property_id, property_title, member_id, customer_name, customer_phone, customer_email, booking_date, notes, status, is_manual)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [propertyId, propertyTitle, memberId, customerName, customerPhone, customerEmail, bookingDate, notes, status, isManual],
  );

  const [rows] = await dbPool.execute<BookingRow[]>(
    `SELECT * FROM bookings WHERE id = ?`,
    [result.insertId],
  );
  return mapRow(rows[0]);
}

export async function updateBooking(id: number, payload: unknown): Promise<Booking> {
  const p = payload as {
    customerName?: unknown;
    customerPhone?: unknown;
    customerEmail?: unknown;
    bookingDate?: unknown;
    notes?: unknown;
    status?: unknown;
  } | undefined;

  const [existing] = await dbPool.execute<BookingRow[]>(`SELECT * FROM bookings WHERE id = ?`, [id]);
  if (!existing[0]) throw new BookingStoreError("ไม่พบการจองนี้", 404);

  const customerName = typeof p?.customerName === "string" && p.customerName.trim() ? p.customerName.trim() : existing[0].customer_name;
  const customerPhone = typeof p?.customerPhone === "string" ? (p.customerPhone.trim() || null) : existing[0].customer_phone;
  const customerEmail = typeof p?.customerEmail === "string" ? (p.customerEmail.trim() || null) : existing[0].customer_email;
  const notes = typeof p?.notes === "string" ? (p.notes.trim() || null) : existing[0].notes;
  const status: BookingStatus = (p?.status === "pending" || p?.status === "confirmed" || p?.status === "cancelled") ? p.status : existing[0].status;

  let bookingDate: Date;
  if (p?.bookingDate) {
    bookingDate = new Date(p.bookingDate as string);
    if (isNaN(bookingDate.getTime())) throw new BookingStoreError("วันที่จองไม่ถูกต้อง");
  } else {
    bookingDate = new Date(toIsoString(existing[0].booking_date));
  }

  await dbPool.execute(
    `UPDATE bookings SET customer_name=?, customer_phone=?, customer_email=?, booking_date=?, notes=?, status=? WHERE id=?`,
    [customerName, customerPhone, customerEmail, bookingDate, notes, status, id],
  );

  const [rows] = await dbPool.execute<BookingRow[]>(`SELECT * FROM bookings WHERE id = ?`, [id]);
  return mapRow(rows[0]);
}

export async function deleteBooking(id: number): Promise<void> {
  await dbPool.execute(`DELETE FROM bookings WHERE id = ?`, [id]);
}
