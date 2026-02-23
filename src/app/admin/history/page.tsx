"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeftIcon,
  SearchIcon,
  LocationIcon,
  PhoneIcon,
  CheckCircleIcon,
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
  const [transactions] = useState<Transaction[]>([
    {
      id: 1,
      transactionDate: "2024-02-15",
      propertyTitle: "บ้านเดี่ยว 2 ชั้น ใกล้ BTS",
      propertyType: "บ้านเดี่ยว",
      propertyLocation: "บางนา กรุงเทพฯ",
      buyerName: "วิชัย มั่งมี",
      buyerPhone: "081-111-2222",
      sellerAgent: "สมชาย ใจดี",
      price: 5900000,
      commission: 177000,
      paymentMethod: "โอนเงิน",
      status: "completed",
    },
    {
      id: 2,
      transactionDate: "2024-01-28",
      propertyTitle: "คอนโดหรู วิวแม่น้ำ",
      propertyType: "คอนโด",
      propertyLocation: "สาทร กรุงเทพฯ",
      buyerName: "สุดา รุ่งเรือง",
      buyerPhone: "089-333-4444",
      sellerAgent: "สมหญิง รักงาน",
      price: 3200000,
      commission: 96000,
      paymentMethod: "เงินสด",
      status: "completed",
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [selectedTransaction, setSelectedTransaction] =
    useState<Transaction | null>(null);

  const filteredTransactions = transactions.filter((transaction) => {
    const matchesSearch =
      transaction.propertyTitle
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      transaction.buyerName
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      transaction.sellerAgent.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType =
      filterType === "all" || transaction.propertyType === filterType;
    const matchesDateFrom =
      !dateFrom || transaction.transactionDate >= dateFrom;
    const matchesDateTo = !dateTo || transaction.transactionDate <= dateTo;
    return matchesSearch && matchesType && matchesDateFrom && matchesDateTo;
  });

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("th-TH").format(price);
  };

  const totalSales = filteredTransactions.reduce((sum, t) => sum + t.price, 0);
  const totalCommission = filteredTransactions.reduce(
    (sum, t) => sum + t.commission,
    0
  );

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
                  ประวัติการซื้อ-ขาย
                </h1>
                <p className="text-xs text-slate-400">
                  ตรวจสอบประวัติธุรกรรมอสังหาฯ
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-[1600px] mx-auto px-6 py-6">
        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-2xl p-5 premium-shadow">
            <div className="text-xs text-slate-400 mb-1">ยอดขายรวม</div>
            <div className="text-2xl font-semibold text-slate-900">
              ฿{formatPrice(totalSales)}
            </div>
            <div className="text-xs text-slate-400 mt-1">
              {filteredTransactions.length} รายการ
            </div>
          </div>
          <div className="bg-white rounded-2xl p-5 premium-shadow">
            <div className="text-xs text-slate-400 mb-1">ค่าคอมมิชชั่น</div>
            <div className="text-2xl font-semibold text-emerald-600">
              ฿{formatPrice(totalCommission)}
            </div>
            <div className="text-xs text-slate-400 mt-1">
              ประมาณ{" "}
              {totalSales > 0
                ? ((totalCommission / totalSales) * 100).toFixed(1)
                : "0"}
              %
            </div>
          </div>
          <div className="bg-white rounded-2xl p-5 premium-shadow">
            <div className="text-xs text-slate-400 mb-1">ยอดเฉลี่ยต่อรายการ</div>
            <div className="text-2xl font-semibold text-slate-900">
              ฿
              {formatPrice(
                filteredTransactions.length > 0
                  ? totalSales / filteredTransactions.length
                  : 0
              )}
            </div>
            <div className="text-xs text-slate-400 mt-1">ราคาเฉลี่ย</div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl p-4 mb-6 premium-shadow">
          <h3 className="text-sm font-semibold text-slate-900 mb-4">
            ค้นหาและกรองข้อมูล
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="md:col-span-2 relative">
              <input
                type="text"
                placeholder="ค้นหาด้วยชื่ออสังหาฯ ผู้ซื้อ หรือพนักงาน..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all"
              />
              <SearchIcon className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            </div>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all"
            >
              <option value="all">ประเภททั้งหมด</option>
              <option value="บ้านเดี่ยว">บ้านเดี่ยว</option>
              <option value="คอนโด">คอนโด</option>
              <option value="ทาวน์เฮาส์">ทาวน์เฮาส์</option>
              <option value="ที่ดิน">ที่ดิน</option>
            </select>
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all"
              placeholder="จากวันที่"
            />
            <input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all"
              placeholder="ถึงวันที่"
            />
          </div>
        </div>

        {/* Transactions Table */}
        <div className="bg-white rounded-2xl premium-shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100">
                  <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                    วันที่
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                    อสังหาฯ
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                    ผู้ซื้อ
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                    พนักงานขาย
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">
                    มูลค่า
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-bold text-slate-500 uppercase tracking-wider">
                    สถานะ
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-bold text-slate-500 uppercase tracking-wider">
                    รายละเอียด
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredTransactions.map((transaction) => (
                  <tr
                    key={transaction.id}
                    className="hover:bg-slate-50/50 transition"
                  >
                    <td className="px-4 py-3 text-sm text-slate-600">
                      {transaction.transactionDate}
                    </td>
                    <td className="px-4 py-3">
                      <div>
                        <div className="text-sm font-medium text-slate-900">
                          {transaction.propertyTitle}
                        </div>
                        <div className="text-xs text-slate-400">
                          {transaction.propertyType} •{" "}
                          {transaction.propertyLocation}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div>
                        <div className="text-sm font-medium text-slate-900">
                          {transaction.buyerName}
                        </div>
                        <div className="text-xs text-slate-400">
                          {transaction.buyerPhone}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-600">
                      {transaction.sellerAgent}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="text-sm font-semibold text-slate-900">
                        ฿{formatPrice(transaction.price)}
                      </div>
                      <div className="text-xs text-emerald-600">
                        ค่าคอม: ฿{formatPrice(transaction.commission)}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span
                        className={`inline-flex px-2 py-1 rounded-md text-xs font-medium ${
                          transaction.status === "completed"
                            ? "bg-emerald-50 text-emerald-600"
                            : transaction.status === "pending-transfer"
                            ? "bg-amber-50 text-amber-600"
                            : "bg-red-50 text-red-600"
                        }`}
                      >
                        {transaction.status === "completed"
                          ? "สำเร็จ"
                          : transaction.status === "pending-transfer"
                          ? "รอโอน"
                          : "ยกเลิก"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => setSelectedTransaction(transaction)}
                        className="text-slate-600 hover:text-slate-900 text-sm font-medium"
                      >
                        ดูเพิ่มเติม
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {filteredTransactions.length === 0 && (
          <div className="text-center py-12 text-slate-400 text-sm">
            ไม่พบประวัติการซื้อ-ขาย
          </div>
        )}
      </main>

      {/* Detail Modal */}
      {selectedTransaction && (
        <div className="fixed inset-0 bg-blue-950/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-lg font-semibold text-slate-900">
                  รายละเอียดธุรกรรม
                </h3>
                <p className="text-xs text-slate-400">
                  รหัส: #{selectedTransaction.id}
                </p>
              </div>
              <button
                onClick={() => setSelectedTransaction(null)}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-lg transition"
              >
                <XCircleIcon className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Transaction Info */}
              <div className="bg-slate-50 rounded-lg p-4">
                <h4 className="font-medium text-slate-900 mb-3">
                  ข้อมูลธุรกรรม
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-500">วันที่ทำรายการ:</span>
                    <span className="font-medium">
                      {selectedTransaction.transactionDate}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">มูลค่าการซื้อขาย:</span>
                    <span className="font-semibold">
                      ฿{formatPrice(selectedTransaction.price)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">ค่าคอมมิชชั่น:</span>
                    <span className="font-medium text-emerald-600">
                      ฿{formatPrice(selectedTransaction.commission)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">วิธีชำระเงิน:</span>
                    <span className="font-medium">
                      {selectedTransaction.paymentMethod}
                    </span>
                  </div>
                </div>
              </div>

              {/* Property Info */}
              <div className="bg-slate-50 rounded-lg p-4">
                <h4 className="font-medium text-slate-900 mb-3">
                  ข้อมูลอสังหาฯ
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-500">ชื่อ:</span>
                    <span className="font-medium">
                      {selectedTransaction.propertyTitle}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">ประเภท:</span>
                    <span className="font-medium">
                      {selectedTransaction.propertyType}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">ทำเล:</span>
                    <span className="font-medium">
                      {selectedTransaction.propertyLocation}
                    </span>
                  </div>
                </div>
              </div>

              {/* Buyer Info */}
              <div className="bg-slate-50 rounded-lg p-4">
                <h4 className="font-medium text-slate-900 mb-3">
                  ข้อมูลผู้ซื้อ
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-500">ชื่อ-นามสกุล:</span>
                    <span className="font-medium">
                      {selectedTransaction.buyerName}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">เบอร์โทร:</span>
                    <a
                      href={`tel:${selectedTransaction.buyerPhone}`}
                      className="font-medium text-slate-900 hover:underline"
                    >
                      {selectedTransaction.buyerPhone}
                    </a>
                  </div>
                </div>
              </div>

              {/* Agent Info */}
              <div className="bg-slate-50 rounded-lg p-4">
                <h4 className="font-medium text-slate-900 mb-3">
                  ข้อมูลพนักงาน
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-500">พนักงานขาย:</span>
                    <span className="font-medium">
                      {selectedTransaction.sellerAgent}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">สถานะ:</span>
                    <span
                      className={`px-2 py-0.5 rounded text-xs font-medium ${
                        selectedTransaction.status === "completed"
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-amber-100 text-amber-700"
                      }`}
                    >
                      {selectedTransaction.status === "completed"
                        ? "สำเร็จ"
                        : "รอดำเนินการ"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3 pt-4 border-t border-slate-100">
              <button
                onClick={() => setSelectedTransaction(null)}
                className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 rounded-lg transition"
              >
                ปิด
              </button>
              <button className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg shadow-lg shadow-blue-500/25 hover:shadow-xl transition">
                พิมพ์รายงาน
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
