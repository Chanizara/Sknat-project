"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { emit } from "@/lib/socket";
import { useAuth } from "@/lib/auth";
import {
  ArrowLeftIcon,
  PlusIcon,
  SearchIcon,
  LocationIcon,
  AreaIcon,
  BedIcon,
  BuildingIcon,
} from "../components/Icons";

interface Property {
  id: number;
  type: "ขาย" | "เช่า";
  title: string;
  location: string;
  price: number;
  image?: string;
  images?: string[];
  propertyType?: string;
  size?: number;
  bedrooms?: number;
  bathrooms?: number;
  status?: string;
  sellerId?: number;
  createdAt: string;
}

interface SellerUser {
  id: number;
  role: "admin" | "seller";
  fullName?: string;
  username: string;
}

const PROPERTY_STATUS = {
  pending: "รอดำเนินการ",
  negotiating: "กำลังเจรจา",
  success: "สำเร็จ",
  failed: "ไม่สำเร็จ",
} as const;

type PropertyStatus = keyof typeof PROPERTY_STATUS;

const emptyForm = {
  type: "ขาย" as "ขาย" | "เช่า",
  title: "",
  location: "",
  price: "",
  image: "",
  propertyType: "บ้านเดี่ยว",
  size: "",
  bedrooms: "",
  bathrooms: "",
  status: "pending" as PropertyStatus,
  sellerId: "",
  description: "",
};

