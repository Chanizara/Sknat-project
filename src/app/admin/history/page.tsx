"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { emit } from "@/lib/socket";
import { useAuth } from "@/lib/auth";
import {
  ArrowLeftIcon,
  SearchIcon,
  XCircleIcon,
  BuildingIcon,
} from "../components/Icons";

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

export default function HistoryPage() {
  const { user } = useAuth();
  const basePath = user?.role === "seller" ? "/seller" : "/admin";
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);

  const loadTransactions = async () => {
    const payload = user?.role === "seller" ? { sellerId: user.id } : {};
    const res = await emit<Transaction[]>("transactions:list", payload);
    if (res.ok && res.data) setTransactions(res.data);
    setLoading(false);
  };

  useEffect(() => { if (user) loadTransactions(); }, [user]);

  const filteredTransactions = transactions.filter((t) => {
    const matchesSearch =
      t.propertyTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.buyerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.sellerAgent.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === "all" || t.propertyType === filterType;
    const matchesDateFrom = !dateFrom || t.transactionDate >= dateFrom;
    const matchesDateTo = !dateTo || t.transactionDate <= dateTo;
    return matchesSearch && matchesType && matchesDateFrom && matchesDateTo;
  });

  const formatPrice = (price: number) => new Intl.NumberFormat("th-TH").format(price);
  const totalSales = filteredTransactions.reduce((sum, t) => sum + t.price, 0);
  const totalCommission = filteredTransactions.reduce((sum, t) => sum + t.commission, 0);

  const inputClass = "px-4 py-2.5 bg-neutral-50 border border-neutral-100 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-neutral-300 transition-all";

  return (
    <div className="min-h-screen bg-white p-6 md:p-10 font-sans">
      {/* Header */}
      <div className="mb-10 flex items-start gap-4">
        <Link href={basePath} className="mt-1 p-2.5 text-neutral-400 hover:text-black hover:bg-neutral-50 border border-neutral-100 rounded-2xl transition-all">
          <ArrowLeftIcon className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="text-3xl font-light tracking-tight text-black mb-1">ประวัติการซื้อ-ขาย</h1>
          <p className="text-sm text-neutral-500 tracking-wide">ตรวจสอบประวัติธุรกรรมอสังหาฯ</p>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
        <div className="bg-white border border-neutral-100 p-6 rounded-3xl shadow-[0_2px_20px_-4px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-300">
          <p className="text-neutral-500 text-xs tracking-wider uppercase mb-2">ยอดขายรวม</p>
          <p className="text-3xl font-light text-black tracking-tight mb-1">{loading ? "—" : `฿${formatPrice(totalSales)}`}</p>
          <p className="text-neutral-400 text-xs">{loading ? "—" : `${filteredTransactions.length} รายการ`}</p>
        </div>
        <div className="bg-white border border-neutral-100 p-6 rounded-3xl shadow-[0_2px_20px_-4px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-300">
          <p className="text-neutral-500 text-xs tracking-wider uppercase mb-2">ค่าคอมมิชชั่น</p>
          <p className="text-3xl font-light text-emerald-600 tracking-tight mb-1">{loading ? "—" : `฿${formatPrice(totalCommission)}`}</p>
          <p className="text-neutral-400 text-xs">
            ประมาณ {loading ? "—" : `${totalSales > 0 ? ((totalCommission / totalSales) * 100).toFixed(1) : "0"}%`}
          </p>
        </div>
        <div className="bg-white border border-neutral-100 p-6 rounded-3xl shadow-[0_2px_20px_-4px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-300">
          <p className="text-neutral-500 text-xs tracking-wider uppercase mb-2">ยอดเฉลี่ยต่อรายการ</p>
          <p className="text-3xl font-light text-black tracking-tight mb-1">
            {loading ? "—" : `฿${formatPrice(filteredTransactions.length > 0 ? Math.round(totalSales / filteredTransactions.length) : 0)}`}
          </p>
          <p className="text-neutral-400 text-xs">ราคาเฉลี่ย</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white border border-neutral-100 rounded-3xl p-6 mb-6 shadow-[0_2px_20px_-4px_rgba(0,0,0,0.04)]">
        <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-4">ค้นหาและกรองข้อมูล</p>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="md:col-span-2 relative">
            <input
              type="text"
              placeholder="ค้นหาด้วยชื่ออสังหาฯ ผู้ซื้อ หรือพนักงาน..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-neutral-50 border border-neutral-100 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-neutral-300 transition-all"
            />
            <SearchIcon className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3" />
          </div>
          <select value={filterType} onChange={(e) => setFilterType(e.target.value)} className={inputClass}>
            <option value="all">ประเภททั้งหมด</option>
            <option value="บ้านเดี่ยว">บ้านเดี่ยว</option>
            <option value="คอนโด">คอนโด</option>
            <option value="ทาวน์เฮาส์">ทาวน์เฮาส์</option>
            <option value="ที่ดิน">ที่ดิน</option>
          </select>
          <input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} className={inputClass} />
          <input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} className={inputClass} />
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-white border border-neutral-100 rounded-3xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)] overflow-hidden">
        <div className="px-6 py-5 border-b border-neutral-100 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-black tracking-wide uppercase">ประวัติธุรกรรม</h2>
          <span className="text-xs text-neutral-400 bg-neutral-50 border border-neutral-100 px-3 py-1 rounded-full">
            {loading ? "—" : `${filteredTransactions.length} รายการ`}
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-neutral-100/50">
                <th className="px-5 py-4 text-left text-xs font-semibold text-neutral-400 uppercase tracking-wider">วันที่</th>
                <th className="px-5 py-4 text-left text-xs font-semibold text-neutral-400 uppercase tracking-wider">อสังหาฯ</th>
                <th className="px-5 py-4 text-left text-xs font-semibold text-neutral-400 uppercase tracking-wider">ผู้ซื้อ</th>
                <th className="px-5 py-4 text-left text-xs font-semibold text-neutral-400 uppercase tracking-wider">พนักงานขาย</th>
                <th className="px-5 py-4 text-right text-xs font-semibold text-neutral-400 uppercase tracking-wider">มูลค่า</th>
                <th className="px-5 py-4 text-center text-xs font-semibold text-neutral-400 uppercase tracking-wider">สถานะ</th>
                <th className="px-5 py-4 text-center text-xs font-semibold text-neutral-400 uppercase tracking-wider">รายละเอียด</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100/50">
              {loading
                ? [0, 1, 2].map((i) => (
                    <tr key={i}><td colSpan={7} className="px-5 py-4"><div className="h-8 bg-neutral-50 rounded-xl animate-pulse" /></td></tr>
                  ))
                : filteredTransactions.map((transaction) => (
                    <tr key={transaction.id} className="hover:bg-neutral-50/50 transition-colors">
                      <td className="px-5 py-4 text-sm text-neutral-400">{transaction.transactionDate}</td>
                      <td className="px-5 py-4">
                        <div className="text-sm font-medium text-black">{transaction.propertyTitle}</div>
                        <div className="text-xs text-neutral-400">{transaction.propertyType} · {transaction.propertyLocation}</div>
                      </td>
                      <td className="px-5 py-4">
                        <div className="text-sm font-medium text-black">{transaction.buyerName}</div>
                        <div className="text-xs text-neutral-400">{transaction.buyerPhone}</div>
                      </td>
                      <td className="px-5 py-4 text-sm text-neutral-600">{transaction.sellerAgent}</td>
                      <td className="px-5 py-4 text-right">
                        <div className="text-sm font-medium text-black">฿{formatPrice(transaction.price)}</div>
                        <div className="text-xs text-emerald-600">฿{formatPrice(transaction.commission)}</div>
                      </td>
                      <td className="px-5 py-4 text-center">
                        <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium border ${
                          transaction.status === "completed"
                            ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                            : transaction.status === "pending-transfer"
                            ? "bg-amber-50 text-amber-600 border-amber-100"
                            : "bg-red-50 text-red-500 border-red-100"
                        }`}>
                          {transaction.status === "completed" ? "สำเร็จ" : transaction.status === "pending-transfer" ? "รอโอน" : "ยกเลิก"}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-center">
                        <button onClick={() => setSelectedTransaction(transaction)} className="text-sm text-neutral-400 hover:text-black font-medium transition-colors">
                          ดูเพิ่มเติม
                        </button>
                      </td>
                    </tr>
                  ))}
            </tbody>
          </table>
        </div>

        {!loading && filteredTransactions.length === 0 && (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-neutral-50 border border-neutral-100 rounded-3xl flex items-center justify-center mx-auto mb-4">
              <BuildingIcon className="w-7 h-7 text-neutral-300" />
            </div>
            <p className="text-neutral-400 text-sm">ไม่พบประวัติการซื้อ-ขาย</p>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {selectedTransaction && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-8 shadow-2xl border border-neutral-100 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-xl font-light text-black">รายละเอียดธุรกรรม</h3>
                <p className="text-xs text-neutral-400 mt-1">รหัส: #{selectedTransaction.id}</p>
              </div>
              <button onClick={() => setSelectedTransaction(null)} className="p-2 text-neutral-400 hover:text-black hover:bg-neutral-50 rounded-xl transition-all">
                <XCircleIcon className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                {
                  title: "ข้อมูลธุรกรรม",
                  rows: [
                    ["วันที่ทำรายการ", selectedTransaction.transactionDate],
                    ["มูลค่าการซื้อขาย", `฿${formatPrice(selectedTransaction.price)}`],
                    ["ค่าคอมมิชชั่น", `฿${formatPrice(selectedTransaction.commission)}`],
                    ["วิธีชำระเงิน", selectedTransaction.paymentMethod],
                  ],
                },
                {
                  title: "ข้อมูลอสังหาฯ",
                  rows: [
                    ["ชื่อ", selectedTransaction.propertyTitle],
                    ["ประเภท", selectedTransaction.propertyType],
                    ["ทำเล", selectedTransaction.propertyLocation],
                  ],
                },
                {
                  title: "ข้อมูลผู้ซื้อ",
                  rows: [
                    ["ชื่อ-นามสกุล", selectedTransaction.buyerName],
                    ["เบอร์โทร", selectedTransaction.buyerPhone],
                  ],
                },
                {
                  title: "ข้อมูลพนักงาน",
                  rows: [
                    ["พนักงานขาย", selectedTransaction.sellerAgent],
                    ["สถานะ", selectedTransaction.status === "completed" ? "สำเร็จ" : selectedTransaction.status === "pending-transfer" ? "รอโอน" : "ยกเลิก"],
                  ],
                },
              ].map((section, i) => (
                <div key={i} className="bg-neutral-50 border border-neutral-100 rounded-2xl p-4">
                  <h4 className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-3">{section.title}</h4>
                  <div className="space-y-2">
                    {section.rows.map(([label, value], j) => (
                      <div key={j} className="flex justify-between text-sm">
                        <span className="text-neutral-400">{label}:</span>
                        <span className="font-medium text-black">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 flex justify-end gap-3 pt-4 border-t border-neutral-100">
              <button onClick={() => setSelectedTransaction(null)} className="px-5 py-2.5 text-sm font-medium text-neutral-600 hover:bg-neutral-50 border border-neutral-100 rounded-2xl transition-all">
                ปิด
              </button>
              <button className="px-5 py-2.5 text-sm font-medium text-white bg-black hover:bg-neutral-800 rounded-2xl transition-all">
                พิมพ์รายงาน
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
