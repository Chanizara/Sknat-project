'use client';

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";

import { buildPriceLabel, formatPrice, formatUpdatedAt } from "@/lib/property-format";
import { type Property } from "@/types/property";
import { useFavoritesStore } from "@/lib/favorites-store";

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

// Nearby place item component
function NearbyPlaceItem({ 
  icon, 
  name, 
  category, 
  distance,
  delay 
}: { 
  icon: React.ReactNode;
  name: string;
  category: string;
  distance: string;
  delay: number;
}) {
  return (
    <div 
      className="group flex items-center justify-between p-4 rounded-2xl bg-white/70 hover:bg-white transition-all duration-300 border border-slate-100 hover:border-slate-200 shadow-sm hover:shadow-md"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center border border-slate-100 group-hover:scale-105 transition-transform duration-300">
          {icon}
        </div>
        <div>
          <p className="font-semibold text-slate-900 group-hover:text-slate-800 transition-colors">{name}</p>
          <p className="text-xs text-slate-500">{category}</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        <span className="text-sm font-medium text-slate-600">{distance}</span>
      </div>
    </div>
  );
}

// Feature tag component
function FeatureTag({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-white text-slate-700 text-sm font-medium border border-slate-200 shadow-sm hover:bg-slate-50 transition-colors">
      <svg className="w-4 h-4 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
      </svg>
      {label}
    </span>
  );
}

// Detail item component
function DetailItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col p-4 rounded-2xl bg-white/70 border border-slate-100">
      <span className="text-xs text-slate-500 uppercase tracking-wider mb-1">{label}</span>
      <span className="font-semibold text-slate-900">{value}</span>
    </div>
  );
}

