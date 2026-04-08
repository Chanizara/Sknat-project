"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { emit } from "@/lib/socket";
import { useAuth } from "@/lib/auth";
import { ArrowLeftIcon, PhoneIcon, EmailIcon, ClipboardIcon, BuildingIcon } from "../components/Icons";

interface Order {
  id: number;
  propertyId?: number;
  propertyTitle: string;
  customerName: string;
  customerPhone?: string;
  customerEmail?: string;
  status: "pending" | "contacted" | "negotiating" | "completed" | "cancelled";
  orderDate: string;
  notes?: string;
}

const STATUS_LABEL: Record<string, string> = {
  pending: "รอดำเนินการ",
  contacted: "ติดต่อแล้ว",
  negotiating: "กำลังเจรจา",
  completed: "สำเร็จ",
  cancelled: "ยกเลิก",
};

const STATUS_STYLE: Record<string, string> = {
  pending: "bg-amber-50 text-amber-600 border-amber-100",
  contacted: "bg-neutral-50 text-neutral-600 border-neutral-200",
  negotiating: "bg-neutral-900 text-white border-neutral-900",
  completed: "bg-emerald-50 text-emerald-600 border-emerald-100",
  cancelled: "bg-red-50 text-red-500 border-red-100",
};

export default function OrdersPage() {
  const { user } = useAuth();
  const basePath = user?.role === "seller" ? "/seller" : "/admin";
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [noteText, setNoteText] = useState("");
  const [newStatus, setNewStatus] = useState<Order["status"]>("pending");
  const [saving, setSaving] = useState(false);

  const loadOrders = async () => {
    const payload = user?.role === "seller" ? { sellerId: user.id } : {};
    const res = await emit<Order[]>("orders:list", payload);
    if (res.ok && res.data) setOrders(res.data);
    setLoading(false);
  };

  useEffect(() => { if (user) loadOrders(); }, [user]);

  const filteredOrders = orders.filter((o) => filterStatus === "all" || o.status === filterStatus);

  const openManage = (o: Order) => {
    setSelectedOrder(o);
    setNewStatus(o.status);
    setNoteText(o.notes ?? "");
  };

  const handleUpdate = async () => {
    if (!selectedOrder) return;
    setSaving(true);
    await emit("orders:update", { id: selectedOrder.id, status: newStatus, notes: noteText });
    setSaving(false);
    setSelectedOrder(null);
    loadOrders();
  };

  const formatPrice = (n: number) => new Intl.NumberFormat("th-TH").format(n);

  const statCounts = {
    pending: orders.filter(o => o.status === "pending").length,
    contacted: orders.filter(o => o.status === "contacted").length,
    negotiating: orders.filter(o => o.status === "negotiating").length,
    completed: orders.filter(o => o.status === "completed").length,
  };

  return (
    <div className="min-h-screen bg-white p-6 md:p-10 font-sans">
      {/* Header */}
      <div className="mb-10 flex items-start gap-4">
          <Link href={basePath} className="mt-1 p-2.5 text-neutral-400 hover:text-black hover:bg-neutral-50 border border-neutral-100 rounded-2xl transition-all">
          <ArrowLeftIcon className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="text-3xl font-light tracking-tight text-black mb-1">ออร์เดอร์</h1>
          <p className="text-sm text-neutral-500 tracking-wide">จัดการคำร้องขอซื้อ-เช่าอสังหาฯ</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {[
          { label: "รอดำเนินการ", value: statCounts.pending, sub: "Pending" },
          { label: "ติดต่อแล้ว", value: statCounts.contacted, sub: "Contacted" },
          { label: "กำลังเจรจา", value: statCounts.negotiating, sub: "Negotiating" },
          { label: "สำเร็จ", value: statCounts.completed, sub: "Completed" },
        ].map((s, i) => (
          <div key={i} className="bg-white border border-neutral-100 p-6 rounded-3xl shadow-[0_2px_20px_-4px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-300">
            <p className="text-neutral-500 text-xs tracking-wider uppercase mb-2">{s.label}</p>
            <p className="text-3xl font-light text-black tracking-tight mb-1">{loading ? "—" : s.value}</p>
            <p className="text-neutral-400 text-xs">{s.sub}</p>
          </div>
        ))}
      </div>

      {/* Filter */}
      <div className="bg-white border border-neutral-100 rounded-3xl p-5 mb-6 shadow-[0_2px_20px_-4px_rgba(0,0,0,0.04)]">
        <div className="flex items-center gap-3">
          <label className="text-xs font-semibold text-neutral-500 uppercase tracking-wider shrink-0">กรองสถานะ</label>
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2.5 bg-neutral-50 border border-neutral-100 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-black/10 transition-all">
            <option value="all">ทั้งหมด</option>
            {Object.entries(STATUS_LABEL).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
          </select>
        </div>
      </div>

      {/* List */}
      <div className="space-y-4">
        {loading ? (
          [0,1,2].map(i => <div key={i} className="h-36 bg-neutral-50 border border-neutral-100 rounded-3xl animate-pulse" />)
        ) : (
          filteredOrders.map((o) => (
            <div key={o.id} className="bg-white border border-neutral-100 rounded-3xl p-6 shadow-[0_2px_20px_-4px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.06)] transition-all duration-300">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${STATUS_STYLE[o.status]}`}>
                      {STATUS_LABEL[o.status]}
                    </span>
                    <span className="text-xs text-neutral-400 bg-neutral-50 border border-neutral-100 px-2.5 py-1 rounded-full">#{o.id}</span>
                    <span className="text-xs text-neutral-400">{o.orderDate}</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-3">ข้อมูลอสังหาฯ</p>
                      <div className="flex items-center gap-2 mb-1">
                        <BuildingIcon className="w-4 h-4 text-neutral-300" />
                        <span className="text-sm font-medium text-black">{o.propertyTitle || "—"}</span>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-3">ข้อมูลลูกค้า</p>
                      <div className="text-sm font-medium text-black mb-1">{o.customerName}</div>
                      {o.customerPhone && (
                        <div className="flex items-center gap-2"><PhoneIcon className="w-3.5 h-3.5 text-neutral-300" />
                          <a href={`tel:${o.customerPhone}`} className="text-xs text-neutral-500 hover:text-black">{o.customerPhone}</a>
                        </div>
                      )}
                      {o.customerEmail && (
                        <div className="flex items-center gap-2 mt-1"><EmailIcon className="w-3.5 h-3.5 text-neutral-300" />
                          <a href={`mailto:${o.customerEmail}`} className="text-xs text-neutral-500 hover:text-black">{o.customerEmail}</a>
                        </div>
                      )}
                    </div>
                  </div>
                  {o.notes && (
                    <div className="mt-4 p-3 bg-neutral-50 border border-neutral-100 rounded-2xl text-xs text-neutral-500">
                      <span className="font-medium text-neutral-700">หมายเหตุ: </span>{o.notes}
                    </div>
                  )}
                </div>
                <div className="ml-4">
                  <button onClick={() => openManage(o)} className="px-4 py-2.5 bg-black text-white text-sm font-medium rounded-2xl hover:bg-neutral-800 transition-all">
                    จัดการ
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {!loading && filteredOrders.length === 0 && (
        <div className="text-center py-16">
          <div className="w-16 h-16 bg-neutral-50 border border-neutral-100 rounded-3xl flex items-center justify-center mx-auto mb-4">
            <ClipboardIcon className="w-7 h-7 text-neutral-300" />
          </div>
          <p className="text-neutral-400 text-sm">ไม่พบออร์เดอร์</p>
        </div>
      )}

      {/* Manage Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-8 shadow-2xl border border-neutral-100">
            <h3 className="text-xl font-light text-black mb-6">จัดการออร์เดอร์ #{selectedOrder.id}</h3>
            <div className="mb-5">
              <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-2">เปลี่ยนสถานะ</label>
              <select value={newStatus} onChange={(e) => setNewStatus(e.target.value as Order["status"])}
                className="w-full px-4 py-3 bg-neutral-50 border border-neutral-100 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-black/10 transition-all">
                {Object.entries(STATUS_LABEL).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
              </select>
            </div>
            <div className="mb-6">
              <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-2">หมายเหตุ</label>
              <textarea rows={4} value={noteText} onChange={(e) => setNoteText(e.target.value)} placeholder="บันทึกรายละเอียด..."
                className="w-full px-4 py-3 bg-neutral-50 border border-neutral-100 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-black/10 transition-all resize-none" />
            </div>
            <div className="flex gap-3">
              <button onClick={() => setSelectedOrder(null)} className="flex-1 px-4 py-2.5 text-sm font-medium text-neutral-600 hover:bg-neutral-50 border border-neutral-100 rounded-2xl transition-all">ปิด</button>
              <button onClick={handleUpdate} disabled={saving} className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-black hover:bg-neutral-800 rounded-2xl transition-all disabled:opacity-50">
                {saving ? "กำลังบันทึก..." : "บันทึก"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
