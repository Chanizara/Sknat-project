'use client';

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";

import { buildPriceLabel, formatPrice, getDistrict } from "@/lib/property-format";
import { LISTING_TYPES, type Property } from "@/types/property";
import { useFavoritesStore } from "@/lib/favorites-store";
import About from "./about";
import OurExperience from "./OurExperience";
import ParallaxImageSection from "./ParallaxImageSection";

type MainPageProps = {
  properties: Property[];
};

type Filters = {
  searchKeyword: string;
  areaType: string[];
  listingType: string[];
  developmentType: string[];
  priceRange: [number, number];
  areaSize: [number, number];
  minBedrooms: string;
  district: string[];
};

type FilterControlsProps = {
  filters: Filters;
  maxPrice: number;
  maxArea: number;
  developmentTypeOptions: string[];
  districtOptions: string[];
  handleFilterChange: (filterType: keyof Filters, value: Filters[keyof Filters]) => void;
  toggleArrayFilter: (filterType: "areaType" | "listingType" | "developmentType" | "district", value: string) => void;
};

function computeMaxPrice(properties: Property[]) {
  const prices = properties.map((p) => p.price).filter((p) => p > 0);
  if (prices.length === 0) return 50_000_000;
  const max = Math.max(...prices);
  return Math.ceil(max / 10_000_000) * 10_000_000;
}

function computeMaxArea(properties: Property[]) {
  const sizes = properties.map((p) => p.size ?? 0).filter((s) => s > 0);
  if (sizes.length === 0) return 10000;
  const max = Math.max(...sizes);
  return Math.ceil(max / 100) * 100;
}

