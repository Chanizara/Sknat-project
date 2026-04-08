"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
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
  images?: string[] | PropertyImageGroups | string;
  category?: string;
  propertyType?: string;
  size?: number;
  bedrooms?: number;
  bathrooms?: number;
  description?: string;
  status?: string;
  sellerId?: number;
  createdAt: string;
}

type PropertyImageGroups = {
  exterior?: string[];
  interior?: string[];
  surroundings?: string[];
};

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

const IMAGE_GROUP_LIMITS = {
  exterior: 7,
  interior: 7,
  surroundings: 3,
} as const;

const MISSING_IMAGE_MAP: Record<string, string> = {
  "/house1.jpg": "/hero_1.jpg",
  "/house2.jpg": "/hero_2.jpg",
  "/house3.jpg": "/hero_3.jpg",
  "/house4.jpg": "/hero_1.jpg",
  "/house5.avif": "/hero_2.jpg",
};

function createImageSlots(count: number) {
  return Array.from({ length: count }, () => "");
}

function fillImageSlots(values: unknown, count: number) {
  const normalized = Array.isArray(values)
    ? values.map((value) => (typeof value === "string" ? value.trim() : "")).filter(Boolean)
    : [];
  return [...normalized, ...createImageSlots(count)].slice(0, count);
}

function parsePropertyImages(images: Property["images"]) {
  let source: unknown = images;

  if (typeof source === "string") {
    try {
      source = JSON.parse(source);
    } catch {
      source = source ? [source] : [];
    }
  }

  if (Array.isArray(source)) {
    return {
      exterior: fillImageSlots(source.slice(0, IMAGE_GROUP_LIMITS.exterior), IMAGE_GROUP_LIMITS.exterior),
      interior: fillImageSlots(
        source.slice(IMAGE_GROUP_LIMITS.exterior, IMAGE_GROUP_LIMITS.exterior + IMAGE_GROUP_LIMITS.interior),
        IMAGE_GROUP_LIMITS.interior,
      ),
      surroundings: fillImageSlots(source.slice(IMAGE_GROUP_LIMITS.exterior + IMAGE_GROUP_LIMITS.interior), IMAGE_GROUP_LIMITS.surroundings),
    };
  }

  if (source && typeof source === "object") {
    const groups = source as PropertyImageGroups & { overview?: string[] };
    return {
      exterior: fillImageSlots(groups.exterior ?? groups.overview, IMAGE_GROUP_LIMITS.exterior),
      interior: fillImageSlots(groups.interior, IMAGE_GROUP_LIMITS.interior),
      surroundings: fillImageSlots(groups.surroundings, IMAGE_GROUP_LIMITS.surroundings),
    };
  }

  return {
    exterior: createImageSlots(IMAGE_GROUP_LIMITS.exterior),
    interior: createImageSlots(IMAGE_GROUP_LIMITS.interior),
    surroundings: createImageSlots(IMAGE_GROUP_LIMITS.surroundings),
  };
}

function flattenImageGroups(groups: PropertyImageGroups) {
  return [
    ...(groups.exterior ?? []),
    ...(groups.interior ?? []),
    ...(groups.surroundings ?? []),
  ].map((value) => value.trim()).filter(Boolean);
}

