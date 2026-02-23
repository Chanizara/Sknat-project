"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeftIcon,
  SearchIcon,
  FilterIcon,
  BuildingIcon,
  CheckCircleIcon,
  ChevronRightIcon,
} from "../components/Icons";

interface SelectionCriteria {
  type?: string;
  minPrice?: number;
  maxPrice?: number;
  minArea?: number;
  bedrooms?: number;
  location?: string;
}

interface Property {
  id: number;
  title: string;
  type: string;
  price: number;
  location: string;
  area: number;
  bedrooms: number;
  bathrooms: number;
  age: number;
  facilities: string[];
}

export default function SelectionPage() {
  const [step, setStep] = useState<"criteria" | "results" | "comparison">("criteria");
  const [criteria, setCriteria] = useState<SelectionCriteria>({});
  const [selectedProperties, setSelectedProperties] = useState<Property[]>([]);
  const [compareMode, setCompareMode] = useState<"price" | "area" | "age" | "facilities">("price");

  const allProperties: Property[] = [
    {
      id: 1,
      title: "บ้านเดี่ยว 2 ชั้น ใกล้ BTS",
      type: "บ้านเดี่ยว",
      price: 5900000,
      location: "บางนา",
      area: 250,
      bedrooms: 3,
      bathrooms: 3,
      age: 2,
      facilities: ["สระว่ายน้ำ", "ฟิตเนส", "สวนหย่อม", "ที่จอดรถ 2 คัน"],
    },
    {
      id: 2,
      title: "คอนโดหรู วิวแม่น้ำ",
      type: "คอนโด",
      price: 3200000,
      location: "สาทร",
      area: 45,
      bedrooms: 1,
      bathrooms: 1,
      age: 1,
      facilities: ["สระว่ายน้ำ", "ฟิตเนส", "ระบบรักษาความปลอดภัย"],
    },
    {
      id: 3,
      title: "ทาวน์โฮม 3 ชั้น ใกล้รถไฟฟ้า",
      type: "ทาวน์เฮาส์",
      price: 4500000,
      location: "ลาดพร้าว",
      area: 180,
      bedrooms: 3,
      bathrooms: 2,
      age: 3,
      facilities: ["ที่จอดรถ 1 คัน", "สวนหย่อม"],
    },
  ];

  const handleSearch = () => {
    const filtered = allProperties.filter((prop) => {
      if (criteria.type && prop.type !== criteria.type) return false;
      if (criteria.minPrice && prop.price < criteria.minPrice) return false;
      if (criteria.maxPrice && prop.price > criteria.maxPrice) return false;
      if (criteria.minArea && prop.area < criteria.minArea) return false;
      if (criteria.bedrooms && prop.bedrooms < criteria.bedrooms) return false;
      if (criteria.location && !prop.location.includes(criteria.location)) return false;
      return true;
    });
    setSelectedProperties(filtered);
    setStep("results");
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("th-TH").format(price);
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
                  คัดเลือกอสังหาริมทรัพย์
                </h1>
                <p className="text-xs text-slate-400">ระบบสนับสนุนการตัดสินใจ</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-[1600px] mx-auto px-6 py-6">
        {/* Steps */}
        <div className="flex items-center justify-center mb-8">
          <div className="bg-white rounded-2xl p-4 premium-shadow flex items-center gap-4">
            <StepIndicator
              number={1}
              label="กำหนดเกณฑ์"
              isActive={step === "criteria"}
              isCompleted={step !== "criteria"}
            />
            <ChevronRightIcon className="w-5 h-5 text-slate-300" />
            <StepIndicator
              number={2}
              label="ผลลัพธ์"
              isActive={step === "results"}
              isCompleted={step === "comparison"}
            />
            <ChevronRightIcon className="w-5 h-5 text-slate-300" />
            <StepIndicator
              number={3}
              label="เปรียบเทียบ"
              isActive={step === "comparison"}
              isCompleted={false}
            />
          </div>
        </div>

        {/* Step 1: Criteria */}
        {step === "criteria" && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-2xl p-6 premium-shadow">
              <h2 className="text-lg font-bold text-slate-800 mb-6">กำหนดเกณฑ์การค้นหา</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">
                    ประเภทอสังหาฯ
                  </label>
                  <select
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all"
                    onChange={(e) => setCriteria({ ...criteria, type: e.target.value })}
                  >
                    <option value="">ทั้งหมด</option>
                    <option value="บ้านเดี่ยว">บ้านเดี่ยว</option>
                    <option value="คอนโด">คอนโด</option>
                    <option value="ทาวน์เฮาส์">ทาวน์เฮาส์</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">
                    ทำเล
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all"
                    placeholder="เช่น บางนา, สาทร"
                    onChange={(e) => setCriteria({ ...criteria, location: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">
                    ราคาต่ำสุด (บาท)
                  </label>
                  <input
                    type="number"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all"
                    placeholder="0"
                    onChange={(e) => setCriteria({ ...criteria, minPrice: Number(e.target.value) })}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">
                    ราคาสูงสุด (บาท)
                  </label>
                  <input
                    type="number"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all"
                    placeholder="ไม่จำกัด"
                    onChange={(e) => setCriteria({ ...criteria, maxPrice: Number(e.target.value) })}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">
                    พื้นที่ขั้นต่ำ (ตร.ม.)
                  </label>
                  <input
                    type="number"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all"
                    placeholder="0"
                    onChange={(e) => setCriteria({ ...criteria, minArea: Number(e.target.value) })}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">
                    จำนวนห้องนอนขั้นต่ำ
                  </label>
                  <input
                    type="number"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all"
                    placeholder="0"
                    onChange={(e) => setCriteria({ ...criteria, bedrooms: Number(e.target.value) })}
                  />
                </div>
              </div>
              <div className="flex justify-end mt-6">
                <button
                  onClick={handleSearch}
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-xl shadow-lg shadow-blue-500/25 hover:shadow-xl transition-all"
                >
                  ค้นหาและวิเคราะห์
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Results */}
        {step === "results" && (
          <div>
            <div className="bg-white rounded-2xl p-5 mb-6 premium-shadow">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h2 className="text-lg font-bold text-slate-800">ผลการค้นหา</h2>
                  <p className="text-sm text-slate-400">พบ {selectedProperties.length} รายการที่ตรงกับเกณฑ์</p>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => setStep("criteria")}
                    className="px-4 py-2.5 border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 transition-all text-sm font-medium"
                  >
                    แก้ไขเกณฑ์
                  </button>
                  <button
                    onClick={() => setStep("comparison")}
                    disabled={selectedProperties.length < 2}
                    className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                      selectedProperties.length >= 2
                        ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/25"
                        : "bg-slate-200 text-slate-400 cursor-not-allowed"
                    }`}
                  >
                    เปรียบเทียบ ({selectedProperties.length})
                  </button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {selectedProperties.map((property) => (
                <div
                  key={property.id}
                  className="bg-white rounded-2xl p-5 premium-shadow hover:premium-shadow-hover transition-all"
                >
                  <div className="flex items-start justify-between mb-4">
                    <span className="px-3 py-1.5 bg-blue-100 text-blue-700 text-xs font-semibold rounded-lg">
                      {property.type}
                    </span>
                  </div>
                  <h3 className="font-semibold text-slate-800 mb-2">{property.title}</h3>
                  <div className="flex items-center gap-2 text-slate-500 text-sm mb-3">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    </svg>
                    {property.location}
                  </div>
                  <div className="text-sm text-slate-500 space-y-1 mb-4">
                    <div>พื้นที่: {property.area} ตร.ม.</div>
                    <div>ห้องนอน: {property.bedrooms}</div>
                    <div>อายุ: {property.age} ปี</div>
                  </div>
                  <div className="text-xl font-bold text-blue-600 mb-4">
                    ฿{formatPrice(property.price)}
                  </div>
                  <button className="w-full px-4 py-2.5 bg-slate-50 text-slate-600 rounded-xl text-sm font-medium hover:bg-blue-50 hover:text-blue-600 transition-all">
                    ดูรายละเอียด
                  </button>
                </div>
              ))}
            </div>

            {selectedProperties.length === 0 && (
              <div className="text-center py-16">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <SearchIcon className="w-8 h-8 text-slate-300" />
                </div>
                <p className="text-slate-500">ไม่พบอสังหาฯ ที่ตรงกับเกณฑ์</p>
                <button
                  onClick={() => setStep("criteria")}
                  className="mt-4 px-4 py-2 text-blue-600 hover:underline"
                >
                  ปรับเกณฑ์การค้นหาใหม่
                </button>
              </div>
            )}
          </div>
        )}

        {/* Step 3: Comparison */}
        {step === "comparison" && (
          <div className="bg-white rounded-2xl p-6 premium-shadow">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-slate-800">เปรียบเทียบอสังหาริมทรัพย์</h2>
              <button
                onClick={() => setStep("results")}
                className="px-4 py-2 border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 transition-all text-sm"
              >
                กลับ
              </button>
            </div>

            <div className="flex flex-wrap gap-2 mb-6">
              {["price", "area", "age", "facilities"].map((mode) => (
                <button
                  key={mode}
                  onClick={() => setCompareMode(mode as any)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                    compareMode === mode
                      ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/25"
                      : "bg-slate-50 text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  {mode === "price"
                    ? "ราคา"
                    : mode === "area"
                    ? "พื้นที่"
                    : mode === "age"
                    ? "อายุ"
                    : "สิ่งอำนวยความสะดวก"}
                </button>
              ))}
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100">
                    <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase">รายการ</th>
                    {selectedProperties.map((prop) => (
                      <th key={prop.id} className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase">
                        {prop.title}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {compareMode === "price" && (
                    <tr>
                      <td className="px-4 py-3 text-sm font-semibold text-slate-800">ราคา</td>
                      {selectedProperties.map((prop) => (
                        <td key={prop.id} className="px-4 py-3 text-sm font-bold text-blue-600">
                          ฿{formatPrice(prop.price)}
                        </td>
                      ))}
                    </tr>
                  )}
                  {compareMode === "area" && (
                    <>
                      <tr>
                        <td className="px-4 py-3 text-sm font-semibold text-slate-800">พื้นที่</td>
                        {selectedProperties.map((prop) => (
                          <td key={prop.id} className="px-4 py-3 text-sm text-slate-600">{prop.area} ตร.ม.</td>
                        ))}
                      </tr>
                      <tr>
                        <td className="px-4 py-3 text-sm font-semibold text-slate-800">ห้องนอน</td>
                        {selectedProperties.map((prop) => (
                          <td key={prop.id} className="px-4 py-3 text-sm text-slate-600">{prop.bedrooms} ห้อง</td>
                        ))}
                      </tr>
                      <tr>
                        <td className="px-4 py-3 text-sm font-semibold text-slate-800">ห้องน้ำ</td>
                        {selectedProperties.map((prop) => (
                          <td key={prop.id} className="px-4 py-3 text-sm text-slate-600">{prop.bathrooms} ห้อง</td>
                        ))}
                      </tr>
                    </>
                  )}
                  {compareMode === "age" && (
                    <tr>
                      <td className="px-4 py-3 text-sm font-semibold text-slate-800">อายุ</td>
                      {selectedProperties.map((prop) => (
                        <td key={prop.id} className="px-4 py-3 text-sm text-slate-600">{prop.age} ปี</td>
                      ))}
                    </tr>
                  )}
                  {compareMode === "facilities" && (
                    <tr>
                      <td className="px-4 py-3 text-sm font-semibold text-slate-800">สิ่งอำนวยความสะดวก</td>
                      {selectedProperties.map((prop) => (
                        <td key={prop.id} className="px-4 py-3 text-sm text-slate-600">
                          <ul className="list-disc list-inside">
                            {prop.facilities.map((f, i) => (
                              <li key={i}>{f}</li>
                            ))}
                          </ul>
                        </td>
                      ))}
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

function StepIndicator({
  number,
  label,
  isActive,
  isCompleted,
}: {
  number: number;
  label: string;
  isActive: boolean;
  isCompleted: boolean;
}) {
  return (
    <div className="flex items-center gap-3">
      <div
        className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold transition-all ${
          isActive
            ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/25"
            : isCompleted
            ? "bg-emerald-500 text-white"
            : "bg-slate-100 text-slate-400"
        }`}
      >
        {isCompleted ? <CheckCircleIcon className="w-4 h-4" /> : number}
      </div>
      <span
        className={`text-sm font-medium ${
          isActive ? "text-slate-800" : "text-slate-400"
        }`}
      >
        {label}
      </span>
    </div>
  );
}
