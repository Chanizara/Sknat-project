'use client';

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

import { buildPriceLabel, formatPrice, formatUpdatedAt } from "@/lib/property-format";
import { type Property } from "@/types/property";

const EB = "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";

export default function PropertyDetailPage() {
  const params = useParams();
  const propertyId = params.id as string;
  const [property, setProperty] = useState<Property | null>(null);
  const [galleryIndex, setGalleryIndex] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const response = await fetch(`/api/properties/${propertyId}`);
        if (response.ok) {
          const data = await response.json();
          setProperty(data);
        }
      } catch (error) {
        console.error("Failed to fetch property:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();
  }, [propertyId]);

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  // Keyboard navigation for lightbox
  useEffect(() => {
    if (galleryIndex === null) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setGalleryIndex(null);
      if (e.key === 'ArrowLeft' && galleryIndex > 0) setGalleryIndex(i => (i !== null ? i - 1 : null));
      if (e.key === 'ArrowRight') {
        const allImages = property?.images || [];
        if (galleryIndex < allImages.length - 1) setGalleryIndex(i => (i !== null ? i + 1 : null));
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [galleryIndex, property]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white" style={{ fontFamily: EB }}>
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-600/30 border-t-blue-600 rounded-full animate-spin" />
          <p className="text-gray-500 animate-pulse">กำลังโหลดข้อมูล...</p>
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white" style={{ fontFamily: EB }}>
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-900">ไม่พบข้อมูลบ้าน</h1>
          <Link href="/" className="mt-4 inline-block text-blue-600 hover:underline">
            กลับไปหน้าหลัก
          </Link>
        </div>
      </div>
    );
  }

  const allImages = property.images || [property.image];
  const GAP = 8;
  const H = 480;

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#e7edf4_0%,#dce6f1_42%,#eaf0f5_100%)]" style={{ fontFamily: EB }}>
      {/* Header with back button */}
      <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200/60">
        <div className="max-w-7xl mx-auto px-6 md:px-10 py-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-950 transition-colors text-sm font-semibold"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            กลับไปหน้าหลัก
          </Link>
        </div>
      </div>

      {/* ══════════ Adaptive Image Gallery Grid ══════════ */}
      {allImages.length > 0 && (() => {
        const total = allImages.length;
        const extraCount = Math.max(0, total - 5);

        const Cell = ({
          idx,
          style,
          isHero = false,
          extra = false,
        }: {
          idx: number;
          style?: React.CSSProperties;
          isHero?: boolean;
          extra?: boolean;
        }) => (
          <div
            className="relative cursor-pointer group overflow-hidden"
            style={style}
            onClick={() => setGalleryIndex(idx)}
          >
            <Image
              src={allImages[idx]}
              alt={`Photo ${idx + 1}`}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-700"
            />
            {isHero ? (
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            ) : extra && extraCount > 0 ? (
              <div className="absolute inset-0 bg-black/55 flex flex-col items-center justify-center gap-1.5 hover:bg-black/45 transition-colors">
                <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="text-white text-2xl font-bold">+{extraCount}</span>
                <span className="text-white/75 text-xs tracking-wide">รูปภาพเพิ่มเติม</span>
              </div>
            ) : (
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
            )}
          </div>
        );

        const Pill = () => (
          <button
            className="absolute bottom-4 right-4 z-10 flex items-center gap-2 px-4 py-2.5 bg-white/95 backdrop-blur-sm rounded-xl text-sm font-semibold text-gray-900 hover:bg-white shadow-lg hover:shadow-xl transition-all duration-200 border border-white/50"
            onClick={() => setGalleryIndex(0)}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 5a1 1 0 011-1h4a1 1 0 011 1v7a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM14 5a1 1 0 011-1h4a1 1 0 011 1v7a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 16a1 1 0 011-1h4a1 1 0 011 1v3a1 1 0 01-1 1H5a1 1 0 01-1-1v-3zM14 16a1 1 0 011-1h4a1 1 0 011 1v3a1 1 0 01-1 1h-4a1 1 0 01-1-1v-3z" />
            </svg>
            ดูรูปทั้งหมด
          </button>
        );

        const wrap = "max-w-7xl mx-auto px-6 md:px-10 pt-4 pb-0";

        if (total === 1) return (
          <div className={wrap}>
            <div className="relative rounded-2xl overflow-hidden" style={{ height: H }}>
              <Cell idx={0} isHero style={{ position: 'absolute', inset: 0 }} />
            </div>
          </div>
        );

        if (total === 2) return (
          <div className={wrap}>
            <div className="relative rounded-2xl overflow-hidden" style={{ display: 'grid', gridTemplateColumns: '3fr 2fr', gridTemplateRows: `${H}px`, gap: GAP }}>
              <Cell idx={0} isHero />
              <Cell idx={1} />
              <Pill />
            </div>
          </div>
        );

        if (total === 3) return (
          <div className={wrap}>
            <div
              className="relative rounded-2xl overflow-hidden"
              style={{ display: 'grid', gridTemplateColumns: '3fr 2fr', gridTemplateRows: '1fr 1fr', gap: GAP, height: H }}
            >
              <Cell idx={0} isHero style={{ gridRow: '1 / 3' }} />
              <Cell idx={1} />
              <Cell idx={2} />
              <Pill />
            </div>
          </div>
        );

        if (total === 4) return (
          <div className={wrap}>
            <div
              className="relative rounded-2xl overflow-hidden"
              style={{ display: 'grid', gridTemplateColumns: '3fr 1fr 1fr', gridTemplateRows: '1fr 1fr', gap: GAP, height: H }}
            >
              <Cell idx={0} isHero style={{ gridRow: '1 / 3' }} />
              <Cell idx={1} style={{ gridColumn: '2', gridRow: '1' }} />
              <Cell idx={2} style={{ gridColumn: '3', gridRow: '1' }} />
              <Cell idx={3} style={{ gridColumn: '2 / 4', gridRow: '2' }} />
              <Pill />
            </div>
          </div>
        );

        return (
          <div className={wrap}>
            <div
              className="relative rounded-2xl overflow-hidden"
              style={{ display: 'grid', gridTemplateColumns: '3fr 1fr 1fr', gridTemplateRows: '1fr 1fr', gap: GAP, height: H }}
            >
              <Cell idx={0} isHero style={{ gridRow: '1 / 3' }} />
              <Cell idx={1} style={{ gridColumn: '2', gridRow: '1' }} />
              <Cell idx={2} style={{ gridColumn: '3', gridRow: '1' }} />
              <Cell idx={3} style={{ gridColumn: '2', gridRow: '2' }} />
              <Cell idx={4} style={{ gridColumn: '3', gridRow: '2' }} extra />
              <Pill />
            </div>
          </div>
        );
      })()}

      {/* ══════════ Header: Title + Meta ══════════ */}
      <div className="max-w-7xl mx-auto px-6 md:px-10 pt-6 pb-4">
        <div className="flex flex-wrap items-center gap-3 mb-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold text-white bg-slate-950 whitespace-nowrap">
            {property.type}
          </span>
          {property.category && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium text-slate-700 bg-white/60 backdrop-blur-sm whitespace-nowrap">
              {property.category}
            </span>
          )}
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-slate-950 leading-tight mb-2 tracking-tight">
          {property.title}
        </h1>

        <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600">
          <div className="flex items-center gap-1.5">
            <svg className="w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span>{property.location}</span>
          </div>
        </div>
      </div>

      {/* ══════════ Main Content ══════════ */}
      <div className="max-w-7xl mx-auto px-6 md:px-10 pb-12">
        <div className="flex flex-col lg:flex-row gap-7">
          {/* ── Left Column ── */}
          <div className="flex-1">
            {/* Property Information Card - Combined */}
            <div className="rounded-[1.5rem] bg-white/78 p-6 shadow-[0_26px_55px_-34px_rgba(15,23,42,0.62)] backdrop-blur-sm sm:rounded-[2rem] sm:p-8">
              {/* Price */}
              <div className="mb-8 pb-6 border-b border-slate-200">
                <div className="text-4xl md:text-5xl font-bold text-slate-950 mb-1 tracking-tight">{buildPriceLabel(property)}</div>
                {property.pricePerSqm ? (
                  <p className="text-slate-500 text-sm">{formatPrice(property.pricePerSqm)}/ตร.ม.</p>
                ) : null}
              </div>

              {/* Property Details */}
              <div className="flex flex-wrap gap-x-6 gap-y-3 mb-8 text-sm">
                {property.size && (
                  <div className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-slate-800" />
                    <span className="text-slate-600">{property.size} ตร.ม.</span>
                  </div>
                )}
                {property.bedrooms && (
                  <div className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-slate-800" />
                    <span className="text-slate-600">{property.bedrooms} ห้องนอน</span>
                  </div>
                )}
                {property.bathrooms && (
                  <div className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-slate-800" />
                    <span className="text-slate-600">{property.bathrooms} ห้องน้ำ</span>
                  </div>
                )}
                {property.propertyType && (
                  <div className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-slate-800" />
                    <span className="text-slate-600">{property.propertyType}</span>
                  </div>
                )}
              </div>

              {/* Description */}
              {property.description && (
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-slate-950 mb-3">รายละเอียด</h3>
                  <p className="text-slate-600 leading-relaxed whitespace-pre-line">{property.description}</p>
                </div>
              )}

              {/* Features */}
              {property.features && property.features.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-slate-950 mb-3">จุดเด่น</h3>
                  <div className="space-y-2">
                    {property.features.map((feature, index) => (
                      <div key={index} className="flex items-center gap-2.5 text-slate-700">
                        <svg className="w-4 h-4 text-green-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Location and Map Section */}
              <div className="pt-8 border-t border-slate-200">
                <h2 className="text-2xl font-semibold text-slate-950 mb-6">สถานที่ตั้ง</h2>

                {/* Map */}
                {property.lat && property.lng && (
                  <div className="mb-6">
                    <div className="relative h-80 bg-slate-200 rounded-2xl overflow-hidden">
                      <iframe
                        src={`https://www.google.com/maps?q=${property.lat},${property.lng}&hl=th&z=15&output=embed`}
                        width="100%"
                        height="100%"
                        style={{ border: 0 }}
                        allowFullScreen
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                      />
                    </div>
                  </div>
                )}

                {/* Nearby Places */}
                <div>
                  <h3 className="text-base font-semibold text-slate-950 mb-4">สถานที่ใกล้เคียง</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center gap-3">
                      <span className="h-1.5 w-1.5 rounded-full bg-blue-600 flex-shrink-0" />
                      <span className="text-slate-700">สถานีรถไฟฟ้า BTS ห่างประมาณ 1.2 กม.</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="h-1.5 w-1.5 rounded-full bg-green-600 flex-shrink-0" />
                      <span className="text-slate-700">ห้างสรรพสินค้า ห่างประมาณ 2.5 กม.</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="h-1.5 w-1.5 rounded-full bg-purple-600 flex-shrink-0" />
                      <span className="text-slate-700">โรงเรียนนานาชาติ ห่างประมาณ 800 ม.</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="h-1.5 w-1.5 rounded-full bg-red-600 flex-shrink-0" />
                      <span className="text-slate-700">โรงพยาบาล ห่างประมาณ 3.0 กม.</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ── Right Column - Contact Card (Sticky) ── */}
          <aside className="w-full lg:w-[340px] flex-shrink-0">
            <div className="sticky top-24 rounded-[1.5rem] bg-white/78 p-6 shadow-[0_26px_55px_-34px_rgba(15,23,42,0.62)] backdrop-blur-sm sm:rounded-[2rem] sm:p-8">
              <h2 className="text-2xl font-semibold text-slate-950 mb-6">ติดต่อสอบถาม</h2>

              {property.agent ? (
                <div>
                  <div className="mb-6 pb-6 border-b border-slate-200">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-14 h-14 bg-slate-950 rounded-full flex items-center justify-center">
                        <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 mb-1">ผู้ติดต่อ</p>
                        <p className="text-lg font-semibold text-slate-950">{property.agent.name}</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4 mb-6">
                    {property.agent.phone && (
                      <div>
                        <p className="text-xs text-slate-500 mb-2">เบอร์โทรศัพท์</p>
                        <a
                          href={`tel:${property.agent.phone}`}
                          className="flex items-center gap-2.5 text-slate-950 hover:text-slate-700 transition"
                        >
                          <svg className="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                          </svg>
                          <span className="font-medium">{property.agent.phone}</span>
                        </a>
                      </div>
                    )}

                    {property.agent.email && (
                      <div>
                        <p className="text-xs text-slate-500 mb-2">อีเมล</p>
                        <a
                          href={`mailto:${property.agent.email}`}
                          className="flex items-center gap-2.5 text-slate-950 hover:text-slate-700 transition"
                        >
                          <svg className="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                          <span className="font-medium text-sm truncate">{property.agent.email}</span>
                        </a>
                      </div>
                    )}
                  </div>

                  <button
                    type="button"
                    className="w-full py-3.5 bg-slate-950 text-white rounded-full font-semibold hover:bg-slate-800 transition-all duration-200 flex items-center justify-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    ส่งข้อความสอบถาม
                  </button>

                  {property.updatedAt && (
                    <div className="mt-6 pt-6 border-t border-slate-200">
                      <p className="text-xs text-slate-500 text-center">{formatUpdatedAt(property.updatedAt)}</p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-12">
                  <svg className="w-12 h-12 text-slate-300 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <p className="text-sm text-slate-500">ไม่มีข้อมูลผู้ติดต่อ</p>
                </div>
              )}
            </div>
          </aside>
        </div>
      </div>

      {/* ══════════ Lightbox Modal ══════════ */}
      {galleryIndex !== null && (
        <div
          className="fixed inset-0 z-[10000] bg-black/95 flex items-center justify-center p-4"
          onClick={() => setGalleryIndex(null)}
        >
          {/* Previous Button */}
          {galleryIndex > 0 && (
            <button
              onClick={(e) => { e.stopPropagation(); setGalleryIndex(galleryIndex - 1); }}
              className="absolute left-4 md:left-8 w-12 h-12 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/20 transition-colors duration-200 z-[10001]"
            >
              <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          )}

          {/* Next Button */}
          {galleryIndex < (property.images?.length || 0) - 1 && (
            <button
              onClick={(e) => { e.stopPropagation(); setGalleryIndex(galleryIndex + 1); }}
              className="absolute right-4 md:right-8 w-12 h-12 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/20 transition-colors duration-200 z-[10001]"
            >
              <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          )}

          {/* Image Container */}
          <div
            className="relative max-w-7xl max-h-[90vh] w-full h-full flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              key={galleryIndex}
              src={allImages[galleryIndex]}
              alt={`Photo ${galleryIndex + 1}`}
              width={1200}
              height={800}
              className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
              style={{ animation: 'fadeIn 0.2s ease' }}
            />
          </div>

          {/* Next */}
          {galleryIndex < allImages.length - 1 && (
            <button
              className="absolute right-4 md:right-8 w-12 h-12 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/20 transition-colors duration-200 z-[10001]"
              onClick={(e) => { e.stopPropagation(); setGalleryIndex(galleryIndex + 1); }}
            >
              <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          )}

          {/* Thumbnail panel */}
          <div
            className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2 px-4 py-2.5 bg-black/50 backdrop-blur-sm rounded-2xl max-w-[90vw] overflow-x-auto z-[10001]"
            onClick={(e) => e.stopPropagation()}
          >
            {allImages.map((img, i) => (
              <button
                key={i}
                onClick={() => setGalleryIndex(i)}
                className={`flex-shrink-0 w-12 h-9 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                  i === galleryIndex ? 'border-white scale-110' : 'border-white/30 hover:border-white/60'
                }`}
              >
                <Image src={img} alt="" width={48} height={36} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>
      )}

      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </div>
  );
}
