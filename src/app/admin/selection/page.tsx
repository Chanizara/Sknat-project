"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ArrowLeftIcon,
  SearchIcon,
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
  const pathname = usePathname();
  const basePath = pathname.startsWith("/seller") ? "/seller" : "/admin";
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

  const formatPrice = (price: number) => new Intl.NumberFormat("th-TH").format(price);

  const inputClass = "w-full px-4 py-3 bg-neutral-50 border border-neutral-100 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-neutral-300 transition-all";

  return (
    <div className="min-h-screen bg-white p-6 md:p-10 font-sans">
      {/* Header */}
      <div className="mb-10 flex items-start gap-4">
        <Link
          href={basePath}
          className="mt-1 p-2.5 text-neutral-400 hover:text-black hover:bg-neutral-50 border border-neutral-100 rounded-2xl transition-all"
        >
          <ArrowLeftIcon className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="text-3xl font-light tracking-tight text-black mb-1">
            คัดเลือกอสังหาริมทรัพย์
          </h1>
          <p className="text-sm text-neutral-500 tracking-wide">ระบบสนับสนุนการตัดสินใจ</p>
        </div>
      </div>

      {/* Steps */}
      <div className="flex items-center justify-center mb-10">
        <div className="bg-white border border-neutral-100 rounded-3xl px-6 py-4 shadow-[0_2px_20px_-4px_rgba(0,0,0,0.04)] flex items-center gap-4">
          <StepIndicator number={1} label="กำหนดเกณฑ์" isActive={step === "criteria"} isCompleted={step !== "criteria"} />
          <ChevronRightIcon className="w-4 h-4 text-neutral-200" />
          <StepIndicator number={2} label="ผลลัพธ์" isActive={step === "results"} isCompleted={step === "comparison"} />
          <ChevronRightIcon className="w-4 h-4 text-neutral-200" />
          <StepIndicator number={3} label="เปรียบเทียบ" isActive={step === "comparison"} isCompleted={false} />
        </div>
      </div>

      {/* Step 1: Criteria */}
      {step === "criteria" && (
        <div className="max-w-2xl mx-auto">
          <div className="bg-white border border-neutral-100 rounded-3xl p-8 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)]">
            <h2 className="text-sm font-semibold text-black tracking-wide uppercase mb-6">กำหนดเกณฑ์การค้นหา</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-2">ประเภทอสังหาฯ</label>
                <select className={inputClass} onChange={(e) => setCriteria({ ...criteria, type: e.target.value })}>
                  <option value="">ทั้งหมด</option>
                  <option value="บ้านเดี่ยว">บ้านเดี่ยว</option>
                  <option value="คอนโด">คอนโด</option>
                  <option value="ทาวน์เฮาส์">ทาวน์เฮาส์</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-2">ทำเล</label>
                <input
                  type="text"
                  className={inputClass}
                  placeholder="เช่น บางนา, สาทร"
                  onChange={(e) => setCriteria({ ...criteria, location: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-2">ราคาต่ำสุด (บาท)</label>
                <input
                  type="number"
                  className={inputClass}
                  placeholder="0"
                  onChange={(e) => setCriteria({ ...criteria, minPrice: Number(e.target.value) })}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-2">ราคาสูงสุด (บาท)</label>
                <input
                  type="number"
                  className={inputClass}
                  placeholder="ไม่จำกัด"
                  onChange={(e) => setCriteria({ ...criteria, maxPrice: Number(e.target.value) })}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-2">พื้นที่ขั้นต่ำ (ตร.ม.)</label>
                <input
                  type="number"
                  className={inputClass}
                  placeholder="0"
                  onChange={(e) => setCriteria({ ...criteria, minArea: Number(e.target.value) })}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-2">จำนวนห้องนอนขั้นต่ำ</label>
                <input
                  type="number"
                  className={inputClass}
                  placeholder="0"
                  onChange={(e) => setCriteria({ ...criteria, bedrooms: Number(e.target.value) })}
                />
              </div>
            </div>
            <div className="flex justify-end mt-8 pt-6 border-t border-neutral-100">
              <button
                onClick={handleSearch}
                className="px-6 py-3 bg-black text-white font-medium text-sm rounded-2xl hover:bg-neutral-800 transition-all"
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
          <div className="bg-white border border-neutral-100 rounded-3xl p-6 mb-6 shadow-[0_2px_20px_-4px_rgba(0,0,0,0.04)]">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="text-sm font-semibold text-black tracking-wide uppercase">ผลการค้นหา</h2>
                <p className="text-xs text-neutral-400 mt-1">พบ {selectedProperties.length} รายการที่ตรงกับเกณฑ์</p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setStep("criteria")}
                  className="px-4 py-2.5 bg-neutral-50 border border-neutral-100 text-neutral-600 rounded-2xl hover:bg-neutral-100 transition-all text-sm font-medium"
                >
                  แก้ไขเกณฑ์
                </button>
                <button
                  onClick={() => setStep("comparison")}
                  disabled={selectedProperties.length < 2}
                  className={`px-4 py-2.5 rounded-2xl text-sm font-medium transition-all ${
                    selectedProperties.length >= 2
                      ? "bg-black text-white hover:bg-neutral-800"
                      : "bg-neutral-100 text-neutral-300 cursor-not-allowed"
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
                className="bg-white border border-neutral-100 rounded-3xl p-6 shadow-[0_2px_20px_-4px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-300"
              >
                <div className="mb-4">
                  <span className="px-2.5 py-1 bg-neutral-50 border border-neutral-100 text-neutral-600 text-xs font-medium rounded-full">
                    {property.type}
                  </span>
                </div>
                <h3 className="font-medium text-black text-sm mb-2">{property.title}</h3>
                <div className="flex items-center gap-2 text-neutral-400 text-xs mb-3">
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  </svg>
                  {property.location}
                </div>
                <div className="space-y-1 text-xs text-neutral-500 mb-5">
                  <div>พื้นที่: {property.area} ตร.ม.</div>
                  <div>ห้องนอน: {property.bedrooms}</div>
                  <div>อายุ: {property.age} ปี</div>
                </div>
                <div className="text-xl font-light text-black tracking-tight mb-5">
                  ฿{formatPrice(property.price)}
                </div>
                <button className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-100 text-neutral-600 rounded-2xl text-sm font-medium hover:bg-neutral-100 transition-all">
                  ดูรายละเอียด
                </button>
              </div>
            ))}
          </div>

          {selectedProperties.length === 0 && (
            <div className="text-center py-16">
              <div className="w-16 h-16 bg-neutral-50 border border-neutral-100 rounded-3xl flex items-center justify-center mx-auto mb-4">
                <SearchIcon className="w-7 h-7 text-neutral-300" />
              </div>
              <p className="text-neutral-400 text-sm">ไม่พบอสังหาฯ ที่ตรงกับเกณฑ์</p>
              <button
                onClick={() => setStep("criteria")}
                className="mt-4 px-4 py-2 text-sm text-neutral-500 hover:text-black transition-colors"
              >
                ปรับเกณฑ์การค้นหาใหม่
              </button>
            </div>
          )}
        </div>
      )}

      {/* Step 3: Comparison */}
      {step === "comparison" && (
        <div className="bg-white border border-neutral-100 rounded-3xl p-8 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)]">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-sm font-semibold text-black tracking-wide uppercase">เปรียบเทียบอสังหาริมทรัพย์</h2>
            <button
              onClick={() => setStep("results")}
              className="px-4 py-2 bg-neutral-50 border border-neutral-100 text-neutral-600 rounded-2xl hover:bg-neutral-100 transition-all text-sm"
            >
              กลับ
            </button>
          </div>

          <div className="flex flex-wrap gap-2 mb-6">
            {["price", "area", "age", "facilities"].map((mode) => (
              <button
                key={mode}
                onClick={() => setCompareMode(mode as any)}
                className={`px-4 py-2 rounded-2xl text-sm font-medium transition-all ${
                  compareMode === mode
                    ? "bg-black text-white"
                    : "bg-neutral-50 border border-neutral-100 text-neutral-600 hover:bg-neutral-100"
                }`}
              >
                {mode === "price" ? "ราคา" : mode === "area" ? "พื้นที่" : mode === "age" ? "อายุ" : "สิ่งอำนวยความสะดวก"}
              </button>
            ))}
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-neutral-100">
                  <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-400 uppercase tracking-wider">รายการ</th>
                  {selectedProperties.map((prop) => (
                    <th key={prop.id} className="px-4 py-3 text-left text-xs font-semibold text-neutral-400 uppercase tracking-wider">
                      {prop.title}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100/50">
                {compareMode === "price" && (
                  <tr className="hover:bg-neutral-50/50 transition-colors">
                    <td className="px-4 py-3 text-sm font-medium text-black">ราคา</td>
                    {selectedProperties.map((prop) => (
                      <td key={prop.id} className="px-4 py-3 text-lg font-light text-black">
                        ฿{formatPrice(prop.price)}
                      </td>
                    ))}
                  </tr>
                )}
                {compareMode === "area" && (
                  <>
                    <tr className="hover:bg-neutral-50/50 transition-colors">
                      <td className="px-4 py-3 text-sm font-medium text-black">พื้นที่</td>
                      {selectedProperties.map((prop) => (
                        <td key={prop.id} className="px-4 py-3 text-sm text-neutral-600">{prop.area} ตร.ม.</td>
                      ))}
                    </tr>
                    <tr className="hover:bg-neutral-50/50 transition-colors">
                      <td className="px-4 py-3 text-sm font-medium text-black">ห้องนอน</td>
                      {selectedProperties.map((prop) => (
                        <td key={prop.id} className="px-4 py-3 text-sm text-neutral-600">{prop.bedrooms} ห้อง</td>
                      ))}
                    </tr>
                    <tr className="hover:bg-neutral-50/50 transition-colors">
                      <td className="px-4 py-3 text-sm font-medium text-black">ห้องน้ำ</td>
                      {selectedProperties.map((prop) => (
                        <td key={prop.id} className="px-4 py-3 text-sm text-neutral-600">{prop.bathrooms} ห้อง</td>
                      ))}
                    </tr>
                  </>
                )}
                {compareMode === "age" && (
                  <tr className="hover:bg-neutral-50/50 transition-colors">
                    <td className="px-4 py-3 text-sm font-medium text-black">อายุ</td>
                    {selectedProperties.map((prop) => (
                      <td key={prop.id} className="px-4 py-3 text-sm text-neutral-600">{prop.age} ปี</td>
                    ))}
                  </tr>
                )}
                {compareMode === "facilities" && (
                  <tr className="hover:bg-neutral-50/50 transition-colors">
                    <td className="px-4 py-3 text-sm font-medium text-black">สิ่งอำนวยความสะดวก</td>
                    {selectedProperties.map((prop) => (
                      <td key={prop.id} className="px-4 py-3 text-sm text-neutral-600">
                        <ul className="space-y-1">
                          {prop.facilities.map((f, i) => (
                            <li key={i} className="flex items-center gap-1.5">
                              <span className="w-1 h-1 rounded-full bg-neutral-300" />
                              {f}
                            </li>
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
        className={`w-8 h-8 rounded-xl flex items-center justify-center text-sm font-semibold transition-all ${
          isActive
            ? "bg-black text-white"
            : isCompleted
            ? "bg-emerald-500 text-white"
            : "bg-neutral-100 text-neutral-400"
        }`}
      >
        {isCompleted ? <CheckCircleIcon className="w-4 h-4" /> : number}
      </div>
      <span className={`text-sm font-medium ${isActive ? "text-black" : "text-neutral-400"}`}>
        {label}
      </span>
    </div>
  );
}