const emptyForm = {
  type: "ขาย" as "ขาย" | "เช่า",
  title: "",
  location: "",
  price: "",
  image: "",
  category: "ที่อยู่อาศัย",
  propertyType: "บ้านเดี่ยว",
  size: "",
  bedrooms: "",
  bathrooms: "",
  status: "pending" as PropertyStatus,
  sellerId: "",
  description: "",
  exteriorImages: createImageSlots(IMAGE_GROUP_LIMITS.exterior),
  interiorImages: createImageSlots(IMAGE_GROUP_LIMITS.interior),
  surroundingsImages: createImageSlots(IMAGE_GROUP_LIMITS.surroundings),
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
  const [uploadingField, setUploadingField] = useState<string | null>(null);

  const isSeller = user?.role === "seller";

  const isSoldProperty = useCallback((property: Property) => {
    const normalizedStatus = String(property.status ?? "").toLowerCase();
    return normalizedStatus === "success" || normalizedStatus === "sold" || normalizedStatus === "completed";
  }, []);

  const loadProperties = useCallback(async () => {
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
  }, [isSeller, user]);

  const loadSellers = useCallback(async () => {
    const res = await emit<SellerUser[]>("users:list");
    if (res.ok && res.data) setSellers(res.data.filter((u) => u.role === "seller"));
  }, []);

  useEffect(() => {
    if (!user) return;
    void Promise.resolve().then(loadProperties);
    if (!isSeller) {
      void Promise.resolve().then(loadSellers);
    }
  }, [isSeller, loadProperties, loadSellers, user]);

  const filteredProps = useMemo(() => properties.filter((p) => {
    const matchSearch = p.title.toLowerCase().includes(searchTerm.toLowerCase()) || p.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchType = filterType === "all" || p.propertyType === filterType;
    const matchSaleType = filterSaleType === "all" || p.type === filterSaleType;
    return matchSearch && matchType && matchSaleType;
  }), [filterSaleType, filterType, properties, searchTerm]);

  const activeProperties = filteredProps.filter((property) => !isSoldProperty(property));
  const soldProperties = filteredProps.filter((property) => isSoldProperty(property));

  const formatPrice = (n: number) => new Intl.NumberFormat("th-TH").format(n);

  const getPrimaryImage = (property: Property) => {
    const grouped = parsePropertyImages(property.images);
    return property.image || flattenImageGroups(grouped)[0] || "";
  };

  const resolveImageSrc = (image?: string) => {
    if (!image) return "";
    const mapped = MISSING_IMAGE_MAP[image] ?? image;
    if (/^https?:\/\//i.test(mapped) || mapped.startsWith("data:") || mapped.startsWith("blob:")) {
      return mapped;
    }
    return mapped.startsWith("/") ? mapped : `/${mapped}`;
  };

  const updateImageField = (
    group: "exteriorImages" | "interiorImages" | "surroundingsImages",
    index: number,
    value: string,
  ) => {
    setForm((prev) => {
      const nextGroup = [...prev[group]];
      nextGroup[index] = value;
      return { ...prev, [group]: nextGroup };
    });
  };

  const getFormPrimaryImage = (nextForm = form) => {
    const firstGrouped = flattenImageGroups({
      exterior: nextForm.exteriorImages,
      interior: nextForm.interiorImages,
      surroundings: nextForm.surroundingsImages,
    })[0];
    return nextForm.image.trim() || firstGrouped || "";
  };

  const openAdd = () => {
    if (isSeller) return;
    setEditingProp(null);
    setForm({
      ...emptyForm,
      exteriorImages: createImageSlots(IMAGE_GROUP_LIMITS.exterior),
      interiorImages: createImageSlots(IMAGE_GROUP_LIMITS.interior),
      surroundingsImages: createImageSlots(IMAGE_GROUP_LIMITS.surroundings),
    });
    setFormError("");
    setShowModal(true);
  };

  const openEdit = (p: Property) => {
    const groupedImages = parsePropertyImages(p.images);
    setEditingProp(p);
    setForm({
      type: p.type,
      title: p.title,
      location: p.location,
      price: String(p.price),
      image: p.image ?? flattenImageGroups(groupedImages)[0] ?? "",
      category: p.category ?? "ที่อยู่อาศัย",
      propertyType: p.propertyType ?? "บ้านเดี่ยว",
      size: String(p.size ?? ""),
      bedrooms: String(p.bedrooms ?? ""),
      bathrooms: String(p.bathrooms ?? ""),
      status: (p.status as PropertyStatus) ?? "pending",
      sellerId: p.sellerId ? String(p.sellerId) : "",
      description: p.description ?? "",
      exteriorImages: groupedImages.exterior,
      interiorImages: groupedImages.interior,
      surroundingsImages: groupedImages.surroundings,
    });
    setFormError("");
    setShowModal(true);
  };

  const handleSave = async () => {
    if (isSeller && !editingProp) {
      setFormError("คุณไม่มีสิทธิ์เพิ่มอสังหาริมทรัพย์");
      return;
    }

    const images = {
      exterior: form.exteriorImages.map((value) => value.trim()).filter(Boolean),
      interior: form.interiorImages.map((value) => value.trim()).filter(Boolean),
      surroundings: form.surroundingsImages.map((value) => value.trim()).filter(Boolean),
    };

    setSaving(true);
    setFormError("");
    const payload = {
      ...(editingProp ? { id: editingProp.id } : {}),
      type: form.type,
      title: form.title,
      location: form.location,
      price: Number(form.price),
      image: getFormPrimaryImage() || undefined,
      images,
      category: form.category,
      propertyType: form.propertyType,
      size: form.size ? Number(form.size) : undefined,
      bedrooms: form.bedrooms ? Number(form.bedrooms) : undefined,
      bathrooms: form.bathrooms ? Number(form.bathrooms) : undefined,
      description: form.description.trim() || undefined,
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

  const uploadImageFile = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    const uploadUrl = `${window.location.protocol}//${window.location.hostname}:3000/api/uploads`;

    const response = await fetch(uploadUrl, {
      method: "POST",
      body: formData,
    });

    const result = (await response.json().catch(() => null)) as { ok?: boolean; data?: { url?: string }; error?: string } | null;
    if (!response.ok || !result?.ok || !result.data?.url) {
      throw new Error(result?.error ?? "อัปโหลดรูปไม่สำเร็จ");
    }

    return result.data.url;
  };

  const handleMainImageUpload = async (file: File) => {
    setUploadingField("main");
    setFormError("");
    try {
      const url = await uploadImageFile(file);
      setForm((prev) => ({ ...prev, image: url }));
    } catch (error) {
      setFormError(error instanceof Error ? error.message : "อัปโหลดรูปไม่สำเร็จ");
    } finally {
      setUploadingField(null);
    }
  };

  const handleGroupImageUpload = async (
    group: "exteriorImages" | "interiorImages" | "surroundingsImages",
    index: number,
    file: File,
  ) => {
    const fieldKey = `${group}-${index}`;
    setUploadingField(fieldKey);
    setFormError("");
    try {
      const url = await uploadImageFile(file);
      updateImageField(group, index, url);
    } catch (error) {
      setFormError(error instanceof Error ? error.message : "อัปโหลดรูปไม่สำเร็จ");
    } finally {
      setUploadingField(null);
    }
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
          { label: "รายการที่กำลังขาย", value: properties.filter((p) => !isSoldProperty(p)).length, sub: "Active listings" },
          { label: "ประกาศขาย", value: properties.filter((p) => p.type === "ขาย" && !isSoldProperty(p)).length, sub: "For sale" },
          { label: "ประกาศเช่า", value: properties.filter((p) => p.type === "เช่า" && !isSoldProperty(p)).length, sub: "For rent" },
          { label: "ขายแล้ว", value: properties.filter((p) => isSoldProperty(p)).length, sub: "Sold listings" },
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
          {activeProperties.map((p) => (
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
                    {isSeller ? "แก้ไขข้อมูล" : "แก้ไข"}
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

      {!loading && activeProperties.length === 0 && (
        <div className="text-center py-16">
          <div className="w-16 h-16 bg-neutral-50 border border-neutral-100 rounded-3xl flex items-center justify-center mx-auto mb-4">
            <BuildingIcon className="w-7 h-7 text-neutral-300" />
          </div>
          <p className="text-neutral-400 text-sm">{isSeller ? "ยังไม่มีบ้านที่คุณได้รับมอบหมายและพร้อมขาย" : "ไม่พบอสังหาริมทรัพย์ที่กำลังขาย"}</p>
        </div>
      )}

      {!loading && soldProperties.length > 0 && (
        <div className="mt-12">
          <div className="mb-5 flex items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-light tracking-tight text-black">รายการขายแล้ว</h2>
              <p className="text-sm text-neutral-500 mt-1">บ้านที่ปิดการขายแล้วจะไม่แสดงปะปนในรายการที่กำลังขาย</p>
            </div>
            <span className="text-xs text-neutral-400 bg-neutral-50 border border-neutral-100 px-3 py-1 rounded-full">
              {soldProperties.length} รายการ
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {soldProperties.map((p) => (
              <div key={p.id} className="bg-white border border-emerald-100 rounded-3xl overflow-hidden shadow-[0_2px_20px_-4px_rgba(0,0,0,0.04)]">
                <div className="relative h-44 bg-neutral-50 overflow-hidden">
                  {getPrimaryImage(p) && !imageErrors[p.id] ? (
                    <img
                      src={resolveImageSrc(getPrimaryImage(p))}
                      alt={p.title}
                      className="w-full h-full object-cover opacity-90"
                      onError={() => setImageErrors((prev) => ({ ...prev, [p.id]: true }))}
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <BuildingIcon className="w-14 h-14 text-neutral-200" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/20" />
                  <div className="absolute top-3 left-3">
                    <span className="px-2.5 py-1 bg-emerald-500 text-white text-[10px] font-semibold rounded-full">ขายแล้ว</span>
                  </div>
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
                  <div className="flex flex-wrap gap-2">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold border bg-emerald-50 text-emerald-600 border-emerald-100">
                      {PROPERTY_STATUS[(p.status as PropertyStatus) ?? "success"]}
                    </span>
                    {!isSeller && p.sellerId && (
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-medium border border-neutral-200 bg-neutral-50 text-neutral-600">
                        ดูแลโดย: {sellerNameMap[p.sellerId] ?? `Seller #${p.sellerId}`}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-8 shadow-2xl border border-neutral-100 max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-light text-black mb-6">{editingProp ? "แก้ไขอสังหาฯ" : "เพิ่มอสังหาฯ ใหม่"}</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
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
                <div>
                  <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-2">พื้นที่ (ตร.ม.)</label>
                  <input type="number" value={form.size} onChange={(e) => setForm({ ...form, size: e.target.value })} placeholder="0" className={inputClass} />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-2">หมวดหมู่</label>
                  <input type="text" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} placeholder="เช่น ที่อยู่อาศัย" className={inputClass} />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-2">ห้องนอน</label>
                  <input type="number" value={form.bedrooms} onChange={(e) => setForm({ ...form, bedrooms: e.target.value })} placeholder="0" className={inputClass} />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-2">ห้องน้ำ</label>
                  <input type="number" value={form.bathrooms} onChange={(e) => setForm({ ...form, bathrooms: e.target.value })} placeholder="0" className={inputClass} />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-2">คำอธิบายบ้าน</label>
                  <textarea
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    rows={4}
                    placeholder="รายละเอียดบ้าน จุดเด่น วัสดุ และสิ่งอำนวยความสะดวก"
                    className={`${inputClass} resize-none`}
                  />
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
                  <select
                    value={isSeller && user ? String(user.id) : form.sellerId}
                    onChange={(e) => setForm({ ...form, sellerId: e.target.value })}
                    className={inputClass}
                    disabled={isSeller}
                  >
                    <option value="">ยังไม่กำหนด</option>
                    {sellers.map((s) => (
                      <option key={s.id} value={s.id}>{s.fullName ?? s.username}</option>
                    ))}
                  </select>
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-2">รูปหลักของประกาศ</label>
                  <div className="space-y-2">
                    <input
                      type="text"
                      value={form.image}
                      onChange={(e) => setForm({ ...form, image: e.target.value })}
                      placeholder="ระบบจะเติม path ให้หลังอัปโหลด หรือจะวาง URL เองก็ได้"
                      className={inputClass}
                    />
                    <label className="flex cursor-pointer items-center justify-center gap-2 rounded-2xl border border-dashed border-neutral-300 bg-white px-4 py-3 text-sm text-neutral-600 transition hover:border-black hover:text-black">
                      <span>{uploadingField === "main" ? "กำลังอัปโหลด..." : "เลือกรูปหลักจากเครื่อง"}</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        disabled={uploadingField === "main"}
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            void handleMainImageUpload(file);
                          }
                          e.currentTarget.value = "";
                        }}
                      />
                    </label>
                  </div>
                </div>
                <div className="col-span-2 rounded-3xl border border-neutral-100 bg-neutral-50/70 p-4">
                  <div className="mb-3">
                    <p className="text-sm font-medium text-black">ชุดรูปภาพประกาศ</p>
                    <p className="text-xs text-neutral-500 mt-1">เพิ่มได้รวม 17 รูป: ภายนอก 7 รูป, ภายใน 7 รูป, รอบบ้าน 3 รูป</p>
                  </div>

                  <div className="space-y-4">
                    {([
                      ["exteriorImages", "รายละเอียดนอกบ้าน", IMAGE_GROUP_LIMITS.exterior],
                      ["interiorImages", "รายละเอียดในบ้าน", IMAGE_GROUP_LIMITS.interior],
                      ["surroundingsImages", "ภาพรอบบ้าน", IMAGE_GROUP_LIMITS.surroundings],
                    ] as const).map(([groupKey, label, count]) => (
                      <div key={groupKey}>
                        <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-2">{label}</p>
                        <div className="grid grid-cols-1 gap-2">
                          {form[groupKey].map((value, index) => (
                            <div key={`${groupKey}-${index}`} className="space-y-2">
                              <input
                                type="text"
                                value={value}
                                onChange={(e) => updateImageField(groupKey, index, e.target.value)}
                                placeholder={`${label} รูปที่ ${index + 1} จาก ${count}`}
                                className={inputClass}
                              />
                              <label className="flex cursor-pointer items-center justify-center gap-2 rounded-2xl border border-dashed border-neutral-300 bg-white px-4 py-2.5 text-xs text-neutral-600 transition hover:border-black hover:text-black">
                                <span>
                                  {uploadingField === `${groupKey}-${index}` ? "กำลังอัปโหลด..." : `เลือกไฟล์ ${label} รูปที่ ${index + 1}`}
                                </span>
                                <input
                                  type="file"
                                  accept="image/*"
                                  className="hidden"
                                  disabled={uploadingField === `${groupKey}-${index}`}
                                  onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                      void handleGroupImageUpload(groupKey, index, file);
                                    }
                                    e.currentTarget.value = "";
                                  }}
                                />
                              </label>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
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
