'use client';

import Image from "next/image";
import Link from "next/link";
import { useFavoritesStore } from "@/lib/favorites-store";
import { buildPriceLabel, formatPrice } from "@/lib/property-format";

export default function ComparePage() {
  const { favorites, removeFavorite } = useFavoritesStore();

  if (favorites.length === 0) {
    return (
      <div className="min-h-screen bg-[linear-gradient(180deg,#e7edf4_0%,#dce6f1_42%,#eaf0f5_100%)] flex items-center justify-center">
        <div className="text-center px-4">
          <div className="mb-6">
            <svg className="h-24 w-24 mx-auto text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-3">ยังไม่มีบ้านที่ชอบ</h1>
          <p className="text-slate-600 mb-8 max-w-md mx-auto">
            เลือกบ้านที่คุณชอบได้สูงสุด 3 หลัง เพื่อเปรียบเทียบรายละเอียดและเลือกบ้านที่ใช่ที่สุดสำหรับคุณ
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            กลับไปหน้าหลัก
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#e7edf4_0%,#dce6f1_42%,#eaf0f5_100%)]">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-slate-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href="/"
                className="flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900 transition"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                กลับ
              </Link>
              <div>
                <h1 className="text-xl font-bold text-slate-900">เปรียบเทียบบ้านที่ชอบ</h1>
                <p className="text-xs text-slate-500">เลือกแล้ว {favorites.length} จาก 3 หลัง</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Comparison Grid */}
      <div className="container mx-auto px-4 py-8">
        <div className={`grid gap-6 ${favorites.length === 1 ? 'grid-cols-1 max-w-2xl mx-auto' : favorites.length === 2 ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1 lg:grid-cols-3'}`}>
          {favorites.map((property) => (
            <div
              key={property.id}
              className="bg-white rounded-3xl shadow-lg overflow-hidden"
            >
              {/* Image */}
              <div className="relative h-64">
                <Image
                  src={property.image}
                  alt={property.title}
                  fill
                  className="object-cover"
                />
                <button
                  onClick={() => removeFavorite(property.id)}
                  className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-red-500 text-white transition hover:bg-red-600"
                  aria-label="ลบออกจากรายการ"
                >
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
                <div className="absolute left-3 top-3">
                  <span className="rounded-full bg-white/95 px-3 py-1 text-xs font-semibold text-slate-900">
                    {property.type}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 space-y-4">
                <div>
                  <h2 className="text-xl font-bold text-slate-900 mb-1 line-clamp-2">{property.title}</h2>
                  <p className="text-sm text-slate-600">{property.location}</p>
                </div>

                {/* Price */}
                <div className="border-t border-slate-200 pt-4">
                  <p className="text-xs text-slate-500 mb-1">ราคา</p>
                  <p className="text-2xl font-bold text-slate-900">{buildPriceLabel(property)}</p>
                  {property.pricePerSqm && (
                    <p className="text-xs text-slate-500 mt-1">{formatPrice(property.pricePerSqm)}/ตร.ม.</p>
                  )}
                </div>

                {/* Details Grid */}
                <div className="space-y-3 border-t border-slate-200 pt-4">
                  <DetailRow label="ประเภท" value={property.propertyType || '-'} />
                  <DetailRow label="พื้นที่ใช้สอย" value={property.size ? `${property.size} ตร.ม.` : '-'} />
                  <DetailRow label="ห้องนอน" value={property.bedrooms ? `${property.bedrooms} ห้อง` : '-'} />
                  <DetailRow label="ห้องน้ำ" value={property.bathrooms ? `${property.bathrooms} ห้อง` : '-'} />
                  <DetailRow label="หมวดหมู่" value={property.category || '-'} />
                </div>

                {/* Features */}
                {property.features && property.features.length > 0 && (
                  <div className="border-t border-slate-200 pt-4">
                    <p className="text-xs font-semibold text-slate-500 mb-2">สิ่งอำนวยความสะดวก</p>
                    <div className="flex flex-wrap gap-1.5">
                      {property.features.map((feature, index) => (
                        <span
                          key={index}
                          className="rounded-full bg-slate-100 px-2.5 py-1 text-xs text-slate-700"
                        >
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Action Button */}
                <Link
                  href={`/property/${property.id}`}
                  className="flex w-full items-center justify-center gap-2 rounded-full bg-slate-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
                >
                  ดูรายละเอียดเพิ่มเติม
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>
          ))}

          {/* Placeholder cards for empty slots */}
          {[...Array(Math.max(0, 3 - favorites.length))].map((_, index) => (
            <div
              key={`placeholder-${index}`}
              className="bg-white/50 rounded-3xl border-2 border-dashed border-slate-300 overflow-hidden flex items-center justify-center min-h-[600px]"
            >
              <div className="text-center px-6">
                <svg className="h-16 w-16 mx-auto text-slate-300 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 4v16m8-8H4" />
                </svg>
                <p className="text-slate-400 text-sm">เพิ่มบ้านอีก {3 - favorites.length} หลัง</p>
                <p className="text-slate-400 text-xs mt-1">เพื่อเปรียบเทียบได้ครบ</p>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Note */}
        <div className="mt-8 text-center">
          <p className="text-sm text-slate-600">
            💡 คุณสามารถเลือกบ้านได้สูงสุด 3 หลัง เพื่อเปรียบเทียบและตัดสินใจได้ง่ายขึ้น
          </p>
        </div>
      </div>
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-center text-sm">
      <span className="text-slate-600">{label}</span>
      <span className="font-semibold text-slate-900">{value}</span>
    </div>
  );
}
