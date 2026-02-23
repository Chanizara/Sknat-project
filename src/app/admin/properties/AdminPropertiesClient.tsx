'use client';

import Link from "next/link";
import { useMemo, useState } from "react";

import { buildPriceLabel, formatUpdatedAt } from "@/lib/property-format";
import { LISTING_TYPES, type Property } from "@/types/property";

type AdminPropertiesClientProps = {
  initialProperties: Property[];
};

type FormState = {
  type: Property["type"];
  title: string;
  location: string;
  price: string;
  image: string;
  category: string;
  propertyType: string;
  size: string;
  bedrooms: string;
  bathrooms: string;
  description: string;
  features: string;
  lat: string;
  lng: string;
  images: string;
  agentName: string;
  agentPhone: string;
  agentEmail: string;
};

const DEFAULT_FORM: FormState = {
  type: "ขาย",
  title: "",
  location: "",
  price: "",
  image: "/hero_1.jpg",
  category: "ที่อยู่อาศัย",
  propertyType: "บ้านเดี่ยว",
  size: "",
  bedrooms: "",
  bathrooms: "",
  description: "",
  features: "",
  lat: "",
  lng: "",
  images: "",
  agentName: "",
  agentPhone: "",
  agentEmail: "",
};

export default function AdminPropertiesClient({ initialProperties }: AdminPropertiesClientProps) {
  const [properties, setProperties] = useState<Property[]>(initialProperties);
  const [form, setForm] = useState<FormState>(DEFAULT_FORM);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string>("");
  const [statusType, setStatusType] = useState<"success" | "error">("success");

  const submitLabel = editingId ? "บันทึกการแก้ไข" : "เพิ่มรายการบ้าน";

  const totalListings = useMemo(() => properties.length, [properties]);

  const resetForm = () => {
    setForm(DEFAULT_FORM);
    setEditingId(null);
  };

  const setMessage = (message: string, type: "success" | "error") => {
    setStatusMessage(message);
    setStatusType(type);
  };

  const updateForm = (field: keyof FormState, value: string) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const buildPayload = () => {
    if (!form.title.trim()) {
      throw new Error("กรุณาระบุชื่อประกาศ");
    }

    if (!form.location.trim()) {
      throw new Error("กรุณาระบุตำแหน่ง/ที่อยู่");
    }

    const priceNumber = Number(form.price);
    if (!Number.isFinite(priceNumber) || priceNumber <= 0) {
      throw new Error("กรุณาระบุราคาให้ถูกต้อง");
    }

    const features = form.features
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);

    const images = form.images
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);

    const payload: Record<string, unknown> = {
      type: form.type,
      title: form.title.trim(),
      location: form.location.trim(),
      price: priceNumber,
      image: form.image.trim() || "/hero_1.jpg",
      category: form.category.trim(),
      propertyType: form.propertyType.trim(),
      description: form.description.trim() || undefined,
      features: features.length > 0 ? features : undefined,
      images: images.length > 0 ? images : undefined,
    };

    if (form.size.trim()) {
      payload.size = Number(form.size);
    }

    if (form.bedrooms.trim()) {
      payload.bedrooms = Number(form.bedrooms);
    }

    if (form.bathrooms.trim()) {
      payload.bathrooms = Number(form.bathrooms);
    }

    if (form.lat.trim()) {
      payload.lat = Number(form.lat);
    }

    if (form.lng.trim()) {
      payload.lng = Number(form.lng);
    }

    if (form.agentName.trim() || form.agentPhone.trim() || form.agentEmail.trim()) {
      payload.agent = {
        name: form.agentName.trim() || "-",
        phone: form.agentPhone.trim() || "-",
        email: form.agentEmail.trim() || "-",
      };
    }

    return payload;
  };

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      const payload = buildPayload();
      setIsSubmitting(true);
      setStatusMessage("");

      const isEditing = editingId !== null;
      const endpoint = isEditing ? `/api/properties/${editingId}` : "/api/properties";
      const method = isEditing ? "PATCH" : "POST";

      const response = await fetch(endpoint, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const payloadError = (await response.json().catch(() => null)) as { message?: string } | null;
        throw new Error(payloadError?.message ?? "บันทึกข้อมูลไม่สำเร็จ");
      }

      const savedProperty = (await response.json()) as Property;

      setProperties((prev) => {
        if (isEditing) {
          return prev
            .map((property) => (property.id === savedProperty.id ? savedProperty : property))
            .sort((a, b) => b.id - a.id);
        }

        return [savedProperty, ...prev].sort((a, b) => b.id - a.id);
      });

      resetForm();
      setMessage(isEditing ? "แก้ไขข้อมูลสำเร็จ" : "เพิ่มรายการบ้านสำเร็จ", "success");
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "เกิดข้อผิดพลาดที่ไม่คาดคิด";
      setMessage(errorMessage, "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const onEdit = (property: Property) => {
    setEditingId(property.id);
    setForm({
      type: property.type,
      title: property.title,
      location: property.location,
      price: String(property.price),
      image: property.image,
      category: property.category ?? "",
      propertyType: property.propertyType ?? "",
      size: property.size ? String(property.size) : "",
      bedrooms: property.bedrooms ? String(property.bedrooms) : "",
      bathrooms: property.bathrooms ? String(property.bathrooms) : "",
      description: property.description ?? "",
      features: property.features?.join(", ") ?? "",
      lat: property.lat ? String(property.lat) : "",
      lng: property.lng ? String(property.lng) : "",
      images: property.images?.join(", ") ?? "",
      agentName: property.agent?.name ?? "",
      agentPhone: property.agent?.phone ?? "",
      agentEmail: property.agent?.email ?? "",
    });
  };

  const onDelete = async (propertyId: number) => {
    const isConfirmed = window.confirm("ยืนยันการลบรายการนี้ใช่หรือไม่?");
    if (!isConfirmed) {
      return;
    }

    try {
      const response = await fetch(`/api/properties/${propertyId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const payloadError = (await response.json().catch(() => null)) as { message?: string } | null;
        throw new Error(payloadError?.message ?? "ลบข้อมูลไม่สำเร็จ");
      }

      setProperties((prev) => prev.filter((property) => property.id !== propertyId));
      if (editingId === propertyId) {
        resetForm();
      }
      setMessage("ลบรายการสำเร็จ", "success");
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "เกิดข้อผิดพลาดที่ไม่คาดคิด";
      setMessage(errorMessage, "error");
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 py-10 px-4 md:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Admin / Seller Management</h1>
            <p className="text-slate-600 mt-1">จัดการข้อมูลบ้านสำหรับหน้าเว็บลูกค้าแบบเรียลไทม์</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="px-4 py-2 rounded-full bg-blue-100 text-blue-700 text-sm font-medium">
              ทั้งหมด {totalListings} รายการ
            </span>
            <Link href="/" className="px-4 py-2 rounded-lg bg-slate-900 text-white hover:bg-slate-700 transition">
              กลับหน้าเว็บลูกค้า
            </Link>
          </div>
        </header>

        {statusMessage ? (
          <div
            className={`rounded-lg border px-4 py-3 text-sm ${
              statusType === "success"
                ? "border-emerald-300 bg-emerald-50 text-emerald-800"
                : "border-rose-300 bg-rose-50 text-rose-700"
            }`}
          >
            {statusMessage}
          </div>
        ) : null}

        <div className="grid lg:grid-cols-[380px,1fr] gap-6">
          <section className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm h-fit">
            <h2 className="text-xl font-semibold text-slate-900 mb-4">
              {editingId ? `แก้ไขรายการ #${editingId}` : "เพิ่มรายการใหม่"}
            </h2>
            <form className="space-y-4" onSubmit={onSubmit}>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">ประเภทประกาศ</label>
                <select
                  value={form.type}
                  onChange={(event) => updateForm("type", event.target.value as Property["type"])}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2"
                >
                  {LISTING_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              <Field label="ชื่อประกาศ" value={form.title} onChange={(value) => updateForm("title", value)} required />
              <Field label="ตำแหน่ง/ที่อยู่" value={form.location} onChange={(value) => updateForm("location", value)} required />
              <Field label="ราคา (ตัวเลข)" value={form.price} onChange={(value) => updateForm("price", value)} required />
              <Field label="รูปหลัก (URL/Path)" value={form.image} onChange={(value) => updateForm("image", value)} />
              <Field label="หมวดหมู่" value={form.category} onChange={(value) => updateForm("category", value)} />
              <Field label="ประเภททรัพย์" value={form.propertyType} onChange={(value) => updateForm("propertyType", value)} />

              <div className="grid grid-cols-3 gap-2">
                <Field label="ขนาด" value={form.size} onChange={(value) => updateForm("size", value)} />
                <Field label="ห้องนอน" value={form.bedrooms} onChange={(value) => updateForm("bedrooms", value)} />
                <Field label="ห้องน้ำ" value={form.bathrooms} onChange={(value) => updateForm("bathrooms", value)} />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <Field label="Latitude" value={form.lat} onChange={(value) => updateForm("lat", value)} />
                <Field label="Longitude" value={form.lng} onChange={(value) => updateForm("lng", value)} />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">รายละเอียด</label>
                <textarea
                  rows={3}
                  value={form.description}
                  onChange={(event) => updateForm("description", event.target.value)}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2"
                />
              </div>

              <Field
                label="จุดเด่น (คั่นด้วย comma)"
                value={form.features}
                onChange={(value) => updateForm("features", value)}
              />
              <Field
                label="รูปเพิ่มเติม (คั่นด้วย comma)"
                value={form.images}
                onChange={(value) => updateForm("images", value)}
              />

              <div className="grid grid-cols-1 gap-2">
                <Field label="ชื่อผู้ขาย" value={form.agentName} onChange={(value) => updateForm("agentName", value)} />
                <Field label="เบอร์ผู้ขาย" value={form.agentPhone} onChange={(value) => updateForm("agentPhone", value)} />
                <Field label="อีเมลผู้ขาย" value={form.agentEmail} onChange={(value) => updateForm("agentEmail", value)} />
              </div>

              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-60"
                >
                  {isSubmitting ? "กำลังบันทึก..." : submitLabel}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition"
                >
                  ล้างฟอร์ม
                </button>
              </div>
            </form>
          </section>

          <section className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-900 mb-4">รายการทั้งหมด</h2>
            <div className="space-y-3">
              {properties.map((property) => (
                <article key={property.id} className="border border-slate-200 rounded-lg p-4 flex flex-col md:flex-row md:items-center gap-4">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-slate-500">#{property.id} • อัปเดต {formatUpdatedAt(property.updatedAt)}</p>
                    <h3 className="text-lg font-semibold text-slate-900 truncate">{property.title}</h3>
                    <p className="text-sm text-slate-600 truncate">{property.location}</p>
                    <p className="text-base font-semibold text-blue-700 mt-1">{buildPriceLabel(property)}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => onEdit(property)}
                      className="px-3 py-2 rounded-lg bg-amber-100 text-amber-800 hover:bg-amber-200 transition text-sm"
                    >
                      แก้ไข
                    </button>
                    <button
                      type="button"
                      onClick={() => onDelete(property.id)}
                      className="px-3 py-2 rounded-lg bg-rose-100 text-rose-700 hover:bg-rose-200 transition text-sm"
                    >
                      ลบ
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}

type FieldProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
};

function Field({ label, value, onChange, required }: FieldProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-1">
        {label}
        {required ? <span className="text-rose-500"> *</span> : null}
      </label>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full border border-slate-300 rounded-lg px-3 py-2"
      />
    </div>
  );
}
