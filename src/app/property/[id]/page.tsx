'use client';

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { LISTING_TYPES } from "@/types/property";
import { motion, AnimatePresence } from "framer-motion";

import { buildPriceLabel, formatPrice, formatUpdatedAt } from "@/lib/property-format";
import { type Property } from "@/types/property";
import { useFavoritesStore } from "@/lib/favorites-store";
import BeforeFooter from "@/app/component/before_footer";
import Contact from "@/app/component/contact";

// ─── Lightbox ────────────────────────────────────────────────────────────────
function Lightbox({
  images,
  index,
  onClose,
  onPrev,
  onNext,
}: {
  images: string[];
  index: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-100 flex items-center justify-center bg-black/90"
      onClick={onClose}
    >
      <button
        className="absolute top-5 right-5 text-white/70 hover:text-white transition-colors"
        onClick={onClose}
      >
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
      {index > 0 && (
        <button
          className="absolute left-4 text-white/70 hover:text-white transition-colors p-2"
          onClick={(e) => { e.stopPropagation(); onPrev(); }}
        >
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      )}
      {index < images.length - 1 && (
        <button
          className="absolute right-4 text-white/70 hover:text-white transition-colors p-2"
          onClick={(e) => { e.stopPropagation(); onNext(); }}
        >
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      )}
      <div
        className="relative max-w-5xl w-full mx-8"
        style={{ aspectRatio: '16/10' }}
        onClick={(e) => e.stopPropagation()}
      >
        <Image src={images[index]} alt={`Photo ${index + 1}`} fill className="object-contain" />
      </div>
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 text-white/50 text-xs tracking-widest">
        {index + 1} / {images.length}
      </div>
    </div>
  );
}

