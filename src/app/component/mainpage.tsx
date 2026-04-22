'use client';

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";

import { buildPriceLabel, getDistrict } from "@/lib/property-format";
import { LISTING_TYPES, type Property } from "@/types/property";
import { useFavoritesStore } from "@/lib/favorites-store";
import About from "./about";
import OurExperience from "./OurExperience";
import ParallaxImageSection from "./ParallaxImageSection";

type MainPageProps = {
  properties: Property[];
};

export type Filters = {
  searchKeyword: string;
  areaType: string[];
  listingType: string[];
  developmentType: string[];
  priceRange: [number, number];
  areaSize: [number, number];
  minBedrooms: string;
  district: string[];
  highlights: string[];
  proximitySchool: number | null;
  proximityHospital: number | null;
  proximityBTS: number | null;
  proximityMRT: number | null;
};

type FilterControlsProps = {
  filters: Filters;
  highlightOptions: string[];
  developmentTypeOptions: string[];
  districtOptions: string[];
  handleFilterChange: (filterType: keyof Filters, value: Filters[keyof Filters]) => void;
  toggleArrayFilter: (filterType: "areaType" | "listingType" | "developmentType" | "district" | "highlights", value: string) => void;
};

export const EMPTY_FILTERS: Filters = {
  searchKeyword: "",
  areaType: [],
  listingType: [],
  developmentType: [],
  priceRange: [0, 0],
  areaSize: [0, 0],
  minBedrooms: "",
  district: [],
  highlights: [],
  proximitySchool: null,
  proximityHospital: null,
  proximityBTS: null,
  proximityMRT: null,
};

export function applyFilters(properties: Property[], filters: Filters): Property[] {
  return properties.filter((property) => {
    if (
      filters.searchKeyword &&
      !property.title.toLowerCase().includes(filters.searchKeyword.toLowerCase()) &&
      !property.location.toLowerCase().includes(filters.searchKeyword.toLowerCase())
    ) return false;
    if (filters.areaType.length > 0 && !filters.areaType.includes(property.category ?? "")) return false;
    if (filters.listingType.length > 0 && !filters.listingType.includes(property.type)) return false;
    if (filters.developmentType.length > 0 && !filters.developmentType.includes(property.propertyType ?? "")) return false;
    if (filters.priceRange[0] > 0 && property.price < filters.priceRange[0]) return false;
    if (filters.priceRange[1] > 0 && property.price > filters.priceRange[1]) return false;
    if (filters.areaSize[0] > 0 && (property.size ?? 0) < filters.areaSize[0]) return false;
    if (filters.areaSize[1] > 0 && (property.size ?? 0) > filters.areaSize[1]) return false;
    if (filters.highlights.length > 0) {
      const propFeatures = property.features ?? [];
      if (!filters.highlights.every((h) => propFeatures.includes(h))) return false;
    }
    if (filters.minBedrooms) {
      const bedrooms = property.bedrooms ?? 0;
      if (bedrooms < parseInt(filters.minBedrooms, 10)) return false;
    }
    if (filters.district.length > 0) {
      const propertyDistrict = getDistrict(property.location);
      if (!filters.district.includes(propertyDistrict)) return false;
    }
    if (filters.proximitySchool !== null) {
      if (property.nearbySchoolMeters == null || property.nearbySchoolMeters > filters.proximitySchool) return false;
    }
    if (filters.proximityHospital !== null) {
      if (property.nearbyHospitalMeters == null || property.nearbyHospitalMeters > filters.proximityHospital) return false;
    }
    if (filters.proximityBTS !== null) {
      if (property.nearbyBTSMeters == null || property.nearbyBTSMeters > filters.proximityBTS) return false;
    }
    if (filters.proximityMRT !== null) {
      if (property.nearbyMRTMeters == null || property.nearbyMRTMeters > filters.proximityMRT) return false;
    }
    return true;
  });
}

