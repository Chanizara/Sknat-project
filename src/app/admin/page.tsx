"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth";
import { emit } from "@/lib/socket";
import {
  UserGroupIcon,
  MembersIcon,
  BuildingIcon,
  ClipboardIcon,
  TrendingUpIcon,
  ArrowUpIcon,
} from "./components/Icons";

interface DashboardStats {
  totalUsers: number;
  totalMembers: number;
  totalProperties: number;
  pendingOrders: number;
  todaySales: number;
  newListings: number;
  recentActivity: {
    type: string;
    title: string;
    description: string;
    time: string;
  }[];
}

type GraphMetric = "seller-added" | "member-signup" | "total-sales";
type GraphRange = "day" | "week" | "month";

interface SellerCreatedItem {
  id: number;
  role: "admin" | "seller";
  createdAt: string;
}

interface MemberCreatedItem {
  id: number;
  createdAt: string;
}

interface TransactionItem {
  id: number;
  transactionDate: string;
  price: number;
  status?: "completed" | "pending-transfer" | "cancelled";
}

interface PropertyCreatedItem {
  id: number;
  createdAt: string;
}

interface GraphPoint {
  label: string;
  value: number;
}

function StatCard({
  title,
  value,
  subtext,
  change,
  icon: Icon,
}: {
  title: string;
  value: string | number;
  subtext: string;
  change: string;
  icon: React.ElementType;
}) {
  return (
    <div className="group bg-white border border-neutral-100 p-6 rounded-3xl shadow-[0_2px_20px_-4px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between h-full">
      <div className="flex items-start justify-between mb-4">
        <div className="w-12 h-12 border border-neutral-100 bg-neutral-50/50 rounded-2xl flex items-center justify-center group-hover:bg-black group-hover:border-black transition-colors duration-300">
          <Icon className="w-5 h-5 text-neutral-600 group-hover:text-white transition-colors" />
        </div>
        <div className="flex items-center gap-1 bg-neutral-50 px-2.5 py-1 rounded-full border border-neutral-100">
          <TrendingUpIcon className="w-3.5 h-3.5 text-neutral-500" />
          <span className="text-[11px] font-semibold text-neutral-600">{change}</span>
        </div>
      </div>
      <div>
        <p className="text-neutral-500 text-xs tracking-wider uppercase mb-1.5">{title}</p>
        <p className="text-4xl font-light text-black tracking-tight mb-2">{value}</p>
        <p className="text-neutral-400 text-xs">{subtext}</p>
      </div>
    </div>
  );
}

function toDate(value: string): Date {
  return new Date(value.includes("T") ? value : `${value}T00:00:00`);
}

function buildGraphPoints(
  metric: GraphMetric,
  range: GraphRange,
  sellerRows: SellerCreatedItem[],
  memberRows: MemberCreatedItem[],
  transactionRows: TransactionItem[],
): GraphPoint[] {
  const now = new Date();
  const points: GraphPoint[] = [];

  if (range === "day") {
    for (let h = 0; h < 24; h += 1) {
      points.push({ label: `${String(h).padStart(2, "0")}:00`, value: 0 });
    }

    if (metric === "seller-added") {
      sellerRows.forEach((s) => {
        if (s.role !== "seller") return;
        const d = toDate(s.createdAt);
        if (d.toDateString() !== now.toDateString()) return;
        points[d.getHours()].value += 1;
      });
    }

    if (metric === "member-signup") {
      memberRows.forEach((m) => {
        const d = toDate(m.createdAt);
        if (d.toDateString() !== now.toDateString()) return;
        points[d.getHours()].value += 1;
      });
    }

    if (metric === "total-sales") {
      transactionRows.forEach((t) => {
        const d = toDate(t.transactionDate);
        if (d.toDateString() !== now.toDateString()) return;
        points[d.getHours()].value += t.price ?? 0;
      });
    }
  }

  if (range === "week") {
    const labels = ["อา", "จ", "อ", "พ", "พฤ", "ศ", "ส"];
    const start = new Date(now);
    start.setDate(now.getDate() - 6);
    start.setHours(0, 0, 0, 0);

    for (let i = 0; i < 7; i += 1) {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      points.push({ label: labels[d.getDay()], value: 0 });
    }

    const toIndex = (d: Date) => {
      const p = new Date(d);
      p.setHours(0, 0, 0, 0);
      return Math.floor((p.getTime() - start.getTime()) / (24 * 60 * 60 * 1000));
    };

    if (metric === "seller-added") {
      sellerRows.forEach((s) => {
        if (s.role !== "seller") return;
        const i = toIndex(toDate(s.createdAt));
        if (i >= 0 && i < 7) points[i].value += 1;
      });
    }

    if (metric === "member-signup") {
      memberRows.forEach((m) => {
        const i = toIndex(toDate(m.createdAt));
        if (i >= 0 && i < 7) points[i].value += 1;
      });
    }

    if (metric === "total-sales") {
      transactionRows.forEach((t) => {
        const i = toIndex(toDate(t.transactionDate));
        if (i >= 0 && i < 7) points[i].value += t.price ?? 0;
      });
    }
  }

  if (range === "month") {
    const start = new Date(now);
    start.setDate(now.getDate() - 29);
    start.setHours(0, 0, 0, 0);

    for (let i = 0; i < 30; i += 1) {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      points.push({ label: `${d.getDate()}`, value: 0 });
    }

    const toIndex = (d: Date) => {
      const p = new Date(d);
      p.setHours(0, 0, 0, 0);
      return Math.floor((p.getTime() - start.getTime()) / (24 * 60 * 60 * 1000));
    };

    if (metric === "seller-added") {
      sellerRows.forEach((s) => {
        if (s.role !== "seller") return;
        const i = toIndex(toDate(s.createdAt));
        if (i >= 0 && i < 30) points[i].value += 1;
      });
    }

    if (metric === "member-signup") {
      memberRows.forEach((m) => {
        const i = toIndex(toDate(m.createdAt));
        if (i >= 0 && i < 30) points[i].value += 1;
      });
    }

    if (metric === "total-sales") {
      transactionRows.forEach((t) => {
        const i = toIndex(toDate(t.transactionDate));
        if (i >= 0 && i < 30) points[i].value += t.price ?? 0;
      });
    }
  }

  return points;
}