export default function PropertyDetailPage() {
  const params = useParams();
  const propertyId = params.id as string;
  const [property, setProperty] = useState<Property | null>(null);
  const [galleryIndex, setGalleryIndex] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [isVisible, setIsVisible] = useState(false);
  const [startCounting, setStartCounting] = useState(false);
  
  const [showShareToast, setShowShareToast] = useState(false);
  const [showSaveToast, setShowSaveToast] = useState(false);
  const { addFavorite, removeFavorite, isFavorite } = useFavoritesStore();
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

  const handleShare = async () => {
    const url = window.location.href;
    const title = property?.title || 'สนใจบ้านหลังนี้';
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: title,
          text: `ดูบ้านหลังนี้: ${title} - ราคา ${property ? buildPriceLabel(property) : ''}`,
          url: url,
        });
      } catch (err) {
        console.log('Share cancelled');
      }
    } else {
      try {
        await navigator.clipboard.writeText(url);
        setShowShareToast(true);
        setTimeout(() => setShowShareToast(false), 2000);
      } catch (err) {
        console.error('Failed to copy:', err);
      }
    }
  };

  const handleSave = () => {
    if (!property) return;
    
    if (isFavorite(property.id)) {
      removeFavorite(property.id);
      setShowSaveToast(true);
      setTimeout(() => setShowSaveToast(false), 2000);
    } else {
      const success = addFavorite(property);
      if (success) {
        setShowSaveToast(true);
        setTimeout(() => setShowSaveToast(false), 2000);
      } else {
        alert('คุณสามารถบันทึกได้สูงสุด 3 บ้านเท่านั้น');
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[linear-gradient(180deg,#f8fafc_0%,#f1f5f9_100%)]">
        <div className="flex flex-col items-center gap-4">
          <div className="relative w-16 h-16">
            <div className="absolute inset-0 rounded-full border-4 border-slate-200" />
            <div className="absolute inset-0 rounded-full border-4 border-slate-800 border-t-transparent animate-spin" />
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
  const isSaved = isFavorite(property.id);

  const nearbyPlaces = [
    {
      icon: <svg className="w-5 h-5 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>,
      name: "โรงพยาบาลกรุงเทพ",
      category: "โรงพยาบาล",
      distance: "1.2 กม."
    },
    {
      icon: <svg className="w-5 h-5 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
      </svg>,
      name: "เซ็นทรัลพลาซา",
      category: "ห้างสรรพสินค้า",
      distance: "2.5 กม."
    },
    {
      icon: <svg className="w-5 h-5 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>,
      name: "โรงเรียนนานาชาติ",
      category: "การศึกษา",
      distance: "800 ม."
    },
    {
      icon: <svg className="w-5 h-5 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>,
      name: "BTS อโศก",
      category: "รถไฟฟ้า",
      distance: "3.0 กม."
    }
  ];

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#f8fafc_0%,#f1f5f9_50%,#e2e8f0_100%)]">
      {/* Decorative Elements */}
      <div className="pointer-events-none absolute -left-28 top-20 h-72 w-72 rounded-full bg-cyan-200/35 blur-3xl" />
      <div className="pointer-events-none absolute right-0 top-28 h-72 w-72 rounded-full bg-blue-300/25 blur-3xl" />

      {/* Floating Navigation */}
      <div className="fixed top-0 left-0 right-0 z-50 px-4 sm:px-6 lg:px-10 py-4">
        <div className="max-w-7xl mx-auto">
          <div 
            ref={headerRef}
            className={`inline-flex items-center gap-3 px-5 py-3 rounded-full backdrop-blur-xl transition-all duration-500 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
            } bg-white/90 shadow-[0_8px_32px_-12px_rgba(15,23,42,0.25)] border border-white/50`}
          >
            <Link
              href="/"
              className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors text-sm font-medium"
            >
              <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center hover:bg-slate-200 transition-colors">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </div>
              <span className="hidden sm:inline">กลับไปหน้าหลัก</span>
            </Link>
            <span className="w-px h-4 bg-slate-300" />
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 uppercase tracking-wider">รายละเอียดทรัพย์</span>
              <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 text-xs font-medium">
                {property.type}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Gallery Section */}
      <div className="pt-20 pb-8 px-4 sm:px-6 lg:px-10">
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
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
              
              {/* Property Info Overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  <span className="px-3 py-1 rounded-full bg-white/90 backdrop-blur-sm text-slate-900 text-xs font-semibold">
                    {property.propertyType || 'บ้านเดี่ยว'}
                  </span>
                  <span className="px-3 py-1 rounded-full bg-black/30 backdrop-blur-sm text-white text-xs">
                    รหัส #{String(property.id).padStart(5, '0')}
                  </span>
                </div>
              </div>
              
              {/* View All Photos Button */}
              <button
                onClick={(e) => { e.stopPropagation(); setGalleryIndex(0); }}
                className="absolute bottom-6 right-6 sm:bottom-8 sm:right-8 flex items-center gap-2 px-5 py-3 bg-white text-slate-900 rounded-full text-sm font-semibold hover:bg-slate-100 shadow-lg hover:shadow-xl transition-all duration-200"
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

      {/* Price Bar - Sticky */}
      <div className="sticky top-0 z-40 bg-white/95 backdrop-blur-xl border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-bold text-slate-900">
                ฿{animatedPrice > 0 ? animatedPrice.toLocaleString() : priceValue.toLocaleString()}
                {animatedPrice === priceValue && priceValue > 0 ? ",000,000" : ""}
              </span>
              {property.price && property.price < 1000000 && (
                <span className="text-xl sm:text-2xl font-bold text-slate-900">
                  {buildPriceLabel(property).replace(/[0-9,]/g, '')}
                </span>
              )}
            </div>
            <div className="hidden sm:flex items-center gap-6 text-sm text-slate-600">
              {property.size && (
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                  </svg>
                  <span>{property.size} ตร.ม.</span>
                </div>
              )}
              {property.bedrooms && (
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 20h14M7 16v-6a2 2 0 012-2h6a2 2 0 012 2v6M3 16h18v2a2 2 0 01-2 2H5a2 2 0 01-2-2v-2z" />
                  </svg>
                  <span>{property.bedrooms} ห้องนอน</span>
                </div>
              )}
              {property.bathrooms && (
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 10v7a2 2 0 01-2 2H7a2 2 0 01-2-2v-7m14-4h-3a2 2 0 00-2 2v2H8V8a2 2 0 00-2-2H3v4h16V6z" />
                  </svg>
                  <span>{property.bathrooms} ห้องน้ำ</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-12">
        {/* Property Title & Location */}
        <div className={`mb-8 transition-all duration-1000 delay-100 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3">
            {property.title}
          </h1>
          <div className="flex items-center gap-2 text-slate-600">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="text-lg">{property.location}</span>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-12">
          {/* Left Content */}
          <div className="flex-1">
            {/* Specs Grid */}
            <div 
              className={`grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10 transition-all duration-1000 delay-200 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
            >
              {property.size && (
                <div className="text-center p-6 rounded-2xl bg-white/80 border border-slate-200 shadow-sm hover:shadow-md transition-all">
                  <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-slate-50 flex items-center justify-center border border-slate-100">
                    <svg className="w-6 h-6 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                    </svg>
                  </div>
                  <p className="text-2xl font-bold text-slate-900">{property.size}</p>
                  <p className="text-sm text-slate-500">ตร.ม.</p>
                </div>
              )}
              {property.bedrooms && (
                <div className="text-center p-6 rounded-2xl bg-white/80 border border-slate-200 shadow-sm hover:shadow-md transition-all">
                  <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-slate-50 flex items-center justify-center border border-slate-100">
                    <svg className="w-6 h-6 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 20h14M7 16v-6a2 2 0 012-2h6a2 2 0 012 2v6M3 16h18v2a2 2 0 01-2 2H5a2 2 0 01-2-2v-2z" />
                    </svg>
                  </div>
                  <p className="text-2xl font-bold text-slate-900">{property.bedrooms}</p>
                  <p className="text-sm text-slate-500">ห้องนอน</p>
                </div>
              )}
              {property.bathrooms && (
                <div className="text-center p-6 rounded-2xl bg-white/80 border border-slate-200 shadow-sm hover:shadow-md transition-all">
                  <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-slate-50 flex items-center justify-center border border-slate-100">
                    <svg className="w-6 h-6 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 10v7a2 2 0 01-2 2H7a2 2 0 01-2-2v-7m14-4h-3a2 2 0 00-2 2v2H8V8a2 2 0 00-2-2H3v4h16V6z" />
                    </svg>
                  </div>
                  <p className="text-2xl font-bold text-slate-900">{property.bathrooms}</p>
                  <p className="text-sm text-slate-500">ห้องน้ำ</p>
                </div>
              )}
              <div className="text-center p-6 rounded-2xl bg-white/80 border border-slate-200 shadow-sm hover:shadow-md transition-all">
                <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-slate-50 flex items-center justify-center border border-slate-100">
                  <svg className="w-6 h-6 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                  </svg>
                </div>
                <p className="text-2xl font-bold text-slate-900">2</p>
                <p className="text-sm text-slate-500">ที่จอดรถ</p>
              </div>
            </div>

            {/* Content */}
            <div className="mb-10 space-y-6">
              {/* Description */}
              <div className="bg-white/80 backdrop-blur-sm rounded-[2rem] p-8 border border-slate-200 shadow-sm">
                <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center border border-slate-100">
                    <svg className="w-5 h-5 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  รายละเอียด
                </h2>
                <p className="text-slate-600 leading-relaxed whitespace-pre-line">บ้านเดี่ยว 3 ชั้น สไตล์ Modern Minimalist ออกแบบร่วมสมัย เน้นความเรียบหรู โปร่งโล่ง และการใช้พื้นที่อย่างคุ้มค่า เหมาะสำหรับครอบครัวขนาดกลางถึงใหญ่</p>
              </div>

              {/* Features */}
              {property.features && property.features.length > 0 && (
                <div className="bg-white/80 backdrop-blur-sm rounded-[2rem] p-8 border border-slate-200 shadow-sm">
                  <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center border border-slate-100">
                      <svg className="w-5 h-5 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                      </svg>
                    </div>
                    จุดเด่น
                  </h2>
                  <div className="flex flex-wrap gap-3">
                    {property.features.map((feature, index) => (
                      <FeatureTag key={index} label={feature} />
                    ))}
                  </div>
                </div>
              )}

              {/* Property Details Grid */}
              <div className="bg-white/80 backdrop-blur-sm rounded-[2rem] p-8 border border-slate-200 shadow-sm">
                <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center border border-slate-100">
                    <svg className="w-5 h-5 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                  ข้อมูลทรัพย์
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  <DetailItem label="รหัสทรัพย์" value={`#${String(property.id).padStart(5, '0')}`} />
                  <DetailItem label="ประเภท" value={property.propertyType || 'บ้านเดี่ยว'} />
                  <DetailItem label="สถานะ" value={property.type} />
                  <DetailItem label="ที่จอดรถ" value="2 คัน" />
                  <DetailItem label="จำนวนชั้น" value="3 ชั้น" />
                  <DetailItem label="ทิศทาง" value="ทิศตะวันออก" />
                </div>
              </div>
            </div>

            {/* Nearby Places */}
            <div className="bg-white/80 backdrop-blur-sm rounded-[2rem] p-8 border border-slate-200 shadow-sm mb-8">
              <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center border border-slate-100">
                  <svg className="w-5 h-5 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                สถานที่ใกล้เคียง
              </h2>
              <div className="grid gap-3">
                {nearbyPlaces.map((place, index) => (
                  <NearbyPlaceItem
                    key={index}
                    icon={place.icon}
                    name={place.name}
                    category={place.category}
                    distance={place.distance}
                    delay={index * 100}
                  />
                ))}
              </div>
            </div>

            {/* Location Map */}
            <div className="bg-white/80 backdrop-blur-sm rounded-[2rem] p-8 border border-slate-200 shadow-sm">
              <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center border border-slate-100">
                  <svg className="w-5 h-5 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 7m0 13V7" />
                  </svg>
                </div>
                แผนที่
              </h2>
              {property.lat && property.lng ? (
                <div className="relative h-96 rounded-2xl overflow-hidden shadow-inner bg-slate-100">
                  <iframe
                    src={`https://www.google.com/maps?q=${property.lat},${property.lng}&hl=th&z=15&output=embed`}
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                  <a 
                    href={`https://www.google.com/maps/search/?api=1&query=${property.lat},${property.lng}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="absolute bottom-4 right-4 flex items-center gap-2 px-4 py-2.5 bg-white rounded-full text-sm font-medium text-slate-700 shadow-lg hover:shadow-xl transition-all hover:bg-slate-50 border border-slate-200"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                    เปิดใน Google Maps
                  </a>
                </div>
              ) : (
                <div className="relative h-96 rounded-2xl overflow-hidden bg-slate-100 flex items-center justify-center">
                  <p className="text-slate-500">ไม่มีข้อมูลแผนที่</p>
                </div>
              )}
            </div>
          </div>

          {/* Right Sidebar - Contact */}
          <aside className="w-full lg:w-[380px] flex-shrink-0">
            <div 
              className={`sticky top-24 transition-all duration-1000 delay-300 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
            >
              {/* Contact Card */}
              <div className="rounded-[2rem] bg-white/80 backdrop-blur-sm p-8 border border-slate-200 shadow-[0_20px_50px_-20px_rgba(15,23,42,0.15)]">
                {/* Header - Changed from green to slate */}
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-14 h-14 rounded-2xl bg-slate-950 flex items-center justify-center shadow-lg">
                    <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">ติดต่อสอบถาม</h3>
                    <p className="text-sm text-slate-500">เจ้าหน้าที่พร้อมให้คำปรึกษา</p>
                  </div>
                </div>

                {property.agent ? (
                  <div className="space-y-5">
                    {/* Agent Info */}
                    <div className="flex items-center gap-4 p-5 rounded-2xl bg-slate-50 border border-slate-100">
                      <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center border border-slate-200 shadow-sm">
                        <svg className="w-8 h-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 mb-1">ผู้ติดต่อ</p>
                        <p className="text-lg font-bold text-slate-900">{property.agent.name}</p>
                      </div>
                    </div>

                    {/* Contact Buttons - Redesigned with consistent slate theme */}
                    <div className="space-y-3">
                      {/* Phone Button - Changed from dark blue to white/outline style */}
                      {property.agent.phone && (
                        <a
                          href={`tel:${property.agent.phone}`}
                          className="flex items-center gap-4 p-4 rounded-2xl bg-white border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-all group"
                        >
                          <div className="w-12 h-12 rounded-xl bg-slate-950 flex items-center justify-center group-hover:scale-105 transition-transform">
                            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                            </svg>
                          </div>
                          <div className="flex-1">
                            <p className="text-xs text-slate-500">โทร</p>
                            <p className="font-semibold text-slate-900">{property.agent.phone}</p>
                          </div>
                          <svg className="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </a>
                      )}

                      {/* Email Button */}
                      {property.agent.email && (
                        <a
                          href={`mailto:${property.agent.email}`}
                          className="flex items-center gap-4 p-4 rounded-2xl bg-white hover:bg-slate-50 transition-all border border-slate-200 group"
                        >
                          <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center group-hover:scale-105 transition-transform">
                            <svg className="w-5 h-5 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs text-slate-500">อีเมล</p>
                            <p className="font-semibold text-slate-900 text-sm truncate">{property.agent.email}</p>
                          </div>
                        </a>
                      )}

                      {/* LINE Button - Changed from green to slate theme */}
                      <a
                        href="https://line.me/ti/p/@sknat.property"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-4 p-4 rounded-2xl bg-white border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-all group"
                      >
                        <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center group-hover:scale-105 transition-transform">
                          <svg className="w-5 h-5 text-slate-600" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63h2.386c.349 0 .63.285.63.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .345-.285.63-.631.63s-.63-.285-.63-.63V8.108c0-.345.282-.63.63-.63.346 0 .63.285.63.63v4.771zm-1.65.631c-.345 0-.63-.285-.63-.63V8.108c0-.345.285-.63.63-.63.346 0 .629.285.629.63v4.772c0 .344-.283.629-.63.629zm-2.466.631c-.345 0-.63-.286-.63-.631V8.739h-1.17c-.345 0-.63-.285-.63-.63 0-.345.285-.63.63-.63h3.601c.345 0 .63.285.63.63 0 .345-.285.63-.63.63h-1.17v4.771c0 .345-.285.631-.631.631zm-2.902 0c-.346 0-.631-.286-.631-.631V8.108c0-.345.285-.63.63-.63h1.756c.869 0 1.575.706 1.575 1.574 0 .869-.706 1.575-1.575 1.575H8.492v2.401c0 .345-.285.631-.63.631zm.63-4.772v1.512h1.126c.315 0 .57-.255.57-.57 0-.316-.255-.571-.57-.571H8.492v.629z"/>
                          </svg>
                        </div>
                        <div className="flex-1">
                          <p className="text-xs text-slate-500">LINE ID</p>
                          <p className="font-semibold text-slate-900">@sknat.property</p>
                        </div>
                        <svg className="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </a>
                    </div>

                    <p className="text-center text-xs text-slate-400 pt-2">
                      พร้อมตอบทุกคำถามภายใน 24 ชั่วโมง
                    </p>

                    {property.updatedAt && (
                      <p className="text-center text-xs text-slate-400 border-t border-slate-100 pt-4">
                        อัปเดตล่าสุด: {formatUpdatedAt(property.updatedAt)}
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-slate-50 flex items-center justify-center border border-slate-100">
                      <svg className="w-8 h-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <p className="text-slate-500">ไม่มีข้อมูลผู้ติดต่อ</p>
                  </div>
                )}
              </div>

              {/* Quick Actions */}
              <div className="mt-6 grid grid-cols-2 gap-3">
                <button 
                  onClick={handleShare}
                  className="flex items-center justify-center gap-2 p-4 rounded-2xl bg-white border border-slate-200 text-slate-700 font-medium hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                  </svg>
                  แชร์
                </button>
                <button 
                  onClick={handleSave}
                  className={`flex items-center justify-center gap-2 p-4 rounded-2xl border font-medium transition-all shadow-sm ${
                    isSaved 
                      ? 'bg-red-50 border-red-200 text-red-600' 
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300'
                  }`}
                >
                  <svg className="w-5 h-5" fill={isSaved ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                  </svg>
                  {isSaved ? 'บันทึกแล้ว' : 'บันทึก'}
                </button>
              </div>

              {/* Price per sqm info - Changed from emerald to slate */}
              {property.pricePerSqm && (
                <div className="mt-6 p-5 rounded-2xl bg-slate-50 border border-slate-200">
                  <p className="text-xs text-slate-500 mb-1">ราคาต่อตร.ม.</p>
                  <p className="text-xl font-bold text-slate-900">{formatPrice(property.pricePerSqm)}/ตร.ม.</p>
                </div>
              )}
            </div>
          </aside>
        </div>
      </div>

      {/* Share Toast */}
      {showShareToast && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="flex items-center gap-3 px-6 py-3 bg-slate-900 text-white rounded-full shadow-2xl">
            <svg className="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span className="text-sm font-medium">คัดลอกลิงก์แล้ว</span>
          </div>
        </div>
      )}

      {/* Save Toast */}
      {showSaveToast && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="flex items-center gap-3 px-6 py-3 bg-slate-900 text-white rounded-full shadow-2xl">
            <svg className="w-5 h-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span className="text-sm font-medium">
              {isSaved ? 'บันทึกลงรายการโปรดแล้ว' : 'ลบออกจากรายการโปรดแล้ว'}
            </span>
          </div>
        </div>
      )}

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
