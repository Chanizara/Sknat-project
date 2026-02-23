"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeftIcon,
  PhoneIcon,
  EmailIcon,
  ClipboardIcon,
  CheckCircleIcon,
  XCircleIcon,
  BuildingIcon,
} from "../components/Icons";

interface Order {
  id: number;
  propertyTitle: string;
  propertyType: string;
  price: number;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  status: "pending" | "contacted" | "negotiating" | "completed" | "cancelled";
  orderDate: string;
  notes?: string;
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([
    {
      id: 1,
      propertyTitle: "บ้านเดี่ยว 2 ชั้น ใกล้ BTS",
      propertyType: "บ้านเดี่ยว",
      price: 5900000,
      customerName: "วิชัย มั่งมี",
      customerPhone: "081-111-2222",
      customerEmail: "wichai@gmail.com",
      status: "pending",
      orderDate: "2024-03-01",
      notes: "สนใจนัดดูบ้านในวันเสาร์",
    },
    {
      id: 2,
      propertyTitle: "คอนโดหรู วิวแม่น้ำ",
      propertyType: "คอนโด",
      price: 3200000,
      customerName: "สุดา รุ่งเรือง",
      customerPhone: "089-333-4444",
      customerEmail: "suda@gmail.com",
      status: "contacted",
      orderDate: "2024-02-28",
      notes: "ติดต่อแล้ว กำลังพิจารณาสินเชื่อ",
    },
  ]);

  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const filteredOrders = orders.filter(
    (order) => filterStatus === "all" || order.status === filterStatus
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-amber-50 text-amber-600 border-amber-100";
      case "contacted":
        return "bg-blue-50 text-blue-600 border-blue-100";
      case "negotiating":
        return "bg-purple-50 text-purple-600 border-purple-100";
      case "completed":
        return "bg-emerald-50 text-emerald-600 border-emerald-100";
      case "cancelled":
        return "bg-red-50 text-red-600 border-red-100";
      default:
        return "bg-slate-50 text-slate-600 border-slate-100";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "pending":
        return "รอดำเนินการ";
      case "contacted":
        return "ติดต่อแล้ว";
      case "negotiating":
        return "กำลังเจรจา";
      case "completed":
        return "สำเร็จ";
      case "cancelled":
        return "ยกเลิก";
      default:
        return status;
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("th-TH").format(price);
  };

  const updateOrderStatus = (
    orderId: number,
    newStatus: Order["status"]
  ) => {
    setOrders(
      orders.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
    );
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-xl border-b border-blue-100/50 sticky top-0 z-20">
        <div className="max-w-[1600px] mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href="/admin"
                className="p-2.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
              >
                <ArrowLeftIcon className="w-5 h-5" />
              </Link>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-slate-800 to-blue-900 bg-clip-text text-transparent">
                  ตรวจสอบข้อมูลการสั่งซื้อ
                </h1>
                <p className="text-xs text-slate-400">
                  จัดการคำร้องขอซื้ออสังหาฯ จากลูกค้า
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-[1600px] mx-auto px-6 py-6">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <StatCard
            count={orders.filter((o) => o.status === "pending").length}
            label="รอดำเนินการ"
            color="amber"
          />
          <StatCard
            count={orders.filter((o) => o.status === "contacted").length}
            label="ติดต่อแล้ว"
            color="blue"
          />
          <StatCard
            count={orders.filter((o) => o.status === "negotiating").length}
            label="กำลังเจรจา"
            color="purple"
          />
          <StatCard
            count={orders.filter((o) => o.status === "completed").length}
            label="สำเร็จ"
            color="emerald"
          />
        </div>

        {/* Filter */}
        <div className="bg-white rounded-2xl p-4 mb-6 premium-shadow">
          <div className="flex items-center gap-3">
            <label className="text-sm font-medium text-slate-600">
              กรองตามสถานะ:
            </label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all"
            >
              <option value="all">ทั้งหมด</option>
              <option value="pending">รอดำเนินการ</option>
              <option value="contacted">ติดต่อแล้ว</option>
              <option value="negotiating">กำลังเจรจา</option>
              <option value="completed">สำเร็จ</option>
              <option value="cancelled">ยกเลิก</option>
            </select>
          </div>
        </div>

        {/* Orders List */}
        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <div
              key={order.id}
              className="bg-white rounded-2xl p-5 premium-shadow hover:premium-shadow-hover transition-all"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <span
                      className={`px-2.5 py-1 rounded-md text-xs font-medium border ${getStatusColor(
                        order.status
                      )}`}
                    >
                      {getStatusText(order.status)}
                    </span>
                    <span className="text-xs text-slate-400">
                      รหัส: #{order.id}
                    </span>
                    <span className="text-xs text-slate-400">
                      {order.orderDate}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Property Info */}
                    <div>
                      <h3 className="text-sm font-semibold text-slate-900 mb-2">
                        ข้อมูลอสังหาฯ
                      </h3>
                      <div className="space-y-1 text-sm">
                        <div className="flex items-center gap-2">
                          <BuildingIcon className="w-4 h-4 text-slate-400" />
                          <span className="text-slate-600">
                            {order.propertyTitle}
                          </span>
                        </div>
                        <div className="text-slate-500 ml-6">
                          ประเภท: {order.propertyType}
                        </div>
                        <div className="text-slate-900 font-medium ml-6">
                          ฿{formatPrice(order.price)}
                        </div>
                      </div>
                    </div>

