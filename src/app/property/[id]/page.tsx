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
    <div className="min-h-screen bg-white" style={{ fontFamily: EB }}>
      {/* Header with back button */}
      <div className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 md:px-10 py-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors text-sm font-medium"
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
      <div className="max-w-7xl mx-auto px-6 md:px-10 pt-6 pb-2">
        <div className="flex flex-wrap items-center gap-4 mb-3">
          <h1 className="text-3xl md:text-4xl lg:text-[42px] font-semibold text-slate-900 leading-tight">
            {property.title}
          </h1>
          <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold text-white bg-slate-900 whitespace-nowrap">
            {property.type}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600">
          <div className="flex items-center gap-1.5">
            <svg className="w-5 h-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span>{property.location}</span>
          </div>
        </div>
      </div>

      {/* ══════════ Main Content ══════════ */}
      <div className="max-w-7xl mx-auto px-6 md:px-10 pt-8 pb-12">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* ── Left Column ── */}
          <div className="flex-1 space-y-10">
            {/* Property Information */}
            <section>
              <h2 className="text-2xl font-semibold text-slate-900 mb-4 pb-3 border-b border-gray-200">
                รายละเอียดทรัพย์สิน
              </h2>

              <div className="flex flex-wrap gap-3 mb-6">
                <span className="px-4 py-2 bg-slate-50 text-slate-700 rounded-full text-sm font-medium border border-slate-200">
                  {property.category || "บ้านเดี่ยว"}
                </span>
                <span className="px-4 py-2 bg-slate-50 text-slate-700 rounded-full text-sm font-medium border border-slate-200">
                  {property.propertyType || "Pool Villa"}
                </span>
              </div>

              <div className="border-t border-gray-200 pt-6 mb-6">
                <div className="text-4xl font-bold text-blue-600 mb-2">{buildPriceLabel(property)}</div>
                {property.pricePerSqm ? (
                  <p className="text-slate-500">{formatPrice(property.pricePerSqm)}/ตร.ม.</p>
                ) : null}
              </div>

              {/* Property Details Grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                {property.size ? (
                  <div className="bg-slate-50 rounded-xl p-5 border border-slate-100">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                        <svg className="w-4 h-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                        </svg>
                      </div>
                      <p className="text-slate-500 text-sm">ขนาดพื้นที่</p>
                    </div>
                    <p className="text-2xl font-semibold text-slate-900">{property.size} ตร.ม.</p>
                  </div>
                ) : null}
                {property.bedrooms ? (
                  <div className="bg-slate-50 rounded-xl p-5 border border-slate-100">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center">
                        <svg className="w-4 h-4 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                        </svg>
                      </div>
                      <p className="text-slate-500 text-sm">ห้องนอน</p>
                    </div>
                    <p className="text-2xl font-semibold text-slate-900">{property.bedrooms}</p>
                  </div>
                ) : null}
                {property.bathrooms ? (
                  <div className="bg-slate-50 rounded-xl p-5 border border-slate-100">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 rounded-lg bg-cyan-100 flex items-center justify-center">
                        <svg className="w-4 h-4 text-cyan-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
                        </svg>
                      </div>
                      <p className="text-slate-500 text-sm">ห้องน้ำ</p>
                    </div>
                    <p className="text-2xl font-semibold text-slate-900">{property.bathrooms}</p>
                  </div>
                ) : null}
              </div>

              {/* Description */}
              {property.description ? (
                <div className="mt-8">
                  <h3 className="text-lg font-semibold text-slate-900 mb-3">รายละเอียดเพิ่มเติม</h3>
                  <p className="text-slate-600 leading-relaxed whitespace-pre-line">{property.description}</p>
                </div>
              ) : null}

              {/* Features */}
              {property.features && property.features.length > 0 ? (
                <div className="mt-8">
                  <h3 className="text-lg font-semibold text-slate-900 mb-4">จุดเด่น</h3>
                  <div className="space-y-2">
                    {property.features.map((feature, index) => (
                      <div key={index} className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg border border-slate-100">
                        <svg className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span className="text-slate-700 font-medium">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}
            </section>

            {/* Location and Map */}
            <section>
              <h2 className="text-2xl font-semibold text-slate-900 mb-4 pb-3 border-b border-gray-200">
                สถานที่ตั้ง
              </h2>

              {/* Map */}
              {property.lat && property.lng ? (
                <div className="mb-8">
                  <div className="relative h-96 bg-gray-100 rounded-2xl overflow-hidden border border-slate-200">
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
              ) : null}

              {/* Nearby Places */}
              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-4">สถานที่ใกล้เคียง</h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-xl border border-slate-100">
                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900">สถานีรถไฟฟ้า BTS</p>
                      <p className="text-sm text-slate-600 mt-0.5">ห่างประมาณ 1.2 กม.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-xl border border-slate-100">
                    <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900">ห้างสรรพสินค้า</p>
                      <p className="text-sm text-slate-600 mt-0.5">ห่างประมาณ 2.5 กม.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-xl border border-slate-100">
                    <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <svg className="w-6 h-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900">โรงเรียนนานาชาติ</p>
                      <p className="text-sm text-slate-600 mt-0.5">ห่างประมาณ 800 ม.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-xl border border-slate-100">
                    <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <svg className="w-6 h-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900">โรงพยาบาล</p>
                      <p className="text-sm text-slate-600 mt-0.5">ห่างประมาณ 3.0 กม.</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* ── Right Column - Contact Card (Sticky) ── */}
          <aside className="w-full lg:w-[360px] flex-shrink-0">
            <div className="sticky top-24 bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="px-6 py-6">
                <h2 className="text-xl font-semibold text-slate-900 mb-6">ติดต่อสอบถาม</h2>

                {property.agent ? (
                  <div className="space-y-5">
                    <div className="flex items-center gap-3 pb-5 border-b border-gray-100">
                      <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                        <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 mb-0.5">ผู้ติดต่อ</p>
                        <p className="text-lg font-semibold text-slate-900">{property.agent.name}</p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      {property.agent.phone ? (
                        <a
                          href={`tel:${property.agent.phone}`}
                          className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition border border-slate-100"
                        >
                          <div className="w-11 h-11 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                            <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                            </svg>
                          </div>
                          <div>
                            <p className="text-xs text-slate-500">โทรศัพท์</p>
                            <p className="font-semibold text-slate-900">{property.agent.phone}</p>
                          </div>
                        </a>
                      ) : null}

                      {property.agent.email ? (
                        <a
                          href={`mailto:${property.agent.email}`}
                          className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition border border-slate-100"
                        >
                          <div className="w-11 h-11 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                            <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs text-slate-500">อีเมล</p>
                            <p className="font-semibold text-slate-900 text-sm truncate">{property.agent.email}</p>
                          </div>
                        </a>
                      ) : null}
                    </div>

                    <button
                      type="button"
                      className="w-full py-3.5 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition flex items-center justify-center gap-2 shadow-sm"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                      </svg>
                      ติดต่อผ่าน Line
                    </button>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <svg className="w-12 h-12 text-gray-300 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <p className="text-slate-500">ไม่มีข้อมูลผู้ติดต่อ</p>
                  </div>
                )}

                {property.updatedAt ? (
                  <div className="mt-6 pt-5 border-t border-gray-100">
                    <p className="text-xs text-slate-500 text-center">{formatUpdatedAt(property.updatedAt)}</p>
                  </div>
                ) : null}
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* ── Lightbox with navigation ── */}
      {galleryIndex !== null && (
        <div
          className="fixed inset-0 bg-black/90 flex items-center justify-center p-4 z-[9999]"
          onClick={() => setGalleryIndex(null)}
        >
          {/* Close Button */}
          <button
            onClick={() => setGalleryIndex(null)}
            className="absolute top-6 right-6 w-12 h-12 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/20 transition-colors duration-200 z-[10001]"
          >
            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Counter */}
          <div
            className="absolute top-6 left-1/2 -translate-x-1/2 text-white/70 text-sm z-[10001]"
            style={{ fontFamily: EB }}
          >
            {galleryIndex + 1} / {allImages.length}
          </div>

          {/* Prev */}
          {galleryIndex > 0 && (
            <button
              className="absolute left-4 md:left-8 w-12 h-12 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/20 transition-colors duration-200 z-[10001]"
              onClick={(e) => { e.stopPropagation(); setGalleryIndex(galleryIndex - 1); }}
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