export default function AdminDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [metric, setMetric] = useState<GraphMetric>("seller-added");
  const [range, setRange] = useState<GraphRange>("week");
  const [sellerRows, setSellerRows] = useState<SellerCreatedItem[]>([]);
  const [memberRows, setMemberRows] = useState<MemberCreatedItem[]>([]);
  const [transactionRows, setTransactionRows] = useState<TransactionItem[]>([]);

  useEffect(() => {
    const sellerId = user?.role === "seller" ? user.id : undefined;
    emit<DashboardStats>("dashboard:stats", sellerId ? { sellerId } : {}).then((res) => {
      if (res.ok && res.data) setStats(res.data);
      setLoading(false);
    });

    if (user?.role === "admin") {
      emit<SellerCreatedItem[]>("users:list").then((res) => {
        if (res.ok && res.data) setSellerRows(res.data);
      });
      emit<MemberCreatedItem[]>("members:list").then((res) => {
        if (res.ok && res.data) setMemberRows(res.data);
      });
      emit<TransactionItem[]>("transactions:list").then((res) => {
        if (res.ok && res.data) setTransactionRows(res.data);
      });
    }

    if (user?.role === "seller") {
      emit<PropertyCreatedItem[]>("properties:list", { sellerId: user.id }).then((res) => {
        if (res.ok && res.data) {
          setSellerRows(res.data.map((p) => ({ id: p.id, role: "seller", createdAt: p.createdAt })));
        }
      });
      emit<MemberCreatedItem[]>("members:list", { sellerId: user.id }).then((res) => {
        if (res.ok && res.data) setMemberRows(res.data);
      });
      emit<TransactionItem[]>("transactions:list", { sellerId: user.id }).then((res) => {
        if (res.ok && res.data) setTransactionRows(res.data);
      });
    }
  }, [user]);

  const isAdmin = user?.role === "admin";
  const basePath = user?.role === "seller" ? "/seller" : "/admin";

  const formatPrice = (n: number) =>
    n >= 1_000_000
      ? `฿${(n / 1_000_000).toFixed(1)}M`
      : `฿${new Intl.NumberFormat("th-TH").format(n)}`;

  const statCards = isAdmin
    ? [
        { title: "เจ้าหน้าที่", value: stats?.totalUsers ?? "—", subtext: "ผู้ดูแลระบบ", change: "+5", icon: UserGroupIcon },
        { title: "สมาชิก", value: stats?.totalMembers ?? "—", subtext: "ลูกค้าที่ลงทะเบียน", change: "+12", icon: MembersIcon },
        { title: "อสังหาฯ", value: stats?.totalProperties ?? "—", subtext: "รายการทั้งหมด", change: "+8", icon: BuildingIcon },
        { title: "ออร์เดอร์", value: stats?.pendingOrders ?? "—", subtext: "รายการรอดำเนินการ", change: "+2", icon: ClipboardIcon },
      ]
    : [
        { title: "อสังหาฯ ของฉัน", value: stats?.totalProperties ?? "—", subtext: "รายการทั้งหมด", change: `+${stats?.newListings ?? 0}`, icon: BuildingIcon },
        { title: "ออร์เดอร์รอดำเนินการ", value: stats?.pendingOrders ?? "—", subtext: "รอดำเนินการ", change: "+2", icon: ClipboardIcon },
        { title: "ยอดขายรวม", value: stats ? formatPrice(stats.todaySales) : "—", subtext: "ทั้งหมด", change: "", icon: ArrowUpIcon },
        { title: "ประกาศใหม่เดือนนี้", value: stats?.newListings ?? "—", subtext: "เดือนนี้", change: "", icon: TrendingUpIcon },
      ];

  const now = new Date();
  const dateStr = now.toLocaleDateString("th-TH", { year: "numeric", month: "long", day: "numeric" });
  const graphPoints = buildGraphPoints(metric, range, sellerRows, memberRows, transactionRows);
  const maxValue = Math.max(...graphPoints.map((p) => p.value), 1);
  const graphTitle =
    metric === "seller-added"
      ? isAdmin ? "การเพิ่ม Seller" : "การเพิ่มอสังหา"
      : metric === "member-signup"
      ? "การสมัครสมาชิก"
      : "ยอดขายรวม";
  const metricUnit = metric === "total-sales" ? "บาท" : "รายการ";

  return (
    <div className="min-h-screen bg-white p-6 md:p-10 font-sans">
      {/* Header */}
      <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-light tracking-tight text-black mb-1">ภาพรวม</h1>
          <p className="text-sm text-neutral-500 tracking-wide">ระบบจัดการอสังหาริมทรัพย์</p>
        </div>
        <div className="flex items-center text-sm bg-neutral-50 px-4 py-2 border border-neutral-100 rounded-full">
          <span className="text-neutral-400 uppercase tracking-widest text-[10px] font-semibold mr-3">วันที่</span>
          <span className="text-black font-medium pb-0.5">{dateStr}</span>
        </div>
      </div>

      {/* Stats Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="bg-neutral-50 border border-neutral-100 rounded-3xl h-40 animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {statCards.map((card, i) => (
            <StatCard key={i} {...card} />
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 gap-8">
        <div className="bg-white border border-neutral-100 rounded-3xl p-6 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)]">
          <div className="flex flex-col gap-4 mb-5 md:flex-row md:items-center md:justify-between">
            <div>
              <h3 className="text-sm font-semibold text-black tracking-wide uppercase">กราฟภาพรวม</h3>
              <p className="text-xs text-neutral-500 mt-1">{graphTitle} · {range === "day" ? "รายวัน" : range === "week" ? "รายสัปดาห์" : "รายเดือน"}</p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Link
                href={`${basePath}/history`}
                className="px-3 py-1.5 rounded-full text-xs border border-neutral-200 bg-white text-neutral-600 hover:text-black hover:border-black transition-colors"
              >
                เปิดรายงาน
              </Link>
              <Link
                href={`${basePath}/history`}
                className="px-3 py-1.5 rounded-full text-xs border border-black bg-black text-white hover:bg-neutral-800 transition-colors"
              >
                ส่งออก PDF
              </Link>
            </div>
          </div>

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-5">
            <div className="flex flex-wrap gap-2">
              {[
                { key: "seller-added", label: isAdmin ? "การเพิ่ม seller" : "การเพิ่มอสังหา" },
                { key: "member-signup", label: "การสมัครสมาชิก" },
                { key: "total-sales", label: "ยอดขายรวม" },
              ].map((option) => (
                <button
                  key={option.key}
                  onClick={() => setMetric(option.key as GraphMetric)}
                  className={`px-3 py-1.5 rounded-full text-xs border transition-colors ${
                    metric === option.key
                      ? "bg-black text-white border-black"
                      : "bg-neutral-50 text-neutral-500 border-neutral-100 hover:text-black"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2">
              {[
                { key: "day", label: "วัน" },
                { key: "week", label: "สัปดาห์" },
                { key: "month", label: "เดือน" },
              ].map((option) => (
                <button
                  key={option.key}
                  onClick={() => setRange(option.key as GraphRange)}
                  className={`px-3 py-1.5 rounded-2xl text-xs border transition-colors ${
                    range === option.key
                      ? "bg-black text-white border-black"
                      : "bg-white text-neutral-500 border-neutral-100 hover:text-black"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          <div className="h-64 border border-neutral-100 rounded-2xl p-4 bg-neutral-50/50">
            <div className="h-full flex items-end gap-1 md:gap-2 overflow-x-auto">
              {graphPoints.map((point, index) => {
                const heightPercent = (point.value / maxValue) * 100;
                return (
                  <div key={`${point.label}-${index}`} className="min-w-7 flex-1 flex flex-col items-center justify-end gap-2">
                    <span className="text-[10px] text-neutral-500 whitespace-nowrap">
                      {metric === "total-sales" ? `฿${Math.round(point.value).toLocaleString("th-TH")}` : point.value}
                    </span>
                    <div className="w-full max-w-8 rounded-t-xl bg-black/90" style={{ height: `${Math.max(heightPercent, point.value > 0 ? 5 : 0)}%` }} />
                    <span className="text-[10px] text-neutral-400">{point.label}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-4 flex flex-col gap-3 text-[11px] text-neutral-400 md:flex-row md:items-center md:justify-between">
            <p>หน่วย: {metricUnit}</p>
            <p>รายงาน PDF จะอ้างอิงตัวกรองและข้อมูลล่าสุดจากฐานข้อมูลในหน้ารายงาน</p>
          </div>
        </div>
      </div>
    </div>
  );
}