export default function MainPage({ properties }: MainPageProps) {
  const router = useRouter();
  const { addFavorite, removeFavorite, isFavorite, hasHydrated } = useFavoritesStore();

  useEffect(() => {
    if (!window.location.hash) {
      window.scrollTo(0, 0);
    }
  }, []);

  const [filters, setFilters] = useState<Filters>(() => ({ ...EMPTY_FILTERS }));

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [hoveredPropertyId, setHoveredPropertyId] = useState<number | null>(null);

  const handleToggleFavorite = (property: Property, event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    if (isFavorite(property.id)) {
      removeFavorite(property.id);
    } else {
      addFavorite(property);
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

  const filteredProperties = useMemo(() => applyFilters(properties, filters), [properties, filters]);


  const handleFilterChange = (filterType: keyof Filters, value: Filters[keyof Filters]) => {
    setFilters((prev) => ({ ...prev, [filterType]: value }));
  };

  const toggleArrayFilter = (
    filterType: "areaType" | "listingType" | "developmentType" | "district" | "highlights",
    value: string,
  ) => {
    setFilters((prev) => ({
      ...prev,
      [filterType]: prev[filterType].includes(value)
        ? prev[filterType].filter((item) => item !== value)
        : [...prev[filterType], value],
    }));
  };

  const highlightOptions = useMemo(
    () => Array.from(new Set(properties.flatMap((p) => p.features ?? []))).sort(),
    [properties],
  );

  const clearFilters = () => setFilters({ ...EMPTY_FILTERS });

  const handleCompare = () => {
    const params = new URLSearchParams();
    if (filters.searchKeyword) params.set("q", filters.searchKeyword);
    if (filters.listingType.length) params.set("listing", filters.listingType.join(","));
    if (filters.developmentType.length) params.set("devType", filters.developmentType.join(","));
    if (filters.district.length) params.set("district", filters.district.join(","));
    if (filters.highlights.length) params.set("highlights", filters.highlights.join(","));
    if (filters.minBedrooms) params.set("beds", filters.minBedrooms);
    if (filters.priceRange[0] > 0) params.set("priceMin", String(filters.priceRange[0]));
    if (filters.priceRange[1] > 0) params.set("priceMax", String(filters.priceRange[1]));
    if (filters.areaSize[0] > 0) params.set("areaMin", String(filters.areaSize[0]));
    if (filters.areaSize[1] > 0) params.set("areaMax", String(filters.areaSize[1]));
    if (filters.proximitySchool !== null) params.set("school", String(filters.proximitySchool));
    if (filters.proximityHospital !== null) params.set("hospital", String(filters.proximityHospital));
    if (filters.proximityBTS !== null) params.set("bts", String(filters.proximityBTS));
    if (filters.proximityMRT !== null) params.set("mrt", String(filters.proximityMRT));
    const qs = params.toString();
    router.push(qs ? `/compare?${qs}` : "/compare");
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
                          <Link
                            href="/compare"
                            className="inline-flex items-center gap-3 border border-[#171717] px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.24em] text-[#171717] transition hover:bg-[#171717] hover:text-white"
                          >
                            <span className="inline-block h-[1px] w-4 bg-current" />
                            เครื่องมือช่วยตัดสินใจ
                          </Link>
                        </div>
                      </div>
                    </div>

                    <div
                      className={`overflow-hidden transition-all duration-500 ${
                        isFilterOpen ? "mt-8 max-h-[900px] opacity-100" : "mt-0 max-h-0 opacity-0"
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
                              onClick={handleCompare}
                              className="border border-[#1a40b6] bg-[#1a40b6] px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-white transition hover:bg-[#1536a0]"
                            >
                              Compare ({filteredProperties.length})
                            </button>
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
                          highlightOptions={highlightOptions}
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

const PROXIMITY_OPTIONS = [
  { value: 500, label: "500 ม." },
  { value: 1000, label: "1 กม." },
  { value: 2000, label: "2 กม." },
  { value: 5000, label: "5 กม." },
];

function HorizontalFilterControls({
  filters,
  highlightOptions,
  developmentTypeOptions,
  districtOptions,
  handleFilterChange,
  toggleArrayFilter,
}: FilterControlsProps) {
  const chipCls = (active: boolean) =>
    `rounded-full border px-4 py-1.5 text-[11px] font-semibold transition-all duration-150 ${
      active
        ? "border-[#0a0a0a] bg-[#0a0a0a] text-white"
        : "border-[#d8d2ca] bg-white text-[#555] hover:border-[#0a0a0a] hover:text-[#0a0a0a]"
    }`;
  const inputCls = "h-9 w-full rounded border border-[#d8d2ca] bg-white px-3 text-[12px] text-[#0a0a0a] outline-none transition focus:border-[#0a0a0a] placeholder:text-[#bbb]";
  const labelCls = "mb-2.5 text-[10px] font-semibold uppercase tracking-[0.22em] text-[#999]";

  const commitPrice = (lo: string, hi: string) => {
    const min = Math.max(0, parseInt(lo, 10) || 0);
    const max = Math.max(0, parseInt(hi, 10) || 0);
    handleFilterChange("priceRange", [min, max] as [number, number]);
  };

  const commitArea = (lo: string, hi: string) => {
    const min = Math.max(0, parseInt(lo, 10) || 0);
    const max = Math.max(0, parseInt(hi, 10) || 0);
    handleFilterChange("areaSize", [min, max] as [number, number]);
  };

  const [priceMin, setPriceMin] = useState(filters.priceRange[0] > 0 ? String(filters.priceRange[0]) : "");
  const [priceMax, setPriceMax] = useState(filters.priceRange[1] > 0 ? String(filters.priceRange[1]) : "");
  const [areaMin, setAreaMin] = useState(filters.areaSize[0] > 0 ? String(filters.areaSize[0]) : "");
  const [areaMax, setAreaMax] = useState(filters.areaSize[1] > 0 ? String(filters.areaSize[1]) : "");

  const toggleProximity = (key: "proximitySchool" | "proximityHospital" | "proximityBTS" | "proximityMRT", val: number) => {
    handleFilterChange(key, filters[key] === val ? null : val);
  };

  return (
    <div className="space-y-5">
      {/* Row 1: Listing type + Development type + Bedrooms */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
        <div>
          <p className={labelCls}>ประเภทประกาศ</p>
          <div className="flex flex-wrap gap-1.5">
            {LISTING_TYPES.map((type) => (
              <button key={type} type="button" onClick={() => toggleArrayFilter("listingType", type)} className={chipCls(filters.listingType.includes(type))}>
                {type}
              </button>
            ))}
          </div>
        </div>
        <div>
          <p className={labelCls}>ประเภทการพัฒนา</p>
          <div className="flex flex-wrap gap-1.5">
            {developmentTypeOptions.map((type) => (
              <button key={type} type="button" onClick={() => toggleArrayFilter("developmentType", type)} className={chipCls(filters.developmentType.includes(type))}>
                {type}
              </button>
            ))}
          </div>
        </div>
        <div>
          <p className={labelCls}>ห้องนอนขั้นต่ำ</p>
          <div className="flex gap-1.5">
            {["", "1", "2", "3", "4", "5"].map((val) => (
              <button key={val || "any"} type="button" onClick={() => handleFilterChange("minBedrooms", val)} className={chipCls(filters.minBedrooms === val)}>
                {val ? `${val}+` : "ทั้งหมด"}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Row 2: Price + Area */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div>
          <p className={labelCls}>ราคา (บาท)</p>
          <div className="mt-2 grid grid-cols-2 gap-2">
            <input
              type="text" inputMode="numeric" placeholder="ต่ำสุด (บาท)"
              value={priceMin}
              onChange={(e) => setPriceMin(e.target.value)}
              onBlur={() => commitPrice(priceMin, priceMax)}
              onKeyDown={(e) => e.key === "Enter" && commitPrice(priceMin, priceMax)}
              className={inputCls}
            />
            <input
              type="text" inputMode="numeric" placeholder="สูงสุด (บาท)"
              value={priceMax}
              onChange={(e) => setPriceMax(e.target.value)}
              onBlur={() => commitPrice(priceMin, priceMax)}
              onKeyDown={(e) => e.key === "Enter" && commitPrice(priceMin, priceMax)}
              className={inputCls}
            />
          </div>
        </div>
        <div>
          <p className={labelCls}>พื้นที่ (ตร.ม.)</p>
          <div className="mt-2 grid grid-cols-2 gap-2">
            <input
              type="text" inputMode="numeric" placeholder="ต่ำสุด (ตร.ม.)"
              value={areaMin}
              onChange={(e) => setAreaMin(e.target.value)}
              onBlur={() => commitArea(areaMin, areaMax)}
              onKeyDown={(e) => e.key === "Enter" && commitArea(areaMin, areaMax)}
              className={inputCls}
            />
            <input
              type="text" inputMode="numeric" placeholder="สูงสุด (ตร.ม.)"
              value={areaMax}
              onChange={(e) => setAreaMax(e.target.value)}
              onBlur={() => commitArea(areaMin, areaMax)}
              onKeyDown={(e) => e.key === "Enter" && commitArea(areaMin, areaMax)}
              className={inputCls}
            />
          </div>
        </div>
      </div>

      {/* Row 3: District */}
      <div>
        <p className={labelCls}>เขต / อำเภอ</p>
        <div className="flex flex-wrap gap-1.5">
          {districtOptions.map((district) => (
            <button key={district} type="button" onClick={() => toggleArrayFilter("district", district)} className={chipCls(filters.district.includes(district))}>
              {district}
            </button>
          ))}
        </div>
      </div>

      {/* Row 4: Highlights */}
      {highlightOptions.length > 0 && (
        <div>
          <p className={labelCls}>จุดเด่น</p>
          <div className="flex flex-wrap gap-1.5">
            {highlightOptions.map((h) => (
              <button key={h} type="button" onClick={() => toggleArrayFilter("highlights", h)} className={chipCls(filters.highlights.includes(h))}>
                {h}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Row 5: Proximity filters */}
      <div>
        <p className={labelCls}>ทำเลใกล้</p>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {([
            { key: "proximitySchool" as const, label: "🏫 ใกล้โรงเรียน" },
            { key: "proximityHospital" as const, label: "🏥 ใกล้โรงพยาบาล" },
            { key: "proximityBTS" as const, label: "🚈 ใกล้ BTS" },
            { key: "proximityMRT" as const, label: "🚇 ใกล้ MRT" },
          ]).map(({ key, label }) => (
            <div key={key}>
              <p className="mb-1.5 text-[10px] font-medium text-[#555]">{label}</p>
              <div className="flex flex-wrap gap-1">
                {PROXIMITY_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => toggleProximity(key, opt.value)}
                    className={chipCls(filters[key] === opt.value)}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
