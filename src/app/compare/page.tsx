'use client';

import Image from "next/image";
import Link from "next/link";
import { Raleway } from "next/font/google";
import { useFavoritesStore } from "@/lib/favorites-store";
import { buildPriceLabel, formatPrice } from "@/lib/property-format";

const headingFont = Raleway({
  subsets: ["latin"],
  weight: ["300", "400"],
});

export default function ComparePage() {
  const { favorites, removeFavorite } = useFavoritesStore();

  if (favorites.length === 0) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
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
            className="inline-flex items-center gap-2 bg-slate-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
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
    <div className="min-h-screen bg-white">
      <CompareHero />

      {/* Comparison Grid */}
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 border-b border-slate-200 pb-5 text-center">
          <div>
            <h1 className={`${headingFont.className} text-xl font-light text-slate-900`}>choose your best house</h1>
            <p className="text-xs text-slate-500">เลือกแล้ว {favorites.length} จาก 3 หลัง</p>
          </div>
        </div>

        <div className={`grid gap-8 lg:gap-10 ${favorites.length === 1 ? 'grid-cols-1 max-w-2xl mx-auto' : favorites.length === 2 ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1 lg:grid-cols-3'}`}>
          {favorites.map((property) => (
            <article
              key={property.id}
              className="border-t border-[#8f877d] pt-5"
            >
              {/* Image */}
              <div className="relative h-64 overflow-hidden rounded-none">
                <Image
                  src={property.image}
                  alt={property.title}
                  fill
                  className="object-cover"
                />
                <button
                  onClick={() => removeFavorite(property.id)}
                  className="absolute right-3 top-3 text-white transition hover:text-slate-100"
                  style={{ textShadow: "0 2px 8px rgba(0, 0, 0, 0.95)" }}
                  aria-label="ลบออกจากรายการ"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
                <div className="absolute left-3 top-3">
                  <span
                    className="text-xs font-semibold uppercase tracking-wide text-white"
                    style={{ textShadow: "0 2px 8px rgba(0, 0, 0, 0.95)" }}
                  >
                    {property.type}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="space-y-5 pt-5">
                <div>
                  <h2 className="text-xl font-bold text-slate-900 mb-1 line-clamp-2">{property.title}</h2>
                  <p className="text-sm text-slate-600">{property.location}</p>
                </div>

                {/* Price */}
                <div className="border-t border-[#c9c2bb] pt-4">
                  <p className="text-xs text-slate-500 mb-1">ราคา</p>
                  <p className="text-2xl font-bold text-slate-900">{buildPriceLabel(property)}</p>
                  {property.pricePerSqm && (
                    <p className="text-xs text-slate-500 mt-1">{formatPrice(property.pricePerSqm)}/ตร.ม.</p>
                  )}
                </div>

                {/* Details Grid */}
                <div className="space-y-3 border-t border-[#c9c2bb] pt-4">
                  <DetailRow label="ประเภท" value={property.propertyType || '-'} />
                  <DetailRow label="พื้นที่ใช้สอย" value={property.size ? `${property.size} ตร.ม.` : '-'} />
                  <DetailRow label="ห้องนอน" value={property.bedrooms ? `${property.bedrooms} ห้อง` : '-'} />
                  <DetailRow label="ห้องน้ำ" value={property.bathrooms ? `${property.bathrooms} ห้อง` : '-'} />
                  <DetailRow label="หมวดหมู่" value={property.category || '-'} />
                </div>

                {/* Features */}
                {property.features && property.features.length > 0 && (
                  <div className="border-t border-[#c9c2bb] pt-4">
                    <p className="text-xs font-semibold text-slate-500 mb-2">สิ่งอำนวยความสะดวก</p>
                    <div className="flex flex-wrap gap-1.5">
                      {property.features.map((feature, index) => (
                        <span
                          key={index}
                          className="rounded-none bg-slate-100 px-2.5 py-1 text-xs text-slate-700"
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
                  className="flex w-full items-center justify-center gap-2 rounded-none bg-slate-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
                >
                  ดูรายละเอียดเพิ่มเติม
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </article>
          ))}

          {/* Placeholder cards for empty slots */}
          {[...Array(Math.max(0, 3 - favorites.length))].map((_, index) => (
            <div
              key={`placeholder-${index}`}
              className="border-t border-dashed border-[#b8b1aa] pt-5"
            >
              <div className="flex min-h-105 items-center justify-center rounded-none border border-dashed border-slate-300/80 bg-white px-6">
                <div className="text-center">
                  <svg className="h-16 w-16 mx-auto text-slate-300 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 4v16m8-8H4" />
                  </svg>
                  <p className="text-slate-400 text-sm">เพิ่มบ้านอีก {3 - favorites.length} หลัง</p>
                  <p className="text-slate-400 text-xs mt-1">เพื่อเปรียบเทียบได้ครบ</p>
                </div>
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

function CompareHero() {
  return (
    <section className="compare-hero">
      <div className="compare-hero__line-wrap" aria-hidden="true">
        <svg viewBox="0 0 1200 520" preserveAspectRatio="none" className="compare-hero__lines">
          <path className="compare-hero__line compare-hero__line--a" d="M0 500 L180 430 L180 330" />
          <path className="compare-hero__line compare-hero__line--b" d="M520 330 L830 220 L830 490" />
          <path className="compare-hero__line compare-hero__line--c" d="M830 220 L1200 70" />
          <path className="compare-hero__line compare-hero__line--d" d="M1080 500 L1080 360 L1200 300" />
        </svg>
      </div>

      <p className="compare-hero__kicker">✦ THE BELIEFS THAT SHAPE US</p>

      <div className="compare-hero__center">
        <h2 className={`${headingFont.className} compare-hero__title`}>
          It&apos;s your choice
        </h2>

        <span className="compare-hero__tag compare-hero__tag--1">THE TRUST YOU DESERVE</span>
        <span className="compare-hero__tag compare-hero__tag--2">THE HOME YOU LOVE</span>
        <span className="compare-hero__tag compare-hero__tag--3">THE DECISION YOU OWN</span>
      </div>
    </section>
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
