import { NextResponse } from "next/server";

import { getDashboardStats } from "@/lib/dashboard-store";
import { getGraphData, type GraphMetric, type GraphRange } from "@/lib/graph-store";
import { createMember, deleteMember, listMembers, MemberStoreError, updateMember } from "@/lib/member-store";
import { countUnread, createNotification, deleteAllNotifications, listNotifications, markAllRead, markNotificationRead, NotificationStoreError } from "@/lib/notification-store";
import { createOrder, deleteOrder, listOrders, OrderStoreError, updateOrder, upsertOrderForProperty } from "@/lib/order-store";
import { createProperty, deleteProperty, getPropertyById, listProperties, PropertyStoreError, updateProperty } from "@/lib/property-store";
import { createTransaction, getTransactionByOrderId, listTransactions, TransactionStoreError } from "@/lib/transaction-store";
import { authenticateUser, createUser, deleteUser, listUsers, updateUser, UserStoreError } from "@/lib/user-store";
import { BookingStoreError, createBooking, deleteBooking, listAllBookings, listBookingsByProperty, listTakenSlots, updateBooking } from "@/lib/booking-store";

type EventRequest = {
  event?: string;
  payload?: unknown;
};

function handleError(error: unknown) {
  if (
    error instanceof UserStoreError ||
    error instanceof PropertyStoreError ||
    error instanceof MemberStoreError ||
    error instanceof OrderStoreError ||
    error instanceof TransactionStoreError ||
    error instanceof NotificationStoreError ||
    error instanceof BookingStoreError
  ) {
    return NextResponse.json({ ok: false, error: error.message }, { status: error.status });
  }

  return NextResponse.json({ ok: false, error: "เกิดข้อผิดพลาดภายในระบบ" }, { status: 500 });
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as EventRequest;
    const event = body.event;
    const payload = body.payload;

    if (!event) {
      return NextResponse.json({ ok: false, error: "event จำเป็นต้องระบุ" }, { status: 400 });
    }

    switch (event) {
      case "auth:login": {
        const user = await authenticateUser(payload);
        if (!user) {
          return NextResponse.json({ ok: false, error: "username หรือ password ไม่ถูกต้อง" }, { status: 401 });
        }
        return NextResponse.json({ ok: true, data: user });
      }

      case "dashboard:stats": {
        const stats = await getDashboardStats(payload as { sellerId?: unknown });
        return NextResponse.json({ ok: true, data: stats });
      }

      case "users:list":
        return NextResponse.json({ ok: true, data: await listUsers() });

      case "users:create":
        return NextResponse.json({ ok: true, data: await createUser(payload) });

      case "users:update": {
        const id = Number((payload as { id?: unknown } | undefined)?.id);
        return NextResponse.json({ ok: true, data: await updateUser(id, payload) });
      }

      case "users:delete": {
        const id = Number((payload as { id?: unknown } | undefined)?.id);
        await deleteUser(id);
        return NextResponse.json({ ok: true, data: { id } });
      }

      case "members:list":
        return NextResponse.json({ ok: true, data: await listMembers() });

      case "members:create":
        return NextResponse.json({ ok: true, data: await createMember(payload) });

      case "members:update": {
        const id = Number((payload as { id?: unknown } | undefined)?.id);
        return NextResponse.json({ ok: true, data: await updateMember(id, payload) });
      }

      case "members:delete": {
        const id = Number((payload as { id?: unknown } | undefined)?.id);
        await deleteMember(id);
        return NextResponse.json({ ok: true, data: { id } });
      }

      case "properties:list": {
        const sellerId = Number((payload as { sellerId?: unknown } | undefined)?.sellerId);
        return NextResponse.json({
          ok: true,
          data: await listProperties(Number.isInteger(sellerId) && sellerId > 0 ? { sellerId } : undefined),
        });
      }

      case "properties:create":
        return NextResponse.json({ ok: true, data: await createProperty(payload) });

      case "properties:update": {
        const id = Number((payload as { id?: unknown } | undefined)?.id);
        return NextResponse.json({ ok: true, data: await updateProperty(id, payload) });
      }

      case "properties:updateStatus": {
        const p = payload as {
          id?: unknown;
          status?: unknown;
          statusNote?: unknown;
          customerName?: unknown;
          customerPhone?: unknown;
          customerEmail?: unknown;
        } | undefined;

        const id = Number(p?.id);
        const updatedProperty = await updateProperty(id, {
          id,
          status: p?.status,
          statusNote: p?.statusNote,
        });

        // Upsert order if the property is no longer pending
        const upsertedOrder = await upsertOrderForProperty({
          propertyId: updatedProperty.id,
          propertyTitle: updatedProperty.title,
          propertyStatus: String(p?.status ?? "pending"),
          statusNote: typeof p?.statusNote === "string" ? p.statusNote : undefined,
          customerName: typeof p?.customerName === "string" ? p.customerName : undefined,
          customerPhone: typeof p?.customerPhone === "string" ? p.customerPhone : undefined,
          customerEmail: typeof p?.customerEmail === "string" ? p.customerEmail : undefined,
        });

        // Auto-create transaction when property is marked as sold/rented
        if (upsertedOrder?.status === "completed") {
          try {
            const existing = await getTransactionByOrderId(upsertedOrder.id);
            if (!existing) {
              await createTransaction({
                orderId: upsertedOrder.id,
                propertyId: updatedProperty.id,
                propertyTitle: updatedProperty.title,
                propertyType: updatedProperty.type,
                propertyLocation: updatedProperty.location,
                buyerName: upsertedOrder.customerName,
                buyerPhone: upsertedOrder.customerPhone,
                sellerId: updatedProperty.sellerId,
                price: updatedProperty.price,
                status: "completed",
              });
            }
          } catch (txError) {
            console.error("[properties:updateStatus] auto-create transaction failed", txError);
          }
        }

        return NextResponse.json({ ok: true, data: updatedProperty });
      }

      case "properties:delete": {
        const id = Number((payload as { id?: unknown } | undefined)?.id);
        await deleteProperty(id);
        return NextResponse.json({ ok: true, data: { id } });
      }

      case "orders:list": {
        const sellerId = Number((payload as { sellerId?: unknown } | undefined)?.sellerId);
        return NextResponse.json({
          ok: true,
          data: await listOrders(Number.isInteger(sellerId) && sellerId > 0 ? { sellerId } : undefined),
        });
      }

      case "orders:create":
        return NextResponse.json({ ok: true, data: await createOrder(payload) });

      case "orders:update": {
        const id = Number((payload as { id?: unknown } | undefined)?.id);
        const updatedOrder = await updateOrder(id, payload);

        if (updatedOrder.status === "completed") {
          // Sync property status
          if (updatedOrder.propertyId) {
            await updateProperty(updatedOrder.propertyId, { id: updatedOrder.propertyId, status: "success" });
          }

          // Auto-create transaction if one doesn't exist yet for this order
          try {
            const existing = await getTransactionByOrderId(updatedOrder.id);
            if (!existing) {
              const property = updatedOrder.propertyId ? await getPropertyById(updatedOrder.propertyId) : undefined;
              await createTransaction({
                orderId: updatedOrder.id,
                propertyId: updatedOrder.propertyId,
                propertyTitle: updatedOrder.propertyTitle,
                propertyType: property?.type,
                propertyLocation: property?.location,
                buyerName: updatedOrder.customerName,
                buyerPhone: updatedOrder.customerPhone,
                sellerId: property?.sellerId,
                price: property?.price,
                status: "completed",
              });
            }
          } catch (txError) {
            console.error("[orders:update] auto-create transaction failed for order", updatedOrder.id, txError);
          }
        }

        return NextResponse.json({ ok: true, data: updatedOrder });
      }

      case "orders:delete": {
        const id = Number((payload as { id?: unknown } | undefined)?.id);
        await deleteOrder(id);
        return NextResponse.json({ ok: true, data: { id } });
      }

      case "transactions:list": {
        const sellerId = Number((payload as { sellerId?: unknown } | undefined)?.sellerId);
        return NextResponse.json({
          ok: true,
          data: await listTransactions(Number.isInteger(sellerId) && sellerId > 0 ? { sellerId } : undefined),
        });
      }

      case "transactions:create":
        return NextResponse.json({ ok: true, data: await createTransaction(payload) });

      // ── Inquiry: create order from public property detail page ──
      case "orders:createInquiry": {
        const p = payload as {
          propertyId?: number;
          propertyTitle?: string;
          customerName?: string;
          customerPhone?: string;
          customerEmail?: string;
          notes?: string;
        } | undefined;

        const order = await createOrder({
          propertyId: p?.propertyId,
          propertyTitle: p?.propertyTitle ?? "",
          customerName: p?.customerName ?? "ไม่ระบุ",
          customerPhone: p?.customerPhone,
          customerEmail: p?.customerEmail,
          notes: p?.notes,
          status: "pending",
        });

        // Notify admin + seller who owns this property
        const notifTitle = `ต้องการจองคิวดูบ้าน: ${p?.propertyTitle ?? "บ้าน"}`;
        const notifMsg = `${p?.customerName ?? ""} (${p?.customerPhone ?? ""}) ต้องการจองคิวดูบ้าน${p?.notes ? `\nหมายเหตุ: ${p.notes}` : ""}`;

        // Get all admin users + the property's seller
        const allUsers = await listUsers();
        const property = p?.propertyId ? await getPropertyById(p.propertyId).catch(() => null) : null;
        const recipientIds = new Set<number>();
        for (const u of allUsers) {
          if (u.role === "admin") recipientIds.add(u.id);
        }
        if (property?.sellerId) recipientIds.add(property.sellerId);

        await Promise.all(
          Array.from(recipientIds).map((uid) =>
            createNotification({
              type: "inquiry",
              title: notifTitle,
              message: notifMsg,
              propertyId: p?.propertyId,
              orderId: order.id,
              recipientUserId: uid,
            }),
          ),
        );

        return NextResponse.json({ ok: true, data: order });
      }

      // ── Notifications ─────────────────────────────────────────
      case "notifications:list": {
        const recipientUserId = Number((payload as { recipientUserId?: unknown } | undefined)?.recipientUserId);
        const data = await listNotifications(Number.isFinite(recipientUserId) && recipientUserId > 0 ? recipientUserId : undefined);
        const unread = data.filter((n) => !n.isRead).length;
        return NextResponse.json({ ok: true, data, unread });
      }

      case "notifications:unread-count": {
        const recipientUserId = Number((payload as { recipientUserId?: unknown } | undefined)?.recipientUserId);
        const count = await countUnread(Number.isFinite(recipientUserId) && recipientUserId > 0 ? recipientUserId : undefined);
        return NextResponse.json({ ok: true, data: count });
      }

      case "notifications:mark-read": {
        const id = Number((payload as { id?: unknown } | undefined)?.id);
        await markNotificationRead(id);
        return NextResponse.json({ ok: true, data: { id } });
      }

      case "notifications:mark-all-read": {
        const recipientUserId = Number((payload as { recipientUserId?: unknown } | undefined)?.recipientUserId);
        await markAllRead(Number.isFinite(recipientUserId) && recipientUserId > 0 ? recipientUserId : undefined);
        return NextResponse.json({ ok: true });
      }

      case "notifications:clear-all": {
        const recipientUserId = Number((payload as { recipientUserId?: unknown } | undefined)?.recipientUserId);
        await deleteAllNotifications(Number.isFinite(recipientUserId) && recipientUserId > 0 ? recipientUserId : undefined);
        return NextResponse.json({ ok: true });
      }

      case "graph:data": {
        const p = payload as { metric?: unknown; range?: unknown; sellerId?: unknown };
        const validMetrics: GraphMetric[] = ["seller-added", "member-signup", "total-sales"];
        const validRanges: GraphRange[] = ["day", "week", "month"];
        const metric = validMetrics.includes(p.metric as GraphMetric) ? (p.metric as GraphMetric) : "seller-added";
        const graphRange = validRanges.includes(p.range as GraphRange) ? (p.range as GraphRange) : "week";
        const sellerId = Number(p.sellerId);
        const points = await getGraphData(
          metric,
          graphRange,
          Number.isInteger(sellerId) && sellerId > 0 ? sellerId : undefined,
        );
        return NextResponse.json({ ok: true, data: points });
      }

      // ── Bookings ──────────────────────────────────────────
      case "bookings:listByProperty": {
        const propertyId = Number((payload as { propertyId?: unknown } | undefined)?.propertyId);
        if (!propertyId) return NextResponse.json({ ok: false, error: "propertyId จำเป็นต้องระบุ" }, { status: 400 });
        return NextResponse.json({ ok: true, data: await listBookingsByProperty(propertyId) });
      }

      case "bookings:takenSlots": {
        const propertyId = Number((payload as { propertyId?: unknown } | undefined)?.propertyId);
        if (!propertyId) return NextResponse.json({ ok: false, error: "propertyId จำเป็นต้องระบุ" }, { status: 400 });
        return NextResponse.json({ ok: true, data: await listTakenSlots(propertyId) });
      }

      case "bookings:list":
        return NextResponse.json({ ok: true, data: await listAllBookings() });

      case "bookings:create":
        return NextResponse.json({ ok: true, data: await createBooking(payload) });

      case "bookings:update": {
        const id = Number((payload as { id?: unknown } | undefined)?.id);
        return NextResponse.json({ ok: true, data: await updateBooking(id, payload) });
      }

      case "bookings:delete": {
        const id = Number((payload as { id?: unknown } | undefined)?.id);
        await deleteBooking(id);
        return NextResponse.json({ ok: true, data: { id } });
      }

      // ── Public booking from property detail page ──────────
      case "bookings:createFromPublic": {
        const p = payload as {
          propertyId?: number;
          propertyTitle?: string;
          memberId?: number;
          customerName?: string;
          customerPhone?: string;
          customerEmail?: string;
          bookingDate?: string;
          notes?: string;
        } | undefined;

        const booking = await createBooking({
          propertyId: p?.propertyId,
          propertyTitle: p?.propertyTitle ?? "",
          memberId: p?.memberId,
          customerName: p?.customerName ?? "ไม่ระบุ",
          customerPhone: p?.customerPhone,
          customerEmail: p?.customerEmail,
          bookingDate: p?.bookingDate,
          notes: p?.notes,
          status: "pending",
          isManual: false,
        });

        // Notify admin + seller
        const notifTitle = `ต้องการจองคิวดูบ้าน: ${p?.propertyTitle ?? "บ้าน"}`;
        const notifMsg = `${p?.customerName ?? ""} (${p?.customerPhone ?? ""}) ต้องการจองคิวดูบ้านวันที่ ${p?.bookingDate ? new Date(p.bookingDate).toLocaleString("th-TH") : ""}${p?.notes ? `\nหมายเหตุ: ${p.notes}` : ""}`;

        const allUsers = await listUsers();
        const property = p?.propertyId ? await getPropertyById(p.propertyId).catch(() => null) : null;
        const recipientIds = new Set<number>();
        for (const u of allUsers) {
          if (u.role === "admin") recipientIds.add(u.id);
        }
        if (property?.sellerId) recipientIds.add(property.sellerId);

        await Promise.all(
          Array.from(recipientIds).map((uid) =>
            createNotification({
              type: "inquiry",
              title: notifTitle,
              message: notifMsg,
              propertyId: p?.propertyId,
              recipientUserId: uid,
            }),
          ),
        );

        return NextResponse.json({ ok: true, data: booking });
      }

      default:
        return NextResponse.json({ ok: false, error: `unsupported event: ${event}` }, { status: 400 });
    }
  } catch (error) {
    return handleError(error);
  }
}
