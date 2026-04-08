"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { emit } from "@/lib/socket";
import {
  ArrowLeftIcon,
  UserGroupIcon,
  ClipboardIcon,
  CheckCircleIcon,
  XCircleIcon,
} from "../../components/Icons";

interface SellerUser {
  id: number;
  username: string;
  role: "admin" | "seller";
  fullName?: string;
  phone?: string;
  email?: string;
}

interface Transaction {
  id: number;
  transactionDate: string;
  propertyTitle: string;
  buyerName: string;
  price: number;
  commission: number;
  status: "completed" | "pending-transfer" | "cancelled";
}

interface Order {
  id: number;
  propertyTitle: string;
  customerName: string;
  status: "pending" | "contacted" | "negotiating" | "completed" | "cancelled";
  orderDate: string;
}

export default function SellerPerformancePage() {
  const params = useParams<{ id: string }>();
  const sellerId = Number(params.id);

  const [loading, setLoading] = useState(true);
  const [seller, setSeller] = useState<SellerUser | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    const load = async () => {
      setLoading(true);

      const [usersRes, txRes, orderRes] = await Promise.all([
        emit<SellerUser[]>("users:list"),
        emit<Transaction[]>("transactions:list", { sellerId }),
        emit<Order[]>("orders:list", { sellerId }),
      ]);

      if (usersRes.ok && usersRes.data) {
        const found = usersRes.data.find((u) => u.id === sellerId && u.role === "seller") ?? null;
        setSeller(found);
      }

      if (txRes.ok && txRes.data) setTransactions(txRes.data);
      if (orderRes.ok && orderRes.data) setOrders(orderRes.data);

      setLoading(false);
    };

    if (!Number.isNaN(sellerId)) load();
  }, [sellerId]);

  const summary = useMemo(() => {
    const totalSales = transactions.reduce((sum, t) => sum + t.price, 0);
    const totalCommission = transactions.reduce((sum, t) => sum + t.commission, 0);
    const txSuccess = transactions.filter((t) => t.status === "completed").length;
    const txFailure = transactions.filter((t) => t.status === "cancelled").length;
    const txPending = transactions.filter((t) => t.status === "pending-transfer").length;

    const orderSuccess = orders.filter((o) => o.status === "completed").length;
    const orderFailure = orders.filter((o) => o.status === "cancelled").length;
    const orderPending = orders.filter((o) => ["pending", "contacted", "negotiating"].includes(o.status)).length;

    return {
      totalSales,
      totalCommission,
      txSuccess,
      txFailure,
      txPending,
      orderSuccess,
      orderFailure,
      orderPending,
    };
  }, [transactions, orders]);

  const formatPrice = (n: number) => `฿${new Intl.NumberFormat("th-TH").format(n)}`;

  return (
    <div className="min-h-screen bg-white p-6 md:p-10 font-sans">
      <div className="mb-10 flex items-start gap-4">
        <Link href="/admin/users" className="mt-1 p-2.5 text-neutral-400 hover:text-black hover:bg-neutral-50 border border-neutral-100 rounded-2xl transition-all">
          <ArrowLeftIcon className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="text-3xl font-light tracking-tight text-black mb-1">สรุปผลการขายของคนขาย</h1>
          <p className="text-sm text-neutral-500 tracking-wide">
            {loading ? "กำลังโหลด..." : seller ? `${seller.fullName ?? seller.username} (@${seller.username})` : "ไม่พบข้อมูลคนขาย"}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {[
          { label: "ยอดขายรวม", value: loading ? "—" : formatPrice(summary.totalSales), sub: "Transactions" },
          { label: "ค่าคอมรวม", value: loading ? "—" : formatPrice(summary.totalCommission), sub: "Commission" },
          { label: "ธุรกรรมสำเร็จ", value: loading ? "—" : summary.txSuccess, sub: "Success" },
          { label: "ธุรกรรมไม่สำเร็จ", value: loading ? "—" : summary.txFailure, sub: "Failure" },
        ].map((s, i) => (
          <div key={i} className="bg-white border border-neutral-100 p-6 rounded-3xl shadow-[0_2px_20px_-4px_rgba(0,0,0,0.04)]">
            <p className="text-neutral-500 text-xs tracking-wider uppercase mb-2">{s.label}</p>
            <p className="text-2xl font-light text-black tracking-tight mb-1">{s.value}</p>
            <p className="text-neutral-400 text-xs">{s.sub}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white border border-neutral-100 rounded-3xl p-6 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)]">
          <h2 className="text-sm font-semibold text-black tracking-wide uppercase mb-4">สถานะธุรกรรม</h2>
          <div className="space-y-3">
            <StatusRow label="สำเร็จ" value={summary.txSuccess} colorClass="bg-emerald-500" icon={<CheckCircleIcon className="w-4 h-4 text-emerald-600" />} />
            <StatusRow label="รอโอน" value={summary.txPending} colorClass="bg-amber-500" icon={<ClipboardIcon className="w-4 h-4 text-amber-600" />} />
            <StatusRow label="ยกเลิก" value={summary.txFailure} colorClass="bg-red-500" icon={<XCircleIcon className="w-4 h-4 text-red-600" />} />
          </div>
        </div>

        <div className="bg-white border border-neutral-100 rounded-3xl p-6 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)]">
          <h2 className="text-sm font-semibold text-black tracking-wide uppercase mb-4">สถานะออร์เดอร์</h2>
          <div className="space-y-3">
            <StatusRow label="สำเร็จ" value={summary.orderSuccess} colorClass="bg-emerald-500" icon={<CheckCircleIcon className="w-4 h-4 text-emerald-600" />} />
            <StatusRow label="ค้างดำเนินการ" value={summary.orderPending} colorClass="bg-neutral-700" icon={<ClipboardIcon className="w-4 h-4 text-neutral-600" />} />
            <StatusRow label="ยกเลิก" value={summary.orderFailure} colorClass="bg-red-500" icon={<XCircleIcon className="w-4 h-4 text-red-600" />} />
          </div>
        </div>
      </div>

      <div className="bg-white border border-neutral-100 rounded-3xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)] overflow-hidden">
        <div className="px-6 py-5 border-b border-neutral-100 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-black tracking-wide uppercase">ประวัติการขายล่าสุด</h2>
          <span className="text-xs text-neutral-400 bg-neutral-50 border border-neutral-100 px-3 py-1 rounded-full">
            {loading ? "—" : `${transactions.length} รายการ`}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-neutral-100/50">
                {[
                  "วันที่",
                  "อสังหาฯ",
                  "ผู้ซื้อ",
                  "มูลค่า",
                  "ค่าคอม",
                  "สถานะ",
                ].map((h) => (
                  <th key={h} className="px-6 py-4 text-left text-xs font-semibold text-neutral-400 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100/50">
              {loading ? (
                [0, 1, 2].map((i) => (
                  <tr key={i}><td colSpan={6} className="px-6 py-4"><div className="h-8 bg-neutral-50 rounded-xl animate-pulse" /></td></tr>
                ))
              ) : transactions.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-sm text-neutral-400">ยังไม่มีข้อมูลการขาย</td>
                </tr>
              ) : (
                transactions.map((t) => (
                  <tr key={t.id} className="hover:bg-neutral-50/50 transition-colors">
                    <td className="px-6 py-4 text-sm text-neutral-500">{t.transactionDate}</td>
                    <td className="px-6 py-4 text-sm font-medium text-black">{t.propertyTitle}</td>
                    <td className="px-6 py-4 text-sm text-neutral-600">{t.buyerName}</td>
                    <td className="px-6 py-4 text-sm text-black">{formatPrice(t.price)}</td>
                    <td className="px-6 py-4 text-sm text-emerald-600">{formatPrice(t.commission)}</td>
                    <td className="px-6 py-4 text-sm">
                      <span
                        className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium border ${
                          t.status === "completed"
                            ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                            : t.status === "pending-transfer"
                            ? "bg-amber-50 text-amber-600 border-amber-100"
                            : "bg-red-50 text-red-500 border-red-100"
                        }`}
                      >
                        {t.status === "completed" ? "สำเร็จ" : t.status === "pending-transfer" ? "รอโอน" : "ยกเลิก"}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {!loading && !seller && (
        <div className="mt-8 text-center py-12 border border-neutral-100 rounded-3xl bg-neutral-50">
          <div className="w-16 h-16 bg-white border border-neutral-100 rounded-3xl flex items-center justify-center mx-auto mb-4">
            <UserGroupIcon className="w-7 h-7 text-neutral-300" />
          </div>
          <p className="text-neutral-400 text-sm">ไม่พบข้อมูลคนขายที่เลือก</p>
        </div>
      )}
    </div>
  );
}

function StatusRow({
  label,
  value,
  colorClass,
  icon,
}: {
  label: string;
  value: number;
  colorClass: string;
  icon: React.ReactNode;
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <div className="text-sm text-neutral-600 flex items-center gap-2">
          {icon}
          <span>{label}</span>
        </div>
        <span className="text-sm font-medium text-black">{value}</span>
      </div>
      <div className="h-2 bg-neutral-100 rounded-full overflow-hidden">
        <div className={`h-full ${colorClass}`} style={{ width: `${Math.min(value * 10, 100)}%` }} />
      </div>
    </div>
  );
}
