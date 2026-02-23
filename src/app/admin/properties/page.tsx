"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeftIcon,
  PlusIcon,
  SearchIcon,
  LocationIcon,
  AreaIcon,
  BedIcon,
  EditIcon,
  TrashIcon,
  BuildingIcon,
  FilterIcon,
} from "../components/Icons";

interface Property {
  id: number;
  title: string;
  type: "บ้านเดี่ยว" | "คอนโด" | "ทาวน์เฮาส์" | "ที่ดิน" | "บ้านแฝด";
  price: number;
  location: string;
  area: number;
  bedrooms?: number;
  bathrooms?: number;
  status: "available" | "sold" | "reserved";
  image?: string;
}

export default function PropertiesPage() {
  const [properties, setProperties] = useState<Property[]>([
    {
      id: 1,
      title: "บ้านเดี่ยว 2 ชั้น ใกล้ BTS",
      type: "บ้านเดี่ยว",
      price: 5900000,
      location: "บางนา กรุงเทพฯ",
      area: 250,
      bedrooms: 3,
      bathrooms: 3,
      status: "available",
    },
    {
      id: 2,
      title: "คอนโดหรู วิวแม่น้ำ",
      type: "คอนโด",
      price: 3200000,
      location: "สาทร กรุงเทพฯ",
      area: 45,
      bedrooms: 1,
      bathrooms: 1,
      status: "available",
    },
    {
      id: 3,
      title: "ทาวน์เฮาส์ 3 ชั้น",
      type: "ทาวน์เฮาส์",
      price: 4500000,
      location: "ลาดพร้าว กรุงเทพฯ",
      area: 180,
      bedrooms: 3,
      bathrooms: 2,
      status: "reserved",
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [showModal, setShowModal] = useState(false);
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);

  const filteredProperties = properties.filter((property) => {
    const matchesSearch =
      property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === "all" || property.type === filterType;
    const matchesStatus = filterStatus === "all" || property.status === filterStatus;
    return matchesSearch && matchesType && matchesStatus;
  });

  const handleDelete = (id: number) => {
    if (confirm("คุณแน่ใจหรือไม่ที่จะลบอสังหาฯ นี้?")) {
      setProperties(properties.filter((p) => p.id !== id));
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("th-TH").format(price);
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "available":
        return "bg-emerald-500 text-white";
      case "reserved":
        return "bg-amber-500 text-white";
      case "sold":
        return "bg-blue-500 text-white";
      default:
        return "bg-slate-500 text-white";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "available":
        return "พร้อมขาย";
      case "reserved":
        return "จองแล้ว";
      case "sold":
        return "ขายแล้ว";
      default:
        return status;
    }
  };

  const typeColors: Record<string, string> = {
    "บ้านเดี่ยว": "from-blue-500 to-blue-600",
    "คอนโด": "from-indigo-500 to-indigo-600",
    "ทาวน์เฮาส์": "from-violet-500 to-violet-600",
    "ที่ดิน": "from-emerald-500 to-emerald-600",
    "บ้านแฝด": "from-cyan-500 to-cyan-600",
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
                  จัดการอสังหาริมทรัพย์
                </h1>
                <p className="text-xs text-slate-400">
                  เพิ่ม ลบ แก้ไข ข้อมูลอสังหาฯ
                </p>
              </div>
            </div>
            <button
              onClick={() => {
                setEditingProperty(null);
                setShowModal(true);
              }}
              className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-medium rounded-xl shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30 transition-all flex items-center gap-2"
            >
              <PlusIcon className="w-4 h-4" />
              <span>เพิ่มอสังหาฯ</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-[1600px] mx-auto px-6 py-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-2xl p-5 premium-shadow">
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">อสังหาฯ ทั้งหมด</div>
            <div className="text-2xl font-bold text-slate-800">{properties.length}</div>
          </div>
          <div className="bg-white rounded-2xl p-5 premium-shadow">
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">พร้อมขาย</div>
            <div className="text-2xl font-bold text-emerald-600">{properties.filter(p => p.status === "available").length}</div>
          </div>
          <div className="bg-white rounded-2xl p-5 premium-shadow">
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">จองแล้ว</div>
            <div className="text-2xl font-bold text-amber-500">{properties.filter(p => p.status === "reserved").length}</div>
          </div>
          <div className="bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl p-5 text-white">
            <div className="text-xs font-semibold text-blue-200 uppercase tracking-wider mb-1">มูลค่ารวม</div>
            <div className="text-2xl font-bold">฿{formatPrice(properties.reduce((acc, p) => acc + p.price, 0))}</div>
          </div>
        </div>

        {/* Search & Filter */}
        <div className="bg-white rounded-2xl p-4 mb-6 premium-shadow">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="ค้นหาด้วยชื่อหรือทำเล..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all"
              />
              <SearchIcon className="w-4 h-4 text-slate-400 absolute left-4 top-3.5" />
            </div>
            <div className="flex gap-3">
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all"
              >
                <option value="all">ทุกประเภท</option>
                <option value="บ้านเดี่ยว">บ้านเดี่ยว</option>
                <option value="คอนโด">คอนโด</option>
                <option value="ทาวน์เฮาส์">ทาวน์เฮาส์</option>
                <option value="ที่ดิน">ที่ดิน</option>
                <option value="บ้านแฝด">บ้านแฝด</option>
              </select>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all"
              >
                <option value="all">ทุกสถานะ</option>
                <option value="available">พร้อมขาย</option>
                <option value="reserved">จองแล้ว</option>
                <option value="sold">ขายแล้ว</option>
              </select>
            </div>
          </div>
        </div>

        {/* Properties Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filteredProperties.map((property) => (
            <div
              key={property.id}
              className="group bg-white rounded-2xl overflow-hidden premium-shadow hover:premium-shadow-hover transition-all duration-300"
            >
              {/* Image */}
              <div className="relative h-48 bg-gradient-to-br from-slate-100 to-slate-200 overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <BuildingIcon className="w-16 h-16 text-slate-300" />
                </div>
                
                {/* Type Badge */}
                <div className="absolute top-4 left-4">
                  <span className={`px-3 py-1.5 bg-gradient-to-r ${typeColors[property.type] || "from-slate-500 to-slate-600"} text-white text-xs font-semibold rounded-lg shadow-lg`}>
                    {property.type}
                  </span>
                </div>
                
                {/* Status Badge */}
                <div className="absolute top-4 right-4">
                  <span className={`px-3 py-1.5 ${getStatusStyle(property.status)} text-xs font-semibold rounded-lg shadow-lg`}>
                    {getStatusText(property.status)}
                  </span>
                </div>
                
                {/* Price Overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent">
                  <p className="text-xl font-bold text-white">฿{formatPrice(property.price)}</p>
                </div>
              </div>

              {/* Content */}
              <div className="p-5">
                <h3 className="font-semibold text-slate-800 mb-2 line-clamp-1 group-hover:text-blue-600 transition-colors">
                  {property.title}
                </h3>
                
                <div className="flex items-center gap-2 text-slate-500 text-sm mb-3">
                  <LocationIcon className="w-4 h-4 text-blue-400" />
                  <span className="truncate">{property.location}</span>
                </div>

                <div className="flex items-center gap-4 text-xs text-slate-500 mb-4">
                  <div className="flex items-center gap-1.5">
                    <AreaIcon className="w-3.5 h-3.5" />
                    <span>{property.area} ตร.ม.</span>
                  </div>
                  {property.bedrooms && (
                    <div className="flex items-center gap-1.5">
                      <BedIcon className="w-3.5 h-3.5" />
                      <span>{property.bedrooms} นอน</span>
                    </div>
                  )}
                  {property.bathrooms && (
                    <div className="flex items-center gap-1.5">
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      <span>{property.bathrooms} น้ำ</span>
                    </div>
                  )}
                </div>

                <div className="flex gap-2 pt-4 border-t border-slate-100">
                  <button
                    onClick={() => {
                      setEditingProperty(property);
                      setShowModal(true);
                    }}
                    className="flex-1 px-4 py-2.5 bg-slate-50 text-slate-600 rounded-xl text-sm font-medium hover:bg-blue-50 hover:text-blue-600 transition-all"
                  >
                    แก้ไข
                  </button>
                  <button
                    onClick={() => handleDelete(property.id)}
                    className="flex-1 px-4 py-2.5 bg-red-50 text-red-600 rounded-xl text-sm font-medium hover:bg-red-100 transition-all"
                  >
                    ลบ
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredProperties.length === 0 && (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <SearchIcon className="w-8 h-8 text-slate-300" />
            </div>
            <p className="text-slate-400">ไม่พบข้อมูลอสังหาริมทรัพย์</p>
          </div>
        )}
      </main>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-blue-950/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-bold text-slate-800 mb-6">
              {editingProperty ? "แก้ไขข้อมูลอสังหาฯ" : "เพิ่มอสังหาฯ ใหม่"}
            </h3>
            <form className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">
                    ชื่ออสังหาฯ
                  </label>
                  <input
                    type="text"
                    defaultValue={editingProperty?.title}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all"
                    placeholder="เช่น บ้านเดี่ยว 2 ชั้น ..."
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">
                    ประเภท
                  </label>
                  <select
                    defaultValue={editingProperty?.type}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all"
                  >
                    <option value="บ้านเดี่ยว">บ้านเดี่ยว</option>
                    <option value="คอนโด">คอนโด</option>
                    <option value="ทาวน์เฮาส์">ทาวน์เฮาส์</option>
                    <option value="ที่ดิน">ที่ดิน</option>
                    <option value="บ้านแฝด">บ้านแฝด</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">
                    ราคา (บาท)
                  </label>
                  <input
                    type="number"
                    defaultValue={editingProperty?.price}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">
                    ทำเล
                  </label>
                  <input
                    type="text"
                    defaultValue={editingProperty?.location}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all"
                    placeholder="เช่น บางนา กรุงเทพฯ"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">
                    พื้นที่ (ตร.ม.)
                  </label>
                  <input
                    type="number"
                    defaultValue={editingProperty?.area}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all"
                    placeholder="0"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">
                      ห้องนอน
                    </label>
                    <input
                      type="number"
                      defaultValue={editingProperty?.bedrooms}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all"
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">
                      ห้องน้ำ
                    </label>
                    <input
                      type="number"
                      defaultValue={editingProperty?.bathrooms}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all"
                      placeholder="0"
                    />
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-5 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 rounded-xl transition-all"
                >
                  ยกเลิก
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-5 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl shadow-lg shadow-blue-500/25 hover:shadow-xl transition-all"
                >
                  บันทึก
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