                    {/* Customer Info */}
                    <div>
                      <h3 className="text-sm font-semibold text-slate-900 mb-2">
                        ข้อมูลลูกค้า
                      </h3>
                      <div className="space-y-1 text-sm">
                        <div className="font-medium text-slate-900">
                          {order.customerName}
                        </div>
                        <div className="flex items-center gap-2">
                          <PhoneIcon className="w-3.5 h-3.5 text-slate-400" />
                          <a
                            href={`tel:${order.customerPhone}`}
                            className="text-slate-600 hover:text-slate-900"
                          >
                            {order.customerPhone}
                          </a>
                        </div>
                        <div className="flex items-center gap-2">
                          <EmailIcon className="w-3.5 h-3.5 text-slate-400" />
                          <a
                            href={`mailto:${order.customerEmail}`}
                            className="text-slate-600 hover:text-slate-900"
                          >
                            {order.customerEmail}
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>

                  {order.notes && (
                    <div className="mt-4 p-3 bg-slate-50 rounded-lg text-sm">
                      <span className="font-medium text-slate-700">
                        หมายเหตุ:{" "}
                      </span>
                      <span className="text-slate-600">{order.notes}</span>
                    </div>
                  )}
                </div>

                <div className="ml-4">
                  <button
                    onClick={() => setSelectedOrder(order)}
                    className="px-4 py-2 bg-slate-900 text-white text-sm font-medium rounded-xl hover:bg-slate-800 transition"
                  >
                    จัดการ
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredOrders.length === 0 && (
          <div className="text-center py-12 text-slate-400 text-sm">
            ไม่พบข้อมูลคำสั่งซื้อ
          </div>
        )}
      </main>

      {/* Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-blue-950/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-slate-900 mb-6">
              จัดการคำสั่งซื้อ #{selectedOrder.id}
            </h3>

            <div className="mb-6">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                เปลี่ยนสถานะ
              </label>
              <select
                value={selectedOrder.status}
                onChange={(e) =>
                  updateOrderStatus(
                    selectedOrder.id,
                    e.target.value as Order["status"]
                  )
                }
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all"
              >
                <option value="pending">รอดำเนินการ</option>
                <option value="contacted">ติดต่อแล้ว</option>
                <option value="negotiating">กำลังเจรจา</option>
                <option value="completed">สำเร็จ</option>
                <option value="cancelled">ยกเลิก</option>
              </select>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                เพิ่มหมายเหตุ
              </label>
              <textarea
                rows={4}
                defaultValue={selectedOrder.notes}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all resize-none"
                placeholder="บันทึกรายละเอียดการติดต่อ..."
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setSelectedOrder(null)}
                className="flex-1 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 rounded-xl transition"
              >
                ปิด
              </button>
              <button
                onClick={() => setSelectedOrder(null)}
                className="flex-1 px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl shadow-lg shadow-blue-500/25 hover:shadow-xl transition"
              >
                บันทึก
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({
  count,
  label,
  color,
}: {
  count: number;
  label: string;
  color: string;
}) {
  const colorClasses: Record<string, string> = {
    amber: "text-amber-600",
    blue: "text-blue-600",
    purple: "text-purple-600",
    emerald: "text-emerald-600",
  };

  return (
    <div className="bg-white rounded-2xl p-4 premium-shadow">
      <div className="text-xs text-slate-400 mb-1">{label}</div>
      <div className={`text-2xl font-semibold ${colorClasses[color]}`}>
        {count}
      </div>
    </div>
  );
}
