'use client';

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";

import { buildPriceLabel, formatPrice } from "@/lib/property-format";
import { type Property } from "@/types/property";
import { useFavoritesStore } from "@/lib/favorites-store";
import Footer from "@/app/component/footer";

export default function PropertyDetailPage() {
  const params = useParams();
  const propertyId = params.id as string;
  const [property, setProperty] = useState<Property | null>(null);
  const [galleryIndex, setGalleryIndex] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [isVisible, setIsVisible] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  
  const [showShareToast, setShowShareToast] = useState(false);
  const [showSaveToast, setShowSaveToast] = useState(false);
  const { addFavorite, removeFavorite, isFavorite } = useFavoritesStore();
  const sectionRef = useRef<HTMLElement>(null);

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
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
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
      } catch {
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
      <div className="min-h-screen flex items-center justify-center bg-white">
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
  const isSaved = isFavorite(property.id);
  const parallaxOffset = scrollY * 0.5;

  return (
    <>
      {/* Back to Home Button */}
      <Link 
        href="/"
        className="fixed top-6 left-6 z-50 flex items-center gap-2 px-5 py-3 bg-white/90 backdrop-blur-sm rounded-full text-slate-900 font-semibold shadow-lg hover:shadow-xl transition-all hover:bg-white group"
      >
        <svg className="w-5 h-5 transition-transform group-hover:-translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        <span className="hidden sm:inline">กลับหน้าหลัก</span>
      </Link>
      
      {/* Hero Section with Dynamic Parallax */}
      <section className="relative h-screen w-full overflow-hidden">
        <div 
          className="absolute inset-0 w-full h-full"
          style={{
            transform: `translateY(${parallaxOffset}px)`,
            transition: 'transform 0.1s ease-out'
          }}
        >
          {allImages.slice(0, 3).map((src, i) => (
            <div
              key={i}
              className={`absolute inset-0 h-full w-full transition-opacity duration-[2000ms] ease-in-out ${
                i === 0 ? "opacity-100" : "opacity-0"
              }`}
            >
              <Image
                src={src}
                alt={`${property.title} - ${i + 1}`}
                fill
                priority={i === 0}
                className="object-cover"
              />
            </div>
          ))}

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/60" />
        </div>

        {/* Property Info Overlay */}
        <div className="absolute bottom-0 left-0 right-0 z-10 p-6 md:p-12">
          <div className="container mx-auto">
            <div className="max-w-4xl">
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <span className="px-4 py-2 rounded-full bg-white/90 backdrop-blur-sm text-slate-900 text-sm font-semibold">
                  {property.type}
                </span>
                {property.propertyType && (
                  <span className="px-4 py-2 rounded-full bg-black/30 backdrop-blur-sm text-white text-sm">
                    {property.propertyType}
                  </span>
                )}
                <span className="px-4 py-2 rounded-full bg-black/30 backdrop-blur-sm text-white text-sm">
                  รหัส #{String(property.id).padStart(5, '0')}
                </span>
              </div>
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-3 leading-tight">
                {property.title}
              </h1>
              <p className="text-lg md:text-xl text-white/90 mb-6 flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {property.location}
              </p>
              <div className="flex items-center gap-4">
                <p className="text-5xl md:text-6xl font-bold text-white">
                  {buildPriceLabel(property)}
                </p>
                {property.pricePerSqm && (
                  <p className="text-lg text-white/80">
                    {formatPrice(property.pricePerSqm)}/ตร.ม.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* View All Photos Button */}
        <button
          onClick={() => setGalleryIndex(0)}
          className="absolute bottom-8 right-8 md:bottom-12 md:right-12 z-20 flex items-center gap-2 px-6 py-3 bg-white text-slate-900 rounded-full text-sm font-semibold hover:bg-slate-100 shadow-lg hover:shadow-xl transition-all duration-200"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
          </svg>
          ดูรูปทั้งหมด ({allImages.length})
        </button>
      </section>

      {/* Property Details Section - Like About Section */}
      <section
        ref={sectionRef}
        className="relative overflow-hidden bg-white py-24 md:py-32"
      >
        {/* Decorative Elements */}
        <div className="pointer-events-none absolute -left-32 top-1/3 h-64 w-64 rounded-full bg-blue-100/20 blur-2xl" />
        <div className="pointer-events-none absolute right-1/4 bottom-1/4 h-48 w-48 rounded-full bg-cyan-100/15 blur-2xl" />

        <div className="container relative mx-auto px-4 md:px-6">
          {/* Section Header */}
          <div
            className={`mb-16 transition-all duration-1000 ${
              isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
            }`}
          >
            <p className="text-[11px] uppercase tracking-[0.3em] text-slate-500">
              Property Details
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950 md:text-5xl leading-[1.4] md:leading-[1.3]">
              รายละเอียดทรัพย์สิน
              <br />
              <span className="text-slate-600">ข้อมูลครบถ้วน</span>
            </h2>
          </div>

          {/* Main Content Grid */}
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-20">
            {/* Left: Quick Stats */}
            <div
              className={`relative transition-all duration-1000 delay-200 ${
                isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
              }`}
            >
              <div className="space-y-6">
                {/* Property Specs Grid */}
                <div className="grid grid-cols-2 gap-4">
                  {property.size && (
                    <div className="p-6 rounded-[2rem] bg-white/70 border border-slate-100 shadow-[0_20px_50px_-20px_rgba(15,23,42,0.15)]">
                      <p className="text-xs text-slate-500 uppercase tracking-wider mb-2">พื้นที่ใช้สอย</p>
                      <p className="text-3xl font-bold text-slate-900">{property.size}</p>
                      <p className="text-sm text-slate-600">ตร.ม.</p>
                    </div>
                  )}
                  {property.bedrooms && (
                    <div className="p-6 rounded-[2rem] bg-white/70 border border-slate-100 shadow-[0_20px_50px_-20px_rgba(15,23,42,0.15)]">
                      <p className="text-xs text-slate-500 uppercase tracking-wider mb-2">ห้องนอน</p>
                      <p className="text-3xl font-bold text-slate-900">{property.bedrooms}</p>
                      <p className="text-sm text-slate-600">ห้อง</p>
                    </div>
                  )}
                  {property.bathrooms && (
                    <div className="p-6 rounded-[2rem] bg-white/70 border border-slate-100 shadow-[0_20px_50px_-20px_rgba(15,23,42,0.15)]">
                      <p className="text-xs text-slate-500 uppercase tracking-wider mb-2">ห้องน้ำ</p>
                      <p className="text-3xl font-bold text-slate-900">{property.bathrooms}</p>
                      <p className="text-sm text-slate-600">ห้อง</p>
                    </div>
                  )}
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-2 gap-4">
                  <button 
                    onClick={handleShare}
                    className="flex items-center justify-center gap-2 p-5 rounded-[2rem] bg-white border border-slate-200 text-slate-700 font-semibold hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm hover:shadow-md"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                    </svg>
                    แชร์
                  </button>
                  <button 
                    onClick={handleSave}
                    className={`flex items-center justify-center gap-2 p-5 rounded-[2rem] border font-semibold transition-all shadow-sm hover:shadow-md ${
                      isSaved 
                        ? 'bg-red-50 border-red-200 text-red-600' 
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300'
                    }`}
                  >
                    <svg className="w-5 h-5" fill={isSaved ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                    </svg>
                    {isSaved ? 'บันทึกแล้ว' : 'บันทึก'}
                  </button>
                </div>
              </div>
            </div>

            {/* Right: Description */}
            <div
              className={`relative transition-all duration-1000 delay-300 ${
                isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
              }`}
            >
              <div className="rounded-[2.5rem] bg-white/70 border border-slate-100 p-8 shadow-[0_32px_64px_-24px_rgba(15,23,42,0.35)]">
                <h3 className="text-2xl font-semibold text-slate-900 mb-4">เกี่ยวกับทรัพย์สินนี้</h3>
                <div className="prose prose-slate max-w-none">
                  <p className="text-slate-600 leading-relaxed">
                    {property.description || 'บ้านหรูระดับพรีเมียม ออกแบบด้วยสถาปัตยกรรมสมัยใหม่ ตกแต่งพร้อมเฟอร์นิเจอร์คุณภาพสูง ในทำเลศักยภาพ ใกล้สิ่งอำนวยความสะดวกครบครัน เหมาะสำหรับครอบครัวที่ต้องการความเป็นส่วนตัวและความสะดวกสบายในการใช้ชีวิต'}
                  </p>
                </div>

                {/* Features */}
                {property.features && property.features.length > 0 && (
                  <div className="mt-6 pt-6 border-t border-slate-200">
                    <h4 className="text-sm font-semibold text-slate-900 mb-3 uppercase tracking-wider">สิ่งอำนวยความสะดวก</h4>
                    <div className="flex flex-wrap gap-2">
                      {property.features.map((feature, idx) => (
                        <span
                          key={idx}
                          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-50 text-slate-700 text-sm font-medium border border-slate-200"
                        >
                          <svg className="w-4 h-4 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section - Like Services Section */}
      <section className="relative overflow-hidden bg-white py-24 md:py-32">
        {/* Decorative Elements */}
        <div className="pointer-events-none absolute left-0 top-1/3 h-64 w-64 rounded-full bg-cyan-100/20 blur-2xl" />
        <div className="pointer-events-none absolute right-0 bottom-1/3 h-64 w-64 rounded-full bg-blue-100/20 blur-2xl" />

        <div className="container relative mx-auto px-4 md:px-6">
          {/* Section Header */}
          <div
            className={`mb-16 text-center transition-all duration-1000 ${
              isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
            }`}
          >
            <p className="text-[11px] uppercase tracking-[0.3em] text-slate-500">
              Contact Agent
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950 md:text-5xl">
              ติดต่อสอบถาม
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-slate-600">
              ทีมงานมืออาชีพพร้อมให้คำปรึกษาและตอบทุกคำถามของคุณ
            </p>
          </div>

          {/* Contact Cards Grid */}
          <div className="max-w-4xl mx-auto">
            {property.agent ? (
              <div className="space-y-6">
                {/* Agent Info Card */}
                <div
                  className={`rounded-[2rem] bg-white/70 p-8 shadow-[0_20px_50px_-20px_rgba(15,23,42,0.2)] backdrop-blur-xl border border-slate-100 transition-all duration-700 ${
                    isVisible ? "translate-y-0 opacity-100" : "translate-y-12 opacity-0"
                  }`}
                >
                  <div className="flex items-center gap-6 mb-8">
                    <div className="w-20 h-20 rounded-2xl bg-slate-950 flex items-center justify-center shadow-lg">
                      <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm text-slate-500 mb-1">ผู้ติดต่อ</p>
                      <p className="text-2xl font-bold text-slate-900">{property.agent.name}</p>
                      <p className="text-sm text-slate-600">ที่ปรึกษาอสังหาริมทรัพย์</p>
                    </div>
                  </div>

                  {/* Contact Methods */}
                  <div className="grid md:grid-cols-2 gap-4">
                    {/* Phone */}
                    {property.agent.phone && (
                      <a
                        href={`tel:${property.agent.phone}`}
                        className="group flex items-center gap-4 p-5 rounded-2xl bg-white hover:bg-slate-50 transition-all border border-slate-200 hover:shadow-md"
                      >
                        <div className="w-12 h-12 rounded-xl bg-slate-950 flex items-center justify-center group-hover:scale-110 transition-transform">
                          <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                          </svg>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-slate-500 mb-1">โทรศัพท์</p>
                          <p className="font-semibold text-slate-900">{property.agent.phone}</p>
                        </div>
                        <svg className="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </a>
                    )}

                    {/* Email */}
                    {property.agent.email && (
                      <a
                        href={`mailto:${property.agent.email}`}
                        className="group flex items-center gap-4 p-5 rounded-2xl bg-white hover:bg-slate-50 transition-all border border-slate-200 hover:shadow-md"
                      >
                        <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center group-hover:scale-110 transition-transform">
                          <svg className="w-6 h-6 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-slate-500 mb-1">อีเมล</p>
                          <p className="font-semibold text-slate-900 text-sm truncate">{property.agent.email}</p>
                        </div>
                        <svg className="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </a>
                    )}

                    {/* LINE */}
                    <a
                      href="https://line.me/ti/p/@sknat.property"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-center gap-4 p-5 rounded-2xl bg-white hover:bg-slate-50 transition-all border border-slate-200 hover:shadow-md md:col-span-2"
                    >
                      <div className="w-12 h-12 rounded-xl bg-[#06C755] flex items-center justify-center group-hover:scale-110 transition-transform">
                        <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63h2.386c.349 0 .63.285.63.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .345-.285.63-.631.63s-.63-.285-.63-.63V8.108c0-.345.282-.63.63-.63.346 0 .63.285.63.63v4.771zm-1.65.631c-.345 0-.63-.285-.63-.63V8.108c0-.345.285-.63.63-.63.346 0 .629.285.629.63v4.772c0 .344-.283.629-.63.629zm-2.466.631c-.345 0-.63-.286-.63-.631V8.739h-1.17c-.345 0-.63-.285-.63-.63 0-.345.285-.63.63-.63h3.601c.345 0 .63.285.63.63 0 .345-.285.63-.63.63h-1.17v4.771c0 .345-.285.631-.631.631zm-2.902 0c-.346 0-.631-.286-.631-.631V8.108c0-.345.285-.63.63-.63h1.756c.869 0 1.575.706 1.575 1.574 0 .869-.706 1.575-1.575 1.575H8.492v2.401c0 .345-.285.631-.63.631zm.63-4.772v1.512h1.126c.315 0 .57-.255.57-.57 0-.316-.255-.571-.57-.571H8.492v.629z"/>
                        </svg>
                      </div>
                      <div className="flex-1">
                        <p className="text-xs text-slate-500 mb-1">LINE ID</p>
                        <p className="font-semibold text-slate-900">@sknat.property</p>
                      </div>
                      <svg className="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                  </div>

                  <p className="text-center text-sm text-slate-500 mt-6 pt-6 border-t border-slate-200">
                    พร้อมตอบทุกคำถามภายใน 24 ชั่วโมง
                  </p>
                </div>
              </div>
            ) : (
              <div className="text-center py-16 rounded-[2rem] bg-white/70 border border-slate-100">
                <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-slate-50 flex items-center justify-center border border-slate-100">
                  <svg className="w-10 h-10 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <p className="text-slate-500">ไม่มีข้อมูลผู้ติดต่อ</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Location Section - Like Properties Section */}
      {property.lat && property.lng && (
        <section className="relative overflow-hidden bg-white py-24 md:py-32">
          <div className="pointer-events-none absolute left-0 top-1/4 h-56 w-56 rounded-full bg-blue-100/20 blur-2xl" />
          <div className="pointer-events-none absolute right-0 bottom-1/4 h-56 w-56 rounded-full bg-cyan-100/20 blur-2xl" />

          <div className="container relative mx-auto px-4 md:px-6">
            <div className="mb-12">
              <p className="text-[11px] uppercase tracking-[0.3em] text-slate-500">LOCATION</p>
              <h2 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950 md:text-5xl">
                ที่ตั้งทรัพย์สิน
              </h2>
              <p className="mt-2 max-w-2xl text-sm text-slate-600 md:text-base">
                สำรวจทำเลและสถานที่ใกล้เคียง
              </p>
            </div>

            <div className="relative h-[500px] md:h-[600px] rounded-[2rem] overflow-hidden shadow-[0_32px_64px_-24px_rgba(15,23,42,0.35)]">
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
                className="absolute bottom-6 right-6 flex items-center gap-2 px-5 py-3 bg-white rounded-full text-sm font-semibold text-slate-700 shadow-lg hover:shadow-xl transition-all hover:bg-slate-50 border border-slate-200"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
                เปิดใน Google Maps
              </a>
            </div>
          </div>
        </section>
      )}

      <Footer />
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
    </>
  );
}