export default function MainPage({ properties }: MainPageProps) {
  const router = useRouter();
  const { addFavorite, removeFavorite, isFavorite, hasHydrated } = useFavoritesStore();

  useEffect(() => {
    if (!window.location.hash) {
      window.scrollTo(0, 0);
    }
  }, []);

  const maxPrice = useMemo(() => computeMaxPrice(properties), [properties]);
  const maxArea = useMemo(() => computeMaxArea(properties), [properties]);

  const [filters, setFilters] = useState<Filters>(() => ({
    searchKeyword: "",
    areaType: [],
    listingType: [],
    developmentType: [],
    priceRange: [0, computeMaxPrice(properties)],
    areaSize: [0, computeMaxArea(properties)],
    minBedrooms: "",
    district: [],
  }));

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [hoveredPropertyId, setHoveredPropertyId] = useState<number | null>(null);

  const handleToggleFavorite = (property: Property, event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    if (isFavorite(property.id)) {
      removeFavorite(property.id);
    } else {
      const success = addFavorite(property);
      if (!success && !isFavorite(property.id)) {
        alert('คุณสามารถเลือกได้สูงสุด 3 บ้านเท่านั้น เพื่อนำไป Compare กัน');
      }
    }
  };

  const developmentTypeOptions = useMemo(
    () => Array.from(new Set(properties.map((p) => p.propertyType).filter(Boolean))) as string[],
    [properties],
  );

  const districtOptions = useMemo(
    () => Array.from(new Set(properties.map((p) => getDistrict(p.location)).filter(Boolean))),
    [properties],
  );

  const filteredProperties = useMemo(() => {
    return properties.filter((property) => {
      if (
        filters.searchKeyword &&
        !property.title.toLowerCase().includes(filters.searchKeyword.toLowerCase()) &&
        !property.location.toLowerCase().includes(filters.searchKeyword.toLowerCase())
      ) return false;
      if (filters.areaType.length > 0 && !filters.areaType.includes(property.category ?? "")) return false;
      if (filters.listingType.length > 0 && !filters.listingType.includes(property.type)) return false;
      if (filters.developmentType.length > 0 && !filters.developmentType.includes(property.propertyType ?? "")) return false;
      if (property.price < filters.priceRange[0] || property.price > filters.priceRange[1]) return false;
      if (property.size !== undefined) {
        if (property.size < filters.areaSize[0] || property.size > filters.areaSize[1]) return false;
      }
      if (filters.minBedrooms) {
        const bedrooms = property.bedrooms ?? 0;
        if (bedrooms < parseInt(filters.minBedrooms, 10)) return false;
      }
      if (filters.district.length > 0) {
        const propertyDistrict = getDistrict(property.location);
        if (!filters.district.includes(propertyDistrict)) return false;
      }
      return true;
    });
  }, [properties, filters]);

  const activeFilters = useMemo(() => {
    let count = 0;
    if (filters.searchKeyword.trim()) count += 1;
    count += filters.areaType.length;
    count += filters.listingType.length;
    count += filters.developmentType.length;
    count += filters.district.length;
    if (filters.minBedrooms) count += 1;
    if (filters.priceRange[0] > 0 || filters.priceRange[1] < maxPrice) count += 1;
    if (filters.areaSize[0] > 0 || filters.areaSize[1] < maxArea) count += 1;
    return count;
  }, [filters, maxPrice, maxArea]);

  const handleFilterChange = (filterType: keyof Filters, value: Filters[keyof Filters]) => {
    setFilters((prev) => ({ ...prev, [filterType]: value }));
  };

  const toggleArrayFilter = (
    filterType: "areaType" | "listingType" | "developmentType" | "district",
    value: string,
  ) => {
    setFilters((prev) => ({
      ...prev,
      [filterType]: prev[filterType].includes(value)
        ? prev[filterType].filter((item) => item !== value)
        : [...prev[filterType], value],
    }));
  };

  const clearFilters = () => {
    setFilters({
      searchKeyword: "",
      areaType: [],
      listingType: [],
      developmentType: [],
      priceRange: [0, maxPrice],
      areaSize: [0, maxArea],
      minBedrooms: "",
      district: [],
    });
  };

  const handlePropertyNavigate = (property: Property, event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    router.push(`/property/${property.id}`);
  };

  return (
    <div className="min-h-screen bg-white text-[#0a0a0a]">

      <About />
      <OurExperience />
      <ParallaxImageSection />

      <section id="properties" className="relative bg-white py-16 md:py-20">
        <div className="absolute inset-x-0 top-0 h-px bg-[#e8e8e8]" />

        <div className="relative mx-auto max-w-[1720px] px-3 md:px-5">
          <div className="relative bg-white">
            <div className="relative">
              {/* Empty state */}
              {filteredProperties.length === 0 ? (
                <div className="rounded-[30px] border border-[#ececec] bg-white p-12 text-center shadow-[0_20px_60px_-52px_rgba(15,23,42,0.18)]">
                  <h3 className="text-xl font-semibold text-[#0a0a0a]">ไม่พบอสังหาริมทรัพย์ตามเงื่อนไข</h3>
                  <p className="mt-2 text-[#666]">ลองปรับช่วงราคา ประเภท หรือเขตใหม่</p>
                  <button
                    type="button"
                    onClick={clearFilters}
                    className="mt-5 rounded-full bg-[#0a0a0a] px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-[#1a40b6]"
                  >
                    ล้างตัวกรอง
                  </button>
                </div>
              ) : (
                <div>
                  <div className="mb-3 flex items-center justify-between text-[11px] uppercase tracking-[0.2em] text-[#bbb]">
                    <span>Featured Projects</span>
                    <span>รายการทั้งหมด {filteredProperties.length} รายการ</span>
                  </div>
                  <div className="bg-white">
                    <div className="grid gap-10 py-5 md:py-8 lg:grid-cols-[0.38fr_0.62fr] lg:gap-14">
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
                        <div className="mt-7 flex flex-wrap items-center gap-3">
                          <Link
                            href="#properties-list"
                            className="inline-flex items-center gap-3 bg-[#0f1214] px-7 py-4 text-[12px] font-semibold uppercase tracking-[0.22em] text-white transition hover:bg-[#20262b]"
                          >
                            <span style={{ fontFamily: "monospace" }}>↳</span>
                            VIEW PROJECTS
                          </Link>
                          <button
                            type="button"
                            onClick={() => setIsFilterOpen((prev) => !prev)}
                            className="inline-flex items-center gap-3 border border-[#171717] px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.24em] text-[#171717] transition hover:bg-[#171717] hover:text-white"
                          >
                            <span className="inline-block h-[1px] w-4 bg-current" />
                            ตัวกรองขั้นสูง
                            <span className="text-[10px] text-current/60">{activeFilters}</span>
                          </button>
                        </div>
                      </div>
                    </div>

                    <div
                      className={`overflow-hidden transition-all duration-500 ${
                        isFilterOpen ? "mt-8 max-h-[720px] opacity-100" : "mt-0 max-h-0 opacity-0"
                      }`}
                    >
                      <div className="border-y border-[#ddd8d2] bg-white py-5">
                        <div className="mb-4 flex flex-col items-start justify-between gap-3 md:flex-row md:items-center">
                          <div>
                            <h3 className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#0a0a0a]">
                              Advanced Filters
                            </h3>
                            <p className="mt-1 text-xs text-[#8f8881]">ปรับเงื่อนไขเพื่อคัดบ้านที่ใกล้เคียงความต้องการ</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={clearFilters}
                              className="border border-[#d8d2ca] px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#666] transition hover:border-[#171717] hover:text-[#0a0a0a]"
                            >
                              ล้างตัวกรอง
                            </button>
                            <button
                              type="button"
                              onClick={() => setIsFilterOpen(false)}
                              className="border border-[#171717] px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#171717] transition hover:bg-[#171717] hover:text-white"
                            >
                              ปิด
                            </button>
                          </div>
                        </div>
                        <HorizontalFilterControls
                          filters={filters}
                          maxPrice={maxPrice}
                          maxArea={maxArea}
                          developmentTypeOptions={developmentTypeOptions}
                          districtOptions={districtOptions}
                          handleFilterChange={handleFilterChange}
                          toggleArrayFilter={toggleArrayFilter}
                        />
                      </div>
                    </div>

                    <div id="properties-list" className="mt-[4.5rem] border-t border-[#8f877d]" />

                    {/* Preload property images to avoid flash on first hover */}
                    <div aria-hidden="true" className="pointer-events-none fixed top-0 overflow-hidden" style={{ left: -9999 }}>
                      {filteredProperties.map((property) =>
                        property.image ? (
                          <Image key={property.id} src={property.image} alt="" width={282} height={156} />
                        ) : null
                      )}
                    </div>

                    <div className="relative bg-white">
                      {filteredProperties.map((property, idx) => {
                        const isHovered = hoveredPropertyId === property.id;
                        const favorite = hasHydrated && isFavorite(property.id);

                        return (
                          <motion.div
                            key={property.id}
                            initial={{ opacity: 0, y: 18 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.45, delay: idx * 0.04, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
                            viewport={{ once: true, margin: "-40px" }}
                            className="relative"
                          >
                            <Link
                              href={`/property/${property.id}`}
                              onClick={(event) => handlePropertyNavigate(property, event)}
                              onMouseEnter={() => setHoveredPropertyId(property.id)}
                              onFocus={() => setHoveredPropertyId(property.id)}
                              onMouseLeave={() => setHoveredPropertyId((current) => (current === property.id ? null : current))}
                              onBlur={() => setHoveredPropertyId((current) => (current === property.id ? null : current))}
                              className="group relative grid items-center gap-3 border-b border-[#8f877d] bg-white px-1 py-3 transition-colors duration-300 md:px-2 lg:grid-cols-[1fr_auto_42px]"
                            >
                              <div className="min-w-0 lg:pr-8">
                                <div className="flex items-center gap-2">
                                  <h3 className="truncate text-[1.28rem] font-light tracking-[-0.035em] text-[#49443f] transition-colors duration-300 group-hover:text-[#171717] md:text-[1.4rem]">
                                    {property.title}
                                  </h3>
                                  <button
                                    onClick={(event) => handleToggleFavorite(property, event)}
                                    className={`inline-flex h-8 w-8 items-center justify-center rounded-full border transition lg:hidden ${
                                      favorite
                                        ? 'border-red-500 bg-red-500 text-white'
                                        : 'border-[#8f877d] bg-white text-[#2a2724] hover:border-[#171717]'
                                    }`}
                                    aria-label={favorite ? 'ลบจากรายการโปรด' : 'เพิ่มในรายการโปรด'}
                                  >
                                    <svg
                                      className="h-3 w-3"
                                      fill={favorite ? 'currentColor' : 'none'}
                                      viewBox="0 0 24 24"
                                      stroke="currentColor"
                                      strokeWidth="2"
                                    >
                                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                    </svg>
                                  </button>
                                </div>
                                <p className="mt-1 truncate text-[0.8rem] text-[#625c56] md:text-[0.84rem]">
                                  {property.location}
                                </p>
                                <div className="mt-2 flex flex-wrap gap-1.5 lg:hidden">
                                  {buildPropertyTags(property).map((tag) => (
                                    <InlinePill key={`${property.id}-${tag}`} label={tag} />
                                  ))}
                                </div>
                              </div>

                              {/* Hover image — centered in the row */}
                              <AnimatePresence mode="wait">
                                {isHovered && property.image ? (
                                  <PropertyImagePreview
                                    key={`preview-${property.id}`}
                                    src={property.image}
                                    alt={property.title}
                                  />
                                ) : null}
                              </AnimatePresence>

                              <div className="relative hidden min-h-[54px] items-center lg:flex">
                                <div className="flex flex-nowrap items-center gap-1.5">
                                  {buildPropertyTags(property).map((tag) => (
                                    <InlinePill key={`${property.id}-${tag}`} label={tag} />
                                  ))}
                                </div>
                              </div>

                              <div className="hidden items-center justify-end gap-3 text-[#6b645c] transition-transform duration-300 group-hover:translate-x-1 group-hover:text-[#171717] lg:flex">
                                <button
                                  type="button"
                                  onClick={(event) => handleToggleFavorite(property, event)}
                                  className={`inline-flex h-8 w-8 items-center justify-center rounded-full border transition ${
                                    favorite
                                      ? 'border-red-500 bg-red-500 text-white'
                                      : 'border-[#8f877d] bg-white text-[#2a2724] hover:border-[#171717]'
                                  }`}
                                  aria-label={favorite ? 'ลบจากรายการโปรด' : 'เพิ่มในรายการโปรด'}
                                >
                                  <svg
                                    className="h-3 w-3"
                                    fill={favorite ? 'currentColor' : 'none'}
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                  >
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                  </svg>
                                </button>
                                <svg className="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.6">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M13 5l7 7-7 7" />
                                </svg>
                              </div>
                            </Link>
                          </motion.div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function buildPropertyTags(property: Property) {
  return [
    property.type === "เช่า" ? "RENTAL" : "FOR SALE",
    property.propertyType?.toUpperCase(),
    property.size ? `${property.size} SQ.M.` : undefined,
    property.bedrooms ? `${property.bedrooms} BEDROOMS` : undefined,
    buildPriceLabel(property),
  ].filter(Boolean) as string[];
}

function PropertyImagePreview({ src, alt }: { src: string; alt: string }) {
  const [loaded, setLoaded] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97, y: 8 }}
      animate={{ opacity: loaded ? 1 : 0, scale: loaded ? 1 : 0.97, y: loaded ? 0 : 8 }}
      exit={{ opacity: 0, scale: 0.985, y: 4 }}
      transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
      className="absolute left-1/2 top-1/2 z-10 h-40 w-70 -translate-x-1/2 -translate-y-1/2 overflow-hidden shadow-[0_22px_60px_-20px_rgba(0,0,0,0.22)] pointer-events-none"
    >
      <Image
        src={src}
        alt={alt}
        fill
        className="object-cover"
        onLoad={() => setLoaded(true)}
      />
    </motion.div>
  );
}

function InlinePill({ label }: { label: string }) {
  return (
    <span className="rounded-full border border-[#8f877d] px-2.5 py-1 text-[9px] font-medium uppercase tracking-[0.18em] text-[#625c56]">
      {label}
    </span>
  );
}

function DualRangeSlider({
  min,
  max,
  step,
  value,
  onChange,
}: {
  min: number;
  max: number;
  step: number;
  value: [number, number];
  onChange: (value: [number, number]) => void;
}) {
  const range = max - min || 1;
  const minPct = ((value[0] - min) / range) * 100;
  const maxPct = ((value[1] - min) / range) * 100;
  const thumbCls = "dual-range absolute w-full h-1";
  return (
    <div className="relative flex h-6 items-center">
      <div className="absolute left-0 right-0 h-[2px] rounded-full bg-[#e0dbd4]">
        <div
          className="absolute h-full rounded-full bg-[#0a0a0a]"
          style={{ left: `${minPct}%`, right: `${100 - maxPct}%` }}
        />
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value[0]}
        onChange={(e) => {
          const v = Math.min(parseInt(e.target.value, 10), value[1] - step);
          onChange([v, value[1]]);
        }}
        className={thumbCls}
        style={{ zIndex: value[0] > (max + min) / 2 ? 5 : 3 }}
      />
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value[1]}
        onChange={(e) => {
          const v = Math.max(parseInt(e.target.value, 10), value[0] + step);
          onChange([value[0], v]);
        }}
        className={thumbCls}
        style={{ zIndex: value[1] < (max + min) / 2 ? 5 : 4 }}
      />
    </div>
  );
}

function HorizontalFilterControls({
  filters,
  maxPrice,
  maxArea,
  developmentTypeOptions,
  districtOptions,
  handleFilterChange,
  toggleArrayFilter,
}: FilterControlsProps) {
  const [priceMin, setPriceMin] = useState(String(filters.priceRange[0]));
  const [priceMax, setPriceMax] = useState(String(filters.priceRange[1]));
  const [areaMin, setAreaMin] = useState(String(filters.areaSize[0]));
  const [areaMax, setAreaMax] = useState(String(filters.areaSize[1]));

  const onSliderPrice = (v: [number, number]) => {
    handleFilterChange("priceRange", v);
    setPriceMin(String(v[0]));
    setPriceMax(String(v[1]));
  };

  const onSliderArea = (v: [number, number]) => {
    handleFilterChange("areaSize", v);
    setAreaMin(String(v[0]));
    setAreaMax(String(v[1]));
  };

  const commitPrice = () => {
    const lo = Math.max(0, parseInt(priceMin, 10) || 0);
    const hi = Math.min(maxPrice, parseInt(priceMax, 10) || maxPrice);
    const sorted: [number, number] = [Math.min(lo, hi), Math.max(lo, hi)];
    handleFilterChange("priceRange", sorted);
    setPriceMin(String(sorted[0]));
    setPriceMax(String(sorted[1]));
  };

  const commitArea = () => {
    const lo = Math.max(0, parseInt(areaMin, 10) || 0);
    const hi = Math.min(maxArea, parseInt(areaMax, 10) || maxArea);
    const sorted: [number, number] = [Math.min(lo, hi), Math.max(lo, hi)];
    handleFilterChange("areaSize", sorted);
    setAreaMin(String(sorted[0]));
    setAreaMax(String(sorted[1]));
  };

  return (
    <div className="space-y-5">
      {/* Row 1: Listing type + Development type + Bedrooms */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
        <div>
          <p className="mb-2.5 text-[10px] font-semibold uppercase tracking-[0.22em] text-[#999]">ประเภทประกาศ</p>
          <div className="flex flex-wrap gap-1.5">
            {LISTING_TYPES.map((type) => {
              const active = filters.listingType.includes(type);
              return (
                <button
                  key={type}
                  type="button"
                  onClick={() => toggleArrayFilter("listingType", type)}
                  className={`rounded-full border px-4 py-1.5 text-[11px] font-semibold transition-all duration-150 ${
                    active
                      ? "border-[#0a0a0a] bg-[#0a0a0a] text-white"
                      : "border-[#d8d2ca] bg-white text-[#555] hover:border-[#0a0a0a] hover:text-[#0a0a0a]"
                  }`}
                >
                  {type}
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <p className="mb-2.5 text-[10px] font-semibold uppercase tracking-[0.22em] text-[#999]">ประเภทการพัฒนา</p>
          <div className="flex flex-wrap gap-1.5">
            {developmentTypeOptions.map((type) => {
              const active = filters.developmentType.includes(type);
              return (
                <button
                  key={type}
                  type="button"
                  onClick={() => toggleArrayFilter("developmentType", type)}
                  className={`rounded-full border px-4 py-1.5 text-[11px] font-semibold transition-all duration-150 ${
                    active
                      ? "border-[#0a0a0a] bg-[#0a0a0a] text-white"
                      : "border-[#d8d2ca] bg-white text-[#555] hover:border-[#0a0a0a] hover:text-[#0a0a0a]"
                  }`}
                >
                  {type}
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <p className="mb-2.5 text-[10px] font-semibold uppercase tracking-[0.22em] text-[#999]">ห้องนอนขั้นต่ำ</p>
          <div className="flex gap-1.5">
            {["", "1", "2", "3", "4", "5"].map((val) => {
              const active = filters.minBedrooms === val;
              return (
                <button
                  key={val || "any"}
                  type="button"
                  onClick={() => handleFilterChange("minBedrooms", val)}
                  className={`rounded-full border px-3 py-1.5 text-[11px] font-semibold transition-all duration-150 ${
                    active
                      ? "border-[#0a0a0a] bg-[#0a0a0a] text-white"
                      : "border-[#d8d2ca] bg-white text-[#555] hover:border-[#0a0a0a] hover:text-[#0a0a0a]"
                  }`}
                >
                  {val ? `${val}+` : "ทั้งหมด"}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Row 2: Price + Area */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div>
          <div className="mb-3 flex items-baseline justify-between">
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#999]">ราคา (บาท)</p>
            <span className="text-[11px] text-[#555]">
              {formatPrice(filters.priceRange[0])} – {formatPrice(filters.priceRange[1])}
            </span>
          </div>
          <DualRangeSlider
            min={0}
            max={maxPrice}
            step={Math.max(100000, Math.round(maxPrice / 500) * 1000)}
            value={filters.priceRange}
            onChange={onSliderPrice}
          />
          <div className="mt-3 grid grid-cols-2 gap-2">
            <input
              type="text"
              inputMode="numeric"
              placeholder="ต่ำสุด"
              value={priceMin}
              onChange={(e) => setPriceMin(e.target.value)}
              onBlur={commitPrice}
              onKeyDown={(e) => e.key === "Enter" && commitPrice()}
              className="h-9 w-full rounded border border-[#d8d2ca] bg-white px-3 text-[12px] text-[#0a0a0a] outline-none transition focus:border-[#0a0a0a] placeholder:text-[#bbb]"
            />
            <input
              type="text"
              inputMode="numeric"
              placeholder="สูงสุด"
              value={priceMax}
              onChange={(e) => setPriceMax(e.target.value)}
              onBlur={commitPrice}
              onKeyDown={(e) => e.key === "Enter" && commitPrice()}
              className="h-9 w-full rounded border border-[#d8d2ca] bg-white px-3 text-[12px] text-[#0a0a0a] outline-none transition focus:border-[#0a0a0a] placeholder:text-[#bbb]"
            />
          </div>
        </div>

        <div>
          <div className="mb-3 flex items-baseline justify-between">
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#999]">พื้นที่ (ตร.ม.)</p>
            <span className="text-[11px] text-[#555]">
              {filters.areaSize[0]} – {filters.areaSize[1]} ตร.ม.
            </span>
          </div>
          <DualRangeSlider
            min={0}
            max={maxArea}
            step={10}
            value={filters.areaSize}
            onChange={onSliderArea}
          />
          <div className="mt-3 grid grid-cols-2 gap-2">
            <input
              type="text"
              inputMode="numeric"
              placeholder="ต่ำสุด"
              value={areaMin}
              onChange={(e) => setAreaMin(e.target.value)}
              onBlur={commitArea}
              onKeyDown={(e) => e.key === "Enter" && commitArea()}
              className="h-9 w-full rounded border border-[#d8d2ca] bg-white px-3 text-[12px] text-[#0a0a0a] outline-none transition focus:border-[#0a0a0a] placeholder:text-[#bbb]"
            />
            <input
              type="text"
              inputMode="numeric"
              placeholder="สูงสุด"
              value={areaMax}
              onChange={(e) => setAreaMax(e.target.value)}
              onBlur={commitArea}
              onKeyDown={(e) => e.key === "Enter" && commitArea()}
              className="h-9 w-full rounded border border-[#d8d2ca] bg-white px-3 text-[12px] text-[#0a0a0a] outline-none transition focus:border-[#0a0a0a] placeholder:text-[#bbb]"
            />
          </div>
        </div>
      </div>

      {/* Row 3: District */}
      <div>
        <p className="mb-2.5 text-[10px] font-semibold uppercase tracking-[0.22em] text-[#999]">เขต / อำเภอ</p>
        <div className="flex flex-wrap gap-1.5">
          {districtOptions.map((district) => {
            const active = filters.district.includes(district);
            return (
              <button
                key={district}
                type="button"
                onClick={() => toggleArrayFilter("district", district)}
                className={`rounded-full border px-4 py-1.5 text-[11px] font-medium transition-all duration-150 ${
                  active
                    ? "border-[#0a0a0a] bg-[#0a0a0a] text-white"
                    : "border-[#d8d2ca] bg-white text-[#555] hover:border-[#0a0a0a] hover:text-[#0a0a0a]"
                }`}
              >
                {district}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