// ─── Premium Carousel ─────────────────────────────────────────────────────────
function PremiumCarousel({
  images,
  features,
  onImageClick,
}: {
  images: string[];
  features: string[];
  onImageClick: (i: number) => void;
}) {
  const [offset, setOffset] = useState(0);
  const visible = 3;
  const max = Math.max(0, images.length - visible);

  return (
    <section className="bg-white py-16 md:py-20">
      {/* Section header */}
      <div className="max-w-[1400px] mx-auto px-6 md:px-10 mb-8">
        <div
          className="flex items-center justify-between"
          style={{ borderTop: '1px solid rgba(0,0,0,0.1)', paddingTop: '20px' }}
        >
          <div className="flex items-center gap-2">
            <span className="text-[12px] text-[#2d2d2d]">◆</span>
            <span className="text-[11px] font-semibold tracking-[0.28em] uppercase text-[#2d2d2d]">
              Premium Collection
            </span>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setOffset((o) => Math.max(0, o - 1))}
              disabled={offset === 0}
              className="w-11 h-11 flex items-center justify-center border border-black/15 hover:border-black/40 disabled:opacity-30 transition-all"
              style={{ borderRadius: '2px' }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={() => setOffset((o) => Math.min(max, o + 1))}
              disabled={offset >= max}
              className="w-11 h-11 flex items-center justify-center border border-black/15 hover:border-black/40 disabled:opacity-30 transition-all"
              style={{ borderRadius: '2px' }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Images */}
      <div className="max-w-[1400px] mx-auto px-6 md:px-10">
        <div className="grid grid-cols-3 gap-4">
          {images.slice(offset, offset + visible).map((src, i) => {
            const idx = offset + i;
            return (
              <div key={idx} className="flex flex-col gap-3">
                <div
                  className="relative overflow-hidden cursor-pointer group"
                  style={{ aspectRatio: '4/5', borderRadius: '4px' }}
                  onClick={() => onImageClick(idx)}
                >
                  <Image
                    src={src}
                    alt={`Image ${idx + 1}`}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  
                </div>
                {features[idx] && (
                  <p className="text-sm text-[#5f5a54] leading-relaxed pl-1">{features[idx]}</p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ─── Fluid Sticky Section ─────────────────────────────────────────────────────
function FluidSection({
  property,
  images,
  onImageClick,
}: {
  property: Property;
  images: string[];
  onImageClick: (i: number) => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeIdx, setActiveIdx] = useState(0);
  const { addFavorite, removeFavorite, isFavorite } = useFavoritesStore();

  const handleToggleFavorite = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();

    if (isFavorite(property.id)) {
      removeFavorite(property.id);
      return;
    }

    const success = addFavorite(property);
    if (!success && !isFavorite(property.id)) {
      alert('คุณสามารถเลือกได้สูงสุด 3 บ้านเท่านั้น เพื่อนำไป Compare กัน');
    }
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const imageEls = container.querySelectorAll<HTMLDivElement>('[data-img-idx]');
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveIdx(Number((entry.target as HTMLElement).dataset.imgIdx));
          }
        });
      },
      { threshold: 0.4 }
    );
    imageEls.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [images]);

  // Pad to 14 images by repeating
  const TARGET = 14;
  const padded: string[] = [...images];
  while (padded.length < TARGET) padded.push(...images);
  const displayImages = padded.slice(0, TARGET);

  // Exterior captions (first 7)
  const exteriorCaptions = [
    'ด้านหน้าบ้าน', 'ด้านข้างบ้าน', 'สวนหน้าบ้าน',
    'ที่จอดรถ', 'ระเบียงชั้น 2', 'มุมมองทางเข้า', 'รอบบ้านทั้งหมด',
  ];
  // Interior captions (last 7)
  const interiorCaptions = [
    'ห้องนั่งเล่น', 'ห้องครัวและห้องอาหาร', 'ห้องนอนใหญ่',
    'ห้องน้ำ Master', 'ห้องนอนรอง', 'พื้นที่อเนกประสงค์', 'บันไดและทางเดิน',
  ];

  const exteriorImages = displayImages.slice(0, 7);
  const interiorImages = displayImages.slice(7, 14);

  const mapsUrl = property.lat && property.lng
    ? `https://www.google.com/maps?q=${property.lat},${property.lng}`
    : null;

  return (
    <section className="bg-white" style={{ borderTop: '1px solid #e8e8e8' }}>
      {/* Section header */}
      <div className="max-w-[1400px] mx-auto px-6 md:px-10 py-8">
        <div className="flex items-center gap-2">
          <span className="text-[12px]">◆</span>
          <span className="text-[11px] font-semibold tracking-[0.28em] uppercase text-[#2d2d2d]">
            Property Details
          </span>
        </div>
      </div>

      {/* 2-col layout */}
      <div ref={containerRef} className="flex max-w-[1400px] mx-auto">
        {/* LEFT — sticky */}
        <div
          className="w-[40%] shrink-0 px-6 md:px-10 pb-24"
          style={{ position: 'sticky', top: 0, height: '100vh', overflowY: 'auto' }}
        >
          <div className="pt-6 flex flex-col h-full">
            {/* Price */}
            <div className="mb-7 pb-7" style={{ borderBottom: '1px solid #e8e8e8' }}>
              <div className="mb-2 flex items-center justify-between gap-3">
                <p className="text-[11px] font-semibold tracking-[0.22em] uppercase text-[#555]">ราคา</p>
                <button
                  type="button"
                  onClick={handleToggleFavorite}
                  className={`inline-flex h-9 w-9 items-center justify-center rounded-full border transition ${
                    isFavorite(property.id)
                      ? 'border-red-500 bg-red-500 text-white'
                      : 'border-[#8f877d] bg-white text-[#2a2724] hover:border-[#171717]'
                  }`}
                  aria-label={isFavorite(property.id) ? 'ลบจากรายการโปรด' : 'เพิ่มในรายการโปรด'}
                  title={isFavorite(property.id) ? 'ลบจากรายการโปรด' : 'เพิ่มในรายการโปรด'}
                >
                  <svg
                    className="h-4 w-4"
                    fill={isFavorite(property.id) ? 'currentColor' : 'none'}
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </button>
              </div>
              <p className="text-[2.4rem] font-semibold text-[#0a0a0a] tracking-tight leading-none">
                {buildPriceLabel(property)}
              </p>
              {property.pricePerSqm && (
                <p className="text-sm font-medium text-[#555] mt-1.5">{formatPrice(property.pricePerSqm)} / ตร.ม.</p>
              )}
            </div>

            {/* Specs */}
            {(property.size || property.bedrooms || property.bathrooms) && (
              <div className="grid grid-cols-3 mb-7" style={{ border: '1px solid #d8d2ca' }}>
                {property.size && (
                  <div className="px-4 py-4" style={{ borderRight: '1px solid #d8d2ca' }}>
                    <p className="text-[10px] font-semibold tracking-[0.18em] uppercase text-[#666] mb-1.5">พื้นที่</p>
                    <p className="text-[1.1rem] font-semibold text-[#0a0a0a]">
                      {property.size} <span className="text-xs font-medium text-[#666]">ตร.ม.</span>
                    </p>
                  </div>
                )}
                {property.bedrooms && (
                  <div className="px-4 py-4" style={{ borderRight: '1px solid #d8d2ca' }}>
                    <p className="text-[10px] font-semibold tracking-[0.18em] uppercase text-[#666] mb-1.5">ห้องนอน</p>
                    <p className="text-[1.1rem] font-semibold text-[#0a0a0a]">{property.bedrooms}</p>
                  </div>
                )}
                {property.bathrooms && (
                  <div className="px-4 py-4">
                    <p className="text-[10px] font-semibold tracking-[0.18em] uppercase text-[#666] mb-1.5">ห้องน้ำ</p>
                    <p className="text-[1.1rem] font-semibold text-[#0a0a0a]">{property.bathrooms}</p>
                  </div>
                )}
              </div>
            )}

            {/* Description */}
            {property.description && (
              <div className="mb-7">
                <p className="text-[15px] leading-[1.8] text-[#2d2d2d] font-normal">{property.description}</p>
              </div>
            )}

            {/* Features */}
            {property.features && property.features.length > 0 && (
              <div className="mb-7">
                <p className="text-[11px] font-semibold tracking-[0.22em] uppercase text-[#555] mb-4">จุดเด่น</p>
                <div className="space-y-3">
                  {property.features.map((f, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <span className="text-[#0a0a0a] mt-0.5 shrink-0 text-[11px]">◆</span>
                      <span className="text-[15px] font-medium text-[#0a0a0a] leading-relaxed">{f}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Counter */}
            <div className="mt-auto">
              <p className="text-[12px] font-semibold tracking-[0.2em] uppercase text-[#888]">
                {activeIdx + 1} / {displayImages.length}
              </p>
            </div>

            {/* Google Maps button */}
            {mapsUrl && (
              <a
                href={mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 flex items-center gap-2.5 py-3 px-4 border border-[#d8d2ca] text-[11px] font-semibold uppercase tracking-[0.18em] text-[#49443f] hover:border-[#0a0a0a] hover:text-[#0a0a0a] hover:bg-[#f7f4ef] transition-all duration-200"
                style={{ borderRadius: '2px' }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                ดูบน Google Maps
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="ml-auto opacity-50">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            )}

            {/* CTA buttons */}
            <div className="mt-3 space-y-2">
              {property.agent?.phone && (
                <a
                  href={`tel:${property.agent.phone}`}
                  className="flex items-center justify-center gap-2 py-3 text-[11px] font-semibold tracking-[0.18em] uppercase border border-[#171717] text-[#171717] hover:bg-[#171717] hover:text-white transition-all duration-200"
                  style={{ borderRadius: '2px' }}
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  {property.agent.phone}
                </a>
              )}
              <Link
                href="/about#contact"
                className="flex items-center justify-center gap-2 py-3 text-[11px] font-semibold tracking-[0.18em] uppercase bg-[#0f1214] text-[#f7f2ec] hover:bg-[#20262b] transition-all duration-200"
                style={{ borderRadius: '2px' }}
              >
                <span style={{ fontFamily: 'monospace' }}>↳</span>
                ติดต่อสอบถาม
              </Link>
            </div>
          </div>
        </div>

        {/* RIGHT — two groups of 7 with captions */}
        <div className="flex-1 px-4 py-8">

          {/* ── EXTERIOR group label ── */}
          <div className="mb-5" style={{ borderTop: '1px solid #e8e8e8', paddingTop: '20px' }}>
            <div className="flex items-center gap-2">
              <span className="text-[11px] text-[#2d2d2d]">◆</span>
              <span className="text-[11px] font-semibold tracking-[0.28em] uppercase text-[#2d2d2d]">Exterior</span>
            </div>
          </div>

          {/* Exterior images — pairs + last one full width */}
          {[
            [0, 1], [2, 3], [4, 5],
          ].map(([a, b], rowIdx) => (
            <div key={`ext-row-${rowIdx}`} className="grid grid-cols-2 gap-3 mb-3">
              {[a, b].map((imgIdx) => (
                <div key={imgIdx} className="flex flex-col gap-2">
                  <div
                    data-img-idx={imgIdx}
                    className="relative overflow-hidden cursor-pointer group"
                    style={{ aspectRatio: '4/5', borderRadius: '3px' }}
                    onClick={() => onImageClick(imgIdx % images.length)}
                  >
                    <Image
                      src={exteriorImages[imgIdx]}
                      alt={exteriorCaptions[imgIdx]}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/8 transition-colors duration-300" />
                  </div>
                  <p className="text-sm font-medium text-[#171717]">{exteriorCaptions[imgIdx]}</p>
                </div>
              ))}
            </div>
          ))}
          {/* Last exterior image — half column (portrait) */}
          <div className="grid grid-cols-2 gap-3 mb-3">
            <div className="flex flex-col gap-2">
              <div
                data-img-idx={6}
                className="relative overflow-hidden cursor-pointer group"
                style={{ aspectRatio: '4/5', borderRadius: '3px' }}
                onClick={() => onImageClick(6 % images.length)}
              >
                <Image
                  src={exteriorImages[6]}
                  alt={exteriorCaptions[6]}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/8 transition-colors duration-300" />
              </div>
              <p className="text-sm font-medium text-[#171717]">{exteriorCaptions[6]}</p>
            </div>
          </div>

          {/* ── INTERIOR group label ── */}
          <div
            className="my-8"
            style={{ borderTop: '1px solid #e8e8e8', paddingTop: '24px' }}
          >
            <div className="flex items-center gap-2">
              <span className="text-[11px] text-[#2d2d2d]">◆</span>
              <span className="text-[11px] font-semibold tracking-[0.28em] uppercase text-[#2d2d2d]">Interior</span>
            </div>
          </div>

          {/* Interior images — pairs + last one full width */}
          {[
            [0, 1], [2, 3], [4, 5],
          ].map(([a, b], rowIdx) => (
            <div key={`int-row-${rowIdx}`} className="grid grid-cols-2 gap-3 mb-3">
              {[a, b].map((imgIdx) => (
                <div key={imgIdx} className="flex flex-col gap-2">
                  <div
                    data-img-idx={7 + imgIdx}
                    className="relative overflow-hidden cursor-pointer group"
                    style={{ aspectRatio: '4/5', borderRadius: '3px' }}
                    onClick={() => onImageClick((7 + imgIdx) % images.length)}
                  >
                    <Image
                      src={interiorImages[imgIdx]}
                      alt={interiorCaptions[imgIdx]}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/8 transition-colors duration-300" />
                  </div>
                  <p className="text-sm font-medium text-[#171717]">{interiorCaptions[imgIdx]}</p>
                </div>
              ))}
            </div>
          ))}
          {/* Last interior image — half column (portrait) */}
          <div className="grid grid-cols-2 gap-3 mb-10">
            <div className="flex flex-col gap-2">
              <div
                data-img-idx={13}
                className="relative overflow-hidden cursor-pointer group"
                style={{ aspectRatio: '4/5', borderRadius: '3px' }}
                onClick={() => onImageClick(13 % images.length)}
              >
                <Image
                  src={interiorImages[6]}
                  alt={interiorCaptions[6]}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/8 transition-colors duration-300" />
              </div>
              <p className="text-sm font-medium text-[#171717]">{interiorCaptions[6]}</p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

// ─── All Properties Section ───────────────────────────────────────────────────
function AllPropertiesSection({ currentId }: { currentId: number }) {
  const router = useRouter();
  const { addFavorite, removeFavorite, isFavorite } = useFavoritesStore();
  const [allProperties, setAllProperties] = useState<Property[]>([]);
  const [hoveredId, setHoveredId] = useState<number | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filterListingType, setFilterListingType] = useState<string[]>([]);
  const [filterPropertyType, setFilterPropertyType] = useState<string[]>([]);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch('/api/properties')
      .then((r) => r.json())
      .then((data) => {
        const list: Property[] = Array.isArray(data) ? data : (data.properties ?? []);
        setAllProperties(list.filter((p) => p.id !== currentId));
      })
      .catch(() => {});
  }, [currentId]);

  const propertyTypeOptions = useMemo(
    () => Array.from(new Set(allProperties.map((p) => p.propertyType).filter(Boolean))) as string[],
    [allProperties]
  );

  const filtered = useMemo(() => {
    return allProperties.filter((p) => {
      if (filterListingType.length > 0 && !filterListingType.includes(p.type)) return false;
      if (filterPropertyType.length > 0 && !filterPropertyType.includes(p.propertyType ?? '')) return false;
      return true;
    });
  }, [allProperties, filterListingType, filterPropertyType]);

  const activeFilterCount = filterListingType.length + filterPropertyType.length;

  const toggleListing = (t: string) =>
    setFilterListingType((prev) => prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]);
  const togglePropType = (t: string) =>
    setFilterPropertyType((prev) => prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]);
  const clearFilters = () => { setFilterListingType([]); setFilterPropertyType([]); };

  const handleNavigate = (e: React.MouseEvent<HTMLAnchorElement>, id: number) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'instant' });
    router.push(`/property/${id}`);
  };

  const handleToggleFavorite = (property: Property, event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();

    if (isFavorite(property.id)) {
      removeFavorite(property.id);
      return;
    }

    const success = addFavorite(property);
    if (!success && !isFavorite(property.id)) {
      alert('คุณสามารถเลือกได้สูงสุด 3 บ้านเท่านั้น เพื่อนำไป Compare กัน');
    }
  };

  if (allProperties.length === 0) return null;

  return (
    <section className="relative bg-white pt-0 pb-24 md:pb-32" style={{ marginTop: '80px' }}>
      <div className="relative mx-auto max-w-[1720px] px-6 md:px-12">
        {/* Divider */}
        <div style={{ borderTop: '1px solid #e8e8e8', marginBottom: '48px' }} />

        <div className="mb-3 flex items-center justify-between text-[11px] uppercase tracking-[0.2em] text-[#bbb]">
          <span>Featured Projects</span>
          <span>รายการทั้งหมด {filtered.length} รายการ</span>
        </div>

        {/* Header + CTA buttons */}
        <div className="grid gap-10 pt-5 pb-10 md:pt-8 md:pb-14 lg:grid-cols-[0.38fr_0.62fr] lg:gap-14">
          <div>
            <p className="mb-5 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.28em] text-[#2d2d2d]">
              <span>◆</span>
              FEATURED PROJECTS
            </p>
          </div>
          <div>
            <h2 className="max-w-5xl text-[clamp(2.7rem,5.2vw,5.6rem)] font-light leading-[0.92] tracking-[-0.05em] text-[#171717]">
              Each project tells its own story
              <br />
              of collaboration and precision.
            </h2>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => listRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
                className="inline-flex items-center gap-3 bg-[#0f1214] px-7 py-4 text-[12px] font-semibold uppercase tracking-[0.22em] text-white transition hover:bg-[#20262b]"
              >
                <span style={{ fontFamily: 'monospace' }}>↳</span>
                VIEW PROJECTS
              </button>
              <button
                type="button"
                onClick={() => setIsFilterOpen((v) => !v)}
                className="inline-flex items-center gap-3 border border-[#171717] px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.24em] text-[#171717] transition hover:bg-[#171717] hover:text-white"
              >
                <span className="inline-block h-[1px] w-4 bg-current" />
                ตัวกรองขั้นสูง
                {activeFilterCount > 0 && (
                  <span className="text-[10px] opacity-60">{activeFilterCount}</span>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Filter panel */}
        <div className={`overflow-hidden transition-all duration-500 ${isFilterOpen ? 'max-h-64 opacity-100 mb-8' : 'max-h-0 opacity-0'}`}>
          <div className="border-y border-[#ddd8d2] bg-white py-5">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h3 className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#0a0a0a]">Advanced Filters</h3>
                <p className="mt-1 text-xs text-[#8f8881]">ปรับเงื่อนไขเพื่อคัดบ้านที่ใกล้เคียงความต้องการ</p>
              </div>
              <div className="flex gap-2">
                {activeFilterCount > 0 && (
                  <button onClick={clearFilters} className="border border-[#d8d2ca] px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#666] hover:border-[#171717] hover:text-[#0a0a0a] transition">
                    ล้างตัวกรอง
                  </button>
                )}
                <button onClick={() => setIsFilterOpen(false)} className="border border-[#171717] px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#171717] hover:bg-[#171717] hover:text-white transition">
                  ปิด
                </button>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              {/* Listing type */}
              <div>
                <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-[#888]">ประเภทประกาศ</p>
                <div className="flex gap-2">
                  {LISTING_TYPES.map((t) => (
                    <button key={t} onClick={() => toggleListing(t)}
                      className="border px-3 py-1 text-[11px] font-semibold transition"
                      style={filterListingType.includes(t)
                        ? { background: '#0a0a0a', color: '#fff', borderColor: '#0a0a0a' }
                        : { background: '#fff', color: '#444', borderColor: '#d8d2ca' }}>
                      {t}
                    </button>
                  ))}
                </div>
              </div>
              {/* Property type */}
              {propertyTypeOptions.length > 0 && (
                <div>
                  <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-[#888]">ประเภทการพัฒนา</p>
                  <div className="flex flex-wrap gap-2">
                    {propertyTypeOptions.map((t) => (
                      <button key={t} onClick={() => togglePropType(t)}
                        className="border px-3 py-1 text-[11px] transition"
                        style={filterPropertyType.includes(t)
                          ? { background: '#0a0a0a', color: '#fff', borderColor: '#0a0a0a' }
                          : { background: '#fff', color: '#444', borderColor: '#d8d2ca' }}>
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* List */}
        <div ref={listRef} className="border-t border-[#8f877d]" />
        <div className="relative bg-white">
          {filtered.map((property, idx) => (
            <motion.div
              key={property.id}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: idx * 0.04, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
              viewport={{ once: true, margin: '-40px' }}
            >
              <a
                href={`/property/${property.id}`}
                onClick={(e) => handleNavigate(e, property.id)}
                onMouseEnter={() => setHoveredId(property.id)}
                onMouseLeave={() => setHoveredId(null)}
                className="group relative grid items-center gap-3 border-b border-[#8f877d] bg-white px-1 py-3 transition-colors duration-300 md:px-2 lg:grid-cols-[0.95fr_1.45fr_42px]"
              >
                <div className="min-w-0 lg:pr-8">
                  <div className="flex items-center gap-2">
                    <h3 className="truncate text-[1.28rem] font-light tracking-[-0.035em] text-[#49443f] transition-colors duration-300 group-hover:text-[#171717] md:text-[1.4rem]">
                      {property.title}
                    </h3>
                    <button
                      type="button"
                      onClick={(event) => handleToggleFavorite(property, event)}
                      className={`inline-flex h-8 w-8 items-center justify-center rounded-full border transition lg:hidden ${
                        isFavorite(property.id)
                          ? 'border-red-500 bg-red-500 text-white'
                          : 'border-[#8f877d] bg-white text-[#2a2724] hover:border-[#171717]'
                      }`}
                      aria-label={isFavorite(property.id) ? 'ลบจากรายการโปรด' : 'เพิ่มในรายการโปรด'}
                    >
                      <svg
                        className="h-3 w-3"
                        fill={isFavorite(property.id) ? 'currentColor' : 'none'}
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                    </button>
                  </div>
                  <p className="mt-1 truncate text-[0.8rem] text-[#625c56] md:text-[0.84rem]">{property.location}</p>
                  <div className="mt-2 flex flex-wrap gap-1.5 lg:hidden">
                    {buildPropertyTags(property).map((tag) => (
                      <span key={tag} className="rounded-full border border-[#8f877d] px-2.5 py-1 text-[9px] font-medium uppercase tracking-[0.18em] text-[#625c56]">{tag}</span>
                    ))}
                  </div>
                </div>
                <div className="relative hidden min-h-[54px] items-center lg:flex">
                  <AnimatePresence mode="wait">
                    {hoveredId === property.id && (
                      <motion.div
                        key={`prev-${property.id}`}
                        initial={{ opacity: 0, scale: 0.97, y: 8 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.985, y: 4 }}
                        transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                        className="absolute left-[-22px] top-1/2 z-10 h-[156px] w-[282px] -translate-y-1/2 overflow-hidden bg-[#ece7df] shadow-[0_22px_60px_-34px_rgba(0,0,0,0.32)]"
                      >
                        <Image src={property.image} alt={property.title} fill className="object-cover" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                  <div className="flex flex-wrap gap-1.5 pl-[50%]">
                    {buildPropertyTags(property).map((tag) => (
                      <span key={tag} className="rounded-full border border-[#8f877d] px-2.5 py-1 text-[9px] font-medium uppercase tracking-[0.18em] text-[#625c56]">{tag}</span>
                    ))}
                  </div>
                </div>
                <div className="hidden items-center justify-end gap-3 text-[#6b645c] transition-transform duration-300 group-hover:translate-x-1 group-hover:text-[#171717] lg:flex">
                  <button
                    type="button"
                    onClick={(event) => handleToggleFavorite(property, event)}
                    className={`inline-flex h-8 w-8 items-center justify-center rounded-full border transition ${
                      isFavorite(property.id)
                        ? 'border-red-500 bg-red-500 text-white'
                        : 'border-[#8f877d] bg-white text-[#2a2724] hover:border-[#171717]'
                    }`}
                    aria-label={isFavorite(property.id) ? 'ลบจากรายการโปรด' : 'เพิ่มในรายการโปรด'}
                  >
                    <svg
                      className="h-3 w-3"
                      fill={isFavorite(property.id) ? 'currentColor' : 'none'}
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </button>
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M13 5l7 7-7 7" />
                  </svg>
                </div>
              </a>
            </motion.div>
          ))}
          {filtered.length === 0 && (
            <div className="py-12 text-center">
              <p className="text-sm text-[#888]">ไม่พบรายการตามเงื่อนไข</p>
              <button onClick={clearFilters} className="mt-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#171717] underline underline-offset-4">ล้างตัวกรอง</button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function buildPropertyTags(property: Property) {
  return [
    property.type === 'เช่า' ? 'RENTAL' : 'FOR SALE',
    property.propertyType?.toUpperCase(),
    property.size ? `${property.size} SQ.M.` : undefined,
    property.bedrooms ? `${property.bedrooms} BEDROOMS` : undefined,
    buildPriceLabel(property).toUpperCase(),
  ].filter(Boolean).slice(0, 4) as string[];
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function PropertyDetailPage() {
  const params = useParams();
  const propertyId = params.id as string;
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);

  useEffect(() => {
    fetch(`/api/properties/${propertyId}`)
      .then((r) => r.json())
      .then((data) => setProperty(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [propertyId]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  useEffect(() => {
    if (lightboxIdx === null || !property) return;
    const allImages = property.images?.length ? property.images : [property.image];
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightboxIdx(null);
      if (e.key === 'ArrowLeft') setLightboxIdx((i) => (i !== null ? Math.max(0, i - 1) : 0));
      if (e.key === 'ArrowRight') setLightboxIdx((i) => (i !== null ? Math.min(allImages.length - 1, i + 1) : 0));
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [lightboxIdx, property]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-2 border-black/20 border-t-black rounded-full animate-spin" />
          <p className="text-xs tracking-[0.2em] uppercase text-black/40">Loading</p>
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <p className="text-xs tracking-[0.2em] uppercase text-black/40 mb-4">Property not found</p>
          <Link href="/" className="text-sm underline underline-offset-4 text-black/60 hover:text-black">
            กลับไปหน้าหลัก
          </Link>
        </div>
      </div>
    );
  }

  const allImages = property.images?.length ? property.images : [property.image];
  const premiumImages = allImages.slice(0, Math.min(6, allImages.length));
  const featuresList = property.features ?? [];
  const premiumCaptions = premiumImages.map((_, i) => featuresList[i] ?? '');

  return (
    <div className="bg-white min-h-screen">
      {/* Lightbox */}
      {lightboxIdx !== null && (
        <Lightbox
          images={allImages}
          index={lightboxIdx}
          onClose={() => setLightboxIdx(null)}
          onPrev={() => setLightboxIdx((i) => (i !== null ? Math.max(0, i - 1) : 0))}
          onNext={() => setLightboxIdx((i) => (i !== null ? Math.min(allImages.length - 1, i + 1) : 0))}
        />
      )}

      {/* ═══════════════════════════════════════
          SECTION 1 — HERO
      ════════════════════════════════════════ */}
      <section
        className="bg-white flex flex-col"
        style={{ minHeight: '38vh', paddingTop: '72px' }}
      >
        {/* Brand centered at very top — matches hero.tsx style */}
        <div className="flex justify-center pt-8">
          <span className="text-sm font-medium tracking-[0.2em] uppercase text-[#0a0a0a]">
            sknat
          </span>
        </div>

        {/* Center content */}
        <div className="flex-1 flex flex-col items-center justify-center text-center px-6 py-12">
          {/* Label */}
          <div className="flex items-center gap-2 mb-7">
            <span className="text-[12px] text-[#5f5a54]">◆</span>
            <span className="text-[11px] font-semibold tracking-[0.28em] uppercase text-[#5f5a54]">
              {property.category ?? property.type}
            </span>
          </div>

          {/* Property title — large centered */}
          <h1
            className="font-light text-[#0a0a0a] leading-[1.02]"
            style={{
              fontSize: 'clamp(2.4rem, 5.5vw, 5rem)',
              maxWidth: '900px',
              letterSpacing: '-0.04em',
            }}
          >
            {property.title}
          </h1>

          {/* Location row */}
          <div className="flex flex-wrap items-center justify-center gap-3 mt-8 text-[15px] font-medium text-[#49443f]">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span>{property.location}</span>
            <span className="text-[#ccc]">·</span>
            <span
              className="px-3 py-1 border border-[#d8d2ca] text-[10px] font-semibold tracking-[0.18em] uppercase text-[#49443f]"
              style={{ borderRadius: '2px' }}
            >
              {property.type}
            </span>
            {property.updatedAt && (
              <>
                <span className="text-[#ccc]">·</span>
                <span className="text-xs text-[#aaa]">{formatUpdatedAt(property.updatedAt)}</span>
              </>
            )}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          SECTION 2 — PREMIUM COLLECTION
      ════════════════════════════════════════ */}
      <PremiumCarousel
        images={premiumImages}
        features={premiumCaptions}
        onImageClick={setLightboxIdx}
      />

      {/* ═══════════════════════════════════════
          SECTION 3 — FLUID (sticky left)
      ════════════════════════════════════════ */}
      <FluidSection
        property={property}
        images={allImages}
        onImageClick={setLightboxIdx}
      />

      {/* ═══════════════════════════════════════
          SECTION 4 — OTHER PROPERTIES
      ════════════════════════════════════════ */}
      <AllPropertiesSection currentId={property.id} />

      {/* ═══════════════════════════════════════
          CONTACT + BEFORE_FOOTER
      ════════════════════════════════════════ */}
      <div style={{ position: 'relative' }}>
        <div style={{ position: 'sticky', top: 0, zIndex: 1 }}>
          <Contact />
        </div>
        <div style={{ position: 'relative', zIndex: 2 }}>
          <BeforeFooter />
        </div>
      </div>
    </div>
  );
}
