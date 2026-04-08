"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { emit } from "@/lib/socket";
import { useAuth } from "@/lib/auth";
import {
  ArrowLeftIcon,
  CalendarIcon,
  ClipboardIcon,
  DollarIcon,
  UserGroupIcon,
  BuildingIcon,
} from "../components/Icons";

interface SellerUser {
  id: number;
  username: string;
  role: "admin" | "seller";
  fullName?: string;
}

interface Transaction {
  id: number;
  transactionDate: string;
  propertyTitle: string;
  propertyType: string;
  propertyLocation: string;
  buyerName: string;
  buyerPhone: string;
  sellerAgent: string;
  price: number;
  commission: number;
  paymentMethod: string;
  status: "completed" | "pending-transfer" | "cancelled";
}

interface GraphPoint {
  label: string;
  fullLabel: string;
  value: number;
}

interface SellerSummary {
  sellerName: string;
  totalSales: number;
  totalCommission: number;
  successCount: number;
}

function toDate(value: string): Date {
  return new Date(value.includes("T") ? value : `${value}T00:00:00`);
}

function toInputDate(value: Date): string {
  const year = value.getFullYear();
  const month = `${value.getMonth() + 1}`.padStart(2, "0");
  const day = `${value.getDate()}`.padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function formatPrice(price: number): string {
  return `฿${new Intl.NumberFormat("th-TH").format(price)}`;
}

function formatDate(value: string): string {
  return toDate(value).toLocaleDateString("th-TH", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function statusLabel(status: Transaction["status"]): string {
  if (status === "completed") return "สำเร็จ";
  if (status === "pending-transfer") return "รอโอน";
  return "ยกเลิก";
}

function buildSalesGraphPoints(transactions: Transaction[], dateFrom: string, dateTo: string): GraphPoint[] {
  if (!dateFrom || !dateTo) return [];

  const start = toDate(dateFrom);
  start.setHours(0, 0, 0, 0);

  const end = toDate(dateTo);
  end.setHours(0, 0, 0, 0);

  if (end < start) return [];

  const totalDays = Math.floor((end.getTime() - start.getTime()) / 86400000) + 1;
  const points: GraphPoint[] = [];

  for (let index = 0; index < totalDays; index += 1) {
    const current = new Date(start);
    current.setDate(start.getDate() + index);

    points.push({
      label: current.toLocaleDateString("th-TH", { day: "numeric", month: totalDays <= 7 ? "short" : undefined }),
      fullLabel: current.toLocaleDateString("th-TH", { year: "numeric", month: "short", day: "numeric" }),
      value: 0,
    });
  }

  transactions.forEach((transaction) => {
    const txDate = toDate(transaction.transactionDate);
    txDate.setHours(0, 0, 0, 0);

    const diff = Math.floor((txDate.getTime() - start.getTime()) / 86400000);
    if (diff >= 0 && diff < points.length && transaction.status === "completed") {
      points[diff].value += transaction.price;
    }
  });

  return points;
}

export default function HistoryPage() {
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const basePath = user?.role === "seller" ? "/seller" : "/admin";
  const querySellerId = searchParams.get("sellerId") ?? "";

  const today = useMemo(() => new Date(), []);
  const defaultFrom = useMemo(() => {
    const value = new Date(today);
    value.setDate(today.getDate() - 29);
    return toInputDate(value);
  }, [today]);
  const defaultTo = useMemo(() => toInputDate(today), [today]);

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [sellers, setSellers] = useState<SellerUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [sellerId, setSellerId] = useState(querySellerId);
  const [dateFrom, setDateFrom] = useState(defaultFrom);
  const [dateTo, setDateTo] = useState(defaultTo);
  const activeSellerId = user?.role === "seller" ? String(user.id) : sellerId;

  useEffect(() => {
    if (!user) return;

    const loadReportData = async () => {
      setLoading(true);

      const sellerPayload = user.role === "admin" && activeSellerId ? { sellerId: Number(activeSellerId) } : user.role === "seller" ? { sellerId: user.id } : {};
      const requests: Promise<unknown>[] = [emit<Transaction[]>("transactions:list", sellerPayload)];

      if (user.role === "admin") {
        requests.push(emit<SellerUser[]>("users:list"));
      }

      const [transactionsRes, usersRes] = await Promise.all(requests) as [
        Awaited<ReturnType<typeof emit<Transaction[]>>>,
        Awaited<ReturnType<typeof emit<SellerUser[]>>> | undefined,
      ];

      if (transactionsRes.ok && transactionsRes.data) {
        setTransactions(transactionsRes.data);
      } else {
        setTransactions([]);
      }

      if (user.role === "admin" && usersRes?.ok && usersRes.data) {
        setSellers(usersRes.data.filter((item) => item.role === "seller"));
      }

      setLoading(false);
    };

    loadReportData();
  }, [activeSellerId, user]);

  const selectedSeller = useMemo(() => {
    if (user?.role === "seller") {
      return {
        id: user.id,
        username: user.username,
        role: user.role,
        fullName: user.fullName,
      } satisfies SellerUser;
    }

    return sellers.find((item) => String(item.id) === activeSellerId) ?? null;
  }, [activeSellerId, sellers, user]);

  const filteredTransactions = useMemo(() => {
    const from = dateFrom ? toDate(dateFrom) : null;
    const to = dateTo ? toDate(dateTo) : null;

    if (from) from.setHours(0, 0, 0, 0);
    if (to) to.setHours(23, 59, 59, 999);

    return [...transactions]
      .filter((transaction) => {
        const txDate = toDate(transaction.transactionDate);
        const matchesFrom = !from || txDate >= from;
        const matchesTo = !to || txDate <= to;
        return matchesFrom && matchesTo;
      })
      .sort((left, right) => toDate(right.transactionDate).getTime() - toDate(left.transactionDate).getTime());
  }, [dateFrom, dateTo, transactions]);

  const completedTransactions = useMemo(
    () => filteredTransactions.filter((item) => item.status === "completed"),
    [filteredTransactions],
  );

  const summary = useMemo(() => {
    const totalSales = completedTransactions.reduce((sum, item) => sum + item.price, 0);
    const totalCommission = completedTransactions.reduce((sum, item) => sum + item.commission, 0);
    const successCount = completedTransactions.length;
    const pendingCount = filteredTransactions.filter((item) => item.status === "pending-transfer").length;
    const sellerNames = new Set(
      completedTransactions
        .map((item) => item.sellerAgent?.trim())
        .filter((item): item is string => Boolean(item)),
    );
    const sellerCount = selectedSeller ? 1 : sellerNames.size;
    const averageSalesPerSeller = sellerCount > 0 ? totalSales / sellerCount : 0;
    const averageCommissionPerSeller = sellerCount > 0 ? totalCommission / sellerCount : 0;

    return {
      totalSales,
      totalCommission,
      successCount,
      pendingCount,
      sellerCount,
      averageSalesPerSeller,
      averageCommissionPerSeller,
    };
  }, [completedTransactions, filteredTransactions, selectedSeller]);

  const sellerSummaries = useMemo(() => {
    const summaryMap = new Map<string, SellerSummary>();

    completedTransactions.forEach((transaction) => {
      const sellerName = transaction.sellerAgent?.trim() || "ไม่ระบุคนขาย";
      const current = summaryMap.get(sellerName) ?? {
        sellerName,
        totalSales: 0,
        totalCommission: 0,
        successCount: 0,
      };

      current.totalSales += transaction.price;
      current.totalCommission += transaction.commission;
      current.successCount += 1;
      summaryMap.set(sellerName, current);
    });

    return [...summaryMap.values()].sort((left, right) => right.totalSales - left.totalSales);
  }, [completedTransactions]);

  const graphPoints = useMemo(
    () => buildSalesGraphPoints(completedTransactions, dateFrom, dateTo),
    [completedTransactions, dateFrom, dateTo],
  );
  const maxGraphValue = Math.max(...graphPoints.map((item) => item.value), 1);
  const canPrint = filteredTransactions.length > 0 && !loading;

  return (
    <div className="min-h-screen bg-white p-6 md:p-10 font-sans">
      <div className="print:hidden mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div className="flex items-start gap-4">
          <Link href={basePath} className="mt-1 p-2.5 text-neutral-400 hover:text-black hover:bg-neutral-50 border border-neutral-100 rounded-2xl transition-all">
            <ArrowLeftIcon className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-3xl font-light tracking-tight text-black mb-1">รายงานการขาย</h1>
            <p className="text-sm text-neutral-500 tracking-wide">
              สรุปตามข้อมูลจากฐานข้อมูล พร้อมช่วงเวลา ตารางรายการสินค้า และกราฟยอดขาย
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => window.print()}
          disabled={!canPrint}
          className="px-5 py-2.5 bg-black text-white text-sm font-medium rounded-2xl hover:bg-neutral-800 transition-all disabled:opacity-40 disabled:cursor-not-allowed self-start md:self-auto"
        >
          ส่งออก PDF
        </button>
      </div>

      <div className="hidden print:block mb-8">
        <h1 className="text-2xl font-semibold text-black">รายงานการขาย</h1>
        <div className="mt-3 grid grid-cols-2 gap-4 text-sm text-neutral-700">
          <p>พนักงานขาย: {selectedSeller ? selectedSeller.fullName ?? selectedSeller.username : "ทุกคนขาย"}</p>
          <p>ช่วงเวลา: {formatDate(dateFrom)} - {formatDate(dateTo)}</p>
        </div>
      </div>

      <div className="print:hidden bg-white border border-neutral-100 rounded-3xl p-6 mb-6 shadow-[0_2px_20px_-4px_rgba(0,0,0,0.04)]">
        <div className="flex items-center justify-between gap-3 mb-5">
          <div>
            <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">ฟอร์มรายงาน</p>
            <p className="text-sm text-neutral-500 mt-1">รายงานจะอ้างอิงคนขายและช่วงเวลาที่เลือกเท่านั้น</p>
          </div>
          <span className="text-xs text-neutral-400 bg-neutral-50 border border-neutral-100 px-3 py-1 rounded-full">
            {loading ? "กำลังโหลด..." : `${filteredTransactions.length} รายการ`}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {user?.role === "admin" && (
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-2">พนักงานขาย</label>
              <select value={activeSellerId} onChange={(event) => setSellerId(event.target.value)} className="w-full px-4 py-3 bg-neutral-50 border border-neutral-100 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-neutral-300 transition-all">
                <option value="">ทุกคนขาย</option>
                {sellers.map((seller) => (
                  <option key={seller.id} value={seller.id}>
                    {seller.fullName ?? seller.username}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-2">วันที่เริ่มต้น</label>
            <input type="date" value={dateFrom} onChange={(event) => setDateFrom(event.target.value)} className="w-full px-4 py-3 bg-neutral-50 border border-neutral-100 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-neutral-300 transition-all" />
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-2">วันที่สิ้นสุด</label>
            <input type="date" value={dateTo} onChange={(event) => setDateTo(event.target.value)} className="w-full px-4 py-3 bg-neutral-50 border border-neutral-100 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-neutral-300 transition-all" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5 mb-6">
        {[
          { label: "ยอดขายรวม", value: loading ? "—" : formatPrice(summary.totalSales), sub: "เฉพาะรายการสำเร็จ", icon: DollarIcon },
          { label: "ค่าคอมมิชชั่น", value: loading ? "—" : formatPrice(summary.totalCommission), sub: "รวมตามคนขายที่เลือก", icon: ClipboardIcon },
          {
            label: selectedSeller ? "รายการสำเร็จ" : "คนขายในรายงาน",
            value: loading ? "—" : selectedSeller ? summary.successCount : summary.sellerCount,
            sub: selectedSeller ? "สถานะสำเร็จ" : "มีข้อมูลตามช่วงเวลา",
            icon: BuildingIcon,
          },
          {
            label: selectedSeller ? "รายการรอโอน" : "ยอดขายเฉลี่ยต่อคน",
            value: loading ? "—" : selectedSeller ? summary.pendingCount : formatPrice(summary.averageSalesPerSeller),
            sub: selectedSeller ? "สถานะรอดำเนินการ" : "คำนวณจากคนขายที่มีรายการสำเร็จ",
            icon: CalendarIcon,
          },
        ].map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.label} className="bg-white border border-neutral-100 p-6 rounded-3xl shadow-[0_2px_20px_-4px_rgba(0,0,0,0.04)]">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-neutral-500 text-xs tracking-wider uppercase mb-2">{item.label}</p>
                  <p className="text-2xl font-light text-black tracking-tight mb-1">{item.value}</p>
                  <p className="text-neutral-400 text-xs">{item.sub}</p>
                </div>
                <div className="w-11 h-11 border border-neutral-100 bg-neutral-50 rounded-2xl flex items-center justify-center">
                  <Icon className="w-5 h-5 text-neutral-500" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1.4fr_0.6fr] gap-6 mb-6">
        <div className="bg-white border border-neutral-100 rounded-3xl p-6 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)]">
          <div className="flex items-start justify-between gap-4 mb-5">
            <div>
              <h2 className="text-sm font-semibold text-black tracking-wide uppercase">กราฟยอดขาย</h2>
              <p className="text-xs text-neutral-500 mt-1">
                แสดงยอดขายเฉพาะรายการสำเร็จในช่วง {formatDate(dateFrom)} - {formatDate(dateTo)}
              </p>
            </div>
            <span className="text-xs text-neutral-400 bg-neutral-50 border border-neutral-100 px-3 py-1 rounded-full">
              {selectedSeller ? selectedSeller.fullName ?? selectedSeller.username : "ทุกคนขาย"}
            </span>
          </div>

          <div className="h-72 border border-neutral-100 rounded-2xl p-4 bg-neutral-50/50 overflow-hidden">
            {loading ? (
              <div className="h-full bg-neutral-100 rounded-2xl animate-pulse" />
            ) : graphPoints.length === 0 ? (
              <div className="h-full flex items-center justify-center text-sm text-neutral-400">ยังไม่มีข้อมูลสำหรับช่วงเวลานี้</div>
            ) : (
              <div className="h-full grid grid-cols-[repeat(auto-fit,minmax(0,1fr))] items-end gap-1.5">
                {graphPoints.map((point) => {
                  const heightPercent = (point.value / maxGraphValue) * 100;
                  return (
                    <div key={point.fullLabel} className="min-w-0 h-full flex flex-col justify-end gap-2">
                      <div className="flex min-h-0 flex-1 flex-col justify-end">
                        {point.value > 0 ? (
                          <span className="mb-1 truncate text-center text-[9px] text-neutral-600">{formatPrice(point.value)}</span>
                        ) : (
                          <span className="mb-1 truncate text-center text-[9px] text-neutral-300"> </span>
                        )}
                        <div className="flex min-h-0 flex-1 items-end">
                          <div
                            className={`w-full rounded-t-md ${point.value > 0 ? "bg-black" : "bg-neutral-200"}`}
                            style={{ height: `${Math.max(heightPercent, point.value > 0 ? 10 : 2)}%` }}
                            title={`${point.fullLabel}: ${formatPrice(point.value)}`}
                          />
                        </div>
                      </div>
                      <span className="truncate text-center text-[9px] text-neutral-400">{point.label}</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        <div className="bg-white border border-neutral-100 rounded-3xl p-6 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)]">
          <h2 className="text-sm font-semibold text-black tracking-wide uppercase mb-4">เงื่อนไขการออกรายงาน</h2>
          <div className="space-y-4 text-sm text-neutral-600">
            <div className="rounded-2xl border border-neutral-100 bg-neutral-50 px-4 py-3">
              <p className="text-xs uppercase tracking-wider text-neutral-400 mb-1">พนักงานขาย</p>
              <p className="font-medium text-black">{selectedSeller ? selectedSeller.fullName ?? selectedSeller.username : "ทุกคนขาย"}</p>
            </div>
            <div className="rounded-2xl border border-neutral-100 bg-neutral-50 px-4 py-3">
              <p className="text-xs uppercase tracking-wider text-neutral-400 mb-1">ช่วงเวลา</p>
              <p className="font-medium text-black">{formatDate(dateFrom)} - {formatDate(dateTo)}</p>
            </div>
            <div className="rounded-2xl border border-neutral-100 bg-neutral-50 px-4 py-3">
              <p className="text-xs uppercase tracking-wider text-neutral-400 mb-1">รูปแบบรายงาน</p>
              <p className="font-medium text-black">ตารางสรุปรายการสินค้า + กราฟยอดขาย</p>
            </div>
            {!selectedSeller && (
              <>
                <div className="rounded-2xl border border-neutral-100 bg-neutral-50 px-4 py-3">
                  <p className="text-xs uppercase tracking-wider text-neutral-400 mb-1">จำนวนคนขายที่นำมาคำนวณ</p>
                  <p className="font-medium text-black">{loading ? "—" : `${summary.sellerCount} คน`}</p>
                </div>
                <div className="rounded-2xl border border-neutral-100 bg-neutral-50 px-4 py-3">
                  <p className="text-xs uppercase tracking-wider text-neutral-400 mb-1">ค่าเฉลี่ยค่าคอมต่อคนขาย</p>
                  <p className="font-medium text-black">{loading ? "—" : formatPrice(summary.averageCommissionPerSeller)}</p>
                </div>
              </>
            )}
            <div className="rounded-2xl border border-dashed border-neutral-200 px-4 py-3 text-xs text-neutral-500">
              เมื่อกดส่งออก ระบบจะพิมพ์รายงานตามเงื่อนไขชุดนี้เพื่อบันทึกเป็น PDF
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white border border-neutral-100 rounded-3xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)] overflow-hidden mb-6">
        <div className="px-6 py-5 border-b border-neutral-100 flex items-center justify-between gap-3">
          <div>
            <h2 className="text-sm font-semibold text-black tracking-wide uppercase">สรุปยอดขายรายคน</h2>
            <p className="text-xs text-neutral-500 mt-1">บอกชัดว่าใครขายได้และขายได้เท่าไรในช่วงเวลาที่เลือก</p>
          </div>
          <span className="text-xs text-neutral-400 bg-neutral-50 border border-neutral-100 px-3 py-1 rounded-full">
            {loading ? "—" : `${sellerSummaries.length} คน`}
          </span>
        </div>

        <div className="px-6 py-4">
          {loading ? (
            <div className="space-y-3">
              {[0, 1].map((index) => (
                <div key={index} className="h-20 bg-neutral-50 rounded-2xl animate-pulse" />
              ))}
            </div>
          ) : sellerSummaries.length === 0 ? (
            <div className="py-12 text-center text-sm text-neutral-400">ยังไม่มีรายการขายสำเร็จในช่วงเวลานี้</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {sellerSummaries.map((seller) => (
                <div key={seller.sellerName} className="rounded-2xl border border-neutral-100 bg-neutral-50/60 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-black">{seller.sellerName}</p>
                      <p className="text-xs text-neutral-500 mt-1">{seller.successCount} รายการสำเร็จ</p>
                    </div>
                    <span className="rounded-full border border-neutral-200 bg-white px-3 py-1 text-[10px] font-medium text-neutral-500">
                      {seller.successCount} ดีล
                    </span>
                  </div>
                  <div className="mt-4 grid grid-cols-2 gap-3">
                    <div className="rounded-2xl bg-white border border-neutral-100 px-3 py-3">
                      <p className="text-[10px] uppercase tracking-wider text-neutral-400 mb-1">ยอดขาย</p>
                      <p className="text-sm font-semibold text-black">{formatPrice(seller.totalSales)}</p>
                    </div>
                    <div className="rounded-2xl bg-white border border-neutral-100 px-3 py-3">
                      <p className="text-[10px] uppercase tracking-wider text-neutral-400 mb-1">ค่าคอม</p>
                      <p className="text-sm font-semibold text-emerald-600">{formatPrice(seller.totalCommission)}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="bg-white border border-neutral-100 rounded-3xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)] overflow-hidden">
        <div className="px-6 py-5 border-b border-neutral-100 flex items-center justify-between gap-3">
          <div>
            <h2 className="text-sm font-semibold text-black tracking-wide uppercase">ตารางสรุปรายการสินค้า</h2>
            <p className="text-xs text-neutral-500 mt-1">สรุปรายการขายตามข้อมูลฐานข้อมูลในช่วงเวลาที่เลือก</p>
          </div>
          <span className="text-xs text-neutral-400 bg-neutral-50 border border-neutral-100 px-3 py-1 rounded-full">
            {loading ? "—" : `${filteredTransactions.length} รายการ`}
          </span>
        </div>

        <div className="px-6 py-4">
          <div className="hidden md:grid md:grid-cols-[110px_minmax(0,1.6fr)_minmax(0,1.1fr)_minmax(0,0.9fr)_110px_110px_100px] md:gap-4 border-b border-neutral-100/50 pb-4">
            {["วันที่", "อสังหาฯ", "ผู้ซื้อ", "คนขาย", "มูลค่า", "ค่าคอม", "สถานะ"].map((heading) => (
              <div key={heading} className="text-left text-xs font-semibold text-neutral-400 uppercase tracking-wider">
                {heading}
              </div>
            ))}
          </div>

          <div className="divide-y divide-neutral-100/50">
            {loading ? (
              [0, 1, 2].map((index) => (
                <div key={index} className="py-4">
                  <div className="h-24 bg-neutral-50 rounded-2xl animate-pulse" />
                </div>
              ))
            ) : filteredTransactions.length === 0 ? (
              <div className="py-16 text-center">
                <div className="w-14 h-14 bg-neutral-50 border border-neutral-100 rounded-3xl flex items-center justify-center mx-auto mb-4">
                  <UserGroupIcon className="w-6 h-6 text-neutral-300" />
                </div>
                <p className="text-sm text-neutral-400">ไม่พบข้อมูลรายงานในเงื่อนไขที่เลือก</p>
              </div>
            ) : (
              filteredTransactions.map((transaction) => (
                <div key={transaction.id} className="py-4">
                  <div className="grid grid-cols-1 gap-3 rounded-2xl bg-neutral-50/40 p-4 md:grid-cols-[110px_minmax(0,1.6fr)_minmax(0,1.1fr)_minmax(0,0.9fr)_110px_110px_100px] md:items-center md:gap-4 md:bg-transparent md:p-0">
                    <div>
                      <p className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-neutral-400 md:hidden">วันที่</p>
                      <p className="text-sm text-neutral-500">{formatDate(transaction.transactionDate)}</p>
                    </div>
                    <div className="min-w-0">
                      <p className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-neutral-400 md:hidden">อสังหาฯ</p>
                      <div className="text-sm font-medium text-black break-words">{transaction.propertyTitle}</div>
                      <div className="text-xs text-neutral-400 break-words">{transaction.propertyType} · {transaction.propertyLocation}</div>
                    </div>
                    <div className="min-w-0">
                      <p className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-neutral-400 md:hidden">ผู้ซื้อ</p>
                      <div className="text-sm font-medium text-black break-words">{transaction.buyerName}</div>
                      <div className="text-xs text-neutral-400 break-all">{transaction.buyerPhone}</div>
                    </div>
                    <div className="min-w-0">
                      <p className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-neutral-400 md:hidden">คนขาย</p>
                      <div className="text-sm text-neutral-600 break-words">{transaction.sellerAgent}</div>
                    </div>
                    <div>
                      <p className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-neutral-400 md:hidden">มูลค่า</p>
                      <div className="text-sm text-black">{formatPrice(transaction.price)}</div>
                    </div>
                    <div>
                      <p className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-neutral-400 md:hidden">ค่าคอม</p>
                      <div className="text-sm text-emerald-600">{formatPrice(transaction.commission)}</div>
                    </div>
                    <div>
                      <p className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-neutral-400 md:hidden">สถานะ</p>
                      <span
                        className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium border ${
                          transaction.status === "completed"
                            ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                            : transaction.status === "pending-transfer"
                            ? "bg-amber-50 text-amber-600 border-amber-100"
                            : "bg-red-50 text-red-500 border-red-100"
                        }`}
                      >
                        {statusLabel(transaction.status)}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
