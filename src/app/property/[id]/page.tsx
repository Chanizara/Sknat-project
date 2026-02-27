'use client';

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";

import { buildPriceLabel, formatPrice, formatUpdatedAt } from "@/lib/property-format";
import { type Property } from "@/types/property";

// Animated counter hook
function useCountUp(target: number, duration: number = 1500, start: boolean = false): number {
  const [count, setCount] = useState(0);
  const animationRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);

  const easeOutQuart = (t: number): number => 1 - Math.pow(1 - t, 4);

  useEffect(() => {
    if (!start) {
      setCount(0);
      return;
    }

    const animate = (timestamp: number) => {
      if (!startTimeRef.current) startTimeRef.current = timestamp;
      const elapsed = timestamp - startTimeRef.current;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easeOutQuart(progress);
      setCount(Math.floor(easedProgress * target));

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        setCount(target);
      }
    };

    animationRef.current = requestAnimationFrame(animate);
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      startTimeRef.current = null;
    };
  }, [target, duration, start]);

  return count;
}

export default function PropertyDetailPage() {
  const params = useParams();
  const propertyId = params.id as string;
  const [property, setProperty] = useState<Property | null>(null);
  const [galleryIndex, setGalleryIndex] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [isVisible, setIsVisible] = useState(false);
  const [startCounting, setStartCounting] = useState(false);
  const headerRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    setIsVisible(true);
    setTimeout(() => setStartCounting(true), 500);
  }, []);

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

  const priceValue = property?.price ? Math.floor(property.price / 1000000) : 0;
  const animatedPrice = useCountUp(priceValue, 2000, startCounting);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[linear-gradient(180deg,#f8fafc_0%,#f1f5f9_100%)]">
        <div className="flex flex-col items-center gap-4">
          <div className="relative w-16 h-16">
            <div className="absolute inset-0 rounded-full border-4 border-slate-200" />
            <div className="absolute inset-0 rounded-full border-4 border-slate-950 border-t-transparent animate-spin" />
          </div>
          <p className="text-slate-500 text-sm tracking-wide">กำลังโหลดข้อมูล...</p>
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[linear-gradient(180deg,#f8fafc_0%,#f1f5f9_100%)]">
        <div className="text-center">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-slate-100 flex items-center justify-center">
            <svg className="w-10 h-10 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4m-6 0h6" />
            </svg>
          </div>
          <h1 className="text-2xl font-semibold text-slate-900 mb-3">ไม่พบข้อมูลบ้าน</h1>
          <Link href="/" className="inline-flex items-center gap-2 px-6 py-3 bg-slate-950 text-white rounded-full text-sm font-semibold hover:bg-slate-800 transition-all">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            กลับไปหน้าหลัก
          </Link>
        </div>
      </div>
    );
  }

  const allImages = property.images?.length ? property.images : [property.image];
  const mainImage = allImages[0];
  const subImages = allImages.slice(1, 5);
  const remainingCount = Math.max(0, allImages.length - 5);

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#f8fafc_0%,#f1f5f9_50%,#e2e8f0_100%)]">
      {/* Floating Navigation */}
      <div className="fixed top-0 left-0 right-0 z-50 px-4 sm:px-6 lg:px-10 py-4">
        <div className="max-w-7xl mx-auto">
          <div 
            ref={headerRef}
            className={`inline-flex items-center gap-3 px-5 py-3 rounded-full backdrop-blur-xl transition-all duration-500 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
            } bg-white/80 shadow-[0_8px_32px_-12px_rgba(15,23,42,0.25)] border border-white/50`}
          >
            <Link
              href="/"
              className="flex items-center gap-2 text-slate-600 hover:text-slate-950 transition-colors text-sm font-medium"
            >
              <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center hover:bg-slate-200 transition-colors">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </div>
              <span className="hidden sm:inline">กลับไปหน้าหลัก</span>
            </Link>
            <span className="w-px h-4 bg-slate-300" />
            <span className="text-xs text-slate-500 uppercase tracking-wider">รายละเอียดทรัพย์</span>
          </div>
        </div>
      </div>

      {/* Hero Gallery Section */}
      <div className="pt-24 pb-8 px-4 sm:px-6 lg:px-10">
        <div className="max-w-7xl mx-auto">
          <div 
            className={`grid gap-3 md:gap-4 transition-all duration-1000 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
            style={{ 
              gridTemplateColumns: subImages.length >= 2 ? 'minmax(0, 1.2fr) minmax(0, 1fr)' : '1fr',
              gridTemplateRows: subImages.length >= 2 ? 'repeat(2, 280px)' : '500px'
            }}
          >
            {/* Main Large Image */}
            <div 
              className="relative row-span-2 rounded-[2rem] overflow-hidden cursor-pointer group shadow-[0_32px_64px_-24px_rgba(15,23,42,0.35)]"
              onClick={() => setGalleryIndex(0)}
            >
              <Image
                src={mainImage}
                alt={property.title}
                fill
                priority
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              {/* View All Photos Button */}
              <button
                onClick={(e) => { e.stopPropagation(); setGalleryIndex(0); }}
                className="absolute bottom-6 right-6 flex items-center gap-2 px-5 py-3 bg-white/95 backdrop-blur-sm rounded-full text-sm font-semibold text-slate-900 hover:bg-white shadow-lg hover:shadow-xl transition-all duration-200"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
                ดูรูปทั้งหมด {allImages.length > 1 && `(${allImages.length})`}
              </button>
            </div>

            {/* Sub Images Grid */}
            {subImages.map((img, idx) => (
              <div
                key={idx}
                className="relative rounded-[1.5rem] overflow-hidden cursor-pointer group shadow-lg"
                onClick={() => setGalleryIndex(idx + 1)}
              >
                <Image
                  src={img}
                  alt={`${property.title} - ${idx + 2}`}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                {idx === subImages.length - 1 && remainingCount > 0 && (
                  <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center gap-2 hover:bg-black/40 transition-colors">
                    <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span className="text-white text-2xl font-bold">+{remainingCount}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="px-4 sm:px-6 lg:px-10 pb-20">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
            {/* Left Content */}
            <div className="flex-1">
              {/* Header Info */}
              <div 
                className={`transition-all duration-1000 delay-200 ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
              >
                <div className="flex flex-wrap items-center gap-3 mb-4">
                  <span className="inline-flex items-center px-4 py-1.5 rounded-full text-xs font-semibold text-white bg-slate-950">
                    {property.type}
                  </span>
                  {property.propertyType && (
                    <span className="inline-flex items-center px-4 py-1.5 rounded-full text-xs font-medium text-slate-700 bg-white/80 backdrop-blur-sm border border-slate-200">
                      {property.propertyType}
                    </span>
                  )}
                  {property.category && (
                    <span className="inline-flex items-center px-4 py-1.5 rounded-full text-xs font-medium text-slate-600 bg-slate-100">
                      {property.category}
                    </span>
                  )}
                </div>

                <h1 className="text-3xl md:text-4xl lg:text-5xl font-semibold text-slate-950 leading-[1.2] md:leading-[1.15] mb-4">
                  {property.title}
                </h1>

                <div className="flex items-center gap-2 text-slate-600 mb-8">
                  <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center">
                    <svg className="w-5 h-5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <span className="text-base">{property.location}</span>
                </div>
              </div>

              {/* Main Info Card */}
              <div 
                className={`rounded-[2rem] bg-white/70 p-8 shadow-[0_20px_50px_-20px_rgba(15,23,42,0.2)] backdrop-blur-xl border border-white/50 transition-all duration-1000 delay-300 ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
              >
                {/* Price Section */}
                <div className="mb-8 pb-8 border-b border-slate-200">
                  <p className="text-[11px] uppercase tracking-[0.2em] text-slate-500 mb-2">ราคาขาย</p>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl md:text-5xl font-bold text-slate-950 tabular-nums">
                      ฿{animatedPrice > 0 ? animatedPrice.toLocaleString() : priceValue.toLocaleString()}
                      {animatedPrice === priceValue && priceValue > 0 ? ",000,000" : ""}
                    </span>
                    {property.price && property.price < 1000000 && (
                      <span className="text-4xl md:text-5xl font-bold text-slate-950">
                        {buildPriceLabel(property).replace(/[0-9,]/g, '')}
                      </span>
                    )}
                  </div>
                  {property.pricePerSqm && (
                    <p className="mt-2 text-slate-500 text-sm">{formatPrice(property.pricePerSqm)}/ตร.ม.</p>
                  )}
                </div>

                {/* Property Specs */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
                  {property.size && (
                    <div className="text-center p-4 rounded-2xl bg-slate-50">
                      <div className="w-10 h-10 mx-auto mb-2 rounded-xl bg-white flex items-center justify-center shadow-sm">
                        <svg className="w-5 h-5 text-slate-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                        </svg>
                      </div>
                      <p className="text-lg font-semibold text-slate-950">{property.size}</p>
                      <p className="text-xs text-slate-500">ตร.ม.</p>
                    </div>
                  )}
                  {property.bedrooms && (
                    <div className="text-center p-4 rounded-2xl bg-slate-50">
                      <div className="w-10 h-10 mx-auto mb-2 rounded-xl bg-white flex items-center justify-center shadow-sm">
                        <svg className="w-5 h-5 text-slate-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 20h14M7 16v-6a2 2 0 012-2h6a2 2 0 012 2v6M3 16h18v2a2 2 0 01-2 2H5a2 2 0 01-2-2v-2z" />
                        </svg>
                      </div>
                      <p className="text-lg font-semibold text-slate-950">{property.bedrooms}</p>
                      <p className="text-xs text-slate-500">ห้องนอน</p>
                    </div>
                  )}
                  {property.bathrooms && (
                    <div className="text-center p-4 rounded-2xl bg-slate-50">
                      <div className="w-10 h-10 mx-auto mb-2 rounded-xl bg-white flex items-center justify-center shadow-sm">
                        <svg className="w-5 h-5 text-slate-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 10v7a2 2 0 01-2 2H7a2 2 0 01-2-2v-7m14-4h-3a2 2 0 00-2 2v2H8V8a2 2 0 00-2-2H3v4h16V6z" />
                        </svg>
                      </div>
                      <p className="text-lg font-semibold text-slate-950">{property.bathrooms}</p>
                      <p className="text-xs text-slate-500">ห้องน้ำ</p>
                    </div>
                  )}
                  <div className="text-center p-4 rounded-2xl bg-slate-50">
                    <div className="w-10 h-10 mx-auto mb-2 rounded-xl bg-white flex items-center justify-center shadow-sm">
                      <svg className="w-5 h-5 text-slate-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                      </svg>
                    </div>
                    <p className="text-lg font-semibold text-slate-950">2</p>
                    <p className="text-xs text-slate-500">ที่จอดรถ</p>
                  </div>
                </div>

                {/* Description */}
                {property.description && (
                  <div className="mb-8">
                    <h3 className="text-lg font-semibold text-slate-950 mb-4">รายละเอียด</h3>
                    <p className="text-slate-600 leading-relaxed whitespace-pre-line">{property.description}</p>
                  </div>
                )}

                {/* Features */}
                {property.features && property.features.length > 0 && (
                  <div className="mb-8">
                    <h3 className="text-lg font-semibold text-slate-950 mb-4">จุดเด่น</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {property.features.map((feature, index) => (
                        <div key={index} className="flex items-center gap-3 p-3 rounded-xl bg-slate-50/50">
                          <div className="w-8 h-8 rounded-lg bg-slate-950 flex items-center justify-center flex-shrink-0">
                            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                          <span className="text-slate-700 text-sm">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Additional Information */}
                <div className="pt-8 border-t border-slate-200">
                  <h3 className="text-lg font-semibold text-slate-950 mb-4">ข้อมูลเพิ่มเติม</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div className="p-4 rounded-2xl bg-slate-50">
                      <p className="text-xs text-slate-500 mb-1">รหัสทรัพย์</p>
                      <p className="font-semibold text-slate-950">#{String(property.id).padStart(5, '0')}</p>
                    </div>
                    <div className="p-4 rounded-2xl bg-slate-50">
                      <p className="text-xs text-slate-500 mb-1">ประเภท</p>
                      <p className="font-semibold text-slate-950">{property.propertyType || 'บ้านเดี่ยว'}</p>
                    </div>
                    <div className="p-4 rounded-2xl bg-slate-50">
                      <p className="text-xs text-slate-500 mb-1">สถานะ</p>
                      <p className="font-semibold text-slate-950">{property.type}</p>
                    </div>
                    <div className="p-4 rounded-2xl bg-slate-50">
                      <p className="text-xs text-slate-500 mb-1">ที่จอดรถ</p>
                      <p className="font-semibold text-slate-950">2 คัน</p>
                    </div>
                    <div className="p-4 rounded-2xl bg-slate-50">
                      <p className="text-xs text-slate-500 mb-1">ชั้น</p>
                      <p className="font-semibold text-slate-950">2 ชั้น</p>
                    </div>
                    <div className="p-4 rounded-2xl bg-slate-50">
                      <p className="text-xs text-slate-500 mb-1">ทิศทาง</p>
                      <p className="font-semibold text-slate-950">ทิศตะวันออก</p>
                    </div>
                  </div>
                </div>

                {/* Nearby Places */}
                <div className="pt-8 border-t border-slate-200">
                  <h3 className="text-lg font-semibold text-slate-950 mb-4">สถานที่ใกล้เคียง</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center">
                          <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                          </svg>
                        </div>
                        <div>
                          <p className="font-semibold text-slate-950">โรงพยาบาลกรุงเทพ</p>
                          <p className="text-xs text-slate-500">โรงพยาบาล</p>
                        </div>
                      </div>
                      <span className="text-sm text-slate-600">1.2 กม.</span>
                    </div>
                    <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                          <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                          </svg>
                        </div>
                        <div>
                          <p className="font-semibold text-slate-950">เซ็นทรัลพลาซา</p>
                          <p className="text-xs text-slate-500">ห้างสรรพสินค้า</p>
                        </div>
                      </div>
                      <span className="text-sm text-slate-600">2.5 กม.</span>
                    </div>
                    <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
                          <svg className="w-5 h-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                          </svg>
                        </div>
                        <div>
                          <p className="font-semibold text-slate-950">โรงเรียนนานาชาติ</p>
                          <p className="text-xs text-slate-500">การศึกษา</p>
                        </div>
                      </div>
                      <span className="text-sm text-slate-600">800 ม.</span>
                    </div>
                    <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center">
                          <svg className="w-5 h-5 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                          </svg>
                        </div>
                        <div>
                          <p className="font-semibold text-slate-950">BTS อโศก</p>
                          <p className="text-xs text-slate-500">รถไฟฟ้า</p>
                        </div>
                      </div>
                      <span className="text-sm text-slate-600">3.0 กม.</span>
                    </div>
                  </div>
                </div>

                {/* Location Map */}
                <div className="pt-8 border-t border-slate-200">
                  <h3 className="text-lg font-semibold text-slate-950 mb-4">แผนที่</h3>
                  {property.lat && property.lng ? (
                    <div className="relative h-72 rounded-2xl overflow-hidden shadow-lg">
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
                  ) : (
                    <div className="relative h-72 rounded-2xl overflow-hidden bg-slate-100 flex items-center justify-center">
                      <p className="text-slate-500">ไม่มีข้อมูลแผนที่</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right Sidebar - Contact */}
            <aside className="w-full lg:w-[380px] flex-shrink-0">
              <div 
                className={`sticky top-28 transition-all duration-1000 delay-500 ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
              >
                <div className="rounded-[2rem] bg-white/70 p-8 shadow-[0_20px_50px_-20px_rgba(15,23,42,0.2)] backdrop-blur-xl border border-white/50">
                  <h3 className="text-xl font-semibold text-slate-950 mb-6">ติดต่อสอบถาม</h3>

                  {property.agent ? (
                    <div>
                      {/* Agent Info */}
                      <div className="flex items-center gap-4 mb-6 pb-6 border-b border-slate-200">
                        <div className="w-16 h-16 rounded-full bg-slate-950 flex items-center justify-center">
                          <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                        </div>
                        <div>
                          <p className="text-xs text-slate-500 mb-1">ผู้ติดต่อ</p>
                          <p className="text-lg font-semibold text-slate-950">{property.agent.name}</p>
                        </div>
                      </div>

                      {/* Contact Methods */}
                      <div className="space-y-4 mb-6">
                        {property.agent.phone && (
                          <a
                            href={`tel:${property.agent.phone}`}
                            className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 hover:bg-slate-100 transition-colors group"
                          >
                            <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                              <svg className="w-5 h-5 text-slate-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                              </svg>
                            </div>
                            <div>
                              <p className="text-xs text-slate-500">โทร</p>
                              <p className="font-semibold text-slate-950">{property.agent.phone}</p>
                            </div>
                          </a>
                        )}

                        {property.agent.email && (
                          <a
                            href={`mailto:${property.agent.email}`}
                            className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 hover:bg-slate-100 transition-colors group"
                          >
                            <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                              <svg className="w-5 h-5 text-slate-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                              </svg>
                            </div>
                            <div>
                              <p className="text-xs text-slate-500">อีเมล</p>
                              <p className="font-semibold text-slate-950 text-sm truncate max-w-[180px]">{property.agent.email}</p>
                            </div>
                          </a>
                        )}
                      </div>

                      {/* LINE ID */}
                      <div className="p-4 rounded-2xl bg-gradient-to-r from-[#06C755] to-[#05a347] text-white">
                        <div className="flex items-center gap-3 mb-2">
                          <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63h2.386c.349 0 .63.285.63.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .345-.285.63-.631.63s-.63-.285-.63-.63V8.108c0-.345.282-.63.63-.63.346 0 .63.285.63.63v4.771zm-1.65.631c-.345 0-.63-.285-.63-.63V8.108c0-.345.285-.63.63-.63.346 0 .629.285.629.63v4.772c0 .344-.283.629-.63.629zm-2.466.631c-.345 0-.63-.286-.63-.631V8.739h-1.17c-.345 0-.63-.285-.63-.63 0-.345.285-.63.63-.63h3.601c.345 0 .63.285.63.63 0 .345-.285.63-.63.63h-1.17v4.771c0 .345-.285.631-.631.631zm-2.902 0c-.346 0-.631-.286-.631-.631V8.108c0-.345.285-.63.63-.63h1.756c.869 0 1.575.706 1.575 1.574 0 .869-.706 1.575-1.575 1.575H8.492v2.401c0 .345-.285.631-.63.631zm.63-4.772v1.512h1.126c.315 0 .57-.255.57-.57 0-.316-.255-.571-.57-.571H8.492v.629z"/>
                          </svg>
                          <span className="font-semibold">LINE ID</span>
                        </div>
                        <p className="text-lg font-bold tracking-wide">@sknat.property</p>
                        <p className="text-xs text-white/80 mt-1">แอดไลน์เพื่อสอบถามข้อมูลเพิ่มเติม</p>
                      </div>
                      
                      <p className="mt-4 text-xs text-slate-400 text-center">
                        พร้อมตอบทุกคำถามภายใน 24 ชั่วโมง
                      </p>

                      {property.updatedAt && (
                        <p className="mt-6 text-xs text-slate-400 text-center">
                          {formatUpdatedAt(property.updatedAt)}
                        </p>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-slate-100 flex items-center justify-center">
                        <svg className="w-8 h-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                      <p className="text-slate-500">ไม่มีข้อมูลผู้ติดต่อ</p>
                    </div>
                  )}
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>

      {/* Lightbox Modal */}
      {galleryIndex !== null && (
        <div
          className="fixed inset-0 z-[10000] bg-black/95 flex items-center justify-center"
          onClick={() => setGalleryIndex(null)}
        >
          {/* Close Button */}
          <button
            onClick={() => setGalleryIndex(null)}
            className="absolute top-6 right-6 w-12 h-12 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/20 transition-colors z-[10001]"
          >
            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Previous Button */}
          {galleryIndex > 0 && (
            <button
              onClick={(e) => { e.stopPropagation(); setGalleryIndex(galleryIndex - 1); }}
              className="absolute left-4 md:left-8 w-12 h-12 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/20 transition-colors z-[10001]"
            >
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          )}

          {/* Next Button */}
          {galleryIndex < allImages.length - 1 && (
            <button
              onClick={(e) => { e.stopPropagation(); setGalleryIndex(galleryIndex + 1); }}
              className="absolute right-4 md:right-8 w-12 h-12 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/20 transition-colors z-[10001]"
            >
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          )}

          {/* Image */}
          <div
            className="relative max-w-6xl max-h-[85vh] w-full h-full flex items-center justify-center p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              key={galleryIndex}
              src={allImages[galleryIndex]}
              alt={`Photo ${galleryIndex + 1}`}
              width={1200}
              height={800}
              className="max-w-full max-h-full object-contain rounded-lg"
            />
          </div>

          {/* Thumbnails */}
          <div
            className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 px-4 py-3 bg-black/50 backdrop-blur-sm rounded-2xl max-w-[90vw] overflow-x-auto z-[10001]"
            onClick={(e) => e.stopPropagation()}
          >
            {allImages.map((img, i) => (
              <button
                key={i}
                onClick={() => setGalleryIndex(i)}
                className={`flex-shrink-0 w-14 h-10 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                  i === galleryIndex ? 'border-white scale-110' : 'border-white/30 hover:border-white/60'
                }`}
              >
                <Image src={img} alt="" width={56} height={40} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>

          {/* Counter */}
          <div className="absolute top-6 left-6 px-4 py-2 bg-black/50 backdrop-blur-sm rounded-full text-white text-sm font-medium z-[10001]">
            {galleryIndex + 1} / {allImages.length}
          </div>
        </div>
      )}
    </div>
  );
}