export default function PropertiesPage() {
  const { user } = useAuth();
  const basePath = user?.role === "seller" ? "/seller" : "/admin";
  const [properties, setProperties] = useState<Property[]>([]);
  const [imageErrors, setImageErrors] = useState<Record<number, boolean>>({});
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterSaleType, setFilterSaleType] = useState("all");
  const [showModal, setShowModal] = useState(false);
  const [editingProp, setEditingProp] = useState<Property | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");
  const [sellers, setSellers] = useState<SellerUser[]>([]);

  const isSeller = user?.role === "seller";

  const loadProperties = async () => {
    const payload = isSeller && user ? { sellerId: user.id } : {};
    const res = await emit<Property[]>("properties:list", payload);
    if (res.ok && res.data) {
      if (isSeller && user) {
        const assignedOnly = res.data.filter((p) => Number(p.sellerId) === Number(user.id));
        setProperties(assignedOnly);
      } else {
        setProperties(res.data);
      }
    }
    setLoading(false);
  };

  const loadSellers = async () => {
    const res = await emit<SellerUser[]>("users:list");
    if (res.ok && res.data) setSellers(res.data.filter((u) => u.role === "seller"));
  };

  useEffect(() => {
    if (!user) return;
    loadProperties();
    if (!isSeller) loadSellers();
  }, [user]);

  const filteredProps = properties.filter((p) => {
    const matchSearch = p.title.toLowerCase().includes(searchTerm.toLowerCase()) || p.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchType = filterType === "all" || p.propertyType === filterType;
    const matchSaleType = filterSaleType === "all" || p.type === filterSaleType;
    return matchSearch && matchType && matchSaleType;
  });

  const formatPrice = (n: number) => new Intl.NumberFormat("th-TH").format(n);

  const getPrimaryImage = (property: Property) => property.image || property.images?.[0] || "";

  const resolveImageSrc = (image?: string) => {
    if (!image) return "";
    if (/^https?:\/\//i.test(image) || image.startsWith("data:") || image.startsWith("blob:")) {
      return image;
    }
    return image.startsWith("/") ? image : `/${image}`;
  };

  const openAdd = () => {
    if (isSeller) return;
    setEditingProp(null);
    setForm(emptyForm);
    setFormError("");
    setShowModal(true);
  };

  const openEdit = (p: Property) => {
    setEditingProp(p);
    setForm({
      type: p.type,
      title: p.title,
      location: p.location,
      price: String(p.price),
      image: p.image ?? p.images?.[0] ?? "",
      propertyType: p.propertyType ?? "บ้านเดี่ยว",
      size: String(p.size ?? ""),
      bedrooms: String(p.bedrooms ?? ""),
      bathrooms: String(p.bathrooms ?? ""),
      status: (p.status as PropertyStatus) ?? "pending",
      sellerId: p.sellerId ? String(p.sellerId) : "",
      description: "",
    });
    setFormError("");
    setShowModal(true);
  };

  const handleSave = async () => {
    if (isSeller && !editingProp) {
      setFormError("คุณไม่มีสิทธิ์เพิ่มอสังหาริมทรัพย์");
      return;
    }
    setSaving(true);
    setFormError("");
    const payload = {
      ...(editingProp ? { id: editingProp.id } : {}),
      type: form.type,
      title: form.title,
      location: form.location,
      price: Number(form.price),
      image: form.image.trim() || undefined,
      propertyType: form.propertyType,
      size: form.size ? Number(form.size) : undefined,
      bedrooms: form.bedrooms ? Number(form.bedrooms) : undefined,
      bathrooms: form.bathrooms ? Number(form.bathrooms) : undefined,
      status: form.status,
      ...(isSeller && user ? { sellerId: user.id } : {}),
      ...(!isSeller && form.sellerId ? { sellerId: Number(form.sellerId) } : {}),
    };
    const event = editingProp ? "properties:update" : "properties:create";
    const res = await emit<Property>(event, payload);
    setSaving(false);
    if (!res.ok) { setFormError(res.error ?? "เกิดข้อผิดพลาด"); return; }
    setShowModal(false);
    loadProperties();
  };

  const handleDelete = async (id: number) => {
    if (!confirm("ลบอสังหาฯ นี้?")) return;
    await emit("properties:delete", { id, ...(isSeller && user ? { sellerId: user.id } : {}) });
    setProperties((prev) => prev.filter((p) => p.id !== id));
  };

  const sellerNameMap = Object.fromEntries(sellers.map((s) => [s.id, s.fullName ?? s.username]));

  const inputClass = "w-full px-4 py-3 bg-neutral-50 border border-neutral-100 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-neutral-300 transition-all";

  return (
    <div className="min-h-screen bg-white p-6 md:p-10 font-sans">
      {/* Header */}
      <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="flex items-start gap-4">
          <Link href={basePath} className="mt-1 p-2.5 text-neutral-400 hover:text-black hover:bg-neutral-50 border border-neutral-100 rounded-2xl transition-all">
            <ArrowLeftIcon className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-3xl font-light tracking-tight text-black mb-1">อสังหาริมทรัพย์</h1>
            <p className="text-sm text-neutral-500 tracking-wide">{isSeller ? "รายการอสังหาฯ ของคุณ" : "จัดการรายการอสังหาริมทรัพย์ทั้งหมด"}</p>
          </div>
        </div>
        {!isSeller && (
          <button onClick={openAdd} className="px-5 py-2.5 bg-black text-white text-sm font-medium rounded-2xl hover:bg-neutral-800 transition-all flex items-center gap-2 self-start md:self-auto">
            <PlusIcon className="w-4 h-4" />
            <span>เพิ่มอสังหาฯ</span>
          </button>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {[
          { label: "ทั้งหมด", value: properties.length, sub: "Total listings" },
          { label: "ประกาศขาย", value: properties.filter(p => p.type === "ขาย").length, sub: "For sale" },
          { label: "ประกาศเช่า", value: properties.filter(p => p.type === "เช่า").length, sub: "For rent" },
          { label: "มูลค่ารวม", value: loading ? "—" : `฿${formatPrice(properties.filter(p=>p.type==="ขาย").reduce((a,p)=>a+p.price,0))}`, sub: "Total value" },
        ].map((s, i) => (
          <div key={i} className="bg-white border border-neutral-100 p-6 rounded-3xl shadow-[0_2px_20px_-4px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-300">
            <p className="text-neutral-500 text-xs tracking-wider uppercase mb-2">{s.label}</p>
            <p className="text-2xl font-light text-black tracking-tight mb-1">{loading ? "—" : s.value}</p>
            <p className="text-neutral-400 text-xs">{s.sub}</p>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="bg-white border border-neutral-100 rounded-3xl p-5 mb-8 shadow-[0_2px_20px_-4px_rgba(0,0,0,0.04)]">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="relative flex-1">
            <input type="text" placeholder="ค้นหาชื่อหรือทำเล..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-neutral-50 border border-neutral-100 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-neutral-300 transition-all" />
            <SearchIcon className="w-4 h-4 text-neutral-400 absolute left-4 top-3.5" />
          </div>
          <div className="flex gap-3">
            <select value={filterSaleType} onChange={(e) => setFilterSaleType(e.target.value)} className="px-4 py-3 bg-neutral-50 border border-neutral-100 rounded-2xl text-sm focus:outline-none">
              <option value="all">ขาย/เช่า</option>
              <option value="ขาย">ขาย</option>
              <option value="เช่า">เช่า</option>
            </select>
            <select value={filterType} onChange={(e) => setFilterType(e.target.value)} className="px-4 py-3 bg-neutral-50 border border-neutral-100 rounded-2xl text-sm focus:outline-none">
              <option value="all">ทุกประเภท</option>
              <option value="บ้านเดี่ยว">บ้านเดี่ยว</option>
              <option value="คอนโด">คอนโด</option>
              <option value="ทาวน์เฮ้า">ทาวน์เฮ้า</option>
              <option value="ที่ดิน">ที่ดิน</option>
            </select>
          </div>
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {[0,1,2,3].map(i => <div key={i} className="h-72 bg-neutral-50 border border-neutral-100 rounded-3xl animate-pulse" />)}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filteredProps.map((p) => (
            <div key={p.id} className="group bg-white border border-neutral-100 rounded-3xl overflow-hidden shadow-[0_2px_20px_-4px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-300">
              <div className="relative h-48 bg-neutral-50 overflow-hidden">
                {getPrimaryImage(p) && !imageErrors[p.id] ? (
                  <img
                    src={resolveImageSrc(getPrimaryImage(p))}
                    alt={p.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    onError={() => setImageErrors((prev) => ({ ...prev, [p.id]: true }))}
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="flex flex-col items-center gap-2 text-center">
                      <BuildingIcon className="w-14 h-14 text-neutral-200" />
                      <span className="text-[11px] text-neutral-300">ไม่มีรูปภาพ</span>
                    </div>
                  </div>
                )}
                <div className="absolute top-3 left-3">
                  <span className="px-2.5 py-1 bg-black text-white text-[10px] font-semibold rounded-full">{p.type}</span>
                </div>
                {p.propertyType && (
                  <div className="absolute top-3 right-3">
                    <span className="px-2.5 py-1 bg-white/90 text-neutral-700 text-[10px] font-medium rounded-full border border-neutral-100">{p.propertyType}</span>
                  </div>
                )}
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-linear-to-t from-black/50 to-transparent">
                  <p className="text-lg font-light text-white tracking-tight">฿{formatPrice(p.price)}</p>
                </div>
              </div>
              <div className="p-5">
                <h3 className="font-medium text-black text-sm mb-2 line-clamp-1">{p.title}</h3>
                <div className="flex items-center gap-2 text-neutral-400 text-xs mb-3">
                  <LocationIcon className="w-3.5 h-3.5" />
                  <span className="truncate">{p.location}</span>
                </div>
                <div className="flex items-center gap-4 text-xs text-neutral-400 mb-3">
                  {p.size && <div className="flex items-center gap-1"><AreaIcon className="w-3.5 h-3.5" /><span>{p.size} ตร.ม.</span></div>}
                  {p.bedrooms && <div className="flex items-center gap-1"><BedIcon className="w-3.5 h-3.5" /><span>{p.bedrooms} นอน</span></div>}
                </div>
                <div className="mb-5 flex flex-wrap gap-2">
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-semibold border ${
                    p.status === "success"
                      ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                      : p.status === "failed"
                      ? "bg-red-50 text-red-500 border-red-100"
                      : p.status === "negotiating"
                      ? "bg-neutral-900 text-white border-neutral-900"
                      : "bg-amber-50 text-amber-600 border-amber-100"
                  }`}>
                    {PROPERTY_STATUS[(p.status as PropertyStatus) ?? "pending"]}
                  </span>
                  {!isSeller && p.sellerId && (
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-medium border border-neutral-200 bg-neutral-50 text-neutral-600">
                      ดูแลโดย: {sellerNameMap[p.sellerId] ?? `Seller #${p.sellerId}`}
                    </span>
                  )}
                </div>
                <div className="flex gap-2 pt-4 border-t border-neutral-100">
                  <button onClick={() => openEdit(p)} className="flex-1 px-4 py-2.5 bg-neutral-50 border border-neutral-100 text-neutral-600 rounded-2xl text-xs font-medium hover:bg-neutral-100 transition-all">
                    {isSeller ? "อัปเดตสถานะ" : "แก้ไข"}
                  </button>
                  {!isSeller && (
                    <button onClick={() => handleDelete(p.id)} className="flex-1 px-4 py-2.5 bg-red-50 border border-red-100 text-red-500 rounded-2xl text-xs font-medium hover:bg-red-100 transition-all">ลบ</button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && filteredProps.length === 0 && (
        <div className="text-center py-16">
          <div className="w-16 h-16 bg-neutral-50 border border-neutral-100 rounded-3xl flex items-center justify-center mx-auto mb-4">
            <BuildingIcon className="w-7 h-7 text-neutral-300" />
          </div>
          <p className="text-neutral-400 text-sm">{isSeller ? "ยังไม่มีบ้านที่คุณได้รับมอบหมายให้ดูแล" : "ไม่พบอสังหาริมทรัพย์"}</p>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-8 shadow-2xl border border-neutral-100 max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-light text-black mb-6">{editingProp ? "แก้ไขอสังหาฯ" : "เพิ่มอสังหาฯ ใหม่"}</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {isSeller ? (
                  <>
                    <div className="col-span-2">
                      <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-2">ชื่ออสังหาฯ</label>
                      <input value={form.title} readOnly className={inputClass} />
                    </div>
                    <div className="col-span-2">
                      <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-2">สถานะ</label>
                      <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as PropertyStatus })} className={inputClass}>
                        <option value="pending">รอดำเนินการ</option>
                        <option value="negotiating">กำลังเจรจา</option>
                        <option value="success">สำเร็จ</option>
                        <option value="failed">ไม่สำเร็จ</option>
                      </select>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="col-span-2">
                      <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-2">ชื่อ</label>
                      <input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="ชื่ออสังหาฯ" className={inputClass} />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-2">ประเภทการขาย</label>
                      <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value as "ขาย"|"เช่า" })} className={inputClass}>
                        <option value="ขาย">ขาย</option>
                        <option value="เช่า">เช่า</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-2">ประเภทอสังหาฯ</label>
                      <select value={form.propertyType} onChange={(e) => setForm({ ...form, propertyType: e.target.value })} className={inputClass}>
                        <option value="บ้านเดี่ยว">บ้านเดี่ยว</option>
                        <option value="คอนโด">คอนโด</option>
                        <option value="ทาวน์เฮ้า">ทาวน์เฮ้า</option>
                        <option value="ที่ดิน">ที่ดิน</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-2">ราคา (บาท)</label>
                      <input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} placeholder="0" className={inputClass} />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-2">ทำเล</label>
                      <input type="text" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} placeholder="เช่น บางนา กรุงเทพฯ" className={inputClass} />
                    </div>
                    <div className="col-span-2">
                      <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-2">รูปภาพ (URL หรือ path)</label>
                      <input
                        type="text"
                        value={form.image}
                        onChange={(e) => setForm({ ...form, image: e.target.value })}
                        placeholder="เช่น https://... หรือ /hero_1.jpg"
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-2">พื้นที่ (ตร.ม.)</label>
                      <input type="number" value={form.size} onChange={(e) => setForm({ ...form, size: e.target.value })} placeholder="0" className={inputClass} />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-2">ห้องนอน</label>
                      <input type="number" value={form.bedrooms} onChange={(e) => setForm({ ...form, bedrooms: e.target.value })} placeholder="0" className={inputClass} />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-2">ห้องน้ำ</label>
                      <input type="number" value={form.bathrooms} onChange={(e) => setForm({ ...form, bathrooms: e.target.value })} placeholder="0" className={inputClass} />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-2">สถานะ</label>
                      <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as PropertyStatus })} className={inputClass}>
                        <option value="pending">รอดำเนินการ</option>
                        <option value="negotiating">กำลังเจรจา</option>
                        <option value="success">สำเร็จ</option>
                        <option value="failed">ไม่สำเร็จ</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-2">ผู้ดูแล</label>
                      <select value={form.sellerId} onChange={(e) => setForm({ ...form, sellerId: e.target.value })} className={inputClass}>
                        <option value="">ยังไม่กำหนด</option>
                        {sellers.map((s) => (
                          <option key={s.id} value={s.id}>{s.fullName ?? s.username}</option>
                        ))}
                      </select>
                    </div>
                  </>
                )}
              </div>
              {formError && <p className="text-xs text-red-500 bg-red-50 border border-red-100 px-4 py-3 rounded-2xl">{formError}</p>}
              <div className="flex justify-end gap-3 pt-4 border-t border-neutral-100">
                <button onClick={() => setShowModal(false)} className="px-5 py-2.5 text-sm font-medium text-neutral-600 hover:bg-neutral-50 border border-neutral-100 rounded-2xl transition-all">ยกเลิก</button>
                <button onClick={handleSave} disabled={saving} className="px-5 py-2.5 text-sm font-medium text-white bg-black hover:bg-neutral-800 rounded-2xl transition-all disabled:opacity-50">
                  {saving ? "กำลังบันทึก..." : "บันทึก"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
